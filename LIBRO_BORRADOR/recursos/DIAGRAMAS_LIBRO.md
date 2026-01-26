# 📊 Recursos Visuales del Libro

Este archivo contiene el código fuente (Mermaid) de los diagramas clave para ser insertados en el libro.

## 1. Diagrama General de Sandar Digital Bank (Capítulo 1)
Representa la arquitectura de alto nivel y los puntos de entrada.

```mermaid
graph TD
    subgraph Internet ["🌐 Internet (Red Hostil)"]
        style Internet fill:#f9f9f9,stroke:#333,stroke-width:2px
        User["👤 Usuario Legítimo"]
        Attacker["🥷 Atacante (Spoofing)"]
    end

    subgraph DMZ ["🛡️ DMZ (Zona Desmilitarizada)"]
        style DMZ fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
        WAF["🔥 WAF (Web App Firewall)"]
        LB["⚖️ Load Balancer"]
    end

    subgraph Internal ["🔒 Red Interna (Sandar Bank)"]
        style Internal fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
        Web["💻 Web Server (Frontend)"]
        App["⚙️ App Server (Lógica)"]
        DB[("🗄️ Base de Datos (SQL)")]
        Auth["🔑 Auth Server (LDAP/AD)"]
    end

    User -->|HTTPS| WAF
    Attacker -.->|DDoS/SQLi| WAF
    WAF --> LB
    LB --> Web
    Web --> App
    App --> DB
    App --> Auth

    %% Leyenda
    linkStyle 1 stroke:red,stroke-width:2px,stroke-dasharray: 5 5;
```

## 2. Detalle del API Gateway (Capítulo 2)
Muestra las capas de defensa específicas para APIs.

```mermaid
graph TD
    Client["📱 Cliente Móvil / Web"] -->|1. Request (HTTPS)| Gateway
    
    subgraph APIGateway ["🛡️ API Gateway Seguro"]
        style APIGateway fill:#fff3e0,stroke:#f57c00,stroke-width:2px
        
        RateLimit["⏱️ Rate Limiter\n(Frena Brute Force)"]
        AuthCheck["🔑 Auth Guard\n(Valida JWT)"]
        InputVal["✅ Input Validator\n(Limpia XSS/SQLi)"]
        
        Gateway["🚪 Entrada Gateway"] --> RateLimit
        RateLimit --> AuthCheck
        AuthCheck --> InputVal
    end
    
    InputVal -->|2. Request Limpia| Microservices
    
    subgraph Backend ["🏭 Microservicios"]
        ServiceA["💰 Servicio Pagos"]
        ServiceB["👤 Servicio Usuarios"]
    end

    linkStyle 0 stroke-width:2px;
```

## 3. Ecosistema Futuro (Capítulo 5 / Epílogo)
Mapa mental de la expansión de la ciberseguridad a otros sectores.

```mermaid
mindmap
  root((CyberSentinel Ecosystem))
    (🛡️ Ciberseguridad Defensiva)
      [SOC Automatizado]
      [Threat Hunting con IA]
      [Zero Trust Architecture]
    (🏭 Infraestructura Crítica)
      [SCADA / OT Security]
      [Protección de Power Grids]
      [Robótica Industrial]
    (🏥 Salud Digital)
      [Privacidad de Datos Pacientes]
      [Seguridad en Dispositivos Médicos]
    (🚀 Sector Aeroespacial)
      [Seguridad Satelital]
      [Comunicaciones Cuánticas]
```
