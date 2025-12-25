"""
Airalogy Client - 本地文件/记录存储

提供本地文件存储和记录管理，用于开发测试。
"""

import os
import json
import uuid
import base64
from pathlib import Path
from datetime import datetime
from typing import Optional


def _generate_user_id(name: str = "mock-user") -> str:
    """生成模拟用户 ID"""
    return f"airalogy.id.user.{name}"


def _generate_record_id(version: int = 1) -> str:
    """生成模拟记录 ID"""
    return f"airalogy.id.record.{uuid.uuid4()}.v.{version}"


class Airalogy:
    """
    Airalogy 客户端 - 本地模拟版
    
    文件存储在 .airalogy_mock/files/ 目录
    记录存储在 .airalogy_mock/records/ 目录
    """
    
    def __init__(
        self,
        endpoint: str = None,
        api_key: str = None,
        protocol_id: str = None,
        storage_dir: str = None,
    ):
        """
        初始化客户端
        
        Args:
            endpoint: API 端点 (模拟模式下忽略)
            api_key: API 密钥 (模拟模式下忽略)
            protocol_id: 协议 ID
            storage_dir: 本地存储目录，默认 .airalogy_mock
        """
        self.endpoint = endpoint or os.environ.get("AIRALOGY_ENDPOINT", "http://localhost:4000")
        self.api_key = api_key or os.environ.get("AIRALOGY_API_KEY", "mock-api-key")
        self.protocol_id = protocol_id or os.environ.get(
            "AIRALOGY_PROTOCOL_ID",
            "airalogy.id.lab.mock.project.dev.protocol.test.v.0.0.1"
        )
        
        # 本地存储目录
        self.storage_dir = Path(storage_dir or ".airalogy_mock")
        self.files_dir = self.storage_dir / "files"
        self.records_dir = self.storage_dir / "records"
        
        # 确保目录存在
        self.files_dir.mkdir(parents=True, exist_ok=True)
        self.records_dir.mkdir(parents=True, exist_ok=True)
        
        # 当前用户 (模拟)
        self._current_user = _generate_user_id("mock-user")
    
    # ========================================================
    # 文件操作
    # ========================================================
    
    def upload_file_bytes(self, file_name: str, file_bytes: bytes) -> dict:
        """
        上传文件 (bytes)
        
        Args:
            file_name: 文件名 (必须包含扩展名)
            file_bytes: 文件内容
        
        Returns:
            {"id": "airalogy.id.file.xxx.ext", "file_name": "..."}
        """
        ext = Path(file_name).suffix.lstrip(".")
        if not ext:
            raise ValueError("file_name must include extension")
        
        file_id = f"airalogy.id.file.{uuid.uuid4()}.{ext}"
        
        # 保存文件
        file_path = self.files_dir / file_id
        file_path.write_bytes(file_bytes)
        
        # 保存元数据
        meta_path = self.files_dir / f"{file_id}.meta.json"
        meta_path.write_text(json.dumps({
            "id": file_id,
            "file_name": file_name,
            "size": len(file_bytes),
            "uploaded_at": datetime.now().isoformat(),
            "uploaded_by": str(self._current_user),
        }, ensure_ascii=False, indent=2))
        
        return {"id": file_id, "file_name": file_name}
    
    def upload_file_base64(self, file_name: str, file_base64: str) -> dict:
        """上传文件 (base64)"""
        file_bytes = base64.b64decode(file_base64)
        return self.upload_file_bytes(file_name, file_bytes)
    
    def download_file_bytes(self, file_id: str) -> bytes:
        """下载文件 (bytes)"""
        file_path = self.files_dir / file_id
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_id}")
        return file_path.read_bytes()
    
    def download_file_base64(self, file_id: str) -> str:
        """下载文件 (base64)"""
        file_bytes = self.download_file_bytes(file_id)
        return base64.b64encode(file_bytes).decode()
    
    def get_file_url(self, file_id: str) -> str:
        """获取文件临时 URL (本地模式返回 file:// URL)"""
        file_path = self.files_dir / file_id
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_id}")
        return f"file://{file_path.absolute()}"
    
    def delete_file(self, file_id: str) -> bool:
        """删除文件"""
        file_path = self.files_dir / file_id
        meta_path = self.files_dir / f"{file_id}.meta.json"
        
        deleted = False
        if file_path.exists():
            file_path.unlink()
            deleted = True
        if meta_path.exists():
            meta_path.unlink()
        
        return deleted
    
    def list_files(self) -> list[dict]:
        """列出所有文件"""
        files = []
        for meta_file in self.files_dir.glob("*.meta.json"):
            meta = json.loads(meta_file.read_text())
            files.append(meta)
        return files
    
    # ========================================================
    # 记录操作
    # ========================================================
    
    def create_record(self, data: dict, record_id: str = None) -> dict:
        """
        创建记录
        
        Args:
            data: 记录数据
            record_id: 可选的记录 ID，不提供则自动生成
        
        Returns:
            {"id": "airalogy.id.record.xxx.v.1", "data": {...}}
        """
        if record_id is None:
            record_id = _generate_record_id(version=1)
        
        record = {
            "id": record_id,
            "protocol_id": self.protocol_id,
            "data": data,
            "created_at": datetime.now().isoformat(),
            "created_by": str(self._current_user),
            "updated_at": datetime.now().isoformat(),
        }
        
        # 保存记录
        record_path = self.records_dir / f"{record_id}.json"
        record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2))
        
        return record
    
    def update_record(self, record_id: str, data: dict) -> dict:
        """更新记录"""
        record_path = self.records_dir / f"{record_id}.json"
        if not record_path.exists():
            raise FileNotFoundError(f"Record not found: {record_id}")
        
        record = json.loads(record_path.read_text())
        record["data"].update(data)
        record["updated_at"] = datetime.now().isoformat()
        
        record_path.write_text(json.dumps(record, ensure_ascii=False, indent=2))
        return record
    
    def get_record(self, record_id: str) -> dict:
        """获取单条记录"""
        record_path = self.records_dir / f"{record_id}.json"
        if not record_path.exists():
            raise FileNotFoundError(f"Record not found: {record_id}")
        return json.loads(record_path.read_text())
    
    def download_records_json(self, record_ids: list[str]) -> str:
        """下载多条记录 (JSON 字符串)"""
        records = []
        for rid in record_ids:
            try:
                record = self.get_record(rid)
                records.append(record["data"])
            except FileNotFoundError:
                pass
        return json.dumps(records, ensure_ascii=False)
    
    def list_records(self) -> list[dict]:
        """列出所有记录"""
        records = []
        for record_file in self.records_dir.glob("*.json"):
            record = json.loads(record_file.read_text())
            records.append({
                "id": record["id"],
                "created_at": record["created_at"],
                "updated_at": record["updated_at"],
            })
        return records
    
    def delete_record(self, record_id: str) -> bool:
        """删除记录"""
        record_path = self.records_dir / f"{record_id}.json"
        if record_path.exists():
            record_path.unlink()
            return True
        return False
    
    # ========================================================
    # 上下文信息
    # ========================================================
    
    def get_current_user(self) -> str:
        """获取当前用户"""
        return str(self._current_user)
    
    def get_current_time(self) -> str:
        """获取当前时间"""
        return datetime.now().isoformat()
    
    def get_protocol_id(self) -> str:
        """获取当前协议 ID"""
        return self.protocol_id
