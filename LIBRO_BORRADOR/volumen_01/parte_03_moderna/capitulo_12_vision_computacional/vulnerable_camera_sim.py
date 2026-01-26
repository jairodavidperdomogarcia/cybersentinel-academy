import logging
import time
import socket
import threading
import json
from datetime import datetime

# Configuración de Logging simulando un sistema embebido Linux (tipo /var/log/auth.log)
logging.basicConfig(
    filename='camera_system.log',
    level=logging.INFO,
    format='%(asctime)s - CAMERA_KERNEL - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

class VulnerableCameraSimulator:
    def __init__(self, port=8080):
        self.host = '127.0.0.1'
        self.port = port
        self.credentials = {"admin": "12345"} # CREDENCIALES POR DEFECTO PELIGROSAS
        self.is_running = True
        
        print(f"\n[+] CÁMARA IP INICIADA (Simulación)")
        print(f"    |-- Modelo: SecureCam-X200 (Firmware v1.0 - 2018)")
        print(f"    |-- Puerto RTSP/HTTP: {self.port}")
        print(f"    |-- Estado: ESPERANDO CONEXIONES...")
        print(f"    |-- AVISO: Credenciales de fábrica NO han sido cambiadas.\n")

    def handle_client(self, client_socket, addr):
        ip = addr[0]
        port = addr[1]
        
        try:
            # Simular handshake HTTP básico
            request = client_socket.recv(1024).decode('utf-8')
            
            # Extraer intento de login (Simulación simplificada)
            # En un ataque real, esto vendría en headers Authorization Basic
            if "LOGIN" in request:
                # Formato esperado: "LOGIN user:pass"
                parts = request.split(" ")
                if len(parts) > 1:
                    auth_part = parts[1].strip()
                    if ":" in auth_part:
                        user, password = auth_part.split(":", 1)
                        
                        if user in self.credentials and self.credentials[user] == password:
                            self.log_access(ip, user, success=True)
                            response = "HTTP/1.1 200 OK\n\n[VIDEO STREAM DATA STARTING...]\nFrame 1... Frame 2... Frame 3..."
                            client_socket.send(response.encode('utf-8'))
                        else:
                            self.log_access(ip, user, success=False, password_attempt=password)
                            response = "HTTP/1.1 401 Unauthorized\n\nAccess Denied"
                            client_socket.send(response.encode('utf-8'))
            
            client_socket.close()
            
        except Exception as e:
            print(f"Error manejando cliente: {e}")

    def log_access(self, ip, user, success, password_attempt=None):
        if success:
            log_msg = f"LOGIN_SUCCESS | Src: {ip} | User: {user} | Action: VIEW_STREAM"
            print(f"   [!] ALERTA DE SEGURIDAD: Acceso exitoso desde {ip} como '{user}'")
        else:
            log_msg = f"LOGIN_FAILED | Src: {ip} | User: {user} | Pass: {password_attempt} | Action: DENY"
            # No imprimir en consola para simular que el log está "oculto" en el sistema
            
        logging.info(log_msg)

    def start(self):
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((self.host, self.port))
        server.listen(5)
        
        while self.is_running:
            client, addr = server.accept()
            client_handler = threading.Thread(target=self.handle_client, args=(client, addr))
            client_handler.start()

if __name__ == "__main__":
    # Limpiar log anterior
    with open('camera_system.log', 'w') as f:
        f.write("--- SYSTEM BOOT ---\n")
        
    cam = VulnerableCameraSimulator()
    cam.start()