import json
import sys
import os
from pathlib import Path
from datetime import datetime

# Configurar acceso al Motor SOAR (Capítulo 15)
current_dir = Path(__file__).parent
soar_path = current_dir.parents[1] / "parte_04_ia_aplicada" / "capitulo_15_soar"

if str(soar_path) not in sys.path:
    sys.path.append(str(soar_path))

try:
    from soar_engine import SoarEngine
except ImportError:
    SoarEngine = None
    print(f"⚠️ Alerta: No se pudo cargar el Motor SOAR desde {soar_path}")

class CyberSentinelIntegratedSecurity:
    def __init__(self):
        """Sistema integrado que conecta seguridad física y digital"""
        self.physical_alerts = []
        self.digital_alerts = []
        self.correlation_engine = CorrelationEngine()
        
        # Inicializar SOAR si está disponible
        self.soar = SoarEngine() if SoarEngine else None
        
        print("[+] Sistema Integrado CyberSentinel inicializado")
        print("[+] Modo: Correlación Físico-Digital + Respuesta SOAR")
    
    def receive_physical_alert(self, alert_type, location, confidence, metadata=None):
        """Recibe alerta del sistema de seguridad física"""
        alert = {
            "timestamp": datetime.now().isoformat(),
            "type": "physical",
            "alert_type": alert_type,
            "location": location,
            "confidence": confidence,
            "metadata": metadata or {}
        }
        
        self.physical_alerts.append(alert)
        print(f"[FÍSICO] Alerta: {alert_type} en {location}")
        
        # TRIGGER SOAR: Si es una intrusión confirmada, activar respuesta automática
        if self.soar and confidence > 0.8 and alert_type in ["intruder_detected", "unauthorized_access"]:
            print(f"🚀 [SOAR TRIGGER] Detectada intrusión de alta confianza. Iniciando Playbook...")
            # Adaptamos el evento al formato que espera el playbook
            soar_event = {
                "source": "CCTV_Server",
                "event_type": "physical_intrusion",
                "location": location,
                "confidence": confidence,
                "details": metadata
            }
            try:
                self.soar.run("playbooks/fisica_intrusion.yaml", soar_event)
            except Exception as e:
                print(f"❌ Error ejecutando SOAR: {e}")
        
        # Correlacionar con alertas digitales
        self.correlate_alerts(alert)
        
        return alert
    
    def receive_digital_alert(self, alert_type, source_ip, destination_ip, severity, metadata=None):
        """Recibe alerta del sistema de seguridad digital (SIEM/IDS)"""
        alert = {
            "timestamp": datetime.now().isoformat(),
            "type": "digital",
            "alert_type": alert_type,
            "source_ip": source_ip,
            "destination_ip": destination_ip,
            "severity": severity,
            "metadata": metadata or {}
        }
        
        self.digital_alerts.append(alert)
        print(f"[DIGITAL] Alerta: {alert_type} de {source_ip} a {destination_ip}")
        
        # Correlacionar con alertas físicas
        self.correlate_alerts(alert)
        
        return alert
    
    def correlate_alerts(self, new_alert):
        """Correlaciona alertas físicas y digitales"""
        if new_alert["type"] == "physical":
            # Buscar alertas digitales coincidentes en tiempo
            time_window = 300  # 5 minutos
            
            for digital_alert in self.digital_alerts[-10:]:  # Últimas 10
                digital_time = datetime.fromisoformat(digital_alert["timestamp"])
                physical_time = datetime.fromisoformat(new_alert["timestamp"])
                
                time_diff = abs((digital_time - physical_time).total_seconds())
                
                if time_diff < time_window:
                    # ¡POSIBLE CORRELACIÓN!
                    correlation_score = self.correlation_engine.calculate_correlation(
                        new_alert, digital_alert
                    )
                    
                    if correlation_score > 0.7:  # Umbral alto
                        self.raise_integrated_alert(new_alert, digital_alert, correlation_score)
        
        # Similar para alertas digitales buscando físicas
    
    def raise_integrated_alert(self, physical_alert, digital_alert, correlation_score):
        """Genera alerta integrada"""
        integrated_alert = {
            "timestamp": datetime.now().isoformat(),
            "type": "integrated",
            "physical_alert": physical_alert,
            "digital_alert": digital_alert,
            "correlation_score": correlation_score,
            "description": self.generate_correlation_description(physical_alert, digital_alert)
        }
        
        print("\n" + "="*60)
        print("🚨🚨 ALERTA INTEGRADA CYBERSENTINEL 🚨🚨")
        print("="*60)
        print(f"Correlación Físico-Digital Detectada ({correlation_score:.1%})")
        print(f"Físico: {physical_alert['alert_type']} en {physical_alert['location']}")
        print(f"Digital: {digital_alert['alert_type']} de {digital_alert['source_ip']}")
        print(f"Descripción: {integrated_alert['description']}")
        print("="*60 + "\n")
        
        # Guardar para análisis posterior
        self.save_integrated_alert(integrated_alert)
        
        return integrated_alert

    def generate_correlation_description(self, phys, dig):
        return f"Correlación de {phys['alert_type']} con {dig['alert_type']}"

    def save_integrated_alert(self, alert):
        # En producción, esto iría a una BD
        pass

class CorrelationEngine:
    def calculate_correlation(self, physical_alert, digital_alert):
        """Calcula correlación entre alertas físicas y digitales"""
        score = 0.0
        
        # 1. Coincidencia temporal (ya verificada)
        score += 0.3
        
        # 2. Patrones conocidos
        patterns = {
            ("intruder_detected", "sql_injection"): 0.4,
            ("unauthorized_access", "lateral_movement"): 0.5,
            ("tailgating", "data_exfiltration"): 0.6,
            ("loitering_near_server_room", "port_scanning"): 0.7,
            ("intruder_detected", "data_exfiltration"): 0.8, # TJX Scenario
        }
        
        pattern_key = (physical_alert["alert_type"], digital_alert["alert_type"])
        if pattern_key in patterns:
            score += patterns[pattern_key]
        
        # 3. Ubicación lógica
        if self.is_logical_location(physical_alert, digital_alert):
            score += 0.2
        
        return min(score, 1.0)  # Máximo 1.0

    def is_logical_location(self, phys, dig):
        # Simplificación: Retorna True si hay coincidencia lógica
        return True

# Simulación de escenario TJX
if __name__ == "__main__":
    print("="*60)
    print("SIMULACIÓN: CORRELACIÓN FÍSICO-DIGITAL - CASO TJX")
    print("="*60)
    
    system = CyberSentinelIntegratedSecurity()
    
    # Simular alertas del día del ataque TJX
    print("\n[2:15 AM] - Estacionamiento TJX")
    system.receive_physical_alert(
        "unauthorized_vehicle",
        "estacionamiento_norte",
        0.85,
        {"vehicle": "Toyota Corolla blanco", "plate": "XYZ123"}
    )
    
    print("\n[2:17 AM] - Entrada trasera")
    system.receive_physical_alert(
        "intruder_detected",
        "puerta_trasera_servidores",
        0.92,
        {"person_count": 1, "access_method": "tailgating"}
    )
    
    print("\n[2:18 AM] - SIEM detecta anomalía")
    system.receive_digital_alert(
        "data_exfiltration",
        "192.168.10.100",  # Servidor SQL
        "45.33.22.11",     # Dominio malicioso
        "critical",
        {"data_volume": "2.1GB", "protocol": "HTTPS"}
    )
    
    print("\n[+] Simulación completada.")
