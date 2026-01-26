# Fundamentos: Vectores de Ataque a la Identidad

> **"La contraseña es la llave del reino. Si la obtienes, no necesitas romper la muralla; entras por la puerta principal."**

En este documento detallamos las técnicas utilizadas por los atacantes para apoderarse de las credenciales y la identidad de los usuarios, tal como lo simulamos en el **Lab 02**.

## 1. Phishing (Ingeniería Social)
Es el arte del engaño psicológico. No se ataca al software, se ataca al humano.

*   **Mecanismo:** El atacante envía un correo electrónico o SMS (*Smishing*) que aparenta ser legítimo (del banco, de Netflix, de tu jefe).
*   **El Gancho:** "Su cuenta ha sido bloqueada. Haga clic aquí para reactivarla."
*   **La Trampa:** El enlace lleva a una web clonada (ej: `banco-seguro-login.com` en vez de `banco.com`). El usuario introduce sus datos y el atacante los captura.
*   **Herramientas:** GoPhish, Social Engineering Toolkit (SET).

## 2. Session Hijacking (Robo de Sesión)
Si el usuario ya se autenticó, el servidor le da un "pase temporal" (Cookie o Token JWT) para que no tenga que poner la contraseña en cada clic.

*   **Mecanismo:** El atacante roba ese "pase".
*   **Vectores:**
    *   **XSS (Cross-Site Scripting):** Inyectar un script malicioso en la web que envía las cookies del usuario al atacante.
    *   **Man-in-the-Middle:** Interceptar el tráfico en una red Wi-Fi pública no segura (si no se usa HTTPS).
*   **Resultado:** El atacante entra a la cuenta sin saber la contraseña.

## 3. Credential Stuffing / Fuerza Bruta
Es el método automatizado que simulamos en nuestro script `lab02_credential_stuffing.py`.

*   **Credential Stuffing:**
    *   Los usuarios suelen reutilizar la misma contraseña en muchos sitios.
    *   El atacante toma una base de datos filtrada de un sitio inseguro (ej: un foro de juegos hackeado hace años) y prueba esos mismos correos y contraseñas en el sitio del Banco.
*   **Fuerza Bruta (Diccionario):**
    *   Probar las contraseñas más comunes del mundo (`123456`, `password`, `admin`).
*   **Herramientas:** Hydra, Burp Suite Intruder, Medusa.

---

## 🛡️ Contramedidas (Defensa)

| Ataque | Defensa Técnica | Defensa Humana |
| :--- | :--- | :--- |
| **Phishing** | Filtros de correo SPF/DKIM/DMARC. | Educación y concienciación. |
| **Session Hijacking** | Cookies `HttpOnly` y `Secure`. HTTPS obligatorio. | No usar Wi-Fi público sin VPN. |
| **Fuerza Bruta** | **Rate Limiting** (bloquear tras 5 intentos). MFA (2FA). | Contraseñas largas y únicas. |
