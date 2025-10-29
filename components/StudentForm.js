// components/StudentForm.js
import { useState, useEffect } from 'react';

// Estado inicial do formulário
const initialState = {
  nome_aluno: '',
  rg: '',
  orgao_expedicao: '',
  cpf: '',
  titulo_eleitor: '',
  secao: '',
  zona: '',
  local_votacao: '',
  sexo: '',
  estado_civil: '',
  data_nascimento: '',
  idade: '',
  endereco: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  nome_mae: '',
  nome_pai: '',
  telefone: '',
  telefone_comercial: '',
  email: '',
  periodo: '',
  turma: '',
  valor_mensalidade: 0,
  valor_total: 0,
};

export default function StudentForm() {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState('');

  // Efeito para calcular a IDADE
  useEffect(() => {
    if (formData.data_nascimento) {
      try {
        const birthDate = new Date(formData.data_nascimento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setFormData((prev) => ({ ...prev, idade: age.toString() }));
      } catch (error) {
        setFormData((prev) => ({ ...prev, idade: '' }));
      }
    }
  }, [formData.data_nascimento]);

  // Efeito para calcular VALORES
  useEffect(() => {
    if (formData.periodo === 'Matutino') {
      setFormData((prev) => ({
        ...prev,
        valor_mensalidade: 189.99,
        valor_total: 4559.76,
      }));
    } else if (formData.periodo === 'Noturno') {
      setFormData((prev) => ({
        ...prev,
        valor_mensalidade: 249.99,
        valor_total: 5999.76,
      }));
    } else {
        setFormData((prev) => ({
        ...prev,
        valor_mensalidade: 0,
        valor_total: 0,
      }));
    }
  }, [formData.periodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/register-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Aluno cadastrado com sucesso!');
      setFormData(initialState); // Limpa o formulário
    } else {
      const data = await res.json();
      setMessage(`Erro ao cadastrar: ${data.message}`);
    }
  };

  // Estilos simples para legibilidade
  const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '800px', margin: 'auto' };
  const groupStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' };
  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' };
  const labelStyle = { fontWeight: 'bold', fontSize: '0.9em' };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}

      <h3>Dados Pessoais</h3>
      <div style={groupStyle}>
        <div><label style={labelStyle}>Nome Completo:</label><input style={inputStyle} type="text" name="nome_aluno" value={formData.nome_aluno} onChange={handleChange} required /></div>
        <div><label style={labelStyle}>Email:</label><input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
        <div><label style={labelStyle}>Data de Nascimento:</label><input style={inputStyle} type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} required /></div>
        <div><label style={labelStyle}>Idade (Automático):</label><input style={inputStyle} type="text" name="idade" value={formData.idade} readOnly disabled /></div>
        <div><label style={labelStyle}>Sexo:</label><select style={inputStyle} name="sexo" value={formData.sexo} onChange={handleChange}><option value="">Selecione</option><option value="Masculino">Masculino</option><option value="Feminino">Feminino</option><option value="Outro">Outro</option></select></div>
        <div><label style={labelStyle}>Estado Civil:</label><input style={inputStyle} type="text" name="estado_civil" value={formData.estado_civil} onChange={handleChange} /></div>
      </div>

      <h3>Documentos</h3>
      <div style={groupStyle}>
        <div><label style={labelStyle}>CPF:</label><input style={inputStyle} type="text" name="cpf" value={formData.cpf} onChange={handleChange} required /></div>
        <div><label style={labelStyle}>RG:</label><input style={inputStyle} type="text" name="rg" value={formData.rg} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Órgão Expedidor:</label><input style={inputStyle} type="text" name="orgao_expedicao" value={formData.orgao_expedicao} onChange={handleChange} /></div>
      </div>

      <h3>Dados Eleitorais</h3>
      <div style={groupStyle}>
        <div><label style={labelStyle}>Título de Eleitor:</label><input style={inputStyle} type="text" name="titulo_eleitor" value={formData.titulo_eleitor} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Seção:</label><input style={inputStyle} type="text" name="secao" value={formData.secao} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Zona:</label><input style={inputStyle} type="text" name="zona" value={formData.zona} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Local de Votação:</label><input style={inputStyle} type="text" name="local_votacao" value={formData.local_votacao} onChange={handleChange} /></div>
      </div>

      <h3>Endereço e Contato</h3>
      <div style={groupStyle}>
        <div><label style={labelStyle}>Endereço:</label><input style={inputStyle} type="text" name="endereco" value={formData.endereco} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Bairro:</label><input style={inputStyle} type="text" name="bairro" value={formData.bairro} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Cidade:</label><input style={inputStyle} type="text" name="cidade" value={formData.cidade} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Estado (UF):</label><input style={inputStyle} type="text" name="estado" value={formData.estado} onChange={handleChange} maxLength="2" /></div>
        <div><label style={labelStyle}>CEP:</label><input style={inputStyle} type="text" name="cep" value={formData.cep} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Telefone:</label><input style={inputStyle} type="text" name="telefone" value={formData.telefone} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Telefone Comercial:</label><input style={inputStyle} type="text" name="telefone_comercial" value={formData.telefone_comercial} onChange={handleChange} /></div>
      </div>

      <h3>Filiação</h3>
      <div style={groupStyle}>
        <div><label style={labelStyle}>Nome da Mãe:</label><input style={inputStyle} type="text" name="nome_mae" value={formData.nome_mae} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Nome do Pai:</label><input style={inputStyle} type="text" name="nome_pai" value={formData.nome_pai} onChange={handleChange} /></div>
      </div>
      
      <h3>Dados do Curso</h3>
      <div style={groupStyle}>
         <div>
            <label style={labelStyle}>Período:</label>
            <select style={inputStyle} name="periodo" value={formData.periodo} onChange={handleChange} required>
                <option value="">Selecione o Período</option>
                <option value="Matutino">Matutino</option>
                <option value="Noturno">Noturno</option>
            </select>
         </div>
        <div><label style={labelStyle}>Turma:</label><input style={inputStyle} type="text" name="turma" value={formData.turma} onChange={handleChange} /></div>
        <div><label style={labelStyle}>Valor da Mensalidade:</label><input style={inputStyle} type="text" name="valor_mensalidade" value={`R$ ${formData.valor_mensalidade.toFixed(2)}`} readOnly disabled /></div>
        <div><label style={labelStyle}>Valor Total (Curso):</label><input style={inputStyle} type="text" name="valor_total" value={`R$ ${formData.valor_total.toFixed(2)}`} readOnly disabled /></div>
      </div>

      <button type="submit" style={{ padding: '15px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em' }}>
        Cadastrar Aluno
      </button>
    </form>
  );
}