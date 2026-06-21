<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
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

      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        class="sidebar-menu"
      >
        <div class="menu-section">
          <span class="section-label">管理中心</span>
          <el-menu-item index="/admin/dashboard">
            <span slot="icon">📊</span>
            <span>全局看板</span>
          </el-menu-item>
          <el-menu-item index="/admin/teachers">
            <span slot="icon">👩‍🏫</span>
            <span>教师管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/classes">
            <span slot="icon">🏫</span>
            <span>班级概览</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">游戏化管理</span>
          <el-menu-item index="/admin/skins">
            <span slot="icon">🎨</span>
            <span>皮肤库</span>
          </el-menu-item>
          <el-menu-item index="/admin/titles">
            <span slot="icon">🏆</span>
            <span>称号模板</span>
          </el-menu-item>
          <el-menu-item index="/admin/badges">
            <span slot="icon">👑</span>
            <span>身份标识</span>
          </el-menu-item>
        </div>

        <div class="menu-section">
          <span class="section-label">系统设置</span>
          <el-menu-item index="/admin/config">
            <span slot="icon">⚙️</span>
            <span>积分配置</span>
          </el-menu-item>
          <el-menu-item index="/admin/export">
            <span slot="icon">📤</span>
            <span>数据导出</span>
          </el-menu-item>
        </div>
      </el-menu>

      <div class="sidebar-footer">
        <div class="user-info" v-if="sidebarOpen">
          <span class="user-icon">👔</span>
          <div class="user-detail">
            <div class="user-name">{{ auth.user?.name || '管理员' }}</div>
            <div class="user-role">系统管理员</div>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <span>🚪</span>
          <span v-if="sidebarOpen">退出</span>
        </button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="main-content">
      <header class="page-header">
        <div class="header-left">
          <div class="page-breadcrumb">
            <span class="breadcrumb-item">管理中心</span>
            <span class="breadcrumb-arrow">›</span>
            <span class="breadcrumb-item active">{{ currentTitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-value">{{ statData.classes }}</span>
              <span class="stat-label">班级数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ statData.teachers }}</span>
              <span class="stat-label">教师数</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ statData.students }}</span>
              <span class="stat-label">学生数</span>
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

const statData = ref({ classes: 12, teachers: 8, students: 420 });

const currentTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': '全局看板',
    '/admin/teachers': '教师管理',
    '/admin/classes': '班级概览',
    '/admin/skins': '皮肤库',
    '/admin/titles': '称号模板',
    '/admin/badges': '身份标识',
    '/admin/config': '积分配置',
    '/admin/export': '数据导出'
  };
  return titles[route.path] || '管理中心';
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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 侧边栏 */
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

/* 菜单 */
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

/* 底部 */
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

/* 主内容区 */
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
  color: var(--primary-color);
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
