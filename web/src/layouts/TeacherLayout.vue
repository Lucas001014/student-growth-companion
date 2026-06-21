<template>
  <div class="teacher-layout">
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside width="240px" class="sidebar">
        <div class="logo-box">
          <div class="logo-icon orange">👩‍🏫</div>
          <div class="logo-text">
            <div class="logo-title">成长陪伴</div>
            <div class="logo-sub">教师端</div>
          </div>
        </div>

        <el-menu
          :default-active="activeMenu"
          class="side-menu"
          @select="handleMenuSelect"
          background-color="transparent"
          text-color="#475569"
          active-text-color="#f97316"
          router
        >
          <el-menu-item index="/teacher/dashboard">
            <span class="menu-icon">📊</span>
            <span>工作台</span>
          </el-menu-item>
          <el-menu-item index="/teacher/honor-walls">
            <span class="menu-icon">🏆</span>
            <span>荣誉墙管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/blind-box">
            <span class="menu-icon">🎁</span>
            <span>盲盒管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/students">
            <span class="menu-icon">👨‍🎓</span>
            <span>学生管理</span>
          </el-menu-item>
          <el-menu-item index="/teacher/reports">
            <span class="menu-icon">📋</span>
            <span>数据报告</span>
          </el-menu-item>
        </el-menu>

        <div class="sidebar-footer">
          <div class="teacher-card">
            <div class="teacher-avatar">👩‍🏫</div>
            <div class="teacher-info">
              <div class="teacher-name">{{ teacherInfo?.name || '老师' }}</div>
              <div class="teacher-meta">{{ teacherInfo?.className || '班级管理' }}</div>
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
            <el-badge :value="5" class="header-badge">
              <button class="icon-btn">🔔</button>
            </el-badge>
            <el-dropdown>
              <div class="user-info">
                <div class="user-avatar-small orange">👩‍🏫</div>
                <div class="user-text">
                  <div class="user-name">{{ teacherInfo?.name || '老师' }}</div>
                  <div class="user-role">教师</div>
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

const teacherInfo = computed(() => {
  const raw = localStorage.getItem('teacherInfo') || sessionStorage.getItem('teacherInfo');
  return raw ? JSON.parse(raw) : null;
});

const activeMenu = ref(route.path);

const currentPageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/teacher/dashboard': '工作台',
    '/teacher/honor-walls': '荣誉墙管理',
    '/teacher/blind-box': '盲盒管理',
    '/teacher/students': '学生管理',
    '/teacher/reports': '数据报告',
  };
  return titles[route.path] || '学生成长陪伴';
});

const handleMenuSelect = (index: string) => {
  activeMenu.value = index;
};

const handleLogout = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('teacherInfo');
  sessionStorage.removeItem('auth');
  router.push('/login');
};
</script>

<style scoped>
.teacher-layout {
  min-height: 100vh;
  background: #fff7ed;
}

/* 侧边栏 */
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #fff7ed 100%);
  border-right: 1px solid #fed7aa;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid #fed7aa;
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

.logo-icon.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
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
  background-color: #fff7ed;
}

.side-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #ffedd5 0%, #fef3c7 100%);
  color: #f97316;
}

.menu-icon {
  margin-right: 12px;
  font-size: 18px;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #fed7aa;
}

.teacher-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #ffedd5 0%, #fef3c7 100%);
  border-radius: 14px;
  border: 1px solid #fed7aa;
}

.teacher-avatar {
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

.teacher-info .teacher-name {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.teacher-info .teacher-meta {
  font-size: 12px;
  color: #64748b;
}

/* 主内容区 */
.main-container {
  height: 100vh;
}

.top-header {
  background: #ffffff;
  border-bottom: 1px solid #fed7aa;
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
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  padding: 8px 14px;
  width: 220px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  background: #ffffff;
  border-color: #fb923c;
  box-shadow: 0 0 0 4px rgba(251, 146, 60, 0.1);
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
  background: #fff7ed;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background: #fed7aa;
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
  background: #fff7ed;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-info:hover {
  background: #fed7aa;
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

.user-avatar-small.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
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
  background: #fff7ed;
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
  .teacher-info,
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
