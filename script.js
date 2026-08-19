/* ==========================================================================
   UNIVERSO 3D DE CUMPLEAÑOS PARA UN AMIGO (BRO / HERMANO)
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIGURACIÓN EDICIÓN AMIGO (Personaliza todo fácilmente aquí)
   -------------------------------------------------------------------------- */
const CONFIG = {
    // Nombre y Subtítulo del cumpleañero
    NOMBRE_AMIGO: "PABLO",
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
        "¡Feliz cumpleaños, Pablo! 🎉",
        "Feliz cumpleaños Pablo 🔥",
        "¡Felicidades Pablo! 🥳",
        "Feliz cumple Pablo 🎂",
        "Feliz cumple perri 🔥",
        "¡Feliz cumpleaños perri! 🎹",
        "Feliz cumpleaños, hermano 🎉",
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
    // Iniciar Three.js directamente al universo 3D
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

    // 5. Crear Corazón 3D de miles de bolitas rojas (Construcción en 5 segundos)
    create3DParticleHeart();

    // 6. Crear Nube de Frases 3D (Text Sprites en X, Y, Z - Ocultas al inicio)
    create3DTextCloud();

    // 7. Crear Sistema de Partículas 3D (Polvo Espacial / Estrellas)
    create3DParticleSystem();

    // Loop de animación
    animate();
}


/* --------------------------------------------------------------------------
   4. CREACIÓN DEL CORAZÓN 3D DE BOLITAS ROJAS Y ANIMACIÓN DE CONSTRUCCIÓN
   -------------------------------------------------------------------------- */
let heartGroup, heartInstancedMesh;
let heartParticleCount = isMobile ? 1200 : 2200;
let heartStartPositions = [];
let heartTargetPositions = [];
let isHeartAssembled = false;
let titleSprite;

function create3DParticleHeart() {
    heartGroup = new THREE.Group();

    // Geometría y material neón carmesí para las bolitas rojas
    const sphereGeo = new THREE.SphereGeometry(3.5, 10, 10);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0044,
        emissiveIntensity: 0.9,
        roughness: 0.2,
        metalness: 0.4
    });

    heartInstancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, heartParticleCount);
    
    const dummy = new THREE.Object3D();

    for (let i = 0; i < heartParticleCount; i++) {
        // Ecuación paramétrica para forma de corazón 3D
        const t = Math.random() * Math.PI * 2;
        const u = (Math.random() - 0.5) * Math.PI;

        let hx = 16 * Math.pow(Math.sin(t), 3) * Math.cos(u);
        let hy = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        let hz = 16 * Math.pow(Math.sin(t), 3) * Math.sin(u);

        // Escalar y añadir volumen interior estocástico
        const scale = 14;
        const jitter = (Math.random() * 0.35 + 0.65);
        
        const targetX = hx * scale * jitter;
        const targetY = hy * scale * jitter + 20;
        const targetZ = hz * scale * jitter;

        // Posición inicial: Dispersas en el espacio lejano
        const startX = (Math.random() - 0.5) * 4000;
        const startY = (Math.random() - 0.5) * 4000;
        const startZ = (Math.random() - 0.5) * 4000;

        heartStartPositions.push(new THREE.Vector3(startX, startY, startZ));
        heartTargetPositions.push(new THREE.Vector3(targetX, targetY, targetZ));

        dummy.position.set(startX, startY, startZ);
        dummy.updateMatrix();
        heartInstancedMesh.setMatrixAt(i, dummy.matrix);
    }

    heartInstancedMesh.instanceMatrix.needsUpdate = true;
    heartGroup.add(heartInstancedMesh);

    // Título 3D Principal en Neón apilado ("FELIZ\nCUMPLEAÑOS\nPABLO! 🎉")
    titleSprite = createTextSprite("FELIZ\nCUMPLEAÑOS\nPABLO! 🎉", 58, "#ffffff", "#ff0044");
    titleSprite.position.set(0, 180, 0);
    titleSprite.material.opacity = 0; // Oculto al inicio durante la construcción
    heartGroup.add(titleSprite);

    // Anillo de Luz Orbital Neón alrededor del corazón
    const ringGeo = new THREE.TorusGeometry(210, 3, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.name = "glowRing";
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -30;
    heartGroup.add(ringMesh);

    scene.add(heartGroup);
}


/* --------------------------------------------------------------------------
   5. CREADOR DE TEXT SPRITES EN 3D (FRASES Y EMOJIS FLOTANTES DINÁMICOS)
   -------------------------------------------------------------------------- */
function create3DTextCloud() {
    const totalItems = TOTAL_FRASES;
    const phraseList = CONFIG.LISTA_DE_FRASES;
    const emojiList = CONFIG.LISTA_EMOJIS;

    for (let i = 0; i < totalItems; i++) {
        const isEmoji = Math.random() < 0.25;
        let textContent, fontColor, glowColor, fontSize;

        if (isEmoji) {
            textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
            fontColor = "#ffffff";
            glowColor = CONFIG.COLOR_GOLD;
            fontSize = 75;
        } else {
            textContent = phraseList[Math.floor(Math.random() * phraseList.length)];
            const colorType = i % 4;
            if (colorType === 0) { fontColor = "#ffffff"; glowColor = CONFIG.COLOR_CYAN; }
            else if (colorType === 1) { fontColor = CONFIG.COLOR_GOLD; glowColor = "#ffaa00"; }
            else if (colorType === 2) { fontColor = "#ffffff"; glowColor = CONFIG.COLOR_MAGENTA; }
            else { fontColor = CONFIG.COLOR_LIME; glowColor = "#00ff66"; }
            fontSize = 38;
        }

        const sprite = createTextSprite(textContent, fontSize, fontColor, glowColor);

        const radius = Math.random() * 1400 + 350;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
        sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
        sprite.position.z = radius * Math.cos(phi);

        const zDist = Math.abs(sprite.position.z);
        const calcTargetOpacity = Math.max(0.35, 1 - (zDist / 2200));

        sprite.userData = {
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            speedZ: (Math.random() - 0.5) * 0.4,
            pulseOffset: Math.random() * Math.PI * 2,
            targetOpacity: calcTargetOpacity
        };

        // Oculto al inicio (opacidad 0), se revela tras los 5 segundos de construcción
        sprite.material.opacity = 0;

        scene.add(sprite);
        phraseSprites.push(sprite);
    }
}

// Función Auxiliar: Convierte Texto a Canvas Texture sin recortes (multilínea dinámica)
function createTextSprite(text, fontSize, fontColor, glowColor) {
    const lines = text.split('\n');

    // Medición exacta de dimensiones de texto
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.font = `900 ${fontSize}px 'Outfit', sans-serif`;

    let maxLineWidth = 0;
    lines.forEach(line => {
        const w = tempCtx.measureText(line).width;
        if (w > maxLineWidth) maxLineWidth = w;
    });

    const paddingX = 140; // Margen para evitar recortes del resplandor neón
    const lineHeight = fontSize * 1.35;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = Math.max(Math.ceil(maxLineWidth + paddingX), 240);
    canvas.height = Math.max(Math.ceil(lines.length * lineHeight + 60), 120);

    ctx.font = `900 ${fontSize}px 'Outfit', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const startY = (canvas.height - (lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;

        // Capa 1: Resplandor Neón exterior
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 24;
        ctx.fillStyle = fontColor;
        ctx.fillText(line, canvas.width / 2, y);

        // Capa 2: Centro brillante
        ctx.shadowBlur = 8;
        ctx.fillText(line, canvas.width / 2, y);
    });

    // Crear Textura 3D
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: true
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    
    // Escalar sprite proporcionalmente en el espacio 3D para cero distorsión
    const aspect = canvas.width / canvas.height;
    const baseHeight = lines.length > 1 ? fontSize * 1.6 * lines.length : fontSize * 1.8;
    sprite.scale.set(baseHeight * aspect, baseHeight, 1);

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

        // 2. Animación de construcción del Corazón 3D de Bolitas (Duración: 5 segundos exactos)
    const buildDuration = 5.0;
    const rawProgress = Math.min(elapsedTime / buildDuration, 1.0);
    const easeProgress = 1 - Math.pow(1 - rawProgress, 3); // Suavizado de llegada

    if (heartInstancedMesh) {
        const dummy = new THREE.Object3D();
        for (let i = 0; i < heartParticleCount; i++) {
            const sPos = heartStartPositions[i];
            const tPos = heartTargetPositions[i];

            const curX = THREE.MathUtils.lerp(sPos.x, tPos.x, easeProgress);
            const curY = THREE.MathUtils.lerp(sPos.y, tPos.y, easeProgress);
            const curZ = THREE.MathUtils.lerp(sPos.z, tPos.z, easeProgress);

            dummy.position.set(curX, curY, curZ);
            dummy.updateMatrix();
            heartInstancedMesh.setMatrixAt(i, dummy.matrix);
        }
        heartInstancedMesh.instanceMatrix.needsUpdate = true;
    }

    if (heartGroup) {
        heartGroup.rotation.y = elapsedTime * 0.35;
        const scalePulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
        heartGroup.scale.set(scalePulse, scalePulse, scalePulse);
    }

    // Al llegar a los 5 segundos: detonar fiesta y revelar frases y título
    if (rawProgress >= 1.0) {
        if (!isHeartAssembled) {
            isHeartAssembled = true;
            trigger3DExplosion(0, 0, 0, 220); // Explosión de luz al completarse el corazón
        }

        // Revelar título 3D
        if (titleSprite && titleSprite.material.opacity < 1) {
            titleSprite.material.opacity = Math.min(titleSprite.material.opacity + 0.03, 1.0);
        }

        // Revelar frases 3D en cascada
        phraseSprites.forEach(sprite => {
            const targetOpacity = sprite.userData.targetOpacity || 0.85;
            if (sprite.material.opacity < targetOpacity) {
                sprite.material.opacity = Math.min(sprite.material.opacity + 0.02, targetOpacity);
            }
        });

        // Revelar anillo orbital neón
        if (heartGroup) {
            const glowRing = heartGroup.getObjectByName("glowRing");
            if (glowRing && glowRing.material.opacity < 0.8) {
                glowRing.material.opacity = Math.min(glowRing.material.opacity + 0.02, 0.8);
            }
        }
    }

    // 3. Animación de las Frases 3D (Desplazamiento y Flotación)
    for (let i = 0; i < phraseSprites.length; i++) {
        const sprite = phraseSprites[i];
        const uData = sprite.userData;

        sprite.position.x += uData.speedX;
        sprite.position.y += uData.speedY;
        sprite.position.z += uData.speedZ;

        if (Math.abs(sprite.position.x) > 1600) uData.speedX *= -1;
        if (Math.abs(sprite.position.y) > 1100) uData.speedY *= -1;
        if (Math.abs(sprite.position.z) > 2200) uData.speedZ *= -1;
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
    window.addEventListener('resize', onWindowResize);

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
        if (e.target.closest("button")) return;

        mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        
        // Comprobar si hizo clic en el corazón 3D de bolitas
        const intersects = heartInstancedMesh ? raycaster.intersectObject(heartInstancedMesh) : [];

        if (intersects.length > 0) {
            trigger3DExplosion(0, 0, 0, 180);
            
            if (heartGroup) {
                heartGroup.scale.set(1.35, 1.35, 1.35);
                setTimeout(() => {
                    heartGroup.scale.set(1, 1, 1);
                }, 300);
            }
        } else {
            const vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = 800;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            trigger3DExplosion(pos.x, pos.y, pos.z, 60);
        }
    });

    // Iniciar audio inmediatamente / fallback al primer clic si el navegador bloquea autoplay
    const bgMusic = document.getElementById("bg-music");
    let isPlaying = false;

    function startMusic() {
        if (!isPlaying && bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                const musicIcon = document.getElementById("music-icon");
                if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
            }).catch(err => console.log("Esperando interacción para reproducir audio:", err));
        }
    }

    // Intentar reproducción directa de audio
    startMusic();

    // Iniciar audio en el primer movimiento de ratón, touch o click si el navegador requirió gesto del usuario
    const firstInteractionHandler = () => {
        startMusic();
        window.removeEventListener('pointerdown', firstInteractionHandler);
        window.removeEventListener('touchstart', firstInteractionHandler);
        window.removeEventListener('pointermove', firstInteractionHandler);
        window.removeEventListener('mousemove', firstInteractionHandler);
        window.removeEventListener('scroll', firstInteractionHandler);
        window.removeEventListener('keydown', firstInteractionHandler);
    };
    window.addEventListener('pointerdown', firstInteractionHandler);
    window.addEventListener('touchstart', firstInteractionHandler);
    window.addEventListener('pointermove', firstInteractionHandler);
    window.addEventListener('mousemove', firstInteractionHandler);
    window.addEventListener('scroll', firstInteractionHandler);
    window.addEventListener('keydown', firstInteractionHandler);

    // Botón de Mute/Play Música
    const btnMusicToggle = document.getElementById("btn-music-toggle");
    const musicIcon = document.getElementById("music-icon");

    if (btnMusicToggle) {
        btnMusicToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isPlaying) {
                bgMusic.pause();
                if (musicIcon) musicIcon.className = "fa-solid fa-volume-xmark";
                isPlaying = false;
            } else {
                bgMusic.play();
                if (musicIcon) musicIcon.className = "fa-solid fa-volume-high";
                isPlaying = true;
            }
        });
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
