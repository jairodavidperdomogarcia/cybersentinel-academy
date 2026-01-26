#!/bin/bash
# cs-validator.sh - Validador CyberSentinel v0.1
# Herramienta de retroalimentación inmediata para laboratorios

echo "🔍 CYBERSENTINEL VALIDATOR INICIADO..."
echo "Evaluando tu comprensión de permisos Linux..."

# ---- EJERCICIO: Permisos Peligrosos ----
echo -e "\n📁 PARTE 1: Tu misión era crear un archivo 'secreto.txt'."

if [ -f "secreto.txt" ]; then
    echo "✅ OK: Archivo encontrado."
    PERM=$(stat -c "%a" secreto.txt)
    
    if [ "$PERM" = "777" ]; then
        echo "⚠️  ALERTA DE SEGURIDAD: El archivo tiene permisos 777 (rwxrwxrwx)."
        echo "   IMPACTO: Cualquier usuario en el sistema podría:"
        echo "     • Leer su contenido (Confidencialidad rota)."
        echo "     • Modificar la información (Integridad rota)."
        echo "     • Ejecutarlo si es un script (Posible compromiso)."
        echo "   COMANDO SUGERIDO PARA REPARAR: chmod 600 secreto.txt"
        echo "   LECCIÓN: Los permisos 777 son casi NUNCA necesarios."
    else
        echo "✅ Buen trabajo. Permisos actuales: $PERM"
    fi
else
    echo "❌ Archivo no encontrado. ¿Usaste el comando: echo 'texto' > secreto.txt ?"
fi

# ---- EJERCICIO: Reconocimiento de Sistema ----
echo -e "\n🖥️  PARTE 2: Reconocimiento del sistema."
USER=$(whoami)
echo "   Tu usuario actual es: '$USER'"

if [ "$USER" = "root" ]; then
    echo "   ⚠️  Estás como ROOT. Recuerda: 'Con gran poder, gran responsabilidad'."
fi

echo -e "\n📊 RESUMEN DE VALIDACIÓN COMPLETADO."
echo "💡 Consejo: Revisa las alertas. No se trata de 'aprobar', sino de entender el 'porqué'."
