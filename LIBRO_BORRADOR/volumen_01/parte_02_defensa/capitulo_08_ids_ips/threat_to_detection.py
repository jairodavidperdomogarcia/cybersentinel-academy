#!/usr/bin/env python3

import argparse
import json
import os
from datetime import datetime
from typing import Any, Dict, List

class ThreatToDetection:
    def __init__(self, config_file: str) -> None:
        self.config = self._load_config(config_file)
        self.scenario = self.config.get("scenario", "generic")

    def _load_config(self, path: str) -> Dict[str, Any]:
        if not os.path.exists(path):
            raise FileNotFoundError(f"Archivo de configuración no encontrado: {path}")
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def generate_rules(self, format_type: str = "suricata") -> List[str]:
        rules = []
        controls = self.config.get("controls", [])
        
        # Header for the rules file
        rules.append(f"# Reglas generadas para escenario: {self.scenario}")
        rules.append(f"# Formato: {format_type.upper()}")
        rules.append(f"# Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        rules.append("")

        sid_counter = 1000001

        for control in controls:
            name = control.get("name", "").lower()
            rule = self._create_rule_from_control(name, format_type, sid_counter)
            if rule:
                rules.append(rule)
                sid_counter += 1
        
        return rules

    def _create_rule_from_control(self, control_name: str, format_type: str, sid: int) -> str:
        # Lógica de mapeo: Si falla el control X, detectamos con la regla Y
        
        msg = ""
        content = ""
        classtype = "attempted-admin"
        
        if "waf" in control_name or "input validation" in control_name:
            # Si el WAF falla, buscamos SQLi o XSS en el tráfico interno
            msg = f"Posible WAF Bypass - Intento de Inyeccion ({control_name})"
            content = 'content:"UNION SELECT"; nocase; content:"OR 1=1"; nocase;'
            classtype = "web-application-attack"
            proto = "tcp"
            ports = "$HTTP_PORTS"
            
        elif "segmentation" in control_name or "vlan" in control_name or "firewall" in control_name:
            # Si la segmentación falla, detectamos tráfico entre zonas no permitidas
            msg = f"Violacion de Segmentacion - Trafico Lateral Detectado ({control_name})"
            # En un entorno real, las IPs se definirían en variables. Aquí usamos any->any como plantilla.
            content = "" # Detección por flujo, no por contenido
            classtype = "policy-violation"
            proto = "ip"
            ports = "any"
            
        elif "rate limit" in control_name or "ddos" in control_name:
            # Detección de volumen si el rate limit falla
            msg = f"Posible DoS - Alto Volumen de Trafico ({control_name})"
            content = 'threshold: type both, track by_src, count 100, seconds 10;'
            classtype = "attempted-dos"
            proto = "tcp"
            ports = "$HTTP_PORTS"
            
        elif "auth" in control_name or "mfa" in control_name:
            # Detección de fuerza bruta
            msg = f"Fallo de Autenticacion - Posible Fuerza Bruta ({control_name})"
            content = 'content:"Login failed"; nocase; threshold: type both, track by_src, count 5, seconds 60;'
            classtype = "unsuccessful-user-login"
            proto = "tcp"
            ports = "any"
            
        elif "edr" in control_name or "antivirus" in control_name:
             # Detección de malware en red (si EDR falla en endpoint)
            msg = f"Malware en Red - EDR Bypass sospechoso ({control_name})"
            content = 'content:"MZ"; depth:2; msg:"Windows Executable over Network";'
            classtype = "malware-cnc"
            proto = "tcp"
            ports = "any"

        else:
            # Regla genérica para controles no mapeados
            msg = f"Alerta Generica para Control: {control_name}"
            content = ""
            proto = "ip"
            ports = "any"

        # Construcción de la regla Suricata/Snort
        # alert [proto] [src_ip] [src_port] -> [dst_ip] [dst_port] (options)
        
        rule_body = f'msg:"{msg}"; {content} classtype:{classtype}; sid:{sid}; rev:1;'
        
        if format_type == "suricata":
             return f"alert {proto} any any -> any {ports} ({rule_body})"
        else:
             return f"alert {proto} any any -> any {ports} ({rule_body})"

def main():
    parser = argparse.ArgumentParser(description="Generador de Reglas IDS desde Arquitectura")
    parser.add_argument("--config", required=True, help="Archivo JSON exportado por architecture_designer.py")
    parser.add_argument("--format", default="suricata", choices=["suricata", "snort"], help="Formato de salida")
    parser.add_argument("--output", help="Archivo de salida para las reglas (.rules)")
    
    args = parser.parse_args()
    
    try:
        converter = ThreatToDetection(args.config)
        rules = converter.generate_rules(args.format)
        
        output_content = "\n".join(rules)
        
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(output_content)
            print(f"Reglas generadas exitosamente en: {args.output}")
        else:
            print(output_content)
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
