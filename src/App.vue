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
  <div class="app-container min-vh-100 bg-light d-flex flex-column flex-md-row">
    <!-- Desktop Sidebar Navigation (Visible on md and above) -->
    <aside class="sidebar d-none d-md-flex flex-column bg-white border-end shadow-sm vh-100 position-sticky top-0">
      <div class="p-4 mb-4">
        <router-link class="navbar-brand d-flex align-items-center text-primary text-decoration-none" to="/">
          <i class="bi bi-wallet2 fs-3 me-2"></i>
          <span class="fw-bold fs-4">가계부 앱</span>
        </router-link>
      </div>

      <nav class="nav flex-column px-3 gap-2 flex-grow-1">
        <router-link to="/" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-grid-fill me-3"></i>
          <span>대시보드</span>
        </router-link>
        <router-link to="/history" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-list-columns-reverse me-3"></i>
          <span>거래 내역</span>
        </router-link>
        <router-link to="/profile" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-person-fill me-3"></i>
          <span>사용자 프로필</span>
        </router-link>
      </nav>

      <div class="p-4 border-top">
        <div class="d-flex align-items-center">
          <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-2" style="width: 40px; height: 40px;">
            {{ profileStore.profile.name ? profileStore.profile.name.substring(0, 2) : 'KB' }}
          </div>
          <div class="overflow-hidden">
            <div class="fw-bold text-truncate small">{{ profileStore.profile.name || 'KB수강생' }}</div>
            <div class="text-muted text-truncate extra-small">{{ profileStore.profile.email || 'kb_student@kb.com' }}</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-grow-1 overflow-auto position-relative">
      <div class="container-fluid max-w-lg-container py-4 px-3 px-md-5">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Mobile Bottom Navigation Bar (Hidden on md and above) -->
      <nav class="bottom-nav d-md-none fixed-bottom bg-white border-top shadow-lg">
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
    </main>
  </div>
</template>

<style>
/* Base Styles */
body {
  background-color: #f8f9fa;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  color: #212529;
}

/* Sidebar Styles */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  z-index: 1040;
}

.nav-link {
  color: #6c757d;
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: #f1f3f5;
  color: #0d6efd;
}

.active-sidebar {
  background-color: #e7f1ff !important;
  color: #0d6efd !important;
  font-weight: 700;
}

.extra-small {
  font-size: 0.75rem;
}

/* Container width for large screens */
.max-w-lg-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Mobile Navigation */
.bottom-nav {
  height: 65px;
  z-index: 1030;
}

.nav-item-link {
  text-decoration: none;
  color: #adb5bd;
  height: 100%;
  justify-content: center;
}

.nav-item-link.active {
  color: #0d6efd;
}

/* Main content padding on mobile */
@media (max-width: 767.98px) {
  main {
    padding-bottom: 80px;
  }
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

/* Shared Utility for Touch/Click targets */
.btn, .nav-link, .nav-item-link, input, select {
  min-height: 44px;
}
</style>
