import api from './api';

// Exemplo: adicionar participante
export const addParticipant = async (participantData) => {
  const response = await api.post('/user/add', participantData);
  return response.data;
};

export const deactivateParticipant = async (participantId, stts) => {
  //const token = localStorage.getItem('token'); // ou sessionStorage, dependendo de onde você salva
  const response = await api.put(
    `/users/deact/${participantId}`,
    {id: participantId, status: stts}, // corpo vazio, se não precisar enviar mais nada
  );
  console.log(response);
  return response.data;
};

export const totalUserDonation = async (userId) => {
  const response = await api.get(`/user/donations/${userId}`);
  /* console.log(userId); */
  return response.data;
};

export const fetchUsersList = async () => {
  const response = await api.get(`/users/list`);
  /* console.log(userId); */
  return response.data;
}

export const fetchMentor = async () => {
  const response = await api.get(`/groups/mentor`);
  /* console.log(userId); */
  return response.data;
}


