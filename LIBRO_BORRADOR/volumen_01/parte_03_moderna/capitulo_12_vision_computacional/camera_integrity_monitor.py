import cv2
import numpy as np
import time
from datetime import datetime

class CameraIntegrityMonitor:
    def __init__(self):
        self.last_frame = None
        self.last_frame_time = time.time()
        self.frozen_start_time = None
        self.baseline_brightness = None
        self.alert_log = []
        
        # Umbrales de configuración
        self.FROZEN_THRESHOLD_SECONDS = 3.0  # Tiempo para considerar imagen congelada
        self.TAMPERING_THRESHOLD_SCORE = 0.4 # % de píxeles cambiados drásticamente (oclusión)
        self.NOISE_TOLERANCE = 2.0           # Tolerancia de ruido para "congelado" (0-255)

        print("[+] Monitor de Integridad CCTV Inicializado")
        print("    |-- Vigilando: Congelamiento (Loop attacks)")
        print("    |-- Vigilando: Sabotaje (Spray/Tapadura)")
        print("    |-- Vigilando: Pérdida de señal")

    def process_frame(self, frame_original):
        """Procesa un frame para verificar la salud de la cámara"""
        current_time = time.time()
        
        # 1. Conversión a escala de grises para análisis rápido
        gray = cv2.cvtColor(frame_original, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (21, 21), 0)

        status = "NORMAL"
        alert = None

        if self.last_frame is None:
            self.last_frame = gray
            self.baseline_brightness = np.mean(gray)
            return status

        # --- DETECCIÓN DE CONGELAMIENTO (LOOP ATTACK) ---
        # Calculamos la diferencia absoluta entre frame actual y anterior
        frame_delta = cv2.absdiff(self.last_frame, gray)
        mean_delta = np.mean(frame_delta)

        # Si la diferencia es casi cero (menor que el ruido natural del sensor)
        if mean_delta < self.NOISE_TOLERANCE:
            if self.frozen_start_time is None:
                self.frozen_start_time = current_time
            
            frozen_duration = current_time - self.frozen_start_time
            if frozen_duration > self.FROZEN_THRESHOLD_SECONDS:
                status = "CRITICAL: VIDEO_FROZEN"
                alert = f"Imagen congelada por {frozen_duration:.1f}s (Posible Loop Attack)"
        else:
            # Si hay movimiento/ruido normal, reseteamos el contador
            self.frozen_start_time = None

        # --- DETECCIÓN DE SABOTAJE (OCLUSIÓN / BLINDING) ---
        # Si la imagen cambió TOTALMENTE de golpe (ej. taparon la lente o cortaron cable)
        # O si el brillo promedio cae a casi 0 (negro) o sube a tope (linterna)
        current_brightness = np.mean(gray)
        brightness_diff = abs(current_brightness - self.baseline_brightness)
        
        # Si el cambio de brillo es masivo (>100 en escala 0-255)
        if brightness_diff > 100:
             status = "CRITICAL: CAMERA_TAMPERING"
             alert = "Cambio masivo de iluminación (Posible lente tapada/cegada)"

        # Actualizar referencia
        self.last_frame = gray
        
        if alert:
            self._log_alert(status, alert)
        
        return status

    def _log_alert(self, type, message):
        timestamp = datetime.now().isoformat()
        full_msg = f"[{timestamp}] {type}: {message}"
        if not self.alert_log or self.alert_log[-1] != full_msg: # Evitar spam
            print(full_msg)
            self.alert_log.append(full_msg)

# --- SIMULACIÓN PARA EL ESTUDIANTE ---
def run_simulation():
    monitor = CameraIntegrityMonitor()
    
    print("\n--- INICIANDO SIMULACIÓN DE ATAQUES A CÁMARA ---")
    
    # Simular frame base (ruido aleatorio normal)
    frame_base = np.random.randint(100, 150, (480, 640, 3), dtype=np.uint8)
    
    # 1. FUNCIONAMIENTO NORMAL (Variaciones ligeras)
    print("\n[T=0s] Operación Normal (Ruido de sensor presente)")
    for _ in range(3):
        # Frame con pequeño ruido aleatorio
        noise = np.random.randint(-5, 5, (480, 640, 3), dtype=np.int16)
        frame = np.clip(frame_base + noise, 0, 255).astype(np.uint8)
        monitor.process_frame(frame)
        time.sleep(0.5)

    # 2. ATAQUE DE LOOP / CONGELAMIENTO (Frame idéntico repetido)
    print("\n[T=5s] ATACANTE INYECTA VIDEO EN LOOP (Imagen estática perfecta)")
    # Frame estático sin ruido (típico de imagen digital pegada)
    frame_frozen = frame_base.copy() 
    
    for i in range(8):
        status = monitor.process_frame(frame_frozen)
        print(f"   Check {i}: {status}")
        time.sleep(0.5)

    # 3. ATAQUE DE SABOTAJE (Spray negro en la lente)
    print("\n[T=10s] ATACANTE ROCÍA SPRAY NEGRO EN LA LENTE")
    frame_black = np.zeros((480, 640, 3), dtype=np.uint8) # Imagen negra
    
    status = monitor.process_frame(frame_black)
    print(f"   Check Sabotaje: {status}")

if __name__ == "__main__":
    run_simulation()