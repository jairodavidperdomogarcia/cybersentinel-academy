import cv2
import numpy as np
import face_recognition
import pickle
import time
from datetime import datetime
import os

class CyberSentinelFacialAuth:
    def __init__(self, authorized_persons_dir="authorized_persons/"):
        """Sistema de autenticación facial para sala de servidores"""
        self.authorized_encodings = []
        self.authorized_names = []
        # Umbral de confianza (qué tan similar debe ser)
        self.confidence_threshold = 0.6
        # Log de acceso
        self.access_log = []
        
        self.load_authorized_persons(authorized_persons_dir)
        
        print(f"[+] Sistema CyberSentinel Facial Auth inicializado")
        print(f"[+] Personas autorizadas: {len(self.authorized_names)}")

    def load_authorized_persons(self, directory):
        """Carga encodings faciales de personas autorizadas"""
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"[!] Directorio {directory} creado. Agrega fotos de personas autorizadas.")
            return

        for filename in os.listdir(directory):
            if filename.endswith(".jpg") or filename.endswith(".png"):
                # Cargar imagen
                image_path = os.path.join(directory, filename)
                try:
                    image = face_recognition.load_image_file(image_path)
                    
                    # Obtener encoding facial
                    encodings = face_recognition.face_encodings(image)
                    
                    if len(encodings) > 0:
                        self.authorized_encodings.append(encodings[0])
                        self.authorized_names.append(filename.split('.')[0])
                        print(f"   ✓ {filename} - Encoding facial extraído")
                    else:
                        print(f"   ✗ {filename} - No se detectó rostro")
                except Exception as e:
                    print(f"   ✗ Error procesando {filename}: {e}")

    def recognize_person(self, frame):
        """Reconoce personas en el frame de video"""
        # Convertir BGR (OpenCV) a RGB (face_recognition)
        rgb_frame = frame[:, :, ::-1]
        
        # Encontrar todas las caras en el frame
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        recognized = []
        
        for face_encoding, face_location in zip(face_encodings, face_locations):
            # Comparar con personas autorizadas
            matches = face_recognition.compare_faces(
                self.authorized_encodings,
                face_encoding,
                tolerance=0.5
            )
            
            name = "DESCONOCIDO"
            confidence = 0.0
            
            if True in matches:
                # Calcular distancias a todas las personas conocidas
                face_distances = face_recognition.face_distance(
                    self.authorized_encodings,
                    face_encoding
                )
                
                # Obtener el mejor match
                best_match_index = np.argmin(face_distances)
                confidence = 1.0 - face_distances[best_match_index]
                
                if confidence >= self.confidence_threshold:
                    name = self.authorized_names[best_match_index]
            
            # Extraer coordenadas
            top, right, bottom, left = face_location
            
            recognized.append({
                "name": name,
                "confidence": round(confidence, 2),
                "location": (left, top, right, bottom),
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
        
        return recognized

    def log_access(self, recognition_data):
        """Registra acceso en log con alertas si es necesario"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        for person in recognition_data:
            log_entry = {
                "timestamp": timestamp,
                "person": person["name"],
                "confidence": person["confidence"],
                "location": person["location"]
            }
            
            self.access_log.append(log_entry)
            
            # Generar alerta si es desconocido
            if person["name"] == "DESCONOCIDO":
                # Solo alertar si la confianza de ser desconocido es alta (o baja coincidencia)
                # En este caso, ya sabemos que es desconocido
                alert_msg = f"🚨 ALERTA CYBERSENTINEL - Intruso detectado - {timestamp}"
                print(f"\n{alert_msg}")
                print(f"   Ubicación: {person['location']}")
                
                # Guardar captura del intruso
                self.save_intruder_capture()

    def save_intruder_capture(self):
        """Guarda captura de intruso para investigación"""
        filename = f"intruder_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        # En implementación real, guardaría el frame actual
        print(f"   📸 Captura guardada como: {filename}")
        return filename

    def run_live_detection(self, camera_index=0):
        """Ejecuta detección en tiempo real desde cámara"""
        print("\n[+] Iniciando detección facial en tiempo real...")
        print("[+] Presiona 'q' para salir")
        print("[+] Personas autorizadas detectadas: VERDE")
        print("[+] Intrusos: ROJO")
        
        cap = cv2.VideoCapture(camera_index)
        
        if not cap.isOpened():
            print("[!] Error: No se puede acceder a la cámara")
            return
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Reconocer personas en el frame
            # Reducir tamaño para procesar más rápido (opcional)
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            
            # Nota: En un sistema real, procesaríamos cada N frames para optimizar
            recognized = self.recognize_person(small_frame) 
            
            # Escalar coordenadas de vuelta
            for person in recognized:
                top, right, bottom, left = person["location"]
                top *= 4
                right *= 4
                bottom *= 4
                left *= 4
                person["location"] = (left, top, right, bottom)

            # Dibujar resultados en el frame
            for person in recognized:
                left, top, right, bottom = person["location"]
                
                # Color según autorización
                if person["name"] == "DESCONOCIDO":
                    color = (0, 0, 255)  # ROJO - Intruso
                    label = f"INTRUSO"
                else:
                    color = (0, 255, 0)   # VERDE - Autorizado
                    label = f"{person['name']} ({person['confidence']})"
                
                # Dibujar rectángulo
                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                
                # Dibujar etiqueta
                cv2.rectangle(frame, (left, bottom - 35), (right, bottom), color, cv2.FILLED)
                cv2.putText(frame, label, (left + 6, bottom - 6),
                          cv2.FONT_HERSHEY_DUPLEX, 0.6, (255, 255, 255), 1)

            # Log de acceso
            self.log_access(recognized)
            
            # Mostrar contador
            authorized_count = sum(1 for p in recognized if p["name"] != "DESCONOCIDO")
            intruder_count = sum(1 for p in recognized if p["name"] == "DESCONOCIDO")
            
            cv2.putText(frame, f"Autorizados: {authorized_count} | Intrusos: {intruder_count}",
                       (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Mostrar frame
            cv2.imshow('CyberSentinel - Sistema de Autenticacion Facial', frame)
            
            # Salir con 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cap.release()
        cv2.destroyAllWindows()

# Uso del sistema
if __name__ == "__main__":
    print("="*60)
    print("CYBERSENTINEL - SISTEMA DE AUTENTICACIÓN FACIAL")
    print("Capítulo 12: Visión Computacional en Seguridad Física")
    print("="*60)
    
    # Crear sistema
    auth_system = CyberSentinelFacialAuth()
    
    # Iniciar detección (cámara 0 = webcam por defecto)
    # Comentado para evitar ejecución accidental al importar
    # auth_system.run_live_detection(camera_index=0)
    print("Para iniciar, ejecuta: auth_system.run_live_detection(0)")