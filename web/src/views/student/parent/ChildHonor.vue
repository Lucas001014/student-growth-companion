<template>
  <div class="child-honor">
    <el-card class="summary-card" shadow="hover">
      <div class="summary-header">
        <img :src="childInfo.avatar || defaultAvatar" class="child-avatar" />
        <div class="summary-info">
          <h2 class="child-name">{{ childInfo.name }}</h2>
          <div class="child-meta">
            <el-tag type="primary" effect="plain">学号 {{ childInfo.studentId }}</el-tag>
            <el-tag type="success" effect="plain">{{ childInfo.className }}</el-tag>
          </div>
        </div>
        <div class="summary-points">
          <div class="points-num">{{ childInfo.points }}</div>
          <div class="points-label">当前积分</div>
        </div>
      </div>
      <div class="summary-stats">
        <div class="stat-item">
          <div class="stat-num">{{ skinCount }}</div>
          <div class="stat-label">皮肤数量</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">{{ titleCount }}</div>
          <div class="stat-label">称号数量</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num">{{ weekPoints }}</div>
          <div class="stat-label">本周获得</div>
        </div>
      </div>
    </el-card>

    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
        <span class="card-title">🎨 孩子获得的皮肤</span>
        <el-tag type="primary" effect="plain">共 {{ skins.length }} 个</el-tag>
        </div>
      </template>
      <div v-if="skins.length" class="skins-grid">
        <div v-for="skin in skins" :key="skin.id" class="skin-card">
          <div class="skin-cover" :class="'rarity-' + skin.rarity">
            <img :src="skin.cover || defaultSkin" :alt="skin.name" />
            <span class="rarity-tag">{{ skin.rarity }}</span>
          </div>
          <div class="skin-body">
            <div class="skin-name">{{ skin.name }}</div>
            <div class="skin-time">获得于 {{ skin.obtainedAt }}</div>
          </div>
        </div>
      </div>
      <el-empty v-else description="暂无皮肤" />
    </el-card>

    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">👑 孩子获得的称号</span>
          <el-tag type="warning" effect="plain">共 {{ titles.length }} 个</el-tag>
        </div>
      </template>
      <div v-if="titles.length" class="titles-grid">
        <div v-for="title in titles" :key="title.id" class="title-card">
          <div class="title-icon">{{ title.current ? '👑' : '🎖️' }}</div>
          <div class="title-name">{{ title.name }}</div>
          <div class="title-desc">{{ title.description }}</div>
          <el-tag size="small" :type="title.current ? 'warning' : 'info'" effect="plain">
            {{ title.current ? '当前称号' : title.obtainedAt }}
          </el-tag>
        </div>
      </div>
      <el-empty v-else description="暂无称号" />
    </el-card>

    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">💎 积分明细</span>
        </div>
      </template>
      <el-table :data="pointsLog" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="170" />
        <el-table-column label="变动" width="110">
          <template #default="{ row }">
            <span :class="row.change > 0 ? 'change-positive' : 'change-negative'">
              {{ row.change > 0 ? '+' : '' }}{{ row.change }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="来源" width="140">
          <template #default="{ row }">
            <el-tag size="small" :type="categoryType(row.category)" effect="plain">
              {{ row.category }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="balance" label="余额" width="100" align="right" />
      </el-table>
      <el-empty v-if="!pointsLog.length" description="暂无积分记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';

const auth = useAuthStore();
const defaultAvatar = 'https://via.placeholder.com/120?text=U';
const defaultSkin = 'https://via.placeholder.com/300x200?text=Skin';

const childInfo = ref({
  name: auth.user?.name || auth.user?.username || '同学',
  studentId: auth.user?.studentId || '20250001',
  className: auth.user?.className || '三年级(1)班',
  avatar: auth.user?.avatar || '',
  points: auth.user?.points ?? 0
});

const skinCount = ref(auth.user?.skinCount ?? 4);
const titleCount = ref(auth.user?.titleCount ?? 2);
const weekPoints = ref(42);

const skins = ref<any[]>([]);
const titles = ref<any[]>([]);
const pointsLog = ref<any[]>([]);

const categoryType = (cat: string) => {
  if (cat.includes('作业') || cat.includes('课堂') || cat.includes('奖励')) return 'success';
  if (cat.includes('消耗') || cat.includes('盲盒')) return 'warning';
  return 'info';
};

onMounted(() => {
  if (!skins.value.length) {
    skins.value = [
      { id: 1, name: '森林守护者', rarity: 'SSR', cover: '', obtainedAt: '2025-06-10' },
      { id: 2, name: '星空探险家', rarity: 'SR', cover: '', obtainedAt: '2025-06-05' },
      { id: 3, name: '海洋之心', rarity: 'R', cover: '', obtainedAt: '2025-05-20' },
      { id: 4, name: '学习达人', rarity: 'N', cover: '', obtainedAt: '2025-05-10' }
    ];
    titles.value = [
      { id: 1, name: '学习之星', description: '月度学习积极分子', current: true, obtainedAt: '2025-06-01' },
      { id: 2, name: '进步奖', description: '成绩进步最大', current: false, obtainedAt: '2025-05-15' }
    ];
    pointsLog.value = [
      { time: '2025-06-20 09:30', change: 10, category: '课堂奖励', remark: '课堂表现优秀', balance: 480 },
      { time: '2025-06-19 15:20', change: 20, category: '称号奖励', remark: '获得称号奖励', balance: 470 },
      { time: '2025-06-18 10:00', change: -30, category: '盲盒消耗', remark: '抽取盲盒', balance: 450 },
      { time: '2025-06-17 14:30', change: 15, category: '作业奖励', remark: '家长确认作业', balance: 480 },
      { time: '2025-06-15 09:00', change: 5, category: '课堂奖励', remark: '主动回答问题', balance: 465 }
    ];
    childInfo.value.points = auth.user?.points ?? 480;
  }
});
</script>

<style scoped>
.child-honor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-card {
  border-radius: 12px;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%);
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.child-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.summary-info {
  flex: 1;
  min-width: 0;
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
  flex-wrap: wrap;
}

.summary-points {
  text-align: center;
  padding: 16px 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
}

.points-num {
  font-size: 28px;
  font-weight: 700;
  color: #d97706;
  line-height: 1;
}

.points-label {
  font-size: 12px;
  color: #92400e;
  margin-top: 4px;
}

.summary-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e4e7ed;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-num {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e4e7ed;
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

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.skin-card {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: all 0.2s;
}

.skin-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skin-cover {
  position: relative;
  height: 120px;
  background: #f0f2f5;
}

.skin-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rarity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.92);
  color: #303133;
}

.rarity-SSR .rarity-tag { color: #f56c6c; }
.rarity-SR .rarity-tag { color: #e6a23c; }
.rarity-R .rarity-tag { color: #409eff; }
.rarity-N .rarity-tag { color: #909399; }

.skin-body {
  padding: 12px;
}

.skin-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.skin-time {
  font-size: 11px;
  color: #909399;
}

.titles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.title-card {
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  transition: all 0.2s;
}

.title-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.title-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.title-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.title-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}

.change-positive {
  color: #67c23a;
  font-weight: 600;
}

.change-negative {
  color: #f56c6c;
  font-weight: 600;
}
</style>
