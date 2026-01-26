# LABORATORIO 06: PROYECTO FINAL - ASESOR DE SEGURIDAD PARA "AUTOMANUFACT INC."

> 🎯 Objetivo de la Misión: Actuar como consultor de ciberseguridad. Realizarás un modelado de amenazas completo e integrado para un sistema industrial, aplicando PASTA y generando un informe ejecutivo.
>> ⏱️ Tiempo Estimado: 2-3 horas.
>> 📝 Entregable: Informe Ejecutivo de Modelado de Amenazas (usando la Plantilla Informe Lab 06 en formato `.md` descargable desde la plataforma).

---

## 📖 Escenario: La Fábrica 4.0 Desprotegida

AutoManufact Inc. está modernizando su línea de ensamblaje principal. El nuevo sistema "ProdSync 4.0" integra:

- Sensores IoT en robots que envían datos de vibración y temperatura.
- Una pasarela (gateway) industrial en la fábrica que recibe datos y los envía.
- La plataforma cloud de AutoManufact (AWS) que analiza datos para predicción de mantenimiento.
- Una aplicación web para que los ingenieros de planta vean alertas y manuales.
- Tablets en la fábrica que acceden a esa app web.

El CIO te contrata:

> "Necesitamos entender los riesgos de seguridad antes de conectar todo. Enséñanos los agujeros más grandes."

---

## 🛠️ Parte A: Análisis y Diagrama (45 min)

Dibuja un DFD Nivel 1 del sistema "ProdSync 4.0".

- Incluye Límites de Confianza: Red de Planta (OT), DMZ Industrial, Internet, Cloud (AWS).
- Componentes clave: Sensores IoT, Gateway Industrial, Plataforma Cloud, App Web, Tablets, Ingenieros.
- Identifica y marca los 3 flujos de datos más críticos que cruzan límites de confianza.

Puedes usar lápiz y papel, una herramienta de diagramas o Mermaid. Lo importante es que puedas explicarlo.

---

## 🕵️ Parte B: Identificación y Priorización de Amenazas (45 min)

Usando tu DFD, llena una Tabla de Amenazas STRIDE con al menos 6 amenazas distribuidas en diferentes componentes.

Para cada amenaza, usa tu script `risk_calc.py` (del Lab 05) o una matriz mental para asignar:

- Impacto (1-5).
- Probabilidad (1-5).
- Nivel de Riesgo (Bajo/Medio/Alto/Crítico).

Ordena tu tabla de mayor a menor riesgo. Esta será tu lista priorizada.

---

## 📈 Parte C: Desarrollo del Informe Ejecutivo (60 min)

Usando la plantilla de informe ejecutivo en formato `.md` (Plantilla Informe Lab 06, descargable desde la plataforma), completa las siguientes secciones con los hallazgos de las Partes A y B:

### 1. Resumen Ejecutivo (4-5 oraciones)

- Propósito de la evaluación.
- Hallazgo principal N.º 1 (el riesgo más alto).
- Recomendación clave N.º 1 (la mitigación más importante).
- Declaración general del riesgo.

### 2. Tabla de Riesgos Principales (Top 3)

Extrae las 3 amenazas de mayor riesgo de tu tabla de STRIDE y construye una tabla con:

- Riesgo.
- Componente afectado.
- Impacto probable.
- Nivel de riesgo.
- Recomendación.

### 3. Recomendación Detallada para el Riesgo N.º 1

- Describe la amenaza con más detalle (puedes usar la Kill Chain si es útil).
- Propón una medida de mitigación concreta para Prevención, Detección y Respuesta (como en el Lab 04).

### 4. Reflexión Final

En 3-4 líneas, explica cuál fue la parte más difícil del proceso integrado y qué aprendiste de ella.

---

## ✅ Checklist de Entrega Final del Proyecto 06

- [ ] DFD Nivel 1 con límites de confianza claros.
- [ ] Tabla de Amenazas STRIDE priorizada por riesgo (mínimo 6).
- [ ] Informe Ejecutivo completo con Resumen, Top 3 de riesgos y recomendación detallada para el principal.
- [ ] Reflexión final escrita (3-4 líneas).

---

## 📊 CyberSentinel Tracker – Evaluación del Proyecto Final

Rúbrica de Autoevaluación del Proyecto 06. Marca lo completado. Sé honesto, es para tu crecimiento.

<div class="lab-tracker-container" data-lab-id="lab06">
  <table class="lab-tracker-table">
    <thead>
      <tr>
        <th>Criterio</th>
        <th>✅ Completado</th>
        <th>Puntos</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Parte A: DFD con límites de confianza y 3 flujos críticos identificados.</td>
        <td style="text-align:center;">
          <input type="checkbox" class="lab-checkbox" data-row="dfd" data-points="3">
        </td>
        <td>/3</td>
      </tr>
      <tr>
        <td>Parte B: Tabla STRIDE con ≥6 amenazas priorizadas por riesgo.</td>
        <td style="text-align:center;">
          <input type="checkbox" class="lab-checkbox" data-row="stride" data-points="3">
        </td>
        <td>/3</td>
      </tr>
      <tr>
        <td>Parte C: Informe Ejecutivo con Resumen claro y Top 3 de riesgos.</td>
        <td style="text-align:center;">
          <input type="checkbox" class="lab-checkbox" data-row="informe" data-points="3">
        </td>
        <td>/3</td>
      </tr>
      <tr>
        <td>Calidad: Recomendaciones concretas y accionables (no vagas).</td>
        <td style="text-align:center;">
          <input type="checkbox" class="lab-checkbox" data-row="calidad" data-points="2">
        </td>
        <td>/2</td>
      </tr>
      <tr>
        <td>Reflexión: Incluye reflexión personal sobre el aprendizaje.</td>
        <td style="text-align:center;">
          <input type="checkbox" class="lab-checkbox" data-row="reflexion" data-points="1">
        </td>
        <td>/1</td>
      </tr>
    </tbody>
  </table>

  <div class="lab-score-display">
    PUNTUACIÓN DEL PROYECTO: <span class="lab-score-value">0 / 12</span>
  </div>
  <div class="lab-feedback">
    0-6 puntos: Revisa los fundamentos de los Capítulos 04 y 05.<br>
    7-9 puntos: Buen trabajo de integración. Revisa la claridad de tu informe.<br>
    10-12 puntos: Excelente. Tienes una base sólida en modelado de amenazas.
  </div>
</div>
