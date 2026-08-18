/* ==========================================================================
   SECCIÓN DE CONFIGURACIÓN PERSONALIZABLE
   (Modifica estos valores fácilmente para personalizar tu página)
   ========================================================================== */
const CONFIG = {
    // Nombres y Firmas
    girlfriendName: "Amor de mi vida",
    myName: "Tu Novio",
    celebrationDate: "18 de Agosto, 2026",

    // Mensaje de cumpleaños principal (Hero Section)
    birthdayMessage: "Hoy es un día increíble porque celebramos la existencia de la persona más maravillosa de este mundo: tú. Gracias por iluminar mi vida con tu sonrisa, por cada abrazo y por hacer que cada día a tu lado sea una aventura mágica. ¡Feliz día, mi reina! ❤️",

    // Texto de la carta romántica (admite saltos de línea \n)
    letterText: `Desde el momento en que entraste en mi vida, todo cambió de color. Tu risa se convirtió en mi melodía favorita, y tu felicidad en mi mayor deseo.

Hoy que celebras un año más de vida, quiero recordarte lo increíblemente especial que eres. No solo eres mi novia, eres mi mejor amiga, mi confidente y el amor de mi vida. Adoro cada pequeño detalle de ti: cómo te emocionas por las cosas pequeñas, la luz de tu mirada y la paz que me transmites con solo tomar mi mano.

Espero que este cumpleaños sea tan hermoso como tu corazón. Prometo hacer todo lo posible para que sonrías hoy y cada uno de los días que sigan. Que la vida nos regale muchísimos cumpleaños más para celebrar juntos.

¡Te amo infinitamente, hoy y siempre! ❤️`,

    // Mensaje secreto del gran corazón interactivo
    secretMessage: "Te amo más de lo que puedo explicar ❤️",
    secretSubtext: "Eres mi presente, mi futuro y mi deseo cumplido en cada estrella. Gracias por ser mi mayor felicidad."
};


/* ==========================================================================
   INICIALIZACIÓN Y VARIABLES GLOBALES
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Aplicar configuración a los elementos del DOM
    applyConfiguration();

    // Referencias de elementos del DOM
    const introOverlay = document.getElementById("intro-overlay");
    const btnStart = document.getElementById("btn-start");
    const mainContent = document.getElementById("main-content");
    const musicPlayer = document.getElementById("music-player");
    const bgMusic = document.getElementById("bg-music");
    const btnPlayPause = document.getElementById("btn-play-pause");
    const musicIcon = document.getElementById("music-icon");
    const musicWave = document.getElementById("music-wave-bars");
    
    const envelopeWrapper = document.getElementById("envelope-wrapper");
    const btnSpecialHeart = document.getElementById("btn-special-heart");
    const specialSurpriseMessage = document.getElementById("special-surprise-message");

    // Desactivar scroll al inicio
    document.body.classList.add("no-scroll");

    // ==========================================================================
    // CONTROL DEL INTRO Y EVENTO COMENZAR
    // ==========================================================================
    btnStart.addEventListener("click", () => {
        // Reproducir música (maneja políticas de autoplay)
        playMusic();

        // Animación de salida del intro
        introOverlay.classList.add("fade-out");
        
        // Mostrar contenedor principal
        mainContent.classList.remove("hidden");
        setTimeout(() => {
            mainContent.classList.add("visible");
            musicPlayer.classList.remove("hidden");
            document.body.classList.remove("no-scroll");
            
            // Iniciar animaciones de Scroll Reveal
            handleScrollReveal();
        }, 800);

        // Remover el intro del DOM después de la transición
        setTimeout(() => {
            introOverlay.style.display = "none";
        }, 1500);
    });

    // ==========================================================================
    // REPRODUCTOR DE MÚSICA
    // ==========================================================================
    let isPlaying = false;

    function playMusic() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                updateMusicUI(true);
            })
            .catch(err => {
                console.log("El navegador bloqueó la reproducción automática de audio:", err);
                isPlaying = false;
                updateMusicUI(false);
            });
    }

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            updateMusicUI(false);
        } else {
            bgMusic.play().then(() => {
                isPlaying = true;
                updateMusicUI(true);
            });
        }
    }

    function updateMusicUI(playState) {
        if (playState) {
            musicIcon.className = "fa-solid fa-pause";
            musicWave.classList.add("active");
        } else {
            musicIcon.className = "fa-solid fa-play";
            musicWave.classList.remove("active");
        }
    }

    btnPlayPause.addEventListener("click", toggleMusic);

    // ==========================================================================
    // CARTA ROMÁNTICA INTERACTIVA (ENVELOPE)
    // ==========================================================================
    let letterOpened = false;
    
    envelopeWrapper.addEventListener("click", () => {
        if (!letterOpened) {
            envelopeWrapper.classList.add("open");
            document.getElementById("envelope-hint").style.opacity = "0";
            letterOpened = true;
            
            // Iniciar la animación de escritura con delay para esperar la apertura del sobre
            setTimeout(() => {
                startTypewriter();
            }, 1000);
        }
    });

    function startTypewriter() {
        const textContainer = document.getElementById("typewriter-text");
        textContainer.innerHTML = ""; // Limpiar
        
        const text = CONFIG.letterText;
        let index = 0;
        
        function type() {
            if (index < text.length) {
                // Si es un salto de línea, insertar etiqueta br
                if (text.charAt(index) === '\n') {
                    textContainer.innerHTML += "<br>";
                } else {
                    textContainer.innerHTML += text.charAt(index);
                }
                index++;
                
                // Efecto de autoscroll en la carta mientras se escribe
                const letterInner = textContainer.closest(".letter-inner");
                if (letterInner) {
                    letterInner.scrollTop = letterInner.scrollHeight;
                }
                
                // Velocidad de escritura variable para realismo (entre 30 y 60 ms por caracter)
                const delay = text.charAt(index - 1) === '.' || text.charAt(index - 1) === ',' ? 400 : Math.random() * 25 + 25;
                setTimeout(type, delay);
            } else {
                // Al finalizar la carta, lanzar confeti de corazones
                triggerConfettiExplosion(window.innerWidth / 2, window.innerHeight / 2, 40);
            }
        }
        
        type();
    }

    // ==========================================================================
    // CORAZÓN INTERACTIVO GIGANTE (SORPRESA)
    // ==========================================================================
    let surpriseTriggered = false;

    btnSpecialHeart.addEventListener("click", (e) => {
        // Añadir clase de animación
        btnSpecialHeart.classList.add("exploded");
        
        // Obtener coordenadas del botón
        const rect = btnSpecialHeart.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Lanzar una gran explosión de corazones en el canvas
        triggerConfettiExplosion(x, y, 70);

        // Revelar mensaje sorpresa
        if (!surpriseTriggered) {
            surpriseTriggered = true;
            specialSurpriseMessage.classList.remove("hidden-message");
            specialSurpriseMessage.classList.add("visible-message");
            
            // Hacer scroll suave hacia el mensaje revelado
            setTimeout(() => {
                specialSurpriseMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        } else {
            // Si ya estaba revelado, solo relanza más partículas
            triggerConfettiExplosion(x, y, 40);
        }

        // Remover animación de click tras medio segundo para que pueda volverse a pulsar
        setTimeout(() => {
            btnSpecialHeart.classList.remove("exploded");
        }, 800);
    });

    // ==========================================================================
    // ANIMA AL HACER SCROLL (SCROLL REVEAL)
    // ==========================================================================
    const revealElements = document.querySelectorAll(".scroll-reveal");

    function handleScrollReveal() {
        const triggerBottom = window.innerHeight * 0.85;

        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < triggerBottom) {
                el.classList.add("active");
                
                // Animar también los ítems individuales dentro si existen
                const items = el.querySelectorAll(".scroll-reveal-item");
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "translateY(0) rotate(0deg)";
                    }, index * 200); // Retraso en cascada
                });
            }
        });
    }

    window.addEventListener("scroll", handleScrollReveal);

    // ==========================================================================
    // SPAWNEAR CORAZONES AL HACER CLICK / TOUCH EN LA PANTALLA
    // ==========================================================================
    window.addEventListener("click", (e) => {
        // Evitar clicks en botones, cartas o enlaces para no taparlos
        if (e.target.closest("button") || 
            e.target.closest(".envelope-wrapper") || 
            e.target.closest(".polaroid-card") ||
            e.target.closest(".floating-badge")) {
            return;
        }

        createScreenHeart(e.clientX, e.clientY);
    });

    // Soporte para touch en móviles sin duplicar con click
    window.addEventListener("touchend", (e) => {
        if (e.target.closest("button") || 
            e.target.closest(".envelope-wrapper") || 
            e.target.closest(".polaroid-card") ||
            e.target.closest(".floating-badge")) {
            return;
        }
        
        const touch = e.changedTouches[0];
        createScreenHeart(touch.clientX, touch.clientY);
    });

    function createScreenHeart(x, y) {
        // Crear un corazón flotante en el DOM en la posición exacta del click
        const heart = document.createElement("div");
        heart.className = "click-heart";
        heart.innerHTML = "❤️";
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        
        // Tamaños aleatorios
        const size = Math.random() * 15 + 15;
        heart.style.fontSize = `${size}px`;

        // Rotación y trayectoria horizontal aleatorias
        const randomXOffset = (Math.random() - 0.5) * 100;
        heart.style.setProperty("--x-offset", `${randomXOffset}px`);
        
        document.body.appendChild(heart);

        // Remover del DOM tras completar la animación CSS
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
});

/* ==========================================================================
   APLICAR CONFIGURACIÓN PERSONALIZADA
   ========================================================================== */
function applyConfiguration() {
    document.title = `Feliz Cumpleaños, ${CONFIG.girlfriendName} ❤️`;
    
    // Títulos y dedicatorias
    const titleElements = document.querySelectorAll(".intro-title, .main-title");
    titleElements.forEach(el => {
        if (el.classList.contains("intro-title")) {
            el.innerHTML = `Para el amor de mi vida, <br><span style="font-family: var(--font-cursive); font-size: 3.5rem; color: var(--neon-pink); text-shadow: var(--neon-pink-glow);">${CONFIG.girlfriendName}</span>`;
        }
    });

    const mainBirthdayMsgEl = document.getElementById("main-birthday-message");
    if (mainBirthdayMsgEl) mainBirthdayMsgEl.innerText = CONFIG.birthdayMessage;

    const celebrationDateEl = document.getElementById("celebration-date");
    if (celebrationDateEl) celebrationDateEl.innerText = CONFIG.celebrationDate;

    const senderSignatureEl = document.getElementById("sender-signature");
    if (senderSignatureEl) senderSignatureEl.innerText = `Con todo mi amor, ${CONFIG.myName}`;

    // Surprise Section Config
    const surpriseHighlightTextEl = document.querySelector(".surprise-highlight-text");
    if (surpriseHighlightTextEl) surpriseHighlightTextEl.innerText = CONFIG.secretMessage;

    const surpriseSubtextEl = document.querySelector(".surprise-subtext");
    if (surpriseSubtextEl) surpriseSubtextEl.innerText = CONFIG.secretSubtext;
}


/* ==========================================================================
   SISTEMA DE PARTÍCULAS DEL CANVAS (CORAZONES Y SPARKS)
   ========================================================================== */
const canvas = document.getElementById("canvas-particles");
const ctx = canvas.getContext("2d");

let particlesArray = [];
let confettiArray = [];
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Ajustar tamaño del canvas con debounce
window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

// Ratón tracker para la estela de partículas
const mouse = {
    x: null,
    y: null,
    radius: 80
};

window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Generar pequeñas chispas en la posición del mouse
    if (Math.random() < 0.25) {
        particlesArray.push(new MouseSpark(mouse.x, mouse.y));
    }
});

window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        if (Math.random() < 0.25) {
            particlesArray.push(new MouseSpark(mouse.x, mouse.y));
        }
    }
});

// Clase para Corazones Flotantes del Fondo
class FloatingHeart {
    constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 14 + 6;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() * 40 - 20 + 345; // Tono rojo/rosa
        this.wiggle = Math.random() * 2;
        this.wiggleSpeed = Math.random() * 0.02 + 0.005;
        this.time = Math.random() * 100;
    }

    update() {
        this.y -= this.speedY;
        this.time += this.wiggleSpeed;
        this.x += Math.sin(this.time) * 0.3 + this.speedX;

        // Resetear al salir de la pantalla
        if (this.y < -30) {
            this.y = height + 30;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = `hsl(${this.hue}, 90%, 65%)`;
        ctx.shadowColor = `hsl(${this.hue}, 90%, 60%)`;
        ctx.shadowBlur = this.size / 2;
        
        // Dibujar forma de corazón en Canvas
        ctx.beginPath();
        const x = this.x;
        const y = this.y;
        const size = this.size;
        ctx.moveTo(x, y + size / 4);
        ctx.quadraticCurveTo(x, y, x + size / 2, y);
        ctx.quadraticCurveTo(x + size, y, x + size, y + size / 3);
        ctx.quadraticCurveTo(x + size, y + size * 2/3, x + size / 2, y + size);
        ctx.quadraticCurveTo(x, y + size * 2/3, x, y + size / 3);
        ctx.quadraticCurveTo(x, y, x, y + size / 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Clase para Chispas de Luz del Fondo (Brillos)
class Sparkle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
        this.flashSpeed = Math.random() * 0.02 + 0.005;
        this.growing = Math.random() > 0.5;
    }

    update() {
        if (this.growing) {
            this.alpha += this.flashSpeed;
            if (this.alpha >= 0.8) this.growing = false;
        } else {
            this.alpha -= this.flashSpeed;
            if (this.alpha <= 0.1) this.growing = true;
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = "#ffddf0";
        ctx.shadowColor = "#ff5eb4";
        ctx.shadowBlur = 10;
        
        ctx.beginPath();
        // Dibujar estrella de 4 puntas miniatura
        const x = this.x;
        const y = this.y;
        const size = this.size;
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + size/3, y - size/3);
        ctx.lineTo(x + size, y);
        ctx.lineTo(x + size/3, y + size/3);
        ctx.lineTo(x, y + size);
        ctx.lineTo(x - size/3, y + size/3);
        ctx.lineTo(x - size, y);
        ctx.lineTo(x - size/3, y - size/3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Estela de chispas interactivas al mover el ratón
class MouseSpark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 6 + 3;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -1.5 - 0.5;
        this.color = Math.random() > 0.5 ? "#ff2a5f" : "#ff5eb4";
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        // Forma de estrella/cruz de luz
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Clase para Confeti de Explosión (Corazones y Estrellas Doradas)
class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 8;
        
        // Dirección de la explosión (360 grados)
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 4;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        
        this.gravity = 0.12; // Cae ligeramente
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        
        // Tipos de confeti (0 = corazón rosa, 1 = corazón rojo, 2 = estrella dorada)
        this.type = Math.floor(Math.random() * 3);
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;
    }

    draw() {
        if (this.alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        
        let color = "#ff2a5f";
        if (this.type === 1) color = "#ff7db2";
        if (this.type === 2) color = "#ffd700"; // Dorado

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;

        const size = this.size;

        if (this.type === 2) {
            // Dibujar estrella
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * size / 2, 
                           Math.sin((18 + i * 72) * Math.PI / 180) * size / 2);
                ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * size / 4, 
                           Math.sin((54 + i * 72) * Math.PI / 180) * size / 4);
            }
            ctx.closePath();
            ctx.fill();
        } else {
            // Dibujar corazón
            ctx.beginPath();
            ctx.moveTo(0, -size / 4);
            ctx.quadraticCurveTo(0, -size/2, size/2, -size/2);
            ctx.quadraticCurveTo(size, -size/2, size, -size/6);
            ctx.quadraticCurveTo(size, size/6, size/2, size/2);
            ctx.quadraticCurveTo(0, size, 0, size * 1.1);
            ctx.quadraticCurveTo(0, size, -size/2, size/2);
            ctx.quadraticCurveTo(-size, size/6, -size, -size/6);
            ctx.quadraticCurveTo(-size, -size/2, -size/2, -size/2);
            ctx.quadraticCurveTo(0, -size/2, 0, -size / 4);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }
}

// Inicializar Partículas del Fondo
function initParticles() {
    // 35 corazones flotantes de fondo
    for (let i = 0; i < 35; i++) {
        particlesArray.push(new FloatingHeart());
    }
    // 60 brillos parpadeantes de fondo
    for (let i = 0; i < 60; i++) {
        particlesArray.push(new Sparkle());
    }
}

// Activar Explosión de Confeti/Corazones
function triggerConfettiExplosion(x, y, amount) {
    for (let i = 0; i < amount; i++) {
        confettiArray.push(new ConfettiParticle(x, y));
    }
}

// Loop Principal de Animación del Canvas
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Actualizar y dibujar corazones, brillos y estela
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }

    // Actualizar y dibujar confeti de explosión
    for (let i = 0; i < confettiArray.length; i++) {
        confettiArray[i].update();
        confettiArray[i].draw();
        
        // Eliminar confeti desvanecido
        if (confettiArray[i].alpha <= 0) {
            confettiArray.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

// Iniciar Sistema de Partículas
initParticles();
animate();


/* ==========================================================================
   ESTILOS DINÁMICOS DE CORAZONES POR CLICK (INYECTADOS EN JS)
   ========================================================================== */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    .click-heart {
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        user-select: none;
        animation: floatAndFade 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        text-shadow: 0 0 10px rgba(255, 42, 95, 0.8);
        transform: translate(-50%, -50%);
    }

    @keyframes floatAndFade {
        0% {
            transform: translate(-50%, -50%) scale(0.6) translateY(0);
            opacity: 1;
        }
        50% {
            opacity: 0.9;
        }
        100% {
            transform: translate(-50%, -50%) scale(1.2) translate(var(--x-offset), -180px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);
