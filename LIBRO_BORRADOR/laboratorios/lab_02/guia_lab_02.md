# LABORATORIO 02: DOMINANDO LA TERMINAL - INVESTIGACIÓN EN UN SERVIDOR COMPROMETIDO

## 🎯 Objetivo de la Misión
**De la Teoría a la Línea de Comandos**

Aplicar los comandos fundamentales de Linux en un escenario de investigación realista. Desarrollarás fluidez en la terminal para navegar, analizar permisos, buscar evidencias y monitorear actividad, habilidades esenciales para cualquier rol en ciberseguridad.

*   **⏱️ Tiempo Estimado:** 60-90 minutos.
*   **🛡️ Habilidades Practicadas:** Navegación (cd, ls, pwd), búsqueda (find, grep), permisos (chmod, stat), monitoreo (ps, ss), redirección (>, >>).
*   **⚠️ Pre-requisito:** Haber completado el Laboratorio 01 y tener tu máquina Kali Linux operativa.

---

## 📜 Escenario: La Alerta de Medianoche en TechSafelock
**Fecha:** 15-Oct-2024 | **Hora:** 02:47 AM | **Ubicación:** SOC de TechSafelock.

Acabas de iniciar tu turno como Analista Junior de SOC. El sistema de detección de intrusiones (IDS) ha disparado una alerta de severidad **ALTA** en uno de los servidores internos de desarrollo, llamado `dev-server-03`.

> **La alerta indica:** "Múltiples intentos de acceso fallidos seguidos de un acceso SSH exitoso desde una IP no whitelisteada".

**Tu Misión:**
Tu jefe te entrega la tarea inicial: *"Conéctate al servidor. No toques nada aún. Solo recopila información básica: quién está conectado, qué procesos inusuales están corriendo, y revisa si hay archivos con permisos sospechosos en directorios críticos. Documenta todo en un informe preliminar."*

*Nota: El servidor `dev-server-03` ha sido aislado. Tu máquina Kali simula este entorno.*

---

## Parte A: Reconocimiento y Navegación del Sistema
**Objetivo:** Orientarte en el sistema, entender su estructura y localizar directorios críticos.

### Tarea A.1: ¿Dónde Estoy y Quién Soy?
Abre la terminal en tu Kali.

1.  **Identifica tu usuario actual:**
    ```bash
    whoami
    ```
    > *📝 Nota: En un entorno real, siempre verifica con qué privilegios estás operando. ¿Eres un usuario normal o root?*

2.  **Descubre tu ubicación actual:**
    ```bash
    pwd
    ```

3.  **Lista el contenido (incluyendo ocultos):**
    ```bash
    ls -la
    ```

### Tarea A.2: Explorando Directorios Críticos
En Linux, la evidencia vive en lugares específicos. Explora:

1.  **Configuración del sistema (`/etc`):**
    ```bash
    ls -la /etc | head -20
    ```
    *(Muestra solo las primeras 20 líneas)*

2.  **Logs del sistema (`/var/log`):**
    ```bash
    ls -la /var/log
    ```

3.  **Directorios de usuarios (`/home`):**
    ```bash
    ls -la /home
    ```

> **🔍 Pista:** Anota cualquier archivo o directorio que llame tu atención (ej. archivos ocultos como `.malware.sh` o directorios con permisos extraños).

---

## Parte B: Búsqueda de Evidencias y Anomalías
**Objetivo:** Localizar archivos modificados recientemente y auditar permisos peligrosos.

### Tarea B.1: Encontrar Archivos Modificados Recientemente
Un atacante suele crear o modificar archivos. Busca en `/home` y `/tmp` modificados en las últimas 24 horas:

```bash
find /home /tmp -type f -mtime -1 2>/dev/null | head -15
```
*   `find`: Comando de búsqueda.
*   `/home /tmp`: Directorios dónde buscar.
*   `-type f`: Solo archivos.
*   `-mtime -1`: Modificados hace menos de 1 día.
*   `2>/dev/null`: Descarta errores de permiso.

### Tarea B.2: La Pesadilla de los Permisos 777
Permisos `777` son una puerta abierta. Escanea el sistema:

```bash
find / -type f -perm 777 2>/dev/null | head -10
```
> **⚠️ ¡Alerta!** Si encuentras archivos con 777 en `/etc`, `/var` o con nombres sospechosos, es una bandera roja crítica.

### Tarea B.3: Buscando Palabras Clave en Logs
Busca intentos fallidos o sesiones sospechosas en el log de autenticación:

```bash
sudo grep -i "failed\|accepted" /var/log/auth.log | tail -30
```
*   `grep -i`: Búsqueda insensible a mayúsculas.
*   `"failed\|accepted"`: Busca "failed" O "accepted".
*   `tail -30`: Muestra lo más reciente.

---

## Parte C: Monitoreo de Actividad en Vivo
**Objetivo:** Ver procesos y conexiones de red activas.

### Tarea C.1: ¿Qué se Está Ejecutando?
Lista procesos por consumo de CPU:

```bash
ps aux --sort=-%cpu | head -20
```
*   Busca nombres desconocidos o rutas extrañas (ej: `/tmp/.backdoor`).

### Tarea C.2: Conexiones de Red Activas
Verifica qué puertos están escuchando o conectados:

```bash
sudo ss -tulnp
```
*   `-t`: TCP
*   `-u`: UDP
*   `-l`: Listening (Escuchando)
*   `-n`: Numérico (No resolver DNS)
*   `-p`: Proceso asociado

> **Busca:** Puertos altos (ej: 4444, 31337) o conexiones a IPs desconocidas.

---

## 🕵️ Desafío Final: Construyendo la Narrativa
Basándote en tus hallazgos, responde para armar tu informe:

1.  **Usuario y Ambiente:** ¿Con qué usuario te conectaste? ¿En qué directorio empezaste?
2.  **Archivos Sospechosos:** ¿Encontraste algún archivo con permisos 777? ¿Dónde?
3.  **Evidencia en Logs:** ¿Viste líneas de "Failed password" o "Accepted password"? ¿Desde qué IP?
4.  **Procesos Inusuales:** ¿Algún proceso con nombre extraño?
5.  **Conexiones de Red:** ¿Qué puertos extraños estaban en estado LISTEN?

---

## 📝 Plantilla para el Informe
*(Copia y completa esto en tu editor de texto. Si lo prefieres, también puedes usar la **Plantilla Informe Lab 02** en formato `.md` descargable desde la plataforma, que contiene esta misma estructura lista para editar.)*

**Cadete:** [Tu Nombre]
**Fecha:** [Fecha]
**Servidor:** dev-server-03 (Simulado)

### 1. Hallazgos Clave
*   **Archivos peligrosos (777):**
    *   `[Pegar salida de find]`
*   **Logs sospechosos:**
    *   `[Pegar salida de grep]`
*   **Procesos inusuales:**
    *   `[Pegar salida de ps]`
*   **Puertos extraños:**
    *   `[Pegar salida de ss]`

### 2. Conclusión Preliminar
¿Es un falso positivo o un compromiso real? Justifica.
`[Tu conclusión aquí]`

### 3. Comandos Aprendidos
1.  `[Comando 1]`
2.  `[Comando 2]`
3.  `[Comando 3]`
