# Capítulo 4: Inteligencia Artificial Ofensiva y Defensiva

## 🏥 Caso de Estudio: Sanar Digital

La IA ha cambiado el juego. Ya no es ciencia ficción; es una herramienta que amplifica tanto el ataque como la defensa.

### 4.1 IA Ofensiva: El Enemigo Automatizado
*   **Deepfakes:** Suplantación de voz o video para autorizar transferencias fraudulentas.
*   **Malware Polimórfico:** Virus que reescriben su propio código en cada infección para evadir los antivirus tradicionales (basados en firmas).
*   **Fuzzing Inteligente:** Usar IA para encontrar vulnerabilidades en software mucho más rápido que un humano.

### 4.2 IA Defensiva: El Escudo Cognitivo
*   **Detección de Comportamiento (UBA):** Una IA aprende qué es "normal" para el usuario Juan (horarios, carpetas que accede). Si Juan de repente descarga 50GB de datos a las 2 AM, la IA lo bloquea, aunque Juan tenga la contraseña correcta.
*   **Respuesta Automatizada (SOAR):** La IA puede tomar decisiones en milisegundos: "He detectado un ransomware; aislaré estos 5 ordenadores de la red inmediatamente".

### 4.3 Laboratorio: Reglas vs. IA
En `lab01_behavior_vs_rules.py`, comparamos un firewall clásico (que solo busca la palabra "MALWARE") contra un sistema inteligente que analiza el contexto.

## Sección 1: Por qué esto importa para tu carrera

- La seguridad con IA se está volviendo estándar en SOC, AppSec y detección de fraude
- Entender IA ofensiva y defensiva te permite anticipar tácticas y diseñar controles modernos
- En salud (IoMT), la detección de anomalías puede ser una diferencia de seguridad física

## Sección 2: Ejemplos de industria real

- **Salud (IoMT):** detección de comportamientos anómalos en dispositivos y accesos clínicos
- **Banca/Fintech:** modelos para detectar fraude y abuso de credenciales en tiempo real
- **Gobierno:** campañas de desinformación y deepfakes; análisis de patrones para atribución

## Sección 3: Habilidades para tu CV/LinkedIn

**Frases exactas (ejemplos):**
- "Detección de anomalías aplicada a seguridad (conceptos y pipeline)"
- "Análisis de riesgos de IA (amenazas ofensivas y mitigaciones defensivas)"

**Keywords para ATS (ejemplos):**
- Machine learning security, anomaly detection, behavioral analytics, SOAR, SOC automation, adversarial ML, LLM security

**Cómo cuantificar tus logros (plantillas):**
- "Aumenté la tasa de detección de eventos anómalos de X% a Y% ajustando señales y umbrales"
- "Reduje alert fatigue en X% priorizando señales y automatizando triage"

## Sección 4: Oportunidades concretas

**Puestos específicos (ejemplos):**
- SOC Engineer / Security Automation Engineer
- ML Engineer (Fraud/Security)
- Security Data Analyst
- AI Security / LLM Security (emergente)

**Ejemplos de empresas que suelen publicar vacantes relacionadas:**
- Healthtech e integradores de tecnología médica
- Equipos antifraude de banca/fintech
- Proveedores EDR/SIEM/SOAR

**Cómo preparar la entrevista (guía corta):**
- Explica una señal (feature), un riesgo y una mitigación en lenguaje claro
- Lleva 1 ejemplo de “falso positivo” y cómo lo reducirías

## Sección 5: Para emprendedores

- Consultoría de “detección de anomalías” aplicada a logs (MVP en 2–4 semanas)
- Auditoría de riesgos de IA/LLM para empresas que usan chatbots internos
- Formación de equipos: uso seguro de IA y prevención de abuso (políticas + controles)
