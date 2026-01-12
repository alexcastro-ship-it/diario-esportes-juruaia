// ===== DIÁRIO DIGITAL DO ESPORTE - JURUAIA =====
// Versão Completa com Identidade Visual Oficial
// Departamento Municipal de Esportes de Juruaia

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// ===== CORES OFICIAIS =====
// Azul Prefeitura: #1E88E5
// Amarelo Prefeitura: #FBC02D

// ====== BANCO DE DADOS LOCAL ======
const salvarDB = (chave, dados) => {
  localStorage.setItem(chave, JSON.stringify(dados));
};

const carregarDB = (chave, padrao) => {
  const data = localStorage.getItem(chave);
  return data ? JSON.parse(data) : padrao;
};

// ====== LOGIN FIXO (ADMIN) ======
const USUARIO = "admin";
const SENHA = "1234";

export default function DiarioDigitalEsporte() {
  const [logado, setLogado] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

  const [usuarioInput, setUsuarioInput] = useState("");
  const [senhaInput, setSenhaInput] = useState("");

  const [turmas, setTurmas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [atividades, setAtividades] = useState([]);

  const [novaTurma, setNovaTurma] = useState("");
  const [novoAluno, setNovoAluno] = useState("");

  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [textoAtividade, setTextoAtividade] = useState("");

  useEffect(() => {
    setTurmas(carregarDB("turmas", []));
    setAlunos(carregarDB("alunos", []));
    setAtividades(carregarDB("atividades", []));
  }, []);

  useEffect(() => salvarDB("turmas", turmas), [turmas]);
  useEffect(() => salvarDB("alunos", alunos), [alunos]);
  useEffect(() => salvarDB("atividades", atividades), [atividades]);

  const entrar = () => {
    if (usuarioInput === USUARIO && senhaInput === SENHA) {
      setLogado(true);
      setErroLogin("");
    } else {
      setErroLogin("Usuário ou senha inválidos");
    }
  };

  const adicionarTurma = () => {
    if (!novaTurma) return;
    const nova = { id: Date.now(), nome: novaTurma };
    setTurmas([...turmas, nova]);
    setNovaTurma("");
  };

  const adicionarAluno = () => {
    if (!novoAluno || !turmaSelecionada) return;
    const novo = { id: Date.now(), nome: novoAluno, turmaId: turmaSelecionada.id };
    setAlunos([...alunos, novo]);
    setNovoAluno("");
  };

  const registrarPresenca = (alunoId, presente) => {
    const dataHoje = new Date().toLocaleDateString();
    const registro = { id: Date.now(), alunoId, turmaId: turmaSelecionada.id, data: dataHoje, presente };
    setAtividades([...atividades, registro]);
  };

  const registrarAtividadeTexto = () => {
    if (!textoAtividade) return;
    const dataHoje = new Date().toLocaleDateString();
    const registro = { id: Date.now(), turmaId: turmaSelecionada.id, data: dataHoje, descricao: textoAtividade };
    setAtividades([...atividades, registro]);
    setTextoAtividade("");
  };

  if (!logado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#E3F2FD]">
        <Card className="w-96 border-[#1E88E5]">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <img src="/logo-prefeitura.png" alt="Prefeitura de Juruaia" className="h-20" />
              <h1 className="text-lg font-bold text-center text-[#1E88E5]">Departamento Municipal de Esportes de Juruaia</h1>
            </div>
            <Input placeholder="Usuário" value={usuarioInput} onChange={(e) => setUsuarioInput(e.target.value)} />
            <Input placeholder="Senha" type="password" value={senhaInput} onChange={(e) => setSenhaInput(e.target.value)} />
            {erroLogin && <p className="text-red-500 text-sm">{erroLogin}</p>}
            <Button className="w-full bg-[#1E88E5] hover:bg-[#1565C0] text-white" onClick={entrar}>Entrar</Button>
            <p className="text-xs text-center">Login padrão: admin | senha: 1234</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!turmaSelecionada) {
    return (
      <div className="p-6 space-y-6 bg-[#E3F2FD] min-h-screen">
        <div className="flex items-center space-x-4">
          <img src="/logo-prefeitura.png" alt="Prefeitura" className="h-16" />
          <h1 className="text-2xl font-bold text-[#1E88E5]">Departamento Municipal de Esportes de Juruaia</h1>
        </div>

        <Card>
          <CardContent className="p-4 space-y-2">
            <h2 className="font-semibold text-[#1E88E5]">Cadastrar Nova Turma</h2>
            <div className="flex gap-2">
              <Input placeholder="Nome da turma" value={novaTurma} onChange={(e) => setNovaTurma(e.target.value)} />
              <Button className="bg-[#FBC02D] text-black hover:bg-[#F9A825]" onClick={adicionarTurma}>Adicionar</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {turmas.map((t) => (
            <Card key={t.id} className="cursor-pointer hover:shadow-lg border-[#1E88E5]" onClick={() => setTurmaSelecionada(t)}>
              <CardContent className="p-4 text-center font-semibold text-[#1E88E5]">{t.nome}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const alunosDaTurma = alunos.filter((a) => a.turmaId === turmaSelecionada.id);

  return (
    <div className="p-6 space-y-6 bg-[#E3F2FD] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1E88E5]">Turma: {turmaSelecionada.nome}</h1>
        <Button variant="outline" onClick={() => setTurmaSelecionada(null)}>Voltar</Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold text-[#1E88E5]">Cadastrar Aluno</h2>
          <div className="flex gap-2">
            <Input placeholder="Nome do aluno" value={novoAluno} onChange={(e) => setNovoAluno(e.target.value)} />
            <Button className="bg-[#FBC02D] text-black hover:bg-[#F9A825]" onClick={adicionarAluno}>Adicionar</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-[#1E88E5]">Registro de Presença</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Presente</TableHead>
                <TableHead>Faltou</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alunosDaTurma.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.nome}</TableCell>
                  <TableCell>
                    <Button size="sm" className="bg-[#1E88E5]" onClick={() => registrarPresenca(a.id, true)}>✔</Button>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="destructive" onClick={() => registrarPresenca(a.id, false)}>✖</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold text-[#1E88E5]">Registro de Atividades da Aula</h2>
          <Input placeholder="Descreva a atividade realizada" value={textoAtividade} onChange={(e) => setTextoAtividade(e.target.value)} />
          <Button className="bg-[#1E88E5] text-white" onClick={registrarAtividadeTexto}>Salvar Atividade</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold text-[#1E88E5]">Histórico de Registros</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {atividades.filter((r) => r.turmaId === turmaSelecionada.id).map((r) => (
              <li key={r.id}>{r.data} — {r.descricao ? r.descricao : r.presente ? "Presente" : "Falta"}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
