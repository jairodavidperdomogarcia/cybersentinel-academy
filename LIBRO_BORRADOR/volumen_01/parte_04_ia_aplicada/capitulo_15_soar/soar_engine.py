import yaml
import re
import sys
import json
import hashlib
from pathlib import Path
from typing import Dict, Any

from connectors.threat_intel import ThreatIntel
from connectors.firewall import FirewallConnector
from connectors.notification import NotificationConnector
from connectors.custom_logging import LoggerConnector
from connectors.email_gateway import EmailGateway
from connectors.cap14_orchestrator import Cap14Orchestrator
from connectors.ai_assistant import AIAssistantConnector

from types import SimpleNamespace


class SoarEngine:
    def __init__(self):
        self.connectors = {
            "threat_intel": ThreatIntel(),
            "firewall": FirewallConnector(),
            "notification": NotificationConnector(),
            "logging": LoggerConnector(),
            "email_gateway": EmailGateway(),
            "cap14": Cap14Orchestrator(),
            "ai_assistant": AIAssistantConnector(),
        }
        self.context = {
            "result": {}
        }

    def _dict_to_obj(self, d):
        if isinstance(d, dict):
            return SimpleNamespace(**{k: self._dict_to_obj(v) for k, v in d.items()})
        if isinstance(d, list):
            return [self._dict_to_obj(x) for x in d]
        return d

    def load_playbook(self, path: str) -> Dict:
        try:
            # Resolver ruta absoluta basada en la ubicación del script
            base_path = Path(__file__).parent
            full_path = base_path / path
            
            # Si ya es absoluta o existe tal cual, usarla
            if not full_path.exists() and Path(path).exists():
                full_path = Path(path)
                
            with open(full_path, 'r', encoding='utf-8') as f:
                return yaml.safe_load(f)
        except Exception as e:
            print(f"Error cargando playbook '{path}': {e}")
            sys.exit(1)

    def resolve_template(self, text: str) -> str:
        if not isinstance(text, str):
            return text

        pattern = r"\{\{\s*([\w\d_\[\]\.\'\"]+)\s*\}\}"
        eval_context = {k: self._dict_to_obj(v) for k, v in self.context.items()}

        def replace_match(match):
            expr = match.group(1)
            try:
                val = eval(expr, {}, eval_context)
                return str(val)
            except Exception:
                return f"<ERROR_RESOLVING_{expr}>"

        return re.sub(pattern, replace_match, text)

    def execute_action(self, step: Dict):
        action_path = step['action']
        module_name, method_name = action_path.split('.')
        
        if module_name not in self.connectors:
            raise ValueError(f"Conector desconocido: {module_name}")
            
        connector = self.connectors[module_name]
        method = getattr(connector, method_name)
        
        args = {}
        for k, v in step.get('input', {}).items():
            args[k] = self.resolve_template(v)
            
        print(f"--- Ejecutando Paso: {step['id']} ({action_path}) ---")
        output = method(**args)
        
        self.context['result'][step['id']] = output
        return output

    def evaluate_condition(self, step: Dict) -> str:
        print(f"--- Evaluando Condición: {step['id']} ---")
        checks = step['check']
        
        eval_context = {k: self._dict_to_obj(v) for k, v in self.context.items()}

        for check in checks:
            if 'if' in check:
                condition = check['if']
                # Resolver variables dentro de la condición antes de evaluar
                # Nota: Para este prototipo, eval maneja la lógica booleana directamente
                # si el string es código Python válido con las variables del contexto.
                try:
                    # Permitimos acceso directo a 'result' y 'event' en el eval
                    is_true = eval(condition, {}, eval_context)
                    print(f"    ¿{condition}? -> {is_true}")
                    if is_true:
                        return check['goto']
                except Exception as e:
                    print(f"    Error evaluando condición '{condition}': {e}")
            elif 'else' in check:
                print("    Else -> Tomando camino por defecto")
                return check['goto']
        
        return None

    def run(self, playbook_path: str, trigger_event: Dict):
        playbook = self.load_playbook(playbook_path)
        print(f"🚀 INICIANDO SOAR ENGINE | Playbook: {playbook['name']}")
        print(f"ℹ️  Descripción: {playbook['description']}")
        
        # Inicializar contexto con el evento disparador
        self.context['event'] = trigger_event
        
        # Indexar pasos por ID para saltos (goto)
        steps_map = {step['id']: step for step in playbook['steps']}
        
        # Determinar primer paso
        current_step_id = playbook['steps'][0]['id']
        
        while current_step_id and current_step_id != 'end':
            step = steps_map.get(current_step_id)
            if not step:
                print(f"❌ Error: Paso '{current_step_id}' no encontrado.")
                break
                
            next_step_id = None
            
            if step.get('type') == 'condition':
                next_step_id = self.evaluate_condition(step)
            elif step.get('type') == 'end':
                print("🏁 Fin del Playbook.")
                break
            else:
                # Acción normal
                self.execute_action(step)
                next_step_id = step.get('next')
            
            current_step_id = next_step_id

        print("✅ Ejecución completada.")
        self.update_tracker_progress(playbook['name'])

    def update_tracker_progress(self, playbook_name: str):
        """Simula la actualización del Tracker de CyberSentinel"""
        tracker_file = Path(__file__).parent / "tracker_cap15.json"
        
        data = {}
        if tracker_file.exists():
            try:
                with open(tracker_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except:
                pass
        
        # Registrar ejecución
        if "completed_playbooks" not in data:
            data["completed_playbooks"] = []
        
        if playbook_name not in data["completed_playbooks"]:
            data["completed_playbooks"].append(playbook_name)
            
        # Calcular score (simplificado)
        score = len(data["completed_playbooks"]) * 33 # 3 playbooks = ~100
        if score > 100: score = 100
        
        data["score"] = score
        data["last_update"] = "Just now"
        
        with open(tracker_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
            
        print(f"\n📊 [TRACKER] Progreso actualizado: {score}% completado. ({len(data['completed_playbooks'])} playbooks ejecutados)")

        if score >= 99:
            # Token determinista pero 'secreto'
            secret = "CYBERSENTINEL_SOAR_MASTER_2026"
            validation_token = hashlib.sha256(secret.encode()).hexdigest()[:8].upper()
            print("\n" + "═"*60)
            print(f"🎉 ¡MISIÓN CUMPLIDA! HAS DOMINADO EL MOTOR SOAR")
            print(f"🔑 CÓDIGO DE VALIDACIÓN: SOAR-{validation_token}")
            print(f"👉 Copia este código para validar tu progreso en el Dashboard Web.")
            print("═"*60 + "\n")


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "ports"

    engine = SoarEngine()

    if mode == "phishing":
        mock_event = {
            "message_id": "MSG-1001",
            "sender_ip": "203.0.113.24",
            "recipient": "analyst@cybersentinel.ai",
            "subject": "Actualiza tu contraseña",
            "timestamp": "2023-10-27T15:00:00Z",
        }
        engine.run("playbooks/phishing_response.yaml", mock_event)
    elif mode == "ransomware":
        mock_event = {
            "alert_id": "ALERT-RANSOM-01",
            "source": "wazuh",
            "timestamp": "2023-10-27T16:00:00Z",
        }
        engine.run("playbooks/ransomware_incident.yaml", mock_event)
    elif mode == "ai":
        mock_event = {
            "raw_log": "2023-10-27 10:00:01 WAF-ALERT: Blocked SQL Injection attempt from 185.220.101.50 using payload 'UNION SELECT * FROM users'",
            "source": "WAF",
            "timestamp": "2023-10-27T10:00:01Z"
        }
        engine.run("playbooks/investigacion_asistida.yaml", mock_event)
    else:
        mock_event = {
            "source_ip": "192.168.1.103",
            "target_port": 22,
            "timestamp": "2023-10-27T14:30:00Z",
        }
        engine.run("playbooks/defensa_perimetro.yaml", mock_event)
