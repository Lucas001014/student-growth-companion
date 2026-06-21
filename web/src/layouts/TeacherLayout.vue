<template>
  <div class="teacher-layout">
    <aside class="sidebar" :class="{ collapsed: sidebarOpen === false }">
      <div class="sidebar-header">
        <div class="brand-logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text" v-if="sidebarOpen">成长陪伴</span>
        </div>
        <button class="collapse-btn" @click="toggleSidebar">
          <span>{{ sidebarOpen ? '◀' : '▶' }}</span>
        </button>
      </div>

      <el-menu :default-active="activeMenu" mode="vertical" class="sidebar-menu">
        <div class="menu-section">
          <span class="section-label">工作台</span>
          <el-menu-item index="/teacher/dashboard">
            <span slot="icon">📊</span>
            <span>班级看板</span>
          </el-menu-item>
          <el-menu-item index="/teacher/approval">
            <span slot="icon">✓</span>
            <span>审批中心</span>
          </el-menu-item>
          <el-menu-item index="/teacher/homework">
            <span slot="icon">📝</span>
            <span>作业管理</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">学生管理</span>
          <el-menu-item index="/teacher/students">
            <span slot="icon">👨‍🎓</span>
            <span>学生列表</span>
          </el-menu-item>
          <el-menu-item index="/teacher/ranking">
            <span slot="icon">🏆</span>
            <span>成长排行</span>
          </el-menu-item>
          <el-menu-item index="/teacher/honor">
            <span slot="icon">🎁</span>
            <span>奖励发放</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">系统</span>
          <el-menu-item index="/teacher/settings">
            <span slot="icon">⚙️</span>
            <span>班级设置</span>
          </el-menu-item>
        </div>
      </el-menu>

      <div class="sidebar-footer">
        <div class="user-info" v-if="sidebarOpen">
          <span class="user-icon">👩‍🏫</span>
          <div class="user-detail">
            <div class="user-name">{{ auth.user?.name || '教师' }}</div>
            <div class="user-role">{{ auth.user?.className || '教师' }}</div>
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
            <span class="breadcrumb-item">教师工作台</span>
            <span class="breadcrumb-arrow">›</span>
            <span class="breadcrumb-item active">{{ currentTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ statData.students }}</span>
              <span class="stat-label">学生数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ statData.points }}</span>
              <span class="stat-label">总积分</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ statData.requests }}</span>
              <span class="stat-label">待审批</span>
            </div>
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
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const sidebarOpen = ref(true);
const activeMenu = ref('');

const statData = ref({ students: 45, points: 8850, requests: 3 });

const currentTitle = computed(() => {
  const titles: Record<string, string> = {
    '/teacher/dashboard': '班级看板',
    '/teacher/approval': '审批中心',
    '/teacher/homework': '作业管理',
    '/teacher/students': '学生列表',
    '/teacher/ranking': '成长排行',
    '/teacher/honor': '奖励发放',
    '/teacher/settings': '班级设置'
  };
  return titles[route.path] || '教师工作台';
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
});

onUnmounted(() => {
  router.afterEach(() => {});
});
</script>

<style scoped>
.teacher-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

.sidebar {
  width: 220px;
  background: linear-gradient(180deg, #ffffff 0%, #eff6ff 100%);
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
  color: var(--accent-blue);
  white-space: nowrap;
}

.collapse-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(96, 165, 250, 0.1);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--accent-blue);
  transition: all 0.2s;
}

.collapse-btn:hover {
  background: rgba(96, 165, 250, 0.2);
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
  background: linear-gradient(135deg, rgba(96, 165, 250, 0.1), rgba(59, 130, 246, 0.05));
  color: var(--accent-blue);
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: rgba(96, 165, 250, 0.06);
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
  background: rgba(96, 165, 250, 0.06);
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
  color: var(--accent-blue);
  font-weight: 600;
}

.breadcrumb-arrow {
  color: var(--text-muted);
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-blue);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
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
