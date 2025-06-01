/**
 * Sistema de Cópia de Código
 * Gerencia a funcionalidade de copiar blocos de código
 */

class CodeCopyManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.addCopyButtonsToExistingBlocks();
    }

    bindEvents() {
        // Event delegation para botões de cópia
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('copy-btn')) {
                e.preventDefault();
                this.copyCode(e.target);
            }
        });

        // Observer para detectar novos blocos de código adicionados dinamicamente
        this.observeNewCodeBlocks();
    }

    copyCode(button) {
        const codeBlock = button.closest('.code-block');
        if (!codeBlock) {
            console.error('Bloco de código não encontrado');
            return;
        }

        // Extrai o texto do código, removendo o texto do botão
        const code = this.extractCodeText(codeBlock, button);
        
        // Tenta copiar usando a API moderna
        if (navigator.clipboard && window.isSecureContext) {
            this.copyWithClipboardAPI(code, button);
        } else {
            // Fallback para navegadores mais antigos
            this.copyWithFallback(code, button);
        }
    }

    extractCodeText(codeBlock, button) {
        // Clona o elemento para não afetar o original
        const clone = codeBlock.cloneNode(true);
        
        // Remove o botão de cópia do clone
        const copyBtn = clone.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.remove();
        }
        
        // Extrai o texto preservando quebras de linha
        let code = clone.textContent || clone.innerText;
        
        // Limpa espaços extras e normaliza quebras de linha
        code = code.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
        
        return code;
    }

    async copyWithClipboardAPI(code, button) {
        try {
            await navigator.clipboard.writeText(code);
            this.showCopySuccess(button);
            this.trackCopyEvent('clipboard-api');
        } catch (error) {
            console.error('Erro ao copiar com Clipboard API:', error);
            this.copyWithFallback(code, button);
        }
    }

    copyWithFallback(code, button) {
        try {
            // Cria elemento textarea temporário
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            
            // Executa comando de cópia
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                this.showCopySuccess(button);
                this.trackCopyEvent('fallback');
            } else {
                this.showCopyError(button);
            }
        } catch (error) {
            console.error('Erro ao copiar com fallback:', error);
            this.showCopyError(button);
        }
    }

    showCopySuccess(button) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        // Mostra feedback visual
        button.textContent = 'Copiado!';
        button.style.background = '#27ae60';
        button.classList.add('copy-success');
        
        // Restaura estado original após 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBg || '#3498db';
            button.classList.remove('copy-success');
        }, 2000);
    }

    showCopyError(button) {
        const originalText = button.textContent;
        const originalBg = button.style.background;
        
        // Mostra feedback de erro
        button.textContent = 'Erro!';
        button.style.background = '#e74c3c';
        button.classList.add('copy-error');
        
        // Restaura estado original após 2 segundos
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = originalBg || '#3498db';
            button.classList.remove('copy-error');
        }, 2000);
        
        // Mostra alerta com instruções manuais
        setTimeout(() => {
            alert('Não foi possível copiar automaticamente. Selecione o código manualmente e use Ctrl+C (ou Cmd+C no Mac).');
        }, 100);
    }

    addCopyButtonsToExistingBlocks() {
        const codeBlocks = document.querySelectorAll('.code-block:not([data-copy-added])');
        
        codeBlocks.forEach(block => {
            this.addCopyButton(block);
        });
    }

    addCopyButton(codeBlock) {
        // Verifica se já tem botão
        if (codeBlock.querySelector('.copy-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.textContent = 'Copiar';
        button.setAttribute('aria-label', 'Copiar código');
        button.setAttribute('title', 'Copiar código para a área de transferência');
        
        // Adiciona o botão ao bloco
        codeBlock.style.position = 'relative';
        codeBlock.appendChild(button);
        
        // Marca como processado
        codeBlock.setAttribute('data-copy-added', 'true');
    }

    observeNewCodeBlocks() {
        // Observer para detectar novos blocos de código
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Verifica se o próprio nó é um bloco de código
                        if (node.classList && node.classList.contains('code-block')) {
                            this.addCopyButton(node);
                        }
                        
                        // Verifica filhos
                        const codeBlocks = node.querySelectorAll && node.querySelectorAll('.code-block:not([data-copy-added])');
                        if (codeBlocks) {
                            codeBlocks.forEach(block => this.addCopyButton(block));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    trackCopyEvent(method) {
        // Analytics (opcional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'code_copy', {
                'method': method,
                'content_type': 'python_code'
            });
        }
        
        // Console para debug
        console.log(`Código copiado usando método: ${method}`);
    }

    // Método público para adicionar botão manualmente
    addButtonToBlock(selector) {
        const block = document.querySelector(selector);
        if (block) {
            this.addCopyButton(block);
        }
    }

    // Método para customizar texto do botão
    setButtonText(text) {
        this.defaultButtonText = text;
        document.querySelectorAll('.copy-btn').forEach(btn => {
            if (btn.textContent === 'Copiar') {
                btn.textContent = text;
            }
        });
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.codeCopyManager = new CodeCopyManager();
});

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeCopyManager;
}