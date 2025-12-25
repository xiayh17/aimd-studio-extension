"""
🌌 星际联邦生物实验协议 - Assigner 定义

配合 protocol.aimd 使用，实现自动计算逻辑。
"""

from airalogy.assigner import assigner, AssignerResult, DefaultAssigner
from airalogy.models import CheckValue


# ============================================================
# 自动计算：时空抑制率
# ============================================================

@assigner(
    assigned_fields=["inhibition_results"],
    dependent_fields=["blank_qr_mean", "control_qr_mean", "quantum_measurements"],
    mode="auto",
)
def calculate_inhibition_rates(dep: dict) -> AssignerResult:
    """
    根据量子共振测量数据自动计算各能量等级的抑制率
    
    公式: 抑制率 (%) = [1 - (处理组QR - 空白QR) / (对照组QR - 空白QR)] × 100%
    """
    blank = dep.get("blank_qr_mean") or 0
    control = dep.get("control_qr_mean") or 1
    measurements = dep.get("quantum_measurements") or []
    
    if not measurements:
        return AssignerResult(
            success=False,
            error_message="缺少量子共振测量数据"
        )
    
    # 按能量等级分组计算
    energy_groups: dict[float, list[float]] = {}
    for m in measurements:
        if m.get("group_type") == "处理组":
            energy = m.get("energy_level", 0)
            qr = m.get("quantum_resonance", 0)
            if energy not in energy_groups:
                energy_groups[energy] = []
            energy_groups[energy].append(qr)
    
    results = []
    for energy_level, qr_values in sorted(energy_groups.items(), reverse=True):
        treatment_qr_mean = sum(qr_values) / len(qr_values) if qr_values else 0
        
        # 计算抑制率
        if control - blank != 0:
            rate = (1 - (treatment_qr_mean - blank) / (control - blank)) * 100
            rate = max(0, min(100, rate))  # 限制在 0-100%
        else:
            rate = 0
        
        # 评估置信度
        if rate > 70:
            confidence = "高"
        elif rate > 30:
            confidence = "中"
        else:
            confidence = "低"
        
        results.append({
            "energy_level": energy_level,
            "treatment_qr_mean": round(treatment_qr_mean, 4),
            "inhibition_rate": round(rate, 2),
            "dimension_correction": 1.0,
            "confidence_level": confidence,
            "notes": ""
        })
    
    return AssignerResult(assigned_fields={"inhibition_results": results})


# ============================================================
# 自动校验：维度稳定性检查
# ============================================================

@assigner(
    assigned_fields=["dimension_stability_check"],
    dependent_fields=["stability_field"],
    mode="auto",
)
def check_dimension_stability(dep: dict) -> AssignerResult:
    """检查维度稳定场强度是否满足实验要求 (≥95%)"""
    stability = dep.get("stability_field", 0)
    is_stable = stability >= 95
    
    return AssignerResult(
        assigned_fields={
            "dimension_stability_check": CheckValue(
                checked=is_stable,
                annotation=f"稳定场强度 {stability}% {'✓ 满足安全要求' if is_stable else '✗ 低于安全阈值 95%'}"
            )
        }
    )


# ============================================================
# 自动校验：培养温度检查
# ============================================================

@assigner(
    assigned_fields=["temperature_check"],
    dependent_fields=["culture_temp"],
    mode="auto",
)
def check_culture_temperature(dep: dict) -> AssignerResult:
    """检查培养温度是否在标准范围内 (36-38°C)"""
    temp = dep.get("culture_temp", 0)
    is_valid = 36 <= temp <= 38
    
    return AssignerResult(
        assigned_fields={
            "temperature_check": CheckValue(
                checked=is_valid,
                annotation=f"培养温度 {temp}°C {'✓ 在标准范围内' if is_valid else '✗ 超出标准范围 36-38°C'}"
            )
        }
    )


# ============================================================
# 自动计算：能量梯度配制量
# ============================================================

@assigner(
    assigned_fields=["energy_dilutions"],
    dependent_fields=["base_energy_level"],
    mode="manual",  # 手动触发，避免覆盖用户输入
)
def generate_energy_dilutions(dep: dict) -> AssignerResult:
    """根据基础能量浓度自动生成标准梯度配制表"""
    base = dep.get("base_energy_level", 1000)
    
    # 标准稀释梯度: 100%, 50%, 25%, 10%, 0% (对照)
    ratios = [1.0, 0.5, 0.25, 0.1, 0]
    phases = ["α", "α", "β", "β", "γ"]
    wells = ["A1", "A2", "A3", "A4", "A5"]
    
    dilutions = []
    for i, (ratio, phase, well) in enumerate(zip(ratios, phases, wells)):
        energy = base * ratio
        source_vol = ratio * 10  # 假设总体积 100μL，源能量用量
        stabilizer_vol = 100 - source_vol
        
        dilutions.append({
            "energy_level": energy,
            "source_volume": source_vol,
            "stabilizer_volume": stabilizer_vol,
            "well_position": well,
            "dimension_phase": phase,
        })
    
    return AssignerResult(assigned_fields={"energy_dilutions": dilutions})


# ============================================================
# 自动计算：实验时长估算
# ============================================================

@assigner(
    assigned_fields=["estimated_total_time"],
    dependent_fields=["adhesion_time", "treatment_duration", "cck8_incubation_time"],
    mode="auto",
)
def estimate_total_time(dep: dict) -> AssignerResult:
    """估算实验总时长"""
    adhesion = dep.get("adhesion_time", 0)
    treatment = dep.get("treatment_duration", 0)
    cck8 = dep.get("cck8_incubation_time", 0)
    
    # 额外操作时间估算
    setup_time = 2  # 准备时间
    measurement_time = 1  # 测量时间
    
    total = adhesion + treatment + cck8 + setup_time + measurement_time
    
    return AssignerResult(
        assigned_fields={
            "estimated_total_time": {
                "hours": round(total, 1),
                "breakdown": {
                    "贴壁时间": adhesion,
                    "处理时间": treatment,
                    "CCK-8孵育": cck8,
                    "准备与测量": setup_time + measurement_time,
                }
            }
        }
    )


# ============================================================
# 测试代码
# ============================================================

if __name__ == "__main__":
    
    # 模拟数据
    test_data = {
        "blank_qr_mean": 0.05,
        "control_qr_mean": 1.25,
        "quantum_measurements": [
            {"well_position": "A1", "quantum_resonance": 0.35, "group_type": "处理组", "energy_level": 100.0},
            {"well_position": "A2", "quantum_resonance": 0.55, "group_type": "处理组", "energy_level": 50.0},
            {"well_position": "A3", "quantum_resonance": 0.85, "group_type": "处理组", "energy_level": 25.0},
            {"well_position": "A4", "quantum_resonance": 1.05, "group_type": "处理组", "energy_level": 10.0},
            {"well_position": "A5", "quantum_resonance": 1.20, "group_type": "对照组", "energy_level": 0.0},
            {"well_position": "A6", "quantum_resonance": 0.05, "group_type": "空白组", "energy_level": 0.0},
        ],
        "stability_field": 99.5,
        "culture_temp": 37.0,
        "base_energy_level": 1000.0,
        "adhesion_time": 24.0,
        "treatment_duration": 48.0,
        "cck8_incubation_time": 2.0,
    }
    
    print("=" * 60)
    print("🌌 星际联邦生物实验协议 - Assigner 测试")
    print("=" * 60)
    
    # 逐个执行 Assigner
    results = {}
    
    # 1. 抑制率计算
    r = DefaultAssigner.assign("inhibition_results", test_data)
    if r.success:
        results.update(r.assigned_fields)
    
    # 2. 维度稳定性检查
    r = DefaultAssigner.assign("dimension_stability_check", test_data)
    if r.success:
        results.update(r.assigned_fields)
    
    # 3. 温度检查
    r = DefaultAssigner.assign("temperature_check", test_data)
    if r.success:
        results.update(r.assigned_fields)
    
    # 4. 时间估算
    r = DefaultAssigner.assign("estimated_total_time", test_data)
    if r.success:
        results.update(r.assigned_fields)
    
    # 输出结果
    print("\n📊 抑制率计算结果:")
    if "inhibition_results" in results:
        for r in results["inhibition_results"]:
            print(f"  能量 {r['energy_level']:>6.1f} TeV → 抑制率 {r['inhibition_rate']:>5.1f}% ({r['confidence_level']})")
    
    print("\n✅ 自动校验结果:")
    if "dimension_stability_check" in results:
        check = results["dimension_stability_check"]
        print(f"  维度稳定性: {'✓' if check.checked else '✗'} {check.annotation}")
    
    if "temperature_check" in results:
        check = results["temperature_check"]
        print(f"  培养温度: {'✓' if check.checked else '✗'} {check.annotation}")
    
    print("\n⏱️ 时间估算:")
    if "estimated_total_time" in results:
        time_info = results["estimated_total_time"]
        print(f"  预计总时长: {time_info['hours']} 小时")
        for name, hours in time_info["breakdown"].items():
            print(f"    - {name}: {hours}h")
    
    # 显示所有已注册的 Assigner
    print("\n📋 已注册的 Assigner 字段:")
    for field, info in DefaultAssigner.all_assigned_fields().items():
        print(f"  - {field}")
