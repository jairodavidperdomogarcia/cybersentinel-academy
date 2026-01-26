import time
import random

# --- PARADIGMA 1: SEGURIDAD BASADA EN COMPORTAMIENTO ---
# Simulación: Detectar accesos anómalos a un servidor.

# 1. Enfoque CLÁSICO (Reglas Estáticas)
def firewall_clasico(ip, intentos):
    # Regla: Si IP es 192.168.1.5, bloquear.
    # Regla: Si intentos > 5, bloquear.
    if ip == '192.168.1.5':
        return 'BLOQUEADO (Blacklist)'
    if intentos > 5:
        return 'BLOQUEADO (Rate Limit)'
    return 'PERMITIDO'

# 2. Enfoque MODERNO (Comportamiento / Anomalía Simple)
# Simulamos un 'modelo' que sabe que el promedio normal es 2 intentos/seg.
class DetectorAnomalia:
    def __init__(self):
        self.historial = []
        self.umbral_desviacion = 2.0 # Desviación estándar permitida

    def analizar(self, intentos_actuales):
        # Simula aprendizaje (en realidad, hardcodeado para el ejemplo)
        promedio_normal = 2
        
        # Si se desvía mucho del comportamiento normal...
        if intentos_actuales > (promedio_normal * self.umbral_desviacion):
             return f'ALERTA IA: Comportamiento anómalo ({intentos_actuales} intentos) - Posible Ataque'
        return 'Normal'

# --- SIMULACIÓN ---
print('--- INICIANDO SIMULACIÓN: REGLAS vs COMPORTAMIENTO ---')
print('Escenario: Un usuario legítimo vs un atacante inteligente\n')

# Caso 1: Usuario Normal
print('[Caso 1] Usuario Normal (IP: 10.0.0.1, 2 intentos)')
print(f'Firewall Clásico: {firewall_clasico('10.0.0.1', 2)}')
detector = DetectorAnomalia()
print(f'Detector IA:      {detector.analizar(2)}')
print('-' * 30)

# Caso 2: Atacante Bruto (Fuerza Bruta)
print('[Caso 2] Ataque Fuerza Bruta (IP: 10.0.0.2, 50 intentos)')
print(f'Firewall Clásico: {firewall_clasico('10.0.0.2', 50)}') # Lo pilla por regla simple
print(f'Detector IA:      {detector.analizar(50)}')
print('-' * 30)

# Caso 3: Atacante Inteligente (Slow & Low)
# El atacante sabe la regla del firewall (max 5) y hace 5 intentos (límite exacto).
print('[Caso 3] Ataque Inteligente (IP: 10.0.0.3, 5 intentos rápidos)')
print('Nota: El atacante evita la regla de > 5 intentos.')
print(f'Firewall Clásico: {firewall_clasico('10.0.0.3', 5)}') # ¡FALLA! Lo deja pasar
# Aquí la IA detectaría que 5 intentos es anómalo para ESTE usuario (promedio 2)
# 5 > (2 * 2.0) -> 5 > 4 -> ALERTA
print(f'Detector IA:      {detector.analizar(5)}') # Detecta la desviación del promedio (2)
print('\nConclusión: Las reglas estáticas fallan ante ataques adaptados. El comportamiento detecta la anomalía.')