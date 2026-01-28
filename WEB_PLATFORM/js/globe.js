// Basic Three.js Globe Setup (Phase 1: Static/Rotating)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 15; // Zoom out to see the globe

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry (The Globe Sphere)
    const geometry = new THREE.SphereGeometry(6, 64, 64);
    
    // Material (Wireframe/Tech look for Phase 1)
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x0A2463, 
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    // Points Material (Simulating Nodes)
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x00B4D8,
        size: 0.1
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add some random particles to simulate nodes
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15; // Random spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMesh = new THREE.Points(particlesGeometry, pointsMaterial);
    
    // Make particles form a sphere shape roughly
    const particleSphereGeo = new THREE.SphereGeometry(6.1, 32, 32);
    const particleSphereMat = new THREE.PointsMaterial({
        color: 0x00B4D8,
        size: 0.08,
        transparent: true,
        opacity: 0.6
    });
    const particleSphere = new THREE.Points(particleSphereGeo, particleSphereMat);
    scene.add(particleSphere);

    // 1. Estrellas de fondo 
    function addStars() { 
        const starGeometry = new THREE.BufferGeometry(); 
        const starCount = 1000; 
        const positions = new Float32Array(starCount * 3); 
        
        for(let i = 0; i < starCount * 3; i++) { 
            positions[i] = (Math.random() - 0.5) * 100; 
        } 
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); 
        const starMaterial = new THREE.PointsMaterial({ 
            color: 0xFFFFFF, 
            size: 0.1, 
            transparent: true, 
            opacity: 0.5 
        }); 
        
        const stars = new THREE.Points(starGeometry, starMaterial); 
        scene.add(stars); 
    } 

    // 2. Líneas de conexión entre nodos 
    function addConnectionLines() { 
        const lineGeometry = new THREE.BufferGeometry(); 
        const lineCount = 50; 
        const positions = new Float32Array(lineCount * 6); 
        
        for(let i = 0; i < lineCount * 6; i += 6) { 
            // Puntos aleatorios en esfera 
            const theta1 = Math.random() * Math.PI * 2; 
            const phi1 = Math.acos(2 * Math.random() - 1); 
            const r1 = 6.5; 
            
            const x1 = r1 * Math.sin(phi1) * Math.cos(theta1); 
            const y1 = r1 * Math.sin(phi1) * Math.sin(theta1); 
            const z1 = r1 * Math.cos(phi1); 
            
            const theta2 = Math.random() * Math.PI * 2; 
            const phi2 = Math.acos(2 * Math.random() - 1); 
            const r2 = 6.5; 
            
            const x2 = r2 * Math.sin(phi2) * Math.cos(theta2); 
            const y2 = r2 * Math.sin(phi2) * Math.sin(theta2); 
            const z2 = r2 * Math.cos(phi2); 
            
            positions[i] = x1; 
            positions[i+1] = y1; 
            positions[i+2] = z1; 
            positions[i+3] = x2; 
            positions[i+4] = y2; 
            positions[i+5] = z2; 
        } 
        
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); 
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0x00B4D8, 
            transparent: true, 
            opacity: 0.2, 
            linewidth: 1 
        }); 
        
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial); 
        scene.add(lines); 
    } 

    // 3. Puntos "calientes" interactivos 
    function addHotSpots() { 
        const hotspots = [ 
            { lat: 40.5, lon: -74, color: 0xFF6B6B, size: 0.3 }, // NYC 
            { lat: 51.5, lon: 0.1, color: 0xFF6B6B, size: 0.3 }, // London 
            { lat: 35.7, lon: 139.7, color: 0xFF6B6B, size: 0.3 }, // Tokyo 
        ]; 
        
        hotspots.forEach(hotspot => { 
            const phi = (90 - hotspot.lat) * Math.PI / 180; 
            const theta = (hotspot.lon + 180) * Math.PI / 180; 
            
            const x = 6.5 * Math.sin(phi) * Math.cos(theta); 
            const y = 6.5 * Math.cos(phi); 
            const z = 6.5 * Math.sin(phi) * Math.sin(theta); 
            
            const geometry = new THREE.SphereGeometry(hotspot.size, 16, 16); 
            const material = new THREE.MeshBasicMaterial({ 
                color: hotspot.color, 
                transparent: true, 
                opacity: 0.7 
            }); 
            
            const sphere = new THREE.Mesh(geometry, material); 
            sphere.position.set(x, y, z); 
            scene.add(sphere); 
            
            // Animación de pulso 
            function pulse() { 
                const scale = 1 + Math.sin(Date.now() * 0.002) * 0.2; 
                sphere.scale.set(scale, scale, scale); 
                requestAnimationFrame(pulse); 
            } 
            pulse(); 
        }); 
    } 

    // Llamar estas funciones después de crear el globo 
    addStars(); 
    addConnectionLines(); 
    addHotSpots();

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotation
        sphere.rotation.y += 0.002;
        particleSphere.rotation.y += 0.002;
        
        // Slight tilt
        sphere.rotation.x = 0.2;
        particleSphere.rotation.x = 0.2;

        renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
