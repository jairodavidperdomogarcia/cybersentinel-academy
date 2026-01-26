# Módulo 01: Fundamentos - Demo de Vulnerabilidad Lógica
# Escenario: "Elevation of Privilege" mediante Input no validado.

class BancoVulnerable:
    def __init__(self, nombre_usuario, saldo_inicial):
        self.usuario = nombre_usuario
        self.saldo = saldo_inicial
        print(f"--- Cuenta creada: {self.usuario} | Saldo: ${self.saldo} ---")

    def transferencia_rapida(self, monto, destinatario):
        print(f"\n[INTENTO] Transferir ${monto} a {destinatario}...")
        
        # ❌ ERROR DE SEGURIDAD:
        # El desarrollador olvidó verificar si el monto es positivo.
        # Solo verificó si hay saldo suficiente para "restar".
        
        # Si monto es -1000:
        # self.saldo >= -1000 (100 >= -1000) -> TRUE
        if self.saldo >= monto:
            self.saldo = self.saldo - monto
            print(f"✅ ÉXITO: Transferencia realizada.")
            print(f"💰 Nuevo Saldo de {self.usuario}: ${self.saldo}")
        else:
            print("❌ ERROR: Fondos insuficientes.")

# ---------------------------------------------------------
# CLASE 2: BANCO SEGURO (CON VALIDACIÓN)
# ---------------------------------------------------------
class BancoSeguro:
    def __init__(self, nombre_usuario, saldo_inicial):
        self.usuario = nombre_usuario
        self.saldo = saldo_inicial

    def transferencia_segura(self, monto, destinatario):
        print(f"\n[SECURE-CORE] Intentando transferir ${monto} a {destinatario}...")
        
        # 1. VALIDACIÓN DE ENTRADA (Input Validation)
        # Regla: No puedes transferir cantidades negativas ni cero.
        if monto <= 0:
            print(f"❌ ERROR DE SEGURIDAD: Monto inválido (${monto}). Operación rechazada.")
            return False

        # 2. VALIDACIÓN DE LÓGICA DE NEGOCIO
        # Regla: No puedes transferir más de lo que tienes.
        if self.saldo >= monto:
            self.saldo = self.saldo - monto
            print(f"✅ Transferencia exitosa. Nuevo saldo: ${self.saldo}")
            return True
        else:
            print(f"⚠️ Saldo insuficiente. Tienes ${self.saldo} y quieres enviar ${monto}.")
            return False

# ---------------------------------------------------------
# SIMULACIÓN DEL ATAQUE
# ---------------------------------------------------------
def ejecutar_demo():
    print("=== ESCENARIO 1: EL BANCO VULNERABLE ===")
    cuenta_alice = BancoVulnerable("Alice", 100)
    print(f"Saldo inicial de Alice: ${cuenta_alice.saldo}")
    
    # El atacante intenta robar dinero enviando un monto negativo
    # Matemáticamente: 100 - (-1000) = 1100
    print("\n>>> 🕵️ ATACANTE: Enviando transferencia de -1000...")
    cuenta_alice.transferencia_rapida(-1000, "Cuenta_Atacante")
    
    print(f"\n[RESULTADO] Saldo final de Alice: ${cuenta_alice.saldo}")
    if cuenta_alice.saldo > 100:
        print("🚨 HACKEO EXITOSO: El saldo aumentó mágicamente.")
    
    print("\n" + "="*50 + "\n")

    print("=== ESCENARIO 2: EL BANCO SEGURO (PATCHED) ===")
    cuenta_bob = BancoSeguro("Bob", 100)
    print(f"Saldo inicial de Bob: ${cuenta_bob.saldo}")

    print("\n>>> 🕵️ ATACANTE: Intentando el mismo truco (-1000)...")
    cuenta_bob.transferencia_segura(-1000, "Cuenta_Atacante")

    print(f"\n[RESULTADO] Saldo final de Bob: ${cuenta_bob.saldo}")
    if cuenta_bob.saldo == 100:
        print("🛡️ DEFENSA EXITOSA: El sistema detectó y bloqueó el ataque.")

if __name__ == "__main__":
    ejecutar_demo()
