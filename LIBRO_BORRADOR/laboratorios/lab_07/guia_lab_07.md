# LABORATORIO 07: DISEÑANDO LA ARQUITECTURA DE MEDITECH 2.0

## 🎯 Objetivo de la Misión

Transformar los conceptos teóricos del Capítulo 7 en un diseño arquitectural real.
Aplicarás defensa en profundidad, Zero Trust y segmentación al caso crítico de
MediTech tras el incidente de la bomba de insulina.

* ⏱️ Tiempo Estimado: 90-120 minutos.
* 📝 Entregable: Diagrama de arquitectura + Documento de especificación técnica.
* 🛠️ Herramientas: draw.io, diagrams.net, o papel y lápiz.
* ⚠️ Prerrequisito: Haber leído el Capítulo 07 y recordar el incidente de MediTech del Capítulo 00.

---

## 📖 Contexto: La noche que cambió todo

Fecha: 12 de noviembre, 03:45 AM.  
Hospital Santa María, Unidad de Cuidados Intensivos.

El monitor de la bomba de insulina muestra:

DOSIS: 50 U/h (10 veces la prescripción).

El paciente entra en hipoglucemia severa. El médico no programó ese cambio.

La investigación reveló:

- Dispositivo médico IoT conectado a WiFi hospitalario abierto.
- Comunicaciones sin cifrado entre bomba y servidor central.
- Servidor central accesible desde internet sin autenticación fuerte.
- Sin segmentación entre red médica y red administrativa.

Resultado: un atacante remoto pudo modificar dosis de pacientes.

---

## 🏥 Tu misión: Arquitecto de seguridad médica

El CISO de MediTech te contrata:

debes rediseñar la arquitectura completa para que lo que pasó en Santa María sea
imposible en el futuro. Cada control debe tener una justificación clara frente
a una amenaza específica.

---

## 📋 Parte A: Análisis de la arquitectura fallida (20 minutos)

1. Reconstruye la arquitectura vulnerable:

Basándote en la investigación, dibuja un DFD simple que muestre:

Componentes críticos:

- Bomba de insulina IoT (dispositivo del paciente).
- Gateway hospitalario (recibe datos de múltiples dispositivos).
- Servidor central MediTech (nube, procesa datos).
- Aplicación del médico (móvil o desktop).
- Base de datos de pacientes.

Conexiones problemáticas:

- Bomba → Gateway: WiFi abierto, sin cifrado.
- Gateway → Servidor: API sin autenticación fuerte.
- Servidor → BD: credenciales en texto plano.
- App → Servidor: tokens JWT sin expiración corta.

2. Identifica las cinco fallas arquitecturales principales:

Para cada capa de defensa en profundidad, anota qué faltaba y la consecuencia.

Ejemplo de guía:

- Perímetro: sin WAF, sin rate limiting → ataques directos al servidor.
- Red: sin segmentación médico/administrativo → movimiento lateral total.
- Endpoint: sin EDR ni hardening en servidores → dispositivos fácilmente comprometibles.
- Aplicación: sin validación de dosis peligrosas → dosis letales procesadas.
- Datos: sin cifrado en tránsito → interceptación de comunicaciones.

Anota tus respuestas en formato lista en la sección de informe correspondiente.

---

## 🛡️ Parte B: Diseño de nueva arquitectura Zero Trust (45 minutos)

3. Diseña la arquitectura MediTech 2.0:

Usa draw.io o diagrams.net para crear un diagrama que incluya:

Requisitos mínimos:

- Límites de confianza claros (líneas rojas punteadas).
- Cinco capas de defensa en profundidad etiquetadas.
- Flujo de datos numerado (1, 2, 3...).
- Componentes críticos con iconos diferenciados.

Componentes obligatorios:

Zona paciente (confianza mínima):

- Dispositivo médico IoT (bomba de insulina).
  - Certificado hardware X.509.
  - Comunicación solo hacia gateway autorizado.

Zona hospital (confianza media):

- Gateway médico on-premise.
  - Firewall de aplicación específica.
  - Validación de certificados de dispositivo.
  - Cifrado TLS 1.3 en tráfico saliente.

Zona nube (confianza alta):

- API Gateway MediTech.
  - Rate limiting por hospital.
  - Autenticación JWT + MFA para médicos.
  - Validación de esquema de dosis (0-10 U/h).

- Servidores de procesamiento.
  - EDR activo.
  - Segmentación de microservicios.
  - Logging centralizado.

- Base de datos.
  - Cifrado AES-256 en reposo.
  - Control de acceso basado en atributos (ABAC).

4. Especifica controles por capa:

Copia y completa una tabla como esta en tu informe:

| Capa      | Control específico | Configuración                             | Justificación (¿qué amenaza mitiga?)      |
|----------|--------------------|-------------------------------------------|-------------------------------------------|
| Perímetro| WAF Cloudflare     | Regla: bloquear `SET_PARAM` con dosis >10 | Mitiga: modificación remota de dosis      |
| Red      | Segmentación VLAN  | VLAN 100: dispositivos, 200: gateway     | Mitiga: movimiento lateral                |
| Endpoint | EDR en gateway     | Alertar si se conecta dispositivo desconocido | Mitiga: dispositivos rogue            |
| Aplicación| Validación dosis  | if dose > 10: reject(); if change >50%: alert() | Mitiga: dosis peligrosas             |
| Datos    | Cifrado doble      | TLS 1.3 + cifrado en aplicación          | Mitiga: interceptación de datos sensibles |

---

## 🔐 Parte C: Especificación técnica detallada (25 minutos)

5. Configuración del API Gateway (pseudocódigo YAML):

```yaml
api_gateway:
  name: "meditech-medical-api"

  authentication:
    required: true
    methods:
      - type: "JWT"
        issuer: "auth.meditech.com"
        audience: "medical-api"
        require_mfa: true
      - type: "Client-Certificate"
        required_for: ["/api/device/command"]

  rate_limiting:
    hospital_tier:
      basic: 1000 req/hour
      premium: 10000 req/hour
    emergency_bypass: true

  validation:
    endpoints:
      - path: "/api/device/set_dose"
        validation:
          schema: "dose_schema.json"
          rules:
            - "dose <= 10"
            - "rate_of_change <= 50%"
            - "doctor_id must have endocrinology privilege"

  logging:
    sensitive_data_masking: true
    fields_to_mask: ["patient_id", "medical_record_number", "ssn"]
    alert_on: ["dose > 10", "unrecognized_device", "geo_anomaly"]
```

Adapta este ejemplo en tu informe, explicando por qué cada campo existe.

6. Reglas de firewall entre segmentos:

Escribe al menos cinco reglas críticas y documenta su intención.

Ejemplo:

```bash
# Dispositivos IoT solo pueden hablar con el gateway en puerto seguro
iptables -A FORWARD -s 10.100.1.0/24 -d 10.100.2.100 -p tcp --dport 8883 -j ACCEPT
iptables -A FORWARD -s 10.100.1.0/24 -j DROP
```

Define reglas adicionales para:

- Gateway → API Gateway solo en puertos específicos.
- API Gateway → base de datos con usuario de solo lectura.
- Tráfico administrativo solo a través de VPN.
- Regla de emergencia documentada (bypass en código azul, con riesgo explicado).

---

## 💼 Parte D: Justificación ejecutiva (20 minutos)

7. Crea un one-pager para el CISO:

En máximo una página, responde:

- Qué controles clave propones.
- Qué amenazas concretas mitigará cada uno.
- Qué coste tendría no implementarlos (impacto en pacientes, reputación, regulador).

---

## 📝 Entregable: Informe de Arquitectura MediTech

Para documentar tu trabajo, utiliza la plantilla de informe:

- [plantilla_informe_lab07.md](../../WEB_PLATFORM/assets/downloads/plantilla_informe_lab07.md)

Estructura mínima recomendada:

1. Análisis de la arquitectura fallida.
2. Diseño Zero Trust (diagrama y descripción).
3. Especificaciones técnicas (tablas y pseudocódigo).
4. Justificación de ROI y amenazas mitigadas.

---

## 🔗 Conexión con capítulos anteriores y futuros

Usa tu informe del Capítulo 6 (AutoManufact) como referencia:

- ¿Cómo aplicarías una segmentación OT/IT similar en MediTech 2.0?
- ¿Qué amenazas de STRIDE se mitigan con cada capa de tu diseño?

Preparación para el Capítulo 8 (IDS/IPS):

- En tu arquitectura, decide dónde colocarías sensores IDS.
- Anota qué comportamientos deberías monitorear (ejemplo: cambios de dosis fuera de rango, conexiones desde redes no médicas).

---

## 🎯 Reflexión final

Responde brevemente en tu informe:

- ¿Cuál fue la decisión arquitectural más difícil y por qué?
- ¿Qué control crees que tendría mayor ROI en términos de seguridad?
- ¿Cómo le explicarías esta arquitectura a un médico no técnico?

---

## 🏆 Cierre de misión

Cuando completes este laboratorio:

- Guarda tus diagramas y documento en tu portafolio CyberSentinel.
- Este tipo de entregable es el que puedes mostrar en entrevistas para roles de
  Security Architect o Cloud Security Engineer.

Próximo paso:

una vez que domines este proceso manual, estarás listo para usar la herramienta
`architecture_designer.py`, que automatiza parte del mapeo entre amenazas y
controles arquitecturales que has practicado aquí.

En IoT médico, “un firewall” no basta: necesitas autenticación mutua, validación
de integridad y una arquitectura que asuma que el ataque puede venir desde dentro
del hospital.
