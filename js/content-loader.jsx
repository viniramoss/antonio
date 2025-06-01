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
                    <div class="difficulty-badge easy">FÁCIL</div>
                    <h3>⭐ Exercício 3: Contador de Estrelas</h3>
                    <p><strong>Contexto:</strong> Você está fazendo um desenho em ASCII e precisa criar linhas de estrelas.</p>
                    <p><strong>Problema:</strong> Imprima 7 linhas, onde cada linha tem um número crescente de estrelas (linha 1 = 1 estrela, linha 2 = 2 estrelas, etc.).</p>
                    <p><strong>Exemplo de saída:</strong></p>
                    <div class="output-block">*
**
***
****
*****
******
*******</div>
                </div>
                
                <div class="exercise-card">
                    <div class="difficulty-badge easy">FÁCIL</div>
                    <h3>🎯 Exercício 4: Tabuada Simples</h3>
                    <p><strong>Contexto:</strong> Você está ajudando uma criança a estudar matemática.</p>
                    <p><strong>Problema:</strong> Crie a tabuada do 5, mostrando as multiplicações de 5 × 1 até 5 × 10.</p>
                    <p><strong>Exemplo de saída:</strong></p>
                    <div class="output-block">5 × 1 = 5
5 × 2 = 10
5 × 3 = 15
...
5 × 10 = 50</div>
                </div>
                
                <div class="exercise-card">
                    <div class="difficulty-badge easy">FÁCIL</div>
                    <h3>🏃 Exercício 5: Contador Regressivo</h3>
                    <p><strong>Contexto:</strong> Você está criando um timer para uma corrida.</p>
                    <p><strong>Problema:</strong> Faça uma contagem regressiva de 10 até 1, e no final mostre "LARGADA!".</p>
                    <p><strong>Exemplo de saída:</strong></p>
                    <div class="output-block">10
9
8
7
6
5
4
3
2
1
LARGADA!</div>
                </div>
                
                <!-- NÍVEL MÉDIO -->
                <h3>🟡 Nível Médio - Aplicando Conceitos</h3>
                
                <div class="exercise-card">
                    <div class="difficulty-badge medium">MÉDIO</div>
                    <h3>💰 Exercício 6: Simulador de Poupança</h3>
                    <p><strong>Contexto:</strong> Você quer saber quando sua poupança vai atingir uma meta.</p>
                    <p><strong>Problema:</strong> Comece com R$ 1000,00. A cada mês, adicione R$ 150,00 e ganhe 0,5% de juros sobre o total. Calcule em quantos meses você chegará a R$ 3000,00.</p>
                    <p><strong>Fórmula:</strong> novo_valor = (valor_atual + deposito) * 1.005</p>
                </div>
                
                <div class="exercise-card">
                    <div class="difficulty-badge medium">MÉDIO</div>
                    <h3>🎲 Exercício 7: Jogo de Par ou Ímpar</h3>
                    <p><strong>Contexto:</strong> Criar um jogo simples de par ou ímpar com o computador.</p>
                    <p><strong>Problema:</strong> O usuário escolhe par ou ímpar, digita um número, o computador gera um número aleatório. Continue até o usuário decidir parar.</p>
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

                <div class="exercise-card">
                    <h3>🔢 Solução 2: Soma dos Primeiros N Números</h3>
                    
                    <div class="code-block">
<span class="comment"># Soma dos Primeiros N Números - Solução</span>

<span class="function">n</span> <span class="operator">=</span> <span class="number">5</span>  <span class="comment"># Número até onde somar (você pode mudar)</span>
<span class="function">soma</span> <span class="operator">=</span> <span class="number">0</span>  <span class="comment"># Acumulador da soma</span>
<span class="function">atual</span> <span class="operator">=</span> <span class="number">1</span>  <span class="comment"># Número atual sendo somado</span>

<span class="keyword">while</span> <span class="function">atual</span> <span class="operator">&lt;=</span> <span class="function">n</span><span class="operator">:</span>  <span class="comment"># Enquanto não chegou ao limite</span>
    <span class="function">soma</span> <span class="operator">+=</span> <span class="function">atual</span>  <span class="comment"># Adiciona o número atual à soma</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Somando {atual}, total agora: {soma}"</span><span class="operator">)</span>  <span class="comment"># Debug</span>
    <span class="function">atual</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Próximo número</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">f"Resultado final: {soma}"</span><span class="operator">)</span>
                    </div>
                    
                    <div class="concept-box">
                        <h4>🧠 Conceito: Acumulador</h4>
                        <p>A variável <strong>soma</strong> é um <em>acumulador</em> - ela guarda o resultado parcial e vai crescendo a cada iteração.</p>
                        <p><strong>Padrão importante:</strong> acumulador += valor</p>
                    </div>
                </div>

                <div class="exercise-card">
                    <h3>⭐ Solução 3: Contador de Estrelas</h3>
                    
                    <div class="code-block">
<span class="comment"># Contador de Estrelas - Solução</span>

<span class="function">linha</span> <span class="operator">=</span> <span class="number">1</span>  <span class="comment"># Começamos na primeira linha</span>

<span class="keyword">while</span> <span class="function">linha</span> <span class="operator">&lt;=</span> <span class="number">7</span><span class="operator">:</span>  <span class="comment"># 7 linhas total</span>
    <span class="function">estrelas</span> <span class="operator">=</span> <span class="string">"*"</span> <span class="operator">*</span> <span class="function">linha</span>  <span class="comment"># Cria string com N estrelas</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">estrelas</span><span class="operator">)</span>  <span class="comment"># Imprime a linha</span>
    <span class="function">linha</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Próxima linha</span>
                    </div>
                    
                    <div class="tip-box">
                        <h4>🔥 Dica Pro:</h4>
                        <p><strong>"*" * linha</strong> é um truque do Python que repete a string "*" um número específico de vezes!</p>
                        <ul>
                            <li>"*" * 1 = "*"</li>
                            <li>"*" * 3 = "***"</li>
                            <li>"*" * 5 = "*****"</li>
                        </ul>
                    </div>
                </div>

                <div class="exercise-card">
                    <h3>🎯 Solução 4: Tabuada Simples</h3>
                    
                    <div class="code-block">
<span class="comment"># Tabuada do 5 - Solução</span>

<span class="function">multiplicador</span> <span class="operator">=</span> <span class="number">1</span>  <span class="comment"># Começamos multiplicando por 1</span>

<span class="keyword">while</span> <span class="function">multiplicador</span> <span class="operator">&lt;=</span> <span class="number">10</span><span class="operator">:</span>  <span class="comment"># Vai até 10</span>
    <span class="function">resultado</span> <span class="operator">=</span> <span class="number">5</span> <span class="operator">*</span> <span class="function">multiplicador</span>  <span class="comment"># Calcula 5 × multiplicador</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"5 × {multiplicador} = {resultado}"</span><span class="operator">)</span>  <span class="comment"># Mostra a conta</span>
    <span class="function">multiplicador</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Próximo número</span>
                    </div>
                    
                    <div class="concept-box">
                        <h4>💡 Conceito: f-strings</h4>
                        <p>O <strong>f"texto {variavel}"</strong> é uma forma moderna e limpa de inserir variáveis dentro de strings em Python. Muito mais legível que concatenação!</p>
                    </div>
                </div>

                <div class="exercise-card">
                    <h3>🏃 Solução 5: Contador Regressivo</h3>
                    
                    <div class="code-block">
<span class="comment"># Contador Regressivo - Solução</span>

<span class="function">tempo</span> <span class="operator">=</span> <span class="number">10</span>  <span class="comment"># Começamos em 10</span>

<span class="keyword">while</span> <span class="function">tempo</span> <span class="operator">&gt;=</span> <span class="number">1</span><span class="operator">:</span>  <span class="comment"># Enquanto maior ou igual a 1</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="function">tempo</span><span class="operator">)</span>  <span class="comment"># Mostra o número</span>
    <span class="function">tempo</span> <span class="operator">-=</span> <span class="number">1</span>  <span class="comment"># DECREMENTA (diminui 1)</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">"LARGADA!"</span><span class="operator">)</span>  <span class="comment"># Mensagem final</span>
                    </div>
                    
                    <div class="warning-box">
                        <h4>⚠️ Atenção: Decremento!</h4>
                        <p>Aqui usamos <strong>tempo -= 1</strong> em vez de <strong>tempo += 1</strong>!</p>
                        <p>Isso diminui o valor, fazendo a contagem ser regressiva.</p>
                        <p><strong>Condição:</strong> while tempo >= 1 (não tempo <= 1!)</p>
                    </div>
                </div>

                <!-- SOLUÇÕES NÍVEL MÉDIO -->
                <h3>🟡 Soluções Nível Médio</h3>
                
                <div class="exercise-card">
                    <h3>💰 Solução 6: Simulador de Poupança</h3>
                    
                    <div class="code-block">
<span class="comment"># Simulador de Poupança - Solução</span>

<span class="function">saldo</span> <span class="operator">=</span> <span class="number">1000.00</span>  <span class="comment"># Valor inicial</span>
<span class="function">deposito_mensal</span> <span class="operator">=</span> <span class="number">150.00</span>  <span class="comment"># Valor depositado por mês</span>
<span class="function">taxa_juros</span> <span class="operator">=</span> <span class="number">1.005</span>  <span class="comment"># 0,5% = 1.005</span>
<span class="function">meta</span> <span class="operator">=</span> <span class="number">3000.00</span>  <span class="comment"># Objetivo</span>
<span class="function">mes</span> <span class="operator">=</span> <span class="number">0</span>  <span class="comment"># Contador de meses</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">f"💰 Meta: R$ {meta:.2f}"</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">f"💵 Saldo inicial: R$ {saldo:.2f}"</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">"" + "="*40</span><span class="operator">)</span>

<span class="keyword">while</span> <span class="function">saldo</span> <span class="operator">&lt;</span> <span class="function">meta</span><span class="operator">:</span>  <span class="comment"># Enquanto não atingir a meta</span>
    <span class="function">mes</span> <span class="operator">+=</span> <span class="number">1</span>  <span class="comment"># Próximo mês</span>
    <span class="function">saldo</span> <span class="operator">+=</span> <span class="function">deposito_mensal</span>  <span class="comment"># Adiciona depósito</span>
    <span class="function">saldo</span> <span class="operator">*=</span> <span class="function">taxa_juros</span>  <span class="comment"># Aplica juros</span>
    
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Mês {mes:2d}: R$ {saldo:8.2f}"</span><span class="operator">)</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">"" + "="*40</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">f"🎉 Meta atingida em {mes} meses!"</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">f"💰 Saldo final: R$ {saldo:.2f}"</span><span class="operator">)</span>
                    </div>
                    
                    <div class="concept-box">
                        <h4>🧮 Conceitos Financeiros</h4>
                        <p><strong>Juros compostos:</strong> saldo *= 1.005 (multiplica por 1 + taxa)</p>
                        <p><strong>Formatação:</strong> {valor:.2f} mostra 2 casas decimais</p>
                        <p><strong>Alinhamento:</strong> {mes:2d} alinha números à direita</p>
                    </div>
                </div>

                <div class="exercise-card">
                    <h3>🎲 Solução 7: Jogo de Par ou Ímpar</h3>
                    
                    <div class="code-block">
<span class="comment"># Jogo de Par ou Ímpar - Solução</span>
<span class="keyword">import</span> <span class="builtin">random</span>

<span class="function">continuar</span> <span class="operator">=</span> <span class="builtin">True</span>
<span class="function">vitorias_usuario</span> <span class="operator">=</span> <span class="number">0</span>
<span class="function">vitorias_computador</span> <span class="operator">=</span> <span class="number">0</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">"🎲 Bem-vindo ao Jogo de Par ou Ímpar!"</span><span class="operator">)</span>

<span class="keyword">while</span> <span class="function">continuar</span><span class="operator">:</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">"\n" + "="*30</span><span class="operator">)</span>
    
    <span class="comment"># Usuário escolhe par ou ímpar</span>
    <span class="function">escolha_valida</span> <span class="operator">=</span> <span class="builtin">False</span>
    <span class="keyword">while</span> <span class="keyword">not</span> <span class="function">escolha_valida</span><span class="operator">:</span>
        <span class="function">escolha</span> <span class="operator">=</span> <span class="builtin">input</span><span class="operator">(</span><span class="string">"Escolha PAR ou ÍMPAR: "</span><span class="operator">)</span><span class="operator">.</span><span class="method">upper</span><span class="operator">()</span><span class="operator">.</span><span class="method">strip</span><span class="operator">()</span>
        <span class="keyword">if</span> <span class="function">escolha</span> <span class="keyword">in</span> <span class="operator">[</span><span class="string">"PAR"</span><span class="operator">,</span> <span class="string">"IMPAR"</span><span class="operator">,</span> <span class="string">"ÍMPAR"</span><span class="operator">]</span><span class="operator">:</span>
            <span class="keyword">if</span> <span class="function">escolha</span> <span class="keyword">in</span> <span class="operator">[</span><span class="string">"IMPAR"</span><span class="operator">,</span> <span class="string">"ÍMPAR"</span><span class="operator">]</span><span class="operator">:</span>
                <span class="function">escolha</span> <span class="operator">=</span> <span class="string">"ÍMPAR"</span>
            <span class="function">escolha_valida</span> <span class="operator">=</span> <span class="builtin">True</span>
        <span class="keyword">else</span><span class="operator">:</span>
            <span class="builtin">print</span><span class="operator">(</span><span class="string">"❌ Digite apenas PAR ou ÍMPAR!"</span><span class="operator">)</span>
    
    <span class="comment"># Usuário digita número</span>
    <span class="function">numero_usuario</span> <span class="operator">=</span> <span class="builtin">int</span><span class="operator">(</span><span class="builtin">input</span><span class="operator">(</span><span class="string">"Digite um número (0-10): "</span><span class="operator">))</span>
    <span class="function">numero_computador</span> <span class="operator">=</span> <span class="builtin">random</span><span class="operator">.</span><span class="method">randint</span><span class="operator">(</span><span class="number">0</span><span class="operator">,</span> <span class="number">10</span><span class="operator">)</span>
    <span class="function">soma</span> <span class="operator">=</span> <span class="function">numero_usuario</span> <span class="operator">+</span> <span class="function">numero_computador</span>
    
    <span class="comment"># Verifica se soma é par ou ímpar</span>
    <span class="function">resultado</span> <span class="operator">=</span> <span class="string">"PAR"</span> <span class="keyword">if</span> <span class="function">soma</span> <span class="operator">%</span> <span class="number">2</span> <span class="operator">==</span> <span class="number">0</span> <span class="keyword">else</span> <span class="string">"ÍMPAR"</span>
    
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Você: {numero_usuario} | Computador: {numero_computador}"</span><span class="operator">)</span>
    <span class="builtin">print</span><span class="operator">(</span><span class="string">f"Soma: {soma} ({resultado})"</span><span class="operator">)</span>
    
    <span class="comment"># Verifica quem ganhou</span>
    <span class="keyword">if</span> <span class="function">escolha</span> <span class="operator">==</span> <span class="function">resultado</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">"🎉 Você ganhou!"</span><span class="operator">)</span>
        <span class="function">vitorias_usuario</span> <span class="operator">+=</span> <span class="number">1</span>
    <span class="keyword">else</span><span class="operator">:</span>
        <span class="builtin">print</span><span class="operator">(</span><span class="string">"😔 Computador ganhou!"</span><span class="operator">)</span>
        <span class="function">vitorias_computador</span> <span class="operator">+=</span> <span class="number">1</span>
    
    <span class="comment"># Pergunta se quer continuar</span>
    <span class="function">resposta</span> <span class="operator">=</span> <span class="builtin">input</span><span class="operator">(</span><span class="string">"\nJogar novamente? (s/n): "</span><span class="operator">)</span><span class="operator">.</span><span class="method">lower</span><span class="operator">()</span><span class="operator">.</span><span class="method">strip</span><span class="operator">()</span>
    <span class="function">continuar</span> <span class="operator">=</span> <span class="function">resposta</span> <span class="keyword">in</span> <span class="operator">[</span><span class="string">"s"</span><span class="operator">,</span> <span class="string">"sim"</span><span class="operator">,</span> <span class="string">"y"</span><span class="operator">,</span> <span class="string">"yes"</span><span class="operator">]</span>

<span class="builtin">print</span><span class="operator">(</span><span class="string">f"\n🏆 Placar Final:"</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">f"Você: {vitorias_usuario} | Computador: {vitorias_computador}"</span><span class="operator">)</span>
<span class="builtin">print</span><span class="operator">(</span><span class="string">"Obrigado por jogar! 👋"</span><span class="operator">)</span>
                    </div>
                    
                    <div class="tip-box">
                        <h4>🎯 Conceitos Avançados Aplicados:</h4>
                        <ul>
                            <li><strong>While aninhado:</strong> Loop dentro de loop para validação</li>
                            <li><strong>Operador módulo (%):</strong> soma % 2 == 0 verifica se é par</li>
                            <li><strong>Operador ternário:</strong> valor = A if condição else B</li>
                            <li><strong>Métodos de string:</strong> .upper(), .lower(), .strip()</li>
                            <li><strong>Controle de fluxo:</strong> Várias condições de saída</li>
                        </ul>
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