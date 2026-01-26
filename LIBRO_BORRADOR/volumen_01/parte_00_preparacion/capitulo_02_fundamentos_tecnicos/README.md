# Capítulo 02: Fundamentos Técnicos Acelerados
*(El Lenguaje de la Máquina)*

> **La analogía del capítulo:** Aprender ciberseguridad sin saber redes ni Linux es como intentar escribir poesía en un idioma que no hablas. Puedes memorizar frases, pero nunca entenderás el significado real.

Bienvenido al "gimnasio" mental. En este capítulo no vamos a memorizar libros enteros de teoría de redes. Vamos a aprender lo justo y necesario para sobrevivir en el campo de batalla: cómo hablan las máquinas entre sí (Redes) y cómo hablarle tú a la máquina sin intermediarios (Linux).

---

## 2.0 Inmersión: El Día que TechSafeLock se Quedó Ciega

Imagina que estás de guardia en el SOC de TechSafeLock un viernes a las 22:37.

De repente:

- La app móvil empieza a ir lenta.
- Algunos usuarios no pueden iniciar sesión.
- El CEO escribe por chat: "¿Está pasando algo?".

Solo tienes 3 pantallazos (logs simplificados):

1. `firewall01` muestra un pico de conexiones al puerto 443 de `api.techsafelock.com`.
2. En un servidor Linux aparece un archivo `backup_clientes.sql` con permisos `-rwxrwxrwx`.
3. En la consola de la nube ves un bucket recién creado llamado `tsl-backups-pruebas` sin cifrado.

### 🧠 Tu decisión en 60 segundos

<div class="quiz-block" data-quiz-id="fundamentos-techsafelock">
  <p><strong>¿Qué revisarías primero para entender si esto es un incidente serio?</strong></p>
  <div class="quiz-options">
    <button class="quiz-option" data-option-id="a">
      A. El nombre del bucket en la nube (es feo, pero podría ser una prueba interna).
    </button>
    <button class="quiz-option" data-option-id="b" data-correct="true">
      B. El pico de conexiones al puerto 443 de la API (puede ser un ataque real en producción).
    </button>
    <button class="quiz-option" data-option-id="c">
      C. El archivo con permisos 777 en el servidor (es grave, pero quizá lleva días así).
    </button>
  </div>
  <div class="quiz-feedback"></div>
</div>

No hay respuesta única perfecta, pero si empezaste por **B**, ya estás pensando como un analista que entiende:

- Que el puerto 443 es la puerta crítica de negocio.
- Que Linux y la Nube son los dos lenguajes en los que el sistema te "habla".

En el resto del capítulo vas a aprender a leer estos tres mundos sin pánico: Redes, Linux y Nube.

---

## 2.1 Redes: El Sistema Nervioso Digital

Olvídate por un momento del modelo OSI de 7 capas que te enseñan en la universidad. Para un hacker ético, lo vital ocurre principalmente en dos lugares: **Transporte** y **Red**.

### La Analogía del Edificio de Apartamentos
Imagina que Internet es una ciudad gigante.

1.  **La Dirección IP (El Edificio):** Es la ubicación única de una computadora en la red.
    *   **IP Pública:** La dirección de la calle del edificio (visible para todos).
    *   **IP Privada:** El número interno del intercomunicador (solo funciona dentro del complejo).
2.  **El Puerto (El Apartamento):** Una vez que llegas al edificio (IP), ¿a quién buscas?
    *   El puerto 80 es el apartamento del servidor web (HTTP).
    *   El puerto 22 es el apartamento del administrador remoto (SSH).
    *   El puerto 443 es el apartamento seguro (HTTPS).

> **Regla de Oro:** Si no hay un puerto abierto ("listening"), no hay nadie en casa para recibir tu paquete. No puedes hackear lo que no está escuchando.

### Protocolos: El Idioma
*   **TCP (Transmission Control Protocol):** Es como una llamada telefónica formal. "Hola, ¿me oyes?", "Sí, te oigo", "Vale, te envío el archivo". Es fiable pero lento. Ideal para webs, emails, transferencias de archivos.
*   **UDP (User Datagram Protocol):** Es como gritar un mensaje a una multitud. No te importa si todos lo escucharon, solo quieres que salga rápido. Usado en streaming, videojuegos, VoIP (como WhatsApp calls).

### DNS: La Guía Telefónica
Las computadoras no entienden `google.com`; entienden `142.250.184.206`. El **DNS (Domain Name System)** es el sistema que traduce los nombres humanos a direcciones IP.
*   *Ataque común:* DNS Spoofing (Envenenamiento). Hacer creer a la víctima que `banco.com` está en la IP de tu servidor malicioso.

### 🧪 Prueba Rápida: ¿Entendiste los puertos de TechSafelock?
Responde mentalmente basándote en lo que sabes de la fintech:

1.  Su aplicación móvil se conecta a `api.techsafelock.com`. ¿Qué puerto crees que usará siempre para esa comunicación? (Pista: manejan dinero)
2.  Un usuario escribe `app.techsafelock.com` en su navegador. ¿Qué servicio invisible traduce ese nombre a una IP para que la conexión funcione?
3.  Para enviar una orden de pago de México a España, ¿su sistema usaría TCP o UDP? ¿Por qué?

> **🔍 Conexión con el Caso:** Durante el incidente de los $2M, miles de conexiones TCP llegaban al puerto de su API de conversión. Un simple monitoreo de "conexiones por segundo" en ese puerto específico habría encendido las alarmas en 10 segundos, no en 3 minutos.

---

## 2.2 Linux: El Arsenal del Hacker

¿Por qué Kali Linux y no Windows? Porque Windows está diseñado para ser *fácil* de usar, ocultando lo que ocurre "bajo el capó". Linux está diseñado para ser *transparente* y *potente*. Es tu navaja suiza.

### El Sistema de Archivos: No existe "C:\"
En Linux, todo empieza en la raíz (`/`). No hay unidades C: o D:. Todo son carpetas (directorios) que cuelgan de esa raíz.
*   `/bin`: Binarios (programas básicos como `ls`, `cat`).
*   `/home`: Donde viven los usuarios (como "Mis Documentos"). Tu carpeta personal es `/home/kali` (o tu usuario).
*   `/etc`: Configuración del sistema (aquí vive la magia, archivos de usuarios, contraseñas hasheadas, configs de red).
*   `/var`: Archivos variables (logs de sistema, bases de datos, servidores web).
*   `/tmp`: Archivos temporales (se borran al reiniciar).

### Comandos de Supervivencia (Tu Primer Cheat Sheet)
Abre tu terminal en Kali (del Laboratorio 01) y prueba esto:

| Comando | Qué hace | Analogía |
| :--- | :--- | :--- |
| `pwd` | Print Working Directory | "¿Dónde estoy parado?" |
| `ls -la` | Listar todo (opción `-l` formato largo, `-a` archivos ocultos) | "Encender la luz y abrir los cajones" |
| `cd ruta` | Change Directory | "Caminar a otra habitación" |
| `cat archivo` | Catenate (leer y mostrar) | "Leer una nota de principio a fin" |
| `grep "texto" archivo` | Búsqueda global con regular expression | "Buscar una aguja en un pajar" |
| `sudo comando` | SuperUser DO (ejecutar como administrador) | "Pedirle permiso a mamá (root) para usar el horno" |

### Permisos: El Portero de la Discoteca
Ejecuta `ls -l` y verás algo como `-rwxr-xr--`. Son tres grupos de 3 letras:
1.  **Dueño (u):** Lo que puede hacer el creador del archivo.
2.  **Grupo (g):** Lo que pueden hacer los usuarios del mismo grupo.
3.  **Otros (o):** Lo que puede hacer el resto del mundo.

*   **r (Read):** Leer.
*   **w (Write):** Escribir/Modificar.
*   **x (eXecute):** Ejecutar (si es un programa o script).

> **⚠️ Peligro Inminente:** Un permiso `777` (rwxrwxrwx) significa que *cualquiera* en el sistema puede leer, modificar y ejecutar ese archivo. Es el equivalente digital a dejar tu casa abierta con un cartel de "Pasen y sírvanse".

### 🧪 Ejercicio en Terminal: Tu Primera Auditoría
En tu máquina Kali del Laboratorio 01:

1.  Averigua quién eres: `whoami`
2.  Ve a tu carpeta personal y mira qué hay: `cd ~` y luego `ls -la`
3.  Crea un archivo de prueba: `echo "Este es un secreto de TechSafelock" > secreto.txt`
4.  Dale el peor permiso posible: `chmod 777 secreto.txt`
5.  Verifica el desastre: `ls -l secreto.txt`

**Pregunta para reflexionar:** Si este archivo estuviera en un servidor real de TechSafelock con datos de clientes, ¿qué podría pasar?

---

## 2.3 Introducción a la Nube (La Computadora de Otro)

La nube no es magia, es simplemente usar los servidores gigantes de Amazon (AWS), Google (GCP) o Microsoft (Azure) en lugar de los tuyos propios.

### Pizza as a Service (La Mejor Explicación que Existirá)
*   **On-Premises (Cocinar en casa):** Tú compras los ingredientes, tienes el horno, cocinas, pones la mesa y lavas los platos. (Tú gestionas TODO: Red, Servidores, SO, Aplicación).
*   **IaaS - Infraestructura como Servicio (Pizza congelada):** El proveedor te da la infraestructura (horno/electricidad), tú pones la pizza y la cocinas. (Ej: Amazon EC2. Ellos dan la máquina virtual, tú administras el Sistema Operativo y todo lo de arriba).
*   **PaaS - Plataforma como Servicio (Pizza a domicilio):** Te traen la pizza hecha, tú solo pones la mesa y refrescos. (Ej: Google App Engine, Heroku. Tú solo subes tu código, ellos manejan el SO y el servidor).
*   **SaaS - Software como Servicio (Ir a la pizzería):** Todo está hecho. Tú solo comes. (Ej: Gmail, Salesforce, Dropbox. Solo usas la aplicación).

### El Modelo de Responsabilidad Compartida (Donde Muchos Fracasan)
Si usas AWS y te hackean:
*   ¿Falló la seguridad física del centro de datos? → **Culpa de AWS.**
*   ¿Dejaste la contraseña de tu base de datos en blanco en un servidor EC2? → **Culpa TUYA.**

### 📋 Responsabilidad en el Desastre de TechSafelock
TechSafelock usaba AWS (IaaS). Cuando perdieron $2M en 3 minutos:
*   ❌ **AWS no tuvo la culpa:** No hubo fallo en sus centros de datos, redes o hipervisores.
*   ✅ **La culpa fue de TechSafelock:** El error estaba en su código de conversión de moneda y en la falta de validación en su aplicación.

> **⚠️ Lección Clave:** En la nube, tú sigues siendo el máximo responsable de la seguridad de tu código, tus configuraciones y tus datos. La nube te da poder, pero no te quita la responsabilidad.

---

## 🎯 Resumen Práctico del Capítulo
*   Las **IPs** son direcciones, los **Puertos** son puertas. Para atacar o defender, primero debes saber a qué puerta llamar.
*   **Linux** es tu mejor amigo y tu peor enemigo. La terminal no muerde, pero no perdona errores. Aprende a hablar su idioma.
*   La **Nube** es cómoda, pero no es mágica. Te quita la carga de gestionar hardware, pero te aumenta la responsabilidad sobre tu software y configuración.

### 📊 CyberSentinel Tracker – Evaluación de Conceptos
*Autoevalúa tu dominio de los fundamentos técnicos antes de proceder.*

Califica tu confianza del **1 al 5**  
(1: No lo entiendo, 5: Podría enseñarlo en una sesión interna).

<div class="tracker-container" data-chapter-id="02" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Redes:</strong> Diferencia entre IP Pública vs Privada y función de los Puertos.</td>
        <td>
          <span class="tracker-option" data-row="redes" data-val="1">1</span>
          <span class="tracker-option" data-row="redes" data-val="2">2</span>
          <span class="tracker-option" data-row="redes" data-val="3">3</span>
          <span class="tracker-option" data-row="redes" data-val="4">4</span>
          <span class="tracker-option" data-row="redes" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Linux Básico:</strong> Uso de `ls -l`, `cd`, `cat` y `sudo`.</td>
        <td>
          <span class="tracker-option" data-row="linux_cmds" data-val="1">1</span>
          <span class="tracker-option" data-row="linux_cmds" data-val="2">2</span>
          <span class="tracker-option" data-row="linux_cmds" data-val="3">3</span>
          <span class="tracker-option" data-row="linux_cmds" data-val="4">4</span>
          <span class="tracker-option" data-row="linux_cmds" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Permisos:</strong> Explicar `chmod 777` y por qué es peligroso.</td>
        <td>
          <span class="tracker-option" data-row="permisos" data-val="1">1</span>
          <span class="tracker-option" data-row="permisos" data-val="2">2</span>
          <span class="tracker-option" data-row="permisos" data-val="3">3</span>
          <span class="tracker-option" data-row="permisos" data-val="4">4</span>
          <span class="tracker-option" data-row="permisos" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Nube:</strong> Modelo de Responsabilidad Compartida (AWS vs Usuario).</td>
        <td>
          <span class="tracker-option" data-row="cloud" data-val="1">1</span>
          <span class="tracker-option" data-row="cloud" data-val="2">2</span>
          <span class="tracker-option" data-row="cloud" data-val="3">3</span>
          <span class="tracker-option" data-row="cloud" data-val="4">4</span>
          <span class="tracker-option" data-row="cloud" data-val="5">5</span>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 8</span>
  </div>
  <div class="tracker-feedback">
    Selecciona tu nivel de confianza en cada competencia.
  </div>
</div>

### ¿Listo para ensuciarte las manos? 👐
Tu teoría está sólida. Ahora pasa al **Laboratorio 02** para dominar la terminal de Kali Linux y aplicar todo esto en un entorno real (y seguro).

{{INSERTAR_LABORATORIO:lab_02}}
