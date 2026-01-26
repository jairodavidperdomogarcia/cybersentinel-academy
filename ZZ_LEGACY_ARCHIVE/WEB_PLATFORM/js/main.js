// Easter Egg para Hackers Éticos
console.log(
    "%c🛡️ CyberEcosystem Security Protocol Initiated",
    "color: #00B4D8; font-family: monospace; font-size: 16px; font-weight: bold;"
);
console.log(
    "%c¿Buscas vulnerabilidades? Recuerda reportarlas en nuestro programa de Bug Bounty. Happy Hacking! 🕵️‍♂️",
    "color: #A0AEC0; font-family: monospace;"
);

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }

    // Mobile Dropdown Toggle
    const navDropdown = document.querySelector('.nav-dropdown');
    if (navDropdown) {
        navDropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (e.target === this || e.target.matches('.nav-link')) {
                    e.preventDefault();
                }
                this.classList.toggle('active');
            }
        });
    }

    // Ticker Expand (Mobile)
    const heroTicker = document.querySelector('.hero-ticker');
    if (heroTicker) {
        heroTicker.addEventListener('click', function() {
            if(window.innerWidth <= 768) {
                this.classList.toggle('expanded');
                this.style.height = this.classList.contains('expanded') ? 'auto' : 'initial';
                this.style.whiteSpace = this.classList.contains('expanded') ? 'normal' : 'nowrap';
            }
        });
    }

    // Search Input Animation
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        const placeholders = [
            "¿Qué necesitas hoy? (empleo...)",
            "¿Qué necesitas hoy? (experto...)",
            "¿Qué necesitas hoy? (alerta...)",
            "¿Qué necesitas hoy? (curso...)"
        ];
        let placeholderIndex = 0;

        setInterval(() => {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            searchInput.setAttribute('placeholder', placeholders[placeholderIndex]);
        }, 3000);
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Performance Metrics Monitor
    const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                    window.performance.timing.navigationStart;
    console.log(`🚀 Página cargada en ${loadTime}ms`);
    
    if (loadTime > 2000) {
        console.warn('⚠️ Considerar optimizar assets para mejor performance');
    }

    // Inicializar actualización del ticker y KPIs
    initStatusRefresh();
});

// --- Estado en tiempo (semi) real del ticker ---
function initStatusRefresh() {
    const threatEl = document.getElementById('threat-level');
    const alertEl = document.getElementById('last-alert');
    const expertsEl = document.getElementById('live-experts');
    const jobsEl = document.getElementById('live-jobs');
    const companiesEl = document.getElementById('live-companies');

    const levelColor = (lvl) => {
        switch((lvl || '').toUpperCase()) {
            case 'BAJO': return '#4CAF50';
            case 'MEDIO': return '#FFC107';
            case 'ALTO': return '#FF5722';
            case 'CRITICO': return '#E53935';
            default: return '#A0AEC0';
        }
    };

    const updateDom = (data) => {
        if (threatEl && data.threat_level) {
            threatEl.textContent = `${data.threat_emoji || '🟢'} Nivel de amenaza global: ${data.threat_level}`;
            threatEl.style.color = levelColor(data.threat_level);
        }
        if (alertEl && (data.last_alert || data.last_alert_time)) {
            const suffix = data.last_alert_time ? ` (${data.last_alert_time})` : '';
            alertEl.textContent = `Última alerta: ${data.last_alert || '—'}${suffix}`;
        }
        if (expertsEl && data.kpis && typeof data.kpis.experts_active === 'number') {
            expertsEl.textContent = data.kpis.experts_active.toLocaleString('es-ES');
        }
        if (jobsEl && data.kpis && typeof data.kpis.offers_open === 'number') {
            jobsEl.textContent = data.kpis.offers_open.toLocaleString('es-ES');
        }
        if (companiesEl && data.kpis && typeof data.kpis.companies_registered === 'number') {
            companiesEl.textContent = data.kpis.companies_registered.toLocaleString('es-ES');
        }
    };

    const fetchStatus = async () => {
        try {
            const res = await fetch('/.netlify/functions/get-threat-feed', { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            updateDom(data);
        } catch (err) {
            console.warn('No se pudo actualizar el estado:', err);
        }
    };

    // Primera carga y auto-refresh (60s)
    fetchStatus();
    setInterval(fetchStatus, 60000);
}

