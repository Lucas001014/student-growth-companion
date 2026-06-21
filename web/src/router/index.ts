import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: () => import('../views/login/Login.vue') },
  { path: '/teacher/dashboard', component: () => import('../views/teacher/Dashboard.vue'), meta: { role: 'teacher', title: '教师首页' } },
  { path: '/teacher/class', component: () => import('../views/teacher/ClassManage.vue'), meta: { role: 'teacher', title: '班级管理' } },
  { path: '/teacher/students', component: () => import('../views/teacher/StudentList.vue'), meta: { role: 'teacher', title: '学生列表' } },
  { path: '/teacher/honor', component: () => import('../views/teacher/HonorManage.vue'), meta: { role: 'teacher', title: '荣誉发放' } },
  { path: '/teacher/approvals', component: () => import('../views/teacher/ApprovalCenter.vue'), meta: { role: 'teacher', title: '审批中心' } },
  { path: '/teacher/blindbox', component: () => import('../views/teacher/BlindBoxManage.vue'), meta: { role: 'teacher', title: '盲盒管理' } },
  { path: '/teacher/announcement', component: () => import('../views/teacher/Announcement.vue'), meta: { role: 'teacher', title: '公告发布' } },
  { path: '/teacher/statistics', component: () => import('../views/teacher/Statistics.vue'), meta: { role: 'teacher', title: '数据统计' } },
  { path: '/student/dashboard', component: () => import('../views/student/Dashboard.vue'), meta: { role: 'student', title: '我的首页' } },
  { path: '/student/honor', component: () => import('../views/student/MyHonor.vue'), meta: { role: 'student', title: '我的荣誉' } },
  { path: '/student/skins', component: () => import('../views/student/MySkins.vue'), meta: { role: 'student', title: '我的皮肤' } },
  { path: '/student/blindbox', component: () => import('../views/student/BlindBox.vue'), meta: { role: 'student', title: '盲盒抽取' } },
  { path: '/student/ranking', component: () => import('../views/student/Ranking.vue'), meta: { role: 'student', title: '班级排行' } },
  { path: '/student/homework', component: () => import('../views/student/HomeworkShow.vue'), meta: { role: 'student', title: '作业展示' } },
  { path: '/student/requests', component: () => import('../views/student/MyRequests.vue'), meta: { role: 'student', title: '我的申请' } },
  { path: '/parent/dashboard', component: () => import('../views/student/parent/ParentDashboard.vue'), meta: { role: 'student', mode: 'parent', title: '家长首页' } },
  { path: '/parent/confirm', component: () => import('../views/student/parent/HomeworkConfirm.vue'), meta: { role: 'student', mode: 'parent', title: '确认作业' } },
  { path: '/parent/upload', component: () => import('../views/student/parent/HomeworkUpload.vue'), meta: { role: 'student', mode: 'parent', title: '上传选择题' } },
  { path: '/parent/child-honor', component: () => import('../views/student/parent/ChildHonor.vue'), meta: { role: 'student', mode: 'parent', title: '孩子荣誉' } },
  { path: '/parent/history', component: () => import('../views/student/parent/ConfirmHistory.vue'), meta: { role: 'student', mode: 'parent', title: '确认历史' } },
  { path: '/admin/dashboard', component: () => import('../views/admin/AdminDashboard.vue'), meta: { role: 'admin', title: '全局看板' } },
  { path: '/admin/teachers', component: () => import('../views/admin/TeacherManage.vue'), meta: { role: 'admin', title: '教师管理' } },
  { path: '/admin/classes', component: () => import('../views/admin/ClassOverview.vue'), meta: { role: 'admin', title: '班级概览' } },
  { path: '/admin/skins', component: () => import('../views/admin/SkinLibrary.vue'), meta: { role: 'admin', title: '皮肤库' } },
  { path: '/admin/titles', component: () => import('../views/admin/TitleTemplates.vue'), meta: { role: 'admin', title: '称号模板' } },
  { path: '/admin/badges', component: () => import('../views/admin/IdentityTemplates.vue'), meta: { role: 'admin', title: '身份标识' } },
  { path: '/admin/config', component: () => import('../views/admin/PointsConfig.vue'), meta: { role: 'admin', title: '积分配置' } },
  { path: '/admin/export', component: () => import('../views/admin/DataExport.vue'), meta: { role: 'admin', title: '数据导出' } }
];

const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  
  if (to.path === '/login') {
    if (auth.isLoggedIn) {
      if (auth.role === 'teacher') return next({ path: '/teacher/dashboard' });
      if (auth.role === 'admin') return next({ path: '/admin/dashboard' });
      return next({ path: '/student/dashboard' });
    }
    return next();
  }
  
  if (!auth.isLoggedIn) return next({ path: '/login' });
  
  if (to.meta.role && to.meta.role !== auth.role) {
    if (auth.role === 'teacher') return next({ path: '/teacher/dashboard' });
    if (auth.role === 'admin') return next({ path: '/admin/dashboard' });
    return next({ path: '/student/dashboard' });
  }
  
  next();
});

export default router;
