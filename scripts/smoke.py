"""Read-only StudioNet smoke check using the current GenLayer CLI calldata format."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).parents[1]
deployment = json.loads((ROOT / "deployment.json").read_text(encoding="utf-8"))
address = deployment["contractAddress"]


def call(method: str, *args: str) -> str:
    command = ["genlayer", "call", address, method]
    if args:
        command.extend(["--args", *args])
    return subprocess.check_output(command, text=True, encoding="utf-8")


summary = call("get_summary")
record = call("get_prism", "PRISM-CLI")
assert "adversarial category coverage" in summary
assert "PRISM-CLI" in record and "Neighborhood battery rollout" in record
print(json.dumps({
    "contract": address,
    "recordId": "PRISM-CLI",
    "openTransaction": "0xfe0082c310afc56cc78abe7037b877a9595325c7d0c5f98e1e17684ca9d65c00",
    "result": "PASS",
    "walletDisclosure": "All demonstration wallets and text are operator-controlled."
}, indent=2))
