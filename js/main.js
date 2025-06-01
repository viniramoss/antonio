/**
 * Arquivo Principal da Aplicação
 * Coordena todos os módulos e funcionalidades
 */

class WhileGuideApp {
    constructor() {
        this.version = '1.0.0';
        this.debug = false;
        this.analytics = {
            pageViews: 0,
            tabChanges: 0,
            codesCopied: 0
        };
        
        this.init();
    }

    init() {
        this.log('Inicializando aplicação...');
        
        // Verifica se todos os módulos foram carregados
        this.checkDependencies();
        
        // Configura analytics básico
        this.setupAnalytics();
        
        // Configura event listeners globais
        this.setupGlobalEvents();
        
        // Configura PWA (se necessário)
        this.setupPWA();
        
        // Inicialização completa
        this.onAppReady();
    }

    checkDependencies() {
        const requiredModules = [
            'tabNavigation',
            'codeCopyManager', 
            'contentLoader'
        ];

        const missingModules = requiredModules.filter(module => 
            !window[module]
        );

        if (missingModules.length > 0) {
            console.warn('Módulos não carregados:', missingModules);
        } else {
            this.log('Todos os módulos carregados com sucesso');
        }
    }

    setupAnalytics() {
        // Conta visualização da página
        this.analytics.pageViews++;
        
        // Escuta mudanças de aba
        document.addEventListener('tabChanged', (e) => {
            this.analytics.tabChanges++;
            this.trackEvent('tab_change', e.detail.tabName);
        });

        // Escuta cópias de código
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                this.analytics.codesCopied++;
                this.trackEvent('code_copy');
            }
        });

        this.log('Analytics configurado');
    }

    setupGlobalEvents() {
        // Salva progresso antes de sair da página
        window.addEventListener('beforeunload', () => {
            this.saveUserProgress();
        });

        // Detecta mudanças de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // Gerencia redimensionamento
        window.addEventListener('resize', this.debounce(() => {
            this.onWindowResize();
        }, 250));

        // Detecta problemas de conectividade
        window.addEventListener('online', () => this.onConnectionChange(true));
        window.addEventListener('offline', () => this.onConnectionChange(false));

        this.log('Event listeners globais configurados');
    }

    setupPWA() {
        // Service Worker (se necessário)
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }

        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.showInstallPrompt(e);
        });
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            this.log('Service Worker registrado:', registration);
        } catch (error) {
            this.log('Erro ao registrar Service Worker:', error);
        }
    }

    showInstallPrompt(installEvent) {
        // Mostra prompt de instalação personalizado
        const installBanner = document.createElement('div');
        installBanner.className = 'install-banner';
        installBanner.innerHTML = `
            <div class="install-content">
                <span>📱 Instalar o Guia While Loops?</span>
                <button id="install-yes">Sim</button>
                <button id="install-no">Não</button>
            </div>
        `;
        
        document.body.appendChild(installBanner);

        document.getElementById('install-yes').addEventListener('click', () => {
            installEvent.prompt();
            installBanner.remove();
        });

        document.getElementById('install-no').addEventListener('click', () => {
            installBanner.remove();
        });
    }

    onAppReady() {
        // Remove loader se existir
        const loader = document.querySelector('.app-loader');
        if (loader) {
            loader.remove();
        }

        // Adiciona classe indicando que app está pronto
        document.body.classList.add('app-ready');

        // Restaura estado do usuário
        this.restoreUserProgress();

        // Dispara evento de app pronto
        const event = new CustomEvent('appReady', {
            detail: { version: this.version }
        });
        document.dispatchEvent(event);

        this.log('Aplicação pronta!');
    }

    saveUserProgress() {
        try {
            const progress = {
                currentTab: window.tabNavigation?.getCurrentTab(),
                timestamp: Date.now(),
                analytics: this.analytics,
                version: this.version
            };

            localStorage.setItem('whileGuide_progress', JSON.stringify(progress));
            this.log('Progresso salvo');
        } catch (error) {
            this.log('Erro ao salvar progresso:', error);
        }
    }

    restoreUserProgress() {
        try {
            const saved = localStorage.getItem('whileGuide_progress');
            if (saved) {
                const progress = JSON.parse(saved);
                
                // Restaura aba se foi salva recentemente (menos de 1 dia)
                if (Date.now() - progress.timestamp < 24 * 60 * 60 * 1000) {
                    if (progress.currentTab && window.tabNavigation) {
                        window.tabNavigation.navigateTo(progress.currentTab);
                    }
                }
                
                this.log('Progresso restaurado');
            }
        } catch (error) {
            this.log('Erro ao restaurar progresso:', error);
        }
    }

    onPageHidden() {
        this.log('Página ficou oculta');
        this.saveUserProgress();
    }

    onPageVisible() {
        this.log('Página ficou visível');
    }

    onWindowResize() {
        // Ajusta layout se necessário
        this.log('Janela redimensionada');
    }

    onConnectionChange(isOnline) {
        const status = isOnline ? 'online' : 'offline';
        this.log(`Conexão: ${status}`);
        
        // Mostra notificação se offline
        if (!isOnline) {
            this.showNotification('Você está offline. Algumas funcionalidades podem não funcionar.', 'warning');
        }
    }

    trackEvent(eventName, data = {}) {
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }

        // Console para debug
        this.log(`Evento: ${eventName}`, data);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Utilitários
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    log(...args) {
        if (this.debug || localStorage.getItem('debug') === 'true') {
            console.log('[WhileGuide]', ...args);
        }
    }

    // Métodos públicos
    getAnalytics() {
        return { ...this.analytics };
    }

    enableDebug() {
        this.debug = true;
        localStorage.setItem('debug', 'true');
        console.log('Debug mode enabled');
    }

    disableDebug() {
        this.debug = false;
        localStorage.removeItem('debug');
        console.log('Debug mode disabled');
    }

    getVersion() {
        return this.version;
    }

    // Método para exportar dados do usuário
    exportUserData() {
        const data = {
            version: this.version,
            timestamp: Date.now(),
            progress: JSON.parse(localStorage.getItem('whileGuide_progress') || '{}'),
            analytics: this.analytics
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `while-guide-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.whileGuideApp = new WhileGuideApp();
});

// Expõe métodos úteis no console para debug
window.WhileGuide = {
    enableDebug: () => window.whileGuideApp?.enableDebug(),
    disableDebug: () => window.whileGuideApp?.disableDebug(),
    getAnalytics: () => window.whileGuideApp?.getAnalytics(),
    exportData: () => window.whileGuideApp?.exportUserData(),
    version: () => window.whileGuideApp?.getVersion()
};

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WhileGuideApp;
}