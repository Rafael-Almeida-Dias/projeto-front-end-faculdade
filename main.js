// ========================================
// FUNÇÕES DE FORMATAÇÃO (Máscaras)
// ========================================

/**
 * Aplica a máscara de CPF: 000.000.000-00
 * @param {string} valor
 * @returns {string}
 */
function formatarCPF(valor) {
    // 1. Remove tudo que não é número
    valor = valor.replace(/\D/g, '');
    
    // 2. Limita a 11 dígitos (se o input permitir mais)
    valor = valor.substring(0, 11);
    
    // 3. Aplica a máscara de trás para frente
    let resultado = '';

    if (valor.length > 9) {
        resultado = '-' + valor.substring(9); // -00
    }
    if (valor.length > 6) {
        resultado = '.' + valor.substring(6, 9) + resultado; // .000-00
    }
    if (valor.length > 3) {
        resultado = '.' + valor.substring(3, 6) + resultado; // .000.000-00
    }
    resultado = valor.substring(0, 3) + resultado; // 000.000.000-00
    
    return resultado;
}

/**
 * Aplica a máscara de Telefone: (00) 00000-0000
 * @param {string} valor
 * @returns {string}
 */
function formatarTelefone(valor) {
    // Remove tudo que não é número
    valor = valor.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    valor = valor.substring(0, 11);
    
    // Aplica a máscara
    let resultado = '';
    
    if (valor.length > 0) {
        resultado = '(' + valor.substring(0, 2);
    }
    if (valor.length > 2) {
        // Se for celular (9 dígitos + DDD), aplica o 5º dígito
        if (valor.length > 10) { 
            resultado += ') ' + valor.substring(2, 7);
        } else {
            resultado += ') ' + valor.substring(2, 6);
        }
    }
    if (valor.length > 7) {
        // Posição do traço depende se é celular ou fixo
        const inicioDoisUltimos = (valor.length > 10) ? 7 : 6;
        resultado += '-' + valor.substring(inicioDoisUltimos);
    } else if (valor.length > 6) {
        resultado += '-' + valor.substring(6);
    }
    
    return resultado;
}

/**
 * Aplica a máscara de CEP: 00000-000
 * @param {string} valor
 * @returns {string}
 */
function formatarCEP(valor) {
    // Remove tudo que não é número
    valor = valor.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    valor = valor.substring(0, 8);
    
    // Aplica a máscara: 00000-000
    if (valor.length > 5) {
        valor = valor.substring(0, 5) + '-' + valor.substring(5);
    }
    
    return valor;
}


// ========================================
// FUNÇÕES DE VALIDAÇÃO (Formulário)
// ========================================

/**
 * Validação de CPF (algoritmo de validação)
 * @param {string} cpf - O CPF a ser validado (com ou sem máscara)
 * @returns {boolean}
 */
function validarCPF(cpf) {
    // Remove caracteres especiais
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos e se todos os dígitos são iguais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    // Algoritmo de validação dos dígitos verificadores
    let soma = 0;
    let resto;
    
    // 1º dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // 2º dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

/**
 * Validação de Email (Regex básica)
 * @param {string} email
 * @returns {boolean}
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validação de Telefone (11 dígitos, DDD + 9 dígitos)
 * @param {string} telefone - O telefone a ser validado (com ou sem máscara)
 * @returns {boolean}
 */
function validarTelefone(telefone) {
    const digitos = telefone.replace(/\D/g, '');
    return digitos.length === 11; // Espera (00) 00000-0000
}

/**
 * Validação de CEP (8 dígitos)
 * @param {string} cep - O CEP a ser validado (com ou sem máscara)
 * @returns {boolean}
 */
function validarCEP(cep) {
    const digitos = cep.replace(/\D/g, '');
    return digitos.length === 8;
}

/**
 * Exibe mensagem de erro abaixo do campo de input
 * @param {HTMLElement} campo
 * @param {string} mensagem
 */
function exibirErro(campo, mensagem) {
    // 1. Remove erro anterior se existir
    const erroAnterior = campo.parentElement.querySelector('.mensagem-erro');
    if (erroAnterior) {
        erroAnterior.remove();
    }
    
    // 2. Adiciona classe de erro no input (estilo no CSS)
    campo.classList.add('input-error');
    
    // 3. Cria e exibe mensagem de erro
    const mensagemErro = document.createElement('small');
    mensagemErro.className = 'mensagem-erro';
    mensagemErro.style.color = 'var(--error-600)'; // Usa a variável do CSS
    mensagemErro.style.display = 'block';
    mensagemErro.style.marginTop = '4px';
    mensagemErro.textContent = mensagem;
    
    // Insere após o campo
    campo.parentElement.insertBefore(mensagemErro, campo.nextSibling);
}

/**
 * Remove mensagem de erro abaixo do campo de input
 * @param {HTMLElement} campo
 */
function removerErro(campo) {
    campo.classList.remove('input-error');
    const erroAnterior = campo.parentElement.querySelector('.mensagem-erro');
    if (erroAnterior) {
        erroAnterior.remove();
    }
}


// ========================================
// INICIALIZAÇÃO E EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- CARROSSEL - MISSÃO, VISÃO E VALORES ---
    const slides = document.querySelectorAll('.slide');
    const setaAnterior = document.querySelector('.seta-anterior');
    const setaProximo = document.querySelector('.seta-proximo');
    let indiceSlideAtual = 0;
    
    // Função para mostrar um slide específico
    function mostrarSlide(n) {
        slides.forEach(slide => {
            slide.classList.remove('ativo');
            slide.setAttribute('aria-disabled', 'true'); // Desabilita o clique para acessibilidade
        });
        if (slides[n]) {
            slides[n].classList.add('ativo');
            slides[n].removeAttribute('aria-disabled');
            indiceSlideAtual = n;
        }
    }
    
    // Função para avançar/retroceder slides
    function mudarSlide(direcao) {
        let proximoIndice = indiceSlideAtual + direcao;
        if (proximoIndice >= slides.length) {
            proximoIndice = 0;
        } else if (proximoIndice < 0) {
            proximoIndice = slides.length - 1;
        }
        mostrarSlide(proximoIndice);
    }
    
    // Event Listeners para as setas
    if (setaAnterior) {
        setaAnterior.addEventListener('click', () => mudarSlide(-1));
    }
    if (setaProximo) {
        setaProximo.addEventListener('click', () => mudarSlide(1));
    }

    // Event Listener para CLIQUE no Slide ATUAL (Abre a modal)
    slides.forEach(slide => {
        slide.addEventListener('click', function() {
            // Abre a modal apenas se o slide estiver ativo
            if (this.classList.contains('ativo')) {
                const modalId = this.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if (modal && typeof modal.showModal === 'function') {
                    modal.showModal();
                }
            }
        });
    });

    // Inicializa o carrossel mostrando o primeiro slide
    if (slides.length > 0) {
        mostrarSlide(indiceSlideAtual);
    }
    
    // --- MODAIS PARA MISSÃO, VISÃO E VALORES (Utilizando <dialog>) ---
    const botoesFecharModal = document.querySelectorAll('.btn-close-modal');
    
    // Fecha a modal ao clicar no botão "Fechar" ou no 'x'
    botoesFecharModal.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('dialog');
            if (modal && typeof modal.close === 'function') {
                modal.close();
            }
        });
    });
    
    
    // --- MENU HAMBÚRGUER ---
    const btnMenu = document.getElementById('btn-menu-mobile');
    const menuPrincipal = document.getElementById('menu-principal');
    
    if (btnMenu && menuPrincipal) {
        btnMenu.addEventListener('click', function(){
            const estaAberto = this.getAttribute('aria-expanded') === 'true';
            
            // Alterna o estado do botão
            this.setAttribute('aria-expanded', !estaAberto);
            
            // Adiciona/remove a classe que mostra o menu (controlada pelo CSS)
            menuPrincipal.classList.toggle('menu-aberto', !estaAberto);
        })
    }
    
    // --- MÁSCARAS E VALIDAÇÃO DO FORMULÁRIO (Cadastro.html) ---
    const campoCPF = document.getElementById('cpf');
    const campoTelefone = document.getElementById('telefone');
    const campoCEP = document.getElementById('cep');
    const formulario = document.querySelector('form');
    const campoEmail = document.querySelector('input[type="email"]');
    
    // Aplica formatação ao CPF
    if (campoCPF) {
        campoCPF.addEventListener('input', function() {
            this.value = formatarCPF(this.value);
            removerErro(this); // Remove o erro ao digitar
        });
        campoCPF.addEventListener('blur', function() {
            if (this.value && !validarCPF(this.value)) {
                exibirErro(this, 'CPF inválido. Verifique o número digitado.');
            } else {
                removerErro(this);
            }
        });
    }

    // Aplica formatação ao Telefone
    if (campoTelefone) {
        campoTelefone.addEventListener('input', function() {
            this.value = formatarTelefone(this.value);
            removerErro(this);
        });
        campoTelefone.addEventListener('blur', function() {
            if (this.value && !validarTelefone(this.value)) {
                exibirErro(this, 'Telefone inválido. Digite um número com DDD e 9 dígitos.');
            } else {
                removerErro(this);
            }
        });
    }

    // Aplica formatação ao CEP
    if (campoCEP) {
        campoCEP.addEventListener('input', function() {
            this.value = formatarCEP(this.value);
            removerErro(this);
        });
        campoCEP.addEventListener('blur', function() {
            if (this.value && !validarCEP(this.value)) {
                exibirErro(this, 'CEP inválido. Digite 8 dígitos.');
            } else {
                removerErro(this);
            }
        });
    }
    
    // Validação em tempo real para Email
    if (campoEmail) {
        campoEmail.addEventListener('blur', function() {
            if (this.value && !validarEmail(this.value)) {
                exibirErro(this, 'E-mail inválido. Verifique o formato.');
            } else {
                removerErro(this);
            }
        });
    }
    
    // Validação ao submeter o formulário (Final)
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let formularioValido = true;
            
            // Revalidação de todos os campos avançados na submissão
            
            // Valida CPF
            if (campoCPF && campoCPF.value) {
                if (!validarCPF(campoCPF.value)) {
                    exibirErro(campoCPF, 'CPF inválido.');
                    formularioValido = false;
                }
            }
            
            // Valida Email
            if (campoEmail && campoEmail.value) {
                if (!validarEmail(campoEmail.value)) {
                    exibirErro(campoEmail, 'E-mail inválido.');
                    formularioValido = false;
                }
            }
            
            // Valida Telefone
            if (campoTelefone && campoTelefone.value) {
                if (!validarTelefone(campoTelefone.value)) {
                    exibirErro(campoTelefone, 'Telefone inválido.');
                    formularioValido = false;
                }
            }
            
            // Valida CEP
            if (campoCEP && campoCEP.value) {
                if (!validarCEP(campoCEP.value)) {
                    exibirErro(campoCEP, 'CEP inválido.');
                    formularioValido = false;
                }
            }
            
            if (formularioValido) {
                alert('Formulário enviado com sucesso! Obrigado por se cadastrar na MedCura.');
                // Para enviar o formulário de verdade, descomentar a linha abaixo:
                // this.submit();
            } else {
                // Rola para o primeiro erro se houver
                const primeiroErro = document.querySelector('.input-error');
                if (primeiroErro) {
                    primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                alert('Por favor, corrija os erros no formulário antes de enviar.');
            }
        });
    }
    
    
    // --- MODAIS PARA CAMPANHAS (Projetos.html) ---
    
    // Dados das campanhas (pode ser útil para a modal dinâmica)
    const campanhas = {
        'estoque': {
            titulo: 'Estoque Solidário',
            descricao: 'Arrecadação permanente de medicamentos de alto custo para atender múltiplos pacientes. Sua doação ajuda a manter nosso estoque abastecido e pronto para salvar vidas.',
            progresso: 45,
            meta: '450 frascos de 1.000'
        },
        'oncologico': {
            titulo: 'Fundo de Tratamento Oncológico',
            descricao: 'Recurso financeiro usado para compras centralizadas de medicamentos oncológicos. Cada contribuição nos aproxima da meta para atender pacientes com câncer.',
            progresso: 62,
            meta: 'R$ 62.000 de R$ 100.000'
        },
        'emergencial': {
            titulo: 'Fundo Emergencial',
            descricao: 'Reserva para compras urgentes em casos críticos e doenças raras. Sua doação pode ser a diferença entre a vida e a morte em situações de emergência.',
            progresso: 28,
            meta: 'R$ 28.000 de R$ 100.000'
        }
    };
    
    // Elementos da modal (USANDO <dialog> SIMULADA)
    const modalCampanha = document.createElement('dialog');
    modalCampanha.id = 'modal-campanha';
    modalCampanha.innerHTML = `
        <article>
            <button class="btn-close-modal" aria-label="Fechar modal de campanha">X</button>
            <h3 id="modal-campanha-titulo"></h3>
            <p id="modal-campanha-descricao"></p>
            <div id="modal-campanha-progresso" style="margin: 20px 0;"></div>
            <p id="modal-campanha-meta"></p>
            <button class="btn btn-primary" onclick="window.location.href='cadastro.html'">Fazer Doação</button>
        </article>
    `;
    document.body.appendChild(modalCampanha);
    
    // Event listener para fechar a modal de campanha
    modalCampanha.querySelector('.btn-close-modal').addEventListener('click', () => modalCampanha.close());

    /**
     * Preenche e abre a modal da campanha.
     * @param {string} tipo - 'estoque', 'oncologico', 'emergencial'
     */
    function abrirModalCampanha(tipo) {
        const campanha = campanhas[tipo];
        if (!campanha) return;
        
        document.getElementById('modal-campanha-titulo').textContent = campanha.titulo;
        document.getElementById('modal-campanha-descricao').textContent = campanha.descricao;
        document.getElementById('modal-campanha-meta').innerHTML = `<strong>${campanha.meta}</strong>`;
        
        const progressoHTML = `
            <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${campanha.progresso}">
                <span style="width: ${campanha.progresso}%"></span>
            </div>
        `;
        document.getElementById('modal-campanha-progresso').innerHTML = progressoHTML;
        
        if (typeof modalCampanha.showModal === 'function') {
            modalCampanha.showModal();
        } else {
            // Fallback para browsers que não suportam <dialog>
            alert(`Campanha: ${campanha.titulo}\nMeta: ${campanha.meta}`);
        }
    }
    
    // Event Listeners para os botões de doação nos cards
    const botoesDoacao = document.querySelectorAll('.cards .btn-primary');
    botoesDoacao.forEach(botao => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Identifica qual campanha foi clicada
            const card = this.closest('.card');
            if (card) {
                const titulo = card.querySelector('h3').textContent.toLowerCase();
                
                if (titulo.includes('estoque')) {
                    abrirModalCampanha('estoque');
                } else if (titulo.includes('oncológico')) {
                    abrirModalCampanha('oncologico');
                } else if (titulo.includes('emergencial')) {
                    abrirModalCampanha('emergencial');
                }
            }
        });
    });
});