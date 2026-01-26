import cv2
import numpy as np
from collections import deque
import time

class SuspiciousBehaviorDetector:
    def __init__(self):
        """Detecta comportamientos anómalos en video vigilancia"""
        # Para seguimiento de movimiento
        self.movement_history = deque(maxlen=50)  # Últimas 50 posiciones
        
        # Comportamientos a detectar
        self.suspicious_patterns = {
            "loitering": {"duration": 30, "radius": 50},  # Merodeo >30 segundos en área pequeña
            "fast_movement": {"threshold": 100},  # Movimiento muy rápido
            "restricted_area": {"areas": []},  # Entrada a zonas prohibidas
            "group_gathering": {"min_people": 3, "max_distance": 100}  # Grupos sospechosos
        }

        # Para detección de merodeo
        self.loitering_start_time = None
        self.loitering_location = None
        
        print("[+] Detector de Comportamientos Sospechosos inicializado")
    
    def detect_loitering(self, current_position, timestamp):
        """Detecta merodeo (permanencia prolongada en un área)"""
        if self.loitering_start_time is None:
            self.loitering_start_time = timestamp
            self.loitering_location = current_position
            return False
        
        # Calcular distancia desde posición inicial
        distance = np.linalg.norm(
            np.array(current_position) - np.array(self.loitering_location)
        )
        
        # Si se mantiene en área pequeña por mucho tiempo
        if distance < self.suspicious_patterns["loitering"]["radius"]:
            elapsed_time = timestamp - self.loitering_start_time
            
            if elapsed_time > self.suspicious_patterns["loitering"]["duration"]:
                return {
                    "behavior": "loitering",
                    "duration": elapsed_time,
                    "location": current_position,
                    "severity": "medium"
                }
        else:
            # Reiniciar si se movió
            self.loitering_start_time = timestamp
            self.loitering_location = current_position
        
        return False
    
    def detect_fast_movement(self, positions_history):
        """Detecta movimiento anormalmente rápido"""
        if len(positions_history) < 2:
            return False
        
        # Calcular velocidad promedio
        total_distance = 0
        for i in range(1, len(positions_history)):
            pos1 = positions_history[i-1]
            pos2 = positions_history[i]
            distance = np.linalg.norm(np.array(pos1) - np.array(pos2))
            total_distance += distance
        
        avg_speed = total_distance / len(positions_history)
        
        if avg_speed > self.suspicious_patterns["fast_movement"]["threshold"]:
            return {
                "behavior": "fast_movement",
                "speed": avg_speed,
                "threshold": self.suspicious_patterns["fast_movement"]["threshold"],
                "severity": "low"
            }
        
        return False
    
    def analyze_frame(self, frame, person_positions):
        """Analiza frame en busca de comportamientos sospechosos"""
        timestamp = time.time()
        alerts = []
        
        for person_id, position in enumerate(person_positions):
            # Actualizar historial de movimiento
            self.movement_history.append((person_id, position, timestamp))
            
            # 1. Detectar merodeo
            loitering_alert = self.detect_loitering(position, timestamp)
            if loitering_alert:
                loitering_alert["person_id"] = person_id
                alerts.append(loitering_alert)
            
            # 2. Detectar movimiento rápido
            person_history = [pos for pid, pos, ts in self.movement_history if pid == person_id]
            if len(person_history) > 10:  # Suficiente historial
                fast_move_alert = self.detect_fast_movement(person_history)
                if fast_move_alert:
                    fast_move_alert["person_id"] = person_id
                    alerts.append(fast_move_alert)
        
        # 3. Detectar grupos (si hay múltiples personas)
        if len(person_positions) >= self.suspicious_patterns["group_gathering"]["min_people"]:
            # Verificar si están cerca entre sí
            for i in range(len(person_positions)):
                for j in range(i+1, len(person_positions)):
                    distance = np.linalg.norm(
                        np.array(person_positions[i]) - np.array(person_positions[j])
                    )
                    
                    if distance < self.suspicious_patterns["group_gathering"]["max_distance"]:
                        alerts.append({
                            "behavior": "group_gathering",
                            "person_ids": [i, j],
                            "distance": distance,
                            "severity": "high"
                        })
        
        return alerts
    
    def visualize_alerts(self, frame, alerts):
        """Visualiza alertas en el frame de video"""
        for alert in alerts:
            if alert["behavior"] == "loitering":
                # Dibujar círculo en área de merodeo
                center = tuple(map(int, alert["location"]))
                cv2.circle(frame, center, 50, (0, 165, 255), 2)  # Naranja
                cv2.putText(frame, f"MERODEO: {alert['duration']:.1f}s",
                          (center[0]-50, center[1]-60),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 165, 255), 2)
            
            elif alert["behavior"] == "fast_movement":
                person_id = alert["person_id"]
                # Dibujar línea de trayectoria rápida
                cv2.putText(frame, f"MOV. RAPIDO", (10, 60),
                          cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            
            elif alert["behavior"] == "group_gathering":
                # Dibujar línea conectando personas del grupo
                if "person_ids" in alert and len(alert["person_ids"]) >= 2:
                    cv2.putText(frame, f"GRUPO SOSPECHOSO", (10, 90),
                              cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
        
        return frame