# Lección ética desde la realidad
class HongKongFacialRecognitionCase:
    """Caso real de uso éticamente cuestionable"""
    
    def ethical_dilemma(self):
        print("\n" + "="*70)
        print("CASO REAL - RECONOCIMIENTO FACIAL EN PROTESTAS DE HONG KONG")
        print("="*70)
        
        facts = [
            "• Gobierno implementó reconocimiento facial masivo en cámaras públicas",
            "• Identificaba manifestantes en tiempo real",
            "• Cruzaba datos con redes sociales",
            "• Arrestaba personas horas después de protestas",
            "• Algunos 'falsos positivos' fueron arrestados"
        ]
        
        print("\nHECHOS DOCUMENTADOS:")
        for fact in facts:
            print(f"  {fact}")
        
        print("\n" + "-"*70)
        print("PREGUNTAS ÉTICAS PARA EL ESTUDIANTE CYBERSENTINEL:")
        print("-"*70)
        
        questions = [
            "1. ¿Dónde está la línea entre 'seguridad pública' y 'vigilancia masiva'?",
            "2. ¿Cómo evitar falsos positivos que arruinan vidas inocentes?",
            "3. ¿Qué salvaguardas implementarías si tuvieras que desplegar este sistema?",
            "4. ¿Cómo auditarías que no se use para persecución política?"
        ]
        
        for q in questions:
            print(f"\n{q}")
        
        print("\n" + "="*70)
        print("LA POSICIÓN CYBERSENTINEL:")
        print("="*70)
        print("""
  1. TRANSPARENCIA: Informar públicamente dónde hay reconocimiento facial
  2. PROPÓSITO LIMITADO: Solo para crímenes graves, no para vigilancia política
  3. AUDITORÍA: Revisiones independientes de los algoritmos y resultados
  4. DERECHO A APELAR: Mecanismos para contestar identificaciones erróneas
  5. SUNSET CLAUSES: Los sistemas expiran y deben ser reautorizados
        """)

# Ejecutar caso ético
if __name__ == "__main__":
    ethical_case = HongKongFacialRecognitionCase()
    ethical_case.ethical_dilemma()