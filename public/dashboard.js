const boasVindas = document.getElementById('boasVindas');
const emailUsuario = document.getElementById('emailUsuario');
const btnSair = document.getElementById('btnSair');
const btnTestarRota = document.getElementById('btnTestarRota');
const respostaApi = document.getElementById('respostaApi');

async function carregarAreaProtegida() {
    const resposta = await fetch('/api/protegida');
    const dados = await resposta.json();

    if(!resposta.ok){
        window.location.href = 'index.html';
        return;
    }

    boasVindas.textContent = `Bem-vindo, ${dados.usuario.nome}`;
    emailUsuario.textContent = dados.usuario.email;
}

btnTestarRota.addEventListener('click', async() => {
    const resposta = await fetch('/api/protegida');
    const dados = await resposta.json();

    respostaApi.textContent = JSON.stringify(dados, null, 2)
})

btnSair.addEventListener('click', async ()=>{
    await fetch('/api/logout', {method: 'POST'});
    window.location.href = 'index.html';
});

carregarAreaProtegida();