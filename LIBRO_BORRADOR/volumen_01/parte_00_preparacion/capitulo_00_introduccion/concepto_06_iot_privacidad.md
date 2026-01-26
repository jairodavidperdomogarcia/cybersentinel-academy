# Concepto 6: El Internet de las Cosas (IoT) y la Privacidad

## ¿Tus Dispositivos te Escuchan?

Imagina que invitas a un mayordomo muy servicial a vivir en tu casa. Él te pone música, te dice el clima y apaga las luces. Pero, tiene una condición: **nunca duerme y tiene un teléfono conectado las 24 horas con su jefe en una oficina central**, contándole todo lo que haces para "mejorar su servicio".

Esto es el **IoT (Internet of Things)**. Dispositivos como **Alexa**, **Smart TVs** o **Cámaras IP** son ordenadores completos con sensores (micrófonos, cámaras) conectados permanentemente a Internet.

### Los Vectores de Riesgo

Existen tres formas principales en las que estos dispositivos comprometen tu privacidad:

1.  **La "Escucha Activa" (El Fabricante):**
    *   Dispositivos como Alexa o Google Home graban fragmentos de audio para procesar comandos. A veces, se activan por error y envían conversaciones privadas a la nube para ser "analilzadas" por humanos para mejorar el algoritmo.
    *   Las Smart TVs rastrean qué ves (ACR - Automatic Content Recognition) para vender esos datos a publicistas.

2.  **Vulnerabilidades de Software (El Hacker):**
    *   Si el dispositivo tiene un fallo de seguridad (bug) y no se actualiza, un atacante puede tomar control remoto, activando la cámara o el micrófono sin que se encienda la luz LED de aviso.

3.  **Configuraciones por Defecto (El Descuido):**
    *   Muchas cámaras de seguridad baratas vienen con contraseñas por defecto (ej: usuario: `admin`, pass: `1234`). Existen buscadores en internet (como [Shodan](#shodan)) que rastrean el mundo buscando estas cámaras abiertas para que cualquiera las vea.

### Visualizando el Riesgo

A continuación, un diagrama de cómo un dispositivo IoT puede ser un puente hacia tu intimidad:

```mermaid
graph LR
    subgraph CASA [Tu Hogar Seguro]
        style CASA fill:#e1f5fe,stroke:#01579b,stroke-width:2px
        User((Usuario))
        
        subgraph IOT [Dispositivos IoT]
            style IOT fill:#fff9c4,stroke:#fbc02d,stroke-width:2px
            Alexa[Asistente de Voz]
            TV[Smart TV]
            Cam[Cámara IP]
        end
    end

    subgraph INTERNET [Nube / Internet]
        style INTERNET fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
        Cloud[Servidor del Fabricante]
        Hacker[Atacante Externo]
    end

    User -->|"Habla/Actúa"| IOT
    
    %% Flujo Legítimo
    Alexa -->|"Envía Audio"| Cloud
    Cloud -->|"Respuesta/Ads"| Alexa
    
    %% Flujo de Ataque
    Hacker -.->|"1. Escanea Puertos"| Cam
    Hacker -.->|"2. Fuerza Bruta / Exploit"| Cam
    Cam -.->|"3. Envía Video/Audio"| Hacker
    
    linkStyle 3,4,5 stroke:red,stroke-width:2px,stroke-dasharray: 5 5;
```

### Mini-diagrama visual: del dispositivo al actor malicioso

```mermaid
flowchart LR
    IoT["Dispositivo IoT\n(cámara, altavoz)"]
    Home["Red de tu casa\n(router, wifi)"]
    Cloud["Nube del fabricante\n(servidores, almacenamiento)"]
    Attacker["Actor malicioso\n(hacker que explota fallos)"]

    IoT --> Home --> Cloud --> Attacker
```

Si alguna de esas flechas se rompe (mal cifrado, contraseñas débiles o falta de actualizaciones), el camino hacia tu privacidad queda abierto.
