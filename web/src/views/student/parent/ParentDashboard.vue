<template>
  <div class="parent-dashboard">
    <el-card class="child-info-card" shadow="hover">
      <div class="child-profile">
        <img :src="childInfo.avatar || defaultAvatar" class="child-avatar" />
        <div class="child-details">
          <h2 class="child-name">{{ childInfo.name }}</h2>
          <div class="child-meta">
            <el-tag type="primary" effect="plain">学号 {{ childInfo.studentId }}</el-tag>
            <el-tag type="success" effect="plain">{{ childInfo.className }}</el-tag>
          </div>
          <div class="points-summary">
            <span class="points-label">当前积分：</span>
            <span class="points-value">💎 {{ childInfo.points }}</span>
          </div>
        </div>
        <div class="points-big-box">
          <div class="points-big-num">{{ childInfo.points }}</div>
          <div class="points-big-label">积分</div>
        </div>
      </div>
    </el-card>

    <div class="entry-grid">
      <el-card shadow="hover" class="entry-card" @click="go('/parent/confirm')">
        <div class="entry-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          📝
        </div>
        <div class="entry-title">确认作业</div>
        <div class="entry-desc">确认孩子的作业完成情况</div>
        <div class="entry-count">
          <el-tag type="warning" size="small" effect="plain">本周 {{ confirmCount }} 条</el-tag>
        </div>
      </el-card>

      <el-card shadow="hover" class="entry-card" @click="go('/parent/upload')">
        <div class="entry-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          📤
        </div>
        <div class="entry-title">上传选择题</div>
        <div class="entry-desc">上传孩子完成的选择题作业</div>
        <div class="entry-count">
          <el-tag type="primary" size="small" effect="plain">已上传 {{ uploadCount }} 份</el-tag>
        </div>
      </el-card>

      <el-card shadow="hover" class="entry-card" @click="go('/parent/child-honor')">
        <div class="entry-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          🏆
        </div>
        <div class="entry-title">孩子荣誉</div>
        <div class="entry-desc">查看孩子的皮肤、称号和积分明细</div>
        <div class="entry-count">
          <el-tag type="success" size="small" effect="plain">{{ skinCount }} 皮肤 / {{ titleCount }} 称号</el-tag>
        </div>
      </el-card>

      <el-card shadow="hover" class="entry-card" @click="go('/parent/history')">
        <div class="entry-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
          📋
        </div>
        <div class="entry-title">确认历史</div>
        <div class="entry-desc">查看历史作业确认记录及状态</div>
        <div class="entry-count">
          <el-tag type="info" size="small" effect="plain">共 {{ historyCount }} 条</el-tag>
        </div>
      </el-card>
    </div>

    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📊 最近动态</span>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(item, idx) in recentActivities"
          :key="idx"
          :timestamp="item.time"
          :type="item.type"
        >
          {{ item.text }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const auth = useAuthStore();
const defaultAvatar = 'https://via.placeholder.com/120?text=U';

const childInfo = ref({
  name: auth.user?.name || auth.user?.username || '同学',
  studentId: auth.user?.studentId || '20250001',
  className: auth.user?.className || '三年级(1)班',
  avatar: auth.user?.avatar || '',
  points: auth.user?.points ?? 0
});

const confirmCount = ref(3);
const uploadCount = ref(5);
const skinCount = ref(auth.user?.skinCount ?? 4);
const titleCount = ref(auth.user?.titleCount ?? 2);
const historyCount = ref(12);

const recentActivities = ref([
  { time: '今天 09:30', text: '孩子获得 +10 积分（课堂表现）', type: 'success' },
  { time: '昨天 18:20', text: '您提交的作业确认已通过审批', type: 'primary' },
  { time: '3 天前', text: '孩子获得「学习之星」称号', type: 'warning' },
  { time: '5 天前', text: '您上传了一份数学选择题作业', type: 'info' }
]);

const go = (path: string) => router.push(path);

onMounted(() => {
  childInfo.value.points = auth.user?.points ?? childInfo.value.points;
});
</script>

<style scoped>
.parent-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.child-info-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #e0e7ff 0%, #ffffff 60%);
}

.child-profile {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.child-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.child-details {
  flex: 1;
  min-width: 200px;
}

.child-name {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 10px 0;
}

.child-meta {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.points-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.points-label {
  font-size: 13px;
  color: #909399;
}

.points-value {
  font-size: 15px;
  font-weight: 600;
  color: #e6a23c;
}

.points-big-box {
  text-align: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
}

.points-big-num {
  font-size: 32px;
  font-weight: 700;
  color: #d97706;
  line-height: 1;
}

.points-big-label {
  font-size: 12px;
  color: #92400e;
  margin-top: 4px;
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.entry-card {
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.entry-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.entry-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #fff;
  margin: 0 auto 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.entry-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.entry-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
}

.entry-count {
  display: flex;
  justify-content: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

@media (max-width: 768px) {
  .entry-grid {
    grid-template-columns: 1fr;
  }
}
</style>
