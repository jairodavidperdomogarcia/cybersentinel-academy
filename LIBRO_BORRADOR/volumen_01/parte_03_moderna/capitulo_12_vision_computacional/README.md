# Capítulo 12: Visión Computacional – Los Ojos del SOC

> **"Las cámaras ven. La visión computacional entiende lo que ven."**

<div class="skill-tree-node" data-skill="computer_vision_ops">
  <span class="skill-icon">👁️</span>
  <span class="skill-name">Skill Unlock: Computer Vision Ops</span>
  <span class="skill-desc">Capacidad para implementar vigilancia automatizada y correlacionar eventos físicos con logs digitales.</span>
</div>

---

## 🎯 OBJETIVOS DE LA MISIÓN

1.  **Conectar** seguridad física y digital mediante visión por computadora.
2.  **Aplicar** detección de anomalías a video vigilancia en casos reales.
3.  **Implementar** un sistema básico de detección de intrusos con OpenCV.
4.  **Analizar** comportamientos sospechosos (merodeo, movimientos rápidos) en tiempo real.
5.  **Entender** los límites éticos de la vigilancia automatizada.

---

## 12.0 Inmersión: Lo que la Cámara de TJX Vio pero Nadie Analizó

Recordemos el caso TJX desde una perspectiva puramente física. Mientras los datos eran robados digitalmente, en el mundo físico ocurría una historia paralela.

**ESTACIONAMIENTO TJX - 2:17 AM**
*[CÁMARA DE SEGURIDAD 04 - ENTRADA TRASERA]*

```text
23:45 - Vehículo desconocido estacionado (Toyota Corolla blanco)
01:30 - Individuo se acerca al edificio (cara no reconocida)
01:45 - Usa tarjeta de acceso (¿robada/clonada?)
02:00 - Sale con mochila (¿llena de hardware?)
02:17 - EL MOMENTO CRÍTICO: Mismo individuo vuelve a entrar
      → Esta vez NO usa tarjeta, alguien le abre desde dentro
      → Posible cómplice interno
```

### La falla de seguridad física tradicional
*   **Guardia humano:** Dormido/aburrido después de horas de "nada que ver".
*   **Grabación DVR:** Guarda video, pero nadie lo revisa hasta **DESPUÉS** del incidente.
*   **Sistema de acceso:** Registra "tarjeta válida usada", no valida "¿es la persona correcta?".

### La oportunidad de visión computacional
*   **Reconocimiento facial:** ¿Este individuo es empleado?
*   **Detección de anomalías:** ¿Vehículo estacionado a horas no laborales?
*   **Análisis de comportamiento:** ¿Movimientos sospechosos repetitivos?
*   **Correlación físico-digital:** ¿Coincide con pico de tráfico SQL a las 2:17 AM?

> **La lección:** La seguridad física y digital NO son silos separados. Son capas de una misma defensa.

### Casos Reales que Demuestran la Necesidad

**Caso Real 1: El Asalto a los Datos de la NSA (2016) - "El Robo Físico que Digitalizaron"**
*   **UBICACIÓN:** Fort Meade, Maryland - Sede de la NSA.
*   **INTRUSO:** Harold T. Martin III, contratista de la NSA.
*   **LO QUE OCURRIÓ:**
    1.  **FÍSICO:** Martin entraba a oficinas seguras y salía con una mochila llena de documentos y discos duros.
    2.  **DIGITAL:** Subía datos a la nube personal desde su casa.
*   **LA FALLA:** Las cámaras veían a un empleado salir con bultos extraños a horas raras, pero nadie correlacionó eso con los logs de acceso a archivos clasificados.

**Caso Real 2: El Robo del Banco de Bangladesh (2016) - "El Ataque que Comenzó con una Cámara"**
*   **PÉRDIDA:** $81 millones.
*   **LO CRÍTICO:** El ataque requirió acceso físico inicial para manipular impresoras y hardware.
*   **SI HUBIERA HABIDO VISIÓN COMPUTACIONAL:** Se habría detectado manipulación de hardware en estaciones críticas antes de que el malware digital ejecutara las transferencias.

---

## 12.1 Conectando los Dos Mundos: Físico y Digital

El puente CyberSentinel:

```mermaid
graph TD
    subgraph FISICO ["MUNDO FÍSICO"]
        CCTV[Cámaras CCTV]
        ACCESS[Control de Acceso]
        SENSORS[Sensores Movimiento]
    end

    subgraph DIGITAL ["MUNDO DIGITAL"]
        FW[Firewalls]
        IDS[IDS/IPS]
        SIEM[SIEM]
    end

    subgraph BRIDGE ["VISIÓN COMPUTACIONAL"]
        CV[Motor OpenCV/YOLO]
        BRIDGE_NODE[Correlación de Eventos]
    end

    CCTV --> CV
    CV --> BRIDGE_NODE
    BRIDGE_NODE -.->|Alerta: Intruso Físico| SIEM
    BRIDGE_NODE -.->|Alerta: Comportamiento Anómalo| SIEM
```

### Casos donde se intersectan

| Caso CyberSentinel | Componente Físico | Componente Digital | Conexión por Visión Computacional |
| :--- | :--- | :--- | :--- |
| **TJX** | Cámara estacionamiento | Exfiltración datos | Reconocer mismo individuo en físico que IP en logs. |
| **MediTech** | Acceso sala hospitalaria | Acceso registros médicos | Verificar que persona física = credencial digital. |
| **AutoManufact** | Robot industrial | Comandos PLC alterados | Detectar movimiento anómalo del robot vs comandos. |
| **TechSafelock** | Cajero ATM | Transacciones fraudulentas | Detectar dispositivo skimmer instalado físicamente. |

### La Lección del Caso TARGET (2013)

**¿CÓMO COMENZÓ?** Con un email de phishing a un VENDEDOR DE AIRE ACONDICIONADO (Fazio Mechanical Services).
1.  Los atacantes robaron credenciales del proveedor de HVAC.
2.  Usaron esas credenciales para entrar a la red de Target.

**LA PREGUNTA INCÓMODA:** ¿Las cámaras en las oficinas del proveedor de aire acondicionado hubieran detectado algo?
*   **NO** el click en el phishing.
*   **SÍ** podrían haber detectado "visitantes inusuales" o "ingreso físico no autorizado" si los atacantes hubieran intentado acceder físicamente primero.
*   **LA CORRELACIÓN:** "Empleado de HVAC hace click en phishing" + "Mismo empleado recibe 'visita técnica' sospechosa el día anterior" = POSIBLE INGENIERÍA SOCIAL FÍSICA.

---

## 🧠 DECISION SIMULATOR: El Dilema del Falso Positivo

Estás configurando el umbral de confianza (`confidence_threshold`) para el acceso a la Sala de Servidores.

<div class="decision-simulator" data-scenario="threshold_dilemma">
  <h3>¿Qué umbral configuras?</h3>
  
  <div class="decision-option">
    <h4>Opción A: Modo Paranoico (Umbral 0.9 / 90%)</h4>
    <p>Solo dejas pasar si la coincidencia es casi perfecta.</p>
    <ul>
      <li>✅ Bloquea 100% de fotos falsas.</li>
      <li>❌ El CEO se queda fuera si cambia de gafas o hay poca luz. Te despiden.</li>
    </ul>
  </div>

  <div class="decision-option">
    <h4>Opción B: Modo Laxo (Umbral 0.4 / 40%)</h4>
    <p>Priorizas la comodidad.</p>
    <ul>
      <li>✅ El CEO entra siempre rápido.</li>
      <li>❌ Un atacante con una foto impresa entra fácilmente.</li>
    </ul>
  </div>

  <div class="decision-option">
    <h4>Opción C: Balanceado + MFA (Umbral 0.6 + Tarjeta)</h4>
    <p>Buscas similitud razonable pero exiges un segundo factor.</p>
    <ul>
      <li>✅ Equilibrio operativo.</li>
      <li>✅ La visión actúa como "validador", no como única llave.</li>
    </ul>
  </div>
</div>

---

## 12.2 Laboratorio 12: Los Ojos que Nunca Duermen

**Objetivo:** Implementar un sistema de detección de anomalías para video vigilancia.
**Escenario:** "Proteger el acceso a la sala de servidores de TJX. Solo 3 personas autorizadas. Cualquier otra persona debe generar alerta."

### Parte A: Configurar el Entorno

```bash
# 1. Instalar OpenCV y dependencias
pip install opencv-python numpy matplotlib
pip install opencv-contrib-python # Versión con extras
pip install imutils # Utilidades para procesamiento de video
pip install face_recognition

# 2. Descargar modelos pre-entrenados YOLO (Opcional para objetos, usaremos Face Recognition para este lab)
# wget https://github.com/pjreddie/darknet/raw/master/cfg/yolov3.cfg
# wget https://pjreddie.com/media/files/yolov3.weights
# wget https://github.com/pjreddie/darknet/raw/master/data/coco.names
```

### Parte B: Sistema de Reconocimiento de Personal Autorizado

Crea el archivo `facial_recognition_auth.py` (código completo disponible en el archivo). Este script carga rostros conocidos y vigila la cámara en tiempo real.

**Puntos Clave del Código:**
*   `load_authorized_persons`: Carga imágenes de la carpeta `authorized_persons/`.
*   `recognize_person`: Usa `face_recognition` para comparar encodings.
*   `log_access`: Registra accesos y alerta sobre desconocidos.

*(Ejecuta el script `facial_recognition_auth.py` para probarlo)*

### Parte C: Detección de Comportamientos Sospechosos

La seguridad no es solo "quién eres", sino "qué haces". Un empleado autorizado merodeando en una zona segura a las 3 AM es sospechoso.

Crea el archivo `behavior_analysis.py` (código completo disponible en el archivo).

**Patrones Detectados:**
1.  **Merodeo:** Permanecer en un radio pequeño por más de 30 segundos.
2.  **Movimiento Rápido:** Correr dentro de las instalaciones.
3.  **Grupos Sospechosos:** Agrupación de personas a corta distancia.

*(Ejecuta el script `behavior_analysis.py` para probarlo)*

### Parte D: Sistema Integrado de Seguridad Física-Digital

Finalmente, crearemos el "Cerebro Central" que recibe alertas de ambos mundos y busca correlaciones.

Crea el archivo `integrated_physical_digital_security.py` (código completo disponible en el archivo).

**Lógica de Correlación:**
*   **Ventana de Tiempo:** 5 minutos entre evento físico y digital.
*   **Patrones de Ataque:**
    *   *Intruso Físico + SQL Injection* = 0.4
    *   *Tailgating + Exfiltración de Datos* = 0.6
    *   *Intruso Detectado + Exfiltración (TJX)* = 0.8

*(Ejecuta el script `integrated_physical_digital_security.py` para ver la simulación del caso TJX)*

### Parte E: Simulación de Caso Real - Google Laptop Theft

Vamos a simular un caso real documentado: **Robo de Laptops en Google (2013)**.

Crea el archivo `google_theft_simulation.py` (código completo disponible en el archivo).

*(Ejecuta el script `google_theft_simulation.py` para ver qué hubiera detectado la visión computacional)*

### Extensión Opcional: Modo Real – Conecta tu Propia Cámara

Si tienes una cámara disponible (webcam o cámara IP propia), puedes llevar este laboratorio al mundo físico.

**Opción 1: Webcam del portátil/PC**

En `facial_recognition_auth.py` se utiliza la cámara local así:

```python
video_capture = cv2.VideoCapture(0)
```

Con esto podrás:

*   Añadir tus fotos en `authorized_persons/`.
*   Probar que tu rostro abre la “puerta” y otros rostros generan alerta.

**Opción 2: Cámara IP en tu red (RTSP)**

Si tienes una cámara IP en tu casa/oficina, muchos modelos exponen una URL RTSP como:

```text
rtsp://usuario:password@192.168.1.50:554/stream1
```

Puedes usarla en lugar de la webcam:

```python
video_capture = cv2.VideoCapture("rtsp://usuario:password@192.168.1.50:554/stream1")
```

**Recordatorio Ético CyberSentinel**

*   Solo usar cámaras de tu propiedad o con permiso explícito.
*   No grabar ni analizar a personas sin informarles.
*   Mantener las pruebas en entornos controlados (tu casa, tu oficina de laboratorio).

---

## 12.3 Casos de Estudio: De la Teoría a la Realidad

### Caso MediTech - Seguridad en Hospitales
**Incidente Real Paralelo:** Hospital de Los Ángeles (2020) - Intruso roba leche materna.
*   **Detección Fallida:** 3 horas después por humanos.
*   **Visión Computacional:** Habría detectado persona sin uniforme, fuera de horario, con cooler térmico.
*   **Conexión MediTech:** Mismo riesgo de acceso físico a dispositivos críticos.

### Caso AutoManufact - Protección de Línea de Producción
**Incidente Real Paralelo:** Fábrica de Autos en Alemania (2018) - Sabotaje USB.
*   **Lo Físico:** Empleado descontento accede a sala de control fuera de turno.
*   **Patrón Detectable:** Comportamiento nervioso, manipulación de equipos no asignados.
*   **Consecuencia Digital:** Parada de producción (€50M).

### Caso TechSafelock - Seguridad en Oficinas Financieras
*   **Riesgos Físicos:** Shoulder surfing, instalación de skimmers.
*   **Defensa:** Detección de objetos extraños en cajeros y análisis de mirada/postura.

---

## 12.4 Ética y Vigilancia: Límites que NO Debemos Cruzar

### Caso Real de Abuso: Reconocimiento Facial en Hong Kong (2019)
El uso de tecnología para identificar manifestantes y cruzar datos con redes sociales plantea graves dilemas éticos.

*(Ejecuta el script `hong_kong_ethics.py` para analizar el dilema)*

### Principios Éticos CyberSentinel
1.  **Minimización de datos:** Solo recolectar lo necesario.
2.  **Transparencia:** Informar dónde hay cámaras y para qué.
3.  **No discriminación:** Auditar algoritmos para evitar sesgos raciales/género.
4.  **Propósito limitado:** No usar seguridad para vigilancia política o laboral abusiva.
5.  **Human in the loop:** Decisiones críticas siempre revisadas por humanos.

---

## 12.5 Narrativa Integradora: El Atacante Híbrido

**[2019 - COMPAÑÍA DE ENERGÍA EN UCRANIA]**

El mismo atacante dejó rastros en **AMBOS** mundos:

**HUELLA FÍSICA (Cámaras de seguridad):**
*   Entra por puerta de mantenimiento a las **3:17 AM**.
*   Manipula físicamente un router.
*   Sale a las **3:45 AM**.

**HUELLA DIGITAL (Logs de red):**
*   **3:20 AM:** Router reiniciado desde consola física.
*   **3:42 AM:** Datos de planta energética empiezan a fluir al exterior.

**LA CORRELACIÓN QUE NADIE HIZO:**
*   **Mismo timestamp:** 3:17 AM entrada física ≈ 3:20 AM actividad digital.
*   **Misma ubicación:** Rack físico = Router comprometido.

> **LA LECCIÓN:** Si el SOC hubiera correlacionado la alerta física con la digital, el ataque se habría detenido en minutos.

---

## 12.6 Hackeando al Gran Hermano: Seguridad de la Infraestructura CCTV

> **"Si controlas lo que ven los ojos, controlas la realidad del cerebro."**

Es un error común confiar ciegamente en la cámara. Los atacantes sofisticados no esquivan las cámaras; las hackean para que muestren lo que ellos quieren.

### Vectores de Ataque a la Infraestructura de Video
1.  **Loop Attack (Ataque de Bucle):** Grabar 5 minutos de "pasillo vacío" y retransmitirlo en bucle. El guardia ve todo tranquilo mientras el intruso vacía la sala.
2.  **Visual Denial of Service (V-DoS):** Cegar la cámara (láser, spray, tapar lente).
3.  **RTSP Stream Hijacking:** Interceptar la señal digital IP y reemplazarla (como un Man-in-the-Middle de video).

### Defensa Activa: Monitor de Integridad de Video
No basta con ver el video; hay que vigilar la *salud* del video.

Crea el archivo `camera_integrity_monitor.py` (código disponible en los archivos del capítulo). Este script detecta si una cámara ha sido cegada o puesta en loop.

**Lógica de Detección:**
*   **Anti-Loop:** Si la diferencia de píxeles entre frames es *exactamente* cero por mucho tiempo, es falso. El mundo real tiene "ruido" (polvo, luz, sensores).
*   **Anti-Sabotaje:** Si el histograma de luz cambia drásticamente en 1 segundo (de luz a negro total), es una oclusión.

*(Ejecuta `camera_integrity_monitor.py` para simular un ataque de loop y sabotaje)*

### Protocolo de Respuesta en Tiempo Real (Playbook)

| Señal de Alerta | Posible Causa | **ACCIÓN INMEDIATA (Real-Time Response)** |
| :--- | :--- | :--- |
| **Video Frozen** (Diff=0) | Loop Attack / Fallo DVR | 1. **Enviar Guardia** físicamente a la zona (asumir intrusión).<br>2. Reiniciar puerto del switch de esa cámara. |
| **Signal Loss** (No Signal) | Corte de cable / Corte energía | 1. **Bloqueo preventivo** de puertas magnéticas en esa zona.<br>2. Alerta a Mantenimiento + Seguridad. |
| **Massive Change** (Blackout) | Spray / Tapadura | 1. **ALERTA CRÍTICA:** Sabotaje confirmado.<br>2. Desplegar equipo de respuesta. |

---

## 12.7 Laboratorio Black Hat: IoT Hacking - Tu Cámara es el Espía

> **"La S en IoT significa Seguridad." (Viejo chiste hacker)**

Millones de cámaras están expuestas en internet porque los usuarios las instalan y olvidan cambiar la contraseña. Motores de búsqueda como **Shodan** o sitios como **Insecam** indexan estas cámaras automáticamente.

Si no aseguras tu cámara, cualquiera puede ver tu casa desde Japón o Rusia.

### Fase 1: Simulación de la Víctima (Tu Cámara Vulnerable)
Vamos a levantar una cámara simulada en tu propia máquina que tiene un fallo de seguridad crítico: **Credenciales por defecto**.

1.  Abre una terminal.
2.  Ejecuta el simulador de cámara:
    ```bash
    python vulnerable_camera_sim.py
    ```
    *(Esto iniciará un servidor en el puerto 8080 que simula ser una cámara "SecureCam-X200" vieja)*

### Fase 2: El Ataque (Cómo entran los hackers)
Los hackers no adivinan contraseñas mágicamente; usan diccionarios de claves comunes (admin/admin, root/12345) que vienen de fábrica.

1.  Abre una **segunda terminal**.
2.  Ejecuta el script de ataque:
    ```bash
    python camera_attack_demo.py
    ```
    *(Verás cómo el script prueba combinaciones hasta que... ¡BINGO! Acceso concedido)*

### Fase 3: Análisis Forense (¿Cómo saber si me hackearon?)
Si sospechas que alguien entró, debes mirar los **Logs del Sistema**.

1.  En la misma terminal, ejecuta el analista forense:
    ```bash
    python camera_forensics.py
    ```
    *(Este script leerá el archivo `camera_system.log` generado por la cámara)*

**Lo que verás en el reporte:**
*   **IPs de origen:** ¿Desde dónde se conectaron?
*   **Patrones de Fuerza Bruta:** ¿Hubo 50 intentos fallidos en 1 segundo?
*   **Usuario Comprometido:** ¿Entraron como 'admin' o 'guest'?

### 🛡️ Guía de Hardening: Asegura tu Cámara REAL
Ahora que has visto lo fácil que es, aplica esto a tus cámaras reales:

1.  **CAMBIA LA CONTRASEÑA YA:** Nunca dejes `admin:admin`. Usa frases largas.
2.  **ACTUALIZA EL FIRMWARE:** Los fabricantes lanzan parches para cerrar puertas traseras.
3.  **DESACTIVA UPnP EN EL ROUTER:** Universal Plug and Play abre puertos automáticamente. ¡Apágalo!
4.  **SEGMENTACIÓN DE RED (VLAN):**
    *   Crea una red WiFi de "Invitados" o una VLAN específica solo para cámaras IoT.
    *   Si hackean la cámara, no podrán saltar a tu PC donde haces banca online.

---

## 📊 CYBERSENTINEL TRACKER - CAPÍTULO 12

<div class="tracker-container" data-chapter="12">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Integración físico-digital:</strong> Entiendo cómo conectar seguridad física y ciberseguridad.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>OpenCV básico:</strong> Puedo implementar detección facial simple con Python.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>Análisis de comportamiento:</strong> Identifico patrones sospechosos en video vigilancia.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>Correlación de alertas:</strong> Sé conectar alertas físicas con digitales.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>Ética en vigilancia:</strong> Comprendo los límites éticos de la visión computacional.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>Integridad de Video:</strong> Sé detectar sabotajes y ataques de loop en cámaras.</td>
        <td>1 2 3 4 5</td>
      </tr>
      <tr>
        <td><strong>IoT Security:</strong> Entiendo cómo auditar y asegurar dispositivos IoT vulnerables.</td>
        <td>1 2 3 4 5</td>
      </tr>
    </tbody>
  </table>
  <div class="tracker-score">
    <strong>PUNTUACIÓN: _____ / 10</strong>
    <p><em>(Suma tus niveles y divide por 3.5, o asigna 1.4 puntos por nivel 5)</em></p>
  </div>
</div>

---

## 🎯 PREGUNTAS DE REFLEXIÓN BASADAS EN CASOS REALES

1.  **Basado en el caso de la NSA:** ¿Cómo diseñarías un sistema que detecte a "empleados" que acceden a áreas fuera de su departamento normal?
2.  **Basado en el robo de Bangladesh Bank:** ¿Qué comportamientos físicos buscarías que preceden a un ataque de malware financiero?
3.  **Basado en el caso de Google:** ¿Cómo diferenciarías entre "empleado llevándose laptop a casa" vs "intruso robando laptop"?
4.  **Basado en Hong Kong:** ¿Qué límites técnicos implementarías para prevenir abusos de reconocimiento facial?

---

## 12.8 Encajando la visión en tu pipeline 06–11

Hasta ahora tu pipeline luce así:

- Cap 06: amenazas híbridas (físicas + digitales).
- Cap 07: arquitecturas donde decides qué zonas son críticas.
- Cap 08: reglas IDS/IPS que vigilan tráfico en esas zonas.
- Cap 09: hardening y baseline de servidores, cámaras e IoT.
- Cap 10: modelos de anomalías sobre logs y métricas.
- Cap 11: hunting que conecta todas esas señales.

En Cap 12 añades la pieza que faltaba: **ver el mundo físico** y convertir píxeles en señales accionables para tu SOC.

### De las amenazas (Cap 06) a las cámaras correctas

- A partir de tus escenarios de AutoManufact, MediTech y TechSafelock:
  - Define qué riesgos son **físico-digitales** (tailgating, acceso a PLC, sala de servidores, quirófano remoto).
  - Usa esa lista para decidir **dónde** colocar cámaras y qué comportamientos vigilar.

### De la arquitectura (Cap 07) a la topología de CCTV

- Tu diagrama de redes ya tiene:
  - Segmentos críticos, DMZ, entornos médicos, oficinas, ATMs.
- Añade la capa de visión:
  - Cámaras en rutas de acceso a activos críticos.
  - Correlación con gateways, firewalls e IDS que ya definiste.

### De la detección (Cap 08–10) al hunting (Cap 11)

- Cap 08: las reglas IDS/IPS se enriquecen con contexto físico:
  - Alerta combinada “Intruso físico + tráfico SQL inusual”.
- Cap 09: cámaras e IoT forman parte del baseline:
  - Si una cámara cambia de ángulo, pierde señal o se congela, rompe el baseline.
- Cap 10: anomalías ahora incluyen:
  - Patrones extraños en métricas de video (movimiento, presencia, zonas calientes).
- Cap 11: usas todo lo anterior para formular hunts:
  - “Si hay merodeo + intentos de RDP en esa misma franja horaria, persigo ese host/usuario.”

### Vista de alto nivel del pipeline extendido

```mermaid
flowchart LR
    T6[Cap 06<br/>Amenazas híbridas] --> A7[Cap 07<br/>Arquitectura]
    A7 --> D8[Cap 08<br/>IDS/IPS]
    D8 --> H9[Cap 09<br/>Hardening & Baseline]
    H9 --> M10[Cap 10<br/>Anomalías]
    M10 --> H11[Cap 11<br/>Hunting]
    H11 --> V12[Cap 12<br/>Visión computacional]
    V12 --> H11
```

Checklist rápido:

- ¿Has marcado en tus diagramas de Cap 07 en qué zonas necesitarías cámaras realmente?

- ¿Tus reglas de Cap 08 diferencian entre actividad “sospechosa + intruso físico” y “sospechosa pero sin evento físico”?

- ¿Incluiste cámaras/IoT en tu baseline de Cap 09 (passwords, firmware, VLANs)?

- ¿Podrías alimentar tus modelos de Cap 10 con métricas agregadas de video (conteos, tiempo de permanencia, etc.)?

- ¿En tus hunts de Cap 11 consideras ya eventos de visión (merodeo, acceso no autorizado, sabotaje de cámara) como disparadores?

---

## ✅ RESUMEN DEL CAPÍTULO

Has cerrado el círculo completo: de bits en una red a píxeles en una cámara. La visión holística del CyberSentinel:

*   **Cap 8:** Ve lo que pasa en la red
*   **Cap 9:** Endurece los sistemas
*   **Cap 10:** Intuye anomalías
*   **Cap 11:** Caza activamente
*   **Cap 12:** Ve el mundo físico que contiene todo lo anterior

**Lo más importante:** La seguridad no es solo firewalls y contraseñas. Es también: ¿Quién entra físicamente a tu sala de servidores? ¿Qué vehículos están en tu estacionamiento a las 2 AM? ¿Coinciden los movimientos físicos con los patrones digitales?

En la siguiente parte del libro (Cap 13 en adelante) empezarás a usar **IA y LLMs** para automatizar muchas de las decisiones y flujos que has diseñado manualmente hasta aquí.
