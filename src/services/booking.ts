// src/services/users.ts

export const initialUsers = [
  {
    id: "1",
    name: "João Silva",
    role: "Admin",
    specialty: "Veterinário Geral",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    active: true,
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "Staff",
    specialty: "Tosa de Luxo",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    active: true,
  },
  {
    id: "3",
    name: "Carlos Lima",
    role: "Client", // Não aparecerá no agendamento
    specialty: "Cliente",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    active: true,
  },
];

// Função para buscar apenas profissionais ativos (Admin e Staff)
export const getProfessionals = async () => {
  return initialUsers.filter(
    (user) => user.active && (user.role === "Admin" || user.role === "Staff")
  );
};

// Mantendo o getUsers caso seus colegas usem esse nome de função
export const getUsers = async () => initialUsers;

// Lista de horários centralizada para facilitar mudanças futuras
export const AVAILABLE_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];