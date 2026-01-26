# Arquitectura de Seguridad: API Gateway

Este diagrama detalla las capas de defensa internas de un **API Gateway Seguro**.
Es el "portero" que decide quién entra y quién se queda fuera antes de tocar la lógica de negocio.

```mermaid
flowchart TD
    subgraph CLIENT ["Cliente Externo"]
        User["Usuario / App"]
        Attacker["Atacante"]
    end

    subgraph GATEWAY ["🛡️ API Gateway (The Guardian)"]
        direction TB
        
        %% Capa 1: Network
        TLS{"🔐 TLS Termination\n(HTTPS Decryption)"}
        
        %% Capa 2: WAF
        WAF{"🔥 WAF / Filtro\n(SQLi, XSS, Malicious Payload)"}
        
        %% Capa 3: Identity
        Auth{"🆔 AuthN / AuthZ\n(Validar JWT Token)"}
        
        %% Capa 4: Traffic Control
        RateLimit{"⏱️ Rate Limiter\n(Max 10 req/sec)"}
        
        %% Routing
        Router["🔀 Router / Load Balancer"]
    end

    subgraph BACKEND ["Microservicios (Zona Segura)"]
        ServiceA["📦 Servicio de Pagos"]
        ServiceB["👤 Servicio de Usuarios"]
    end

    %% Flow Legítimo
    User -->|HTTPS Request| TLS
    TLS --> WAF
    WAF -->|Limpio| Auth
    Auth -->|Token Válido| RateLimit
    RateLimit -->|Bajo Límite| Router
    Router --> ServiceA
    Router --> ServiceB

    %% Flow Ataques (Bloqueos)
    Attacker -.->|HTTP (Inseguro)| TLS
    TLS -.->|Redirect HTTPS| User
    
    Attacker -.->|SQL Injection: ' OR 1=1| WAF
    WAF -.->|❌ 403 Forbidden| Block1["⛔ Bloqueo por WAF"]
    
    Attacker -.->|Token Falso / Expirado| Auth
    Auth -.->|❌ 401 Unauthorized| Block2["⛔ Bloqueo de Identidad"]
    
    Attacker -.->|DDoS (1000 req/sec)| RateLimit
    RateLimit -.->|❌ 429 Too Many Requests| Block3["⛔ Bloqueo de Tráfico"]

    %% Estilos
    style GATEWAY fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    style BACKEND fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style Block1 fill:#ffcdd2,stroke:#c62828
    style Block2 fill:#ffcdd2,stroke:#c62828
    style Block3 fill:#ffcdd2,stroke:#c62828
```

## Leyenda de Capas de Defensa

### 1. 🔐 TLS Termination (Cifrado)
*   **Función:** Descifra el tráfico HTTPS entrante.
*   **Seguridad:** Asegura que nadie pueda leer los datos en tránsito. Rechaza conexiones no cifradas (HTTP).

### 2. 🔥 WAF (Web Application Firewall)
*   **Función:** Inspecciona el *contenido* del paquete.
*   **Defensa:** Busca patrones de ataque conocidos como Inyección SQL (`' OR 1=1`) o Cross-Site Scripting (XSS). Si detecta basura, la descarta inmediatamente.

### 3. 🆔 AuthN / AuthZ (Identidad)
*   **Función:** Verifica "¿Quién eres?" (Autenticación) y "¿Qué puedes hacer?" (Autorización).
*   **Defensa:** Valida la firma digital de los Tokens (JWT). Si el token está caducado o manipulado, devuelve `401 Unauthorized`.

### 4. ⏱️ Rate Limiter (Control de Tráfico)
*   **Función:** Cuenta cuántas peticiones hace un usuario por segundo.
*   **Defensa:** Protege contra ataques de Fuerza Bruta y Denegación de Servicio (DoS). Si te pasas del límite, recibes un `429 Too Many Requests`.

### 5. 🔀 Router (Distribución)
*   Solo si la petición pasa **todas** las capas anteriores, se envía al microservicio correspondiente. Esto asegura que el Backend nunca recibe tráfico "sucio".
