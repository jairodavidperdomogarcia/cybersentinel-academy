import json
import logging
from datetime import datetime
from typing import Dict, List


class EquifaxLessonAutomator:
    def __init__(self, report_path: str) -> None:
        self.report_path = report_path
        self.setup_logging()
        self.vulnerability_db = self.load_vulnerability_database()

        print("=" * 70)
        print("CYBERSENTINEL MINI-SOAR - CASO EQUIFAX 2017")
        print("Automatizando lo que falló manualmente")
        print("=" * 70)

    def setup_logging(self) -> None:
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler("mini_soar.log", encoding="utf-8"),
                logging.StreamHandler(),
            ],
        )
        self.logger = logging.getLogger(__name__)

    def load_vulnerability_database(self) -> Dict[str, Dict]:
        return {
            "CVE-2017-5638": {
                "name": "Apache Struts RCE",
                "cvss": 10.0,
                "deadline_hours": 24,
                "auto_action": "isolate_if_not_patched",
            },
            "CVE-2021-44228": {
                "name": "Log4Shell",
                "cvss": 10.0,
                "deadline_hours": 4,
                "auto_action": "block_external_access",
            },
        }

    def process_scanner_report(self) -> int:
        self.logger.info("Procesando reporte: %s", self.report_path)

        try:
            with open(self.report_path, "r", encoding="utf-8") as f:
                vulnerabilities = json.load(f)

            critical_vulns: List[Dict] = []

            for vuln in vulnerabilities:
                if vuln.get("cvss_score", 0) >= 9.0:
                    critical_vulns.append(vuln)
                    self.take_immediate_action(vuln)

            self.generate_executive_report(critical_vulns)

            return len(critical_vulns)

        except Exception as e:
            self.logger.error("Error procesando reporte: %s", e)
            return 0

    def take_immediate_action(self, vulnerability: Dict) -> None:
        cve_id = vulnerability.get("cve_id", "UNKNOWN")

        if cve_id in self.vulnerability_db:
            vuln_info = self.vulnerability_db[cve_id]

            self.logger.critical(
                "VULNERABILIDAD CRÍTICA DETECTADA: %s - %s",
                cve_id,
                vuln_info["name"],
            )

            actions: List[str] = []

            if vuln_info["auto_action"] == "isolate_if_not_patched":
                actions.extend(
                    [
                        "Crear ticket de remediación con deadline 24h",
                        "Notificar a equipo de seguridad y operaciones",
                        "Programar escaneo de verificación en 25h",
                        "Si no parcheado en 24h, aislar sistema de red",
                    ]
                )

            elif vuln_info["auto_action"] == "block_external_access":
                actions.extend(
                    [
                        "Bloquear tráfico externo al sistema",
                        "Notificar emergencia a equipo de respuesta",
                        "Iniciar proceso de parcheo inmediato",
                    ]
                )

            for action in actions:
                self.logger.info("   → %s", action)

            self.execute_automated_actions(actions, vulnerability)

    def execute_automated_actions(self, actions: List[str], vuln: Dict) -> None:
        action_log = {
            "timestamp": datetime.now().isoformat(),
            "cve_id": vuln.get("cve_id"),
            "host": vuln.get("host"),
            "actions": actions,
            "status": "simulated_execution",
        }

        with open("automated_actions.log", "a", encoding="utf-8") as f:
            f.write(json.dumps(action_log) + "\n")

        print()
        print(f"Acciones automatizadas registradas para {vuln.get('cve_id')}")
        print("Ver 'automated_actions.log' para detalles")

    def generate_executive_report(self, critical_vulns: List[Dict]) -> None:
        if not critical_vulns:
            print()
            print("No se encontraron vulnerabilidades críticas")
            return

        print()
        print("=" * 70)
        print("REPORTE EJECUTIVO - VULNERABILIDADES CRÍTICAS")
        print("=" * 70)

        for i, vuln in enumerate(critical_vulns, 1):
            print()
            print(f"{i}. {vuln.get('cve_id')} - {vuln.get('name')}")
            print(f"   Host: {vuln.get('host')}")
            print(f"   CVSS: {vuln.get('cvss_score')}/10")
            desc = vuln.get("description", "")
            if desc:
                print(f"   Descripción: {desc[:100]}...")

        print()
        print(f"TOTAL: {len(critical_vulns)} vulnerabilidades críticas")
        print("Acciones automáticas simuladas para cada una")
        print("Log detallado en: mini_soar.log y automated_actions.log")


if __name__ == "__main__":
    automator = EquifaxLessonAutomator("equifax_vuln_report.json")
    automator.process_scanner_report()