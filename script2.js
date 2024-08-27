document.addEventListener('DOMContentLoaded', function () {
    var formData = JSON.parse(localStorage.getItem("formData"));
    var situacoesAprendizagem = parseInt(formData.situAprendizagem);
    var situacaoAtual = parseInt(localStorage.getItem("situacaoAtual"));
    var todasSituacoes = JSON.parse(localStorage.getItem("todasSituacoes")) || [];
    var situacaoData = todasSituacoes[situacaoAtual - 1];
    var totalAulas = parseInt(situacaoData.quantidadeAulas);
    var accordionContainer = document.getElementById('accordionContainer');
    var respostas = {};

    function formatarTextoParaPDF(texto, maxCharsPerLine, maxTotalChars) {
        var linhas = [];
        var totalChars = 0;

        while (texto.length > 0 && totalChars < maxTotalChars) {
            var currentLine = texto.substring(0, maxCharsPerLine);
            linhas.push(currentLine);
            totalChars += currentLine.length;
            texto = texto.substring(maxCharsPerLine);
        }

        return linhas.join('\n');
    }

    function criarAccordion() {
        var accordionHTML = '';

        for (var i = 1; i <= totalAulas; i++) {
            accordionHTML += `
            <div class="accordion-item">
                <input type="checkbox" id="accordion-${i}">
                <label for="accordion-${i}">Aula ${i}</label>
                <div class="accordion-content">
                    <div class="row">
                        <div class="form-group full-width">
                            <label for="atividades-${i}">Atividades:</label>
                            <textarea id="atividades-${i}" name="atividades-${i}" placeholder="Digite aqui as atividades..." required></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group full-width">
                            <label for="odas-${i}">ODAs e/ou estratégias metodológicas:</label>
                            <textarea id="odas-${i}" name="odas-${i}" placeholder="Digite aqui as ODAs..." required></textarea>
                        </div>
                    </div>
                    <div class="row">
                        <div class="form-group full-width">
                            <label for="procedimentos-${i}">Procedimentos e instrumentos de avaliação:</label>
                            <textarea id="procedimentos-${i}" name="procedimentos-${i}" placeholder="Digite aqui os procedimentos de avaliação..." required></textarea>
                        </div>
                    </div>
                    <button type="button" class="save-button" data-aula="${i}">Salvar Aula</button>
                    <button type="button" class="edit-button" data-aula="${i}" style="display:none;">Editar Aula</button>
                </div>
            </div>`;
        }

        accordionContainer.innerHTML = accordionHTML;
    }

    function verificarPreenchimento() {
        var todasPreenchidas = Object.keys(respostas).length === totalAulas;
        document.getElementById('nextPageBtn').disabled = !todasPreenchidas;
    }

    function salvarDadosAula(aula) {
        var atividades = document.getElementById(`atividades-${aula}`).value.trim();
        var odas = document.getElementById(`odas-${aula}`).value.trim();
        var procedimentos = document.getElementById(`procedimentos-${aula}`).value.trim();

        if (atividades && odas && procedimentos) {
            respostas[aula] = { 
                atividades: formatarTextoParaPDF(atividades, 89, 1957), 
                odas: formatarTextoParaPDF(odas, 19, 381),
                procedimentos: formatarTextoParaPDF(procedimentos, 113, 678) 
            };

            document.querySelector(`.save-button[data-aula="${aula}"]`).style.display = 'none';
            document.querySelector(`.edit-button[data-aula="${aula}"]`).style.display = 'inline-block';

            verificarPreenchimento();
        } else {
            alert("Por favor, preencha todos os campos antes de salvar.");
        }
    }

    criarAccordion();

    accordionContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('save-button')) {
            var aula = event.target.getAttribute('data-aula');
            salvarDadosAula(aula);
        } else if (event.target.classList.contains('edit-button')) {
            var aula = event.target.getAttribute('data-aula');
            document.querySelector(`#accordion-${aula}`).checked = false;
            event.target.style.display = 'none';
            document.querySelector(`.save-button[data-aula="${aula}"]`).style.display = 'inline-block';
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', function () {
        var todasPreenchidas = Object.keys(respostas).length === totalAulas;
        if (todasPreenchidas) {
            var respostasSituacoes = JSON.parse(localStorage.getItem('respostasSituacoes')) || {};
            respostasSituacoes[situacaoAtual] = respostas;
            localStorage.setItem('respostasSituacoes', JSON.stringify(respostasSituacoes));

            if (situacaoAtual < situacoesAprendizagem) {
                situacaoAtual++;
                localStorage.setItem("situacaoAtual", situacaoAtual);
                window.location.href = "situacao.html";
            } else {
                window.location.href = "gerar.html";
            }
        } else {
            alert("Por favor, preencha todos os campos das aulas antes de avançar.");
        }
    });

    verificarPreenchimento();
});