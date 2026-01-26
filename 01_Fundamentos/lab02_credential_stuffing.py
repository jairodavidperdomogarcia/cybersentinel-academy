import time
import random

# ---------------------------------------------------------
# SIMULACIÓN DE SISTEMA DE AUTENTICACIÓN (EL SERVIDOR)
# ---------------------------------------------------------
class ServidorLogin:
    def __init__(self):
        # Base de datos simulada de usuarios y contraseñas (Hashed en la vida real, texto plano aquí para demo)
        self.usuarios_db = {
            "admin": "admin123",      # Contraseña por defecto (Pésima práctica)
            "alice": "chocolate",     # Contraseña común
            "bob": "P@ssw0rd2024!"    # Contraseña fuerte
        }
        self.intentos_fallidos = {}   # Registro de intentos por usuario
        self.LIMITE_INTENTOS = 3      # Maximos intentos permitidos
        self.TIEMPO_BLOQUEO = 60      # Segundos de bloqueo (simulado)

    def intentar_login(self, usuario, password):
        # 1. Verificar si el usuario ya esta bloqueado
        if usuario in self.intentos_fallidos:
            intentos, timestamp_bloqueo = self.intentos_fallidos[usuario]
            if intentos >= self.LIMITE_INTENTOS:
                print(f"   [DEFENSA] ¡Bloqueo activo para {usuario}! Intento rechazado.")
                return False

        # Simula latencia de red
        time.sleep(0.05) 
        
        if usuario in self.usuarios_db:
            if self.usuarios_db[usuario] == password:
                # Login exitoso: Resetear contador
                if usuario in self.intentos_fallidos:
                    del self.intentos_fallidos[usuario]
                return True
            else:
                # Login fallido: Incrementar contador
                intentos_actuales = self.intentos_fallidos.get(usuario, (0, 0))[0] + 1
                self.intentos_fallidos[usuario] = (intentos_actuales, time.time())
                
                if intentos_actuales == self.LIMITE_INTENTOS:
                     print(f"   [ALERTA] Usuario {usuario} ha superado el límite de intentos. CUENTA BLOQUEADA.")
                
        return False

# ---------------------------------------------------------
# SIMULACIÓN DE HERRAMIENTA DE ATAQUE (TIPO HYDRA / BURP SUITE)
# ---------------------------------------------------------
class HerramientaHacking:
    def __init__(self):
        # Diccionario común de contraseñas (Top 10 comunes)
        self.diccionario_passwords = [
            "123456", "password", "12345678", "qwerty", "12345", 
            "dragon", "admin123", "chocolate", "iloveyou", "letmeing"
        ]

    def ataque_fuerza_bruta_diccionario(self, servidor, usuario_objetivo):
        print(f"\n[ATAQUE] Iniciando ataque de diccionario contra usuario: '{usuario_objetivo}'")
        print(f"[HERRAMIENTA] Cargando diccionario ({len(self.diccionario_passwords)} palabras)...")
        
        intentos = 0
        for password_prueba in self.diccionario_passwords:
            intentos += 1
            print(f"   Trying: {password_prueba}...", end="\r")
            
            exito = servidor.intentar_login(usuario_objetivo, password_prueba)
            
            if exito:
                print(f"\n✅ PASSWORD ENCONTRADA: {password_prueba}")
                print(f"   Intentos realizados: {intentos}")
                return True
            
        print(f"\n❌ FALLO: La contraseña no está en el diccionario.")
        return False

# ---------------------------------------------------------
# EJECUCIÓN
# ---------------------------------------------------------
if __name__ == "__main__":
    servidor = ServidorLogin()
    hacker_tool = HerramientaHacking()

    print("=== ESCENARIO 1: ATACANDO A 'ADMIN' (Credenciales por defecto) ===")
    hacker_tool.ataque_fuerza_bruta_diccionario(servidor, "admin")

    print("\n" + "="*50)

    print("=== ESCENARIO 2: ATACANDO A 'ALICE' (Contraseña débil) ===")
    hacker_tool.ataque_fuerza_bruta_diccionario(servidor, "alice")

    print("\n" + "="*50)

    print("=== ESCENARIO 3: ATACANDO A 'BOB' (Contraseña fuerte) ===")
    hacker_tool.ataque_fuerza_bruta_diccionario(servidor, "bob")
