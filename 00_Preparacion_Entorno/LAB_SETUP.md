# Configuración del Entorno de Laboratorio

Este documento te guiará para crear un entorno seguro y aislado donde ejecutar los laboratorios del curso.

## Requisitos Previos
*   VirtualBox o VMware Player.
*   Docker Desktop.
*   Python 3.9+.

## Estructura del Lab
Recomendamos crear dos máquinas virtuales (VMs):
1.  **VM Atacante:** Kali Linux (o Parrot OS).
2.  **VM Víctima:** Metasploitable o Windows 10 (sin parches).

## Configuración de Red
*   Configura las VMs en modo **"Red Interna" (Internal Network)** para evitar que el tráfico malicioso salga a internet.

## Docker Setup
Para los labs de IA y contenedores:
```bash
docker pull owasp/modsecurity-crs
docker pull wazuh/wazuh-manager
```
