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
      } finally {
        this.loading = false;
      }
    }
  }
});
