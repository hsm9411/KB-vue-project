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
        const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');

        // 1. Robust Parallel fetch using allSettled
        const results = await Promise.allSettled([
          groupApi.getGroup(groupId),
          groupApi.getGroupMembersByGroup(groupId),
          txApi.getTransactions({
            groupId: groupId,
            date_gte: start,
            date_lte: end,
            type: 'expense'
          })
        ]);

        // Extract values or handle failure cases
        const groupRes = results[0].status === 'fulfilled' ? results[0].value : null;
        const membersRes = results[1].status === 'fulfilled' ? results[1].value : { data: [] };
        const txRes = results[2].status === 'fulfilled' ? results[2].value : { data: [] };

        if (!groupRes) {
          throw new Error('그룹 정보를 불러올 수 없습니다.');
        }

        this.group = groupRes.data;
        this.members = membersRes.data;

        // 2. Aggregate spendings in memory safely
        const spendings = {};
        this.members.forEach(m => spendings[m.id] = 0);

        if (txRes && txRes.data) {
          txRes.data.forEach(tx => {
            if (spendings[tx.userId] !== undefined) {
              spendings[tx.userId] += tx.amount;
            }
          });
        }

        this.memberSpendings = spendings;
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
