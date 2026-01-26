import sys
import subprocess
from pathlib import Path

# Intentar importar el módulo del capítulo anterior para demostrar integración
try:
    cap14_path = Path(__file__).resolve().parents[2] / "capitulo_14_scripting_python"
    sys.path.append(str(cap14_path))
    # from ransomware_response import RansomwareResponder # No lo instanciamos, pero verificamos acceso
    HAS_CAP14 = True
except ImportError:
    HAS_CAP14 = False

class FirewallConnector:
    def block_ip(self, ip: str, reason: str):
        """
        Simula el bloqueo de una IP en el firewall perimetral (o iptables local).
        """
        print(f"[!] FIREWALL: APLICANDO REGLA DE BLOQUEO -> {ip}")
        print(f"    Razón: {reason}")
        
        # Integración Real con lógica del Cap 14
        if HAS_CAP14:
            # Replicamos la lógica de iptables aprendida en Cap 14
            cmd = f"iptables -A INPUT -s {ip} -j DROP"
            print(f"    [INTEGRACIÓN CAP 14] Comando sistema preparado: {cmd}")
            # En un entorno Linux real:
            # subprocess.run(cmd, shell=True, timeout=5)
        
        return {"status": "success", "action": "dropped", "target": ip}
