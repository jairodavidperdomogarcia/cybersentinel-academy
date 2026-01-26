# Capítulo 01: Configuración de Tu Laboratorio Ético

## 1.1 Por qué necesitas un laboratorio (y no "practicar" en sistemas reales)

La regla de oro de la ciberseguridad ética es: **Nunca ataques un sistema que no te pertenece o para el cual no tienes permiso explícito y por escrito.**

Practicar en "la vida real" (tu web del trabajo, el Wi-Fi del vecino) es ilegal y poco ético. Además, es peligroso. Un escaneo mal configurado puede tirar abajo un servidor de producción.

Un **Laboratorio de Hacking Ético** es tu simulador de vuelo. Es un entorno controlado, aislado y seguro donde puedes detonar malware, lanzar exploits y romper cosas sin consecuencias legales ni operativas. Aquí es donde te conviertes en experto.

## 1.2 Opciones de virtualización: VirtualBox vs VMware vs Hyper-V

Para crear tu laboratorio, no necesitas 10 computadoras físicas. Usaremos **virtualización**: correr sistemas operativos "invitados" (Guest) dentro de tu sistema principal (Host).

| Hipervisor | Pros | Contras | Recomendación |
| :--- | :--- | :--- | :--- |
| **VirtualBox** | Gratuito, Open Source, muy popular. | Rendimiento moderado, a veces inestable con gráficos. | **Ideal para empezar.** |
| **VMware Workstation Player/Pro** | Rendimiento superior, mejor integración de red. | La versión Pro es de pago (aunque hay licencias gratuitas para uso personal). | **Estándar profesional.** |
| **Hyper-V** | Nativo en Windows Pro/Enterprise, muy rápido. | Conflictivo con otros hipervisores, configuración de red más compleja para hacking. | Evitar para este curso si es posible. |

**Nuestra elección:** Usaremos **VirtualBox** por ser universal y gratuito, pero los conceptos aplican igual a VMware.

## 1.3 Instalación paso a paso de Kali Linux

Kali Linux es la distribución estándar de facto para pentesting. Viene con miles de herramientas preinstaladas.

**Pasos clave:**
1.  **Descargar:** Ve a [kali.org/get-kali](https://www.kali.org/get-kali/) y baja la "Virtual Machine Image" (pre-configurada) para VirtualBox. Es más fácil que instalar desde cero (ISO).
2.  **Importar:** En VirtualBox, usa "Archivo > Importar servicio virtualizado" y selecciona el archivo `.ova` o `.vbox` descargado.
3.  **Ajustes:**
    *   **RAM:** Asigna al menos 4GB (si tienes 8GB+ en tu PC) o 2GB (mínimo).
    *   **CPU:** 2 núcleos.
4.  **Iniciar:** Usuario/Pass por defecto suele ser `kali` / `kali`.

## 1.4 Configuración de red segura (modos NAT, Host-Only, Bridged)

Entender las redes virtuales es vital para que tus máquinas se vean entre sí pero no expongan tu PC real.

*   **NAT (Network Address Translation):** La VM sale a internet a través de tu PC. Tu PC no ve a la VM fácilmente. *Útil para descargar actualizaciones.*
*   **Bridged (Adaptador Puente):** La VM se conecta a tu router como si fuera un dispositivo físico más. Recibe IP de tu router. *Peligroso si tienes malware en la VM, ya que está en tu red doméstica.*
*   **Host-Only (Solo Anfitrión) / Red NAT:** Crea una red privada virtual donde solo están tu PC y las VMs. *Es el modo más seguro para laboratorios de ataque.*

**Configuración recomendada:**
Usaremos una **Red NAT** (NAT Network) en VirtualBox. Esto permite que las VMs tengan internet y se vean entre ellas, pero estén detrás de un NAT virtual.

## 1.5 Las 10 herramientas esenciales que instalarás primero

Aunque Kali trae todo, siempre querrás tener esto actualizado o a mano:

1.  **Terminator:** Terminal con esteroides (divide pantallas). `sudo apt install terminator`
2.  **VS Code:** Editor de código.
3.  **Git:** Para clonar repositorios.
4.  **Python 3 & Pip:** Lenguaje base para scripts.
5.  **Burp Suite Community:** Proxy para web hacking (ya viene, asegúrate de que funcione).
6.  **Metasploit Framework:** Framework de explotación.
7.  **Nmap:** Escáner de redes.
8.  **Wireshark:** Analizador de tráfico.
9.  **Netcat (nc):** La navaja suiza de redes.
10. **Seclists:** Diccionarios para fuerza bruta. `sudo apt install seclists`

## 1.6 Creación de máquinas víctimas (Windows 10 vulnerable, Metasploitable)

Un hacker necesita un objetivo.

**A. Metasploitable 2/3:**
Es una máquina Linux intencionalmente vulnerable.
*   Descarga la imagen de SourceForge.
*   Impórtala en VirtualBox.
*   **Advertencia:** NUNCA la pongas en modo "Bridged" o con acceso directo a internet.

**B. Windows 10 "Víctima":**
*   Descarga una ISO oficial de Windows 10 (Consulta la sección **Recursos** para el enlace oficial del Centro de Evaluación).
*   Instálala en una nueva VM.
*   Desactiva Windows Defender y Firewall (solo para propósitos de este laboratorio, para simular un entorno sin parches o probar evasión).

## 1.7 Snapshots y backups: Tu botón de "deshacer"

Antes de lanzar un ataque destructivo o instalar algo riesgoso: **TOMA UN SNAPSHOT.**

*   **Snapshot:** Guarda el estado exacto de la máquina (memoria y disco). Si rompes el sistema, restauras el snapshot en segundos.
*   **Regla:** Toma un snapshot "Base Limpia" justo después de instalar y configurar todo.

## 1.8 Buenas prácticas y consideraciones legales

1.  **Aislamiento:** Mantén tu laboratorio separado de tus datos personales.
2.  **Actualizaciones:** Mantén tu Kali actualizado (`sudo apt update && sudo apt full-upgrade -y`), pero congela tus máquinas víctimas.
3.  **Legalidad:** Las herramientas de hacking son de "doble uso". Tenerlas es legal; usarlas contra terceros sin permiso es delito.
4.8.  **Ética:** Reporta vulnerabilidades responsablemente si las encuentras por accidente en sistemas reales.

---

<div class="tracker-container" data-chapter-id="cap01">
  <div class="tracker-header">
    <h2>🛡️ CyberSentinel Tracker: Capítulo 01</h2>
    <p>Autoevaluación de Competencias de Laboratorio</p>
  </div>
  
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia / Concepto</th>
        <th>Estado (Click para cambiar)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Virtualización: Host vs Guest</td>
        <td class="tracker-cell" data-status="empty">
          <span class="status-icon">⚪</span>
          <span class="status-text">Pendiente</span>
        </td>
      </tr>
      <tr>
        <td>Redes: NAT vs Bridged vs Host-Only</td>
        <td class="tracker-cell" data-status="empty">
          <span class="status-icon">⚪</span>
          <span class="status-text">Pendiente</span>
        </td>
      </tr>
      <tr>
        <td>Gestión de Snapshots (Backup/Restore)</td>
        <td class="tracker-cell" data-status="empty">
          <span class="status-icon">⚪</span>
          <span class="status-text">Pendiente</span>
        </td>
      </tr>
      <tr>
        <td>Manejo Seguro de Malware (Sandboxing)</td>
        <td class="tracker-cell" data-status="empty">
          <span class="status-icon">⚪</span>
          <span class="status-text">Pendiente</span>
        </td>
      </tr>
      <tr>
        <td>Comandos Básicos de Kali Linux</td>
        <td class="tracker-cell" data-status="empty">
          <span class="status-icon">⚪</span>
          <span class="status-text">Pendiente</span>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 10</span>
  </div>
  
  <div class="tracker-feedback">
    Selecciona tu nivel de confianza en cada competencia.
  </div>
</div>

{{INSERTAR_LABORATORIO:lab_01}}
