"""
🌌 星际联邦实验协议 - 演示素材生成器

为 protocol.aimd 生成所有需要的演示文件：
- PNG: 细胞形态照片、培养箱设置截图
- JPG: 处理后细胞照片
- TIFF: 维度裂隙全息图
- CSV: 量子光谱仪原始数据
- MP4: 实验过程视频（占位符）
- PDF: 最终实验报告

运行方式：
    python demo_assets/generate_demo_files.py
"""

import os
import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

# 尝试导入可选依赖
try:
    from PIL import Image, ImageDraw, ImageFont
    HAS_PIL = True
except ImportError:
    HAS_PIL = False
    print("⚠️ PIL 未安装，将生成简化版图片文件")

try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    from reportlab.lib.units import cm
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False
    print("⚠️ reportlab 未安装，将生成简化版 PDF")


# ============================================================
# 配置
# ============================================================

OUTPUT_DIR = Path(__file__).parent
RANDOM_SEED = 42
random.seed(RANDOM_SEED)


# ============================================================
# 颜色方案 (科幻风格)
# ============================================================

COLORS = {
    'bg_dark': (15, 20, 35),           # 深空背景
    'bg_panel': (25, 35, 55),          # 面板背景
    'accent_cyan': (0, 255, 255),      # 青色高亮
    'accent_purple': (180, 100, 255),  # 紫色高亮
    'accent_green': (0, 255, 150),     # 绿色高亮
    'text_white': (240, 240, 250),     # 白色文字
    'text_dim': (120, 130, 150),       # 暗淡文字
    'grid': (40, 50, 70),              # 网格线
    'cell_healthy': (100, 200, 100),   # 健康细胞
    'cell_treated': (200, 100, 100),   # 处理后细胞
    'energy_field': (100, 150, 255),   # 能量场
}


# ============================================================
# 辅助函数
# ============================================================

def ensure_dir():
    """确保输出目录存在"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def draw_sci_fi_border(draw, width, height, color=COLORS['accent_cyan']):
    """绘制科幻风格边框"""
    # 角落装饰
    corner_size = 30
    line_width = 2
    
    # 左上角
    draw.line([(0, corner_size), (0, 0), (corner_size, 0)], fill=color, width=line_width)
    # 右上角
    draw.line([(width-corner_size, 0), (width-1, 0), (width-1, corner_size)], fill=color, width=line_width)
    # 左下角
    draw.line([(0, height-corner_size), (0, height-1), (corner_size, height-1)], fill=color, width=line_width)
    # 右下角
    draw.line([(width-corner_size, height-1), (width-1, height-1), (width-1, height-corner_size)], fill=color, width=line_width)


def draw_grid(draw, width, height, spacing=50, color=COLORS['grid']):
    """绘制背景网格"""
    for x in range(0, width, spacing):
        draw.line([(x, 0), (x, height)], fill=color, width=1)
    for y in range(0, height, spacing):
        draw.line([(0, y), (width, y)], fill=color, width=1)


def add_text(draw, text, position, color=COLORS['text_white'], size=20):
    """添加文字（使用默认字体）"""
    try:
        font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", size)
    except:
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
        except:
            font = ImageFont.load_default()
    draw.text(position, text, fill=color, font=font)


# ============================================================
# PNG 生成器
# ============================================================

def generate_cell_initial_photo():
    """生成细胞初始状态照片 (PNG)"""
    if not HAS_PIL:
        # 创建简单的占位文件
        with open(OUTPUT_DIR / "cell_initial_photo.png", "wb") as f:
            f.write(b'\x89PNG\r\n\x1a\n')  # PNG 文件头
        return
    
    width, height = 800, 600
    img = Image.new('RGB', (width, height), COLORS['bg_dark'])
    draw = ImageDraw.Draw(img)
    
    # 背景网格
    draw_grid(draw, width, height, 40)
    
    # 绘制健康细胞（随机分布的圆形）
    for _ in range(50):
        x = random.randint(50, width-50)
        y = random.randint(80, height-50)
        r = random.randint(15, 30)
        # 细胞体
        cell_color = tuple(c + random.randint(-20, 20) for c in COLORS['cell_healthy'])
        draw.ellipse([x-r, y-r, x+r, y+r], fill=cell_color, outline=COLORS['accent_green'])
        # 细胞核
        nr = r // 3
        draw.ellipse([x-nr, y-nr, x+nr, y+nr], fill=(50, 100, 50))
    
    # 科幻边框
    draw_sci_fi_border(draw, width, height)
    
    # 标题
    add_text(draw, "🔬 Hela-X7 细胞初始状态 | D-199 维度样本", (20, 15), COLORS['accent_cyan'], 18)
    add_text(draw, f"时空坐标: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC+∞", (20, height-35), COLORS['text_dim'], 14)
    
    img.save(OUTPUT_DIR / "cell_initial_photo.png", "PNG")
    print("✅ 生成: cell_initial_photo.png")


def generate_incubator_settings():
    """生成培养箱设置截图 (PNG)"""
    if not HAS_PIL:
        with open(OUTPUT_DIR / "incubator_settings.png", "wb") as f:
            f.write(b'\x89PNG\r\n\x1a\n')
        return
    
    width, height = 600, 400
    img = Image.new('RGB', (width, height), COLORS['bg_panel'])
    draw = ImageDraw.Draw(img)
    
    # 面板标题
    draw.rectangle([0, 0, width, 50], fill=COLORS['bg_dark'])
    add_text(draw, "⚙️ 量子培养箱 QI-7000 | 参数设置", (15, 12), COLORS['accent_cyan'], 18)
    
    # 参数显示
    params = [
        ("温度", "37.0°C", "✓ 稳定"),
        ("CO₂ 浓度", "5.0%", "✓ 正常"),
        ("湿度", "95%", "✓ 正常"),
        ("时空稳定场", "99.9%", "✓ 锁定"),
        ("维度相位", "α", "✓ 同步"),
        ("量子噪声", "0.001%", "✓ 抑制"),
    ]
    
    y_start = 70
    for i, (name, value, status) in enumerate(params):
        y = y_start + i * 50
        # 参数名
        add_text(draw, name, (30, y), COLORS['text_dim'], 16)
        # 参数值
        add_text(draw, value, (200, y), COLORS['text_white'], 20)
        # 状态
        add_text(draw, status, (400, y), COLORS['accent_green'], 14)
        # 分隔线
        draw.line([(20, y+35), (width-20, y+35)], fill=COLORS['grid'], width=1)
    
    # 科幻边框
    draw_sci_fi_border(draw, width, height, COLORS['accent_purple'])
    
    img.save(OUTPUT_DIR / "incubator_settings.png", "PNG")
    print("✅ 生成: incubator_settings.png")


def generate_cell_before_photo():
    """生成细胞处理前照片 (PNG)"""
    if not HAS_PIL:
        with open(OUTPUT_DIR / "cell_before_treatment.png", "wb") as f:
            f.write(b'\x89PNG\r\n\x1a\n')
        return
    
    width, height = 800, 600
    img = Image.new('RGB', (width, height), COLORS['bg_dark'])
    draw = ImageDraw.Draw(img)
    
    draw_grid(draw, width, height, 40)
    
    # 绘制贴壁后的细胞（更规则的分布）
    for row in range(5):
        for col in range(8):
            x = 80 + col * 90 + random.randint(-10, 10)
            y = 100 + row * 90 + random.randint(-10, 10)
            r = random.randint(20, 35)
            
            cell_color = tuple(c + random.randint(-15, 15) for c in COLORS['cell_healthy'])
            draw.ellipse([x-r, y-r, x+r, y+r], fill=cell_color, outline=COLORS['accent_green'])
            nr = r // 3
            draw.ellipse([x-nr, y-nr, x+nr, y+nr], fill=(50, 100, 50))
    
    draw_sci_fi_border(draw, width, height)
    add_text(draw, "🧬 能量处理前 | 细胞贴壁完成 | 24h 培养", (20, 15), COLORS['accent_cyan'], 18)
    add_text(draw, "细胞密度: 5000/孔 | 存活率: 98.5%", (20, height-35), COLORS['text_dim'], 14)
    
    img.save(OUTPUT_DIR / "cell_before_treatment.png", "PNG")
    print("✅ 生成: cell_before_treatment.png")


# ============================================================
# JPG 生成器
# ============================================================

def generate_cell_after_photo():
    """生成细胞处理后照片 (JPG)"""
    if not HAS_PIL:
        with open(OUTPUT_DIR / "cell_after_treatment.jpg", "wb") as f:
            f.write(b'\xff\xd8\xff')  # JPG 文件头
        return
    
    width, height = 800, 600
    img = Image.new('RGB', (width, height), COLORS['bg_dark'])
    draw = ImageDraw.Draw(img)
    
    draw_grid(draw, width, height, 40)
    
    # 绘制处理后的细胞（部分凋亡）
    for row in range(5):
        for col in range(8):
            x = 80 + col * 90 + random.randint(-15, 15)
            y = 100 + row * 90 + random.randint(-15, 15)
            
            # 根据位置决定细胞状态（模拟能量梯度效果）
            if col < 3:  # 高能量区 - 大量凋亡
                if random.random() > 0.3:
                    continue  # 细胞死亡消失
                r = random.randint(10, 20)
                cell_color = COLORS['cell_treated']
            elif col < 5:  # 中能量区 - 部分凋亡
                if random.random() > 0.6:
                    continue
                r = random.randint(15, 25)
                cell_color = (180, 150, 100)
            else:  # 低能量区/对照组 - 正常
                r = random.randint(20, 35)
                cell_color = COLORS['cell_healthy']
            
            draw.ellipse([x-r, y-r, x+r, y+r], fill=cell_color, outline=COLORS['accent_purple'])
            nr = r // 3
            draw.ellipse([x-nr, y-nr, x+nr, y+nr], fill=(80, 50, 50))
    
    draw_sci_fi_border(draw, width, height, COLORS['accent_purple'])
    add_text(draw, "⚡ 能量处理后 | 48h | 时空裂隙能量暴露", (20, 15), COLORS['accent_purple'], 18)
    add_text(draw, "高能区(左) → 低能区(右) | 可见明显抑制效果", (20, height-35), COLORS['text_dim'], 14)
    
    img.save(OUTPUT_DIR / "cell_after_treatment.jpg", "JPEG", quality=90)
    print("✅ 生成: cell_after_treatment.jpg")


# ============================================================
# TIFF 生成器
# ============================================================

def generate_dimension_rift_hologram():
    """生成维度裂隙全息图 (TIFF)"""
    if not HAS_PIL:
        with open(OUTPUT_DIR / "dimension_rift_hologram.tiff", "wb") as f:
            f.write(b'II*\x00')  # TIFF 文件头 (little-endian)
        return
    
    width, height = 1024, 768
    img = Image.new('RGB', (width, height), (5, 5, 15))
    draw = ImageDraw.Draw(img)
    
    # 绘制维度裂隙效果
    center_x, center_y = width // 2, height // 2
    
    # 能量波纹
    for r in range(50, 400, 20):
        alpha = max(0, 255 - r // 2)
        color = (alpha // 3, alpha // 2, alpha)
        draw.ellipse([center_x-r, center_y-r, center_x+r, center_y+r], outline=color, width=2)
    
    # 裂隙中心
    for _ in range(100):
        angle = random.uniform(0, 6.28)
        dist = random.uniform(0, 100)
        x = center_x + int(dist * 1.5 * (0.5 + 0.5 * random.random()) * (1 if random.random() > 0.5 else -1))
        y = center_y + int(dist * (0.5 + 0.5 * random.random()) * (1 if random.random() > 0.5 else -1))
        r = random.randint(2, 8)
        color = (random.randint(100, 255), random.randint(50, 150), random.randint(200, 255))
        draw.ellipse([x-r, y-r, x+r, y+r], fill=color)
    
    # 数据叠加
    draw_sci_fi_border(draw, width, height, COLORS['accent_purple'])
    add_text(draw, "🌀 维度裂隙全息成像 | D-616 ↔ D-199 通道", (20, 15), COLORS['accent_purple'], 20)
    add_text(draw, f"裂隙稳定度: 99.7% | 能量通量: 1.2 PeV/s | 相位锁定: α", (20, height-40), COLORS['text_dim'], 14)
    
    img.save(OUTPUT_DIR / "dimension_rift_hologram.tiff", "TIFF")
    print("✅ 生成: dimension_rift_hologram.tiff")


# ============================================================
# CSV 生成器
# ============================================================

def generate_raw_data_csv():
    """生成量子光谱仪原始数据 (CSV)"""
    filepath = OUTPUT_DIR / "quantum_spectrometer_raw_data.csv"
    
    # 96孔板布局
    rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    cols = range(1, 13)
    
    # 能量梯度设置
    energy_levels = {
        1: 100.0, 2: 100.0,   # 高能量
        3: 50.0, 4: 50.0,     # 中高能量
        5: 25.0, 6: 25.0,     # 中能量
        7: 10.0, 8: 10.0,     # 低能量
        9: 0.0, 10: 0.0,      # 对照组
        11: 0.0, 12: 0.0,     # 空白组
    }
    
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        
        # 文件头信息
        writer.writerow(['# 星际联邦量子光谱仪 QS-9000 数据导出'])
        writer.writerow([f'# 导出时间: {datetime.now().isoformat()}'])
        writer.writerow(['# 维度: D-616 | 任务: PRO-2024-001'])
        writer.writerow([])
        
        # 数据表头
        writer.writerow([
            'Well_Position', 'Energy_Level_TeV', 'OD_450nm', 
            'Quantum_Resonance_QR', 'Dimension_Interference',
            'Group_Type', 'Dimension_Phase', 'Timestamp'
        ])
        
        # 生成数据
        base_time = datetime.now() - timedelta(hours=2)
        
        for row in rows:
            for col in cols:
                well = f"{row}{col}"
                energy = energy_levels.get(col, 0.0)
                
                # 根据能量等级计算 OD 值（模拟抑制效果）
                if col >= 11:  # 空白组
                    od = 0.05 + random.uniform(-0.01, 0.01)
                    qr = 0.02 + random.uniform(-0.005, 0.005)
                    group = "空白组"
                elif col >= 9:  # 对照组
                    od = 1.2 + random.uniform(-0.1, 0.1)
                    qr = 1.0 + random.uniform(-0.08, 0.08)
                    group = "对照组"
                else:  # 处理组
                    # 能量越高，抑制越强，OD 越低
                    inhibition_factor = 1 - (energy / 150)
                    od = 1.2 * inhibition_factor + random.uniform(-0.08, 0.08)
                    qr = 1.0 * inhibition_factor + random.uniform(-0.06, 0.06)
                    group = "处理组"
                
                # 维度干扰系数
                dim_interference = random.uniform(0.01, 0.05)
                
                # 维度相位
                if col <= 4:
                    phase = "α"
                elif col <= 8:
                    phase = "β"
                else:
                    phase = "γ"
                
                # 时间戳
                timestamp = (base_time + timedelta(seconds=random.randint(0, 7200))).isoformat()
                
                writer.writerow([
                    well, f"{energy:.1f}", f"{od:.4f}",
                    f"{qr:.4f}", f"{dim_interference:.4f}",
                    group, phase, timestamp
                ])
    
    print("✅ 生成: quantum_spectrometer_raw_data.csv")


# ============================================================
# MP4 生成器（占位符）
# ============================================================

def generate_experiment_video():
    """生成实验过程视频占位符 (MP4)
    
    注意：生成真实视频需要 moviepy 或 opencv，这里创建一个占位文件。
    实际使用时可以替换为真实的实验录像。
    """
    filepath = OUTPUT_DIR / "experiment_video_placeholder.mp4"
    
    # 创建一个最小的有效 MP4 文件头（ftyp box）
    # 这不是一个可播放的视频，只是一个占位符
    mp4_header = bytes([
        0x00, 0x00, 0x00, 0x1C,  # box size
        0x66, 0x74, 0x79, 0x70,  # 'ftyp'
        0x69, 0x73, 0x6F, 0x6D,  # 'isom'
        0x00, 0x00, 0x02, 0x00,  # minor version
        0x69, 0x73, 0x6F, 0x6D,  # compatible brand 'isom'
        0x69, 0x73, 0x6F, 0x32,  # compatible brand 'iso2'
        0x6D, 0x70, 0x34, 0x31,  # compatible brand 'mp41'
    ])
    
    with open(filepath, 'wb') as f:
        f.write(mp4_header)
    
    print("✅ 生成: experiment_video_placeholder.mp4 (占位符)")
    print("   💡 提示: 这是一个占位文件，请替换为真实的实验视频")


# ============================================================
# PDF 生成器
# ============================================================

def generate_final_report():
    """生成最终实验报告 (PDF)"""
    filepath = OUTPUT_DIR / "final_experiment_report.pdf"
    
    if not HAS_REPORTLAB:
        # 创建简单的 PDF 占位符
        pdf_header = b'%PDF-1.4\n%\xe2\xe3\xcf\xd3\n'
        with open(filepath, 'wb') as f:
            f.write(pdf_header)
        print("✅ 生成: final_experiment_report.pdf (简化版)")
        return
    
    c = canvas.Canvas(str(filepath), pagesize=A4)
    width, height = A4
    
    # 标题
    c.setFont("Helvetica-Bold", 24)
    c.drawString(2*cm, height - 3*cm, "Project Prometheus")
    
    c.setFont("Helvetica", 14)
    c.drawString(2*cm, height - 4*cm, "Cross-Dimensional Cell Regeneration Study")
    c.drawString(2*cm, height - 4.5*cm, "Final Experiment Report")
    
    # 基本信息
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, height - 6*cm, "Mission Information")
    
    c.setFont("Helvetica", 10)
    info_lines = [
        f"Mission Code: PRO-2024-001",
        f"Dimension: D-616",
        f"Sample Source: D-199",
        f"Cell Line: Hela-X7",
        f"Energy Source: Black Hole Boundary Radiation",
        f"Report Date: {datetime.now().strftime('%Y-%m-%d')}",
    ]
    
    y = height - 7*cm
    for line in info_lines:
        c.drawString(2.5*cm, y, line)
        y -= 0.5*cm
    
    # 结果摘要
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y - 1*cm, "Results Summary")
    
    c.setFont("Helvetica", 10)
    results = [
        "Energy Level 100 TeV: 85.2% inhibition rate (High confidence)",
        "Energy Level 50 TeV: 62.8% inhibition rate (High confidence)",
        "Energy Level 25 TeV: 38.5% inhibition rate (Medium confidence)",
        "Energy Level 10 TeV: 15.3% inhibition rate (Medium confidence)",
    ]
    
    y = y - 2*cm
    for line in results:
        c.drawString(2.5*cm, y, line)
        y -= 0.5*cm
    
    # 结论
    c.setFont("Helvetica-Bold", 12)
    c.drawString(2*cm, y - 1*cm, "Conclusion")
    
    c.setFont("Helvetica", 10)
    conclusion = [
        "The experiment successfully demonstrated the inhibitory effect of",
        "spacetime rift energy on cross-dimensional tumor cells. The results",
        "show a dose-dependent relationship between energy levels and cell",
        "inhibition rates. Further studies with extended observation periods",
        "are recommended.",
    ]
    
    y = y - 2*cm
    for line in conclusion:
        c.drawString(2.5*cm, y, line)
        y -= 0.5*cm
    
    # 页脚
    c.setFont("Helvetica", 8)
    c.drawString(2*cm, 2*cm, "Interstellar Federation Seventh Research Institute")
    c.drawString(2*cm, 1.5*cm, "Classification: Level 7 Clearance Required")
    
    c.save()
    print("✅ 生成: final_experiment_report.pdf")


# ============================================================
# 主函数
# ============================================================

def main():
    """生成所有演示素材"""
    print("\n" + "="*60)
    print("🌌 星际联邦实验协议 - 演示素材生成器")
    print("="*60 + "\n")
    
    ensure_dir()
    
    print("📁 输出目录:", OUTPUT_DIR.absolute())
    print()
    
    # PNG 文件
    print("🖼️  生成 PNG 文件...")
    generate_cell_initial_photo()
    generate_incubator_settings()
    generate_cell_before_photo()
    
    # JPG 文件
    print("\n🖼️  生成 JPG 文件...")
    generate_cell_after_photo()
    
    # TIFF 文件
    print("\n🖼️  生成 TIFF 文件...")
    generate_dimension_rift_hologram()
    
    # CSV 文件
    print("\n📊 生成 CSV 文件...")
    generate_raw_data_csv()
    
    # MP4 文件
    print("\n🎬 生成 MP4 文件...")
    generate_experiment_video()
    
    # PDF 文件
    print("\n📄 生成 PDF 文件...")
    generate_final_report()
    
    print("\n" + "="*60)
    print("✨ 所有演示素材生成完成！")
    print("="*60)
    
    # 列出生成的文件
    print("\n📋 生成的文件列表:")
    for f in sorted(OUTPUT_DIR.glob("*")):
        if f.is_file() and f.name != "generate_demo_files.py":
            size = f.stat().st_size
            if size < 1024:
                size_str = f"{size} B"
            elif size < 1024*1024:
                size_str = f"{size/1024:.1f} KB"
            else:
                size_str = f"{size/1024/1024:.1f} MB"
            print(f"   • {f.name} ({size_str})")
    
    print("\n💡 使用提示:")
    print("   1. 这些文件可以在 Airalogy 中作为演示数据上传")
    print("   2. experiment_video_placeholder.mp4 是占位符，请替换为真实视频")
    print("   3. 如需更高质量的图片，请安装 Pillow: pip install Pillow")
    print("   4. 如需完整 PDF 功能，请安装 reportlab: pip install reportlab")


if __name__ == "__main__":
    main()
