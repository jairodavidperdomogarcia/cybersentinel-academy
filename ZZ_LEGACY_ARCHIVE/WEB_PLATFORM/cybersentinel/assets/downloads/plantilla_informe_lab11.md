# Informe de Laboratorio 11: Threat Hunting en Profundidad

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre]
**Fecha:** [Fecha]
**Escenario base (Cap 06–07):** [Ej: AutoManufact / MediTech / TechSafelock]
**Arquitectura y sensores usados (Cap 07–09):** [Ej: mi_arquitectura.json + reglas cybersentinel.rules]
**Fuente principal de logs (Cap 10–11):** [Ej: apt29_simulated_logs.csv / ELK]

---

## 1. Hipótesis de Caza

Describe la hipótesis inicial que guió tu hunting.

- Hipótesis principal:  
  > [Ej: "APT29 está usando PowerShell ofuscado para moverse lateralmente"]

- Indicadores que esperas encontrar (comandos, patrones, hosts):  
  > [Lista de ideas iniciales]

---

## 2. Hunts y Consultas Ejecutadas (apoyados en 06–10)

Lista las principales consultas, scripts o filtros que utilizaste.

1. Hunt 1 – [Nombre]:  
   - Origen de la hipótesis (Cap 06): [Amenaza o riesgo que estás persiguiendo]  
   - Herramienta o script: [Ej: APT29Hunter.generate_hunting_report()]  
   - Filtro/criterio: [ ]  
   - Objetivo: [ ]

2. Hunt 2 – [Nombre]:  
   - Controles / reglas base usadas (Cap 07–08): [Ej: regla CYBERSENTINEL sobre DNS/HTTPS]  
   - Herramienta o script: [ ]  
   - Filtro/criterio: [ ]  
   - Objetivo: [ ]

3. Hunt 3 – [Nombre]:  
   - Señal o anomalía previa (Cap 09–10): [Ej: host marcado como anómalo por tu modelo]  
   - Herramienta o script: [ ]  
   - Filtro/criterio: [ ]  
   - Objetivo: [ ]

---

## 3. Hallazgos Clave

Completa la tabla con los eventos más relevantes encontrados.

| Hora / Timestamp | Host Origen | Host Destino / Usuario | Indicador / Herramienta | Descripción breve |
| :--------------- | :---------- | :--------------------- | :---------------------- | :---------------- |
| [ ]              | [ ]         | [ ]                    | [ ]                     | [ ]               |
| [ ]              | [ ]         | [ ]                    | [ ]                     | [ ]               |
| [ ]              | [ ]         | [ ]                    | [ ]                     | [ ]               |

---

## 4. Respuesta y Contención Propuesta

Basado en tus hallazgos:

- Hosts a aislar: [ ]
- Cuentas a revisar o resetear: [ ]
- Nuevas reglas de detección a crear (SIEM/IDS): [ ]
- Actualizaciones de playbooks que propones: [ ]

---

## 5. Lecciones Aprendidas

1. ¿Qué tipo de evidencia fue más útil para confirmar o refutar tu hipótesis?  
   > [Tu respuesta]

2. ¿Qué mejorarías en el próximo hunt (datos adicionales, herramientas, proceso)?  
   > [Tu respuesta]

3. ¿Cómo resumirías este hunting a tu jefe en 3–4 líneas?  
   > [Tu mini-informe ejecutivo]
