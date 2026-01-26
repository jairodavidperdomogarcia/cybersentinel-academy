import re
import os

class CameraForensics:
    def __init__(self, log_file='camera_system.log'):
        self.log_file = log_file
    
    def analyze_logs(self):
        print("\n" + "="*60)
        print("ANÁLISIS FORENSE DE CÁMARA IOT")
        print("="*60)
        
        if not os.path.exists(self.log_file):
            print(f"[!] Error: No se encuentra el archivo de logs {self.log_file}")
            print("    Ejecuta primero la simulación de ataque.")
            return

        with open(self.log_file, 'r') as f:
            logs = f.readlines()
            
        print(f"[+] Logs cargados: {len(logs)} líneas")
        
        failed_attempts = []
        successful_access = []
        attacker_ips = set()
        
        # Regex simple para parsear nuestro formato de log
        # Formato: DATE TIME - KERNEL - MESSAGE
        for line in logs:
            if "LOGIN_FAILED" in line:
                failed_attempts.append(line.strip())
                # Extraer IP (muy simplificado)
                ip_match = re.search(r'Src: ([\d\.]+)', line)
                if ip_match:
                    attacker_ips.add(ip_match.group(1))
                    
            elif "LOGIN_SUCCESS" in line:
                successful_access.append(line.strip())
                ip_match = re.search(r'Src: ([\d\.]+)', line)
                if ip_match:
                    attacker_ips.add(ip_match.group(1))

        # REPORTE
        print("\n--- 1. EVIDENCIA DE ATAQUE DE FUERZA BRUTA ---")
        if len(failed_attempts) > 3:
            print(f"   [ALERTA] Se detectaron {len(failed_attempts)} intentos fallidos rápidos.")
            print(f"   [ANÁLISIS] Patrón típico de ataque de diccionario/botnet.")
            print("   Muestra de intentos:")
            for fail in failed_attempts[:3]:
                print(f"     - {fail}")
        else:
            print("   [OK] No se detectan patrones de fuerza bruta masiva.")

        print("\n--- 2. ACCESOS NO AUTORIZADOS CONFIRMADOS ---")
        if successful_access:
            print(f"   [CRÍTICO] ¡ALGUIEN LOGRÓ ENTRAR!")
            for access in successful_access:
                print(f"     - {access}")
        else:
            print("   [OK] Ningún acceso exitoso registrado.")

        print("\n--- 3. ORIGEN DEL ATAQUE (Tracing) ---")
        if attacker_ips:
            print(f"   IPs Sospechosas detectadas: {', '.join(attacker_ips)}")
            print("   (En un caso real, usarías GeoIP para localizar estas IPs)")
        else:
            print("   No hay datos de IP.")

        self.generate_hardening_report(bool(successful_access))

    def generate_hardening_report(self, was_breached):
        print("\n" + "-"*60)
        print("REPORTE DE HARDENING (CÓMO ASEGURAR TU CÁMARA)")
        print("-"*60)
        
        if was_breached:
            print("🔴 ESTADO: VULNERABLE (La cámara fue hackeada)")
            print("   CAUSA RAÍZ: Credenciales por defecto no cambiadas.")
        else:
            print("🟢 ESTADO: SEGURO (Por ahora)")

        print("\nPASOS INMEDIATOS PARA EL ESTUDIANTE:")
        print("1. [CRÍTICO] Cambiar la contraseña por defecto AHORA MISMO.")
        print("   - No usar: admin, 12345, password, root.")
        print("2. Actualizar Firmware.")
        print("   - Las vulnerabilidades viejas (como en el caso Mirai) se arreglan con parches.")
        print("3. Desactivar UPnP en el Router.")
        print("   - Esto evita que la cámara abra puertos hacia internet automáticamente.")
        print("4. Segmentación de Red (VLAN).")
        print("   - Poner las cámaras en una red separada de tu PC/Teléfono.")
        print("   - Si hackean la cámara, no pueden saltar a tu PC (Movimiento Lateral).")

if __name__ == "__main__":
    forensics = CameraForensics()
    forensics.analyze_logs()