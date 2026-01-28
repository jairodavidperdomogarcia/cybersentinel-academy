# Informe de Laboratorio 07: Diseño de Arquitectura Segura (MediTech)

**Cadete:** [Tu Nombre]  
**Fecha:** [Fecha de hoy]  
**Misión:** Diseñar la arquitectura Zero Trust para "MediTech SecurePump Gen2"

---

## 1. Análisis de la Arquitectura Fallida (Forense)

*¿Por qué falló la seguridad en el incidente del Capítulo 00?*

| Fallo Identificado | Consecuencia en el Ataque |
| :--- | :--- |
| [Ej: Falta de autenticación en comandos] | [Ej: Cualquiera pudo enviar orden de dosis letal] |
| [ ... ] | [ ... ] |

---

## 2. Diseño Zero Trust (Diagrama y Flujo)

*Describe cómo fluyen los datos y dónde están los límites de confianza en tu nuevo diseño.*

**Componentes:**
1.  **Bomba IoT:** [Ej: No confía en nadie, solo obedece comandos firmados]
2.  **Gateway:** [ ... ]
3.  **Servidor Nube:** [ ... ]
4.  **App Médico:** [ ... ]

**Diagrama (Opcional - Pega aquí tu imagen o enlace a Mermaid):**
> (Espacio para diagrama)

---

## 3. Especificaciones Técnicas

*Define los controles exactos para cada componente.*

| Componente | Autenticación (AuthN) | Autorización (AuthZ) | Cifrado / Integridad |
| :--- | :--- | :--- | :--- |
| **Bomba IoT (Gen2)** | [Ej: Certificados mTLS] | [Ej: Solo comandos firmados por Root CA] | [Ej: Firmware cifrado AES-256] |
| **Gateway Hospital** | [ ... ] | [ ... ] | [ ... ] |
| **Servidor Nube** | [ ... ] | [ ... ] | [ ... ] |
| **App Médico** | [ ... ] | [ ... ] | [ ... ] |

---

## 4. Justificación Ejecutiva (ROI)

*Vende tu diseño a la Junta Directiva.*

**Control Propuesto:** [Ej: Implementación de mTLS en todas las bombas]
*   **Amenaza Mitigada (STRIDE):** [Ej: Spoofing y Tampering]
*   **Justificación de Inversión:** [Ej: El costo de chips criptográficos ($2/unidad) es ínfimo comparado con el costo de retirar productos del mercado ($50M+)]

---

> **Reflexión Final:**
> ¿Cómo cambia tu mentalidad de diseño saber que un fallo de seguridad puede costar vidas humanas en lugar de solo dinero?
> [Tu respuesta aquí]
