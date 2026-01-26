# Capítulo 05: Análisis de Riesgos - El Arte de la Priorización

> "El riesgo cero no existe. La seguridad no es la ausencia de peligro, es la presencia de control."

---

## 🎯 Objetivo de la Misión
En el Capítulo 04 aprendiste a ver amenazas en todas partes (Paranoia Constructiva). Ahora aprenderás que **no puedes arreglarlas todas**. Tu misión es aprender a **priorizar**: decidir qué arreglar hoy, qué arreglar mañana y qué aceptar, utilizando la lógica fría del Análisis de Riesgos.

*   **⏱️ Tiempo Estimado de Estudio:** 60 minutos.
*   **🛡️ Frameworks Clave:** Matriz de Riesgo, DREAD, Fórmula de Riesgo Cuantitativo.

---

## 5.0 El Triaje de Emergencia: Salva la Nave

*Estás al mando de la ciberseguridad de una nave estelar en combate. Tienes recursos para reparar SOLO UNA avería antes del siguiente ataque. Elige sabiamente.*

### 🚨 SITUACIÓN DE CRISIS
Los escudos están al 40%. Tienes 3 reportes de daños simultáneos. Tu equipo de ingenieros espera órdenes. ¿A dónde los envías?

<div class="quiz-block" data-quiz-id="triaje-riesgo">
  <p><strong>🛠️ ¿Qué reparas primero?</strong></p>
  <div class="quiz-options">
    <button class="quiz-option" data-option-id="a">
      <strong>A. El sistema de entretenimiento de la cafetería.</strong><br>
      <em>Daño:</em> Total. <em>Probabilidad de explotación enemiga:</em> Nula.
    </button>
    <button class="quiz-option" data-option-id="b" data-correct="true">
      <strong>B. La compuerta del hangar principal.</strong><br>
      <em>Daño:</em> Atascada abierta. <em>Probabilidad de invasión:</em> Muy Alta.
    </button>
    <button class="quiz-option" data-option-id="c">
      <strong>C. Un sensor de temperatura en el almacén 4.</strong><br>
      <em>Daño:</em> Lectura errónea. <em>Probabilidad de fallo catastrófico:</em> Baja (0.1%).
    </button>
  </div>
  <div class="quiz-feedback"></div>
</div>

### 🧩 EL CÓDIGO DEL RIESGO
Si elegiste la **Opción B**, acabas de aplicar intuitivamente la **Fórmula Fundamental del Riesgo** sin usar calculadora:

$$ Riesgo = Impacto \times Probabilidad $$

*   **Caso A:** Impacto Bajo x Probabilidad Baja = **Riesgo Trivial**. (Nadie muere si no hay Netflix).
*   **Caso B:** Impacto Crítico (Invasión) x Probabilidad Alta (Puerta abierta) = **Riesgo Crítico**.
*   **Caso C:** Impacto Medio x Probabilidad Muy Baja = **Riesgo Bajo**.

Los novatos intentan arreglarlo todo y se agotan. Los profesionales miden el riesgo y atacan lo crítico.

---

## 5.1 Amenaza vs. Vulnerabilidad vs. Riesgo

La gente usa estas palabras como sinónimos. En CyberSentinel, no. Son piezas distintas de una ecuación.

| Concepto | Definición | Analogía del Clima |
| :--- | :--- | :--- |
| **Amenaza** | Algo malo que *podría* pasar. | "Viene una tormenta." |
| **Vulnerabilidad** | Una debilidad en tu defensa. | "Tengo una gotera en el techo." |
| **Riesgo** | La probabilidad de pérdida debido a la amenaza explotando la vulnerabilidad. | "Se me va a inundar la sala (y arruinar la alfombra)." |

> **💡 Fórmula Maestra:**
> Sin Amenaza, la vulnerabilidad es irrelevante.
> Sin Vulnerabilidad, la amenaza es inofensiva.
> **Riesgo = Amenaza + Vulnerabilidad**

---

## 5.2 Midiendo el Riesgo: La Matriz de Calor

¿Cómo comparas una "Inyección SQL" con un "Phishing"? Usamos una **Matriz de Riesgo**.

1.  Asigna un valor del 1 al 5 al **IMPACTO** (¿Qué tanto duele?).
2.  Asigna un valor del 1 al 5 a la **PROBABILIDAD** (¿Qué tan fácil es?).
3.  Multiplica.

| Probabilidad \ Impacto | 1 (Insignificante) | 2 (Menor) | 3 (Moderado) | 4 (Mayor) | 5 (Catastrófico) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **5 (Muy Probable)** | Medio (5) | Alto (10) | Extremo (15) | Extremo (20) | **Extremo (25)** |
| **4 (Probable)** | Bajo (4) | Medio (8) | Alto (12) | Extremo (16) | Extremo (20) |
| **3 (Posible)** | Bajo (3) | Medio (6) | Alto (9) | Alto (12) | Extremo (15) |
| **2 (Improbable)** | Bajo (2) | Bajo (4) | Medio (6) | Medio (8) | Alto (10) |
| **1 (Raro)** | Bajo (1) | Bajo (2) | Bajo (3) | Bajo (4) | Medio (5) |

### Caso Práctico: MediTech (Del Lab 04)
*   **Amenaza A (Bluetooth sin cifrar):**
    *   *Impacto:* 5 (Datos médicos expuestos = Multas masivas).
    *   *Probabilidad:* 3 (Requiere atacante cerca).
    *   **Riesgo:** 15 (Extremo). -> **¡PRIORIDAD 1!**
*   **Amenaza B (Servidor se cae por tráfico):**
    *   *Impacto:* 2 (Molestia temporal).
    *   *Probabilidad:* 2 (Tienen buenos servidores).
    *   **Riesgo:** 4 (Bajo). -> **Se puede posponer.**

---

## 5.3 DREAD: Un Método para Desempatar

Cuando tienes dos riesgos "Extremos", ¿cuál va primero? Microsoft creó **DREAD** para afinar la puntería.

*   **D**amage (Daño): ¿Qué tan malo es el ataque?
*   **R**eproducibility (Reproducibilidad): ¿Es fácil de repetir o funciona una de mil veces?
*   **E**xploitability (Explotabilidad): ¿Se requiere un genio o un script kiddie?
*   **A**ffected Users (Usuarios Afectados): ¿Afecta a uno o a todos?
*   **D**iscoverability (Descubribilidad): ¿Es fácil encontrar la vulnerabilidad?

**Puntaje DREAD = (D + R + E + A + D) / 5**

---

## 5.4 Las 4 Estrategias de Tratamiento

Una vez calculado el riesgo, tienes 4 opciones (Las 4 T's):

1.  **Tratar (Mitigar):** Poner controles (ej. Parchear, Firewall). *Lo más común.*
2.  **Transferir:** Pasar el riesgo a otro (ej. Comprar un seguro, contratar un proveedor externo).
3.  **Tolerar (Aceptar):** El costo de arreglarlo es mayor que el costo del incidente. (ej. "Si se rompe el mouse, compramos otro").
4.  **Terminar (Evitar):** Dejar de hacer la actividad riesgosa. (ej. "Apagamos el servidor FTP viejo").

<div class="quiz-block" data-quiz-id="tratamiento-riesgo">
  <p><strong>Quiz Rápido:</strong> Tu empresa decide contratar un seguro de ciberseguridad para cubrir posibles multas por robo de datos. ¿Qué estrategia es?</p>
  <div class="quiz-options">
    <button class="quiz-option" data-option-id="a">Tratar</button>
    <button class="quiz-option" data-option-id="b" data-correct="true">Transferir</button>
    <button class="quiz-option" data-option-id="c">Terminar</button>
  </div>
  <div class="quiz-feedback"></div>
</div>

---

## 📊 CyberSentinel Tracker – Evaluación de Riesgos

### Autoevaluación de Dominio
Califica tu confianza del **1 al 5**.

<div class="tracker-container" data-chapter-id="05" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Fórmula:</strong> Entiendo intuitivamente que Riesgo = Impacto x Probabilidad.</td>
        <td>
          <span class="tracker-option" data-row="formula" data-val="1">1</span>
          <span class="tracker-option" data-row="formula" data-val="2">2</span>
          <span class="tracker-option" data-row="formula" data-val="3">3</span>
          <span class="tracker-option" data-row="formula" data-val="4">4</span>
          <span class="tracker-option" data-row="formula" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Distinción:</strong> Puedo explicar la diferencia entre Amenaza y Riesgo a un niño de 5 años.</td>
        <td>
          <span class="tracker-option" data-row="distincion" data-val="1">1</span>
          <span class="tracker-option" data-row="distincion" data-val="2">2</span>
          <span class="tracker-option" data-row="distincion" data-val="3">3</span>
          <span class="tracker-option" data-row="distincion" data-val="4">4</span>
          <span class="tracker-option" data-row="distincion" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Matriz:</strong> Puedo usar una matriz de calor para priorizar una lista de bugs.</td>
        <td>
          <span class="tracker-option" data-row="matriz" data-val="1">1</span>
          <span class="tracker-option" data-row="matriz" data-val="2">2</span>
          <span class="tracker-option" data-row="matriz" data-val="3">3</span>
          <span class="tracker-option" data-row="matriz" data-val="4">4</span>
          <span class="tracker-option" data-row="matriz" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Estrategia:</strong> Sé cuándo es mejor 'Transferir' un riesgo que 'Tratarlo'.</td>
        <td>
          <span class="tracker-option" data-row="estrategia" data-val="1">1</span>
          <span class="tracker-option" data-row="estrategia" data-val="2">2</span>
          <span class="tracker-option" data-row="estrategia" data-val="3">3</span>
          <span class="tracker-option" data-row="estrategia" data-val="4">4</span>
          <span class="tracker-option" data-row="estrategia" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>DREAD:</strong> Conozco los 5 factores de este modelo de puntuación.</td>
        <td>
          <span class="tracker-option" data-row="dread" data-val="1">1</span>
          <span class="tracker-option" data-row="dread" data-val="2">2</span>
          <span class="tracker-option" data-row="dread" data-val="3">3</span>
          <span class="tracker-option" data-row="dread" data-val="4">4</span>
          <span class="tracker-option" data-row="dread" data-val="5">5</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 10</span>
  </div>
  
  <div class="tracker-feedback">
    Selecciona tu nivel de confianza para ver tu diagnóstico.
  </div>
</div>

---

{{INSERTAR_LABORATORIO:lab_05}}

> **Próxima Estación:** [Capítulo 06: El Proyecto Final de Modelado](../capitulo_06_proyecto_modelado/README.md) - Integraremos todo (STRIDE + Riesgo) en un caso complejo de arquitectura segura.
