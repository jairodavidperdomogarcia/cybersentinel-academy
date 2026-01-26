# Informe Ejecutivo de Modelado de Amenazas – Proyecto 06

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre]  
**Fecha:** [Fecha]  
**Cliente:** AutoManufact Inc. – Sistema "ProdSync 4.0"

---

## 1. Resumen Ejecutivo

> **Instrucción:** Escribe entre 4 y 5 oraciones. Imagina que el Director solo leerá este bloque.

- **Propósito de la evaluación:**  
  > Ejemplo: "Evaluar los riesgos de ciberseguridad asociados a la conexión del sistema industrial ProdSync 4.0 a la nube de AutoManufact Inc."

- **Hallazgo principal N.º 1 (riesgo más alto):**  
  > Ejemplo: "El riesgo más alto identificado es la posibilidad de manipulación remota de parámetros de robots a través de la pasarela industrial."

- **Recomendación clave N.º 1 (acción principal):**  
  > Ejemplo: "Implementar autenticación fuerte y segmentación de red estricta entre la pasarela OT y la nube antes de la puesta en producción."

- **Declaración general del riesgo:**  
  > Ejemplo: "El riesgo global es Medio-Alto, pero puede reducirse a un nivel aceptable si se implementan los controles recomendados en los próximos 90 días."

---

## 2. Metodología Utilizada

> **Instrucción:** Resume brevemente cómo llegaste a tus conclusiones.

- Framework principal: **PASTA** (Process for Attack Simulation and Threat Analysis).  
- Identificación de amenazas: **STRIDE** aplicado a los componentes del DFD de ProdSync 4.0.  
- Priorización: **Matriz de Riesgo** (Impacto x Probabilidad) basada en el Capítulo 05.  
- Apoyo conceptual: **Kill Chain** para entender cómo se materializaría el ataque más importante.

---

## 3. Arquitectura y Superficie de Ataque

> **Instrucción:** Resume la arquitectura usando tu DFD y marca los puntos más expuestos.

- **Descripción breve del sistema:**  
  > Ejemplo: "ProdSync 4.0 recoge datos de sensores IoT en robots, los envía a una pasarela OT en planta, los reenvía a la nube (AWS) para análisis y expone resultados en una aplicación web accesible desde tablets de ingenieros."

- **Límites de confianza clave identificados:**  
  - Red de Planta (OT).  
  - DMZ Industrial.  
  - Internet.  
  - Nube (AWS).

- **Puntos principales de exposición:**  
  - [Punto 1: Ej. Pasarela OT ↔ Nube].  
  - [Punto 2: Ej. App web accesible desde tablets].  
  - [Punto 3: Ej. Sensores IoT no autenticados].

*(Puedes adjuntar tu DFD en un anexo o referenciarlo aquí.)*

---

## 4. Riesgos Principales (Top 3)

> **Instrucción:** Extrae de tu tabla STRIDE los 3 riesgos con mayor puntuación de riesgo.

| Riesgo | Componente afectado | Impacto probable | Nivel de riesgo (B/M/A/C) | Recomendación resumida |
| :--- | :--- | :--- | :---: | :--- |
| [Riesgo 1] | [Componente] | [Consecuencia principal] | [ ] | [Acción principal] |
| [Riesgo 2] | [Componente] | [Consecuencia principal] | [ ] | [Acción principal] |
| [Riesgo 3] | [Componente] | [Consecuencia principal] | [ ] | [Acción principal] |

---

## 5. Desarrollo del Riesgo N.º 1 (Caso en Profundidad)

> **Instrucción:** Explica por qué el Riesgo 1 es el más importante y cómo se materializaría.

**Descripción de la amenaza:**  
[Resume la amenaza más crítica en 2-3 oraciones.]

**Opcional – Kill Chain del ataque:**  
1. **Reconocimiento:** [Qué haría el atacante para preparar el ataque.]  
2. **Preparación del arma:** [Malware, credenciales robadas, lateral movement, etc.]  
3. **Entrega / Explotación:** [Cómo entra en el sistema OT/Cloud.]  
4. **Instalación / Persistencia:** [Cómo se mantiene dentro del entorno.]  
5. **Comando y Control:** [Cómo controla los robots o la infraestructura.]  
6. **Acción sobre los objetivos:** [Qué daño final produce (paradas, sabotaje, seguridad física...).]

**Medidas recomendadas para el Riesgo N.º 1:**

- **Prevención (Evitar que ocurra):**  
  - [Control 1 de prevención.]  
  - [Control 2 de prevención.]

- **Detección (Saber si ocurre):**  
  - [Control 1 de detección.]  
  - [Control 2 de detección.]

- **Respuesta (Contener el daño):**  
  - [Control 1 de respuesta.]  
  - [Control 2 de respuesta.]

---

## 6. Siguientes Pasos y Cronograma

> **Instrucción:** Propón una mini hoja de ruta que un Director pueda entender.

- **Acción 1 (Alta prioridad):**  
  - Descripción: [Ej: Implementar autenticación fuerte y segmentación de red entre pasarela OT y nube.]  
  - Responsable sugerido: [Ej: Equipo de Infraestructura OT + Seguridad.]  
  - Horizonte: [Ej: 30 días.]

- **Acción 2 (Media prioridad):**  
  - Descripción: [Ej: Centralizar y auditar logs de eventos críticos en ProdSync 4.0.]  
  - Horizonte: [Ej: 60 días.]

- **Acción 3 (Mejora continua):**  
  - Descripción: [Ej: Programa de revisión periódica de amenazas y pruebas de intrusión.]  
  - Horizonte: [Ej: 90 días y recurrente.]

---

## 7. Conclusión General

> **Instrucción:** Cierra el informe en 2-3 oraciones. Conecta riesgo, acción y valor para el negocio.

Ejemplos de frases de cierre:

- "Si se implementan las medidas propuestas, AutoManufact Inc. podrá conectar ProdSync 4.0 a la nube reduciendo de forma significativa el riesgo de interrupciones de producción causadas por actores maliciosos."
- "La inversión en estos controles es baja comparada con el costo potencial de parar la línea de ensamblaje por un incidente de ciberseguridad."

> [Escribe aquí tu conclusión final.]

