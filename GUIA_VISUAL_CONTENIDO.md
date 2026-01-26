# Guía Visual de Diagramas: CyberSentinel-AI Academy

## Convenciones de Color
*   **Verde:** Flujo Normal / Tráfico Legítimo / Sistemas Seguros.
*   **Rojo:** Vector de Ataque / Tráfico Malicioso / Vulnerabilidad.
*   **Azul:** Defensa Activa / Mitigación / Contramedida.

---

## Capítulo 1: Fundamentos (Escenario Banco)

### Diagrama 1.1: Modelo de Amenazas STRIDE
**(Aquí iría el diagrama visual mostrando a 'Spoofina' vs el Banco)**

**Flujo de Ataque (Rojo):**
1.  **Spoofing:** Atacante falsifica identidad del usuario.
2.  **Tampering:** Modificación de datos en tránsito.
3.  **Elevation:** Escalada de privilegios a Admin.

**Defensa (Azul):**
*   MFA (Autenticación Multifactor).
*   Firmas digitales y Hashing.

---

## Capítulo 2: Arquitectura Segura

### Diagrama 2.1: El Bastión Digital (Firewall)
**(Diagrama mostrando el filtrado de paquetes)**

**Flujo Normal (Verde):**
*   Usuario -> Puerto 443 (HTTPS) -> Servidor Web.

**Flujo Bloqueado (Rojo/Azul):**
*   Atacante -> Puerto 22 (SSH) -> [X] Firewall (DROP).

---

## Capítulo 3: Seguridad Moderna con IA

### Diagrama 3.1: Detección ML vs Reglas
**(Diagrama comparativo de lógica de detección)**

**Flujo de Detección Moderna:**
1.  **Logs entrantes:** Datos crudos del sistema.
2.  **Reglas (Firma):** ¿Es conocido? -> Alerta Rápida.
3.  **ML (Comportamiento):** ¿Es anómalo? -> Análisis Profundo.
4.  **Clasificación:** Normal / Sospechoso / Malicioso.

**Ventajas:**
*   Detecta 0-days (desconocidos).
*   Reduce falsos positivos drásticamente.

---

## Capítulo 4: IA Ofensiva

### Diagrama 4.1: Ciclo de Ataque con LLMs
**(Diagrama de flujo de generación de payloads)**

1.  **Prompt:** "Genera script de prueba para SQLi".
2.  **LLM:** Genera código Python.
3.  **Validación:** El humano verifica el código.
4.  **Ejecución:** Lanzamiento controlado en entorno de pruebas.

---

## Capítulo 5: Operaciones (SCADA)

### Diagrama 5.1: Defensa de Infraestructura Crítica
**(Diagrama de red IT vs OT)**

**Zona IT (Oficina):** Conectada a Internet.
**Zona DMZ Industrial:** Servidores Historian.
**Zona OT (Planta):** PLCs y Turbinas (AISLADA).

**Defensa (Azul):**
*   Diodo de Datos (Solo permite tráfico de salida).
*   IPS Industrial (Monitorización de protocolo Modbus).

---

## Capítulo 6: Respuesta a Incidentes (DFIR)

### Diagrama 6.1: Ciclo de Vida del Incidente (NIST)
**(Diagrama circular del proceso)**

1.  **Preparación:** Backups y Herramientas listas.
2.  **Detección:** Alerta del SIEM.
3.  **Contención:** Aislar el host infectado.
4.  **Erradicación:** Limpiar el malware.
5.  **Recuperación:** Restaurar servicio.
6.  **Lecciones Aprendidas:** Mejorar el proceso.
