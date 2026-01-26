# Threat Hunting Proactivo: Hipótesis de Caza

> **"No esperes a la alerta. Asume que ya estás comprometido y busca la evidencia."**

## El Ciclo de Caza
1.  **Hipótesis:** "Creo que un atacante está usando PowerShell para moverse lateralmente".
2.  **Investigación:** Buscar en los logs de eventos (Event ID 4104).
3.  **Descubrimiento:** Encontrar scripts ofuscados.
4.  **Respuesta:** Aislar el host y bloquear el hash.

## Herramientas
*   **ELK Stack:** Elasticsearch, Logstash, Kibana.
*   **Sysmon:** Logs detallados de Windows.
