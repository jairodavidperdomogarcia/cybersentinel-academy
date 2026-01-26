class NotificationConnector:
    def send(self, channel: str, message: str):
        """
        Simula el envío de una notificación a Slack, Teams o Email.
        """
        print(f"[@] NOTIFICACIÓN ({channel.upper()}): {message}")
        return {"status": "sent", "timestamp": "2023-10-27T10:00:00Z"}
