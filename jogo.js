var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

// define audios usados no jogo
const audio_gameover = new Audio("Audios/gameover.mp3");
const audio_erro = new Audio("Audios/erro.mp3");
const audio_quebraBloco = new Audio("Audios/quebrabloco.m4a");
const audio_teste = new Audio("Audios/audio_teste.mp3");
const audio_fim_endless = new Audio("Audios/fim_endless.m4a");
const audio_vitoria = new Audio("Audios/vitoria.mp3");
const audio_musica_principal = new Audio("Audios/musica_principal.mp3");

// listas de tipos de inimigos e de inimigos
let tiposInimigos = ["multiplicacao", "soma", "subtracao"];
let multiplicacao = [];
let soma = [];
let subtracao = [];
let tipoAtual = null;


// configurações iniciais
let ativo = false;
let dificuldade_nivel = "Facil";
document.getElementById("dificuldade").innerHTML = dificuldade_nivel;
let velocidade = 5;
let vidas = 3;
let pontuacao = 0;
let pontuacao_alvo = 10;
let volume = 25;
let modo = "normal";
let pauses = 3;
escondeMostraJogo("esconde");
document.getElementById("background-video").style.display = "none";
canvas.style.display = "none";

let tempoAtualProxInimigo = 0;
let ultimoTempoInimigo = 0;
let tempoInimigo = 5000;

let tempoAtualizacao = 250;
let ultimoTempoAtualizacao = 500;
let tempoAtualProxAtualizacao = 0;


//função principal iniciada pelo botão "Iniciar"
function main(){
    escondeMostraJogo("mostra");
    if (ativo === false){ ctx.clearRect(0,0, canvas.width, canvas.height);
    ativo = true;
    document.getElementById("tutorial").style.display = "none";
    vidas = 3;
    document.getElementById("pontuacao").innerHTML = pontuacao;
    pontuacao = 0;
    pauses = 3;
    let caixa_texto = document.getElementById("caixa_tentativa");
    caixa_texto.style.display = "";
    criaNovoInimigo();
    atualizar();
    audio_musica_principal.play();
}
}

function criaSoma(){
    let coeficiente_dificuldade = 1;
    let coeficiente_dificuldade_velocidade = 1;

    if (dificuldade_nivel === "Facil"){
        coeficiente_dificuldade = 1;
        coeficiente_dificuldade_velocidade = 1;
    }
    if (dificuldade_nivel  === "Medio"){
        coeficiente_dificuldade = 2;
        coeficiente_dificuldade_velocidade = 1.5;

    }
    if (dificuldade_nivel  === "Dificil"){
        coeficiente_dificuldade = 4;
        coeficiente_dificuldade_velocidade = 2;
    }

    let objeto = {
        height: 50,
        width: 100,
        x: Math.floor(Math.random() * (canvas.width - 100)) + 1,
        y: 20,
        velocidade:  velocidade * coeficiente_dificuldade_velocidade,
        primeiroNumero: Math.floor(Math.random() * 101 * coeficiente_dificuldade),
        segundoNumero: Math.floor(Math.random() * 101 * coeficiente_dificuldade)
    };

    soma.push(objeto);
}

function criaMultiplicacao(){

    let coeficiente_dificuldade = 1;
    let coeficiente_dificuldade_velocidade = 1;
    if (dificuldade_nivel  === "Facil"){
        coeficiente_dificuldade = 1;
        coeficiente_dificuldade_velocidade = 1;
    }
    if (dificuldade_nivel  === "Medio"){
        coeficiente_dificuldade = 2;
        coeficiente_dificuldade_velocidade = 1.5;
    }
    if (dificuldade_nivel  === "Dificil"){
        coeficiente_dificuldade = 3;
        coeficiente_dificuldade_velocidade = 2;
    }

    let objeto = {
        height: 50,
        width: 100,
        x: Math.floor(Math.random() * (canvas.width - 100)) + 1,
        y: 20,
        velocidade:  velocidade * coeficiente_dificuldade_velocidade,
        primeiroNumero: Math.floor((Math.random() * 5 + 1) * coeficiente_dificuldade),
        segundoNumero: Math.floor((Math.random() * 5 + 1) * coeficiente_dificuldade)
    };

    multiplicacao.push(objeto);
}

function criaSubtracao(){

    let coeficiente_dificuldade = 1;
    let coeficiente_dificuldade_velocidade = 1;

    if (dificuldade_nivel  === "Facil"){
        coeficiente_dificuldade = 1;
        coeficiente_dificuldade_velocidade = 1;
    }
    if (dificuldade_nivel  === "Medio"){
        coeficiente_dificuldade = 2;
        coeficiente_dificuldade_velocidade = 1.5;

    }
    if (dificuldade_nivel  === "Dificil"){
        coeficiente_dificuldade = 4;
        coeficiente_dificuldade_velocidade = 2;
    }

    let objeto = {
        height: 50,
        width: 100,
        x: Math.floor(Math.random() * (canvas.width - 100)) + 1,
        y: 20,
        velocidade:  velocidade * coeficiente_dificuldade_velocidade,
        primeiroNumero: Math.floor(Math.random() * 101 * coeficiente_dificuldade),
        segundoNumero: Math.floor(Math.random() * 101 * coeficiente_dificuldade)
    };

    subtracao.push(objeto);
}


function criaNovoInimigo(){
    let timestamp = Date.now();
    let tempoAtual = timestamp - ultimoTempoInimigo;
    ultimoTempoInimigo = timestamp;
    tempoAtualProxInimigo += tempoAtual;

    if (tempoAtualProxInimigo > (tempoInimigo/1.1)){
        tempoAtualProxInimigo = 0;
        tipoAtual = tiposInimigos[Math.floor(Math.random() * tiposInimigos.length)];

        if (tipoAtual === "multiplicacao"){
            criaMultiplicacao();
            console.log("multiplicação");
        }

        if (tipoAtual === "soma"){
            criaSoma();
            console.log("soma");
        }

        if (tipoAtual === "subtracao"){
            criaSubtracao();
            console.log("subtração");
        }
    }
    if (ativo === true){
        requestAnimationFrame(criaNovoInimigo);
    }
    else {
        cancelAnimationFrame(criaNovoInimigo);
    }
}

function desenha_soma(x, y, width, height,  primeiroNumero, segundoNumero){
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.fillText(primeiroNumero +"+" + segundoNumero, x + 50, y + 30);
}

function desenha_multiplicacao(x, y, width, height, primeiroNumero, segundoNumero){
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.fillText(primeiroNumero +"x" + segundoNumero, x + 50, y + 30);
}

function desenha_subtracao(x, y, width, height,  primeiroNumero, segundoNumero){
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.fillText(primeiroNumero +"-" + segundoNumero, x + 50, y + 30);
}

function removerItem(array, item){
    return array.filter(f => (f !== item));
}

function atualizar(){
    let timestamp = Date.now();
    let tempoAtual = timestamp - ultimoTempoAtualizacao;
    let vida1 = document.getElementById("vida1");
    let vida2 = document.getElementById("vida2");
    let vida3 = document.getElementById("vida3");
    ultimoTempoAtualizacao = timestamp;
    tempoAtualProxAtualizacao += tempoAtual;

    if (tempoAtualProxAtualizacao > tempoAtualizacao){
        tempoAtualProxAtualizacao = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);

        multiplicacao.forEach(elemento => {
            if ((elemento.y + elemento.height) === canvas.height){
                vidas -= 1;
                audio_erro.play();
                multiplicacao = removerItem(multiplicacao, elemento);
                if (vidas === 2) {
                    console.log("vida3");
                    vida3.style.display = "none";
                }
                if (vidas === 1) {
                    console.log("vida2");
                    vida2.style.display = "none";
                }
                if (vidas === 0) {
                    vida1.style.display = "none";
                    gameover();
                }
            }
        });

        soma.forEach(elemento => {
            if ((elemento.y + elemento.height) === canvas.height){
                vidas -= 1;
                audio_erro.play();
                soma = removerItem(soma, elemento);
                if (vidas === 2) {
                    console.log("vida3");
                    vida3.style.display = "none";
                }
                if (vidas === 1) {
                    console.log("vida2");
                    vida2.style.display = "none";
                }
                if (vidas === 0) {
                    vida1.style.display = "none";
                    gameover();
                }
        }
        });

        subtracao.forEach(elemento => {
            if ((elemento.y + elemento.height) === canvas.height){
                vidas -= 1;
                audio_erro.play();
                subtracao = removerItem(subtracao, elemento);
                if (vidas === 2) {
                    console.log("vida3");
                    vida3.style.display = "none";
                }
                if (vidas === 1) {
                    console.log("vida2");
                    vida2.style.display = "none";
                }
                if (vidas === 0) {
                    vida1.style.display = "none";
                    gameover();
                }
            }
        });

        multiplicacao.forEach(object => object.y += object.velocidade);
        multiplicacao.forEach(object => desenha_multiplicacao(object.x, object.y, object.width, object.height, object.primeiroNumero, object.segundoNumero));
        soma.forEach(object => object.y += object.velocidade);
        soma.forEach(object => desenha_soma(object.x, object.y, object.width, object.height, object.primeiroNumero, object.segundoNumero));
        subtracao.forEach(object => object.y += object.velocidade);
        subtracao.forEach(object => desenha_subtracao(object.x, object.y, object.width, object.height, object.primeiroNumero, object.segundoNumero));
    }

    if (ativo === true){
        requestAnimationFrame(atualizar);
    }
    else{
        cancelAnimationFrame(atualizar);
    }
}


function checar() {
    let tentativa = parseInt(document.getElementById("tentativa").value);
    document.getElementById("tentativa").value = "0";
    if (ativo === true) {
        multiplicacao.forEach(elemento => {
            if ((elemento.primeiroNumero * elemento.segundoNumero) === tentativa) {
                multiplicacao = removerItem(multiplicacao, elemento);
                pontuacao += 1;
                audio_quebraBloco.play();
                document.getElementById("pontuacao").innerHTML = pontuacao;
                if (modo === "normal" && pontuacao >= pontuacao_alvo) {
                    venceu();
                    return (null);
                }
            }
        })
    }
    ;
    if (ativo === true) {
        soma.forEach(elemento => {
            if ((elemento.primeiroNumero + elemento.segundoNumero) === tentativa) {
                soma = removerItem(soma, elemento);
                pontuacao += 1;
                audio_quebraBloco.play();
                document.getElementById("pontuacao").innerHTML = pontuacao;
                if (modo === "normal" && pontuacao >= pontuacao_alvo) {
                    venceu();
                    return (null);
                }
            }
        })
    }
    ;
    if (ativo === true) {
        subtracao.forEach(elemento => {
            if ((elemento.primeiroNumero - elemento.segundoNumero) === tentativa) {
                subtracao = removerItem(subtracao, elemento);
                pontuacao += 1;
                audio_quebraBloco.play();
                document.getElementById("pontuacao").innerHTML = pontuacao;
                if (modo === "normal" && pontuacao >= pontuacao_alvo) {
                    venceu();
                    return (null);
                }
            }
        });
    }
}
function dificuldade(dificuldade){
    if (ativo === false){
        if (dificuldade === 1) {
            dificuldade_nivel = "Facil";
            pontuacao_alvo = 10;
        }
        if (dificuldade === 2) {
        dificuldade_nivel = "Medio";
        pontuacao_alvo = 20;
        }
        if (dificuldade === 3) {
        dificuldade_nivel = "Dificil";
        pontuacao_alvo = 30;
        }
    document.getElementById("dificuldade").innerHTML = dificuldade_nivel;
}
}


function atualizaVolume(){
    volume = document.getElementById("vol").value;
    audio_quebraBloco.volume = volume/1000;
    audio_erro.volume = volume/1000;
    audio_gameover.volume = volume/1000;
    audio_teste.volume = volume/1000;
    audio_vitoria.volume = volume/1000;
    audio_fim_endless.volume = volume/1000;
    audio_musica_principal.volume = volume/1000;
}

function testaVolume(){
    if (audio_teste.duration > 0 && !audio_teste.paused) {
        audio_teste.pause();
        audio_teste.currentTime = 0;
    }
    else {
        audio_teste.play();
    }
}

function selecionaModo(modo_html){
    if (ativo === false) { modo = modo_html.value;
    console.log(modo);
}
}


function gameover(){
    console.log("Game Over");
    soma = [];
    subtracao = [];
    multiplicacao = [];
    pauses = 0;
    ativo = false;
    cancelAnimationFrame(atualizar);
    cancelAnimationFrame(criaNovoInimigo);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#000000";
    ctx.shadowOffs = 0;
    ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    ctx.font = "60px Roboto";
    audio_musica_principal.pause();
    audio_musica_principal.currentTime = 0;
    if (modo === "normal"){
        ctx.fillText("Você perdeu!", canvas.width/2, canvas.height/2);
        audio_gameover.play();
    }
    if (modo === "endless"){
        ctx.fillText("Sua pontuação foi: " + pontuacao, canvas.width/2, canvas.height/2);
        audio_fim_endless.play();
    }
    ctx.closePath();
    pontuacao = 0;
    escondeMostraJogo("esconde");
}

function venceu(){
    soma = [];
    subtracao = [];
    multiplicacao = [];
    pontuacao = 0;
    pauses = 0;
    ativo = false;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    audio_musica_principal.pause();
    audio_musica_principal.currentTime = 0;
    audio_vitoria.play();
    ctx.beginPath();
    ctx.shadowBlur = 3;
    ctx.shadowColor = "#000000";
    ctx.shadowOffs = 0;
    ctx.fillStyle = 'white';;
    ctx.font = "60px Roboto";
    ctx.textAlign = "center";
    ctx.fillText("Você venceu!!!", canvas.width/2, canvas.height/2);
    ctx.closePath();
    cancelAnimationFrame(atualizar);
    cancelAnimationFrame(criaNovoInimigo);
    escondeMostraJogo("esconde");
}

function pausa(){
    let pausa1 = document.getElementById("pause1");
    let pausa2 = document.getElementById("pause2");
    let pausa3 = document.getElementById("pause3");
    if (ativo === true && pauses > 0){
        ativo = false;
        cancelAnimationFrame(atualizar);
        cancelAnimationFrame(criaNovoInimigo);
        audio_musica_principal.pause();
        pauses -= 1;
        if (pauses === 2){
            pausa3.style.display = "none";
        }
        if (pauses === 1){
            pausa2.style.display = "none";
        }
        if (pauses === 0){
            pausa1.style.display = "none";
        }
    } else {
        ativo = true;
        requestAnimationFrame(atualizar);
        requestAnimationFrame(criaNovoInimigo);
        audio_musica_principal.play();
    }
}

function parar(){
    soma = [];
    subtracao = [];
    multiplicacao = [];
    pauses = 0;
    ativo = false;
    cancelAnimationFrame(atualizar);
    cancelAnimationFrame(criaNovoInimigo);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    audio_musica_principal.pause();
    audio_musica_principal.currentTime = 0;
    escondeMostraJogo("esconde");
}


function escondeMostraJogo(escondeMostra){
    let tentativa = document.getElementById("caixa_tentativa");
    let botaotentativa = document.getElementById("botaotentativa");
    let backgroundvideo = document.getElementById("background-video");
    let vida1 = document.getElementById("vida1");
    let vida2 = document.getElementById("vida2");
    let vida3 = document.getElementById("vida3");
    let botaopausa = document.getElementById("botaopausa");
    let botaoparar = document.getElementById("botaoparar");
    let pontuacaodiv = document.getElementById("pontuacaodiv");
    let dificuldade_html = document.getElementById("inputDificuldade");
    let mododejogo = document.getElementById("modoDeJogo");
    let botaoiniciar = document.getElementById("botaoiniciar");
    let pause1 = document.getElementById("pause1");
    let pause2 = document.getElementById("pause2");
    let pause3 = document.getElementById("pause3");

    if (escondeMostra === "mostra"){
        backgroundvideo.style.display = "block";
        tentativa.style.display = "block";
        botaotentativa.style.display = "block";
        canvas.style.display = "block";
        vida1.style.display = "block";
        vida2.style.display = "block";
        vida3.style.display = "block";
        botaoparar.style.display = "block";
        botaopausa.style.display = "block";
        pontuacaodiv.style.display = "block";
        dificuldade_html.style.display = "none";
        mododejogo.style.display = "none";
        botaoiniciar.style.display = "none";
        pause1.style.display = "block";
        pause2.style.display = "block";
        pause3.style.display = "block";
    }
    else if (escondeMostra === "esconde"){
        tentativa.style.display = "none";
        botaotentativa.style.display = "none";
        vida1.style.display = "none";
        vida2.style.display = "none";
        vida3.style.display = "none";
        pause1.style.display = "none";
        pause2.style.display = "none";
        pause3.style.display = "none";
        botaoparar.style.display = "none";
        botaopausa.style.display = "none";
        pontuacaodiv.style.display = "none";
        dificuldade_html.style.display = "block";
        mododejogo.style.display = "block";
        botaoiniciar.style.display = "block";
    }

}
