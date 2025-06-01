/**
 * Sistema de Carregamento de Conteúdo
 * Gerencia o carregamento dinâmico de conteúdo para cada aba
 */

class ContentLoader {
    constructor() {
        this.contentCache = new Map();
        this.loadingStates = new Map();
        this.init();
    }

    init() {
        this.bindEvents();
        this.preloadContent();
    }

    bindEvents() {
        // Escuta mudanças de aba para carregar conteúdo
        document.addEventListener('tabChanged', (e) => {
            this.loadTabContent(e.detail.tabName);
        });
    }

    async loadTabContent(tabName) {
        const container = document.getElementById(`${tabName}-content`);
        if (!container) return;

        // Se já está carregado, não faz nada
        if (this.isContentLoaded(tabName)) return;

        // Se está carregando, aguarda
        if (this.loadingStates.get(tabName)) {
            return this.loadingStates.get(tabName);
        }

        // Mostra loading
        this.showLoading(container);

        // Inicia carregamento
        const loadingPromise = this.fetchContent(tabName);
        this.loadingStates.set(tabName, loadingPromise);

        try {
            const content = await loadingPromise;
            this.renderContent(container, content);
            this.contentCache.set(tabName, content);
        } catch (error) {
            this.showError(container, error);
        } finally {
            this.loadingStates.delete(tabName);
        }
    }

    async fetchContent(tabName) {
        // Simula delay de carregamento
        await this.delay(500);

        switch (tabName) {
            case 'teoria':
                return this.getTeoriaContent();
            case 'exercicios':
                return this.getExerciciosContent();
            case 'solucoes':
                return this.getSolucoesContent();
            default:
                throw new Error(`Conteúdo não encontrado para: ${tabName}`);
        }
    }

    getTeoriaContent() {
        return `
            <div class="section">
                <h2>👶 Exemplo Super Básico</h2>
                
                <p>Vamos contar de 1 até 3. Simples como respirar:</p>
                
                <div class="code-block">
<span class="comment"># Contando de 1 até 3</span>
<span class="function">contador</span> <span class="operator">=</span> <span class="number">1</span>  <span class="comment"># Começamos com 1</span>

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator"><=</span> <span class="number">3</span><span class="operator">:</span>  <span class="comment"># Enquanto contador for menor ou igual a 3</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">contador</span><span class="operator">)</span>  <span class="comment"># Mostra o número</span>
    <span class="function">contador</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Adiciona 1 (SUPER IMPORTANTE!)</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">"Acabou!"</span><span class="operator">)</span>
                </div>
                
                <div class="output-block">1
2
3
Acabou!</div>
                
                <div class="tip-box">
                    <h4>💡 Por que funciona?</h4>
                    <ol>
                        <li><strong>contador = 1</strong> → Condição: 1 <= 3? SIM! → Executa</li>
                        <li><strong>contador = 2</strong> → Condição: 2 <= 3? SIM! → Executa</li>
                        <li><strong>contador = 3</strong> → Condição: 3 <= 3? SIM! → Executa</li>
                        <li><strong>contador = 4</strong> → Condição: 4 <= 3? NÃO! → Para</li>
                    </ol>
                </div>
            </div>

            <div class="section">
                <h2>⚠️ Cuidado com o Loop Infinito!</h2>
                
                <div class="warning-box">
                    <h4>🚨 PERIGO: Loop Infinito</h4>
                    <p>Se você esquecer de modificar a variável da condição, seu programa vai rodar para sempre!</p>
                </div>
                
                <div class="code-block">
<span class="comment"># ❌ CÓDIGO PERIGOSO - NÃO RODE!</span>
<span class="function">contador</span> <span class="operator">=</span> <span class="number">1</span>

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator"><=</span> <span class="number">3</span><span class="operator">:</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">contador</span><span class="operator">)</span>
    <span class="comment"># Esqueceu do contador += 1 → LOOP INFINITO!</span>
    <span class="comment"># Vai imprimir 1, 1, 1, 1... para sempre!</span>
                </div>
                
                <div class="tip-box">
                    <h4>🛡️ Como se proteger?</h4>
                    <p>Sempre se pergunte: <em>"O que vai fazer minha condição virar False?"</em></p>
                    <p>Se não souber a resposta, você provavelmente tem um loop infinito!</p>
                </div>
            </div>
        `;
    }

    getExerciciosContent() {
        return `
            <div class="section">
                <h2>💪 Exercícios Progressivos</h2>
                <p class="intro-text">
                    Exercícios cuidadosamente selecionados do básico ao expert, cobrindo desde problemas simples 
                    até desafios que você pode encontrar em competições e entrevistas técnicas!
                </p>
                
                <div class="exercise-card">
                    <div class="difficulty-badge easy">FÁCIL</div>
                    <h3>🍎 Exercício 1: Contador de Maçãs</h3>
                    <p><strong>Contexto:</strong> Você trabalha em um pomar e precisa contar quantas maçãs colheu.</p>
                    <p><strong>Problema:</strong> Crie um programa que conte de 1 até 10 e imprima "Maçã número X" para cada número.</p>
                    <p><strong>Exemplo de saída:</strong></p>
                    <div class="output-block">Maçã número 1
Maçã número 2
Maçã número 3
...
Maçã número 10
Total: 10 maçãs coletadas!</div>
                </div>
                
                <div class="exercise-card">
                    <div class="difficulty-badge medium">MÉDIO</div>
                    <h3>💰 Exercício 2: Simulador de Poupança</h3>
                    <p><strong>Contexto:</strong> Você quer saber quando sua poupança vai atingir uma meta.</p>
                    <p><strong>Problema:</strong> Comece com R$ 1000,00. A cada mês, adicione R$ 150,00 e ganhe 0,5% de juros sobre o total. Calcule em quantos meses você terá pelo menos R$ 2000,00.</p>
                    <p><strong>Detalhes:</strong></p>
                    <ul>
                        <li>Saldo inicial: R$ 1000,00</li>
                        <li>Depósito mensal: R$ 150,00</li>
                        <li>Juros mensais: 0,5% sobre o saldo total</li>
                        <li>Meta: R$ 2000,00</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getSolucoesContent() {
        return `
            <div class="section">
                <h2>✅ Soluções Detalhadas</h2>
                <p class="intro-text">
                    Cada solução vem com explicação passo a passo e pontos importantes destacados!
                </p>
                
                <div class="exercise-card">
                    <h3>🍎 Solução 1: Contador de Maçãs</h3>
                    
                    <div class="code-block">
<span class="comment"># Contador de Maçãs - Solução</span>

<span class="function">contador</span> <span class="operator">=</span> <span class="number">1</span>  <span class="comment"># Inicializa o contador</span>

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator"><=</span> <span class="number">10</span><span class="operator">:</span>  <span class="comment"># Enquanto contador for menor ou igual a 10</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Maçã número {contador}"</span><span class="operator">)</span>  <span class="comment"># Mostra a maçã atual</span>
    <span class="function">contador</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Incrementa o contador</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">f"Total: {contador-1} maçãs coletadas!"</span><span class="operator">)</span>  <span class="comment"># Total final</span>
                    </div>
                    
                    <div class="tip-box">
                        <h4>📋 Pontos importantes:</h4>
                        <ol>
                            <li><strong>Inicialização:</strong> Começamos com contador = 1</li>
                            <li><strong>Condição:</strong> while contador <= 10 (vai de 1 até 10)</li>
                            <li><strong>Incremento:</strong> contador += 1 evita loop infinito</li>
                            <li><strong>Total:</strong> contador-1 porque após o último loop, contador vira 11</li>
                        </ol>
                    </div>
                </div>
            </div>
        `;
    }

    showLoading(container) {
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Carregando conteúdo...</p>
            </div>
        `;
    }

    showError(container, error) {
        container.innerHTML = `
            <div class="error-container">
                <h3>❌ Erro ao carregar conteúdo</h3>
                <p>Ocorreu um erro: ${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">Tentar novamente</button>
            </div>
        `;
    }

    renderContent(container, content) {
        container.innerHTML = content;
        
        // Trigger evento para notificar que conteúdo foi carregado
        const event = new CustomEvent('contentLoaded', {
            detail: { container }
        });
        document.dispatchEvent(event);
    }

    isContentLoaded(tabName) {
        return this.contentCache.has(tabName);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async preloadContent() {
        // Precarrega conteúdo da teoria (aba inicial)
        await this.loadTabContent('teoria');
    }

    // Método público para limpar cache
    clearCache() {
        this.contentCache.clear();
    }

    // Método público para recarregar conteúdo
    async reloadContent(tabName) {
        this.contentCache.delete(tabName);
        await this.loadTabContent(tabName);
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.contentLoader = new ContentLoader();
});

// Exporta para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
}