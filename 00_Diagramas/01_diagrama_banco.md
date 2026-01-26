# Diagrama de Amenazas: El Banco Digital

Este diagrama visualiza el escenario de Threat Modeling descrito en `01_Fundamentos/01_Escenario_Banco.md`.
Muestra el "Camino Feliz" (Happy Path) en verde y los vectores de ataque identificados en rojo.

```mermaid
flowchart TD
    subgraph ACTORS [Actores]
        Alice[Cliente (Alice)]
        Attacker[Atacante]
    end

    subgraph SYSTEM [Sistema Bancario]
        App[App Móvil]
        API[API Gateway]
        DB[(Base de Datos)]
    end

    %% Happy Path
    Alice -->|1. Login & Transferir $50| App
    App -->|2. POST /transfer| API
    API -->|3. Validar Saldo| DB
    DB -->|4. OK| API
    API -->|5. Ejecutar| DB
    
    %% Threat Vectors
    Attacker -.->|A. Spoofing (Robo de Identidad)| App
    Attacker -.->|C. Info Disclosure (Enumeración)| API
    
    Attacker -.->|B. Tampering (Interceptar)| ManInMiddle{Red Insegura}
    App --> ManInMiddle
    ManInMiddle -.->|Modificar: $1000| API
    
    Attacker -.->|E. Elevation (Monto negativo)| API
    Attacker -.->|D. DoS (1M peticiones)| API

    %% Styling
    linkStyle 0,1,2,3,4 stroke:#0f0,stroke-width:2px,color:green;
    style Alice fill:#cfc,stroke:#333
    style Attacker fill:#f99,stroke:#333
    style ManInMiddle fill:#f96,stroke:#333
```

## Leyenda de Componentes

A continuación se detalla la función de cada módulo representado en el diagrama:

### 🎭 ACTORS (Actores)
*   **Alice (Cliente):** Representa al usuario legítimo que intenta realizar una operación válida (enviar $50). Su camino está marcado en verde.
*   **Attacker (Atacante):** El adversario que intenta romper el sistema. Sus acciones están marcadas con líneas punteadas rojas.

### 🏦 SYSTEM (Sistema Bancario)
*   **App Móvil:** La interfaz del cliente. Es el primer punto de contacto y vulnerable a robos físicos o clonación (Spoofing).
*   **API Gateway:** La "puerta de entrada" al servidor del banco. Es donde ocurren la mayoría de los ataques lógicos (DoS, Inyección de datos falsos).
*   **Base de Datos (DB):** El corazón del sistema donde se guarda el dinero. Si el atacante llega aquí sin validación, el juego termina.

### 🕸️ VECTORES DE ATAQUE (Interacciones)
*   **ManInMiddle (Red Insegura):** Un punto intermedio (ej. WiFi público) donde el atacante intercepta la comunicación entre la App y la API para modificar los datos (Tampering).
*   **Spoofing:** Hacerse pasar por Alice.
*   **Elevation:** Intentar enviar saldos negativos para ganar dinero.
