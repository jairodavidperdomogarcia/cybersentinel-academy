# Informe del Laboratorio 03: Intro Práctica a ML (Detección de Anomalías)

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre o Alias]
**Fecha:** [Fecha de realización]
**Laboratorio:** 03 - Machine Learning para Detección de Anomalías en Logs

---

## 1. Configuración del Experimento
*Instrucción: Documenta los parámetros utilizados en tu script de Jupyter Notebook.*

*   **Algoritmo Usado:** K-Means
*   **Número de Clusters (K):** [Ej: 2]
*   **Librerías Importadas:** [Ej: pandas, scikit-learn, matplotlib]
*   **Features (Columnas) Seleccionadas para el Modelo:**
    *   [Ej: intentos_login_fallidos]
    *   [Ej: bytes_transferidos]

## 2. Resultados de Detección
*Instrucción: Registra los resultados obtenidos tras entrenar el modelo y comparar con la etiqueta real (es_ataque).*

| Métrica | Cantidad | Significado en este contexto |
| :--- | :--- | :--- |
| **Verdaderos Positivos (VP)** | [Cant.] | Ataques reales detectados correctamente como anomalías. |
| **Verdaderos Negativos (VN)** | [Cant.] | Tráfico normal identificado correctamente como normal. |
| **Falsos Positivos (FP)** | [Cant.] | Tráfico normal marcado incorrectamente como ataque (Alerta falsa). |
| **Falsos Negativos (FN)** | [Cant.] | Ataques reales que el modelo ignoró (Peligro silencioso). |

## 3. Análisis del Dilema (Critical Thinking)
*Instrucción: Reflexiona sobre las métricas anteriores (Sección 3.3 del Manual).*

1.  **¿Qué te preocupa más en este escenario: los Falsos Positivos o los Falsos Negativos? ¿Por qué?**
    *   *[Tu respuesta aquí. Ej: Me preocupan más los FN porque dejan entrar al atacante sin que nadie se entere...]*

2.  **Si aumentas la sensibilidad del modelo (bajas el umbral), ¿qué métrica tiende a subir?**
    *   *[Tu respuesta aquí]*

## 4. Bitácora de Experimentos (Opcional)
*Instrucción: Si probaste cambiar K=3 o usar otras columnas, anota qué pasó.*

*   **Experimento:** [Ej: Cambié K a 3]
*   **Observación:** [Ej: El modelo separó los ataques masivos de los ataques lentos, pero confundió tráfico normal con ataques lentos.]

---
**Conclusión General:**
*[Escribe brevemente tu opinión sobre el uso de ML en seguridad: ¿Es mágico o requiere supervisión humana?]*
