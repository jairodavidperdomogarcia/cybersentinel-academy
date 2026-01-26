import json
import logging
import os
import subprocess
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Set


class CredentialStuffingResponder:
    def __init__(
        self,
        attack_log_path: str = "/cybersentinel/logs/credential_stuffing.log",
        log_dir: str = "/cybersentinel/logs",
    ) -> None:
        self.attack_log_path = attack_log_path

        if not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except (OSError, PermissionError):
                log_dir = "logs"
                os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, "credential_stuffing_responder.log")

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(),
            ],
        )
        self.logger = logging.getLogger(__name__)

        self.logger.info("Iniciando CredentialStuffingResponder con log %s", self.attack_log_path)

    def load_attack_log(self) -> List[Dict[str, Any]]:
        path = Path(self.attack_log_path)
        events: List[Dict[str, Any]] = []

        if not path.exists():
            self.logger.warning(
                "No se encontró %s. Usando eventos simulados para el emulador.",
                self.attack_log_path,
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

            self.logger.info("Eventos de credential stuffing cargados: %s", len(events))
            return events
        except Exception as e:
            self.logger.error("Error leyendo log de ataques: %s. Usando datos simulados.", e)
            return self.load_sample_events()

    def load_sample_events(self) -> List[Dict[str, Any]]:
        now = datetime.now().isoformat()
        return [
            {
                "timestamp": now,
                "username": "juan.perez",
                "src_ip": "10.0.99.100",
                "status": "failed",
            },
            {
                "timestamp": now,
                "username": "juan.perez",
                "src_ip": "10.0.99.100",
                "status": "failed",
            },
            {
                "timestamp": now,
                "username": "juan.perez",
                "src_ip": "45.33.22.11",
                "status": "failed",
            },
            {
                "timestamp": now,
                "username": "maria.admin",
                "src_ip": "192.168.1.150",
                "status": "failed",
            },
        ]

    def identify_attacked_accounts(
        self, events: List[Dict[str, Any]], min_failures: int = 3, min_ips: int = 2
    ) -> Dict[str, Dict[str, Any]]:
        failures_by_user: Dict[str, int] = defaultdict(int)
        ips_by_user: Dict[str, Set[str]] = defaultdict(set)

        for ev in events:
            if ev.get("status") != "failed":
                continue
            user = ev.get("username")
            ip = ev.get("src_ip")
            if not user or not ip:
                continue
            failures_by_user[user] += 1
            ips_by_user[user].add(ip)

        attacked_accounts: Dict[str, Dict[str, Any]] = {}

        for user, count in failures_by_user.items():
            unique_ips = ips_by_user[user]
            if count >= min_failures and len(unique_ips) >= min_ips:
                attacked_accounts[user] = {
                    "failures": count,
                    "ips": list(unique_ips),
                }

        self.logger.info("Cuentas bajo ataque identificadas: %s", len(attacked_accounts))
        return attacked_accounts

    def block_origin_ips(self, ips: Set[str]) -> List[str]:
        blocked: List[str] = []

        for ip in ips:
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
                    self.logger.info("IP bloqueada por credential stuffing: %s", ip)
                    blocked.append(ip)
                else:
                    self.logger.error("Error bloqueando IP %s: %s", ip, result.stderr)
            except Exception as e:
                self.logger.error("Excepción bloqueando IP %s: %s", ip, e)

        return blocked

    def apply_account_protections(self, accounts: Dict[str, Dict[str, Any]]) -> List[Dict[str, Any]]:
        actions: List[Dict[str, Any]] = []

        for user, info in accounts.items():
            action = {
                "username": user,
                "forced_password_reset": True,
                "temporary_mfa_required": True,
                "reason": "credential_stuffing_detected",
                "failures": info.get("failures", 0),
                "ips": info.get("ips", []),
                "timestamp": datetime.now().isoformat(),
            }
            actions.append(action)
            self.logger.warning(
                "Protecciones aplicadas para cuenta %s (intentos fallidos=%s, ips=%s)",
                user,
                action["failures"],
                len(action["ips"]),
            )

        return actions

    def write_actions_log(self, actions: List[Dict[str, Any]], log_dir: str = "/cybersentinel/logs") -> str:
        if not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except (OSError, PermissionError):
                log_dir = "logs"
                os.makedirs(log_dir, exist_ok=True)

        path = os.path.join(log_dir, "credential_stuffing_actions.log")

        with open(path, "a", encoding="utf-8") as f:
            for action in actions:
                f.write(json.dumps(action) + "\n")

        self.logger.info("Acciones de protección registradas en %s", path)
        return path

    def handle_attack(self) -> Dict[str, Any]:
        events = self.load_attack_log()
        attacked_accounts = self.identify_attacked_accounts(events)

        ips_to_block: Set[str] = set()
        for info in attacked_accounts.values():
            for ip in info.get("ips", []):
                ips_to_block.add(ip)

        blocked_ips = self.block_origin_ips(ips_to_block)
        protection_actions = self.apply_account_protections(attacked_accounts)
        actions_log_path = self.write_actions_log(protection_actions)

        summary = {
            "events_processed": len(events),
            "accounts_under_attack": len(attacked_accounts),
            "blocked_ips": blocked_ips,
            "actions_logged": len(protection_actions),
            "actions_log_path": actions_log_path,
        }

        print()
        print("=" * 60)
        print("CREDENTIAL STUFFING RESPONDER - EMULADOR CYBERSENTINEL")
        print("=" * 60)
        print(f"Eventos procesados: {summary['events_processed']}")
        print(f"Cuentas bajo ataque: {summary['accounts_under_attack']}")
        print(f"IPs bloqueadas: {len(summary['blocked_ips'])}")
        print(f"Acciones registradas: {summary['actions_logged']}")
        print(f"Log de acciones: {summary['actions_log_path']}")
        print("=" * 60)

        return summary


if __name__ == "__main__":
    responder = CredentialStuffingResponder()
    responder.handle_attack()