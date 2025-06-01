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

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator">&lt;=</span> <span class="number">3</span><span class="operator">:</span>  <span class="comment"># Enquanto contador for menor ou igual a 3</span>
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
                        <li><strong>contador = 1</strong> → Condição: 1 &lt;= 3? SIM! → Executa</li>
                        <li><strong>contador = 2</strong> → Condição: 2 &lt;= 3? SIM! → Executa</li>
                        <li><strong>contador = 3</strong> → Condição: 3 &lt;= 3? SIM! → Executa</li>
                        <li><strong>contador = 4</strong> → Condição: 4 &lt;= 3? NÃO! → Para</li>
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

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator">&lt;=</span> <span class="number">3</span><span class="operator">:</span>
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

            <div class="section">
                <h2>🎮 Exemplos Práticos</h2>
                
                <h3>🎲 Exemplo 1: Jogo de Adivinhação</h3>
                <p>Um exemplo clássico que mostra o poder do while:</p>
                
                <div class="code-block">
<span class="comment"># Jogo de adivinhação - Exemplo prático</span>
<span class="keyword">import</span> <span class="builtin">random</span>

<span class="function">numero_secreto</span> <span class="operator">=</span> <span class="builtin">random</span><span class="operator">.</span><span class="method">randint</span><span class="operator">(</span><span class="number">1</span><span class="operator">,</span> <span class="number">100</span><span class="operator">)</span>
<span class="function">tentativas</span> <span class="operator">=</span> <span class="number">0</span>
<span class="function">acertou</span> <span class="operator">=</span> <span class="builtin">False</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">"🎯 Adivinhe o número de 1 a 100!"</span><span class="operator">)</span>

<span class="keyword">while</span> <span class="keyword">not</span> <span class="function">acertou</span><span class="operator">:</span>  <span class="comment"># Enquanto não acertar</span>
    <span class="function">palpite</span> <span class="operator">=</span> <span class="builtin">int</span><span class="operator">(</span><span class="builtin">input</span><span class="operator">(</span><span class="string">"Seu palpite: "</span><span class="operator">))</span>
    <span class="function">tentativas</span> <span class="operator">+=</span> <span class="number">1</span>
    
    <span class="keyword">if</span> <span class="function">palpite</span> <span class="operator">==</span> <span class="function">numero_secreto</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">f"🎉 Acertou em {tentativas} tentativas!"</span><span class="operator">)</span>
        <span class="function">acertou</span> <span class="operator">=</span> <span class="builtin">True</span>  <span class="comment"># Isso fará o loop parar</span>
    <span class="keyword">elif</span> <span class="function">palpite</span> <span class="operator">&lt;</span> <span class="function">numero_secreto</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">"📈 Muito baixo!"</span><span class="operator">)</span>
    <span class="keyword">else</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">"📉 Muito alto!"</span><span class="operator">)</span>
                </div>
                
                <h3>📊 Exemplo 2: Validação de Input</h3>
                <p>While loops são perfeitos para validar entrada do usuário:</p>
                
                <div class="code-block">
<span class="comment"># Validação robusta de entrada</span>

<span class="function">idade_valida</span> <span class="operator">=</span> <span class="builtin">False</span>

<span class="keyword">while</span> <span class="keyword">not</span> <span class="function">idade_valida</span><span class="operator">:</span>
    <span class="keyword">try</span><span class="operator">:</span>
        <span class="function">idade</span> <span class="operator">=</span> <span class="builtin">int</span><span class="operator">(</span><span class="builtin">input</span><span class="operator">(</span><span class="string">"Digite sua idade (0-120): "</span><span class="operator">))</span>
        
        <span class="keyword">if</span> <span class="number">0</span> <span class="operator">&lt;=</span> <span class="function">idade</span> <span class="operator">&lt;=</span> <span class="number">120</span><span class="operator">:</span>
            <span class="builtin">print</span><span class="operator">(</span><span class="string">f"✅ Idade válida: {idade} anos"</span><span class="operator">)</span>
            <span class="function">idade_valida</span> <span class="operator">=</span> <span class="builtin">True</span>
        <span class="keyword">else</span><span class="operator">:</span>
            <span class="builtin">print</span><span class="operator">(</span><span class="string">"❌ Idade deve estar entre 0 e 120!"</span><span class="operator">)</span>
            
    <span class="keyword">except</span> <span class="builtin">ValueError</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">"❌ Por favor, digite apenas números!"</span><span class="operator">)</span>
                </div>
            </div>
            
            <div class="section">
                <h2>⚠️ Armadilhas Comuns</h2>
                
                <div class="warning-box">
                    <h4>🚨 Armadilha #1: Esqueceu de Incrementar</h4>
                    <p>O erro mais comum! Sempre verifique se a variável da condição é modificada.</p>
                </div>
                
                <div class="code-block">
<span class="comment"># ❌ ERRO COMUM - Loop infinito</span>
<span class="function">i</span> <span class="operator">=</span> <span class="number">0</span>
<span class="keyword">while</span> <span class="function">i</span> <span class="operator">&lt;</span> <span class="number">5</span><span class="operator">:</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">i</span><span class="operator">)</span>
    <span class="comment"># Esqueceu: i += 1</span>

<span class="comment"># ✅ CORREÇÃO</span>
<span class="function">i</span> <span class="operator">=</span> <span class="number">0</span>
<span class="keyword">while</span> <span class="function">i</span> <span class="operator">&lt;</span> <span class="number">5</span><span class="operator">:</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">i</span><span class="operator">)</span>
    <span class="function">i</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># ESSENCIAL!</span>
                </div>
                
                <div class="tip-box">
                    <h4>🛡️ Dica de Segurança</h4>
                    <p><strong>Sempre se pergunte:</strong> "O que vai fazer minha condição virar False?"</p>
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
                
                <!-- NÍVEL INICIANTE -->
                <h3>🟢 Nível Iniciante - Fundamentos</h3>
                
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
                    <div class="difficulty-badge easy">FÁCIL</div>
                    <h3>🔢 Exercício 2: Soma dos Primeiros N Números</h3>
                    <p><strong>Inspirado em:</strong> LeetCode básico</p>
                    <p><strong>Problema:</strong> Dado um número N, calcule a soma de todos os números de 1 até N usando while loop.</p>
                    <p><strong>Exemplo:</strong></p>
                    <ul>
                        <li>Input: N = 5</li>
                        <li>Output: 15 (porque 1+2+3+4+5 = 15)</li>
                    </ul>
                </div>
                
                <div class="exercise-card">
                    <div class="difficulty-badge medium">MÉDIO</div>
                    <h3>💰 Exercício 3: Simulador de Poupança</h3>
                    <p><strong>Contexto:</strong> Você quer saber quando sua poupança vai atingir uma meta.</p>
                    <p><strong>Problema:</strong> Comece com R$ 1000,00. A cada mês, adicione R$ 150,00 e ganhe 0,5% de juros sobre o total.</p>
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

<span class="keyword">while</span> <span class="function">contador</span> <span class="operator">&lt;=</span> <span class="number">10</span><span class="operator">:</span>  <span class="comment"># Enquanto contador for menor ou igual a 10</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Maçã número {contador}"</span><span class="operator">)</span>  <span class="comment"># Mostra a maçã atual</span>
    <span class="function">contador</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Incrementa o contador</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">f"Total: {contador-1} maçãs coletadas!"</span><span class="operator">)</span>  <span class="comment"># Total final</span>
                    </div>
                    
                    <div class="tip-box">
                        <h4>📋 Pontos importantes:</h4>
                        <ol>
                            <li><strong>Inicialização:</strong> Começamos com contador = 1</li>
                            <li><strong>Condição:</strong> while contador &lt;= 10 (vai de 1 até 10)</li>
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