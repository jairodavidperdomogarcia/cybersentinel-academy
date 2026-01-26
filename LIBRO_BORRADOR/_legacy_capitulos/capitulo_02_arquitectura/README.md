# Capítulo 2: Arquitectura de Defensa en Profundidad

## 🏰 Construyendo Fortalezas Digitales

En el capítulo anterior vimos cómo atacan. Ahora, aprenderemos a defender. La defensa moderna no es un muro; es un laberinto.

### 2.1 El Principio de Defensa en Profundidad
Nunca confíes en una sola capa de seguridad. Si el Firewall falla, el IDS debe detectar. Si el IDS falla, el Endpoint (EDR) debe bloquear.

*   **Capa 1: Perímetro** (Firewalls, WAF).
*   **Capa 2: Red** (Segmentación, VLANs).
*   **Capa 3: Endpoint** (Antivirus, EDR).
*   **Capa 4: Aplicación** (Input Validation, Codificación Segura).
*   **Capa 5: Datos** (Cifrado en reposo y tránsito).

### 2.2 API Gateway: El Portero Moderno
En nuestro caso de estudio de *TechSafelock*, todas las transacciones pasan por un **API Gateway**.
> **Ver Diagrama (proyecto):** `00_Diagramas/02_diagrama_api_gateway_preview.html`

El API Gateway no es solo un enrutador; es un guardia de seguridad que aplica:
1.  **Rate Limiting:** Frena los ataques de fuerza bruta (como vimos en el Lab 02).
2.  **Autenticación Centralizada:** Valida tokens JWT antes de que la petición toque el servidor real.
3.  **Filtrado de IP:** Bloquea orígenes sospechosos.

### 2.3 Zero Trust (Confianza Cero)
El viejo modelo decía: "Confía pero verifica".
El nuevo modelo dice: **"Nunca confíes, verifica siempre".**

En *TechSafelock*, incluso si estás dentro de las oficinas (la red interna), no tienes acceso a los servidores de la base de datos a menos que tu identidad sea verificada explícitamente para esa acción específica.

## Sección 1: Por qué esto importa para tu carrera

- **Demanda del mercado:** crecimiento sostenido en roles de AppSec, Cloud Security y API Security
- **Salarios promedio (referencia):** rangos altos en perfiles de Zero Trust y seguridad de aplicaciones
- **Impacto profesional:** saber diseñar defensas por capas te diferencia frente a perfiles “solo operativos”

## Sección 2: Ejemplos de industria real

- **Banca/Fintech:** WAF + Rate limiting + validación de tokens para reducir fraude y credential stuffing
- **Energéticas:** segmentación y control de acceso para reducir movimiento lateral desde IT hacia OT
- **Gobierno:** Zero Trust para accesos remotos y contratistas con privilegio mínimo

## Sección 3: Habilidades para tu CV/LinkedIn

**Frases exactas (ejemplos):**
- "Diseño de arquitectura de defensa en profundidad para APIs"
- "Implementación de controles Zero Trust (least privilege, verificación explícita)"

**Keywords para ATS (ejemplos):**
- API Gateway, WAF, rate limiting, JWT, OAuth2, Zero Trust, segmentation, IDS/IPS, EDR

**Cómo cuantificar tus logros (plantillas):**
- "Reduje X% los intentos de abuso aplicando rate limiting y políticas de autenticación"
- "Disminuí incidentes de acceso no autorizado de X a Y mediante controles Zero Trust"

## Sección 4: Oportunidades concretas

**Puestos específicos (ejemplos):**
- Application Security Engineer (AppSec)
- API Security Engineer
- Zero Trust / IAM Engineer
- Cloud Security Engineer

**Ejemplos de empresas que suelen publicar vacantes relacionadas:**
- Proveedores cloud y SaaS
- Bancos/fintech y procesadores de pagos
- Consultoras y MSSP

**Cómo preparar la entrevista (guía corta):**
- Explica un flujo de API con controles: WAF → Auth → rate limit → backend
- Lleva un diagrama propio y justifica cada control con una amenaza concreta

## Sección 5: Para emprendedores

- Auditorías de API y hardening de gateways para pymes (entregable en 1–2 semanas)
- Paquetes de “Zero Trust starter” para startups (roles, acceso, segmentación básica)
- Workshops de seguridad para equipos de desarrollo con checklist y ejemplos
