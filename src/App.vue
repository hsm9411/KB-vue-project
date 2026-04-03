<script setup>
import { onMounted } from 'vue';
import { useBudgetStore } from './store/budgetStore';
import { useProfileStore } from './store/profileStore';

const budgetStore = useBudgetStore();
const profileStore = useProfileStore();

onMounted(() => {
  budgetStore.fetchBudgets();
  budgetStore.fetchCategories();
  profileStore.fetchProfile();
});
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div class="container">
        <router-link class="navbar-brand fw-bold" to="/">
          <i class="bi bi-wallet2 me-2"></i>가계부 앱
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/" active-class="active">홈</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/history" active-class="active">내역</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/profile" active-class="active">프로필</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container">
      <router-view />
    </main>

    <footer class="text-center text-muted mt-5 py-3 border-top">
      <p>&copy; 2026 Household Account Book - IT's Your Life Training</p>
    </footer>
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
}

.active {
  font-weight: bold;
}
</style>
