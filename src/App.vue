<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './store/userStore';
import { useTxStore } from './store/txStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const txStore = useTxStore();
const router = useRouter();

onMounted(() => {
  if (userStore.isLoggedIn) {
    txStore.fetchTransactions(userStore.user.id);
  }
});

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="app-container min-vh-100 bg-light d-flex flex-column flex-md-row">
    <!-- Desktop Sidebar Navigation -->
    <aside v-if="userStore.isLoggedIn" class="sidebar d-none d-md-flex flex-column bg-white border-end shadow-sm vh-100 position-sticky top-0">
      <div class="p-4 mb-4">
        <router-link class="navbar-brand d-flex align-items-center text-primary text-decoration-none" to="/">
          <i class="bi bi-wallet2 fs-3 me-2"></i>
          <span class="fw-bold fs-4">가계부 RWA</span>
        </router-link>
      </div>

      <nav class="nav flex-column px-3 gap-1 flex-grow-1">
        <router-link to="/" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-grid-fill me-3"></i><span>대시보드</span>
        </router-link>
        <router-link to="/history" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-calendar-week me-3"></i><span>거래 내역</span>
        </router-link>
        <router-link to="/race" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-trophy-fill me-3"></i><span>소비 레이스</span>
        </router-link>
        <router-link to="/summary" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-bar-chart-fill me-3"></i><span>재정 요약</span>
        </router-link>
        <router-link to="/profile" class="nav-link rounded-3 d-flex align-items-center p-3" active-class="active-sidebar">
          <i class="bi bi-person-fill me-3"></i><span>마이페이지</span>
        </router-link>
      </nav>

      <div class="p-4 border-top">
        <button @click="handleLogout" class="btn btn-link text-danger text-decoration-none p-0 small fw-bold">
          <i class="bi bi-box-arrow-right me-2"></i>로그아웃
        </button>
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

      <!-- Mobile Bottom Navigation -->
      <nav v-if="userStore.isLoggedIn" class="bottom-nav d-md-none fixed-bottom bg-white border-top shadow-lg">
        <div class="container-fluid h-100 px-0">
          <div class="row h-100 g-0">
            <div class="col text-center">
              <router-link to="/" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-grid-fill fs-4"></i><span class="small">홈</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/history" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-calendar-week fs-4"></i><span class="small">내역</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/race" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-trophy-fill fs-4"></i><span class="small">레이스</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/summary" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-bar-chart-fill fs-4"></i><span class="small">요약</span>
              </router-link>
            </div>
            <div class="col text-center">
              <router-link to="/profile" class="nav-item-link py-2 d-flex flex-column align-items-center" active-class="active">
                <i class="bi bi-person-fill fs-4"></i><span class="small">내정보</span>
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </main>
  </div>
</template>

<style>
body {
  background-color: #f8f9fa;
  font-family: 'Pretendard', sans-serif;
  color: #212529;
}
.sidebar { width: 260px; z-index: 1040; }
.nav-link { color: #6c757d; font-weight: 500; transition: all 0.2s ease; }
.nav-link:hover { background-color: #f1f3f5; color: #0d6efd; }
.active-sidebar { background-color: #e7f1ff !important; color: #0d6efd !important; font-weight: 700; }
.bottom-nav { height: 70px; z-index: 1030; }
.nav-item-link { text-decoration: none; color: #adb5bd; }
.nav-item-link.active { color: #0d6efd; }
@media (max-width: 767.98px) { main { padding-bottom: 90px; } }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
