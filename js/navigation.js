/**
 * Sistema de Navegação entre Abas
 * Gerencia a troca entre as seções: Teoria, Exercícios e Soluções
 */

class TabNavigation {
    constructor() {
        this.currentTab = 'teoria';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showTab(this.currentTab); // Mostra aba inicial
    }

    bindEvents() {
        // Event delegation para os botões de aba
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                e.preventDefault();
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            }
        });

        // Suporte para navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleKeyNavigation(e);
            }
        });
    }

    showTab(tabName) {
        // Valida se a aba existe
        if (!this.tabExists(tabName)) {
            console.warn(`Aba '${tabName}' não encontrada`);
            return;
        }

        // Esconde todas as abas
        this.hideAllTabs();
        
        // Remove classe active de todos os botões
        this.deactivateAllButtons();
        
        // Mostra a aba selecionada
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Ativa o botão correspondente
        const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }

        // Atualiza estado atual
        this.currentTab = tabName;
        
        // Salva no localStorage para persistência
        this.saveCurrentTab(tabName);
        
        // Trigger evento personalizado
        this.dispatchTabChangeEvent(tabName);
        
        // Scroll para o topo suavemente
        this.scrollToTop();
    }

    hideAllTabs() {
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.remove('active'));
    }

    deactivateAllButtons() {
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => btn.classList.remove('active'));
    }

    tabExists(tabName) {
        return document.getElementById(tabName) !== null;
    }

    handleKeyNavigation(e) {
        const buttons = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = buttons.findIndex(btn => btn === e.target);
        
        let newIndex;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                e.preventDefault();
                newIndex = buttons.length - 1;
                break;
            default:
                return;
        }
        
        if (newIndex !== undefined) {
            buttons[newIndex].focus();
            this.showTab(buttons[newIndex].dataset.tab);
        }
    }

    saveCurrentTab(tabName) {
        try {
            localStorage.setItem('whileGuide_currentTab', tabName);
        } catch (e) {
            // Ignora erro se localStorage não estiver disponível
        }
    }

    loadSavedTab() {
        try {
            const savedTab = localStorage.getItem('whileGuide_currentTab');
            if (savedTab && this.tabExists(savedTab)) {
                return savedTab;
            }
        } catch (e) {
            // Ignora erro se localStorage não estiver disponível
        }
        return 'teoria'; // Default
    }

    dispatchTabChangeEvent(tabName) {
        const event = new CustomEvent('tabChanged', {
            detail: { tabName, previousTab: this.currentTab }
        });
        document.dispatchEvent(event);
    }

    scrollToTop() {
        const container = document.querySelector('.container');
        if (container) {
            container.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Método público para navegação programática
    navigateTo(tabName) {
        this.showTab(tabName);
    }

    // Getter para aba atual
    getCurrentTab() {
        return this.currentTab;
    }

    // Método para obter todas as abas disponíveis
    getAvailableTabs() {
        return Array.from(document.querySelectorAll('.tab-content'))
            .map(tab => tab.id)
            .filter(id => id);
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.tabNavigation = new TabNavigation();
});

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabNavigation;
}