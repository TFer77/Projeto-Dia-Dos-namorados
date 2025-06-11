document.addEventListener("DOMContentLoaded", () => {
    // --- FEATURE 1: VÍDEO (Sem alterações) ---
    const video = document.getElementById("video-surpresa");
    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting ? video.play().catch(e => {}) : video.pause());
        }, { threshold: 0.5 });
        videoObserver.observe(video);
    }

    // --- FEATURE 2: TROCA DE MÚSICA NA ROLAGEM ---
    const player = document.getElementById("player");
    const botaoMusica = document.getElementById("botao-musica");
    const capitulos = document.querySelectorAll(".capitulo");
    const musicaParte1 = "audio/Matue-AnosLuz.mp3";
    const musicaParte2 = "audio/Lisboa.mp3";
    let musicaIniciada = false;
    let musicaAtual = musicaParte1;
    let scrollTimeout;

    botaoMusica.addEventListener("click", () => {
        musicaIniciada = true;
        botaoMusica.style.display = 'none';
        player.play().catch(e => {});
    });

    function checarCapituloAtivo() {
        if (surpresaFinalAtivada) return; // Se a surpresa final foi ativada, para de trocar música

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
                // Pausa a música no capítulo 6 para criar suspense
                player.pause();
                proximaMusica = null; 
            }

            if (proximaMusica && proximaMusica !== musicaAtual) {
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

    // --- FEATURE 3: CHUVA DE CORAÇÕES (Continua igual) ---
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

    // --- NOVO: LÓGICA DA SURPRESA FINAL (CAPÍTULO 6) ---
    const imagemSurpresa = document.getElementById("imagem-surpresa-final");
    const conteudoFinal = document.getElementById("conteudo-final-revelado");
    const audioFinal = document.getElementById("audio-final");
    let surpresaFinalAtivada = false;

    const spanDiasPessoalmente = document.querySelector("#contador-pessoalmente .dias");
    const spanDiasMudanca = document.querySelector("#contador-mudanca .dias");

    // Datas para os contadores
    const dataPessoalmente = new Date('2021-09-04T00:00:00');
    const dataMudanca = new Date('2025-05-01T00:00:00');

    function atualizarContadores() {
        const hoje = new Date();
        const diffPessoalmente = hoje - dataPessoalmente;
        const diffMudanca = hoje - dataMudanca;
        const diasTotalPessoalmente = Math.floor(diffPessoalmente / (1000 * 60 * 60 * 24));
        const diasTotalMudanca = Math.floor(diffMudanca / (1000 * 60 * 60 * 24));
        spanDiasPessoalmente.innerText = diasTotalPessoalmente;
        spanDiasMudanca.innerText = diasTotalMudanca;
    }
    atualizarContadores();

    function explosaoDeCoracoes(e) {
        for (let i = 0; i < 30; i++) {
            const particula = document.createElement('div');
            particula.classList.add('particula-coracao');
            document.body.appendChild(particula);
            particula.innerText = '❤';
            particula.style.top = `${e.clientY}px`;
            particula.style.left = `${e.clientX}px`;
            const xFinal = (Math.random() - 0.5) * 400;
            const yFinal = (Math.random() - 0.5) * 400;
            particula.style.setProperty('--x', `${xFinal}px`);
            particula.style.setProperty('--y', `${yFinal}px`);
            setTimeout(() => { particula.remove(); }, 1200);
        }
    }

    if(imagemSurpresa) {
        imagemSurpresa.addEventListener('click', (e) => {
            surpresaFinalAtivada = true;
            imagemSurpresa.classList.remove('blur');
            document.querySelector(".instrucao-final").style.display = 'none';
            conteudoFinal.classList.remove('escondido');
            
            player.pause(); // Pausa a música de fundo
            audioFinal.play(); // Toca a música final
            
            explosaoDeCoracoes(e);
        }, { once: true });
    }
});