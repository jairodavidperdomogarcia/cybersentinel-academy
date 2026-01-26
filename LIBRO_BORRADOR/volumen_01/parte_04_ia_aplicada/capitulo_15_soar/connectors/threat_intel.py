import random
import time

class ThreatIntel:
    def check_ip(self, ip: str):
        """
        Simula una consulta a una API de Threat Intelligence (ej. VirusTotal, AbuseIPDB).
        """
        print(f"[*] ThreatIntel: Analizando IP {ip}...")
        time.sleep(1) # Simular latencia de red
        
        # Simulación: IPs que terminan en número par son "maliciosas" para el demo
        last_octet = int(ip.split('.')[-1])
        
        if last_octet % 2 == 0:
            return {
                "reputation": "MALICIOUS",
                "confidence": 95,
                "category": "Botnet/Scanner",
                "last_seen": "2023-10-27"
            }
        else:
            return {
                "reputation": "CLEAN",
                "confidence": 10,
                "category": "ISP/Business",
                "last_seen": "2023-10-27"
            }