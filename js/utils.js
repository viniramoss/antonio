/**
 * Utilitários Gerais
 * Funções auxiliares reutilizáveis em toda a aplicação
 */

const Utils = {
    
    // =========================================
    // MANIPULAÇÃO DE DOM
    // =========================================
    
    /**
     * Cria elemento DOM com atributos
     */
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        // Adiciona atributos
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'textContent') {
                element.textContent = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Adiciona filhos
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },

    /**
     * Seleciona elemento com validação
     */
    select(selector, context = document) {
        const element = context.querySelector(selector);
        if (!element) {
            console.warn(`Elemento não encontrado: ${selector}`);
        }
        return element;
    },

    /**
     * Seleciona múltiplos elementos
     */
    selectAll(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    },

    // =========================================
    // ANIMAÇÕES E TRANSIÇÕES
    // =========================================
    
    /**
     * Fade in suave
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    /**
     * Fade out suave
     */
    fadeOut(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(window.getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    /**
     * Slide down
     */
    slideDown(element, duration = 300) {
        element.style.display = 'block';
        element.style.height = '0';
        element.style.overflow = 'hidden';
        
        const targetHeight = element.scrollHeight;
        const start = performance.now();
        
        const animate = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.height = (targetHeight * progress) + 'px';
            
            if (progress >= 1) {
                element.style.height = 'auto';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    // =========================================
    // FORMATAÇÃO E VALIDAÇÃO
    // =========================================
    
    /**
     * Formata número com separadores
     */
    formatNumber(num, decimals = 2) {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    },

    /**
     * Formata moeda brasileira
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    /**
     * Valida email
     */
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    /**
     * Limpa string de caracteres especiais
     */
    sanitizeString(str) {
        return str.replace(/[<>]/g, '');
    },

    // =========================================
    // ARMAZENAMENTO LOCAL
    // =========================================
    
    /**
     * Salva dados no localStorage com compressão
     */
    saveToStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    /**
     * Carrega dados do localStorage
     */
    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove item do localStorage
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    },

    // =========================================
    // UTILITÁRIOS DE TEMPO
    // =========================================
    
    /**
     * Debounce function
     */
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Delay/sleep
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Formata tempo relativo
     */
    timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} dia${days > 1 ? 's' : ''} atrás`;
        if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
        if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
        return 'agora mesmo';
    },

    // =========================================
    // UTILITÁRIOS DE DISPOSITIVO
    // =========================================
    
    /**
     * Detecta se é dispositivo móvel
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Detecta se é tablet
     */
    isTablet() {
        return /iPad|Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth >= 768;
    },

    /**
     * Detecta suporte a touch
     */
    hasTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Obtém informações do viewport
     */
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.devicePixelRatio || 1
        };
    },

    // =========================================
    // UTILITÁRIOS DE PERFORMANCE
    // =========================================
    
    /**
     * Mede tempo de execução
     */
    measureTime(label, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${label}: ${(end - start).toFixed(2)}ms`);
        return result;
    },

    /**
     * Lazy loading de imagens
     */
    lazyLoadImages(selector = 'img[data-src]') {
        const images = this.selectAll(selector);
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },

    // =========================================
    // UTILITÁRIOS DE EVENTOS
    // =========================================
    
    /**
     * Event emitter simples
     */
    createEventEmitter() {
        const events = {};
        
        return {
            on(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
            },
            
            off(event, callback) {
                if (events[event]) {
                    events[event] = events[event].filter(cb => cb !== callback);
                }
            },
            
            emit(event, data) {
                if (events[event]) {
                    events[event].forEach(callback => callback(data));
                }
            }
        };
    },

    /**
     * Delegate event
     */
    delegate(parent, selector, event, handler) {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                handler(e);
            }
        });
    }
};

// Exporta para uso global
window.Utils = Utils;

// Exporta para módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}