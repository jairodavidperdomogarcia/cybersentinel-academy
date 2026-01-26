# 🔬 Laboratorio 08: El Francotirador de Paquetes (IDS/Snort)

> **Misión:** Configurar un IDS Snort para detectar un ataque de fuerza bruta SSH sin bloquear a los administradores legítimos.
> **Herramienta:** Snort, Script `validator_ids.sh`
> **Tiempo estimado:** 30 minutos

---

## 1. Escenario Táctico
Eres el analista de guardia en el SOC de TechCorp. Un servidor crítico (`192.168.1.50`) está comportándose extraño. Sospechas que alguien está intentando adivinar la contraseña de SSH.

Tu jefe te pide:
1.  Crear una regla de Snort para detectar intentos fallidos de SSH.
2.  Asegurarte de que la regla NO alerte cuando el administrador legítimo (`10.0.0.5`) se conecta.
3.  Validar tu regla con el **Entrenador Crítico** antes de ponerla en producción.

---

## 2. Preparación del Entorno (Kali Linux)

Primero, asegúrate de tener Snort instalado (en modo simulación para este lab).

```bash
# Si no tienes snort instalado:
sudo apt-get update
sudo apt-get install snort -y
```

Vamos a crear un directorio de trabajo para no afectar la configuración real del sistema:

```bash
mkdir -p ~/lab08_ids
cd ~/lab08_ids
touch local.rules
```

---

## 3. Análisis del Tráfico
Un ataque de fuerza bruta SSH se ve como muchas conexiones TCP al puerto 22 en poco tiempo.
Sin embargo, una regla simple como `alert tcp any any -> any 22` generaría millones de alertas por tráfico normal.

**Objetivo de la Regla:**
*   **Protocolo:** TCP
*   **Puerto Destino:** 22 (SSH)
*   **Contenido:** Intentar detectar el handshake o simplemente el volumen de tráfico (en un escenario real usaríamos `threshold`, pero hoy nos centraremos en la sintaxis básica y filtrado de IPs).
*   **Excepción:** No alertar si el origen es `10.0.0.5`.

---

## 4. Desarrollo de la Regla (El Desafío)

Abre el archivo `local.rules` con tu editor favorito (`nano` o `vim`):

```bash
nano local.rules
```

Escribe una regla que cumpla estos requisitos:
1.  Genere una alerta.
2.  Protocolo TCP.
3.  Desde cualquier IP externa (`!10.0.0.5`) hacia cualquier destino en puerto 22.
4.  Mensaje: "Posible Fuerza Bruta SSH".
5.  SID: 1000001.

*Pista:* Recuerda el operador de negación `!` para la IP de origen.

---

## 5. Validación con el Entrenador Crítico

Aquí es donde entra nuestra herramienta de IA pedagógica. En lugar de simplemente probar si Snort corre, el script analizará la **calidad** y el **riesgo** de tu regla.

Descarga/Ejecuta el validador (asegúrate de estar en el mismo directorio donde creaste `local.rules`):

```bash
# Descargar el validador (simulado para este entorno local, el archivo real está en los recursos del curso)
# Asumimos que ya tienes el script validator_ids.sh en tu carpeta actual o en el PATH
# Si no, créalo con el contenido del Apéndice de Scripts.

chmod +x validator_ids.sh
./validator_ids.sh local.rules
```

### ¿Qué esperar del Validador?
*   **Si usaste `any any`:** Te regañará por crear una regla que mata el rendimiento.
*   **Si olvidaste el SID:** Te recordará que sin ID, la regla no existe para el motor.
*   **Si la sintaxis es correcta:** Te preguntará: *"¿Esta regla genera falsos positivos si el admin se conecta desde su casa?"* (Pregunta reflexiva).

---

## 6. Reto Avanzado (Opcional)
Investiga cómo usar la opción `flow:stateless` o `threshold` en Snort para detectar solo si hay más de 5 intentos en 60 segundos. (El validador te dará puntos extra si detecta keywords avanzadas).

---

## 📝 Entregable: Informe del Laboratorio 08

Para dejar constancia de tu trabajo en este laboratorio, utiliza la **Plantilla Informe Lab 08** en formato `.md` descargable desde la plataforma. Allí podrás describir tu entorno, la regla diseñada, los resultados del validador y tus reflexiones.

Si ya completaste los Capítulos 6 y 7 y quieres modo **Arquitecto Pro**:

- Revisa la sección 8.5 del capítulo (apartado "Opción 1 – Automática").
- Usa `architecture_designer.py` para exportar tu arquitectura y `threat_to_detection.py` para generar un archivo `cybersentinel.rules`.
- Compáralo con la regla manual que construiste aquí: ¿qué detecta cada enfoque?, ¿dónde encaja mejor cada uno en tu red?

## ✅ Checklist de Misión Cumplida
- [ ] Snort instalado y funcionando.
- [ ] Archivo `local.rules` creado.
- [ ] Regla sintácticamente correcta (sin `any any` innecesarios).
- [ ] IP del administrador (`10.0.0.5`) excluida de la alerta.
- [ ] Validación aprobada por `validator_ids.sh`.

---

## 📊 Autoevaluación

<div class="tracker-container" data-chapter-id="08" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Competencia Clave</th>
        <th>Mi Nivel (1-5)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Sintaxis Snort:</strong> Puedo escribir una regla básica con header y opciones sin errores.</td>
        <td>
          <span class="tracker-option" data-row="snort_syntax" data-val="1">1</span>
          <span class="tracker-option" data-row="snort_syntax" data-val="2">2</span>
          <span class="tracker-option" data-row="snort_syntax" data-val="3">3</span>
          <span class="tracker-option" data-row="snort_syntax" data-val="4">4</span>
          <span class="tracker-option" data-row="snort_syntax" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Lógica de Detección:</strong> Entiendo cómo filtrar IPs (operador !) para evitar falsos positivos.</td>
        <td>
          <span class="tracker-option" data-row="detection_logic" data-val="1">1</span>
          <span class="tracker-option" data-row="detection_logic" data-val="2">2</span>
          <span class="tracker-option" data-row="detection_logic" data-val="3">3</span>
          <span class="tracker-option" data-row="detection_logic" data-val="4">4</span>
          <span class="tracker-option" data-row="detection_logic" data-val="5">5</span>
        </td>
      </tr>
      <tr>
        <td><strong>Validación:</strong> Uso herramientas (validator_ids.sh) para auditar mis propias reglas antes de desplegar.</td>
        <td>
          <span class="tracker-option" data-row="validation" data-val="1">1</span>
          <span class="tracker-option" data-row="validation" data-val="2">2</span>
          <span class="tracker-option" data-row="validation" data-val="3">3</span>
          <span class="tracker-option" data-row="validation" data-val="4">4</span>
          <span class="tracker-option" data-row="validation" data-val="5">5</span>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="tracker-score-display">
    PUNTUACIÓN: <span class="score-value">0 / 10</span>
  </div>
</div>
