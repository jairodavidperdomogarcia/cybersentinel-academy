# /cybersentinel/scripts/ransomware_response.py
import json
import subprocess
import os
from datetime import datetime
import logging

try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False

class RansomwareResponder:
    def __init__(self):
        self.elastic_url = "http://localhost:9200"
        self.wazuh_url = "http://localhost:55000"
        self.suricata_socket = "/var/run/suricata/suricata-command.socket"

        # Configurar logging seguro (fallback a local si no existe /cybersentinel)
        log_dir = "/cybersentinel/logs"
        if not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except (OSError, PermissionError):
                log_dir = "logs"
                os.makedirs(log_dir, exist_ok=True)
        
        log_file = os.path.join(log_dir, "automation.log")

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(),
            ],
        )
        self.logger = logging.getLogger(__name__)

        self.logger.info("Iniciando RansomwareResponder en emulador CyberSentinel")

    def query_ransomware_alerts(self, minutes=10):
        if not REQUESTS_AVAILABLE:
            self.logger.warning("Librería 'requests' no encontrada. Modo Offline: Cargando alertas simuladas.")
            return self.load_sample_alerts()

        query = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"rule.description": "ransomware"}},
                        {"range": {"@timestamp": {"gte": f"now-{minutes}m"}}},
                    ]
                }
            },
            "sort": [{"@timestamp": "desc"}],
            "size": 100,
        }

        try:
            response = requests.get(
                f"{self.elastic_url}/wazuh-alerts-*/_search",
                json=query,
                auth=("elastic", "cybersentinel"),
                timeout=2, # Timeout corto para no bloquear si no hay Elastic real
            )

            if response.status_code == 200:
                alerts = response.json()["hits"]["hits"]
                self.logger.info("Encontradas %s alertas de ransomware", len(alerts))
                return alerts
            else:
                self.logger.error("Error consultando Elastic: %s", response.status_code)
                return self.load_sample_alerts() # Fallback si falla la query

        except Exception as e:
            self.logger.error("Error de conexión a Elastic: %s. Usando datos simulados.", e)
            return self.load_sample_alerts()

    def load_sample_alerts(self):
        self.logger.info("Cargando alertas de ejemplo del emulador")

        now = datetime.now().isoformat()

        return [
            {
                "_source": {
                    "agent": {"name": "win-server-01"},
                    "rule": {
                        "description": "Ransomware: WannaCry pattern detected",
                    },
                    "data": {"win": {"eventdata": {"file": "\\temp\\wcry.exe"}}},
                    "@timestamp": now,
                }
            },
            {
                "_source": {
                    "agent": {"name": "win-workstation-05"},
                    "rule": {"description": "Ransomware: LockBit behavior"},
                    "data": {
                        "win": {
                            "eventdata": {"file": "C:\\Users\\Admin\\bitlocker.exe"}
                        }
                    },
                    "@timestamp": now,
                }
            },
        ]

    def identify_patient_zero(self, alerts):
        if not alerts:
            return None

        sorted_alerts = sorted(alerts, key=lambda x: x["_source"]["@timestamp"])

        patient_zero = sorted_alerts[0]["_source"]["agent"]["name"]
        self.logger.warning("Paciente cero identificado: %s", patient_zero)

        return patient_zero

    def isolate_machine(self, machine_name):
        self.logger.critical("Aislando máquina: %s", machine_name)

        commands = [
            f"echo 'Aislando {machine_name}' >> /cybersentinel/logs/containment.log",
            f"iptables -A FORWARD -s {self.get_machine_ip(machine_name)} -j DROP",
            f"echo '{datetime.now()}: {machine_name} aislada' >> /var/log/cybersentinel.log",
        ]

        for cmd in commands:
            try:
                result = subprocess.run(
                    cmd, shell=True, capture_output=True, text=True, timeout=5
                )
                if result.returncode == 0:
                    self.logger.info("Comando ejecutado: %s", cmd)
                else:
                    self.logger.error("Error en comando: %s", result.stderr)
            except Exception as e:
                self.logger.error("Excepción ejecutando comando: %s", e)

        return True

    def get_machine_ip(self, machine_name):
        ip_map = {
            "win-server-01": "10.0.1.10",
            "win-workstation-05": "10.0.1.25",
            "linux-db-01": "10.0.2.10",
            "kali-attacker": "10.0.99.100",
        }

        return ip_map.get(machine_name, "10.0.1.99")

    def block_malicious_traffic(self):
        self.logger.info("Bloqueando tráfico malicioso")

        malicious_ips = ["10.0.99.100", "192.168.1.150", "45.33.22.11"]
        malicious_ports = ["445", "139", "3389"]

        for ip in malicious_ips:
            cmd = f"iptables -A INPUT -s {ip} -j DROP"
            try:
                subprocess.run(cmd, shell=True, timeout=5)
                self.logger.info("IP bloqueada: %s", ip)
            except Exception as e:
                self.logger.error("Error bloqueando IP %s: %s", ip, e)

        return len(malicious_ips)

    def generate_incident_report(self, alerts, patient_zero, actions_taken):
        report = {
            "incident_id": f"INC-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "scenario": "ransomware-day1",
            "business_assumptions": {
                "downtime_hours": 24,
                "employees_affected": 50,
                "cost_per_hour": 100,
                "annual_probability": 0.3,
                "automation_cost": 50000,
                "time_saved_hours": 8,
                "incidents_per_year": 5,
            },
            "summary": {
                "total_alerts": len(alerts),
                "patient_zero": patient_zero,
                "containment_time": datetime.now().strftime("%H:%M:%S"),
                "actions": actions_taken,
            },
            "details": [
                {
                    "alert": alert["_source"]["rule"]["description"],
                    "machine": alert["_source"]["agent"]["name"],
                    "time": alert["_source"]["@timestamp"],
                }
                for alert in alerts[:5]
            ],
        }

        report_path = f"/cybersentinel/logs/incident_{report['incident_id']}.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)

        self.logger.info("Reporte generado: %s", report_path)

        print()
        print("=" * 60)
        print("INCIDENT REPORT - EMULADOR CYBERSENTINEL")
        print("=" * 60)
        print(f"ID: {report['incident_id']}")
        print(f"Scenario: {report['scenario']}")
        print(f"Alerts: {report['summary']['total_alerts']}")
        print(f"Patient Zero: {report['summary']['patient_zero']}")
        print(f"Containment Time: {report['summary']['containment_time']}")
        print("=" * 60)

        return report_path

    def run_automated_response(self):
        self.logger.critical("Iniciando respuesta automatizada a ransomware")

        alerts = self.query_ransomware_alerts(minutes=15)

        if not alerts:
            self.logger.info("No hay alertas de ransomware activas")
            return None

        patient_zero = self.identify_patient_zero(alerts)

        actions_taken = []

        if patient_zero:
            actions_taken.append(f"Aislamiento de {patient_zero}")
            self.isolate_machine(patient_zero)

        blocked_ips = self.block_malicious_traffic()
        actions_taken.append(f"Bloqueo de {blocked_ips} IPs maliciosas")

        report_path = self.generate_incident_report(alerts, patient_zero, actions_taken)

        self.logger.critical("Respuesta automatizada completada")

        return {
            "alerts_processed": len(alerts),
            "patient_zero": patient_zero,
            "actions_taken": actions_taken,
            "report_path": report_path,
        }


if __name__ == "__main__":
    print("BIENVENIDO AL EMULADOR CYBERSENTINEL - CAPÍTULO 14")
    print("Ejecutando script de respuesta a ransomware...")
    print("-" * 60)

    responder = RansomwareResponder()
    result = responder.run_automated_response()

    if result:
        print()
        print("RESULTADOS DE LA AUTOMATIZACIÓN:")
        print(f"   Alertas procesadas: {result['alerts_processed']}")
        print(f"   Paciente cero: {result['patient_zero']}")
        print(f"   Acciones tomadas: {len(result['actions_taken'])}")
        print(f"   Reporte: {result['report_path']}")

        print()
        print("PRÓXIMOS PASOS EN EL EMULADOR:")
        print("   1. Revisar logs: tail -f /cybersentinel/logs/automation.log")
        print("   2. Verificar reglas iptables: iptables -L -n")
        print("   3. Cargar nuevo escenario: ./cybersentinel-emulator load-scenario apt29")

