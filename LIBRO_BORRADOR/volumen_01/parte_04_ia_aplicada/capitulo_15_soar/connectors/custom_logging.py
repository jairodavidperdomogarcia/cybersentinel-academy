from datetime import datetime

class LoggerConnector:
    def write(self, message: str):
        """
        Escribe en el log de auditoría del SOAR.
        """
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        entry = f"[{timestamp}] SOAR_AUDIT: {message}"
        print(entry)
        # En producción: escribiría a un archivo real o SIEM
        return {"status": "logged", "entry": entry}