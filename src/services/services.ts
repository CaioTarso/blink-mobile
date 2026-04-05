// Definição da interface 

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

// Dados de exemplo (Mock) para apresentação do trabalho. Lembrar de substituir depois, mona.
const mockServices: Service[] = [
  { 
    id: "1", 
    name: "Banho", 
    description: "Banho completo com shampoo especial, secagem e perfume, ideal para manter seu pet limpo.", 
    price: 60.00, 
    image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500" 
  },
  { 
    id: "2", 
    name: "Tosa", 
    description: "Tosa higiênica padrão da raça, garantindo conforto e estética para o animal.", 
    price: 150.00, 
    image: "https://cdn.awsli.com.br/2485/2485118/arquivos/o-spitz-da-pomerania-esta-tomando-banho-com-xampu-no-banho-do-cachorro-1024x683.png" 
  },

    { 
    id: "3", 
    name: "Ducha Higiênica", 
    description: "Ducha higiênica padrão da raça, garantindo conforto e estética para o animal.", 
    price: 100.00, 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwQMgvmUQCaklFBPLqXC4eBr-Xa7c_SPKCSiAK0aRew&s" 
  },

  { 
    id: "4", 
    name: "Banho de gato", 
    description: "Banho completo com shampoo especial, secagem e perfume, ideal para manter seu pet limpo.", 
    price: 200.00, 
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUoKYbEOtB3aa_tdUT3rYh4S-OAiYR7p-kIw&s" 
  },
];


export const getServices = async (): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockServices), 500); // Simular um carregamento de rede
  });
};