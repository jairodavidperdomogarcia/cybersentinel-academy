# Guía de Laboratorio 05: La Calculadora de Riesgo

> **Misión:** Dejar de adivinar y empezar a medir. Construirás tu propia herramienta para cuantificar el riesgo.

---

## 🛠️ Prerrequisitos
*   Máquina Virtual Kali Linux (o cualquier terminal con Python 3).
*   Ganas de escribir un poco de código (¡No te asustes, es fácil!).

---

## 🚀 Parte A: Tu Primera Herramienta de Seguridad (30 min)

Los analistas de riesgo junior usan Excel. Los analistas senior construyen herramientas. Vamos a crear un script en Python que automatice el cálculo de la matriz de riesgo.

### Paso 1: Crear el Script
Abre tu terminal y crea el archivo:

```bash
nano risk_calc.py
```

Copia este código (o mejor aún, escríbelo para entenderlo):

```python
#!/usr/bin/env python3

def obtener_valor(prompt):
    while True:
        try:
            val = int(input(prompt + " (1-5): "))
            if 1 <= val <= 5:
                return val
            print("❌ Error: Debe ser un número entre 1 y 5.")
        except ValueError:
            print("❌ Error: Ingresa un número válido.")

print("🛡️  CYBERSENTINEL RISK CALCULATOR v1.0")
print("=======================================")

impacto = obtener_valor("💥 Nivel de IMPACTO")
probabilidad = obtener_valor("🎲 Nivel de PROBABILIDAD")

riesgo = impacto * probabilidad

print(f"\n📊 RESULTADO:")
print(f"   Puntaje de Riesgo: {riesgo}/25")

if riesgo >= 15:
    print("   🔴 CLASIFICACIÓN: CRÍTICO - ¡Actuar de inmediato!")
elif riesgo >= 8:
    print("   🟡 CLASIFICACIÓN: ALTO - Planificar mitigación.")
else:
    print("   🟢 CLASIFICACIÓN: BAJO - Aceptable por ahora.")
```

Guarda con `Ctrl+O`, `Enter`, `Ctrl+X`.

### Paso 2: Ejecutar y Probar
Dale permisos y corre tu creación:

```bash
chmod +x risk_calc.py
./risk_calc.py
```

Prueba estos escenarios:
1.  Impacto 5, Probabilidad 5 (Debería salir ROJO).
2.  Impacto 2, Probabilidad 2 (Debería salir VERDE).

---

## 🧠 Parte B: El Desafío de Análisis (20 min)

Usa tu calculadora para clasificar estos 3 escenarios reales:

1.  **Escenario A:** Un servidor de pruebas (sin datos reales) tiene una vulnerabilidad crítica, pero está desconectado de internet.
    *   *Impacto:* 1 (Si lo hackean, no se pierde nada importante).
    *   *Probabilidad:* 1 (Está desconectado).
2.  **Escenario B:** La base de datos de clientes tiene una contraseña "admin123" y está expuesta a internet.
    *   *Impacto:* 5 (Quiebra de la empresa).
    *   *Probabilidad:* 5 (Es trivial de adivinar).
3.  **Escenario C:** Un empleado podría perder su laptop corporativa (tiene disco cifrado).
    *   *Impacto:* 3 (Costo del hardware + molestia).
    *   *Probabilidad:* 3 (Pasa a veces).

---

## 🛡️ Parte C: Validación (El Entrenador)

Para confirmar que entendiste la lógica, corre este validador.

Crea `validator_risk.sh`:

```bash
cat > validator_risk.sh << 'EOF'
#!/bin/bash
echo "🛡️  CYBERSENTINEL RISK TRAINER"
echo "=============================="
echo "Pregunta 1: En el Escenario A (Servidor desconectado), ¿cuál es el riesgo?"
echo "a) 25 (Crítico porque la vulnerabilidad es técnica)"
echo "b) 1 (Bajo porque no hay amenaza ni impacto real)"
read -p "Tu respuesta (a/b): " r1

if [ "$r1" == "b" ]; then
    echo "✅ Correcto. Sin exposición, el riesgo es mínimo aunque el bug sea feo."
else
    echo "❌ Incorrecto. Recuerda: Riesgo = Amenaza x Vulnerabilidad. Si Amenaza es 0..."
fi

echo ""
echo "Pregunta 2: ¿Qué estrategia usarías para el Escenario C (Laptop cifrada)?"
echo "a) Tratar (Instalar GPS)"
echo "b) Tolerar (El cifrado ya mitiga el impacto de datos, solo pierdes el hardware)"
read -p "Tu respuesta (a/b): " r2

if [ "$r2" == "b" ]; then
    echo "✅ Correcto. A veces es más barato reemplazar la laptop que ponerle seguridad militar."
else
    echo "⚠️  Debatible. Pero considera el costo-beneficio."
fi
EOF
chmod +x validator_risk.sh
./validator_risk.sh
```

---

## 📝 Entregable: Informe del Laboratorio 05

Para documentar este laboratorio, utiliza la **Plantilla Informe Lab 05** en formato `.md` descargable desde la plataforma. Allí podrás registrar tus escenarios, cálculos de riesgo y conclusiones de forma ordenada.

## ✅ Checklist de Misión Cumplida

<div class="tracker-container" data-chapter-id="lab_05" data-points-per-row="2">
  <table class="tracker-table">
    <thead>
      <tr>
        <th>Tarea</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Creé el script <code>risk_calc.py</code> y funciona sin errores.</td>
        <td>
          <span class="tracker-option" data-row="script" data-val="0">🔴 No</span>
          <span class="tracker-option" data-row="script" data-val="5">🟢 Sí</span>
        </td>
      </tr>
      <tr>
        <td>Entendí por qué el "Escenario A" tiene riesgo bajo a pesar de tener bugs críticos.</td>
        <td>
          <span class="tracker-option" data-row="contexto" data-val="0">🔴 No</span>
          <span class="tracker-option" data-row="contexto" data-val="5">🟢 Sí</span>
        </td>
      </tr>
      <tr>
        <td>Ejecuté el validador y obtuve luz verde.</td>
        <td>
          <span class="tracker-option" data-row="validador" data-val="0">🔴 No</span>
          <span class="tracker-option" data-row="validador" data-val="5">🟢 Sí</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>

---

### **🎯 PREPARACIÓN PARA LA PRÓXIMA MISIÓN: CAPÍTULO 06**

Has dominado los bloques fundamentales:
- **Cap 04:** Identificar amenazas (STRIDE, DFDs).
- **Cap 05:** Priorizarlas (Matriz de Riesgo).

**El Capítulo 06 es donde todo converge.** Será tu **primer proyecto integrado de modelado de amenazas completo**.

**✅ Antes de comenzar el Capítulo 06, asegúrate de tener:**
1.  Tu **DFD del sistema CardioGuard** (Lab 04).
2.  Tu **tabla de amenazas STRIDE** priorizada (Lab 04 + Lab 05).
3.  Tu script **`risk_calc.py`** funcionando.

**🛡️ En el Capítulo 06 aplicarás PASTA de principio a fin a un nuevo caso, generando un informe ejecutivo profesional.**
