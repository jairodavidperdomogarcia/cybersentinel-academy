import sys
import os
from pathlib import Path

# Añadir ruta del Capítulo 13 al path para importar el módulo de IA
# Estructura: .../capitulo_15_soar/connectors/ -> .../capitulo_13_llms/
current_dir = Path(__file__).parent
cap13_path = current_dir.parents[1] / "capitulo_13_llms"

if str(cap13_path) not in sys.path:
    sys.path.append(str(cap13_path))

try:
    from llm_security_assistant import SecurityLLM
except ImportError:
    SecurityLLM = None
    print(f"⚠️ Error: No se pudo cargar 'llm_security_assistant' desde {cap13_path}")

class AIAssistantConnector:
    """
    Conector que integra el Asistente de Seguridad LLM (Capítulo 13)
    dentro del motor SOAR (Capítulo 15).
    """
    def __init__(self):
        if SecurityLLM:
            # Inicializamos con un nombre de modelo específico para trazabilidad
            self.llm = SecurityLLM(model_name="sentinel-soar-integrated")
        else:
            self.llm = None

    def analyze_alert(self, description: str):
        """
        Analiza una descripción de alerta o log usando la IA.
        """
        if not self.llm:
            return {"status": "error", "message": "Módulo IA no disponible"}
        
        print(f"[*] AI Connector: Solicitando análisis de: '{description[:50]}...'")
        # Reutilizamos analyze_log que ya devuelve un JSON estructurado
        report = self.llm.analyze_log(description)
        return report

    def audit_incident_code(self, code_snippet: str):
        """
        Analiza código sospechoso extraído de un incidente.
        """
        if not self.llm:
            return {"status": "error", "message": "Módulo IA no disponible"}
            
        print(f"[*] AI Connector: Auditando código ({len(code_snippet)} chars)...")
        report = self.llm.audit_code(code_snippet)
        return report