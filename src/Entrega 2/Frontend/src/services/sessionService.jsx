import { jwtDecode } from "jwt-decode";
import api from "./api";

export const getMentorSession = () => {
  /* console.log(localStorage); */
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      name: localStorage.getItem('name'),
      groupId: localStorage.getItem('idGroup'),
      groupName: localStorage.getItem('groupName'),
      foodGoal: localStorage.getItem('foodGoal'),
      monetaryTarget: localStorage.getItem('monetaryTarget'),
    };
    
  } catch (error) {
    console.error('Token inválido ou expirado:', error);
    localStorage.removeItem('token');
    return null;
  }
};

const paths = {
  mentor: {
    dashboard: '/users/profile',
    profile: '/users/me',
    tasks: '/user/groups',
    donations: '/donations',
  },
  colaborador: {
    dashboard: '/users/profile',
    profile: '/users/me',
    tasks: '/user/groups',
    donations: '/donations',
  },
  admin: {
    dashboard: '/users/list',
    profile: '/users/me',
    tasks: '/groups/list',
    donations: '/donations',
  },
};
  try {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
  } catch (error) {
    console.error('Token inválido ou expirado:', error);
    localStorage.removeItem('token');
  }

function ensureRole(role) {
  const key = role?.toLowerCase?.();
  if (!paths[key]) throw new Error(`roleService: role não suportado: ${role}`);
  return key;
}

export async function getDashboard(role, params = {}) {
  const key = ensureRole(role);
  return api.get(paths[key].dashboard, { params });
}

export async function getProfile(role, id) {
  const key = ensureRole(role);
  if (!id) throw new Error('getProfile: id é obrigatório');
  return api.get(`${paths[key].profile}/${id}`);
}

export async function updateProfile(role, id, data) {
  const key = ensureRole(role);
  if (!id) throw new Error('updateProfile: id é obrigatório');
  return api.put(`${paths[key].profile}/${id}`, data);
}

export async function listTasks(role, params = {}) {
  const key = ensureRole(role);
  return api.get(paths[key].tasks, { params });
}

export async function assignTask(role, taskId, payload = {}) {
  const key = ensureRole(role);
  if (!taskId) throw new Error('assignTask: taskId é obrigatório');
  return api.post(`${paths[key].tasks}/${taskId}/assign`, payload);
}

export default {
  getDashboard,
  getProfile,
  updateProfile,
  listTasks,
  assignTask,
};
