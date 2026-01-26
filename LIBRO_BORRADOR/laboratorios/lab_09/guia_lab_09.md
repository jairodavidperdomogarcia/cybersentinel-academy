# 🔬 Laboratorio 09: Proyecto Inmune (Hardening Linux)

> **Misión:** Transformar un servidor Linux vulnerable en una fortaleza digital mediante hardening sistemático y automatización.
> **Herramientas:** Lynis, UFW, SSH, Bash/Ansible.
> **Tiempo estimado:** 60 minutos.

---

## 1. Escenario Táctico: El Servidor Olvidado

Acabas de heredar la administración de un servidor Ubuntu (`192.168.1.100`) que alojaba una aplicación antigua de MediTech.
El equipo de desarrollo anterior tenía malas prácticas:
*   Usuario `root` habilitado para SSH.
*   Sin firewall.
*   Servicios innecesarios corriendo "por si acaso".

Tu misión es aplicar el protocolo de **Inmunización Digital** antes de que este servidor sea expuesto a internet.

---

## 2. Preparación del Entorno

Necesitarás:
1.  **Víctima:** Una VM Ubuntu Server (o Desktop) recién instalada.
2.  **Atacante:** Tu VM Kali Linux.
3.  **Red:** Ambas en modo "Red Interna" o "NAT Network" para verse entre ellas.

---

## 3. Fase A: Línea de Base (¿Qué tan mal estamos?)

Antes de tocar nada, mide la inseguridad actual.

**Desde Kali Linux (Atacante):**
Escanea tu objetivo para ver la superficie de ataque externa. Si vienes del **Lab 08**, puedes reutilizar tu máquina de detección (Snort/Suricata) para observar qué cambia en los logs cuando apliques hardening.

```bash
# Reemplaza <IP_VICTIMA> con la IP real del Ubuntu
nmap -sS -sV -O -T4 <IP_VICTIMA>
```

**Desde Ubuntu (Víctima):**
Ejecuta una auditoría interna con Lynis.

```bash
sudo apt update && sudo apt install -y lynis
sudo lynis audit system --quick
# Guarda el índice de hardening (Hardening Index) que aparece al final
```

> **📝 Nota:** Anota el número de puertos abiertos y el índice de hardening inicial.

---

## 4. Fase B: Hardening Manual (Nivel 1)

Aplica los controles críticos manualmente para entender qué hacen.

### 1. Gestión de Identidad
*   Cambia la contraseña de root (si no la sabes): `sudo passwd root`
*   Crea un usuario administrador personal si no tienes uno.

### 2. Muralla de Fuego (Firewall)
Habilita UFW y cierra todo por defecto.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh  # ¡Importante para no bloquearte!
sudo ufw enable
```

### 3. Blindaje SSH
Edita `/etc/ssh/sshd_config`:
*   Cambia `PermitRootLogin yes` a `PermitRootLogin no`.
*   Asegúrate de que `Protocol 2` esté activo (por defecto en versiones modernas).

Reinicia el servicio:
```bash
sudo systemctl restart sshd
```

### 4. Limpieza de Servicios
Identifica servicios innecesarios (ej. `cups`, `avahi-daemon`) y apágalos.

```bash
sudo systemctl stop avahi-daemon
sudo systemctl disable avahi-daemon
```

---

## 5. Fase C: Prueba de Resistencia

Vuelve a Kali Linux y ataca tu propia obra.

1.  **Re-escaneo Nmap:** ¿Han desaparecido los puertos innecesarios?
2.  **Ataque SSH:** Intenta loguearte como root.
    ```bash
    ssh root@<IP_VICTIMA>
    ```
    *Debería rechazarte inmediatamente (Permission denied).*

---

## 6. Fase D: Automatización (El Poder de Escalar)

El hardening manual es lento y propenso a errores. Tu tarea final es crear un script que haga esto por ti.

Crea un archivo `hardening.sh` en la VM Ubuntu:

```bash
#!/bin/bash
echo "[+] Iniciando Protocolo de Inmunización..."

# 1. Firewall
echo "[+] Configurando UFW..."
ufw --force reset
ufw default deny incoming
ufw allow ssh
ufw --force enable

# 2. SSH Hardening
echo "[+] Blindando SSH..."
sed -i 's/PermitRootLogin yes/PermitRootLogin no/g' /etc/ssh/sshd_config
# Agrega más comandos sed para otros parámetros si te atreves

# 3. Reiniciar servicios
systemctl restart sshd

echo "[+] Hardening Completado. Verificando estado..."
ufw status verbose
```

Ejecuta tu script (`sudo bash hardening.sh`) y verifica que todo siga funcionando.

---

## 📝 Entregable

Genera un informe breve (`informe_lab09.md`) con:
1.  **Evidencia "Antes":** Captura del Hardening Index de Lynis inicial.
2.  **Evidencia "Después":** Captura del Hardening Index final tras aplicar tus cambios.
3.  **Código:** Copia de tu script `hardening.sh`.
4.  **Reflexión:** ¿Qué control te pareció más crítico y por qué?

---

## 📊 Autoevaluación

<div class="tracker-container" data-chapter-id="09" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Auditoría (Lynis):</strong> Sé medir el estado de seguridad de un sistema Linux.</td>
        <td>
          <span class="tracker-option" data-row="lynis" data-val="1">1</span>
          <span class="tracker-option" data-row="lynis" data-val="2">2</span>
          <span class="tracker-option" data-row="lynis" data-val="3">3</span>
          <span class="tracker-option" data-row="lynis" data-val="4">4</span>
          <span class="tracker-option" data-row="lynis" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Hardening Sistema:</strong> Puedo configurar UFW y SSH para reducir la superficie de ataque.</td>
        <td>
          <span class="tracker-option" data-row="sys_hardening" data-val="1">1</span>
          <span class="tracker-option" data-row="sys_hardening" data-val="2">2</span>
          <span class="tracker-option" data-row="sys_hardening" data-val="3">3</span>
          <span class="tracker-option" data-row="sys_hardening" data-val="4">4</span>
          <span class="tracker-option" data-row="sys_hardening" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Automatización:</strong> Entiendo cómo convertir comandos manuales en un script Bash reproducible.</td>
        <td>
          <span class="tracker-option" data-row="automation" data-val="1">1</span>
          <span class="tracker-option" data-row="automation" data-val="2">2</span>
          <span class="tracker-option" data-row="automation" data-val="3">3</span>
          <span class="tracker-option" data-row="automation" data-val="4">4</span>
          <span class="tracker-option" data-row="automation" data-val="5">5</span>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 10</span>
  </div>
</div>