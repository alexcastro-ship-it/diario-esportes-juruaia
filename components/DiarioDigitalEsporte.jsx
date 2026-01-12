'use client'

import { useState, useEffect } from "react";

export default function DiarioDigitalEsporte() {

  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [turmas, setTurmas] = useState([]);
  const [novaTurma, setNovaTurma] = useState("");

  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [novoAluno, setNovoAluno] = useState("");

  const USUARIO = "admin";
  const SENHA = "1234";

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem("turmas") || "[]");
    const a = JSON.parse(localStorage.getItem("alunos") || "[]");
    setTurmas(t);
    setAlunos(a);
  }, []);

  useEffect(() => {
    localStorage.setItem("turmas", JSON.stringify(turmas));
  }, [turmas]);

  useEffect(() => {
    localStorage.setItem("alunos", JSON.stringify(alunos));
  }, [alunos]);

  function entrar() {
    if (usuario === USUARIO && senha === SENHA) {
      setLogado(true);
      setErro("");
    } else {
      setErro("Usuário ou senha inválidos");
    }
  }

  function adicionarTurma() {
    if (!novaTurma) return;
    const nova = { id: Date.now(), nome: novaTurma };
    setTurmas([...turmas, nova]);
    setNovaTurma("");
  }

  function adicionarAluno() {
    if (!novoAluno) return;
    const novo = { id: Date.now(), nome: novoAluno, turmaId: turmaSelecionada.id };
    setAlunos([...alunos, novo]);
    setNovoAluno("");
  }

  // ===== TELA LOGIN =====
  if (!logado) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#E3F2FD"}}>
        <div style={{background:"#fff",padding:20,borderRadius:10,textAlign:"center",width:300}}>
          <img src="/logo-prefeitura.png" width="120" />
          <h2 style={{color:"#1E88E5"}}>Departamento Municipal de Esportes de Juruaia</h2>

          <input placeholder="Usuário" value={usuario} onChange={e=>setUsuario(e.target.value)} style={{width:"100%",marginTop:10,padding:5}} />
          <input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} style={{width:"100%",marginTop:10,padding:5}} />

          {erro && <p style={{color:"red"}}>{erro}</p>}

          <button onClick={entrar} style={{marginTop:10,background:"#1E88E5",color:"#fff",padding:8,width:"100%"}}>Entrar</button>
        </div>
      </div>
    );
  }

  // ===== TELA TURMAS =====
  if (!turmaSelecionada) {
    return (
      <div style={{padding:20}}>
        <img src="/logo-prefeitura.png" width="100" />
        <h2 style={{color:"#1E88E5"}}>Departamento Municipal de Esportes de Juruaia</h2>

        <h3>Cadastrar Nova Turma</h3>
        <input value={novaTurma} onChange={e=>setNovaTurma(e.target.value)} placeholder="Nome da turma"/>
        <button onClick={adicionarTurma}>Adicionar</button>

        <h3>Turmas</h3>
        {turmas.map(t => (
          <div key={t.id} style={{border:"1px solid #1E88E5",padding:10,margin:5,cursor:"pointer"}}
               onClick={()=>setTurmaSelecionada(t)}>
            {t.nome}
          </div>
        ))}
      </div>
    );
  }

  // ===== TELA ALUNOS =====
  const alunosDaTurma = alunos.filter(a => a.turmaId === turmaSelecionada.id);

  return (
    <div style={{padding:20}}>
      <h2 style={{color:"#1E88E5"}}>Turma: {turmaSelecionada.nome}</h2>
      <button onClick={()=>setTurmaSelecionada(null)}>Voltar</button>

      <h3>Cadastrar Aluno</h3>
      <input value={novoAluno} onChange={e=>setNovoAluno(e.target.value)} placeholder="Nome do aluno"/>
      <button onClick={adicionarAluno}>Adicionar</button>

      <h3>Alunos</h3>
      {alunosDaTurma.map(a => (
        <div key={a.id} style={{border:"1px solid #ccc",padding:5,margin:5}}>
          {a.nome}
        </div>
      ))}
    </div>
  );
}
