# Capítulo 3: Caza de Amenazas (Threat Hunting)

## 🏹 "La ausencia de evidencia no es evidencia de ausencia"

El Threat Hunting es el cambio de mentalidad más importante del curso. Dejamos de esperar a que suene la alarma (Reactivo) y salimos a buscar al intruso (Proactivo).

### 3.1 El Ciclo de Caza (The Hunting Cycle)
1.  **Hipótesis:** Una suposición educada basada en inteligencia.
    *   *Ejemplo:* "Creo que el grupo APT29 está usando PowerShell ofuscado para moverse lateralmente en nuestra red".
2.  **Investigación:** Buscar en los datos (Logs).
    *   *Herramienta:* ELK Stack (Elasticsearch, Logstash, Kibana) o Splunk.
3.  **Descubrimiento:** Confirmar o refutar la hipótesis.
    *   *Hallazgo:* Encontramos un script de PowerShell ejecutado a las 3 AM por el usuario 'mantenimiento'.
4.  **Respuesta y Enriquecimiento:**
    *   Aislar el host infectado.
    *   Crear una nueva regla automática para que la próxima vez, la alerta salte sola.

### 3.2 Herramientas del Cazador
*   **Sysmon (System Monitor):** Ojos y oídos en Windows. Registra creación de procesos, conexiones de red y cambios en archivos.
*   **SIEM:** El cerebro que correlaciona millones de eventos.

### 3.3 Laboratorio: Detectando Anomalías
En el módulo `03.5_Threat_Hunting_Proactivo`, aprenderemos a diferenciar el comportamiento normal de un administrador del comportamiento de un atacante, basándonos en la **frecuencia** y el **patrón** de sus comandos.

## Sección 1: Por qué esto importa para tu carrera

- El Threat Hunting es una habilidad puente entre SOC, DFIR y detección avanzada
- Mejora tu perfil para roles con mayor autonomía y salario (detección, respuesta, ingeniería)
- Te entrena en hipótesis, evidencia y comunicación: lo que piden equipos senior

## Sección 2: Ejemplos de industria real

- **Banca:** caza proactiva de abuso de PowerShell, lateral movement y exfiltración silenciosa
- **Energéticas:** búsqueda de persistencia en endpoints y saltos entre segmentos críticos
- **Gobierno:** campañas APT donde la detección por firmas es insuficiente

## Sección 3: Habilidades para tu CV/LinkedIn

**Frases exactas (ejemplos):**
- "Threat hunting basado en hipótesis con Sysmon y SIEM"
- "Detección de movimiento lateral e IoCs mediante correlación de eventos"

**Keywords para ATS (ejemplos):**
- Threat hunting, SIEM, Sysmon, ELK, Splunk, IoC, EDR, detection engineering, MITRE ATT&CK

**Cómo cuantificar tus logros (plantillas):**
- "Reduje el MTTD de X horas a Y minutos con hunts semanales y nuevas reglas"
- "Generé N detecciones nuevas y disminuí falsos positivos en X%"

## Sección 4: Oportunidades concretas

**Puestos específicos (ejemplos):**
- Threat Hunter / Detection Engineer
- SOC Analyst (Tier 2/3)
- Incident Responder (DFIR)
- Security Engineer (detección y monitoreo)

**Ejemplos de empresas que suelen publicar vacantes relacionadas:**
- MSSP/SOC gestionados
- Bancos y aseguradoras
- Equipos internos de seguridad en SaaS y cloud

**Cómo preparar la entrevista (guía corta):**
- Presenta 1 hipótesis completa: señales, datos, query y resultado
- Explica qué harías si la hipótesis falla (nueva hipótesis, nuevos datos)

## Sección 5: Para emprendedores

- Servicio mensual de “hunting + hardening” para pymes (retainer)
- Implementación y ajuste de Sysmon + tablero básico en SIEM
- Formación corporativa en detección basada en MITRE ATT&CK
