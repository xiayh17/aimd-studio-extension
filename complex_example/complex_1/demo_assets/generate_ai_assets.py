"""
🌌 星际联邦实验协议 - AI 素材生成器

使用 LLM API 生成高质量的图片、视频和音频素材。

API 来源: yunwu.ai
- 图像生成: Gemini 3 Pro Image Preview
- 视频生成: Kling v1
- 音频生成: Text-to-Audio

使用方式：
    # 设置 API Key
    export YUNWU_API_KEY="your-api-key"
    
    # 运行生成
    python demo_assets/generate_ai_assets.py
"""

import os
import sys
import json
import time
import base64
import http.client
import requests
from pathlib import Path
from datetime import datetime

# ============================================================
# 配置
# ============================================================

API_KEY = os.environ.get("YUNWU_API_KEY", "sk-uIR61bwuv96qGMDa9RY2J91np9JKDINdrCQfdknTfIQHqm71")
API_HOST = "yunwu.ai"
OUTPUT_DIR = Path(__file__).parent

# 图像生成配置
IMAGE_PROMPTS = {
    "cell_initial_photo": {
        "prompt": """Scientific microscopy image of healthy tumor cells (HeLa cells) under fluorescent microscope. 
        Cells are glowing green with visible nuclei, scattered across a dark background with subtle grid overlay.
        Futuristic sci-fi aesthetic with cyan accent lighting. High resolution, professional laboratory photography.
        Add subtle holographic data overlay showing "Hela-X7 | Dimension D-199" in the corner.""",
        "aspect_ratio": "4:3",
        "filename": "cell_initial_photo.png"
    },
    "incubator_settings": {
        "prompt": """Futuristic sci-fi control panel interface for a quantum cell incubator. 
        Dark background with glowing cyan and purple UI elements. 
        Display showing: Temperature 37.0°C, CO2 5.0%, Humidity 95%, Stability Field 99.9%.
        Holographic style with floating data panels. Clean, minimalist sci-fi design.
        Text should include "Quantum Incubator QI-7000" at the top.""",
        "aspect_ratio": "3:2",
        "filename": "incubator_settings.png"
    },
    "cell_before_treatment": {
        "prompt": """Microscopy image of adherent tumor cells before treatment. 
        Cells are healthy, well-spread, and forming a monolayer. Green fluorescent staining.
        Professional scientific imaging with scale bar. Dark background.
        Sci-fi overlay text: "Pre-Treatment | 24h Culture | Cell Density: 5000/well"
        Futuristic holographic border effect.""",
        "aspect_ratio": "4:3",
        "filename": "cell_before_treatment.png"
    },
    "cell_after_treatment": {
        "prompt": """Microscopy image showing tumor cells after energy treatment with visible cell death.
        Left side shows more dead/dying cells (red/orange), right side shows surviving cells (green).
        Gradient effect showing dose-dependent cell death. Scientific imaging style.
        Sci-fi overlay: "Post-Treatment | 48h | Spacetime Rift Energy Exposure"
        Purple accent lighting, futuristic aesthetic.""",
        "aspect_ratio": "4:3",
        "filename": "cell_after_treatment.jpg"
    },
    "dimension_rift_hologram": {
        "prompt": """Stunning visualization of a dimensional rift portal in space. 
        Swirling energy vortex with purple and cyan colors. 
        Concentric energy rings emanating from the center.
        Particle effects and light streaks. Deep space background with stars.
        Holographic data overlay showing "Dimension Rift D-616 ↔ D-199 | Stability: 99.7%"
        High resolution, cinematic sci-fi art style.""",
        "aspect_ratio": "4:3",
        "filename": "dimension_rift_hologram.png"  # 会转换为 TIFF
    },
}

# 视频生成配置
VIDEO_PROMPTS = {
    "experiment_video": {
        "prompt": """A scientist in a futuristic laboratory conducting a cell experiment. 
        Holographic displays showing cell data. Glowing quantum equipment.
        The scientist pipettes glowing liquid into a 96-well plate.
        Sci-fi aesthetic with cyan and purple lighting. 
        Smooth camera movement around the laboratory.
        Professional, cinematic quality.""",
        "duration": "5",
        "aspect_ratio": "16:9",
        "filename": "experiment_video.mp4"
    }
}

# 音频生成配置（可选）
AUDIO_PROMPTS = {
    "lab_ambience": {
        "prompt": "Futuristic laboratory ambient sound with soft humming of equipment, occasional beeps, and subtle electronic tones. Calm and scientific atmosphere.",
        "duration": 10,
        "filename": "lab_ambience.mp3"
    }
}


# ============================================================
# API 调用函数
# ============================================================

def generate_image(prompt: str, aspect_ratio: str = "4:3") -> bytes | None:
    """使用 Gemini 生成图像"""
    url = f"https://{API_HOST}/v1beta/models/gemini-3-pro-image-preview:generateContent"
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"],
            "imageConfig": {
                "aspectRatio": aspect_ratio,
                "imageSize": "1K"
            }
        }
    }
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        
        # 解析响应，提取图像数据
        if 'candidates' in result:
            for candidate in result['candidates']:
                if 'content' in candidate and 'parts' in candidate['content']:
                    for part in candidate['content']['parts']:
                        if 'inlineData' in part:
                            image_data = part['inlineData'].get('data')
                            if image_data:
                                return base64.b64decode(image_data)
        
        print(f"   ⚠️ 响应中未找到图像数据")
        print(f"   响应: {json.dumps(result, indent=2, ensure_ascii=False)[:500]}")
        return None
        
    except requests.exceptions.RequestException as e:
        print(f"   ❌ 请求失败: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"   ❌ JSON 解析失败: {e}")
        return None


def generate_video(prompt: str, duration: str = "5", aspect_ratio: str = "16:9") -> dict | None:
    """使用 Kling 生成视频（异步任务）"""
    conn = http.client.HTTPSConnection(API_HOST)
    
    payload = json.dumps({
        "model_name": "kling-v1",
        "prompt": prompt,
        "negative_prompt": "blurry, low quality, distorted, ugly",
        "cfg_scale": 0.5,
        "mode": "std",
        "sound": "off",
        "camera_control": {
            "type": "simple",
            "config": {
                "horizontal": 0,
                "vertical": 0,
                "pan": 1,
                "tilt": 0,
                "roll": 0,
                "zoom": 0
            }
        },
        "aspect_ratio": aspect_ratio,
        "duration": duration,
        "callback_url": "",
        "external_task_id": f"prometheus_{int(time.time())}"
    })
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        conn.request("POST", "/kling/v1/videos/text2video", payload, headers)
        res = conn.getresponse()
        data = res.read()
        result = json.loads(data.decode("utf-8"))
        
        if 'task_id' in result or 'data' in result:
            return result
        else:
            print(f"   ⚠️ 视频生成响应: {result}")
            return result
            
    except Exception as e:
        print(f"   ❌ 视频生成失败: {e}")
        return None
    finally:
        conn.close()


def generate_audio(prompt: str, duration: int = 5) -> dict | None:
    """生成音频（异步任务）"""
    conn = http.client.HTTPSConnection(API_HOST)
    
    payload = json.dumps({
        "prompt": prompt,
        "duration": duration,
        "external_task_id": f"audio_{int(time.time())}",
        "callback_url": ""
    })
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        conn.request("POST", "/v1/audio/text-to-audio", payload, headers)
        res = conn.getresponse()
        data = res.read()
        return json.loads(data.decode("utf-8"))
    except Exception as e:
        print(f"   ❌ 音频生成失败: {e}")
        return None
    finally:
        conn.close()


# ============================================================
# 文件保存函数
# ============================================================

def save_image(data: bytes, filename: str):
    """保存图像文件"""
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'wb') as f:
        f.write(data)
    print(f"   ✅ 已保存: {filename} ({len(data)/1024:.1f} KB)")


def convert_to_tiff(png_path: Path, tiff_path: Path):
    """将 PNG 转换为 TIFF"""
    try:
        from PIL import Image
        img = Image.open(png_path)
        img.save(tiff_path, 'TIFF')
        print(f"   ✅ 已转换为 TIFF: {tiff_path.name}")
        # 删除临时 PNG
        png_path.unlink()
    except ImportError:
        print(f"   ⚠️ 需要 Pillow 来转换 TIFF，保留 PNG 格式")


# ============================================================
# 主生成流程
# ============================================================

def generate_all_images():
    """生成所有图像"""
    print("\n🖼️  开始生成 AI 图像...")
    print(f"   使用 API: {API_HOST}")
    
    for name, config in IMAGE_PROMPTS.items():
        print(f"\n   📸 生成: {name}")
        print(f"      Prompt: {config['prompt'][:80]}...")
        
        image_data = generate_image(config['prompt'], config['aspect_ratio'])
        
        if image_data:
            save_image(image_data, config['filename'])
            
            # 如果需要 TIFF 格式
            if name == "dimension_rift_hologram":
                png_path = OUTPUT_DIR / config['filename']
                tiff_path = OUTPUT_DIR / "dimension_rift_hologram.tiff"
                convert_to_tiff(png_path, tiff_path)
        else:
            print(f"   ❌ 生成失败: {name}")
        
        # 避免 API 限流
        time.sleep(2)


def generate_all_videos():
    """生成所有视频"""
    print("\n🎬 开始生成 AI 视频...")
    
    for name, config in VIDEO_PROMPTS.items():
        print(f"\n   🎥 生成: {name}")
        print(f"      Prompt: {config['prompt'][:80]}...")
        
        result = generate_video(
            config['prompt'], 
            config['duration'], 
            config['aspect_ratio']
        )
        
        if result:
            print(f"   📋 任务已提交: {json.dumps(result, indent=2, ensure_ascii=False)[:300]}")
            
            # 保存任务信息
            task_file = OUTPUT_DIR / f"{name}_task.json"
            with open(task_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"   💾 任务信息已保存: {task_file.name}")
        else:
            print(f"   ❌ 视频任务提交失败: {name}")


def generate_all_audio():
    """生成所有音频"""
    print("\n🔊 开始生成 AI 音频...")
    
    for name, config in AUDIO_PROMPTS.items():
        print(f"\n   🎵 生成: {name}")
        
        result = generate_audio(config['prompt'], config['duration'])
        
        if result:
            print(f"   📋 任务已提交: {json.dumps(result, indent=2, ensure_ascii=False)[:300]}")
            
            task_file = OUTPUT_DIR / f"{name}_task.json"
            with open(task_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, indent=2, ensure_ascii=False)
            print(f"   💾 任务信息已保存: {task_file.name}")


# ============================================================
# 异步任务查询和下载
# ============================================================

def query_video_task(task_id: str) -> dict | None:
    """查询视频生成任务状态"""
    conn = http.client.HTTPSConnection(API_HOST)
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Kling API 查询任务状态
        conn.request("GET", f"/kling/v1/videos/text2video/{task_id}", headers=headers)
        res = conn.getresponse()
        data = res.read()
        return json.loads(data.decode("utf-8"))
    except Exception as e:
        print(f"   ❌ 查询失败: {e}")
        return None
    finally:
        conn.close()


def download_video(url: str, filename: str) -> bool:
    """下载视频文件"""
    try:
        print(f"   ⬇️  下载中: {url[:60]}...")
        response = requests.get(url, timeout=120, stream=True)
        response.raise_for_status()
        
        filepath = OUTPUT_DIR / filename
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        size = filepath.stat().st_size / 1024 / 1024
        print(f"   ✅ 已下载: {filename} ({size:.2f} MB)")
        return True
    except Exception as e:
        print(f"   ❌ 下载失败: {e}")
        return False


def check_and_download_video(task_id: str = None):
    """检查视频任务状态并下载"""
    # 如果没有提供 task_id，从文件读取
    if not task_id:
        task_file = OUTPUT_DIR / "experiment_video_task.json"
        if task_file.exists():
            with open(task_file, 'r', encoding='utf-8') as f:
                task_data = json.load(f)
                task_id = task_data.get('data', {}).get('task_id')
        
        if not task_id:
            print("   ❌ 未找到任务 ID，请先运行 'python generate_ai_assets.py videos'")
            return
    
    print(f"\n🔍 查询视频任务状态...")
    print(f"   Task ID: {task_id}")
    
    result = query_video_task(task_id)
    
    if not result:
        return
    
    print(f"\n   📋 任务状态响应:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # 解析状态
    if result.get('code') == 0:
        data = result.get('data', {})
        status = data.get('task_status', 'unknown')
        
        print(f"\n   📊 状态: {status}")
        
        if status == 'succeed':
            # 获取视频 URL
            task_result = data.get('task_result', {})
            videos = task_result.get('videos', [])
            
            if videos:
                video_url = videos[0].get('url')
                if video_url:
                    print(f"\n   🎬 视频已生成！")
                    download_video(video_url, "experiment_video.mp4")
            else:
                print("   ⚠️ 未找到视频 URL")
                
        elif status == 'processing':
            print("   ⏳ 视频正在生成中，请稍后再查询...")
            
        elif status == 'submitted':
            print("   ⏳ 任务已提交，等待处理...")
            
        elif status == 'failed':
            print(f"   ❌ 任务失败: {data.get('task_status_msg', 'Unknown error')}")
    else:
        print(f"   ❌ 查询失败: {result.get('message', 'Unknown error')}")


def query_audio_task(task_id: str) -> dict | None:
    """查询音频生成任务状态"""
    conn = http.client.HTTPSConnection(API_HOST)
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    try:
        conn.request("GET", f"/v1/audio/text-to-audio/{task_id}", headers=headers)
        res = conn.getresponse()
        data = res.read()
        return json.loads(data.decode("utf-8"))
    except Exception as e:
        print(f"   ❌ 查询失败: {e}")
        return None
    finally:
        conn.close()


# ============================================================
# 主函数
# ============================================================

def main():
    print("\n" + "="*60)
    print("🌌 星际联邦实验协议 - AI 素材生成器")
    print("="*60)
    print(f"\n📁 输出目录: {OUTPUT_DIR.absolute()}")
    print(f"🔑 API Key: {API_KEY[:20]}...")
    
    # 检查参数
    if len(sys.argv) > 1:
        mode = sys.argv[1]
        if mode == "images":
            generate_all_images()
        elif mode == "videos":
            generate_all_videos()
        elif mode == "audio":
            generate_all_audio()
        elif mode == "status":
            # 查询任务状态
            task_id = sys.argv[2] if len(sys.argv) > 2 else None
            check_and_download_video(task_id)
        elif mode == "download":
            # 直接下载（需要提供 task_id）
            task_id = sys.argv[2] if len(sys.argv) > 2 else None
            check_and_download_video(task_id)
        else:
            print(f"未知模式: {mode}")
            print_usage()
    else:
        # 默认生成所有
        generate_all_images()
        generate_all_videos()
    
    print("\n" + "="*60)
    print("✨ 完成！")
    print("="*60)


def print_usage():
    print("\n📋 使用方式:")
    print("   python generate_ai_assets.py              # 生成所有素材")
    print("   python generate_ai_assets.py images       # 只生成图片")
    print("   python generate_ai_assets.py videos       # 只生成视频（提交任务）")
    print("   python generate_ai_assets.py status       # 查询视频任务状态")
    print("   python generate_ai_assets.py status <id>  # 查询指定任务状态")
    print("   python generate_ai_assets.py download     # 下载已完成的视频")


if __name__ == "__main__":
    main()
