# Diagrama de Flujo: Reglas vs Comportamiento

Este diagrama visualiza la lógica implementada en `lab01_behavior_vs_rules.py`, mostrando cómo un atacante inteligente puede evadir reglas estáticas pero es detectado por análisis de comportamiento.

```mermaid
flowchart TD
    subgraph INPUT [Entrada de Tráfico]
        User[Usuario/Atacante] -->|IP, N° Intentos| Router{Distribuidor}
    end

    subgraph CLASSIC [Firewall Clásico - Reglas Estáticas]
        Router -->|Ruta A| RuleIP{¿IP en Blacklist?}
        RuleIP -- Sí --> Block1[BLOQUEADO: IP Prohibida]
        RuleIP -- No --> RuleRate{¿Intentos > 5?}
        RuleRate -- Sí --> Block2[BLOQUEADO: Rate Limit]
        RuleRate -- No --> Allow[PERMITIDO]
    end

    subgraph MODERN [Detector IA - Comportamiento]
        Router -->|Ruta B| Model[Modelo de Aprendizaje]
        Model -->|Datos Históricos| Context[Promedio Normal: 2 intentos]
        Context --> Check{¿Desviación > 2.0?}
        Check -- Sí --> Alert[ALERTA IA: Comportamiento Anómalo]
        Check -- No --> Normal[Comportamiento Normal]
    end

    subgraph SCENARIO [Caso 3: Atacante Inteligente]
        Smart[Atacante: 5 intentos] -.->|Evasión| RuleRate
        Smart -.->|Detección| Check
        Note1[Sabe que el límite es >5,\nasí que hace exactamente 5] --- Smart
        Note2[Aunque 5 está 'permitido',\nes 2.5 veces lo normal] --- Check
    end

    style Block1 fill:#f96,stroke:#333,stroke-width:2px
    style Block2 fill:#f96,stroke:#333,stroke-width:2px
    style Allow fill:#9f9,stroke:#333,stroke-width:2px
    style Alert fill:#f00,color:#fff,stroke:#333,stroke-width:4px
    style Normal fill:#9f9,stroke:#333,stroke-width:2px
```

## Leyenda de Componentes

### 🚦 INPUT (Entrada)
*   **Usuario/Atacante:** La fuente del tráfico. Puede ser legítimo o malicioso.
*   **Router:** Simula el punto que recibe la petición y la envía a los dos sistemas de análisis simultáneamente.

### 🧱 CLASSIC (Firewall Clásico)
*   **Lógica:** Basada en reglas fijas ("IF/ELSE").
*   **RuleIP (Blacklist):** Lista negra de IPs prohibidas conocidas.
*   **RuleRate (Límite):** Regla simple que bloquea si hay más de 5 intentos.
*   **Debilidad:** Si el atacante conoce la regla (hace 5 intentos), pasa desapercibido.

### 🧠 MODERN (Detector IA)
*   **Lógica:** Basada en estadística y contexto.
*   **Modelo de Aprendizaje:** No tiene reglas fijas, aprende lo que es "normal" (2 intentos).
*   **Desviación:** Calcula qué tan lejos de lo normal está el tráfico actual.
*   **Fortaleza:** Detecta que 5 intentos es anómalo (250% más de lo normal), aunque sea un número pequeño.

### 🎭 SCENARIO (Caso de Uso)
*   **Atacante Inteligente:** Un actor que conoce las reglas del Firewall Clásico y ajusta su ataque para evadirlas, pero no puede esconder su "comportamiento" anómalo ante la IA.
