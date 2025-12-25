# Airalogy Mock Server 开发指南

本文档介绍如何使用 `airalogy_mock` 模块在本地模拟 Airalogy Platform 的 HTTP API，用于 AIMD Studio 开发阶段的独立测试。

> **注意**: 本模块依赖真实的 `airalogy` Python SDK，仅模拟 HTTP 服务层和本地文件存储。

## 快速开始

### 安装依赖

```bash
# 从 GitHub 安装最新版 airalogy SDK（推荐开发时使用）
pip install git+https://github.com/airalogy/airalogy.git

# 或从 PyPI 安装稳定版
# pip install airalogy

# 安装 HTTP 服务依赖
pip install fastapi uvicorn
```

### 启动服务器

```bash
python -m airalogy_mock
```

服务启动后：
- API 端点: http://localhost:4000
- Swagger 文档: http://localhost:4000/docs

### 测试 Assigner

```bash
python assigner.py
```

---

## 项目结构

```
aimd_template/
├── protocol.aimd              # AIMD 协议文档
├── model.py                   # Pydantic 模型定义 (VarModel)
├── assigner.py                # 自动计算逻辑
├── requirements.txt           # Python 依赖
│
├── airalogy_mock/             # 本地 HTTP 服务
│   ├── __init__.py            # 包入口 (re-export airalogy SDK)
│   ├── client.py              # 本地文件/记录存储
│   ├── server.py              # FastAPI HTTP 服务
│   └── __main__.py            # python -m 入口
│
└── .airalogy_mock/            # 本地存储 (自动创建)
    ├── files/                 # 上传的文件
    └── records/               # 保存的记录
```

---

## 核心概念

### 1. Airalogy 自有类型

这些类型来自 `airalogy.types`，用于 `model.py` 中的 Pydantic 模型：

| 类型 | 用途 | UI 表现 |
|------|------|---------|
| `UserName` | 当前用户名 | 自动填充 |
| `CurrentTime` | 当前时间 | 自动填充 |
| `CurrentRecordId` | 当前记录 ID | 自动填充 |
| `VersionStr` | 语义化版本号 | 文本框 + 验证 |
| `FileIdPNG` | PNG 图片上传 | 上传按钮 |
| `FileIdCSV` | CSV 数据上传 | 上传按钮 |
| `RecordId` | 关联其他记录 | 下拉选择框 |
| `AiralogyMarkdown` | Markdown 内容 | 富文本编辑器 |
| `PyStr` | Python 代码 | 代码编辑器 |
| `IgnoreStr` | 敏感数据 | 文本框 (不持久化) |

**使用示例：**

```python
from airalogy.types import UserName, FileIdPNG, CurrentTime
from pydantic import BaseModel, Field

class VarModel(BaseModel):
    operator: UserName
    record_time: CurrentTime
    cell_photo: FileIdPNG = Field(description="细胞照片")
```

### 2. Assigner 自动计算

使用 `@assigner` 装饰器定义自动计算逻辑（来自 `airalogy.assigner`）：

```python
from airalogy.assigner import assigner, AssignerResult
from airalogy.models import CheckValue

@assigner(
    assigned_fields=["result"],           # 计算结果字段
    dependent_fields=["a", "b"],          # 依赖的输入字段
    mode="auto",                          # auto=自动执行, manual=手动触发
)
def calculate_result(dep: dict) -> AssignerResult:
    return AssignerResult(
        assigned_fields={
            "result": dep["a"] + dep["b"]
        }
    )
```

**返回 CheckValue (用于校验)：**

```python
@assigner(
    assigned_fields=["temp_check"],
    dependent_fields=["temperature"],
    mode="auto",
)
def check_temperature(dep: dict) -> AssignerResult:
    temp = dep["temperature"]
    is_valid = 36 <= temp <= 38
    
    return AssignerResult(
        assigned_fields={
            "temp_check": CheckValue(
                checked=is_valid,
                annotation=f"温度 {temp}°C {'✓ 正常' if is_valid else '✗ 异常'}"
            )
        }
    )
```

### 3. 本地客户端

`airalogy_mock.client.Airalogy` 提供本地文件上传/下载和记录管理：

```python
from airalogy_mock import Airalogy

client = Airalogy()

# 上传文件
with open("image.png", "rb") as f:
    result = client.upload_file_bytes("image.png", f.read())
    file_id = result["id"]  # airalogy.id.file.xxx.png

# 下载文件
file_bytes = client.download_file_bytes(file_id)

# 创建记录
record = client.create_record({"name": "实验1", "value": 42})

# 获取记录
record = client.get_record(record["id"])
```

---

## HTTP API 参考

### Assigner API

#### POST /api/assigner/assign-all

执行所有自动计算。

**请求：**
```json
{
  "data": {
    "blank_qr_mean": 0.05,
    "control_qr_mean": 1.25,
    "quantum_measurements": [...]
  },
  "mode": "auto"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "blank_qr_mean": 0.05,
    "control_qr_mean": 1.25,
    "inhibition_results": [...],
    "temperature_check": {"checked": true, "annotation": "..."}
  }
}
```

#### POST /api/assigner/load

动态加载 Assigner 模块。

**请求：**
```json
{
  "module_path": "./assigner.py"
}
```

#### GET /api/assigner/fields

列出所有已注册的 Assigner 字段。

### 文件 API

#### POST /api/files/upload/bytes

上传文件 (multipart/form-data)。

#### GET /api/files/{file_id}/download/bytes

下载文件。

#### GET /api/files

列出所有文件。

### 记录 API

#### POST /api/records

创建记录。

#### GET /api/records/{record_id}

获取记录。

#### PUT /api/records/{record_id}

更新记录。

#### GET /api/records

列出所有记录。

### 版本 API

#### GET /api/version

获取 airalogy SDK 和 Mock Server 的版本信息。

**响应示例（从 GitHub 安装）：**
```json
{
  "mock_server": {
    "version": "0.1.0"
  },
  "airalogy_sdk": {
    "version": "0.0.13",
    "install_source": "github",
    "commit_id": "c01b819702fdda97088e4d45bb34e4d49cfe39d3",
    "install_path": "/path/to/site-packages/airalogy",
    "vcs_url": "https://github.com/airalogy/airalogy.git"
  },
  "python": {
    "version": "3.13.1",
    "executable": "/path/to/python"
  }
}
```

**install_source 可能的值：**
- `github` - 从 GitHub 安装 (`pip install git+https://...`)
- `github_editable` - 本地开发模式 (`pip install -e /path/to/repo`)
- `pypi` - 从 PyPI 安装
- `local` - 从本地文件安装

---

## AIMD Studio 集成

### TypeScript 调用示例

```typescript
// 执行自动计算
async function runAssigner(varData: Record<string, any>) {
  const response = await fetch('http://localhost:4000/api/assigner/assign-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: varData, mode: 'auto' })
  });
  
  const { data } = await response.json();
  return data;
}

// 上传文件
async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:4000/api/files/upload/bytes', {
    method: 'POST',
    body: formData
  });
  
  const { id } = await response.json();
  return id;  // airalogy.id.file.xxx.png
}
```

### Webview 集成流程

1. 用户修改变量值
2. Webview 调用 `/api/assigner/assign-all`
3. 服务器执行所有 `mode="auto"` 的 Assigner
4. 返回计算结果，Webview 更新 UI

---

## 与真实 Airalogy 的关系

本模块使用真实的 `airalogy` SDK 提供类型和 Assigner 功能，仅模拟：
- HTTP API 层 (FastAPI)
- 本地文件存储 (`.airalogy_mock/files/`)
- 本地记录存储 (`.airalogy_mock/records/`)

当 Airalogy Platform API 公开后，只需将 HTTP 请求指向真实端点即可。

---

## 常见问题

### Q: 文件存储在哪里？

本地模式下，文件存储在 `.airalogy_mock/files/` 目录。

### Q: 如何清空测试数据？

```bash
rm -rf .airalogy_mock/
```

### Q: 如何添加新的 Assigner？

在 `assigner.py` 中添加新的 `@assigner` 装饰函数，重启服务器或调用 `/api/assigner/load` 重新加载。

### Q: 端口被占用怎么办？

修改 `airalogy_mock/server.py` 中的端口：

```python
uvicorn.run(app, host="0.0.0.0", port=4001)  # 改为其他端口
```
