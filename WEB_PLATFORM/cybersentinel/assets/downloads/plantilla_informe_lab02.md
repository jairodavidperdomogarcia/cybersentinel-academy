# Informe de Laboratorio 02: Dominando la Terminal
## Investigación en dev-server-03 (Simulado)

> **📝 INSTRUCCIONES RÁPIDAS:**
> 1. **Guardar:** Clic derecho en la página > **"Guardar como..."** > Guardar en `Descargas`.
> 2. **Abrir:** Clic derecho en el archivo descargado > **"Abrir con"** > **Bloc de notas** o **VS Code**.
> 3. **Editar:** Completa los campos entre corchetes `[ ]`.
> *(Si tienes dudas, revisa la Guía Visual del Laboratorio 01).*

**Cadete:** [Tu Nombre o Alias]
**Fecha de Investigación:** [Fecha]
**Servidor Investigado:** dev-server-03 (Simulado en Kali)

---

### 1. Hallazgos Clave

#### Archivos con permisos peligrosos (777):
*(Pega aquí la salida del comando `find / -type f -perm 777 2>/dev/null`)*
```text
[Pegar salida aquí]
```

#### Líneas relevantes de logs de autenticación (auth.log):
*(Pega aquí las 5-10 líneas más sospechosas del comando `grep`)*
```text
[Pegar salida aquí]
```

#### Procesos inusuales identificados:
*(Pega aquí las líneas de `ps aux` que te parecieron sospechosas)*
```text
[Pegar salida aquí]
```

#### Puertos en escucha no estándar identificados:
*(Pega aquí la parte de la salida de `ss -tulnp` que muestra puertos inusuales)*
```text
[Pegar salida aquí]
```

---

### 2. Respuestas al Desafío

**Usuario y Ambiente:**
[Tu respuesta aquí: ¿Con qué usuario te conectaste? ¿En qué directorio empezaste?]

**Archivos Sospechosos (Permisos 777):**
[Tu respuesta aquí: ¿Encontraste algún archivo con permisos 777? ¿En qué ruta y qué nombre tenía? ¿Por qué es peligroso?]

**Evidencia en Logs:**
[Tu respuesta aquí: ¿Lograste ver alguna línea que mencione "Failed password" o "Accepted password" para un usuario específico? ¿Desde qué IP?]

**Procesos Inusuales:**
[Tu respuesta aquí: ¿Identificaste algún proceso cuyo nombre o comando no reconocieras?]

**Conexiones de Red:**
[Tu respuesta aquí: ¿Qué puertos estaban en estado LISTEN? ¿Viste algún puerto como 4444, 8080, o 9000?]

---

### 3. Conclusión Preliminar y Recomendación

**Análisis:**
Basándote en la evidencia recopilada, ¿crees que la alerta del IDS era un falso positivo o hay indicios sólidos de un compromiso real? Justifica tu respuesta en 2-3 líneas.

[Tu conclusión aquí. Ej: "Existen indicios de compromiso debido a X, Y y Z. Recomiendo escalar la investigación a un equipo de respuesta a incidentes."]

---

### 4. Comandos Nuevos Aprendidos

Enumera al menos 3 comandos o opciones de comandos que no conocías antes de este laboratorio y que ahora entiendes.

1.  [Ej: find -perm]
2.  [Ej: ss -tulnp]
3.  [Ej: ps aux --sort=-%cpu]
