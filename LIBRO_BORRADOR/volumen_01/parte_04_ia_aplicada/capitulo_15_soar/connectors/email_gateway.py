class EmailGateway:
    def quarantine(self, message_id: str, reason: str):
        print(f"[MAIL] CUARENTENA MENSAJE {message_id}")
        print(f"       Razon: {reason}")
        return {"status": "quarantined", "id": message_id}

    def send(self, to: str, subject: str, body: str):
        print(f"[MAIL] ENVIANDO CORREO A: {to}")
        print(f"       Asunto: {subject}")
        print(f"       Cuerpo: {body}")
        return {"status": "sent", "timestamp": "now"}

