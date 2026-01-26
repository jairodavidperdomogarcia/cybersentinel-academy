# Módulo 01: Fundamentos - Thinking Like a Hacker
## Escenario 1: El Banco Digital (Threat Modeling)

> **"No puedes defender lo que no entiendes. No puedes entender lo que no puedes romper mentalmente."**

### 1. El Contexto (The Story)
Eres el CISO (Chief Information Security Officer) de "NeoBank", un banco 100% digital.
Acaban de lanzar una nueva **funcionalidad de "Transferencias Rápidas"** que permite enviar dinero solo con el número de teléfono, sin necesidad de IBAN, para mejorar la UX (Experiencia de Usuario).

**Cómo funciona (Happy Path):**
1.  Alice pone el teléfono de Bob.
2.  La App busca si Bob es cliente.
3.  Alice pone el monto (max $500).
4.  El sistema transfiere el dinero.

### 2. Tu Misión: Romper el Diseño (Red Teaming Mental)
Antes de escribir una sola línea de código de defensa, debemos encontrar los fallos lógicos.
Usa el modelo **STRIDE** (simplificado) para identificar amenazas.

#### A. Spoofing (Suplantación de Identidad)
*   **Pregunta:** ¿Puedo fingir ser Alice?
*   **Ataque:** Si robo el teléfono de Alice (o clono su SIM), ¿puedo vaciar su cuenta?
*   **Defensa requerida:** 2FA (Segundo Factor) o Biometría antes de enviar.

#### B. Tampering (Manipulación de Datos)
*   **Pregunta:** ¿Puedo cambiar el monto en viaje?
*   **Ataque:** Alice envía $10. Intercepto la petición y cambio el valor a $1000.
*   **Defensa requerida:** Firma digital de la transacción en el dispositivo.

#### C. Information Disclosure (Fuga de Información)
*   **Pregunta:** ¿Puedo saber quién es cliente del banco?
*   **Ataque:** Escribo números al azar en la función "Buscar por teléfono". Si el banco responde "Usuario encontrado: Bob Smith", acabo de crear una base de datos de clientes para hacer Phishing.
*   **Defensa requerida:** Respuestas genéricas o Rate Limiting estricto en la búsqueda.

#### D. Denial of Service (Denegación de Servicio)
*   **Pregunta:** ¿Puedo quebrar el sistema?
*   **Ataque:** Un bot envía 1 millón de solicitudes de transferencia de $0.01 simultáneas.
*   **Defensa requerida:** WAF (Web Application Firewall) y Rate Limiting por dispositivo/IP.

#### E. Elevation of Privilege (Elevación de Privilegios)
*   **Pregunta:** ¿Puedo transferir dinero que no tengo?
*   **Ataque:** Modifico la petición para enviar $-500$ (negativo). Si el sistema resta $(-500)$, en realidad suma dinero a mi cuenta.
*   **Defensa requerida:** Validación estricta de tipos y rangos en el Backend.

---

### 3. Ejercicio Práctico (Mental)
Imagina que eres el atacante. Has descubierto que la API de "Transferencias Rápidas" tiene este endpoint:
`POST /api/transfer { "to_phone": "555-0199", "amount": 50 }`

**Desafío:**
¿Qué pasa si envías este JSON modificado?
`POST /api/transfer { "to_phone": "555-0199", "amount": 50, "currency": "BTC" }`

*   **Hipótesis:** El sistema por defecto usa USD, pero si el desarrollador dejó habilitada una librería de conversión de monedas antigua... podrías estar transfiriendo Bitcoin a precio de Dólar.
*   **Lección:** Nunca confíes en que el usuario enviará solo los campos que tú diseñaste.

### 4. Conclusión del Módulo
La seguridad no es solo poner un firewall. Es **diseñar el sistema asumiendo que el usuario intentará engañarlo**.
*   **Regla de Oro:** "All input is evil" (Toda entrada es malvada hasta que se demuestre lo contrario).
