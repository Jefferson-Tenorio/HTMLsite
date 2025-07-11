// Objeto com método
const usuario = {
    nome: "Maria",
    idade: 30,
    saudacao: function () {
        return `Olá, meu nome é ${this.nome} e tenho ${this.idade} anos.`;
    }
};

// Função que será chamada ao clicar no botão
function mostrarSaudacao() {
    const elemento = document.getElementById("mensagem");
    elemento.textContent = usuario.saudacao();
}
