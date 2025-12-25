"""
Airalogy Mock Server - 本地 HTTP 服务

提供本地文件存储和 HTTP API，配合真实的 airalogy SDK 使用。
"""

# 从真实 airalogy SDK 导出类型和 assigner
from airalogy.types import (
    UserName,
    CurrentTime,
    CurrentRecordId,
    CurrentProtocolId,
    VersionStr,
    RecordId,
    ProtocolId,
    FileIdPNG,
    FileIdJPG,
    FileIdTIFF,
    FileIdPDF,
    FileIdCSV,
    FileIdMP4,
    FileIdMP3,
    FileIdMD,
    FileIdJSON,
    AiralogyMarkdown,
    PyStr,
    IgnoreStr,
)
from airalogy.assigner import assigner, AssignerResult, AssignerBase, DefaultAssigner
from airalogy.models import CheckValue, StepValue

# 本地客户端 (文件/记录存储)
from .client import Airalogy

__version__ = "0.1.0"
__all__ = [
    "Airalogy",
    "UserName", "CurrentTime", "CurrentRecordId", "CurrentProtocolId",
    "VersionStr", "RecordId", "ProtocolId",
    "FileIdPNG", "FileIdJPG", "FileIdTIFF", "FileIdPDF", "FileIdCSV",
    "FileIdMP4", "FileIdMP3", "FileIdMD", "FileIdJSON",
    "AiralogyMarkdown", "PyStr", "IgnoreStr",
    "assigner", "AssignerResult", "AssignerBase", "DefaultAssigner",
    "CheckValue", "StepValue",
]
