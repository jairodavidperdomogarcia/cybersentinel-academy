import time
import random
import re
from datetime import datetime, timedelta

# ---------------------------------------------------------
# SIMULADOR DE LOGS (DATASET)
# ---------------------------------------------------------
class LogGenerator:
    def __init__(self):
        self.users = ["alice", "bob", "charlie", "admin", "service_account"]
        self.ips = ["192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.200"]
        self.external_ips = ["10.0.0.5", "8.8.8.8", "1.1.1.1", "45.33.22.11"] # 45.33.22.11 es sospechosa
        
    def generate_normal_traffic(self, count=20):
        logs = []
        for _ in range(count):
            timestamp = datetime.now() - timedelta(minutes=random.randint(1, 60))
            user = random.choice(self.users)
            src_ip = random.choice(self.ips)
            dest_ip = random.choice(self.external_ips[:3]) # IPs benignas
            action = "LOGIN_SUCCESS"
            logs.append(f"{timestamp.isoformat()} | EVENT: {action} | USER: {user} | SRC: {src_ip} | DEST: {dest_ip} | PORT: 443")
        return logs

    def generate_attack_traffic(self):
        # SIMULACION DE "BEACONING" (C2 Communication)
        # El malware contacta al servidor de comando y control a intervalos regulares
        logs = []
        base_time = datetime.now() - timedelta(hours=1)
        user = "bob" # Bob ha sido comprometido
        src_ip = "192.168.1.11"
        c2_ip = "45.33.22.11" # IP Maliciosa
        
        # Generar 10 conexiones con un intervalo casi exacto (patron de maquina)
        for i in range(10):
            timestamp = base_time + timedelta(seconds=i*300) # Cada 5 minutos exactos
            # Añadimos un pequeño "jitter" (variacion) para intentar evadir deteccion simple, pero sigue siendo ritmico
            jitter = random.randint(-2, 2) 
            timestamp = timestamp + timedelta(seconds=jitter)
            
            logs.append(f"{timestamp.isoformat()} | EVENT: OUTBOUND_CONN | USER: {user} | SRC: {src_ip} | DEST: {c2_ip} | PORT: 8080 | BYTES: 1200")
        return logs

# ---------------------------------------------------------
# CAZADOR DE AMENAZAS (THREAT HUNTER)
# ---------------------------------------------------------
class ThreatHunter:
    def __init__(self, logs):
        self.logs = logs
        print(f"[DATASET] Cargados {len(logs)} eventos de log.")

    def hunt_beaconing(self):
        print("\n🔎 [HUNT] Iniciando búsqueda de patrones de Beaconing (C2)...")
        print("   HIPÓTESIS: Un host infectado conecta regularmente a una IP externa.")
        
        # 1. Agrupar conexiones por IP destino
        connections = {}
        for log in self.logs:
            if "OUTBOUND_CONN" in log:
                # Extraer IP destino con Regex
                match = re.search(r'DEST: (\d+\.\d+\.\d+\.\d+)', log)
                if match:
                    dest_ip = match.group(1)
                    timestamp_str = log.split(" | ")[0]
                    timestamp = datetime.fromisoformat(timestamp_str)
                    
                    if dest_ip not in connections:
                        connections[dest_ip] = []
                    connections[dest_ip].append(timestamp)

        # 2. Analizar intervalos de tiempo (Delta T)
        for ip, timestamps in connections.items():
            timestamps.sort()
            deltas = []
            for i in range(len(timestamps)-1):
                diff = (timestamps[i+1] - timestamps[i]).total_seconds()
                deltas.append(diff)
            
            if not deltas:
                continue

            # Calcular varianza de los intervalos
            avg_delta = sum(deltas) / len(deltas)
            variance = sum((x - avg_delta) ** 2 for x in deltas) / len(deltas)
            
            print(f"   --> Analizando IP: {ip} | Conexiones: {len(timestamps)} | Intervalo Promedio: {avg_delta:.1f}s | Varianza: {variance:.1f}")

            # SI LA VARIANZA ES BAJA, ES UN PATRON AUTOMATICO (MALWARE)
            if variance < 100 and len(timestamps) > 5:
                print(f"   🚨 [ALERTA] ¡Posible Beaconing detectado hacia {ip}!")
                print(f"      Patrón rítmico encontrado (cada ~{avg_delta:.0f} segundos).")
                print(f"      ACCION RECOMENDADA: Aislar host y bloquear IP {ip}")
                return
        
        print("   ✅ No se detectaron patrones de beaconing evidentes.")

# ---------------------------------------------------------
# EJECUCIÓN DEL LABORATORIO
# ---------------------------------------------------------
if __name__ == "__main__":
    generator = LogGenerator()
    
    # 1. Generar trafico mixto
    print("--- GENERANDO LOGS SIMULADOS ---")
    logs = generator.generate_normal_traffic(30)
    logs += generator.generate_attack_traffic() # Inyectamos el ataque
    
    # Mezclar logs para realismo
    random.shuffle(logs)
    
    # 2. Iniciar Caza
    hunter = ThreatHunter(logs)
    hunter.hunt_beaconing()
