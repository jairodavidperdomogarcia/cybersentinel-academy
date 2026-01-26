# 🧠 Laboratorio 10: El Psicólogo de la Red (Detección de Anomalías con ML)

> **Misión:** Construir un detector de anomalías basado en Isolation Forest para identificar la exfiltración silenciosa del caso TJX.
> **Herramientas:** Python, Pandas, Scikit-learn.
> **Tiempo estimado:** 60-90 minutos.

---

## 1. Escenario Táctico: El Robo Silencioso

Estás investigando el incidente TJX. Los registros muestran que un servidor SQL (`192.168.10.100`) empezó a comportarse de forma "extraña" a las 2:00 AM.
Sin embargo, no disparó ninguna alerta del IDS porque el tráfico parecía HTTP legítimo y no usó exploits conocidos.

Tu jefe te pregunta: **"¿Cómo podríamos haber detectado esto automáticamente?"**

Tu respuesta: **"Analizando el comportamiento, no las firmas."**

---

## 2. Preparación del Entorno

Este laboratorio requiere Python 3 y algunas librerías de ciencia de datos.

### Instalación de dependencias
Abre tu terminal (o Jupyter Notebook) e instala:

```bash
pip install pandas numpy scikit-learn matplotlib
```

---

## 3. Fase A: Generación de Datos (Simulación)

Primero, necesitamos datos. Crearemos dos scripts para simular la realidad:
1.  **Tráfico Normal:** 30 días de operación aburrida.
2.  **Tráfico de Ataque:** 4 horas de exfiltración lenta.

Crea el archivo `generate_normal_traffic.py`:

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Simular 30 días de tráfico normal
np.random.seed(42)
dates = pd.date_range(start='2024-01-01', end='2024-01-30', freq='H')

data = []
for date in dates:
    is_work_hour = 9 <= date.hour <= 18
    base_connections = np.random.randint(1, 5)
    base_volume = np.random.randint(10, 100)  # MB

    if is_work_hour:
        connections = base_connections * 3
        volume = base_volume * 2
    else:
        connections = base_connections
        volume = base_volume

    data.append({
        'timestamp': date,
        'connections': connections,
        'unique_destinations': 1,
        'total_volume_mb': volume,
        'is_work_hour': int(is_work_hour),
        'label': 'normal'
    })

df_normal = pd.DataFrame(data)
df_normal.to_csv('trafico_normal.csv', index=False)
print(f"[+] Generados {len(df_normal)} registros de tráfico NORMAL")
```

Ejecútalo: `python generate_normal_traffic.py`

Ahora crea `generate_attack_traffic.py` (ver código en Capítulo 10 o repositorio) para inyectar la anomalía TJX.

---

## 4. Fase B: El Cerebro (Anomaly Detector)

Implementaremos el algoritmo **Isolation Forest**. Este modelo es genial para seguridad porque no necesita saber "qué es un ataque", solo necesita saber "qué es raro".

Crea `anomaly_detector.py`:

```python
import pandas as pd
from sklearn.ensemble import IsolationForest

class CyberSentinelAnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.01, random_state=42)
        self.features = ['connections', 'unique_destinations', 'total_volume_mb']

    def train(self, normal_data_path):
        print("[+] Entrenando cerebro con tráfico normal...")
        df = pd.read_csv(normal_data_path)
        self.model.fit(df[self.features])

    def detect(self, traffic_data_path):
        print("[+] Buscando amenazas invisibles...")
        df = pd.read_csv(traffic_data_path)
        df['anomaly_score'] = self.model.decision_function(df[self.features])
        df['is_anomaly'] = self.model.predict(df[self.features]) == -1
        return df

if __name__ == "__main__":
    detector = CyberSentinelAnomalyDetector()
    detector.train('trafico_normal.csv')
    # Asumimos que generaste trafico_completo.csv en el paso anterior
    results = detector.detect('trafico_completo.csv')
    
    anomalies = results[results['is_anomaly'] == True]
    print(f"\n🚨 ALERTA: Se detectaron {len(anomalies)} eventos anómalos.")
    print(anomalies[['timestamp', 'connections', 'total_volume_mb']].head())
```

---

## 5. Fase C: Análisis de Resultados

Ejecuta tu detector.
¿Detectó las 4 horas del ataque TJX?
¿Hubo falsos positivos (alarmas en días normales)?

> **Reflexión:** Observa cómo el modelo marcó el ataque basándose en que el volumen era alto *para esa hora* (2 AM), aunque quizás ese volumen sea normal a las 2 PM. ¡Esa es la inteligencia del contexto!

---

## 📝 Entregable

Genera un informe (`informe_lab10.md`) con:
1.  **Código:** Tus scripts de Python.
2.  **Resultados:** Captura de pantalla de la salida del detector mostrando las alertas.
3.  **Análisis:**
    *   ¿Cuál fue la tasa de detección? (Detection Rate).
    *   ¿Hubo falsos positivos? ¿Por qué crees que ocurrieron?

---

## 📊 Autoevaluación

<div class="tracker-container" data-chapter-id="10" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Concepto ML:</strong> Entiendo la diferencia entre detección por firmas (reglas) y anomalías (comportamiento).</td>
        <td>
          <span class="tracker-option" data-row="ml_concept" data-val="1">1</span>
          <span class="tracker-option" data-row="ml_concept" data-val="2">2</span>
          <span class="tracker-option" data-row="ml_concept" data-val="3">3</span>
          <span class="tracker-option" data-row="ml_concept" data-val="4">4</span>
          <span class="tracker-option" data-row="ml_concept" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Ingeniería de Datos:</strong> Sé generar datasets sintéticos que simulan tráfico normal vs ataque.</td>
        <td>
          <span class="tracker-option" data-row="data_eng" data-val="1">1</span>
          <span class="tracker-option" data-row="data_eng" data-val="2">2</span>
          <span class="tracker-option" data-row="data_eng" data-val="3">3</span>
          <span class="tracker-option" data-row="data_eng" data-val="4">4</span>
          <span class="tracker-option" data-row="data_eng" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Implementación:</strong> Puedo usar Scikit-learn (IsolationForest) para entrenar y predecir.</td>
        <td>
          <span class="tracker-option" data-row="sklearn_impl" data-val="1">1</span>
          <span class="tracker-option" data-row="sklearn_impl" data-val="2">2</span>
          <span class="tracker-option" data-row="sklearn_impl" data-val="3">3</span>
          <span class="tracker-option" data-row="sklearn_impl" data-val="4">4</span>
          <span class="tracker-option" data-row="sklearn_impl" data-val="5">5</span>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 10</span>
  </div>
</div>