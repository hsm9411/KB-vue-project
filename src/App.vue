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
  <div class="app-container min-vh-100 bg-light d-flex flex-column">
    <!-- Main Mobile Content Wrapper -->
    <div class="mobile-wrapper flex-grow-1 mx-auto bg-white shadow-sm position-relative">
      <!-- Scrollable Content Area -->
      <main class="content-area pb-5">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Bottom Navigation Bar -->
      <nav class="bottom-nav fixed-bottom mx-auto bg-white border-top shadow-lg">
        <div class="container-fluid h-100 px-0">
          <div class="row h-100 g-0">
            <div class="col text-center">
              <router-link to="/" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-grid-fill fs-4"></i>
                <span class="small">홈</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/history" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-list-columns-reverse fs-4"></i>
                <span class="small">내역</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/profile" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-person-fill fs-4"></i>
                <span class="small">프로필</span>
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<style>
/* Base Styles */
body {
  background-color: #f0f2f5;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
}

/* Mobile Container Wrapper */
.mobile-wrapper {
  width: 100%;
  max-width: 480px; /* Standard Mobile-First Width */
  min-height: 100vh;
  margin-bottom: env(safe-area-inset-bottom);
}

.content-area {
  padding: 20px 20px 80px 20px; /* Bottom padding for Nav */
}

/* Bottom Navigation */
.bottom-nav {
  max-width: 480px;
  height: 65px;
  left: 0;
  right: 0;
  z-index: 1030;
}

.nav-item-link {
  text-decoration: none;
  color: #adb5bd;
  transition: all 0.3s ease;
  height: 100%;
  justify-content: center;
}

.nav-item-link.active {
  color: #0d6efd;
}

.nav-item-link i {
  margin-bottom: 2px;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Utility for Touch targets */
.btn, .nav-item-link, input, select {
  min-height: 44px;
}
</style>
