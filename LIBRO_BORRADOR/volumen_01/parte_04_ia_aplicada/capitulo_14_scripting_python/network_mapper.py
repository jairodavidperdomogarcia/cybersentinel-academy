import argparse
import ipaddress
import json
import logging
import os
import socket
import subprocess
from datetime import datetime
from typing import Any, Dict, List


class NetworkMapper:
    def __init__(self, network_cidr: str, ports: List[int], max_hosts: int = 256, timeout: float = 0.8) -> None:
        self.network = ipaddress.ip_network(network_cidr, strict=False)
        self.ports = ports
        self.max_hosts = max_hosts
        self.timeout = timeout

        log_dir = "/cybersentinel/logs"
        if not os.path.exists(log_dir):
            try:
                os.makedirs(log_dir, exist_ok=True)
            except (OSError, PermissionError):
                log_dir = "logs"
                os.makedirs(log_dir, exist_ok=True)

        log_file = os.path.join(log_dir, "network_mapper.log")

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler(),
            ],
        )
        self.logger = logging.getLogger(__name__)

        self.logger.info("Iniciando NetworkMapper para la red %s", self.network)

    def ping_host(self, ip: str) -> bool:
        if os.name == "nt":
            cmd = ["ping", "-n", "1", "-w", str(int(self.timeout * 1000)), ip]
        else:
            cmd = ["ping", "-c", "1", "-W", str(int(self.timeout)), ip]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=self.timeout + 1)
            reachable = result.returncode == 0
            if reachable:
                self.logger.info("Host alcanzable: %s", ip)
            else:
                self.logger.debug("Host no responde: %s", ip)
            return reachable
        except Exception as e:
            self.logger.error("Error haciendo ping a %s: %s", ip, e)
            return False

    def scan_host_ports(self, ip: str) -> List[int]:
        open_ports: List[int] = []
        for port in self.ports:
            try:
                with socket.create_connection((ip, port), timeout=self.timeout):
                    open_ports.append(port)
                    self.logger.info("Puerto abierto detectado en %s:%s", ip, port)
            except (OSError, socket.timeout):
                continue
        return open_ports

    def scan_emulator_network(self) -> Dict[str, Any]:
        hosts_iterator = self.network.hosts()
        hosts: List[str] = []

        for i, host in enumerate(hosts_iterator):
            if i >= self.max_hosts:
                self.logger.warning(
                    "La red %s tiene más hosts de los configurados (%s). Se escanearán solo los primeros.",
                    self.network,
                    self.max_hosts,
                )
                break
            hosts.append(str(host))

        self.logger.info("Iniciando escaneo de %s hosts en puertos %s", len(hosts), self.ports)

        mapped_hosts: List[Dict[str, Any]] = []

        for ip in hosts:
            reachable = self.ping_host(ip)
            open_ports = self.scan_host_ports(ip) if reachable else []
            host_info = {
                "ip": ip,
                "reachable": reachable,
                "open_ports": open_ports,
            }
            mapped_hosts.append(host_info)

        network_map: Dict[str, Any] = {
            "network": str(self.network),
            "scanned_hosts": len(mapped_hosts),
            "ports": self.ports,
            "hosts": mapped_hosts,
            "generated_at": datetime.now().isoformat(),
        }

        report_path = self.write_report(network_map)
        self.logger.info("Mapa de red generado en %s", report_path)

        return network_map

    def write_report(self, network_map: Dict[str, Any]) -> str:
        base_dir = "/cybersentinel/logs"
        if not os.path.exists(base_dir):
            try:
                os.makedirs(base_dir, exist_ok=True)
            except (OSError, PermissionError):
                base_dir = "logs"
                os.makedirs(base_dir, exist_ok=True)

        incident_id = datetime.now().strftime("NETMAP-%Y%m%d-%H%M%S")
        report_path = os.path.join(base_dir, f"network_map_{incident_id}.json")

        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(network_map, f, indent=2)

        print()
        print("=" * 60)
        print("MAPA DE ACTIVOS - EMULADOR CYBERSENTINEL")
        print("=" * 60)
        print(f"Red escaneada: {network_map['network']}")
        print(f"Hosts escaneados: {network_map['scanned_hosts']}")
        reachable_hosts = [h for h in network_map["hosts"] if h["reachable"]]
        print(f"Hosts alcanzables: {len(reachable_hosts)}")
        print(f"Puertos revisados: {', '.join(str(p) for p in network_map['ports'])}")
        print(f"Archivo de salida: {report_path}")
        print("=" * 60)

        return report_path


def parse_ports(value: str) -> List[int]:
    parts = [p.strip() for p in value.split(",") if p.strip()]
    return [int(p) for p in parts]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="NetworkMapper - Escaneo de red del emulador CyberSentinel"
    )
    parser.add_argument(
        "--network",
        default="10.0.0.0/16",
        help="Red a escanear en formato CIDR (por defecto: 10.0.0.0/16)",
    )
    parser.add_argument(
        "--ports",
        default="22,80,443",
        help="Lista de puertos a revisar, separados por comas (por defecto: 22,80,443)",
    )
    parser.add_argument(
        "--max-hosts",
        type=int,
        default=256,
        help="Número máximo de hosts a escanear dentro de la red",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=0.8,
        help="Tiempo de espera en segundos para ping y conexiones",
    )

    args = parser.parse_args()
    ports_list = parse_ports(args.ports)

    print("BIENVENIDO AL EMULADOR CYBERSENTINEL - CAPÍTULO 14")
    print("Ejecutando NetworkMapper para mapeo de activos...")
    print("-" * 60)

    mapper = NetworkMapper(
        network_cidr=args.network,
        ports=ports_list,
        max_hosts=args.max_hosts,
        timeout=args.timeout,
    )
    mapper.scan_emulator_network()