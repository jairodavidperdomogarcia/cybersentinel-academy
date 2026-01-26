# LABORATORIO 03: INTRODUCCIÓN PRÁCTICA A MACHINE LEARNING PARA DETECCIÓN DE ANOMALÍAS

## 🎯 Objetivo
Pasar de la teoría del Capítulo 03 a la práctica usando un ejemplo mínimo de **detección de anomalías con Machine Learning** sobre un conjunto de logs simulado.

Al final de este laboratorio serás capaz de:
- Cargar datos de logs en un entorno de análisis (Jupyter Notebook).
- Aplicar un algoritmo sencillo de agrupamiento (**K-Means**) para separar tráfico "normal" de tráfico "anómalo".
- Relacionar los resultados con el dilema **Falso Positivo vs Falso Negativo** visto en el capítulo.

---

## 🧱 Escenario: El SOC de TechSafelock quiere probar ML

Continuamos en **TechSafelock**. Después de tus investigaciones en el Laboratorio 02, el equipo de Ingeniería te ha preparado un pequeño dataset de ejemplo con eventos de red simulados.

Tu misión es:
1. Cargar los datos.
2. Entrenar un modelo muy simple de clustering.
3. Ver qué tan bien separa actividad normal de actividad sospechosa.
4. Discutir los **riesgos de confiar ciegamente** en un modelo.

> No vas a construir un sistema de producción, sino un **prototipo educativo** que conecta directamente con el vocabulario de IA/ML del capítulo.

---

## Parte A: Preparando el Entorno de Trabajo (15 minutos)

### A.1 Activar entorno Python en Kali

En tu Kali o máquina Linux de laboratorio:

```bash
mkdir -p ~/labs_ml/lab03_intro_ml
cd ~/labs_ml/lab03_intro_ml
python3 -m venv venv
source venv/bin/activate
```

Instala las librerías necesarias:

```bash
pip install jupyter pandas scikit-learn
```

### A.2 Lanzar Jupyter Notebook

Desde el mismo directorio:

```bash
jupyter notebook
```

Se abrirá el navegador. Crea un nuevo notebook llamado:  
`lab03_intro_ml_detec_anomalias.ipynb`

---

## Parte B: Construyendo un Mini-Dataset de Logs (20 minutos)

En la **Celda 1** de tu notebook, pega y ejecuta:

```python
import pandas as pd

data = {
    "ip": [
        "192.168.1.10", "192.168.1.11", "192.168.1.12", "192.168.1.13",
        "45.33.22.11", "45.33.22.11", "10.0.0.5", "10.0.0.5",
        "192.168.1.15", "192.168.1.16"
    ],
    "hora": [9, 10, 11, 12, 3, 3, 2, 2, 14, 15],
    "intentos_login_fallidos": [0, 1, 0, 2, 10, 12, 8, 9, 0, 1],
    "bytes_transferidos": [200, 350, 180, 220, 5000, 5200, 4500, 4700, 300, 260],
    "es_ataque": [0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
}

df = pd.DataFrame(data)
df
```

Observa:
- IPs internas (`192.168.x.x`) con actividad normal.
- IPs externas con muchos intentos fallidos y muchos bytes transferidos.
- Una columna `es_ataque` que marca la **verdad de terreno** (ground truth) solo para evaluar al modelo.

> En un entorno real muchas veces **no tienes** la columna `es_ataque`. Aquí la usamos solo para medir el rendimiento del modelo como ejercicio pedagógico.

---

## Parte C: Aplicar K-Means para Detección de Anomalías (25 minutos)

### C.1 Seleccionar Features numéricas

En la **Celda 2**, crea una matriz con las columnas relevantes:

```python
from sklearn.cluster import KMeans

features = df[["intentos_login_fallidos", "bytes_transferidos"]]
features
```

### C.2 Entrenar un modelo de 2 clusters

```python
kmeans = KMeans(n_clusters=2, random_state=42, n_init="auto")
kmeans.fit(features)

df["cluster"] = kmeans.labels_
df
```

Interpreta:
- Un cluster representará "actividad normal".
- El otro cluster representará "actividad rara/anómala".

No sabes de antemano cuál es cuál. Debes interpretarlo comparando con `es_ataque`.

### C.3 Mapear cluster → etiqueta (Normal / Sospechoso)

En la **Celda 3**:

```python
df.groupby("cluster")[["intentos_login_fallidos", "bytes_transferidos"]].mean()
```

Identifica:
- ¿Qué cluster tiene, en promedio, más intentos fallidos y más bytes?
- Decide: `cluster_sospechoso` = cluster con medias más altas.

```python
cluster_sospechoso = df.groupby("cluster")["intentos_login_fallidos"].mean().idxmax()
cluster_sospechoso
```

Añade una columna con la predicción del modelo:

```python
df["pred_ml_es_ataque"] = (df["cluster"] == cluster_sospechoso).astype(int)
df[["ip", "hora", "intentos_login_fallidos", "bytes_transferidos", "es_ataque", "pred_ml_es_ataque"]]
```

---

## Parte D: Midiendo Falsos Positivos y Falsos Negativos (25 minutos)

### D.1 Construir una matriz de conteo simple

En la **Celda 4**:

```python
from collections import Counter

pares = list(zip(df["es_ataque"], df["pred_ml_es_ataque"]))
conteo = Counter(pares)
conteo
```

Interpreta el resultado como:
- `(1, 1)`: Verdaderos Positivos (ataque real detectado).
- `(0, 0)`: Verdaderos Negativos (tráfico legítimo ignorado).
- `(0, 1)`: Falsos Positivos (alerta sobre tráfico legítimo).
- `(1, 0)`: Falsos Negativos (ataque real que el modelo no vio).

### D.2 Conectar con el dilema del analista

Responde en tu notebook (texto libre):
- ¿Cuántos **Falsos Positivos** genera tu modelo?
- ¿Cuántos **Falsos Negativos**?
- ¿Cuál te parece más peligroso en este contexto y por qué?

> Relaciona tu respuesta con la sección **3.3 Métricas de Vida o Muerte** del capítulo.

---

## Parte E: Experimentos Guiados (Opcional, 20–30 minutos)

Si tienes tiempo, experimenta:

1. Cambia `n_clusters` a 3 y observa qué sucede con `pred_ml_es_ataque`.
2. Elimina la feature `bytes_transferidos` y entrena solo con `intentos_login_fallidos`.
3. Añade una nueva columna con ruido (por ejemplo, un número aleatorio) y observa si empeora el modelo.

Idea central: **Las features que eliges importan tanto como el algoritmo**.

---

## 📝 ENTREGABLE: INFORME DEL LABORATORIO 03

Puedes copiar y completar esta plantilla en tu cuaderno digital o documento de reporte. Si lo prefieres, también puedes usar la **Plantilla Informe Lab 03** en formato `.md` descargable desde la plataforma, que contiene esta misma estructura lista para editar.

```markdown
# Informe del Laboratorio 03: Intro Práctica a ML

**Cadete:** [Tu Nombre o Alias]  
**Fecha:** [Fecha de realización]  
**Entorno:** [Kali / Otra distro]  

### 1. Configuración del Experimento
- Librerías utilizadas: [Ej: pandas, scikit-learn]  
- Features utilizadas: [Ej: intentos_login_fallidos, bytes_transferidos]  
- Número de clusters (n_clusters): [2 / 3 / otro]  

### 2. Resultados del Modelo
- Verdaderos Positivos (1,1): [cantidad]  
- Verdaderos Negativos (0,0): [cantidad]  
- Falsos Positivos (0,1): [cantidad]  
- Falsos Negativos (1,0): [cantidad]  

### 3. Análisis del Dilema del Analista
- ¿Qué te preocupa más en este modelo: Falsos Positivos o Falsos Negativos?  
- Explica en 3–5 líneas cómo ajustarías el sistema (reglas adicionales, revisión humana, thresholds) para compensar las limitaciones del modelo.  

### 4. Experimentos Adicionales (si aplicaste)
- Cambios que probaste (features, n_clusters, etc.):  
- Efecto observado en los resultados:  

### 5. Conclusión Personal
En 3–4 líneas, describe qué aprendiste sobre:
- La diferencia entre teoría de ML y práctica.  
- Por qué **no basta** con "entrenar un modelo" y confiar ciegamente en él.  
```

---

## ✅ Cierre del Laboratorio

Has:
- Construido un mini-dataset de logs de red.
- Aplicado un modelo simple de Machine Learning (K-Means).
- Medido Falsos Positivos y Falsos Negativos en un contexto de ciberseguridad.

En el próximo capítulo, conectarás estos conceptos con **modelado de amenazas** y flujos de ataque más complejos.

