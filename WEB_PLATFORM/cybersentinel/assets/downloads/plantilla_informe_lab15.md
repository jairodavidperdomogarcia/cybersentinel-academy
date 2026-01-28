# Informe de Laboratorio 15: SOAR y Orquestación de Respuesta

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre]
**Fecha:** [Fecha]
**Entorno:** [Ruta del proyecto SOAR / máquina de laboratorio]

---

## 1. Playbooks Ejecutados

Indica qué playbooks ejecutaste con `soar_engine.py`.

| Escenario / Playbook                | Comando ejecutado                         | Resultado general |
| :---------------------------------- | :---------------------------------------- | :---------------- |
| Defensa perimetral                  | [Ej: `python soar_engine.py ports`]       | [ ]               |
| Phishing                            | [Ej: `python soar_engine.py phishing`]    | [ ]               |
| Incidente de ransomware             | [Ej: `python soar_engine.py ransomware`]  | [ ]               |
| Otro (si aplica)                    | [ ]                                       | [ ]               |

---

## 2. Conectores y Scripts Reutilizados

Describe qué conectores y scripts de otros capítulos se usaron durante el laboratorio (por ejemplo scripts del Cap 14).

- Conectores utilizados (firewall, email_gateway, threat_intel, cap14, etc.):  
  > [Lista y breve explicación]

- Scripts externos reutilizados (Cap 14 u otros):  
  > [Lista y breve explicación]

---

## 3. Resultados y Métricas Clave

Para al menos un escenario (recomendado: ransomware):

- Tiempo aproximado desde la alerta hasta la contención simulada: [ ]  
- Acciones ejecutadas automáticamente: [Lista de acciones]  
- Pasos que todavía requieren intervención humana: [Descripción]

Si el sistema generó un código de validación (por ejemplo `SOAR-XXXX`), regístralo aquí:

- Código de validación obtenido: [ ]

---

## 4. Evaluación de Madurez SOAR

Responde brevemente:

1. ¿Qué parte del flujo sigues considerando demasiado peligrosa para automatizar al 100%?  
   > [Tu respuesta]

2. ¿Qué mejora harías a uno de los playbooks para reducir falsos positivos o acciones innecesarias?  
   > [Tu respuesta]

3. ¿Qué beneficios reales ves en un SOAR bien implementado para un SOC saturado de alertas?  
   > [Tu respuesta]

---

## 5. Reflexión Personal

Después de conectar scripts, conectores y playbooks, ¿cómo entiendes ahora la relación entre "automatización" y "orquestación"?  
> [Tu reflexión en 3–5 líneas]

