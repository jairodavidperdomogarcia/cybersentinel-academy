# LABORATORIO 01: CONFIGURACIÓN DE ENTORNO SEGURO

**Objetivo:** Configurar un entorno funcional con Kali Linux (Atacante) y Windows 10 (Víctima) conectados en red segura.

## 📦 HERRAMIENTAS NECESARIAS

> **🛑 PARADA OBLIGATORIA:**

<details>
<summary><strong>📸 (Clic aquí) Ver GUÍA VISUAL PASO A PASO para descargar y editar plantillas</strong></summary>

Si eres nuevo, sigue estos pasos visuales para descargar archivos `.md` y editarlos:

1.  **Descargar:** Haz clic derecho en el enlace del archivo (plantilla) y selecciona "Guardar enlace como...".
    ![Paso 1: Guardar como](../WEB_PLATFORM/assets/img/guias/guia_paso1_guardar.png)
2.  **Abrir:** Ve a tu carpeta de descargas, clic derecho en el archivo `.md` > Abrir con > Bloc de notas (o VS Code).
    ![Paso 2: Abrir con](../WEB_PLATFORM/assets/img/guias/guia_paso2_abrir.png)
3.  **Editar:** Rellena los datos entre corchetes y guarda el archivo.
    ![Paso 3: Editar](../WEB_PLATFORM/assets/img/guias/guia_paso3_editor.png)
4.  **Visualizar:** Así se ve el archivo en el editor, listo para trabajar.
    ![Paso 4: Editor](../WEB_PLATFORM/assets/img/guias/guia_paso4_editor.png)

</details>

### 1. VirtualBox (Hipervisor)
*   **Propósito:** Ejecutar máquinas virtuales aisladas.
*   **Versión:** 7.0.x o superior.

### 2. Kali Linux (Sistema de pruebas)
*   **Propósito:** Distribución especializada para ciberseguridad.
*   **Opción recomendada:** "Kali Linux VirtualBox Images".

### 3. Windows 10 Vulnerable (Máquina víctima)
*   **Propósito:** Entorno seguro para practicar.
*   **Alternativa:** Metasploitable (Linux vulnerable).

---

## ⚠️ ADVERTENCIAS CRÍTICAS

1.  **Solo descargas oficiales:** Nunca descargues ISOs de Kali desde torrents o sitios no oficiales.
2.  **Verifica hashes:** Compara el SHA256 después de descargar (instrucciones en la sección de Recursos).
3.  **Conexión segura:** Asegúrate de estar en HTTPS.

---

## Parte A: Instalación y Configuración

### 1. VirtualBox y Extension Pack
1.  Instala VirtualBox y el Extension Pack siguiendo las instrucciones oficiales.

### 2. Máquina Atacante (Kali Linux)
1.  Importa la imagen `.ova` o `.vbox` descargada en VirtualBox (Archivo > Importar).
2.  **Configuración de Red:** Ve a Configuración > Red. Asegúrate de que esté en **"Red NAT"** (si no existe, crea una en Archivo > Herramientas > Network Manager > Redes NAT).
3.  Inicia la máquina (usuario/pass: `kali`/`kali`).
4.  Actualiza repositorios: `sudo apt update`.

### 3. Máquina Víctima (Windows 10)
1.  Crea una nueva VM en VirtualBox para Windows 10.
2.  Instala usando la ISO descargada.
3.  **Configuración de Red:** Ponla en la misma **"Red NAT"** que Kali.
4.  **Desactivar Defensas (SOLO EN ENTORNO DE PRUEBAS):**
    *   Desactiva Windows Defender Real-time protection.
    *   Desactiva Firewall de Windows (Público y Privado).

---

## Parte B: Conectividad y Pruebas Básicas

### 1. Verificar Direcciones IP
*   En Kali, abre una terminal y escribe: `ip addr` (busca la interfaz `eth0`). Anota tu IP.
*   En Windows, abre CMD y escribe: `ipconfig`. Anota tu IP.

### 2. Prueba de Ping
*   Desde Kali, haz ping a Windows: `ping <IP_WINDOWS>`
*   Desde Windows, haz ping a Kali: `ping <IP_KALI>`

### 3. Snapshot Base (¡Importante!)
*   Apaga ambas máquinas.
*   Toma un **Snapshot** llamado "Instalación Limpia" en cada una. Esto es tu botón de "deshacer".

---

## 🔄 ¿Y SI LOS ENLACES FALLAN?
1.  **Primero:** Verifica que escribiste bien la URL.
2.  **Segundo:** Busca "Kali Linux download" en Google.
3.  **Tercero:** Revisa la sección de **Recursos** actualizada en este manual.

---

## 📝 ENTREGABLE: INFORME DEL LABORATORIO (Plantilla)

Descarga la **Plantilla Informe Lab 01** desde el Command Center (archivo `.md`) y ábrela en un editor de texto (Bloc de notas o VS Code).

```markdown
# Informe del Laboratorio 01
**Cadete:** [Tu Nombre o Alias]
**Fecha:** [Fecha de realización]

### 1. Verificación de Integridad
*   **Resultado de Verificación Hash de Kali:** [✅ EXITOSA / ❌ FALLIDA]
    *   *(Si falló, describe la acción tomada)*:

### 2. Configuración de Red
*   **IP de Kali (Atacante):** [Ej: 10.0.2.15]
*   **IP de Windows (Víctima):** [Ej: 10.0.2.16]
*   **Resultado del Ping (Kali -> Víctima):** [✅ Éxito / ❌ Fracaso]

### 3. Persistencia
*   **Snapshot Creados:** [Nombres de los snapshots, ej: "Base Kali - 2025-10-27"]

### 4. Bitácora de Errores
*   **Problemas Encontrados y Soluciones:**
    *   [Describe cualquier error y cómo lo resolviste. Ej: "El modo de red NAT no funcionaba, cambié a una Red NAT personalizada y funcionó."]
```

<a id="guia_visual_plantillas"></a>

