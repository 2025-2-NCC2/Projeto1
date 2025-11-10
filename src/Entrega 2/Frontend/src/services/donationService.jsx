import api from './api';

// Registrar doação
export const registerDonation = async (donationData) => {
  console.log(donationData);
  const response = await api.post('/donations', donationData, {
    headers:{
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const getLastDonation = async (userId) => {
  const response = await api.get(`/donations/${userId}`);
  // Ordena pela data e pega a mais recente
  return response.data;
};


export const analyzeExtract = async (file) => {
  if (!file) throw new Error("Nenhum arquivo enviado para análise.");

  const formDataPdf = new FormData();
  formDataPdf.append("file", file);

  try {
    const response = await api.post( "/analisar-extrato", // 🔧 ajuste se estiver rodando local
      formDataPdf,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Erro ao analisar o comprovante:", err);
    return { erro: true };
  }
};

export const fetchDonations = async () => {
  const response = await api.get(`/donations/list`);
  return response.data;
};