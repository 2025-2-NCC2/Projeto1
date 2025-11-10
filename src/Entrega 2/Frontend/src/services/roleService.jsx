import api from './api';
import { jwtDecode } from 'jwt-decode';
/**
 * roleService
 * Serviço componentizado para encapsular chamadas relacionadas a três perfis:
 * - mentor
 * - colaborador
 * - admin
 *
 * Padrão: funções recebem `role` como string ('mentor' | 'colaborador' | 'admin')
 * e lidam com rotas/paths de forma centralizada. Assim os componentes podem
 * usar a mesma API com comportamento adaptado por `role`.
 *
 * Contrato mínimo (inputs/outputs):
 * - getDashboard(role): Promise<axios.Response>
 * - getProfile(role, id): Promise<axios.Response>
 * - updateProfile(role, id, data): Promise<axios.Response>
 * - listTasks(role, params): Promise<axios.Response>
 * - assignTask(role, taskId, payload): Promise<axios.Response>
 *
 * Observação: ajuste as rotas do objeto `paths` abaixo conforme sua API.
 */

