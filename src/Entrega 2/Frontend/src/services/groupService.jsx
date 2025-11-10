
import api from './api';

// Buscar lista de grupos
export const fetchGroups = async () => {
  const response = await api.get('/groups/list');
  /* console.log(response.data); */
  return response.data;
};

export const fetchGroup = async (idGroup) => {
  const response = await api.get(`/group/${idGroup}`);
  /* console.log(response.data); */
  return response.data;
};

// Buscar membros de um grupo específico
export const fetchMembers = async (groupId) => {
  const response = await api.get(`/user/groups/${groupId}`);
  console.log(groupId);
  return response.data;
};

export const fetchTotalGroups = async () => {
  const response = await api.get(`/groups/total`);
  return response.data;
}

export const updateGoal = async (id, newFoodGoal, newMoneyGoal) => {
  //const token = localStorage.getItem('token'); // ou sessionStorage, dependendo de onde você salva
  const response = await api.put(
    `/group/goals/${id}`,
    {newFoodGoal: newFoodGoal?? null, newMoneyGoal: newMoneyGoal??null}, // corpo vazio, se não precisar enviar mais nada
  );
  console.log(response);
  return response.data;
};