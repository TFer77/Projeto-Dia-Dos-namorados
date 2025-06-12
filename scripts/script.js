document.addEventListener("DOMContentLoaded", () => {
    // ===================================================================
    // FEATURE 1: VÍDEO COM AUTOPLAY AO ROLAR
    // ===================================================================
    const video = document.getElementById("video-surpresa");
    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting ? video.play().catch(e => {}) : video.pause());
        }, { threshold: 0.5 });
        videoObserver.observe(video);
    }

    // ===================================================================
    // FEATURE 2: TROCA DE MÚSICA NA ROLAGEM (PLAYER PRINCIPAL)
    // ===================================================================
    const player = document.getElementById("player");
    const botaoMusica = document.getElementById("botao-musica");
    const capitulos = document.querySelectorAll(".capitulo");
    const musicaParte1 = "audio/Matue-AnosLuz.mp3";
    const musicaParte2 = "audio/Lisboa.mp3";
    let musicaIniciada = false;
    let musicaAtual = musicaParte1;
    let scrollTimeout;

    if (botaoMusica) {
        botaoMusica.addEventListener("click", () => {
            musicaIniciada = true;
            botaoMusica.style.display = 'none';
            player.play().catch(e => {});
        });
    }

    function checarCapituloAtivo() {
        if (surpresaFinalAtivada) return;
        let capituloCentral = null;
        const centroDaTela = window.innerHeight / 2;
        capitulos.forEach(capitulo => {
            const rect = capitulo.getBoundingClientRect();
            if (rect.top <= centroDaTela && rect.bottom >= centroDaTela) {
                capituloCentral = capitulo;
            }
        });

        if (capituloCentral) {
            const chapterId = capituloCentral.id;
            let proximaMusica = null;
            if (['prologo', 'capitulo1', 'capitulo2', 'capitulo3'].includes(chapterId)) {
                proximaMusica = musicaParte1;
            } else if (['capitulo4', 'capitulo5'].includes(chapterId)) {
                proximaMusica = musicaParte2;
            } else if (chapterId === 'capitulo6') {
                player.pause();
                proximaMusica = null;
            }
            if (proximaMusica && !player.src.includes(proximaMusica)) {
                musicaAtual = proximaMusica;
                player.src = musicaAtual;
                player.play().catch(e => {});
            }
        }
    }

    window.addEventListener('scroll', () => {
        if (!musicaIniciada) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checarCapituloAtivo, 100);
    });

   // ===================================================================
    // FEATURE 3: CHUVA DE CORAÇÕES FIXA NA TELA
    // ===================================================================
    const containerCoracoes = document.getElementById("efeito-chuva-de-coracoes");
    if (containerCoracoes) {
        setInterval(() => {
            const coracao = document.createElement("div");
            coracao.classList.add("coracao");
            coracao.innerText = "💙";
            coracao.style.left = Math.random() * 100 + "vw";
            coracao.style.animationDuration = (Math.random() * 4 + 4) + "s";
            coracao.style.opacity = Math.random() * 0.7 + 0.3;
            coracao.style.fontSize = (Math.random() * 16 + 10) + 'px';
            containerCoracoes.appendChild(coracao);
            setTimeout(() => {
                coracao.remove();
            }, 8000);
        }, 200);
    }
    // ===================================================================
    // FEATURE 4: LÓGICA DA SURPRESA FINAL (CAPÍTULO 6)
    // ===================================================================
    const imagemSurpresa = document.getElementById("imagem-surpresa-final");
    const conteudoFinal = document.getElementById("conteudo-final-revelado");
    const audioFinal = document.getElementById("audio-final");
    let surpresaFinalAtivada = false;

    // ... código dos contadores ...
    const spanDiasPessoalmente = document.querySelector("#contador-pessoalmente .dias");
    const spanDiasMudanca = document.querySelector("#contador-mudanca .dias");
    const dataPessoalmente = new Date('2021-09-04T00:00:00');
    const dataMudanca = new Date('2025-05-01T00:00:00');
    function atualizarContadores() {
        const hoje = new Date();
        const diffPessoalmente = hoje - dataPessoalmente;
        const diffMudanca = hoje - dataMudanca;
        const diasTotalPessoalmente = Math.floor(diffPessoalmente / (1000 * 60 * 60 * 24));
        const diasTotalMudanca = Math.floor(diffMudanca / (1000 * 60 * 60 * 24));
        if (spanDiasPessoalmente) spanDiasPessoalmente.innerText = diasTotalPessoalmente;
        if (spanDiasMudanca) spanDiasMudanca.innerText = diasTotalMudanca;
    }
    if (spanDiasPessoalmente && spanDiasMudanca) {
        atualizarContadores();
    }
    
    // ##################################################################
    // ### NOVA VERSÃO DA EXPLOSÃO DE CORAÇÕES (À PROVA DE BUGS) ###
    // ##################################################################
    function explosaoDeCoracoes(e) {
        const quantidade = 30;
        const anguloBase = Math.PI * 2 / quantidade; // Divide o círculo em 30 fatias

        for (let i = 0; i < quantidade; i++) {
            const particula = document.createElement('div');
            // Usamos a classe do CSS apenas para a cor e tamanho, não para a animação
            particula.classList.add('particula-coracao-js'); 
            document.body.appendChild(particula);
            particula.innerText = '❤';

            const velocidade = Math.random() * 50 + 50; // Velocidade aleatória
            // Calcula um ângulo para cada partícula e adiciona um pouco de aleatoriedade
            const angulo = i * anguloBase + (Math.random() - 0.5) * anguloBase;

            let x = e.clientX;
            let y = e.clientY;
            let opacidade = 1;
            let escala = 1;
            let tempoDeVida = 0;
            const duracaoTotal = 1200; // 1.2 segundos

            // Função que anima esta partícula específica
            function animar() {
                // Move a partícula
                x += Math.cos(angulo) * (velocidade / 30); // Divide para suavizar o movimento
                y += Math.sin(angulo) * (velocidade / 30);
                
                // Atualiza o tempo
                tempoDeVida += 20;

                // Diminui a opacidade e o tamanho ao longo do tempo
                opacidade = 1 - (tempoDeVida / duracaoTotal);
                escala = 1 - (tempoDeVida / duracaoTotal);

                particula.style.position = 'fixed';
                particula.style.left = `${x}px`;
                particula.style.top = `${y}px`;
                particula.style.opacity = opacidade;
                particula.style.transform = `scale(${escala}) rotate(${tempoDeVida}deg)`;
                
                // Se o tempo de vida não acabou, continua a animação
                if (tempoDeVida < duracaoTotal) {
                    requestAnimationFrame(animar);
                } else {
                    particula.remove(); // Remove a partícula no final
                }
            }
            // Inicia a animação
            requestAnimationFrame(animar);
        }
    }

    if (imagemSurpresa) {
        imagemSurpresa.addEventListener('click', (e) => {
            surpresaFinalAtivada = true;
            imagemSurpresa.classList.remove('blur');
            const instrucao = document.querySelector(".instrucao-final");
            if (instrucao) instrucao.style.display = 'none';
            if (conteudoFinal) conteudoFinal.classList.remove('escondido');
            
            player.pause();
            if (audioFinal) audioFinal.play();
            
            explosaoDeCoracoes(e); // Chamada continua a mesma
        }, { once: true });
    }
});
