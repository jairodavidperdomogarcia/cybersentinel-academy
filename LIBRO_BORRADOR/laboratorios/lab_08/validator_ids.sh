#!/bin/bash

# ==============================================================================
# CyberSentinel Validator: IDS/IPS Rule Analyzer (Laboratorio 08)
# ==============================================================================
# Este script actúa como un "Entrenador Crítico" para reglas Snort/Suricata.
# No solo valida la sintaxis, sino que cuestiona la calidad y el impacto
# de las reglas creadas por el estudiante.
# ==============================================================================

# Colores para feedback
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FILE_TO_CHECK="${1:-local.rules}"

echo -e "${BLUE}================================================================${NC}"
echo -e "${BLUE}       🕵️  CYBERSENTINEL IDS RULE VALIDATOR (Lab 08)       ${NC}"
echo -e "${BLUE}================================================================${NC}"

# 1. Verificación de Existencia
if [ ! -f "$FILE_TO_CHECK" ]; then
    echo -e "${RED}[!] ERROR CRÍTICO:${NC} No encuentro el archivo '${FILE_TO_CHECK}'."
    echo -e "    Asegúrate de guardar tus reglas en este archivo antes de validar."
    exit 1
fi

echo -e "${GREEN}[+] Archivo encontrado:${NC} $FILE_TO_CHECK"
echo -e "    Analizando contenido...\n"

# Leer el contenido (ignorando líneas vacías y comentarios)
RULES=$(grep -vE "^\s*#|^\s*$" "$FILE_TO_CHECK")
RULE_COUNT=$(echo "$RULES" | wc -l)

if [ -z "$RULES" ]; then
    echo -e "${YELLOW}[!] ALERTA:${NC} El archivo está vacío o solo tiene comentarios."
    echo -e "    Escribe al menos una regla Snort para comenzar."
    exit 1
fi

echo -e "${BLUE}--- ANÁLISIS HEURÍSTICO ---${NC}"

# Iterar sobre cada regla encontrada
IFS=$'\n'
for line in $RULES; do
    echo -e "\n📝 ${YELLOW}Analizando regla:${NC} $line"

    # 2. Análisis de Acción (Action)
    if [[ ! "$line" =~ ^(alert|log|pass|drop|reject|sdrop) ]]; then
        echo -e "${RED}    [X] SINTAXIS:${NC} La regla no comienza con una acción válida."
        echo -e "        (alert, log, pass, drop, reject, sdrop)."
    else
        ACTION=$(echo "$line" | awk '{print $1}')
        if [ "$ACTION" == "alert" ]; then
            echo -e "${GREEN}    [OK] Acción:${NC} 'alert' (Modo Detección)."
            echo -e "         ℹ️  REFLEXIÓN: ¿Es suficiente saber que ocurrió, o deberías bloquearlo?"
        elif [ "$ACTION" == "drop" ]; then
            echo -e "${GREEN}    [OK] Acción:${NC} 'drop' (Modo Prevención/IPS)."
            echo -e "         ⚠️  PRECAUCIÓN: Si hay un Falso Positivo, bloquearás tráfico legítimo."
        fi
    fi

    # 3. Análisis de Rendimiento (The "Any-Any" Problem)
    if [[ "$line" == *"any any -> any any"* ]]; then
        echo -e "${RED}    [!] PELIGRO DE RENDIMIENTO:${NC} Usas 'any any -> any any'."
        echo -e "        Esto obliga al motor a inspeccionar CADA paquete de la red."
        echo -e "        📉 Impacto: Alto consumo de CPU y latencia."
        echo -e "        💡 Sugerencia: Restringe IPs o Puertos si es posible."
    fi

    # 4. Análisis de Metadatos (SID, MSG, REV)
    if [[ "$line" != *"sid:"* ]]; then
        echo -e "${RED}    [X] ESTÁNDAR:${NC} Falta 'sid' (Snort ID)."
        echo -e "        Sin un ID único, no podrás referenciar ni gestionar esta regla."
        echo -e "        (Usa sids > 1000000 para reglas locales)."
    fi

    if [[ "$line" != *"msg:"* ]]; then
        echo -e "${YELLOW}    [!] USABILIDAD:${NC} Falta 'msg' (Mensaje)."
        echo -e "        Cuando salte la alerta, verás un log vacío/genérico."
        echo -e "        ¿Cómo sabrá el analista qué está pasando?"
    fi

    # 5. Análisis de Contenido (Payload)
    if [[ "$line" != *"content:"* ]] && [[ "$line" != *"pcre:"* ]]; then
         echo -e "${YELLOW}    [?] CONTEXTO:${NC} No buscas contenido específico (payload)."
         echo -e "        Esta regla es solo de encabezado (Header Rule)."
         echo -e "        ¿Es intencional? (Ej: Detectar escaneo de puertos vs ataque web)."
    fi

done

echo -e "\n${BLUE}================================================================${NC}"
echo -e "${GREEN}✅ Análisis completado.${NC}"
echo -e "Recuerda: Un buen ingeniero de seguridad balancea ${YELLOW}Visibilidad${NC} vs ${YELLOW}Rendimiento${NC}."
