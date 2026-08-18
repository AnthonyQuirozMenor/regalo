/* ==========================================================================
   UNIVERSO 3D DE CUMPLEAÑOS PARA UN AMIGO (BRO / HERMANO)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURACIÓN EDICIÓN AMIGO (Personaliza todo fácilmente aquí)
   -------------------------------------------------------------------------- */
const CONFIG = {
    // Nombre y Subtítulo del cumpleañero
    NOMBRE_AMIGO: "MÁQUINA",
    SUBTITULO: "El mejor bro de todos 🔥",

    // Cantidad de elementos flotantes en espacio 3D
    CANTIDAD_FRASES_DESKTOP: 450,
    CANTIDAD_FRASES_MOBILE: 180,
    
    CANTIDAD_PARTICULAS_DESKTOP: 2500,
    CANTIDAD_PARTICULAS_MOBILE: 900,

    // Paleta de colores Neón Cyber Party
    COLOR_CYAN: "#00f0ff",
    COLOR_GOLD: "#ffd700",
    COLOR_MAGENTA: "#ff0055",
    COLOR_LIME: "#39ff14",
    COLOR_WHITE: "#ffffff",

    // Categorías de Frases de Amistad y Chacota
    LISTA_DE_FRASES: [
        // --- FELICITACIONES ---
        "Feliz cumpleaños, hermano 🎉",
        "Feliz cumple, máquina 🔥",
        "Que la pases increíble, bro",
        "Un año más de vida, hermano",
        "Que cumplas muchos más 🍻",
        "Disfruta tu día al máximo",
        "Hoy se celebra en grande 🥳",
        "Que vengan muchos éxitos ✨",
        "Lo mejor para ti siempre",
        "Que todos tus proyectos se cumplan 🚀",
        "¡Un abrazo rompe costillas, bro!",
        "Hoy se bebe 🍺",

        // --- AMISTAD ---
        "Gracias por la amistad 🤜🤛",
        "Grande, hermano 👑",
        "Siempre firme",
        "Un verdadero amigo ⭐",
        "Seguimos sumando momentos",
        "Los buenos amigos se cuentan con una mano",
        "Gracias por tantos momentos inolvidables",
        "Siempre apoyando al bro 💪",
        "Muchos años de amistad",
        "Que nunca falte la buena vibra ✨",
        "Leal hasta la muerte 👊",

        // --- CHACOTA Y HUMOR ---
        "Ya estás viejo 😂",
        "Un año más cerca de la jubilación 👴",
        "¿Cuántos años ya? 💀",
        "Ya no estás para esos trotes 😂",
        "Otro año sobreviviendo 🦾",
        "El abuelo cumple años 👵",
        "Hoy no se duerme 🍾",
        "Se viene la celebración 🎊",
        "Invita pues 🍺",
        "¿Dónde es la fiesta?",
        "El cumpleañero paga 😎",
        "Hoy se rompe 💥",
        "Uno más para la colección 🔥",
        "Ya pide tu bastón 😂",
        "Salud por las canas 🍻",
        "Se te cae el pelo bro 💇‍♂️",
        "¿Ya te duele la espalda? 💀"
    ],

    // Lista de emojis 3D flotantes
    LISTA_EMOJIS: ["🎂", "🎉", "🎁", "🎈", "🥳", "😂", "🔥", "🍻", "⭐", "✨", "🎊", "🍺", "💀", "👑", "🚀"]
};


/* --------------------------------------------------------------------------
   2. DETECCIÓN DE RENDIMIENTO Y MÓVIL
   -------------------------------------------------------------------------- */
const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
const TOTAL_FRASES = isMobile ? CONFIG.CANTIDAD_FRASES_MOBILE : CONFIG.CANTIDAD_FRASES_DESKTOP;
const TOTAL_PARTICULAS = isMobile ? CONFIG.CANTIDAD_PARTICULAS_MOBILE : CONFIG.CANTIDAD_PARTICULAS_DESKTOP;


/* --------------------------------------------------------------------------
   3. INICIALIZACIÓN DEL MOTOR THREE.JS (ESCENA, CÁMARA, RENDERER)
   -------------------------------------------------------------------------- */
let scene, camera, renderer;
let centralCakeGroup;
let phraseSprites = [];
let particlesGeometry, particlesMesh;
let confettiBurstParticles = [];

// Manejo de interacción de mouse/touch
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 0;
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

document.addEventListener("DOMContentLoaded", () => {
    // Aplicar variables de texto al HUD
    document.getElementById("hud-friend-name").innerText = CONFIG.NOMBRE_AMIGO;
    document.getElementById("hud-sub-title").innerText = CONFIG.SUBTITULO;

    // Iniciar Three.js
    initThreeEngine();

    // Eventos de entrada
    setupEvents();
});

function initThreeEngine() {
    const container = document.getElementById("webgl-container");

    // 1. Escena
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.0004); // Niebla suave para dar ilusión de infinito

    // 2. Cámara (Perspectiva 3D)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4500);
    camera.position.set(0, 0, 1000);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Luces Neón 3D
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00f0ff, 3, 1200);
    cyanPointLight.position.set(-400, 300, 400);
    scene.add(cyanPointLight);

    const goldPointLight = new THREE.PointLight(0xffd700, 4, 1500);
    goldPointLight.position.set(400, -200, 500);
    scene.add(goldPointLight);

    const magentaPointLight = new THREE.PointLight(0xff0055, 3, 1000);
    magentaPointLight.position.set(0, 500, -300);
    scene.add(magentaPointLight);

    // 5. Crear Elemento Central 3D (Pastel Neón de Cumpleaños)
    createCentral3DCake();

    // 6. Crear Nube de Frases 3D (Text Sprites en X, Y, Z)
    create3DTextCloud();

    // 7. Crear Sistema de Partículas 3D (Polvo Espacial / Estrellas)
    create3DParticleSystem();

    // Loop de animación
    animate();
}


/* --------------------------------------------------------------------------
   4. CREACIÓN DEL ELEMENTO CENTRAL 3D (PASTEL NEÓN FESTIVO)
   -------------------------------------------------------------------------- */
function createCentral3DCake() {
    centralCakeGroup = new THREE.Group();

    // Materiales Neón y Metálicos
    const matGold = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.8,
        roughness: 0.2,
        emissive: 0xaa7700,
        emissiveIntensity: 0.3
    });

    const matCyan = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        metalness: 0.6,
        roughness: 0.3,
        emissive: 0x00a8ff,
        emissiveIntensity: 0.4
    });

    const matMagenta = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0xff0055,
        emissiveIntensity: 0.5
    });

    const matFlame = new THREE.MeshBasicMaterial({
        color: 0xffea00
    });

    // Base Nivel 1 del Pastel (Grande)
    const baseTier = new THREE.Mesh(new THREE.CylinderGeometry(140, 150, 60, 32), matCyan);
    baseTier.position.y = -60;
    centralCakeGroup.add(baseTier);

    // Nivel 2 del Pastel (Mediano)
    const midTier = new THREE.Mesh(new THREE.CylinderGeometry(100, 105, 50, 32), matGold);
    midTier.position.y = -5;
    centralCakeGroup.add(midTier);

    // Nivel 3 del Pastel (Superior)
    const topTier = new THREE.Mesh(new THREE.CylinderGeometry(65, 70, 40, 32), matMagenta);
    topTier.position.y = 40;
    centralCakeGroup.add(topTier);

    // Velas Neón y Fuego
    const candlePositions = [
        { x: -30, z: -30 }, { x: 30, z: -30 },
        { x: -30, z: 30 },  { x: 30, z: 30 },
        { x: 0, z: 0 }
    ];

    candlePositions.forEach(pos => {
        // Vela
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 30, 16), matGold);
        candle.position.set(pos.x, 75, pos.z);
        centralCakeGroup.add(candle);

        // Llama de fuego brillante
        const flame = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 16), matFlame);
        flame.position.set(pos.x, 93, pos.z);
        flame.scale.set(1, 1.6, 1);
        centralCakeGroup.add(flame);
    });

    // Anillo de Luz Orbital Neón al rededor del pastel
    const ringGeo = new THREE.TorusGeometry(190, 3, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -30;
    centralCakeGroup.add(ringMesh);

    // Escala inicial
    centralCakeGroup.position.set(0, 0, 0);
    scene.add(centralCakeGroup);
}


/* --------------------------------------------------------------------------
   5. CREADOR DE TEXT SPRITES EN 3D (FRASES Y EMOJIS FLOTANTES)
   -------------------------------------------------------------------------- */
function create3DTextCloud() {
    const totalItems = TOTAL_FRASES;
    const phraseList = CONFIG.LISTA_DE_FRASES;
    const emojiList = CONFIG.LISTA_EMOJIS;

    for (let i = 0; i < totalItems; i++) {
        const isEmoji = Math.random() < 0.25; // 25% de probabilidad de ser un emoji 3D solo
        let textContent, fontColor, glowColor, fontSize;

        if (isEmoji) {
            textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
            fontColor = "#ffffff";
            glowColor = CONFIG.COLOR_GOLD;
            fontSize = 75;
        } else {
            textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
            // Alternar colores neón para dinamismo
            const colorType = i % 4;
            if (colorType === 0) { fontColor = "#ffffff"; glowColor = CONFIG.COLOR_CYAN; }
            else if (colorType === 1) { fontColor = CONFIG.COLOR_GOLD; glowColor = "#ffaa00"; }
            else if (colorType === 2) { fontColor = "#ffffff"; glowColor = CONFIG.COLOR_MAGENTA; }
            else { fontColor = CONFIG.COLOR_LIME; glowColor = "#00ff66"; }
            fontSize = 38;
        }

        // Generar Texture Sprite en Canvas 2D
        const sprite = createTextSprite(textContent, fontSize, fontColor, glowColor);

        // Distribuir en Espacio 3D (Coordenadas X, Y, Z)
        // Usamos una distribución esférica/cúbica profunda para máxima sensación 3D
        const radius = Math.random() * 1400 + 350;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
        sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
        sprite.position.z = radius * Math.cos(phi);

        // Guardar velocidad de movimiento suave individual
        sprite.userData = {
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            speedZ: (Math.random() - 0.5) * 0.4,
            pulseOffset: Math.random() * Math.PI * 2
        };

        // Opacidad sutil según la profundidad Z
        const zDist = Math.abs(sprite.position.z);
        sprite.material.opacity = Math.max(0.35, 1 - (zDist / 2200));

        scene.add(sprite);
        phraseSprites.push(sprite);
    }
}

// Función Auxiliar: Convierte Texto a Canvas Texture para Three.js Sprite
function createTextSprite(text, fontSize, fontColor, glowColor) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Configurar canvas HD
    canvas.width = 600;
    canvas.height = 140;

    ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Resplandor Neón
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = fontColor;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Segunda capa para intensificar el neón
    ctx.shadowBlur = 8;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // Crear Textura Three.js
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    // Escalar sprite proporcionalmente
    const scaleFactor = fontSize > 50 ? 1.4 : 1.0;
    sprite.scale.set(300 * scaleFactor, 70 * scaleFactor, 1);

    return sprite;
}


/* --------------------------------------------------------------------------
   6. SISTEMA DE PARTÍCULAS 3D (POLVO ESTELAR / ESTRELLAS)
   -------------------------------------------------------------------------- */
function create3DParticleSystem() {
    const particleCount = TOTAL_PARTICULAS;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
        new THREE.Color(0x00f0ff),
        new THREE.Color(0xffd700),
        new THREE.Color(0xff0055),
        new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < particleCount; i++) {
        // Coordenadas aleatorias en caja 3D gigantesca
        positions[i * 3] = (Math.random() - 0.5) * 3500;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 3500;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 3500;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: isMobile ? 4 : 6,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
}


/* --------------------------------------------------------------------------
   7. EXPLOSIÓN DE CONFETI Y FUEGOS ARTIFICIALES 3D
   -------------------------------------------------------------------------- */
function trigger3DExplosion(originX, originY, originZ, count = 120) {
    for (let i = 0; i < count; i++) {
        const isEmoji = Math.random() < 0.2;
        let sprite;

        if (isEmoji) {
            const emoji = CONFIG.LISTA_EMOJIS[Math.floor(Math.random() * CONFIG.LISTA_EMOJIS.length)];
            sprite = createTextSprite(emoji, 70, "#ffffff", CONFIG.COLOR_GOLD);
        } else {
            // Partícula de confeti de estrella brillante
            const colors = [CONFIG.COLOR_CYAN, CONFIG.COLOR_GOLD, CONFIG.COLOR_MAGENTA, CONFIG.COLOR_LIME];
            const chosenColor = colors[Math.floor(Math.random() * colors.length)];
            sprite = createTextSprite("✨", 50, chosenColor, chosenColor);
        }

        sprite.position.set(originX, originY, originZ);

        // Vector de velocidad explosiva radial 360 grados en 3D
        const angle = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const speed = Math.random() * 15 + 8;

        sprite.userData = {
            vx: Math.sin(phi) * Math.cos(angle) * speed,
            vy: Math.sin(phi) * Math.sin(angle) * speed,
            vz: Math.cos(phi) * speed,
            life: 1.0,
            decay: Math.random() * 0.02 + 0.01
        };

        scene.add(sprite);
        confettiBurstParticles.push(sprite);
    }
}


/* --------------------------------------------------------------------------
   8. LOOP PRINCIPAL DE ANIMACIÓN 60FPS
   -------------------------------------------------------------------------- */
let clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // 1. Mover cámara con suavidad (Parallax)
    targetCameraX = mouseX * 250;
    targetCameraY = -mouseY * 250;

    camera.position.x += (targetCameraX - camera.position.x) * 0.03;
    camera.position.y += (targetCameraY - camera.position.y) * 0.03;
    
    // Rotación circular orbital suave alrededor del centro
    const orbitRadius = 1000;
    camera.position.x += Math.sin(elapsedTime * 0.15) * 50;
    camera.lookAt(0, 0, 0);

    // 2. Animación del Pastel 3D Central
    if (centralCakeGroup) {
        centralCakeGroup.rotation.y = elapsedTime * 0.4;
        // Escala pulsante suave
        const scalePulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
        centralCakeGroup.scale.set(scalePulse, scalePulse, scalePulse);
    }

    // 3. Animación de las Frases 3D (Desplazamiento y Flotación)
    for (let i = 0; i < phraseSprites.length; i++) {
        const sprite = phraseSprites[i];
        const uData = sprite.userData;

        sprite.position.x += uData.speedX;
        sprite.position.y += uData.speedY;
        sprite.position.z += uData.speedZ;

        // Rebote o re-circulación suave si salen del límite 3D
        if (Math.abs(sprite.position.x) > 1600) uData.speedX *= -1;
        if (Math.abs(sprite.position.y) > 1100) uData.speedY *= -1;
        if (Math.abs(sprite.position.z) > 2200) uData.speedZ *= -1;

        // Pulso leve de escala
        const pulse = 1 + Math.sin(elapsedTime * 2 + uData.pulseOffset) * 0.05;
        const baseScaleX = sprite.scale.x;
    }

    // 4. Rotar Sistema de Partículas de Fondo
    if (particlesMesh) {
        particlesMesh.rotation.y = elapsedTime * 0.03;
        particlesMesh.rotation.x = elapsedTime * 0.015;
    }

    // 5. Animación de Partículas de Confeti de Explosión
    for (let i = 0; i < confettiBurstParticles.length; i++) {
        const p = confettiBurstParticles[i];
        const u = p.userData;

        p.position.x += u.vx;
        p.position.y += u.vy;
        p.position.z += u.vz;
        
        // Gravedad suave
        u.vy -= 0.15;
        u.life -= u.decay;
        p.material.opacity = u.life;

        if (u.life <= 0) {
            scene.remove(p);
            confettiBurstParticles.splice(i, 1);
            i--;
        }
    }

    // Renderizar escena
    renderer.render(scene, camera);
}


/* --------------------------------------------------------------------------
   9. EVENTOS DE INTERACCIÓN Y REPRODUCCIÓN DE MÚSICA
   -------------------------------------------------------------------------- */
function setupEvents() {
    // Resize ventana
    window.addEventListener('resize', onWindowResize);

    // Movimiento de mouse / Touch para la cámara
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        }
    });

    // Clicks en Pantalla (Dispara explosiones 3D en las coordenadas clicadas)
    window.addEventListener('pointerdown', (e) => {
        // Si hizo clic en un botón de interfaz, no disparar explosión 3D
        if (e.target.closest("button") || e.target.closest(".intro-box")) return;

        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        
        // Comprobar si hizo clic en el pastel 3D central
        const intersects = raycaster.intersectObjects(centralCakeGroup.children, true);

        if (intersects.length > 0) {
            // Mega explosión de fiesta en el centro
            trigger3DExplosion(0, 0, 0, 180);
            
            // Animación de pulso fuerte en el pastel
            centralCakeGroup.scale.set(1.4, 1.4, 1.4);
            setTimeout(() => {
                centralCakeGroup.scale.set(1, 1, 1);
            }, 300);
        } else {
            // Proyectar el punto de click en coordenadas 3D en el espacio
            const vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = 800;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            trigger3DExplosion(pos.x, pos.y, pos.z, 60);
        }
    });

    // Botón de Ingreso (Intro Overlay)
    const btnStart = document.getElementById("btn-start");
    const introOverlay = document.getElementById("intro-overlay");
    const uiHud = document.getElementById("ui-hud");
    const bgMusic = document.getElementById("bg-music");

    btnStart.addEventListener("click", () => {
        // Iniciar música
        bgMusic.play().catch(err => console.log("Autoplay bloqueado por el navegador:", err));

        // Transición de salida del intro
        introOverlay.classList.add("fade-out");
        
        setTimeout(() => {
            introOverlay.style.display = "none";
            uiHud.classList.remove("hidden");
            
            // Disparar explosión de bienvenida
            trigger3DExplosion(0, 0, 0, 150);
        }, 1200);
    });

    // Botón de Mute/Play Música
    const btnMusicToggle = document.getElementById("btn-music-toggle");
    const musicIcon = document.getElementById("music-icon");
    let isPlaying = true;

    btnMusicToggle.addEventListener("click", () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.className = "fa-solid fa-volume-xmark";
            isPlaying = false;
        } else {
            bgMusic.play();
            musicIcon.className = "fa-solid fa-volume-high";
            isPlaying = true;
        }
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
