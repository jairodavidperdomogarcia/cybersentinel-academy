# Informe de Laboratorio 09: Hardening de Sistemas

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre]
**Fecha:** [Fecha]
**Sistema Objetivo:** [Ej: Linux Server / Windows Workstation]

---

## 1. Auditoría Inicial (Discovery)

Documenta lo que encontraste antes de aplicar hardening.

### Puertos y Servicios Innecesarios
*(Salida de `sudo ss -tulpn` o similar)*
```text
[Pegar salida relevante aquí]
```
> **Análisis:** [Ej: Se detectó servicio Telnet (23) activo y puerto 8080 sin uso claro]

### Usuarios y Permisos
*(Salida de `cat /etc/passwd` o revisión de usuarios)*
> **Hallazgo:** [Ej: Usuario 'guest' habilitado, o usuarios de servicio con shell /bin/bash]

### Archivos Críticos Expuestos
*(Salida de búsqueda de permisos 777)*
> **Hallazgo:** [Ej: /var/www/html/config.php tiene permisos de escritura mundial]

---

## 2. Acciones de Hardening

Enumera las acciones concretas que realizaste para asegurar el sistema.

| Categoría | Acción Realizada | Justificación |
| :--- | :--- | :--- |
| **Servicios** | [Ej: `systemctl stop telnet`] | [Ej: Protocolo inseguro, texto plano] |
| **Usuarios** | [Ej: Bloqueo de cuenta 'guest'] | [Ej: Reducción de superficie de ataque] |
| **Red** | [Ej: Regla de Firewall para bloquear puerto 8080] | [Ej: Servicio no autorizado] |
| **Sistema** | [Ej: Configurar actualizaciones automáticas] | [Ej: Parcheo continuo] |

---

## 3. Verificación Final

Muestra la evidencia de que el sistema ahora es seguro.

*(Nueva salida de `sudo ss -tulpn` mostrando puertos cerrados)*
```text
[Pegar salida aquí]
```

---

## 4. Reflexión

¿Qué impacto habría tenido un ataque tipo WannaCry en este sistema antes y después del hardening?
> [Tu respuesta aquí]
