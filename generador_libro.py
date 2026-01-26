import os
import re
import datetime

# Configuración
ROOT_DIR = "LIBRO_BORRADOR"
OUTPUT_DIR = os.path.join("WEB_PLATFORM", "manual")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "CyberSentinel_Manual_Completo.html")

# Asegurar que el directorio de salida existe
os.makedirs(OUTPUT_DIR, exist_ok=True)

CSS_STYLE = """
<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Source+Code+Pro:wght@400;700&display=swap');
    
    body {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 40px;
        background-color: white;
    }

    /* Portada */
    .cover-page {
        text-align: center;
        page-break-after: always;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
        color: white;
        margin: -40px -40px 40px -40px; /* Full bleed hack */
        padding: 40px;
    }
    .cover-logo {
        width: 180px;
        height: auto;
        margin-bottom: 30px;
        filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
        background: rgba(255,255,255,0.1);
        border-radius: 20px;
        padding: 20px;
        backdrop-filter: blur(5px);
    }
    .cover-title {
        font-family: 'Source Code Pro', monospace;
        font-size: 3.5em;
        color: #ffffff;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 3px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        font-weight: 700;
    }
    .cover-subtitle {
        font-size: 1.6em;
        color: #a8dce7;
        margin-bottom: 40px;
        font-weight: 300;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        padding-bottom: 20px;
        display: inline-block;
    }
    .cover-author {
        font-size: 1.3em;
        font-weight: 500;
        color: #e0e0e0;
        margin-top: 40px;
    }
    .cover-page .mermaid {
        background: rgba(255, 255, 255, 0.95);
        padding: 25px;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.4);
        max-width: 90%;
        margin: 20px auto;
    }

    .mermaid-zoom-wrapper {
        max-width: 100%;
        margin: 30px auto;
        cursor: zoom-in;
    }

    .mermaid-zoom-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        z-index: 99999;
        overflow: auto;
        padding: 40px;
    }

    .mermaid-zoom-overlay svg {
        width: 1800px;
        max-width: none;
        height: auto;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
        border-radius: 8px;
        background: #0a192f;
    }

    .mermaid-zoom-legend {
        text-align: center;
        margin-top: 5px;
        font-size: 0.85em;
        color: #007bff;
        font-family: 'Source Code Pro', monospace;
        cursor: pointer;
        opacity: 0.8;
        transition: opacity 0.3s;
    }
    .mermaid-zoom-legend:hover {
        opacity: 1;
        text-decoration: underline;
    }

    .mermaid-zoom-close {
        position: fixed;
        top: 20px;
        right: 30px;
        color: #ffffff;
        font-size: 32px;
        font-weight: bold;
        cursor: pointer;
        z-index: 100000;
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 6px;
    }

    /* Separadores de Volumen */
    .volume-separator {
        page-break-before: always;
        page-break-after: always;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8f9fa;
        text-align: center;
    }
    .volume-separator h1 {
        font-size: 3em;
        color: #2c3e50;
        border-bottom: none;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    /* Estilos para Laboratorios insertados */
    .lab-container {
        background-color: #f0f2f5;
        border-left: 5px solid #2c3e50;
        padding: 20px;
        margin: 30px 0;
        border-radius: 0 10px 10px 0;
    }
    .lab-header {
        background-color: #2c3e50;
        color: white;
        padding: 10px 20px;
        margin: -20px -20px 20px -20px; /* Negate padding */
        border-radius: 0 10px 0 0;
        font-family: 'Source Code Pro', monospace;
        font-weight: bold;
    }

    /* Justificación de Texto General */
    .chapter {
        text-align: justify;
    }
    
    /* Encabezados */
    h1 { color: #0056b3; border-bottom: 2px solid #eee; padding-bottom: 10px; page-break-before: always; margin-top: 50px; text-align: left; }
    h2 { color: #2c3e50; margin-top: 30px; text-align: left; }
    h3 { color: #34495e; margin-top: 25px; text-align: left; }
    h4, h5, h6 { text-align: left; }

    /* Bloques de código */
    pre {
        background-color: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 5px;
        padding: 15px;
        overflow-x: auto;
    }
    code {
        font-family: 'Source Code Pro', monospace;
        color: #e83e8c;
    }
    pre code {
        color: #333;
    }

    /* Tablas */
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
        color: #333;
    }

    /* Links e Imágenes */
    a { color: #007bff; text-decoration: none; }
    img { max-width: 100%; height: auto; display: block; margin: 20px auto; }

    /* Impresión */
    @media print {
        body { padding: 0; margin: 2cm; }
        a { text-decoration: none; color: black; }
        pre, blockquote { page-break-inside: avoid; }
        h1 { page-break-before: always; }
        .no-print { display: none; }
        #progress-container, .mission-check-btn { display: none !important; }
    }

    /* --- SISTEMA DE PROGRESO CYBERSENTINEL --- */
    #progress-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background: #e0e0e0;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    
    #progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
        width: 0%;
        transition: width 0.5s ease-in-out;
    }

    #progress-text {
        position: fixed;
        top: 10px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        padding: 5px 15px;
        border-radius: 20px;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9em;
        z-index: 9999;
        font-weight: bold;
        border: 1px solid #00ff00;
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }

    .mission-check-btn {
        display: inline-block;
        margin-left: 15px;
        padding: 5px 10px;
        font-size: 0.6em;
        background-color: #f8f9fa;
        border: 2px solid #ccc;
        color: #888;
        border-radius: 5px;
        cursor: pointer;
        font-family: 'Roboto', sans-serif;
        vertical-align: middle;
        transition: all 0.3s;
    }

    .mission-check-btn:hover {
        border-color: #007bff;
        color: #007bff;
    }

    .mission-check-btn.completed {
        background-color: #28a745;
        border-color: #28a745;
        color: white;
        box-shadow: 0 2px 5px rgba(40, 167, 69, 0.4);
    }

    /* --- ESTILOS DEL TRACKER DE AUTOEVALUACIÓN --- */
    .tracker-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 20px 0;
        background: #fdfdfd;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    .tracker-table th {
        background: #2c3e50;
        color: white;
        padding: 12px;
        text-align: left;
    }
    .tracker-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
        vertical-align: middle;
    }
    .tracker-option {
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #ddd;
        margin: 0 4px;
        cursor: pointer;
        transition: all 0.2s;
        vertical-align: middle;
        text-align: center;
        line-height: 24px;
        font-size: 12px;
        font-weight: bold;
        color: #555;
        background: #f5f5f5;
    }
    .tracker-option:hover {
        transform: scale(1.1);
        border-color: #007bff;
    }
    .tracker-option.selected {
        color: #fff;
        box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
    }
    .tracker-option.selected[data-val="1"],
    .tracker-option.selected[data-val="2"] {
        background: #ff6b6b;
        border-color: #d32f2f;
    }
    .tracker-option.selected[data-val="3"] {
        background: #ffca28;
        border-color: #ffa000;
    }
    .tracker-option.selected[data-val="4"],
    .tracker-option.selected[data-val="5"] {
        background: #66bb6a;
        border-color: #2e7d32;
    }

    .tracker-score-display {
        font-family: 'Source Code Pro', monospace;
        font-size: 1.5em;
        font-weight: bold;
        text-align: center;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-top: 10px;
        border: 2px dashed #ccc;
    }
    .tracker-feedback {
        margin-top: 10px;
        padding: 15px;
        border-left: 5px solid #007bff;
        background: #e9f5ff;
        font-style: italic;
    }

    .lab-tracker-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 20px 0;
        background: #fdfdfd;
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
    }
    .lab-tracker-table th {
        background: #2c3e50;
        color: white;
        padding: 12px;
        text-align: left;
    }
    .lab-tracker-table td {
        padding: 12px;
        border-bottom: 1px solid #eee;
        vertical-align: middle;
    }
    .lab-checkbox {
        width: 18px;
        height: 18px;
    }
    .lab-score-display {
        font-family: 'Source Code Pro', monospace;
        font-size: 1.3em;
        font-weight: bold;
        text-align: center;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-top: 10px;
        border: 2px dashed #ccc;
    }
    .lab-feedback {
        margin-top: 10px;
        padding: 15px;
        border-left: 5px solid #007bff;
        background: #e9f5ff;
        font-style: italic;
    }

    .part-progress-container {
        margin: 30px 0;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #ddd;
        background: #f8f9fb;
    }
    .part-progress-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
    }
    .part-progress-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .part-progress-label {
        width: 110px;
        font-family: 'Source Code Pro', monospace;
    }
    .part-progress-bar {
        flex: 1;
        height: 14px;
        background: #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
    }
    .part-progress-fill {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #bbdefb, #1e88e5);
        transition: width 0.5s ease-out;
    }
    .part-progress-value {
        width: 60px;
        text-align: right;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.9em;
    }

    .quiz-block {
        margin: 25px 0;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #ddd;
        background: #f9fafc;
    }
    .quiz-block p {
        margin-bottom: 10px;
    }
    .quiz-options {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 5px;
    }
    .quiz-option {
        border: 1px solid #ccc;
        background: #ffffff;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Source Code Pro', monospace;
        font-size: 0.85em;
        transition: all 0.2s;
    }
    .quiz-option:hover {
        border-color: #007bff;
        background: #eef4ff;
    }
    .quiz-option.correct {
        background: #e8f5e9;
        border-color: #2e7d32;
        color: #1b5e20;
    }
    .quiz-option.incorrect {
        background: #ffebee;
        border-color: #c62828;
        color: #b71c1c;
    }
    .quiz-feedback {
        margin-top: 10px;
        font-size: 0.9em;
    }
    .quiz-feedback.correct {
        color: #2e7d32;
    }
    .quiz-feedback.incorrect {
        color: #c62828;
    }
</style>
"""

# Script para renderizar Mermaid y Sistema de Progreso
MERMAID_SCRIPT = """
<script type="module">
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: true });
</script>

<script>
// --- SISTEMA DE RASTREO DE PROGRESO CYBERSENTINEL ---
document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Identificar Misiones (Capítulos y Laboratorios)
    // Buscamos todos los H1 que sean relevantes
    const headers = document.querySelectorAll('h1');
    let totalMissions = 0;
    const missionIds = [];

    headers.forEach((header, index) => {
        // Generar un ID único si no tiene (basado en el texto limpio)
        if (!header.id) {
            header.id = 'mission-' + index;
        }
        
        // Ignorar títulos puramente decorativos o de la portada
        if (header.innerText.trim() === "CyberSentinel" || header.closest('.cover-page')) return;

        totalMissions++;
        const missionId = header.id;
        missionIds.push(missionId);

        // Crear el botón de Check
        const btn = document.createElement('button');
        btn.className = 'mission-check-btn no-print';
        btn.innerHTML = '⭕ MARCAR COMPLETADO';
        btn.onclick = () => toggleMission(missionId, btn);
        
        // Verificar estado guardado
        if (localStorage.getItem('cs_mission_' + missionId) === 'completed') {
            markButtonAsCompleted(btn);
        }

        header.appendChild(btn);
    });

    // 2. Crear Barra de Progreso y Widget
    const progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    progressContainer.innerHTML = '<div id="progress-bar"></div>';
    document.body.prepend(progressContainer);

    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.innerText = 'PROGRESO: 0%';
    document.body.prepend(progressText);

    updateGlobalProgress();
    
    initTrackers();
    initLabTrackers();
    initPartProgress();
    initQuizzes();
    initMermaidZoom();

    // --- FUNCIONES ---

    function toggleMission(id, btn) {
        if (localStorage.getItem('cs_mission_' + id) === 'completed') {
            // Desmarcar
            localStorage.removeItem('cs_mission_' + id);
            markButtonAsPending(btn);
        } else {
            // Marcar
            localStorage.setItem('cs_mission_' + id, 'completed');
            markButtonAsCompleted(btn);
            
            // Efecto visual simple (confeti consola)
            console.log("¡Misión " + id + " completada!");
        }
        updateGlobalProgress();
    }

    function markButtonAsCompleted(btn) {
        btn.className = 'mission-check-btn completed no-print';
        btn.innerHTML = '✅ MISIÓN CUMPLIDA';
    }

    function markButtonAsPending(btn) {
        btn.className = 'mission-check-btn no-print';
        btn.innerHTML = '⭕ MARCAR COMPLETADO';
    }

    function updateGlobalProgress() {
        let completedCount = 0;
        missionIds.forEach(id => {
            if (localStorage.getItem('cs_mission_' + id) === 'completed') {
                completedCount++;
            }
        });

        const percentage = Math.round((completedCount / totalMissions) * 100) || 0;
        
        document.getElementById('progress-bar').style.width = percentage + '%';
        document.getElementById('progress-text').innerText = 'PROGRESO: ' + percentage + '%';
        
        // Color dinámico del widget según progreso
        if (percentage === 100) {
            document.getElementById('progress-text').style.color = '#00ffff';
            document.getElementById('progress-text').style.borderColor = '#00ffff';
            document.getElementById('progress-text').innerText = '🏆 PROGRESO: 100% - ¡LISTO PARA EL COMBATE!';
        }
    }

    // Lógica del Tracker de Autoevaluación
    function initTrackers() {
        const trackers = document.querySelectorAll('.tracker-container');
        trackers.forEach(container => {
            const chapterId = container.dataset.chapterId;
            const options = container.querySelectorAll('.tracker-option');
            const scoreDisplay = container.querySelector('.score-value');
            const feedbackDisplay = container.querySelector('.feedback-text');
            
            // Cargar estado guardado
            const savedState = JSON.parse(localStorage.getItem('cs_tracker_' + chapterId) || '{}');
            
            // Restaurar selección
            options.forEach(opt => {
                const rowKey = opt.dataset.row;
                if (savedState[rowKey] == opt.dataset.val) {
                    opt.classList.add('selected');
                }
                
                // Event Listener
                opt.addEventListener('click', () => {
                    // Deseleccionar hermanos
                    container.querySelectorAll(`.tracker-option[data-row="${rowKey}"]`).forEach(s => s.classList.remove('selected'));
                    // Seleccionar este
                    opt.classList.add('selected');
                    // Guardar
                    savedState[rowKey] = opt.dataset.val;
                    localStorage.setItem('cs_tracker_' + chapterId, JSON.stringify(savedState));
                    // Recalcular
                    updateScore(container, savedState, chapterId);
                });
            });
            
            updateScore(container, savedState, chapterId);
        });
    }

    function updateScore(container, state, chapterId) {
        let total = 0;
        let max = 0;
        const rows = new Set();
        container.querySelectorAll('.tracker-option').forEach(opt => rows.add(opt.dataset.row));
        rows.forEach(row => {
            const raw = parseInt(state[row] || 0);
            const clamped = Math.min(Math.max(raw, 0), 5);
            const rowMaxPoints = parseFloat(container.dataset.pointsPerRow || "2");
            const rowScore = (clamped / 5) * rowMaxPoints;
            total += rowScore;
            max += rowMaxPoints;
        });

        const roundedTotal = Math.round(total * 10) / 10;
        const scoreSpan = container.querySelector('.score-value');
        if(scoreSpan) scoreSpan.innerText = roundedTotal + " / " + max;

        const feedbackDiv = container.querySelector('.feedback-text');
        if(feedbackDiv) {
            if (roundedTotal < max * 0.5) {
                feedbackDiv.innerHTML = "🔴 <strong>Refuerzo Necesario:</strong> Revisa los conceptos clave antes de avanzar.";
                feedbackDiv.style.backgroundColor = "#ffe6e6";
                feedbackDiv.style.borderLeftColor = "#ff4444";
            } else if (roundedTotal < max * 0.8) {
                feedbackDiv.innerHTML = "🟡 <strong>Buen Progreso:</strong> Entiendes la mayoría, pero repasa los puntos débiles.";
                feedbackDiv.style.backgroundColor = "#fffde7";
                feedbackDiv.style.borderLeftColor = "#ffbb00";
            } else {
                feedbackDiv.innerHTML = "🟢 <strong>Dominio Excelente:</strong> ¡Estás listo para el siguiente desafío!";
                feedbackDiv.style.backgroundColor = "#e8f5e9";
                feedbackDiv.style.borderLeftColor = "#00cc00";
            }
        }

        if (chapterId) {
            localStorage.setItem('cs_tracker_total_' + chapterId, JSON.stringify({ score: roundedTotal, max: max }));
            initPartProgress(); // Actualizar tablero de progreso en tiempo real
        }
    }

    function initLabTrackers() {
        const labContainers = document.querySelectorAll('.lab-tracker-container');
        labContainers.forEach(container => {
            const labId = container.dataset.labId;
            const checkboxes = container.querySelectorAll('.lab-checkbox');
            const savedState = JSON.parse(localStorage.getItem('cs_lab_' + labId) || '{}');

            checkboxes.forEach(cb => {
                const key = cb.dataset.row;
                const row = cb.closest('tr');

                if (savedState[key]) {
                    cb.checked = true;
                    if(row) row.classList.add('selected-row');
                }
                cb.addEventListener('change', () => {
                    savedState[key] = cb.checked;
                    if(row) {
                        if(cb.checked) row.classList.add('selected-row');
                        else row.classList.remove('selected-row');
                    }
                    localStorage.setItem('cs_lab_' + labId, JSON.stringify(savedState));
                    updateLabScore(container, savedState, labId);
                });
            });

            updateLabScore(container, savedState, labId);
        });
    }

    function updateLabScore(container, state, labId) {
        let total = 0;
        let max = 0;
        container.querySelectorAll('.lab-checkbox').forEach(cb => {
            const points = parseFloat(cb.dataset.points || "0");
            max += points;
            const key = cb.dataset.row;
            if (state[key]) {
                total += points;
            }
        });

        const scoreSpan = container.querySelector('.lab-score-value');
        if (scoreSpan) scoreSpan.innerText = total + " / " + max;

        const feedbackDiv = container.querySelector('.lab-feedback');
        if (feedbackDiv) {
            if (total < max * 0.5) {
                feedbackDiv.innerHTML = "🔴 Refuerza los pasos del laboratorio, revisa la guía y repite el ejercicio.";
                feedbackDiv.style.backgroundColor = "#ffe6e6";
                feedbackDiv.style.borderLeftColor = "#ff4444";
            } else if (total < max * 0.75) {
                feedbackDiv.innerHTML = "🟡 Buen trabajo. Revisa los criterios no marcados antes de avanzar.";
                feedbackDiv.style.backgroundColor = "#fffde7";
                feedbackDiv.style.borderLeftColor = "#ffbb00";
            } else {
                feedbackDiv.innerHTML = "🟢 Excelente ejecución. Estás listo para compartir y criticar modelos de otros.";
                feedbackDiv.style.backgroundColor = "#e8f5e9";
                feedbackDiv.style.borderLeftColor = "#00cc00";
            }
        }

        if (labId) {
            localStorage.setItem('cs_lab_total_' + labId, JSON.stringify({ score: total, max: max }));
            initPartProgress(); // Actualizar tablero de progreso en tiempo real
        }
    }

    function initPartProgress() {
        const containers = document.querySelectorAll('.part-progress-container');
        containers.forEach(container => {
            const rows = container.querySelectorAll('.part-progress-row');

            rows.forEach(row => {
                const key = row.dataset.key;
                let stored = null;
                if (key.startsWith('cap')) {
                    const chapterId = key.replace('cap', '');
                    stored = localStorage.getItem('cs_tracker_total_' + chapterId);
                } else if (key.startsWith('lab')) {
                    const labId = key;
                    stored = localStorage.getItem('cs_lab_total_' + labId);
                }

                let score = 0;
                let max = parseFloat(row.dataset.max || "0");
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        score = parsed.score || 0;
                        if (!max && parsed.max) {
                            max = parsed.max;
                        }
                    } catch(e) {}
                }

                const percent = max ? Math.min(100, Math.round((score / max) * 100)) : 0;
            const fill = row.querySelector('.part-progress-fill');
            const valueSpan = row.querySelector('.part-progress-value');
            if (fill) {
                fill.style.width = percent + "%";
                // Lógica de Semáforo
                if (percent < 50) {
                    fill.style.backgroundColor = "#ff4444"; // Rojo
                } else if (percent < 80) {
                    fill.style.backgroundColor = "#ffbb00"; // Amarillo
                } else {
                    fill.style.backgroundColor = "#00cc00"; // Verde
                }
            }
            if (valueSpan) valueSpan.innerText = score + " / " + max;
            });
        });
    }

    function initQuizzes() {
        const quizzes = document.querySelectorAll('.quiz-block');
        quizzes.forEach((quiz, index) => {
            const quizId = quiz.dataset.quizId || ('quiz-' + index);
            const options = quiz.querySelectorAll('.quiz-option');
            const feedback = quiz.querySelector('.quiz-feedback');

            let saved = null;
            try {
                saved = JSON.parse(localStorage.getItem('cs_quiz_' + quizId) || 'null');
            } catch(e) {
                saved = null;
            }

            if (saved) {
                options.forEach(opt => {
                    if (opt.dataset.optionId === saved.selected) {
                        opt.classList.add(saved.correct ? 'correct' : 'incorrect');
                    }
                });
                if (feedback) {
                    feedback.textContent = saved.correct
                        ? "🟢 Respuesta correcta. Puedes pasar al siguiente desafío."
                        : "🔴 Respuesta incorrecta. Revisa la sección y vuelve a intentarlo.";
                    feedback.classList.add(saved.correct ? 'correct' : 'incorrect');
                }
            }

            options.forEach(opt => {
                opt.addEventListener('click', () => {
                    options.forEach(o => o.classList.remove('correct', 'incorrect'));
                    feedback && feedback.classList.remove('correct', 'incorrect');

                    const isCorrect = opt.dataset.correct === "true";
                    opt.classList.add(isCorrect ? 'correct' : 'incorrect');

                    if (feedback) {
                        feedback.textContent = isCorrect
                            ? "🟢 Respuesta correcta. Puedes pasar al siguiente desafío."
                            : "🔴 Respuesta incorrecta. Revisa la sección y vuelve a intentarlo.";
                        feedback.classList.add(isCorrect ? 'correct' : 'incorrect');
                    }

                    localStorage.setItem('cs_quiz_' + quizId, JSON.stringify({
                        selected: opt.dataset.optionId || "",
                        correct: isCorrect
                    }));
                });
            });
        });
    }

    function initMermaidZoom() {
        const diagrams = document.querySelectorAll('.mermaid');
        diagrams.forEach(diagram => {
            if (diagram.closest('.mermaid-zoom-wrapper')) {
                return;
            }
            const wrapper = document.createElement('div');
            wrapper.className = 'mermaid-zoom-wrapper';
            const parent = diagram.parentNode;
            parent.insertBefore(wrapper, diagram);
            wrapper.appendChild(diagram);
            
            // Leyenda de zoom
            const legend = document.createElement('div');
            legend.className = 'mermaid-zoom-legend';
            legend.innerHTML = '🔍 Haz clic para ampliar el diagrama';
            wrapper.appendChild(legend);

            wrapper.addEventListener('click', () => openMermaidOverlay(diagram));
        });
    }

    function openMermaidOverlay(diagram) {
        const existing = document.getElementById('mermaid-zoom-overlay');
        if (existing) {
            existing.remove();
        }
        const overlay = document.createElement('div');
        overlay.id = 'mermaid-zoom-overlay';
        overlay.className = 'mermaid-zoom-overlay';
        const clone = diagram.cloneNode(true);
        overlay.appendChild(clone);
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mermaid-zoom-close';
        closeBtn.textContent = '×';
        overlay.appendChild(closeBtn);
        closeBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
        document.body.appendChild(overlay);
    }
});
</script>
"""

def read_file(filepath):
    if not os.path.exists(filepath):
        return f"<p style='color:red'>[Archivo no encontrado: {filepath}]</p>"
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def markdown_to_html_simple(md_text):
    # Muy básico conversor MD a HTML para no depender de librerías externas
    
    # 1. Procesamiento de Tablas (Antes que nada para evitar romper el layout)
    lines = md_text.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        stripped_line = line.strip()
        
        # Detectar inicio de tabla: Linea con pipes + Siguiente linea con --- y pipes
        # Se asume que una tabla tiene al menos Header y Separator
        if "|" in stripped_line and i + 1 < len(lines):
            next_line = lines[i+1].strip()
            # Verificación básica de estructura de tabla MD (|---|---|)
            # Permitimos '-' y ':' (para alineación)
            if "|" in next_line and set(next_line.replace('|', '').replace(' ', '')) <= {'-', ':'}:
                # Es una tabla
                header_cells = [h.strip() for h in stripped_line.strip('|').split('|')]
                
                table_html = "<table>\n<thead>\n<tr>"
                for h in header_cells:
                    table_html += f"<th>{h}</th>"
                table_html += "</tr>\n</thead>\n<tbody>\n"
                
                i += 2 # Saltar header y separator
                
                # Procesar cuerpo
                while i < len(lines):
                    body_line = lines[i].strip()
                    # Si la línea está vacía o no tiene pipes, se acaba la tabla
                    if not body_line or "|" not in body_line:
                        break 
                    
                    cells = [c.strip() for c in body_line.strip('|').split('|')]
                    table_html += "<tr>"
                    for c in cells:
                        table_html += f"<td>{c}</td>"
                    # Rellenar celdas faltantes si hay menos columnas que en el header
                    missing_cols = len(header_cells) - len(cells)
                    for _ in range(missing_cols):
                         table_html += "<td></td>"
                         
                    table_html += "</tr>\n"
                    i += 1
                
                table_html += "</tbody>\n</table>"
                new_lines.append(table_html)
                continue
        
        new_lines.append(line)
        i += 1
    
    html = '\n'.join(new_lines)
    
    # Code blocks (simple)
    # Protection strategy: Extract code blocks, process text, restore code blocks
    code_blocks = {}
    
    def store_code_block(match):
        key = f"__CODE_BLOCK_{len(code_blocks)}__"
        code_blocks[key] = match.group(0)
        return key

    # Protect code blocks (```...```)
    html = re.sub(r'```(.*?)```', store_code_block, html, flags=re.DOTALL)
    
    # Also protect raw <div class="mermaid">...</div> blocks if they exist in source
    def store_mermaid_div(match):
        key = f"__MERMAID_DIV_{len(code_blocks)}__"
        code_blocks[key] = match.group(0)
        return key
        
    html = re.sub(r'<div class="mermaid">.*?</div>', store_mermaid_div, html, flags=re.DOTALL)

    # Protect <script> and <style> blocks to prevent Markdown interference
    html = re.sub(r'<script.*?>.*?</script>', store_code_block, html, flags=re.DOTALL | re.IGNORECASE)
    html = re.sub(r'<style.*?>.*?</style>', store_code_block, html, flags=re.DOTALL | re.IGNORECASE)

    # --- Processing Text ---

    # Headers
    html = re.sub(r'^# (.*)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.*)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^### (.*)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    
    # Bold & Italic
    html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.*?)\*', r'<em>\1</em>', html)
    
    # [YA PROCESADO EXTERNAMENTE] Links [text](url) -> <a href="url">text</a>
    # html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', html)
    
    # Lists (Basic)
    html = re.sub(r'^\* (.*)$', r'<ul><li>\1</li></ul>', html, flags=re.MULTILINE)
    html = html.replace('</ul>\n<ul>', '') # Merge lists
    
    # Paragraphs (line breaks) - ONLY applied to non-protected text
    html = re.sub(r'\n\n', '<br><br>', html)

    # --- Restore Blocks ---
    
    # Restore blocks
    for key, content in code_blocks.items():
        html = html.replace(key, content)

    # Now convert markdown code blocks to HTML
    html = re.sub(r'```(.*?)(\n.*?)```', r'<pre><code class="language-\1">\2</code></pre>', html, flags=re.DOTALL)
    
    # Mermaid blocks
    html = re.sub(r'<pre><code class="language-mermaid">\n(.*?)\n</code></pre>', r'<div class="mermaid">\n\1\n</div>', html, flags=re.DOTALL)
    
    return html

def process_lab_markers(content, root_dir):
    """
    Busca marcadores {{INSERTAR_LABORATORIO:lab_XX}} y los reemplaza con el contenido real del laboratorio.
    """
    pattern = r'\{\{INSERTAR_LABORATORIO:(\w+)\}\}'
    
    def replace_match(match):
        lab_name = match.group(1)
        # Buscar en la estructura de laboratorios
        # Asumimos que están en ROOT_DIR/laboratorios/lab_name/
        # Nota: ROOT_DIR aquí es LIBRO_BORRADOR
        lab_path = os.path.join(root_dir, "laboratorios", lab_name)
        
        # Buscar cualquier archivo .md en ese directorio (priorizando guia_lab_XX.md o README.md)
        lab_file = None
        if os.path.exists(lab_path):
            # Priorizar guia_lab_XX.md
            possible_files = [f for f in os.listdir(lab_path) if f.startswith("guia_lab") and f.endswith(".md")]
            if possible_files:
                lab_file = os.path.join(lab_path, possible_files[0])
            else:
                # Si no, buscar README.md u otro .md
                for file in os.listdir(lab_path):
                    if file.endswith(".md"):
                        lab_file = os.path.join(lab_path, file)
                        break
        
        if lab_file and os.path.exists(lab_file):
            try:
                with open(lab_file, 'r', encoding='utf-8') as f:
                    lab_content = f.read()
                    # Convertir markdown del lab a HTML (esto se hará en el paso final, 
                    # pero aquí solo insertamos el texto crudo para que sea procesado junto con el resto)
                    return f'\n\n<div class="lab-container">\n<div class="lab-header">🔬 LABORATORIO: {lab_name.upper()}</div>\n\n{lab_content}\n\n</div>\n'
            except Exception as e:
                return f"\n\n> ⚠️ **ERROR AL INSERTAR LABORATORIO {lab_name}:** {str(e)}\n\n"
        else:
            return f"\n\n> ⚠️ **ADVERTENCIA:** No se encontró el archivo del laboratorio '{lab_name}' en {lab_path}\n\n"

    return re.sub(pattern, replace_match, content)

def generate_book():
    content_html = ""
    
    # 1. Portada
    content_html += """
    <div class="cover-page">
        <div class="cover-title">CyberSentinel</div>
        <div class="cover-subtitle">Manual de Operaciones de Ciberseguridad e IA</div>
        <img src="../assets/logo.svg" class="cover-logo" alt="CyberSentinel Logo">
        <div class="mermaid">
        flowchart TD
            subgraph ACTORS ["Actores"]
                Alice["Cliente (Alice)"]
                Attacker["Atacante"]
            end

            subgraph SYSTEM ["Sistema Bancario"]
                App["App Móvil"]
                API["API Gateway"]
                DB[("Base de Datos")]
            end

            %% Happy Path
            Alice -->|"1. Login & Transferir $50"| App
            App -->|"2. POST /transfer"| API
            API -->|"3. Validar Saldo"| DB
            DB -->|"4. OK"| API
            API -->|"5. Ejecutar"| DB
            
            %% Threat Vectors
            Attacker -.->|"A. Spoofing (Robo de Identidad)"| App
            Attacker -.->|"C. Info Disclosure (Enumeración)"| API
            
            Attacker -.->|"B. Tampering (Interceptar)"| ManInMiddle{{"Red Insegura"}}
            App --> ManInMiddle
            ManInMiddle -.->|"Modificar: $1000"| API
            
            Attacker -.->|"E. Elevation (Monto negativo)"| API
            Attacker -.->|"D. DoS (1M peticiones)"| API

            %% Styling
            linkStyle 0,1,2,3,4 stroke:#0f0,stroke-width:2px,color:green;
            style Alice fill:#cfc,stroke:#333
            style Attacker fill:#f99,stroke:#333
            style ManInMiddle fill:#f96,stroke:#333
        </div>
        <div class="cover-author">Jairo David Perdomo García</div>
    </div>
    """

    # 2. Índice y Capítulos (Orden manual para asegurar secuencia)
    chapters = [
        ("LIBRO_BORRADOR/README.md", "Introducción y Tabla de Contenidos"),
        
        # Separador Volumen 1
        ("SEPARATOR", "VOLUMEN 1: FUNDAMENTOS UNIVERSALES"),
        
        # Parte 0
        ("LIBRO_BORRADOR/volumen_01/parte_00_preparacion/capitulo_00_introduccion/README.md", "Capítulo 00"),
        ("LIBRO_BORRADOR/volumen_01/parte_00_preparacion/capitulo_01_laboratorio/README.md", "Capítulo 01"),
        # Laboratorio 01 se inserta dentro del Capítulo 01
        ("LIBRO_BORRADOR/volumen_01/parte_00_preparacion/capitulo_02_fundamentos_tecnicos/README.md", "Capítulo 02"),
        ("LIBRO_BORRADOR/volumen_01/parte_00_preparacion/capitulo_03_ia_ml_vocabulario/README.md", "Capítulo 03"),
        
        # Parte 1
        ("LIBRO_BORRADOR/volumen_01/parte_01_modelado/capitulo_04_modelado_amenazas/README.md", "Capítulo 04"),
        ("LIBRO_BORRADOR/volumen_01/parte_01_modelado/capitulo_05_analisis_riesgos/README.md", "Capítulo 05"),
        ("LIBRO_BORRADOR/volumen_01/parte_01_modelado/capitulo_06_diagramacion/README.md", "Capítulo 06"),
        
        # Parte 2
        ("LIBRO_BORRADOR/volumen_01/parte_02_defensa/capitulo_07_arquitecturas_red/README.md", "Capítulo 07"),
        ("LIBRO_BORRADOR/volumen_01/parte_02_defensa/capitulo_08_ids_ips/README.md", "Capítulo 08"),
        ("LIBRO_BORRADOR/volumen_01/parte_02_defensa/capitulo_09_hardening/README.md", "Capítulo 09"),
        
        # Parte 3
        ("LIBRO_BORRADOR/volumen_01/parte_03_moderna/capitulo_10_ml_anomalias/README.md", "Capítulo 10"),
        ("LIBRO_BORRADOR/volumen_01/parte_03_moderna/capitulo_11_threat_hunting/README.md", "Capítulo 11"),
        ("LIBRO_BORRADOR/volumen_01/parte_03_moderna/capitulo_12_vision_computacional/README.md", "Capítulo 12"),
        
        # Parte 4
        ("LIBRO_BORRADOR/volumen_01/parte_04_ia_aplicada/capitulo_13_llms/README.md", "Capítulo 13"),
        ("LIBRO_BORRADOR/volumen_01/parte_04_ia_aplicada/capitulo_14_scripting_python/README.md", "Capítulo 14"),
        ("LIBRO_BORRADOR/volumen_01/parte_04_ia_aplicada/capitulo_15_soar/README.md", "Capítulo 15"),
        
        # Parte 5
        ("LIBRO_BORRADOR/volumen_01/parte_05_profesional/capitulo_16_grc_etica/README.md", "Capítulo 16"),
        ("LIBRO_BORRADOR/volumen_01/parte_05_profesional/capitulo_17_comunicacion/README.md", "Capítulo 17"),
        ("LIBRO_BORRADOR/volumen_01/parte_05_profesional/capitulo_18_carrera/README.md", "Capítulo 18"),
        
        ("LIBRO_BORRADOR/volumen_01/APENDICE_A_MANIFIESTO.md", "Apéndice A: El Manifiesto del Centinela"),

        # Separador Volumen 2
        ("SEPARATOR", "VOLUMEN 2: APLICACIÓN EN SECTORES CRÍTICOS"),
        
        ("LIBRO_BORRADOR/volumen_02/seccion_a_robotica/README.md", "Sección A"),
        ("LIBRO_BORRADOR/volumen_02/seccion_b_medicina/README.md", "Sección B"),
        ("LIBRO_BORRADOR/volumen_02/seccion_c_aeroespacial/README.md", "Sección C"),
        ("LIBRO_BORRADOR/volumen_02/seccion_d_infraestructura/README.md", "Sección D"),
        ("LIBRO_BORRADOR/volumen_02/seccion_e_financiero/README.md", "Sección E"),
        ("LIBRO_BORRADOR/volumen_02/seccion_f_ia_seguridad/README.md", "Sección F"),
        ("LIBRO_BORRADOR/volumen_02/seccion_g_proyecto/README.md", "Sección G"),
        
        ("LIBRO_BORRADOR/glosario/README.md", "Glosario"),
        ("LIBRO_BORRADOR/proyecto_capstone/README.md", "Capstone"),
        # ("LIBRO_BORRADOR/volumen_01/APENDICE_A_MANIFIESTO.md", "Apéndice A: El Manifiesto del Centinela"), # Moved up
        ("LIBRO_BORRADOR/apendices/README.md", "Apéndices"),
        ("LIBRO_BORRADOR/RECURSOS.md", "Recursos y Herramientas"),
    ]

    for path, title in chapters:
        if path == "SEPARATOR":
            content_html += f"""
            <div class="volume-separator">
                <h1>{title}</h1>
            </div>
            """
            continue

        # Ajustar ruta relativa si estamos corriendo desde root
        full_path = path
        if not os.path.exists(full_path):
             # Intentar corregir path si script corre dentro de J:\CyberSentinel-AI-Academy
             full_path = os.path.join(os.getcwd(), path)
        
        # print(f"Procesando: {full_path}") # DEBUG

        
        raw_md = read_file(full_path)
        # Inyectar ID para el archivo principal (para enlaces internos)
        filename = os.path.basename(full_path)
        if filename.lower() == "readme.md":
            # Usar el nombre del directorio padre como ID único para evitar colisiones de README.md
            main_id = os.path.basename(os.path.dirname(full_path))
        else:
            main_id = filename
            
        raw_md = f'<span id="{main_id}"></span>\n\n' + raw_md
        
        # Lógica para incluir archivos adicionales (conceptos) en el mismo directorio
        # Solo si es un archivo de capítulo (no la raíz ni separadores)
        # [MODIFICADO] Permitir también apendices
        is_chapter = "capitulo_" in full_path
        is_appendix = "apendices" in full_path
        
        if (is_chapter or is_appendix) and os.path.basename(full_path).lower() == "readme.md":
            chapter_dir = os.path.dirname(full_path)
            try:
                # Listar otros archivos .md en el directorio, ordenados alfabéticamente
                for filename in sorted(os.listdir(chapter_dir)):
                    if filename.lower().endswith(".md") and filename.lower() != "readme.md":
                        extra_file_path = os.path.join(chapter_dir, filename)
                        # print(f"  -> Incluyendo extra: {filename}") # DEBUG
                        # Inyectar ID para cada sub-archivo
                        raw_md += f'\n\n<span id="{filename}"></span>\n\n' + read_file(extra_file_path)
            except OSError:
                pass
        
        # Procesar marcadores de laboratorio ANTES de convertir a HTML
        raw_md = process_lab_markers(raw_md, ROOT_DIR)
        
        # Eliminar título duplicado si es el primer capítulo (README)
        if "LIBRO_BORRADOR/README.md" in full_path or "LIBRO_BORRADOR\\README.md" in full_path:
             # Remove the first H1 line (# Title)
             raw_md = re.sub(r'^# .*?\n', '', raw_md, count=1, flags=re.MULTILINE)
             # Clean up leading whitespace
             raw_md = raw_md.lstrip()
        
        # [MODIFICADO] Ya no eliminamos los links. Permitimos navegación interna y externa.
        # raw_md = re.sub(r'\[(.*?)\]\((.*?)\)', r'<strong>\1</strong>', raw_md)

        # Convertir links a archivos .md locales en anclas internas
        def replace_link(match):
            text = match.group(1)
            url = match.group(2)
            
            # Si es un link a un archivo markdown local (no http/https)
            if url.endswith('.md') and not url.startswith(('http://', 'https://')):
                filename = os.path.basename(url)
                
                # Lógica coincidente con la generación de IDs:
                if filename.lower() == 'readme.md':
                    # Usar el nombre del directorio padre si es un README
                    # url podría ser "ruta/a/carpeta/README.md" -> ID "carpeta"
                    target_id = os.path.basename(os.path.dirname(url))
                    
                    # Caso especial: Si la url es solo "README.md" (en el mismo dir),
                    # necesitamos el contexto del archivo actual para saber el ID.
                    # PERO, como estamos uniendo todo, los links relativos "README.md" 
                    # usualmente apuntan al índice del capítulo actual.
                    # Si target_id está vacío (porque url="README.md"), intentamos usar el contexto.
                    if not target_id:
                        # Fallback arriesgado, mejor dejarlo vacío o intentar deducir.
                        # En este script simple, asumimos que los links en el TOC son completos.
                        target_id = "README.md" 
                else:
                    target_id = filename
                    
                return f'<a href="#{target_id}">{text}</a>'
            
            # CORRECCIÓN DE RUTAS: Ajustar enlaces a WEB_PLATFORM para que funcionen desde manual/
            if "../WEB_PLATFORM/" in url:
                url = url.replace("../WEB_PLATFORM/", "../")

            # Si es un link externo o normal, usar la conversión estándar
            return f'<a href="{url}">{text}</a>'

        def replace_image(match):
            alt_text = match.group(1)
            url = match.group(2)
            
            # Ajustar rutas para imágenes también
            if "../WEB_PLATFORM/" in url:
                url = url.replace("../WEB_PLATFORM/", "../")
                
            return f'<img src="{url}" alt="{alt_text}" style="max-width:100%; border: 1px solid #333; border-radius: 5px; margin: 10px 0;">'

        # 1. Procesar imágenes PRIMERO para evitar conflictos con links
        # Regex: ![alt](url)
        raw_md = re.sub(r'!\[(.*?)\]\((.*?)\)', replace_image, raw_md)

        # 2. Procesar links (ignorando lo que ya se convirtió a <img> o usando lookbehind si fuera necesario)
        # Como ya convertimos las imágenes a etiquetas <img>, la regex de links `[text](url)` 
        # no coincidirá con `![text](url)` porque el `!` ya no está (ahora es `<img...`).
        # PERO, si queda alguna sintaxis markdown pura, usamos lookbehind para seguridad.
        raw_md = re.sub(r'(?<!\!)\[(.*?)\]\((.*?)\)', replace_link, raw_md)
        
        # Procesar resto del markdown
        chapter_html = markdown_to_html_simple(raw_md) # Nota: markdown_to_html_simple ya no debe tocar los links <a> generados
        
        content_html += f"<div class='chapter'>{chapter_html}</div>"

    # 3. Ensamblar HTML final
    final_html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>CyberSentinel Manual</title>
        <link rel="icon" type="image/svg+xml" href="../assets/logo.svg">
        {CSS_STYLE}
    </head>
    <body>
        {content_html}
        {MERMAID_SCRIPT}
    </body>
    </html>
    """

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(final_html)
    
    print(f"Libro generado exitosamente en: {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_book()
