import json
from dataclasses import dataclass
from pathlib import Path
from typing import List


@dataclass
class Alert:
    id: str
    source_ip: str
    severity: str
    category: str


class MiniSoar:
    def __init__(self, alerts_path: Path, actions_log_path: Path) -> None:
        self.alerts_path = alerts_path
        self.actions_log_path = actions_log_path

    def load_alerts(self) -> List[Alert]:
        if not self.alerts_path.exists():
            raise FileNotFoundError(f"No se encontró el archivo de alertas: {self.alerts_path}")

        with self.alerts_path.open("r", encoding="utf-8") as f:
            data = json.load(f)

        alerts: List[Alert] = []
        for item in data:
            alert = Alert(
                id=item.get("id", ""),
                source_ip=item.get("source_ip", ""),
                severity=item.get("severity", "").lower(),
                category=item.get("category", ""),
            )
            alerts.append(alert)
        return alerts

    def select_high_severity(self, alerts: List[Alert]) -> List[Alert]:
        return [a for a in alerts if a.severity == "alta"]

    def ingest_ai_reports(self) -> List[str]:
        """Busca y procesa reportes generados por el Asistente IA (Cap 13)"""
        ai_actions = []
        
        # Buscar en ubicaciones posibles
        search_paths = [
            Path("/cybersentinel/logs"),
            Path("logs"),
            Path.cwd() / "logs"
        ]
        
        latest_report = None
        latest_time = 0
        
        for base_dir in search_paths:
            if base_dir.exists():
                # Buscar patrón ai_security_log_analysis_*.json
                for report_file in base_dir.glob("ai_security_log_analysis_*.json"):
                    mtime = report_file.stat().st_mtime
                    if mtime > latest_time:
                        latest_time = mtime
                        latest_report = report_file
        
        if not latest_report:
            print("ℹ️ No se encontraron reportes recientes de IA.")
            return []
            
        print(f"🤖 Procesando reporte IA: {latest_report.name}")
        try:
            with latest_report.open("r", encoding="utf-8") as f:
                data = json.load(f)
                
            recommendations = data.get("recommendations", [])
            for rec in recommendations:
                if rec.get("action") == "block_ip":
                    ip = rec.get("ip")
                    reason = rec.get("reason")
                    # En un SOAR real, esto podría requerir aprobación manual.
                    # Aquí simulamos que el SOAR lo "propone" para revisión.
                    action = f"PROPOSAL [AI]: BLOCK_IP {ip} (Reason: {reason})"
                    ai_actions.append(action)
                    
        except Exception as e:
            print(f"⚠️ Error leyendo reporte IA: {e}")
            
        return ai_actions

    def simulate_block_ip(self, alert: Alert) -> str:
        action = f"BLOCK_IP {alert.source_ip} from alert {alert.id} ({alert.category})"
        return action

    def run(self) -> None:
        alerts = self.load_alerts()
        high_alerts = self.select_high_severity(alerts)

        lines: List[str] = []
        for alert in high_alerts:
            action = self.simulate_block_ip(alert)
            lines.append(action)
        
        # --- Integración IA ---
        ai_proposals = self.ingest_ai_reports()
        if ai_proposals:
            print(f"✨ Se encontraron {len(ai_proposals)} propuestas de la IA.")
            lines.extend(ai_proposals)
        # ----------------------

        if lines:
            self.actions_log_path.parent.mkdir(parents=True, exist_ok=True)
            with self.actions_log_path.open("a", encoding="utf-8") as log_file:
                for line in lines:
                    log_file.write(line + "\n")
                    print(f"📝 Acción registrada: {line}")


if __name__ == "__main__":
    base_dir = Path(__file__).resolve().parent
    alerts_file = base_dir / "alerts_example.json"
    actions_log = base_dir / "actions.log"

    mini_soar = MiniSoar(alerts_file, actions_log)
    mini_soar.run()

