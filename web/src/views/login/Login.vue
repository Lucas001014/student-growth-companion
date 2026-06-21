<template>
  <div class="login-page">
    <!-- 装饰背景元素 -->
    <div class="decor decor-circle-1"></div>
    <div class="decor decor-circle-2"></div>
    <div class="decor decor-circle-3"></div>
    <div class="decor decor-dots"></div>

    <div class="login-wrapper">
      <!-- 左侧品牌展示 -->
      <div class="brand-side">
        <div class="brand-content">
          <div class="logo-wrap">
            <div class="logo-circle">
              <span class="logo-emoji">📚</span>
            </div>
            <div class="sparkle s1">✨</div>
            <div class="sparkle s2">⭐</div>
            <div class="sparkle s3">🌟</div>
          </div>

          <h1 class="brand-title">学生成长陪伴</h1>
          <p class="brand-subtitle">Student Growth Companion System</p>

          <div class="brand-desc">
            记录每一次进步 · 陪伴每一段成长
          </div>

          <div class="feature-grid">
            <div class="feature-item">
              <div class="feature-icon blue">📖</div>
              <div class="feature-text">
                <div class="feature-name">学习记录</div>
                <div class="feature-desc">点滴积累</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon orange">🎯</div>
              <div class="feature-text">
                <div class="feature-name">成长目标</div>
                <div class="feature-desc">清晰规划</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon green">🏆</div>
              <div class="feature-text">
                <div class="feature-name">成就激励</div>
                <div class="feature-desc">进步可见</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon purple">💬</div>
              <div class="feature-text">
                <div class="feature-name">家校互通</div>
                <div class="feature-desc">温暖陪伴</div>
              </div>
            </div>
          </div>

          <div class="brand-footer">
            <span class="progress-dots">
              <span class="dot active"></span>
              <span class="dot active"></span>
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
            <span class="brand-quote">每一次努力，都是在变得更好</span>
          </div>
        </div>
      </div>

      <!-- 右侧登录卡片 -->
      <div class="form-side">
        <div class="form-card">
          <div class="form-header">
            <div class="welcome-badge">👋 欢迎回来</div>
            <h2 class="form-title">登录你的账号</h2>
            <p class="form-subtitle">请选择你的身份，开启成长之旅</p>
          </div>

          <!-- 角色标签 -->
          <div class="role-tabs">
            <button
              class="role-tab"
              :class="{ active: activeRole === 'student' }"
              @click="activeRole = 'student'"
            >
              <span class="role-icon">👨‍🎓</span>
              <span>学生</span>
            </button>
            <button
              class="role-tab"
              :class="{ active: activeRole === 'teacher' }"
              @click="activeRole = 'teacher'"
            >
              <span class="role-icon">👩‍🏫</span>
              <span>教师</span>
            </button>
            <button
              class="role-tab"
              :class="{ active: activeRole === 'admin' }"
              @click="activeRole = 'admin'"
            >
              <span class="role-icon">👔</span>
              <span>管理员</span>
            </button>
          </div>

          <!-- 学生登录表单 -->
          <div v-if="activeRole === 'student'" class="form-body">
            <el-form :model="studentForm" @submit.prevent="handleSubmit">
              <el-form-item label="学号" class="form-field">
                <el-input
                  v-model="studentForm.studentId"
                  placeholder="请输入你的学号"
                  size="large"
                  clearable
                />
              </el-form-item>
              <el-form-item label="班级验证码" class="form-field">
                <el-input
                  v-model="studentForm.classCode"
                  placeholder="老师下发的班级验证码"
                  size="large"
                  show-password
                />
              </el-form-item>
              <button
                type="button"
                class="submit-btn submit-blue"
                :disabled="loading"
                @click="submitStudent"
              >
                <span v-if="!loading">开始学习 🚀</span>
                <span v-else>登录中...</span>
              </button>
            </el-form>
          </div>

          <!-- 教师登录表单 -->
          <div v-if="activeRole === 'teacher'" class="form-body">
            <el-form :model="teacherForm" @submit.prevent="handleSubmit">
              <el-form-item label="手机号" class="form-field">
                <el-input
                  v-model="teacherForm.phone"
                  placeholder="请输入手机号"
                  size="large"
                  clearable
                />
              </el-form-item>
              <el-form-item label="密码" class="form-field">
                <el-input
                  v-model="teacherForm.password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                />
              </el-form-item>
              <button
                type="button"
                class="submit-btn submit-orange"
                :disabled="loading"
                @click="submitTeacher"
              >
                <span v-if="!loading">进入工作台 →</span>
                <span v-else>登录中...</span>
              </button>
            </el-form>
          </div>

          <!-- 管理员登录表单 -->
          <div v-if="activeRole === 'admin'" class="form-body">
            <el-form :model="adminForm" @submit.prevent="handleSubmit">
              <el-form-item label="账号" class="form-field">
                <el-input
                  v-model="adminForm.phone"
                  placeholder="请输入管理员账号"
                  size="large"
                  clearable
                />
              </el-form-item>
              <el-form-item label="密码" class="form-field">
                <el-input
                  v-model="adminForm.password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                />
              </el-form-item>
              <button
                type="button"
                class="submit-btn submit-purple"
                :disabled="loading"
                @click="submitAdmin"
              >
                <span v-if="!loading">进入管理后台 →</span>
                <span v-else>登录中...</span>
              </button>
            </el-form>
          </div>

          <div class="demo-tip">
            💡 演示模式：任意账号均可登录体验
          </div>
        </div>

        <div class="form-footer">
          <span>© 2026 学生成长陪伴系统</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const activeRole = ref<'student' | 'teacher' | 'admin'>('student');
const loading = ref(false);
const studentForm = ref({ studentId: '', classCode: '' });
const teacherForm = ref({ phone: '', password: '' });
const adminForm = ref({ phone: '', password: '' });

const doLogin = async (payload: any, role: string, target: string) => {
  loading.value = true;
  try {
    await auth.login(payload);
    ElMessage.success('登录成功，正在进入系统...');
    setTimeout(() => {
      router.push(target).catch(() => {
        window.location.hash = '#' + target;
      });
    }, 400);
  } catch (e: any) {
    ElMessage.error(e?.message || '登录失败，请重试');
  } finally {
    loading.value = false;
  }
};

const submitStudent = () => {
  if (!studentForm.value.studentId) return ElMessage.warning('请输入学号');
  if (!studentForm.value.classCode) return ElMessage.warning('请输入班级验证码');
  doLogin(
    { role: 'student', studentId: studentForm.value.studentId, classCode: studentForm.value.classCode },
    'student',
    '/student/dashboard'
  );
};

const submitTeacher = () => {
  if (!teacherForm.value.phone) return ElMessage.warning('请输入手机号');
  if (!teacherForm.value.password) return ElMessage.warning('请输入密码');
  doLogin(
    { role: 'teacher', phone: teacherForm.value.phone, password: teacherForm.value.password },
    'teacher',
    '/teacher/dashboard'
  );
};

const submitAdmin = () => {
  if (!adminForm.value.phone) return ElMessage.warning('请输入管理员账号');
  if (!adminForm.value.password) return ElMessage.warning('请输入密码');
  doLogin(
    { role: 'admin', phone: adminForm.value.phone, password: adminForm.value.password },
    'admin',
    '/admin/dashboard'
  );
};

const handleSubmit = () => {};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #fef3c7 50%, #f0fdf4 100%);
  position: relative;
  overflow: hidden;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 装饰元素 */
.decor {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.decor-circle-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  left: -100px;
  animation: floatSlow 6s ease-in-out infinite;
}

.decor-circle-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -150px;
  right: -150px;
  animation: floatSlow 7s ease-in-out infinite reverse;
}

.decor-circle-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, transparent 70%);
  border-radius: 50%;
  top: 40%;
  left: 30%;
  animation: floatSlow 8s ease-in-out infinite;
}

.decor-dots {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.5;
}

/* 主容器 */
.login-wrapper {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 0;
  background: #ffffff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12), 0 4px 20px rgba(15, 23, 42, 0.04);
  position: relative;
  z-index: 1;
  animation: fadeSlideUp 0.6s ease-out;
}

/* 左侧品牌区 */
.brand-side {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #4f46e5 100%);
  position: relative;
  padding: 56px 48px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.brand-side::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 60%);
  border-radius: 50%;
}

.brand-side::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.18) 0%, transparent 60%);
  border-radius: 50%;
}

.brand-content {
  position: relative;
  z-index: 2;
  width: 100%;
  color: #ffffff;
}

/* Logo */
.logo-wrap {
  position: relative;
  display: inline-block;
  margin-bottom: 28px;
}

.logo-circle {
  width: 88px;
  height: 88px;
  background: rgba(255, 255, 255, 0.18);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  animation: pulseSoft 3s ease-in-out infinite;
}

.logo-emoji {
  font-size: 44px;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.sparkle {
  position: absolute;
  font-size: 20px;
  animation: float 3s ease-in-out infinite;
}

.s1 { top: -10px; right: -20px; animation-delay: 0s; }
.s2 { top: 20px; left: -24px; animation-delay: 0.8s; font-size: 16px; }
.s3 { bottom: -8px; right: -10px; animation-delay: 1.5s; font-size: 18px; }

/* 标题 */
.brand-title {
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  letter-spacing: 1px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 20px;
  font-weight: 500;
}

.brand-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
  line-height: 1.6;
}

/* 特性展示 */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 40px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.25s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-2px);
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.feature-icon.blue { background: rgba(59, 130, 246, 0.4); }
.feature-icon.orange { background: rgba(249, 115, 22, 0.4); }
.feature-icon.green { background: rgba(34, 197, 94, 0.4); }
.feature-icon.purple { background: rgba(168, 85, 247, 0.4); }

.feature-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.feature-desc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

/* 底部 */
.brand-footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  transition: all 0.2s ease;
}

.dot.active {
  background: #fbbf24;
  box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
}

.brand-quote {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

/* 右侧表单 */
.form-side {
  padding: 48px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 28px;
}

.welcome-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #dbeafe 0%, #fef3c7 100%);
  border: 1px solid #bfdbfe;
  color: #1e40af;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 16px;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  line-height: 1.3;
}

.form-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* 角色切换 */
.role-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 6px;
  background: #f1f5f9;
  border-radius: 14px;
  margin-bottom: 28px;
}

.role-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.role-tab:hover {
  color: #334155;
}

.role-tab.active {
  background: #ffffff;
  color: #2563eb;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.role-icon {
  font-size: 18px;
}

/* 表单字段 */
.form-field {
  margin-bottom: 20px;
}

.form-field :deep(.el-form-item__label) {
  color: #475569 !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  padding-bottom: 6px !important;
}

.form-field :deep(.el-input__wrapper) {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: none;
  padding: 6px 14px;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.form-field :deep(.el-input__wrapper:hover) {
  border-color: #cbd5e1;
  background: #ffffff;
}

.form-field :deep(.el-input__wrapper.is-focus) {
  border-color: #2563eb;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.form-field :deep(.el-input__inner) {
  font-size: 14px;
  color: #0f172a;
}

.form-field :deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 1px;
  margin-top: 8px;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none !important;
}

.submit-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
}

.submit-blue:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
}

.submit-orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.25);
}

.submit-orange:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(249, 115, 22, 0.35);
}

.submit-purple {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
}

.submit-purple:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.35);
}

/* 演示提示 */
.demo-tip {
  margin-top: 24px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%);
  border: 1px solid #fde68a;
  border-radius: 12px;
  font-size: 13px;
  color: #854d0e;
  text-align: center;
  line-height: 1.6;
}

.form-footer {
  text-align: center;
  margin-top: 28px;
  color: #94a3b8;
  font-size: 12px;
}

/* 响应式 */
@media (max-width: 900px) {
  .login-wrapper {
    grid-template-columns: 1fr;
    max-width: 480px;
  }

  .brand-side {
    padding: 40px 32px;
  }

  .form-side {
    padding: 40px 32px;
  }

  .brand-title {
    font-size: 28px;
  }

  .feature-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }

  .brand-side {
    padding: 32px 24px;
  }

  .form-side {
    padding: 32px 24px;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .form-title {
    font-size: 22px;
  }
}

/* 动画 */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes floatSlow {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(20px, -20px); }
}

@keyframes pulseSoft {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2); }
  50% { transform: scale(1.03); box-shadow: 0 0 0 12px rgba(255, 255, 255, 0); }
}
</style>
