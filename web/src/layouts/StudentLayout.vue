<template>
  <div class="student-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarOpen === false }">
      <div class="sidebar-header">
        <div class="brand-logo">
          <span class="logo-icon">🌱</span>
          <span class="logo-text" v-if="sidebarOpen">成长陪伴</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <span>{{ sidebarOpen ? '◀' : '▶' }}</span>
        </button>
      </div>

      <el-menu :default-active="activeMenu" mode="vertical" class="sidebar-menu">
        <div class="menu-section">
          <span class="section-label">我的成长</span>
          <el-menu-item index="/student/dashboard">
            <span slot="icon">📊</span>
            <span>成长看板</span>
          </el-menu-item>
          <el-menu-item index="/student/achievements">
            <span slot="icon">🏅</span>
            <span>成就中心</span>
          </el-menu-item>
          <el-menu-item index="/student/mySkins">
            <span slot="icon">🎨</span>
            <span>我的皮肤</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">互动</span>
          <el-menu-item index="/student/blindBox">
            <span slot="icon">🎁</span>
            <span>惊喜盲盒</span>
          </el-menu-item>
          <el-menu-item index="/student/ranking">
            <span slot="icon">🏆</span>
            <span>成长排行</span>
          </el-menu-item>
          <el-menu-item index="/student/requests">
            <span slot="icon">📝</span>
            <span>申请记录</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">设置</span>
          <el-menu-item index="/student/settings">
            <span slot="icon">⚙️</span>
            <span>个人设置</span>
          </el-menu-item>
        </div>
      </el-menu>

      <div class="sidebar-footer">
        <div class="user-info" v-if="sidebarOpen">
          <span class="user-icon">👨‍🎓</span>
          <div class="user-detail">
            <div class="user-name">{{ auth.user?.name || '学生' }}</div>
            <div class="user-role">{{ auth.user?.className || '学生' }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span>🚪</span>
          <span v-if="sidebarOpen">退出</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="page-header">
        <div class="header-left">
          <div class="page-breadcrumb">
            <span class="breadcrumb-item">成长中心</span>
            <span class="breadcrumb-arrow">›</span>
            <span class="breadcrumb-item active">{{ currentTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="points-chip">
            <span class="points-icon">⭐</span>
            <span class="points-value">{{ points }}</span>
            <span class="points-label">成长值</span>
          </div>
          <div class="mode-switch">
            <span>{{ currentModeLabel }}</span>
          </div>
        </div>
      </header>

      <div class="content-area">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { useStudentStore } from '../../stores/student';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const studentStore = useStudentStore();

const sidebarOpen = ref(true);
const activeMenu = ref('');
const points = ref(0);

const currentTitle = computed(() => {
  const titles: Record<string, string> = {
    '/student/dashboard': '成长看板',
    '/student/achievements': '成就中心',
    '/student/mySkins': '我的皮肤',
    '/student/blindBox': '惊喜盲盒',
    '/student/ranking': '成长排行',
    '/student/requests': '申请记录',
    '/student/settings': '个人设置'
  };
  return titles[route.path] || '成长中心';
});

const currentModeLabel = computed(() => {
  const mode = auth.mode;
  return mode === 'parent' ? '👨‍👩‍👧 家长视角' : '👨‍🎓 学生视角';
});

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleLogout = () => {
  localStorage.clear();
  auth.$reset();
  router.push('/login');
  ElMessage.success('已退出登录');
};

const handleRouteChange = () => {
  activeMenu.value = route.path;
};

onMounted(() => {
  activeMenu.value = route.path;
  router.afterEach(handleRouteChange);
  if (studentStore.student) {
    points.value = studentStore.student.points || 0;
  }
});

onUnmounted(() => {
  router.afterEach(() => {});
});
</script>

<style scoped>
.student-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
  border-right: 1px solid var(--border-light);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04);
}

.sidebar.collapsed {
  width: 68px;
}

.sidebar-header {
  padding: 20px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-light);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 32px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
  white-space: nowrap;
}

.collapse-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--primary-color);
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: rgba(16, 185, 129, 0.2);
}

.sidebar-menu {
  flex: 1;
  padding: 12px 0;
}

.menu-section {
  margin-bottom: 20px;
}

.section-label {
  display: block;
  padding: 8px 24px;
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 4px 8px;
  border-radius: 10px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.05));
  color: var(--primary-color);
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(16, 185, 129, 0.06);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--border-light);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(16, 185, 129, 0.06);
  border-radius: 12px;
  margin-bottom: 12px;
}

.user-icon {
  font-size: 32px;
}

.user-detail {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: var(--text-muted);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border: none;
  background: rgba(239, 68, 68, 0.08);
  border-radius: 10px;
  color: var(--danger-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid var(--border-light);
}

.page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  color: var(--text-secondary);
}

.breadcrumb-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

.breadcrumb-arrow {
  color: var(--text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.points-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 146, 60, 0.05));
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 24px;
}

.points-icon {
  font-size: 18px;
}

.points-value {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: #f59e0b;
}

.points-label {
  font-size: 12px;
  color: #9ca3af;
}

.mode-switch {
  padding: 8px 16px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 8px;
  font-size: 13px;
  color: var(--primary-color);
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 100;
    transform: translateX(0);
    transition: transform 0.3s ease;
  }
  .sidebar.collapsed {
    transform: translateX(-100%);
  }
}
</style>
