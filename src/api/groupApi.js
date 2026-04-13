import api from './index';

export default {
  getGroup: (id) => api.get(`/groups/${id}`),
  getGroupMembers: (ids) => api.get(`/users?id=${ids.join('&id=')}`),
  getGroupMembersByGroup: (groupId) => api.get(`/users?groupId=${groupId}`),
  getGroups: () => api.get('/groups'),
  createGroup: (data) => api.post('/groups', data),
  updateGroup: (id, data) => api.put(`/groups/${id}`, data),
};
