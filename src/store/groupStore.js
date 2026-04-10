import { defineStore } from 'pinia';
import groupApi from '../api/groupApi';
import txApi from '../api/txApi';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: null,
    members: [],
    memberSpendings: {}, // { userId: amount }
    loading: false,
  }),
  actions: {
    async fetchGroupData(groupId) {
      this.loading = true;
      try {
        const groupRes = await groupApi.getGroup(groupId);
        this.group = groupRes.data;

        const membersRes = await groupApi.getGroupMembers(this.group.memberIds);
        this.members = membersRes.data;

        // Fetch spendings for each member for current month
        const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');

        for (const member of this.members) {
          const txRes = await txApi.getTransactions({
            userId: member.id,
            date_gte: start,
            date_lte: end,
            type: 'expense'
          });
          const total = txRes.data.reduce((sum, t) => sum + t.amount, 0);
          this.memberSpendings[member.id] = total;
        }
      } catch (err) {
        console.error('Failed to fetch group data', err);
      } finally {
        this.loading = false;
      }
    },
    async createGroup(name, userId) {
      this.loading = true;
      try {
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const response = await groupApi.createGroup({
          name,
          inviteCode,
          limit: 1000000,
          memberIds: [userId]
        });
        this.group = response.data;
        return response.data;
      } finally {
        this.loading = false;
      }
    },
    async joinGroup(inviteCode, userId) {
      this.loading = true;
      try {
        const groupsRes = await groupApi.getGroups();
        const group = groupsRes.data.find(g => g.inviteCode === inviteCode);
        if (!group) throw new Error('초대 코드가 유효하지 않습니다.');

        if (!group.memberIds.includes(userId)) {
          group.memberIds.push(userId);
          await groupApi.updateGroup(group.id, group);
        }
        this.group = group;
        return group;
      } finally {
        this.loading = false;
      }
    },
    async leaveGroup(groupId, userId) {
      this.loading = true;
      try {
        const groupRes = await groupApi.getGroup(groupId);
        const group = groupRes.data;
        group.memberIds = group.memberIds.filter(id => id !== userId);
        await groupApi.updateGroup(groupId, group);
        this.group = null;
        this.members = [];
        this.memberSpendings = {};
      } finally {
        this.loading = false;
      }
    }
  }
});
