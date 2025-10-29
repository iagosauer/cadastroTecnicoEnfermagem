// pages/api/login.js
import { setCookie } from 'nookies';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, password } = req.body;

  // Autenticação estática
  const USER_ESPERADO = 'consultor';
  const SENHA_ESPERADA = 'consultor10';

  if (username === USER_ESPERADO && password === SENHA_ESPERADA) {
    // Login com sucesso!
    // Define um cookie de autenticação. Usamos 'httpOnly' por segurança.
    setCookie({ res }, 'auth_token', 'usuario_logado_com_sucesso', {
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    res.status(200).json({ message: 'Login bem-sucedido' });
  } else {
    // Falha no login
    res.status(401).json({ message: 'Usuário ou senha inválidos' });
  }
}