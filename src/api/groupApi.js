import api from './index';

export default {
  getGroup: (id) => api.get(`/groups/${id}`),
  getGroupMembers: (ids) => api.get(`/users?id=${ids.join('&id=')}`),
};
