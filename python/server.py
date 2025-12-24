#!/usr/bin/env python3
"""
AIMD Studio Python Backend Server

A minimal JSON-RPC server that communicates via stdio (stdin/stdout).
This is the "Hello World" implementation for the Binary Sidecar pattern.

Communication Protocol:
- Request:  {"jsonrpc": "2.0", "id": 1, "method": "hello", "params": {"name": "World"}}
- Response: {"jsonrpc": "2.0", "id": 1, "result": {"message": "Hello, World!"}}
"""

import json
import sys
from datetime import datetime
from typing import Any, Dict, Optional


def log_stderr(message: str) -> None:
    """Log to stderr (will be captured by VS Code output channel)."""
    print(f"[{datetime.now().isoformat()}] {message}", file=sys.stderr, flush=True)


def handle_request(method: str, params: Optional[Dict[str, Any]] = None) -> Any:
    """
    Route JSON-RPC method calls to handler functions.
    
    Args:
        method: The RPC method name
        params: Optional dictionary of parameters
        
    Returns:
        The result to send back to the client
    """
    params = params or {}
    
    if method == "hello":
        name = params.get("name", "World")
        log_stderr(f"Received hello request for: {name}")
        return {
            "message": f"Hello, {name}! 🐍 Greetings from Python backend.",
            "timestamp": datetime.now().isoformat(),
            "python_version": sys.version
        }
    
    elif method == "echo":
        # Simple echo for testing
        return {"echo": params}
    
    elif method == "shutdown":
        log_stderr("Shutdown requested, exiting...")
        sys.exit(0)
    
    else:
        raise ValueError(f"Unknown method: {method}")


def create_response(request_id: Any, result: Any = None, error: Optional[Dict] = None) -> str:
    """Create a JSON-RPC 2.0 response."""
    response: Dict[str, Any] = {
        "jsonrpc": "2.0",
        "id": request_id
    }
    
    if error:
        response["error"] = error
    else:
        response["result"] = result
    
    return json.dumps(response)


def create_error(code: int, message: str, data: Any = None) -> Dict[str, Any]:
    """Create a JSON-RPC error object."""
    error: Dict[str, Any] = {"code": code, "message": message}
    if data is not None:
        error["data"] = data
    return error


def main() -> None:
    """Main server loop - read requests from stdin, write responses to stdout."""
    log_stderr("AIMD Backend Server starting...")
    log_stderr(f"Python version: {sys.version}")
    
    # Send a ready signal
    ready_notification = json.dumps({
        "jsonrpc": "2.0",
        "method": "$/ready",
        "params": {"status": "ok"}
    })
    print(ready_notification, flush=True)
    log_stderr("Server ready, waiting for requests...")
    
    while True:
        try:
            # Read a line from stdin (blocking)
            line = sys.stdin.readline()
            
            if not line:
                # EOF reached, exit gracefully
                log_stderr("EOF received, shutting down.")
                break
            
            line = line.strip()
            if not line:
                continue
            
            log_stderr(f"Received: {line[:100]}...")  # Log first 100 chars
            
            # Parse JSON-RPC request
            try:
                request = json.loads(line)
            except json.JSONDecodeError as e:
                error_response = create_response(
                    None,
                    error=create_error(-32700, "Parse error", str(e))
                )
                print(error_response, flush=True)
                continue
            
            # Validate request
            request_id = request.get("id")
            method = request.get("method")
            params = request.get("params")
            
            if not method:
                error_response = create_response(
                    request_id,
                    error=create_error(-32600, "Invalid Request", "Missing 'method' field")
                )
                print(error_response, flush=True)
                continue
            
            # Handle the request
            try:
                result = handle_request(method, params)
                response = create_response(request_id, result=result)
            except ValueError as e:
                response = create_response(
                    request_id,
                    error=create_error(-32601, "Method not found", str(e))
                )
            except Exception as e:
                log_stderr(f"Error handling request: {e}")
                response = create_response(
                    request_id,
                    error=create_error(-32603, "Internal error", str(e))
                )
            
            # Send response
            print(response, flush=True)
            log_stderr(f"Sent response for id={request_id}")
            
        except KeyboardInterrupt:
            log_stderr("Interrupted, shutting down.")
            break
        except Exception as e:
            log_stderr(f"Unexpected error: {e}")
            continue
    
    log_stderr("Server stopped.")


if __name__ == "__main__":
    main()
