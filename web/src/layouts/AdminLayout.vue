<template>
  <div class="admin-layout">
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="240px" class="sidebar">
        <div class="logo-box">
          <div class="logo-icon purple">👔</div>
          <div class="logo-text">
            <div class="logo-title">成长陪伴</div>
            <div class="logo-sub">管理端</div>
          </div>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="side-menu"
          @select="handleMenuSelect"
          background-color="transparent"
          text-color="#475569"
          active-text-color="#7c3aed"
          router
        >
          <el-menu-item index="/admin/dashboard">
            <span class="menu-icon">📊</span>
            <span>数据概览</span>
          </el-menu-item>
          <el-menu-item index="/admin/schools">
            <span class="menu-icon">🏫</span>
            <span>学校管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/teachers">
            <span class="menu-icon">👩‍🏫</span>
            <span>教师管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/honor-walls">
            <span class="menu-icon">🏆</span>
            <span>荣誉墙管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/blind-box">
            <span class="menu-icon">🎁</span>
            <span>盲盒管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/settings">
            <span class="menu-icon">⚙️</span>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <div class="admin-card">
            <div class="admin-avatar">👔</div>
            <div class="admin-info">
              <div class="admin-name">管理员</div>
              <div class="admin-meta">系统管理</div>
            </div>
          </div>
        </div>
      </el-aside>

      <!-- 右侧内容区 -->
      <el-container class="main-container">
        <el-header class="top-header">
          <div class="header-left">
            <span class="page-title">{{ currentPageTitle }}</span>
          </div>
          <div class="header-right">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" placeholder="搜索..." class="search-input" />
            </div>
            <el-badge :value="2" class="header-badge">
              <button class="icon-btn">🔔</button>
            </el-badge>
            <el-dropdown>
              <div class="user-info">
                <div class="user-avatar-small purple">👔</div>
                <div class="user-text">
                  <div class="user-name">管理员</div>
                  <div class="user-role">系统管理员</div>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="content-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const activeMenu = ref(route.path);

const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': '数据概览',
    '/admin/schools': '学校管理',
    '/admin/teachers': '教师管理',
    '/admin/honor-walls': '荣誉墙管理',
    '/admin/blind-box': '盲盒管理',
    '/admin/settings': '系统设置',
  };
  return titles[route.path] || '学生成长陪伴';
});

const handleMenuSelect = (index: string) => {
  activeMenu.value = index;
};

const handleLogout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('adminInfo');
  sessionStorage.removeItem('auth');
  router.push('/login');
};
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #faf5ff;
}

/* 侧边栏 */
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #faf5ff 100%);
  border-right: 1px solid #e9d5ff;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid #e9d5ff;
  margin-bottom: 16px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.logo-icon.purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
}

.logo-text .logo-title {
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.logo-text .logo-sub {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.side-menu {
  flex: 1;
  border-right: none;
  padding: 0 12px;
}

.side-menu :deep(.el-menu-item) {
  border-radius: 10px;
  height: 48px;
  line-height: 48px;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 16px !important;
  display: flex;
  align-items: center;
}

.side-menu :deep(.el-menu-item:hover) {
  background-color: #faf5ff;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%);
  color: #7c3aed;
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #e9d5ff;
}

.admin-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%);
  border-radius: 14px;
  border: 1px solid #e9d5ff;
}

.admin-avatar {
  width: 44px;
  height: 44px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.admin-info .admin-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.admin-info .admin-meta {
  font-size: 12px;
  color: #64748b;
}

/* 主内容区 */
.main-container {
  height: 100vh;
}

.top-header {
  background: #ffffff;
  border-bottom: 1px solid #e9d5ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 68px;
}

.header-left .page-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  border-radius: 12px;
  padding: 8px 14px;
  width: 220px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  background: #ffffff;
  border-color: #a855f7;
  box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
}

.search-icon {
  font-size: 14px;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #0f172a;
}

.search-input::placeholder {
  color: #94a3b8;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #faf5ff;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #e9d5ff;
}

.header-badge {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  border-radius: 999px;
  background: #faf5ff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: #e9d5ff;
}

.user-avatar-small {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffffff;
}

.user-avatar-small.purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}

.user-text .user-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.2;
}

.user-text .user-role {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.content-main {
  padding: 28px 32px;
  background: #faf5ff;
  overflow-y: auto;
}

.content-main :deep(.el-breadcrumb__inner) {
  color: #64748b !important;
  font-size: 13px !important;
}

/* 响应式 */
@media (max-width: 900px) {
  .sidebar {
    width: 72px !important;
  }
  .logo-text,
  .admin-info,
  .side-menu :deep(.el-menu-item span:not(.menu-icon)) {
    display: none;
  }
  .top-header {
    padding: 0 16px;
  }
  .content-main {
    padding: 20px 16px;
  }
}
</style>
