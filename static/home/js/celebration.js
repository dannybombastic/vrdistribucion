// Animación profesional con elementos geométricos y partículas sutiles
class ProfessionalAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.particles = [];
        this.geometrics = [];
        
        this.resizeCanvas();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    init() {
        // Crear ondas sutiles de fondo
        for (let i = 0; i < 3; i++) {
            this.waves.push(this.createWave(i));
        }
        
        // Crear partículas flotantes minimalistas
        for (let i = 0; i < 20; i++) {
            this.particles.push(this.createParticle());
        }
        
        // Crear elementos geométricos
        for (let i = 0; i < 8; i++) {
            this.geometrics.push(this.createGeometric());
        }
    }
    
    createWave(index) {
        return {
            amplitude: 30 + index * 10,
            frequency: 0.003 + index * 0.001,
            phase: index * Math.PI / 3,
            speed: 0.01 + index * 0.005,
            offset: 0,
            color: `rgba(99, 102, 241, ${0.08 - index * 0.02})`
        };
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            color: this.getRandomProfessionalColor(),
            opacity: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.01
        };
    }
    
    createGeometric() {
        const shapes = ['circle', 'triangle', 'diamond', 'hexagon'];
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 30 + 10,
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.005,
            color: this.getRandomProfessionalColor(),
            opacity: Math.random() * 0.15 + 0.05,
            scale: 1,
            scaleDirection: 1,
            scaleSpeed: 0.002 + Math.random() * 0.003
        };
    }
    
    getRandomProfessionalColor() {
        const colors = [
            'rgba(99, 102, 241, 0.3)',   // Indigo
            'rgba(236, 72, 153, 0.25)',  // Pink
            'rgba(139, 92, 246, 0.2)',   // Purple
            'rgba(59, 130, 246, 0.2)',   // Blue
            'rgba(16, 185, 129, 0.25)'   // Emerald
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawWave(wave) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        this.ctx.strokeStyle = wave.color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        for (let x = 0; x <= this.canvas.width; x += 5) {
            const y = this.canvas.height / 2 + 
                     Math.sin(x * wave.frequency + wave.phase + wave.offset) * wave.amplitude;
            
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    drawGeometric(geo) {
        this.ctx.save();
        this.ctx.globalAlpha = geo.opacity;
        this.ctx.fillStyle = geo.color;
        this.ctx.strokeStyle = geo.color;
        this.ctx.lineWidth = 1;
        this.ctx.translate(geo.x, geo.y);
        this.ctx.rotate(geo.rotation);
        this.ctx.scale(geo.scale, geo.scale);
        
        switch (geo.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(0, 0, geo.size / 2, 0, Math.PI * 2);
                this.ctx.stroke();
                break;
                
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -geo.size / 2);
                this.ctx.lineTo(-geo.size / 2, geo.size / 2);
                this.ctx.lineTo(geo.size / 2, geo.size / 2);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
                
            case 'diamond':
                this.ctx.beginPath();
                this.ctx.moveTo(0, -geo.size / 2);
                this.ctx.lineTo(geo.size / 2, 0);
                this.ctx.lineTo(0, geo.size / 2);
                this.ctx.lineTo(-geo.size / 2, 0);
                this.ctx.closePath();
                this.ctx.stroke();
                break;
                
            case 'hexagon':
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = (i * Math.PI) / 3;
                    const x = Math.cos(angle) * geo.size / 2;
                    const y = Math.sin(angle) * geo.size / 2;
                    if (i === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
                break;
        }
        
        this.ctx.restore();
    }
    
    animate() {
        // Limpiar canvas con un fade suave
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animar ondas
        this.waves.forEach(wave => {
            wave.offset += wave.speed;
            this.drawWave(wave);
        });
        
        // Animar partículas
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.pulse += particle.pulseSpeed;
            
            // Rebotar en los bordes suavemente
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Dibujar partícula con pulso sutil
            const pulseSize = particle.size + Math.sin(particle.pulse) * 0.2;
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
        
        // Animar elementos geométricos
        this.geometrics.forEach(geo => {
            geo.rotation += geo.rotationSpeed;
            geo.scale += geo.scaleSpeed * geo.scaleDirection;
            
            if (geo.scale > 1.2 || geo.scale < 0.8) {
                geo.scaleDirection *= -1;
            }
            
            this.drawGeometric(geo);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Animación de contadores mejorada
class CounterAnimation {
    constructor() {
        this.observers = [];
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        document.querySelectorAll('.experience-metric').forEach(item => {
            observer.observe(item);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.animate);
        const numberElement = element.querySelector('.metric-number');
        const duration = 2500;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function más suave
            const easedProgress = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(target * easedProgress);
            
            // Formatear el número según el tipo
            if (target === 98) {
                numberElement.textContent = currentValue + '%';
            } else if (target >= 1000) {
                numberElement.textContent = currentValue.toLocaleString() + '+';
            } else {
                numberElement.textContent = currentValue + '+';
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new ProfessionalAnimation('professionalCanvas');
        new CounterAnimation();
    }, 100);
});
