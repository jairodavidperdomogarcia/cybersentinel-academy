import json
import logging
import os
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List


class SuricataAutomator:
    def __init__(
        self,
        eve_json_path: str = "/var/log/suricata/eve.json",
        log_dir: str = "/cybersentinel/logs",
    ) -> None:
        self.eve_json_path = eve_json_path

        if not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except (OSError, PermissionError):
                log_dir = "logs"
                os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, "suricata_automator.log")

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(),
            ],
        )
        self.logger = logging.getLogger(__name__)

        self.logger.info("Iniciando SuricataAutomator con archivo %s", self.eve_json_path)

    def load_events(self) -> List[Dict[str, Any]]:
        path = Path(self.eve_json_path)
        events: List[Dict[str, Any]] = []

        if not path.exists():
            self.logger.warning(
                "No se encontró %s. Usando eventos simulados para el emulador.",
                self.eve_json_path,
            )
            return self.load_sample_events()

        try:
            with path.open("r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        event = json.loads(line)
                        events.append(event)
                    except json.JSONDecodeError:
                        continue

            self.logger.info("Eventos cargados desde Suricata: %s", len(events))
            return events
        except Exception as e:
            self.logger.error("Error leyendo eve.json: %s. Usando datos simulados.", e)
            return self.load_sample_events()

    def load_sample_events(self) -> List[Dict[str, Any]]:
        now = datetime.now().isoformat()
        return [
            {
                "timestamp": now,
                "event_type": "alert",
                "src_ip": "10.0.99.100",
                "dest_ip": "10.0.1.10",
                "alert": {
                    "signature": "ET TROJAN Possible Ransomware Command and Control Traffic",
                    "severity": 2,
                    "category": "Potentially Bad Traffic",
                },
            },
            {
                "timestamp": now,
                "event_type": "alert",
                "src_ip": "192.168.1.150",
                "dest_ip": "10.0.1.25",
                "alert": {
                    "signature": "ET SCAN Potential SSH Scan",
                    "severity": 3,
                    "category": "Attempted Information Leak",
                },
            },
        ]

    def select_relevant_alerts(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        relevant: List[Dict[str, Any]] = []
        for ev in events:
            if ev.get("event_type") != "alert":
                continue

            alert = ev.get("alert", {})
            severity = alert.get("severity", 0)
            signature = (alert.get("signature") or "").lower()

            if severity <= 2:
                continue

            if any(keyword in signature for keyword in ("ransomware", "trojan", "bruteforce", "credential")):
                relevant.append(ev)

        self.logger.info("Alertas relevantes detectadas: %s", len(relevant))
        return relevant

    def block_ip(self, ip: str) -> bool:
        cmd = f"iptables -A INPUT -s {ip} -j DROP"
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=5,
            )
            if result.returncode == 0:
                self.logger.info("IP bloqueada desde SuricataAutomator: %s", ip)
                return True

            self.logger.error("Error bloqueando IP %s: %s", ip, result.stderr)
            return False
        except Exception as e:
            self.logger.error("Excepción bloqueando IP %s: %s", ip, e)
            return False

    def monitor_and_block(self) -> Dict[str, Any]:
        events = self.load_events()
        relevant_alerts = self.select_relevant_alerts(events)

        blocked_ips: List[str] = []
        unique_ips = {ev.get("src_ip") for ev in relevant_alerts if ev.get("src_ip")}

        for ip in unique_ips:
            if self.block_ip(ip):
                blocked_ips.append(ip)

        summary = {
            "total_events": len(events),
            "relevant_alerts": len(relevant_alerts),
            "blocked_ips": blocked_ips,
            "timestamp": datetime.now().isoformat(),
        }

        self.logger.info(
            "Resumen SuricataAutomator: eventos=%s, alertas_relevantes=%s, ips_bloqueadas=%s",
            summary["total_events"],
            summary["relevant_alerts"],
            len(blocked_ips),
        )

        print()
        print("=" * 60)
        print("SURICATA AUTOMATOR - EMULADOR CYBERSENTINEL")
        print("=" * 60)
        print(f"Eventos procesados: {summary['total_events']}")
        print(f"Alertas relevantes: {summary['relevant_alerts']}")
        print(f"IPs bloqueadas: {len(blocked_ips)}")
        if blocked_ips:
            print("Lista de IPs bloqueadas:")
            for ip in blocked_ips:
                print(f"  - {ip}")
        print("=" * 60)

        return summary


if __name__ == "__main__":
    automator = SuricataAutomator()
    automator.monitor_and_block()