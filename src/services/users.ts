export const initialUsers = [
  {
    id: "1",
    name: "João Silva",
    role: "Admin",
    specialty: "Veterinário",
    email: "joao@email.com",
    phone: "(85) 99999-0001",
    tags: ["Banho", "Tosa"],
    active: true,
  },
  {
    id: "2",
    name: "Maria Souza",
    role: "Staff",
    specialty: "Tosa Especializada",
    email: "maria@email.com",
    phone: "(85) 99999-0002",
    tags: ["Banho e Tosa"],
    active: true,
  },
  {
    id: "3",
    name: "Carlos Lima",
    role: "Client",
    email: "carlos@email.com",
    phone: "(85) 99999-0003",
    tags: ["Consulta Veterinária"],
    active: false,
  },
];

// Retorna apenas Admin e Staff ativos — para tela de agendamento
export const getProfessionals = async () => {
  return initialUsers.filter(
    (user) => user.active && (user.role === "Admin" || user.role === "Staff")
  );
};