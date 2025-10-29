// pages/api/register-student.js
import pool from '../../lib/db';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  // 1. Protegendo a API
  const cookies = parseCookies({ req });
  if (!cookies.auth_token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  // 2. Validando o Método
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // 3. Obtendo os dados
  const {
    nome_aluno, rg, orgao_expedicao, cpf, titulo_eleitor, secao, zona,
    local_votacao, sexo, estado_civil, data_nascimento, idade, endereco,
    bairro, cidade, estado, cep, nome_mae, nome_pai, telefone,
    telefone_comercial, email, periodo, turma, valor_mensalidade, valor_total
  } = req.body;

  // 4. Validação básica (pode ser mais robusta)
  if (!nome_aluno || !cpf || !email || !periodo || !data_nascimento) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
  }
  
  // 5. Inserindo no Banco de Dados
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO alunos (
        nome_aluno, rg, orgao_expedicao, cpf, titulo_eleitor, secao, zona,
        local_votacao, sexo, estado_civil, data_nascimento, idade, endereco,
        bairro, cidade, estado, cep, nome_mae, nome_pai, telefone,
        telefone_comercial, email, periodo, turma, valor_mensalidade, valor_total
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
      ) RETURNING id;
    `;
    
    const values = [
      nome_aluno, rg, orgao_expedicao, cpf, titulo_eleitor, secao, zona,
      local_votacao, sexo, estado_civil, data_nascimento, idade, endereco,
      bairro, cidade, estado, cep, nome_mae, nome_pai, telefone,
      telefone_comercial, email, periodo, turma, valor_mensalidade, valor_total
    ];

    const result = await client.query(query, values);
    res.status(201).json({ message: 'Aluno cadastrado com sucesso!', id: result.rows[0].id });

  } catch (error) {
    console.error('Erro ao inserir no banco:', error);
    // Verifica erros de constraint (ex: CPF/Email duplicado)
    if (error.code === '23505') { // unique_violation
        return res.status(409).json({ message: `Cadastro duplicado. O ${error.constraint.includes('cpf') ? 'CPF' : 'Email'} já existe.` });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
}