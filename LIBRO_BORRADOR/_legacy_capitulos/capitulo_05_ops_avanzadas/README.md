# Capítulo 5: Infraestructura Crítica y Seguridad SCADA

## 🏭 Caso de Estudio Final: Autobot Industries

Llegamos al pináculo del curso. Proteger datos es importante, pero proteger **vidas** es crítico.

### 5.1 ¿Qué es OT (Operational Technology)?
A diferencia de IT (Information Technology), donde la prioridad es la confidencialidad de los datos, en OT la prioridad es la **DISPONIBILIDAD** y la **SEGURIDAD FÍSICA (Safety)**.
*   **Entorno:** Una planta de ensamblaje robótico en *Autobot Industries*.
*   **Riesgo:** Si un hacker toma el control, no solo roba datos; puede hacer que un brazo robótico gire sin control y hiera a un operario, o que una centrífuga explote.

### 5.2 Protocolos Industriales
Son lenguajes antiguos, diseñados en los 80s/90s sin seguridad.
*   **Modbus / DNP3:** Texto plano. Cualquiera en la red puede leer y enviar comandos.
*   **Purdue Model:** La arquitectura de referencia para separar la red corporativa (IT) de la red industrial (OT).

### 5.3 Misión Final: Evitar el Colapso
En este módulo final, simularás ser el Jefe de Seguridad de *Autobot Industries*.
*   **Amenaza:** Un ataque de ransomware que intenta saltar desde la red de oficinas (IT) a los controladores de los robots (PLC).
*   **Defensa:** Implementarás un "Data Diode" (diodo de datos) lógico y monitoreo pasivo para detectar comandos anómalos sin interrumpir la producción.

> **Nota:** Aquí la latencia es crítica. Un retraso de 500ms por un antivirus puede detener la producción.

## Sección 1: Por qué esto importa para tu carrera

- OT/SCADA es un área con barrera de entrada alta y gran demanda en sectores críticos
- Combina seguridad con impacto físico: es un diferencial fuerte para roles senior
- Conocimiento de ISA/IEC 62443 y modelos OT/IT abre puertas en industria y energía

## Sección 2: Ejemplos de industria real

- **Energéticas/petroleras:** segmentación IT/OT y monitoreo pasivo para reducir riesgo operativo
- **Manufactura:** prevención de ransomware que impacta PLC/robots y detiene producción
- **Gobierno/infraestructura:** requerimientos de seguridad para proveedores y contratistas

## Sección 3: Habilidades para tu CV/LinkedIn

**Frases exactas (ejemplos):**
- "Fundamentos de seguridad OT/SCADA y modelo Purdue"
- "Análisis de riesgo operativo y segmentación IT/OT"

**Keywords para ATS (ejemplos):**
- SCADA, OT security, PLC, Purdue model, ISA/IEC 62443, NERC CIP, Modbus, DNP3, ICS monitoring

**Cómo cuantificar tus logros (plantillas):**
- "Reduje el riesgo de propagación de ransomware de IT a OT con segmentación y monitoreo pasivo"
- "Mejoré disponibilidad y reduje incidentes operativos en X% con controles de acceso"

## Sección 4: Oportunidades concretas

**Puestos específicos (ejemplos):**
- OT Security Analyst / ICS Security Engineer
- SCADA Security Consultant
- Industrial Network Engineer (seguridad)
- GRC en infraestructuras críticas

**Ejemplos de empresas que suelen publicar vacantes relacionadas:**
- Integradores industriales y automatización
- Operadores de energía, petróleo/gas y manufactura
- Consultoras de infraestructuras críticas

**Cómo preparar la entrevista (guía corta):**
- Explica OT vs IT y por qué disponibilidad/safety mandan
- Describe un escenario de ransomware IT→OT y cómo lo cortarías

## Sección 5: Para emprendedores

- Servicio de evaluación OT/IT “light” para plantas medianas (diagnóstico + roadmap)
- Implementación de segmentación y monitoreo pasivo con entregables ejecutivos
- Formación a equipos de operaciones: higiene de acceso y respuesta a incidentes OT
