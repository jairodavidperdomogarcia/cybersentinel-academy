import sys
from pathlib import Path


cap14_dir = Path(__file__).resolve().parents[2] / "capitulo_14_scripting_python"
sys.path.append(str(cap14_dir))

from ransomware_response import RansomwareResponder


class Cap14Orchestrator:
    def run_ransomware_playbook(self):
        responder = RansomwareResponder()
        result = responder.run_automated_response()
        if not result:
            return {
                "alerts_processed": 0,
                "patient_zero": None,
                "actions_taken": [],
                "report_path": None,
            }
        return result