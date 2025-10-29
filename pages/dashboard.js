// pages/dashboard.js
import { parseCookies } from 'nookies';
import StudentForm from '../components/StudentForm';

export default function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Cadastro de Novos Alunos</h1>
        {/* Adicionar um botão de logout seria uma boa melhoria */}
      </header>
      <hr />
      <StudentForm />
    </div>
  );
}

// Protegendo a Rota
export async function getServerSideProps(ctx) {
  const cookies = parseCookies(ctx);
  const token = cookies.auth_token;

  // Se o token não existir, redireciona para a página de login
  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // Se o token existir, permite o acesso à página
  return {
    props: {}, // Pode passar props para a página se necessário
  };
}