# Informe de Laboratorio 08: IDS/Snort – El Francotirador de Paquetes

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre]
**Fecha:** [Fecha]
**Entorno:** [Máquina / Red de prueba]

---

## 1. Regla Final de Snort

Regla implementada:

> [Escribe aquí tu regla completa, por ejemplo:  
> `alert tcp !10.0.0.5 any -> 192.168.1.50 22 (msg:"Posible Fuerza Bruta SSH"; sid:1000001;)`]

**Explicación de la regla:**

- Origen (IP/puerto): [ ]
- Destino (IP/puerto): [ ]
- Mensaje (`msg`): [ ]
- SID: [ ]
- Otros parámetros (`content`, `flags`, etc.): [ ]

---

## 2. Resultados de la Validación (`validator_ids.sh`)

Comando ejecutado:

```bash
./validator_ids.sh local.rules
```

Resumen de salida:

- Errores detectados: [ ]
- Advertencias de malas prácticas: [ ]
- Recomendaciones del Entrenador Crítico: [ ]

---

## 3. Evaluación de Falsos Positivos y Falsos Negativos

- ¿En qué casos tu regla podría generar falsos positivos?  
  [Tu análisis aquí]

- ¿En qué casos podría dejar pasar ataques reales (falsos negativos)?  
  [Tu análisis aquí]

- ¿Qué mejorarías en una versión 2.0 de la regla (thresholds, flow, etc.)?  
  [Tus ideas aquí]

---

## 4. Reflexión Personal

¿Qué aprendiste sobre el equilibrio entre sensibilidad del IDS y ruido operativo?  
> [Tu reflexión en 3–5 líneas]
