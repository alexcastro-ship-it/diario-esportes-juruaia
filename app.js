const app = document.getElementById("app");

let turmas = JSON.parse(localStorage.getItem("turmas")) || [];
let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
let registros = JSON.parse(localStorage.getItem("registros")) || [];

let turmaSelecionada = null;
let logado = false;

function salvarDados() {
  localStorage.setItem("turmas", JSON.stringify(turmas));
  localStorage.setItem("alunos", JSON.stringify(alunos));
  localStorage.setItem("registros", JSON.stringify(registros));
}

function telaLogin() {
  app.innerHTML = `
    <div class="card">
      <h2>Login</h2>
      <input id="user" placeholder="Usuário"><br><br>
      <input id="pass" type="password" placeholder="Senha"><br><br>
      <button onclick="entrar()">Entrar</button>
      <p id="erro" style="color:red"></p>
    </div>
  `;
}

function entrar() {
  const u = document.getElementById("user").value;
  const p = document.getElementById("pass").value;
  if (u === "admin" && p === "1234") {
    logado = true;
    telaTurmas();
  } else {
    document.getElementById("erro").innerText = "Usuário ou senha incorretos";
  }
}

function telaTurmas() {
  let html = `
    <div class="card">
      <h2>Turmas</h2>
      <input id="novaTurma" placeholder="Nova turma">
      <button onclick="adicionarTurma()">Adicionar</button>
      <ul>
  `;

  turmas.forEach(t => {
    html += `<li><button onclick="abrirTurma(${t.id})">${t.nome}</button></li>`;
  });

  html += "</ul></div>";
  app.innerHTML = html;
}

function adicionarTurma() {
  const nome = document.getElementById("novaTurma").value;
  if (!nome) return;
  turmas.push({ id: Date.now(), nome });
  salvarDados();
  telaTurmas();
}

function abrirTurma(id) {
  turmaSelecionada = turmas.find(t => t.id === id);
  telaAlunos();
}

function telaAlunos() {
  let html = `
    <div class="card">
      <h2>Turma: ${turmaSelecionada.nome}</h2>
      <button onclick="telaTurmas()">Voltar</button>
      
      <h3>Cadastrar Aluno</h3>
      <input id="novoAluno" placeholder="Nome do aluno">
      <button onclick="adicionarAluno()">Adicionar</button>

      <h3>Presença</h3>
  `;

  const alunosTurma = alunos.filter(a => a.turmaId === turmaSelecionada.id);

  alunosTurma.forEach(a => {
    html += `
      <div>
        ${a.nome}
        <button onclick="registrar(${a.id},true)">✔</button>
        <button onclick="registrar(${a.id},false)">✖</button>
      </div>
    `;
  });

  html += `
      <h3>Atividade da Aula</h3>
      <input id="atividadeTexto" placeholder="Descrição da atividade">
      <button onclick="salvarAtividade()">Salvar</button>

      <h3>Registros</h3>
      <ul>
  `;

  registros
    .filter(r => r.turmaId === turmaSelecionada.id)
    .forEach(r => {
      html += `<li>${r.data} - ${r.descricao || (r.presente ? "Presente" : "Falta")}</li>`;
    });

  html += "</ul></div>";

  app.innerHTML = html;
}

function adicionarAluno() {
  const nome = document.getElementById("novoAluno").value;
  if (!nome) return;
  alunos.push({ id: Date.now(), nome, turmaId: turmaSelecionada.id });
  salvarDados();
  telaAlunos();
}

function registrar(alunoId, presente) {
  registros.push({
    id: Date.now(),
    alunoId,
    turmaId: turmaSelecionada.id,
    data: new Date().toLocaleDateString(),
    presente
  });
  salvarDados();
  telaAlunos();
}

function salvarAtividade() {
  const texto = document.getElementById("atividadeTexto").value;
  if (!texto) return;
  registros.push({
    id: Date.now(),
    turmaId: turmaSelecionada.id,
    data: new Date().toLocaleDateString(),
    descricao: texto
  });
  salvarDados();
  telaAlunos();
}

/* Inicial */
telaLogin();
