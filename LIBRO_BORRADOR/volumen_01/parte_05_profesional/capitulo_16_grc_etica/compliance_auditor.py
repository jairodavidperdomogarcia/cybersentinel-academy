import subprocess
import os
import platform
import sys
import json
from datetime import datetime, timezone
import shutil

def check_ssh_config():
    """Verifica configuración segura de SSH"""
    issues = []
    config_path = '/etc/ssh/sshd_config'
    
    if not os.path.exists(config_path):
        # Mock mode for Windows or if file missing
        if platform.system() == "Windows":
             issues.append("ℹ️ INFO: Ejecutando en Windows (Modo Simulación)")
             # Simular hallazgos para fines educativos
             issues.append("❌ FAIL: Root login está permitido (Simulado)")
             issues.append("❌ FAIL: Autenticación por password permitida (Simulado)")
             return issues
        else:
            issues.append(f"⚠️ ERROR: No se encontró {config_path}")
            return issues

    try:
        with open(config_path, 'r') as f:
            config = f.read()
            # Check 1: Root Login
            if "PermitRootLogin yes" in config:
                issues.append("❌ FAIL: Root login está permitido (PermitRootLogin yes)")
            elif "PermitRootLogin prohibit-password" in config or "PermitRootLogin no" in config:
                 issues.append("✅ PASS: Root login bloqueado o restringido")
            else:
                 issues.append("⚠️ WARN: Configuración de Root Login no explícita (Asumiendo Default)")

            # Check 2: Password Auth
            if "PasswordAuthentication yes" in config:
                issues.append("❌ FAIL: Autenticación por password permitida (PasswordAuthentication yes)")
            elif "PasswordAuthentication no" in config:
                issues.append("✅ PASS: Password Auth bloqueada")
            else:
                 issues.append("⚠️ WARN: Password Auth no explícita")
                 
    except Exception as e:
        issues.append(f"⚠️ ERROR: No se pudo leer sshd_config: {str(e)}")
        
    return issues

def check_dangerous_files(directory):
    """Busca archivos con permisos 777"""
    issues = []
    
    if platform.system() == "Windows":
        # Simulation for Windows
        issues.append(f"ℹ️ INFO: Simulando búsqueda en {directory}")
        issues.append(f"❌ FAIL: Se encontraron 2 archivos con permisos 777 (Simulado)")
        issues.append(f"   -> {directory}/config_backup.php")
        issues.append(f"   -> {directory}/db_creds.txt")
        return issues

    if not os.path.exists(directory):
        issues.append(f"⚠️ SKIP: Directorio {directory} no existe")
        return issues

    # Comando find para buscar permisos 777
    cmd = f"find {directory} -type f -perm 777"
    try:
        result = subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL).decode()
        if result:
            files = result.strip().split('\n')
            issues.append(f"❌ FAIL: Se encontraron {len(files)} archivos con permisos 777 en {directory}")
            for f in files[:5]: # Mostrar solo los primeros 5
                issues.append(f"   -> {f}")
            if len(files) > 5:
                issues.append(f"   ... y {len(files)-5} más.")
        else:
            issues.append(f"✅ PASS: No hay archivos 777 en {directory}")
    except Exception as e:
        issues.append(f"⚠️ ERROR: Falló la búsqueda de archivos: {str(e)}")
    return issues

def check_firewall():
    issues = []
    system = platform.system()
    if system == "Windows":
        issues.append("ℹ️ INFO: Firewall verificado en modo simulado (Windows)")
        issues.append("✅ PASS: Firewall activo (Simulado)")
        return issues
    ufw_path = shutil.which("ufw")
    if ufw_path:
        try:
            output = subprocess.check_output([ufw_path, "status"], stderr=subprocess.DEVNULL).decode().lower()
            if "inactive" in output:
                issues.append("❌ FAIL: Firewall (ufw) está inactivo")
            elif "active" in output:
                issues.append("✅ PASS: Firewall (ufw) activo")
            else:
                issues.append("⚠️ WARN: No se pudo determinar estado de ufw")
            return issues
        except Exception as e:
            issues.append(f"⚠️ ERROR: Falló la verificación de ufw: {str(e)}")
            return issues
    try:
        output = subprocess.check_output(["systemctl", "is-active", "firewalld"], stderr=subprocess.DEVNULL).decode().strip()
        if output == "active":
            issues.append("✅ PASS: Firewall (firewalld) activo")
        else:
            issues.append("❌ FAIL: Firewall (firewalld) inactivo")
    except Exception:
        issues.append("⚠️ WARN: No se pudo determinar el estado del firewall (ni ufw ni firewalld detectados)")
    return issues

def build_failed_controls(report_lines):
    controls = set()
    for line in report_lines:
        if "FAIL" not in line:
            continue
        lower = line.lower()
        if "root login" in lower:
            controls.add("SSH_ROOT_LOGIN")
        if "password" in lower and "auth" in lower:
            controls.add("SSH_PASSWORD_AUTH")
        if "777" in lower:
            controls.add("WEB_PERMISSIONS_777")
        if "firewall" in lower:
            controls.add("FIREWALL_INACTIVE")
    return sorted(controls)

def compute_ale_from_env():
    av_env = os.getenv("CS_AV", "").strip()
    ef_env = os.getenv("CS_EF", "").strip()
    aro_env = os.getenv("CS_ARO", "").strip()
    if not av_env or not ef_env or not aro_env:
        return None
    try:
        av = float(av_env)
        ef = float(ef_env)
        aro = float(aro_env)
    except ValueError:
        return None
    if av <= 0 or ef <= 0 or aro <= 0:
        return None
    sle = av * ef
    ale = sle * aro
    return {
        "AV": av,
        "EF": ef,
        "ARO": aro,
        "SLE": sle,
        "ALE": ale,
    }

def load_latest_ransomware_incident():
    log_dir = "/cybersentinel/logs"
    if not os.path.exists(log_dir):
        if os.path.exists("logs"):
            log_dir = "logs"
        else:
            return None
    candidates = []
    for name in os.listdir(log_dir):
        if name.startswith("incident_INC-") and name.endswith(".json"):
            full_path = os.path.join(log_dir, name)
            try:
                mtime = os.path.getmtime(full_path)
            except OSError:
                continue
            candidates.append((mtime, full_path))
    if not candidates:
        return None
    candidates.sort(reverse=True)
    latest_path = candidates[0][1]
    try:
        with open(latest_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception:
        return None

def calculate_ransomware_roi(incident_data):
    base = incident_data.get("business_assumptions", {})
    downtime_hours = float(base.get("downtime_hours", 24))
    employees_affected = int(base.get("employees_affected", 50))
    cost_per_hour = float(base.get("cost_per_hour", 100))
    single_loss = downtime_hours * employees_affected * cost_per_hour
    annual_probability = float(base.get("annual_probability", 0.3))
    ale = single_loss * annual_probability
    automation_cost = float(base.get("automation_cost", 50000))
    time_saved = float(base.get("time_saved_hours", 8))
    incidents_per_year = float(base.get("incidents_per_year", 5))
    roi = ((time_saved * cost_per_hour * incidents_per_year) - automation_cost) / automation_cost
    if ale > 100000:
        impact = "High"
    elif ale > 30000:
        impact = "Medium"
    else:
        impact = "Low"
    return {
        "ALE": ale,
        "ROI_automation": roi,
        "business_impact": impact,
        "downtime_hours": downtime_hours,
        "employees_affected": employees_affected,
        "cost_per_hour": cost_per_hour,
        "annual_probability": annual_probability,
        "automation_cost": automation_cost,
        "incidents_per_year": incidents_per_year,
    }

def build_coach_questions(failed_controls, ale_data):
    lines = []
    if not failed_controls and ale_data is None:
        return lines
    lines.append("\n🧠 Preguntas para tu bitácora de GRC:")
    if "SSH_ROOT_LOGIN" in failed_controls:
        lines.append("   • Si un auditor ve PermitRootLogin activo, ¿cómo justificas el riesgo?")
    if "SSH_PASSWORD_AUTH" in failed_controls:
        lines.append("   • ¿Qué podría salir mal si una contraseña filtrada sigue dando acceso SSH?")
    if "WEB_PERMISSIONS_777" in failed_controls:
        lines.append("   • ¿Qué tipo de incidente real podría explotar archivos 777 en tu entorno web?")
    if "FIREWALL_INACTIVE" in failed_controls:
        lines.append("   • Si el firewall está inactivo, ¿qué hipótesis de ataque deberías modelar primero?")
    if ale_data is not None:
        ale_value = ale_data.get("ALE")
        if isinstance(ale_value, (int, float)):
            lines.append(f"   • Con un ALE ≈ {ale_value:.2f}, ¿qué control reduce más esa cifra?")
    lines.append("   • ¿Qué evidencia guardarías hoy para demostrar cumplimiento ante un regulador?")
    return lines

def write_compliance_report(score, failed_controls, findings, ale_data):
    data = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "score": score,
        "failed_controls": failed_controls,
        "findings": findings,
    }
    if ale_data is not None:
        data["risk_model"] = ale_data
    log_dir = "/cybersentinel/logs"
    if not os.path.exists(log_dir):
        try:
            os.makedirs(log_dir, exist_ok=True)
        except (OSError, PermissionError):
            log_dir = "logs"
            os.makedirs(log_dir, exist_ok=True)
    path = os.path.join(log_dir, "compliance_report.json")
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n[+] Reporte de cumplimiento guardado en: {path}")
    except Exception as e:
        print(f"\n⚠️ No se pudo escribir compliance_report.json: {e}")

def print_dashboard_summary():
    log_dir = "/cybersentinel/logs"
    if not os.path.exists(log_dir):
        if os.path.exists("logs"):
            log_dir = "logs"
        else:
            print("⚠️ No se encontró carpeta de logs para el emulador.")
            return
    path = os.path.join(log_dir, "compliance_report.json")
    if not os.path.exists(path):
        print("⚠️ No se encontró compliance_report.json. Ejecuta primero el auditor.")
        return
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"⚠️ No se pudo leer compliance_report.json: {e}")
        return
    score = data.get("score")
    failed = data.get("failed_controls", [])
    risk = data.get("risk_model") or {}
    ale = risk.get("ALE")
    ransomware = risk.get("ransomware") or {}
    roi = ransomware.get("ROI_automation")
    business_impact = ransomware.get("business_impact")
    print("\n🎯 RESUMEN DE CUMPLIMIENTO PARA DASHBOARD")
    print("=" * 60)
    if isinstance(score, int):
        if score >= 90:
            nivel = "Alto"
        elif score >= 70:
            nivel = "Aceptable"
        else:
            nivel = "Crítico"
        print(f"Nivel de cumplimiento: {score}/100 ({nivel})")
    else:
        print("Nivel de cumplimiento: desconocido")
    if failed:
        print("\nControles fallidos:")
        for c in failed:
            print(f" - {c}")
    else:
        print("\nControles fallidos: ninguno registrado")
    if isinstance(ale, (int, float)):
        print(f"\nRiesgo financiero anual estimado (ALE): {ale:.2f}")
    else:
        print("\nALE: no definido. Configura CS_AV, CS_EF y CS_ARO para calcularlo.")
    if isinstance(roi, (int, float)):
        print(f"ROI de automatización frente a ransomware: {roi*100:.1f}%")
    if business_impact:
        print(f"Impacto de negocio estimado para ransomware: {business_impact}")

def main():
    print("\n🛡️  INICIANDO AUDITORÍA DE CUMPLIMIENTO CYBERSENTINEL  🛡️")
    print("=" * 60)
    print(f"Sistema detectado: {platform.system()} {platform.release()}")
    print("-" * 60)
    
    score = 100
    report = []
    
    print("🔍 Auditando configuración SSH...")
    ssh_results = check_ssh_config()
    report.extend(ssh_results)
    if any("FAIL" in r for r in ssh_results): score -= 30
    
    print("🔍 Auditando permisos de archivos web...")
    target_dir = "/var/www/html" if platform.system() != "Windows" else "C:\\xampp\\htdocs"
    web_results = check_dangerous_files(target_dir)
    report.extend(web_results)
    if any("FAIL" in r for r in web_results): score -= 30
    
    print("🔍 Verificando estado del firewall...")
    firewall_results = check_firewall()
    report.extend(firewall_results)
    if any("FAIL" in r for r in firewall_results): score -= 40

    print("\n" + "-" * 60)
    print("📄 REPORTE DE HALLAZGOS:")
    print("-" * 60)
    for line in report:
        print(line)
        
    print("-" * 60)
    if score < 0:
        score = 0
    print(f"PUNTUACIÓN FINAL DE CUMPLIMIENTO: {score}/100")
    
    if score < 100:
        print("\n🚨 EL SISTEMA NO CUMPLE EL ESTÁNDAR.")
        print("   Acciones requeridas:")
        if any("SSH" in r for r in report if "FAIL" in r):
            print("   - Hardening de SSH (Deshabilitar Root y Password Auth)")
        if any("777" in r for r in report if "FAIL" in r):
            print("   - Corregir permisos de archivos (chmod 644/755)")
        if any("Firewall" in r or "firewall" in r for r in report if "FAIL" in r):
            print("   - Activar y configurar firewall en modo restrictivo por defecto")
    else:
        print("\n🏆 SISTEMA CERTIFICADO - LISTO PARA PRODUCCIÓN")
    
    failed_controls = build_failed_controls(report)
    ale_data = compute_ale_from_env()
    ransomware_model = None
    incident_data = load_latest_ransomware_incident()
    if incident_data is not None:
        ransomware_model = calculate_ransomware_roi(incident_data)
        if ale_data is None:
            ale_data = {}
        ale_data["ransomware"] = ransomware_model
    executive_lines = []
    if isinstance(score, int):
        executive_lines.append("\n📌 Datos clave para tu artefacto ejecutivo:")
        executive_lines.append(f"   • Puntuación de cumplimiento: {score}/100")
    if ale_data is not None:
        base_ale = ale_data.get("ALE")
        if isinstance(base_ale, (int, float)):
            if not executive_lines:
                executive_lines.append("\n📌 Datos clave para tu artefacto ejecutivo:")
            executive_lines.append(f"   • ALE aproximado: {base_ale:.2f}")
    if ransomware_model is not None:
        roi_auto = ransomware_model.get("ROI_automation")
        downtime_hours = ransomware_model.get("downtime_hours")
        if isinstance(roi_auto, (int, float)):
            if not executive_lines:
                executive_lines.append("\n📌 Datos clave para tu artefacto ejecutivo:")
            executive_lines.append(
                f"   • ROI de automatización frente a ransomware: {roi_auto*100:.1f}%"
            )
        if isinstance(downtime_hours, (int, float)):
            if not executive_lines:
                executive_lines.append("\n📌 Datos clave para tu artefacto ejecutivo:")
            executive_lines.append(
                f"   • Horas de inactividad consideradas en el modelo: {downtime_hours}"
            )
    if executive_lines:
        print("\n".join(executive_lines))
    coach_lines = build_coach_questions(failed_controls, ale_data)
    if coach_lines:
        print("\n".join(coach_lines))
    write_compliance_report(score, failed_controls, report, ale_data)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--dashboard":
        print_dashboard_summary()
    else:
        main()
