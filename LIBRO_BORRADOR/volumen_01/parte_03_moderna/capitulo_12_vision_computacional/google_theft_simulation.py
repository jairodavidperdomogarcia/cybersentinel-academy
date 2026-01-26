# CASO REAL SIMULADO: Robo de Laptops en Google (2013)
# https://www.wired.com/2013/08/google-laptops-stolen/

class GoogleLaptopTheftSimulation:
    """Simula el robo real de 20 laptops de Google en 2013"""
    
    def __init__(self):
        self.case_details = {
            "fecha": "Agosto 2013",
            "ubicacion": "Oficinas de Google, Mountain View",
            "perdida": "20 laptops con datos sensibles",
            "metodo": "Intruso se hizo pasar por empleado",
            "tiempo_deteccion": "3 días después",
            "falla_clave": "Sin reconocimiento facial + credenciales prestadas"
        }
        
    def simulate_attack(self):
        print("\n" + "="*70)
        print("SIMULACIÓN DE CASO REAL: ROBO DE LAPTOPS EN GOOGLE (2013)")
        print("="*70)
        
        # Recrear la secuencia del ataque real
        sequence = [
            ("Día 1 - 9:00 AM", "Intruso obtiene credenciales de empleado real (ingeniería social)"),
            ("Día 1 - 10:30 AM", "Entra a edificio usando badge prestado - CÁMARA: 'Badge válido'"),
            ("Día 1 - 11:00 AM", "Se mueve por oficinas como si fuera empleado - CÁMARA: 'Comportamiento normal'"),
            ("Día 1 - 2:00 PM", "Toma primera laptop - CÁMARA: 'Persona con laptop' (normal en Google)"),
            ("Día 1 - 5:30 PM", "Sale con mochila - CÁMARA: 'Empleado saliendo'"),
            ("Día 2 - 9:15 AM", "Repite proceso - CÁMARA: 'Misma persona, mismo badge'"),
            ("Día 3 - 10:00 AM", "Empleado real reporta badge perdido"),
            ("Día 3 - 3:00 PM", "Seguridad revisa cámaras - DEMASIADO TARDE")
        ]
        
        for time, action in sequence:
            print(f"\n[{time}]")
            print(f"   Acción: {action}")
            
            # ¿Qué hubiera detectado visión computacional?
            if "CÁMARA" in action:
                detection = self.what_computer_vision_would_see(action)
                print(f"   🎯 DETECCIÓN POSIBLE: {detection}")
    
    def what_computer_vision_would_see(self, action):
        """Analiza lo que un sistema moderno hubiera detectado"""
        if "Badge válido" in action:
            return "Reconocimiento facial: 'Rostro NO coincide con dueño del badge'"
        elif "Comportamiento normal" in action:
            return "Análisis de comportamiento: 'Persona merodea en áreas no asignadas'"
        elif "Persona con laptop" in action:
            return "Detección de objetos: 'Laptop siendo colocada en mochila personal'"
        elif "Misma persona" in action:
            return "Trackeo: 'Persona repetida sin horario laboral registrado'"
        
        return "Sin detección específica"

# Ejecutar simulación
if __name__ == "__main__":
    simulation = GoogleLaptopTheftSimulation()
    simulation.simulate_attack()