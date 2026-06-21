<template>
  <div class="login-page">
    <!-- 顶部装饰 -->
    <div class="decor-top">
      <div class="cloud cloud-1">☁️</div>
      <div class="cloud cloud-2">☁️</div>
      <div class="cloud cloud-3">☁️</div>
      <div class="sun">☀️</div>
    </div>

    <!-- 左侧品牌区 -->
    <div class="brand-side">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-icon">🌱</div>
        </div>
        <h1 class="brand-title">成长陪伴</h1>
        <p class="brand-sub">Student Growth Companion</p>
        <div class="brand-slogan">陪伴每一步成长，见证每一次进步</div>
        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-icon">📚</span>
            <span>学习成长</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span>目标追踪</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏆</span>
            <span>成就激励</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">💬</span>
            <span>家校沟通</span>
          </div>
        </div>
        <div class="stars">
          <span class="star">⭐</span>
          <span class="star">🌟</span>
          <span class="star">✨</span>
          <span class="star">⭐</span>
          <span class="star">🌟</span>
        </div>
      </div>
    </div>

    <!-- 右侧登录区 -->
    <div class="login-side">
      <div class="login-card">
        <div class="card-header">
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-sub">选择你的身份，开启成长之旅</p>
        </div>

        <el-tabs v-model="activeRole" class="role-tabs">
          <el-tab-pane label="学生入口" name="student">
            <div class="role-badge student-badge">👨‍🎓</div>
            <el-form :model="studentForm" label-position="top" class="login-form">
              <el-form-item label="学号">
                <el-input
                  v-model="studentForm.studentId"
                  placeholder="请输入你的学号"
                  size="large"
                  :prefix-icon="User"
                />
              </el-form-item>
              <el-form-item label="班级验证码">
                <el-input
                  v-model="studentForm.classCode"
                  placeholder="老师下发的验证码"
                  size="large"
                  :prefix-icon="Key"
                  show-password
                />
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn student-btn"
                :loading="loading"
                @click="submitStudent"
              >
                <span>开始学习</span>
                <span class="btn-arrow">→</span>
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="教师入口" name="teacher">
            <div class="role-badge teacher-badge">👩‍🏫</div>
            <el-form :model="teacherForm" label-position="top" class="login-form">
              <el-form-item label="手机号">
                <el-input
                  v-model="teacherForm.phone"
                  placeholder="请输入手机号"
                  size="large"
                  :prefix-icon="Iphone"
                />
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="teacherForm.password"
                  placeholder="请输入密码"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn teacher-btn"
                :loading="loading"
                @click="submitTeacher"
              >
                <span>进入工作台</span>
                <span class="btn-arrow">→</span>
              </el-button>
            </el-form>
          </el-tab-pane>

          <el-tab-pane label="管理员" name="admin">
            <div class="role-badge admin-badge">👔</div>
            <el-form :model="adminForm" label-position="top" class="login-form">
              <el-form-item label="管理员账号">
                <el-input
                  v-model="adminForm.phone"
                  placeholder="请输入账号"
                  size="large"
                  :prefix-icon="Iphone"
                />
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="adminForm.password"
                  placeholder="请输入密码"
                  size="large"
                  :prefix-icon="Lock"
                  show-password
                />
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                class="login-btn admin-btn"
                :loading="loading"
                @click="submitAdmin"
              >
                <span>进入管理后台</span>
                <span class="btn-arrow">→</span>
              </el-button>
            </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="demo-hint">
          💡 演示模式：任意账号均可登录体验
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="decor-bottom">
      <div class="grass grass-1">🌿</div>
      <div class="grass grass-2">🌾</div>
      <div class="grass grass-3">🌱</div>
      <div class="grass grass-4">🌿</div>
      <div class="grass grass-5">🌾</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Key, Iphone, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const activeRole = ref('student');
const loading = ref(false);
const studentForm = ref({ studentId: '', classCode: '' });
const teacherForm = ref({ phone: '', password: '' });
const adminForm = ref({ phone: '', password: '' });

const doLogin = async (payload: any, role: string) => {
  loading.value = true;
  try {
    await auth.login(payload);
    ElMessage.success('登录成功');
    const target = role === 'teacher' ? '/teacher/dashboard' : role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    await router.push(target).catch((e) => {
      console.error('Navigation failed:', e);
      setTimeout(() => { window.location.hash = '#' + target; }, 300);
    });
  } catch (e: any) {
    ElMessage.error(e?.message || '登录失败，请检查输入');
  } finally {
    loading.value = false;
  }
};

const submitStudent = () => {
  if (!studentForm.value.studentId) return ElMessage.warning('请输入学号');
  if (!studentForm.value.classCode) return ElMessage.warning('请输入班级验证码');
  doLogin({ role: 'student', studentId: studentForm.value.studentId, classCode: studentForm.value.classCode }, 'student');
};

const submitTeacher = () => {
  if (!teacherForm.value.phone) return ElMessage.warning('请输入手机号');
  if (!teacherForm.value.password) return ElMessage.warning('请输入密码');
  doLogin({ role: 'teacher', phone: teacherForm.value.phone, password: teacherForm.value.password }, 'teacher');
};

const submitAdmin = () => {
  if (!adminForm.value.phone) return ElMessage.warning('请输入账号');
  if (!adminForm.value.password) return ElMessage.warning('请输入密码');
  doLogin({ role: 'admin', phone: adminForm.value.phone, password: adminForm.value.password }, 'admin');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 50%, #fef3c7 100%);
}

/* 顶部装饰 */
.decor-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  z-index: 0;
}
.cloud {
  position: absolute;
  font-size: 48px;
  opacity: 0.6;
}
.cloud-1 { top: 40px; left: 10%; animation: float 8s ease-in-out infinite; }
.cloud-2 { top: 80px; left: 30%; animation: float 10s ease-in-out infinite reverse; }
.cloud-3 { top: 60px; right: 15%; animation: float 12s ease-in-out infinite; }
.sun {
  position: absolute;
  top: 30px;
  right: 10%;
  font-size: 64px;
  animation: pulseGlow 4s ease-in-out infinite;
}

/* 左侧品牌区 */
.brand-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 40px;
}

.brand-content {
  max-width: 480px;
  animation: fadeSlideUp 0.8s ease-out both;
}

.brand-logo {
  text-align: center;
  margin-bottom: 24px;
}
.logo-icon {
  font-size: 100px;
  animation: bounceIn 0.8s ease-out;
}

.brand-title {
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #10b981, #059669, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  margin-bottom: 12px;
  letter-spacing: 4px;
}

.brand-sub {
  font-family: var(--font-display);
  font-size: 16px;
  color: #059669;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 24px;
}

.brand-slogan {
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(16, 185, 129, 0.15);
  font-size: 14px;
  color: #374151;
  transition: all 0.25s ease;
}
.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.15);
}
.feature-icon { font-size: 24px; }

.stars {
  display: flex;
  justify-content: center;
  gap: 8px;
}
.star {
  font-size: 20px;
  animation: float 2s ease-in-out infinite;
}
.star:nth-child(1) { animation-delay: 0s; }
.star:nth-child(2) { animation-delay: 0.2s; }
.star:nth-child(3) { animation-delay: 0.4s; }
.star:nth-child(4) { animation-delay: 0.6s; }
.star:nth-child(5) { animation-delay: 0.8s; }

/* 右侧登录区 */
.login-side {
  width: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(16, 185, 129, 0.06) inset;
  animation: fadeSlideUp 0.6s ease-out 0.2s both;
}

.card-header { text-align: center; margin-bottom: 28px; }
.login-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}
.login-sub { font-size: 13px; color: #6b7280; }

.role-tabs { margin-bottom: 20px; }
.role-tabs :deep(.el-tabs__header) { margin-bottom: 20px; }

.role-badge {
  font-size: 48px;
  text-align: center;
  margin-bottom: 20px;
  animation: bounceIn 0.5s ease-out;
}

.login-form :deep(.el-form-item__label) {
  color: #6b7280 !important;
  font-size: 13px;
  font-weight: 500;
  padding-bottom: 8px !important;
}

.login-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px !important;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  position: relative;
  overflow: hidden;
}

.student-btn {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border-color: transparent !important;
}
.student-btn:hover { box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4) !important; }

.teacher-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  border-color: transparent !important;
}
.teacher-btn:hover { box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important; }

.admin-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed) !important;
  border-color: transparent !important;
}
.admin-btn:hover { box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4) !important; }

.btn-arrow { font-size: 18px; transition: transform 0.25s; }
.login-btn:hover .btn-arrow { transform: translateX(4px); }

.demo-hint {
  text-align: center;
  font-size: 12px;
  color: rgba(16, 185, 129, 0.8);
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 8px;
  padding: 10px 16px;
  margin-top: 20px;
}

/* 底部装饰 */
.decor-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  pointer-events: none;
  z-index: 0;
}
.grass {
  position: absolute;
  font-size: 32px;
  bottom: 20px;
}
.grass-1 { left: 5%; }
.grass-2 { left: 15%; font-size: 28px; }
.grass-3 { left: 25%; font-size: 36px; }
.grass-4 { right: 15%; }
.grass-5 { right: 5%; font-size: 28px; }

@media (max-width: 900px) {
  .brand-side { display: none; }
  .login-side { width: 100%; flex: 1; }
  .login-card { max-width: 100%; }
}
</style>
