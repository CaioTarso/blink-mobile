// src/services/users.ts

// Dados Base (Todos os usuários do sistema)
export const initialUsers = [
  {
    id: "1",
    name: "João Silva",
    role: "Admin",
    specialty: "Veterinário", // Adicionando a função real
    email: "joao@email.com",
    active: true,
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "Staff",
    specialty: "Tosa Especializada", // Adicionando a função real
    email: "maria@email.com",
    active: true,
  },
  {
    id: "3",
    name: "Carlos Lima",
    role: "Client", // Cliente não deve aparecer no agendamento como prestador
    email: "carlos@email.com",
    active: true,
  },
];

// Função para sua tela de agendamento carregar apenas a EQUIPE
export const getProfessionals = async () => {
  // Filtra apenas quem é Admin ou Staff e está ativo
  return initialUsers.filter(
    (user) => user.active && (user.role === "Admin" || user.role === "Staff")
  );
};