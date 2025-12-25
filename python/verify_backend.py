import json
import subprocess
import os
import sys

def test_backend():
    # Start the backend process
    backend_path = os.path.join(os.path.dirname(__file__), "server.py")
    process = subprocess.Popen(
        [sys.executable, backend_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1
    )

    def send_request(method, params=None):
        request = {"jsonrpc": "2.0", "id": 1, "method": method, "params": params or {}}
        process.stdin.write(json.dumps(request) + "\n")
        process.stdin.flush()
        line = process.stdout.readline()
        if not line:
            return None
        return json.loads(line)

    try:
        # 1. Wait for ready signal
        ready = process.stdout.readline()
        print(f"Ready signal: {ready.strip()}")

        # 2. Test hello
        res = send_request("hello", {"name": "Tester"})
        print(f"Hello result: {res}")

        # 3. Test load_project
        project_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "simple_example", "protocol_v5"))
        res = send_request("load_project", {"path": project_dir})
        print(f"Load project result: {res}")

        # 4. Test get_variables
        res = send_request("get_variables")
        print(f"Get variables keys: {list(res['result'].keys())[:5]}...")
        
        # Verify a specific field metadata
        mission_code_meta = res['result'].get('mission_code')
        if mission_code_meta:
            print(f"Mission code title: {mission_code_meta.get('title')}")
            print(f"Mission code description: {mission_code_meta.get('description')}")
        else:
            print("Error: mission_code not found in variables")

        # 5. Test calculate (if airalogy works)
        sample_data = {"a": 10, "b": 20} # Needs real model input for real assigners
        res = send_request("calculate", {"data": sample_data})
        print(f"Calculate result: {res}")

        # Shutdown
        send_request("shutdown")
        process.wait(timeout=2)
        print("Backend shut down successfully")

    finally:
        if process.poll() is None:
            process.terminate()

if __name__ == "__main__":
    test_backend()
