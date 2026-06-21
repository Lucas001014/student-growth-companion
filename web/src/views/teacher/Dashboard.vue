<template>
  <div class="dashboard">
    <!-- 顶部数据统计 -->
    <div class="stats-row">
      <div
        v-for="(stat, idx) in stats"
        :key="stat.title"
        class="stat-card"
        :style="{ animationDelay: (idx * 0.08) + 's' }"
      >
        <div class="stat-bg-glow" :style="{ background: stat.gradient }" />
        <div class="stat-icon-wrap">
          <span class="stat-icon">{{ stat.icon }}</span>
        </div>
        <div class="stat-body">
          <div class="stat-label">{{ stat.title }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sub">{{ stat.sub }}</div>
        </div>
        <div class="stat-trend" v-if="stat.trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-text">{{ stat.trend }}</span>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="content-row">
      <!-- 班级排行榜 -->
      <el-card class="ranking-card" shadow="never">
        <template #header>
          <div class="chart-header">
            <span class="chart-title">🏆 班级积分排行榜 Top 10</span>
            <div class="chart-pills">
              <span class="pill active">积分</span>
              <span class="pill">荣誉</span>
            </div>
          </div>
        </template>
        <RankingList :data="rankingData" />
      </el-card>

      <!-- 快捷操作 + 最近动态 -->
      <div class="right-column">
        <el-card class="action-card" shadow="never">
          <template #header>
            <span class="chart-title">⚡ 快捷操作</span>
          </template>
          <div class="action-grid">
            <button class="action-btn" @click="go('/teacher/honor')">
              <span class="action-icon">🎖️</span>
              <span class="action-label">发放积分</span>
            </button>
            <button class="action-btn" @click="go('/teacher/honor')">
              <span class="action-icon">🎨</span>
              <span class="action-label">授予皮肤</span>
            </button>
            <button class="action-btn warning-btn" @click="go('/teacher/approvals')">
              <span class="action-icon">📋</span>
              <span class="action-label">审批申请</span>
            </button>
            <button class="action-btn danger-btn" @click="go('/teacher/blindbox')">
              <span class="action-icon">🎁</span>
              <span class="action-label">创建盲盒</span>
            </button>
          </div>
        </el-card>

        <el-card class="activity-card" shadow="never">
          <template #header>
            <span class="chart-title">📌 最近动态</span>
          </template>
          <div class="activity-list">
            <div
              v-for="(item, idx) in recentActivities"
              :key="idx"
              class="activity-item"
              :style="{ animationDelay: (idx * 0.1) + 's' }"
            >
              <div class="activity-dot" :class="'dot-' + item.type" />
              <div class="activity-body">
                <div class="activity-text">{{ item.text }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import RankingList from '../../components/RankingList.vue';
import { getClassRanking } from '../../api/ranking';
import { getDashboard } from '../../api/admin';

const router = useRouter();

const stats = ref([
  { title: '学生总数', value: 0, icon: '👥', gradient: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.05))', trend: '+2 本月', sub: '注册学生', valueColor: '#60a5fa' },
  { title: '今日待审批', value: 0, icon: '📋', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', trend: '+5 今日', sub: '待处理', valueColor: '#fbbf24' },
  { title: '本周荣誉发放', value: 0, icon: '🎖️', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', trend: '+18 本周', sub: '累计发放', valueColor: '#10b981' },
  { title: '班级积分均值', value: 0, icon: '💎', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', trend: '+1.2%', sub: '均值', valueColor: '#a78bfa' }
]);

const rankingData = ref<any[]>([]);

const recentActivities = ref([
  { time: '10 分钟前', text: '张小明 获得了「学习之星」称号', type: 'success' },
  { time: '30 分钟前', text: '李思思 申请兑换「海洋之心」皮肤', type: 'warning' },
  { time: '1 小时前', text: '王大力 抽取了一次盲盒', type: 'primary' },
  { time: '2 小时前', text: '班级发布了新公告', type: 'info' }
]);

const go = (path: string) => router.push(path);

const loadData = async () => {
  try {
    const [dashRes, rankRes] = await Promise.all([
      getDashboard().catch(() => null),
      getClassRanking({ limit: 10 }).catch(() => null)
    ]);

    if (dashRes && (dashRes as any).data) {
      const d = (dashRes as any).data;
      stats.value[0].value = d.studentCount ?? 42;
      stats.value[1].value = d.pendingCount ?? 5;
      stats.value[2].value = d.honorCount ?? 128;
      stats.value[3].value = d.avgPoints ?? 256;
    } else {
      stats.value[0].value = 42;
      stats.value[1].value = 5;
      stats.value[2].value = 128;
      stats.value[3].value = 256;
    }

    if (rankRes && (rankRes as any).data?.length) {
      rankingData.value = (rankRes as any).data.map((it: any) => ({
        id: it.id,
        name: it.name,
        avatar: it.avatar,
        points: it.points,
        skinCount: it.skinCount ?? Math.floor(Math.random() * 6),
        titleCount: it.titleCount ?? Math.floor(Math.random() * 4),
        badges: (it.badges || []).slice(0, 3)
      }));
    } else {
      rankingData.value = Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        name: ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆', '郑朗朗', '冯高高'][i],
        points: 980 - i * 42 - Math.floor(Math.random() * 20),
        skinCount: Math.floor(Math.random() * 6),
        titleCount: Math.floor(Math.random() * 4),
        badges: [
          { text: '学习之星', type: 'success' },
          { text: '小组长', type: 'primary' },
          { text: '进步奖', type: 'warning' }
        ].slice(0, Math.floor(Math.random() * 3) + 1)
      }));
    }
  } catch {
    stats.value[0].value = 42;
    stats.value[1].value = 5;
    stats.value[2].value = 128;
    stats.value[3].value = 256;
  }
};

onMounted(loadData);
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.stat-card {
  position: relative;
  padding: 20px 16px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  animation: fadeSlideUp 0.5s ease-out both;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: default;
}
.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(96,165,250,0.2);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}
.stat-bg-glow {
  position: absolute;
  top: -30px; right: -30px;
  width: 100px; height: 100px;
  border-radius: 50%;
  opacity: 0.6;
  filter: blur(20px);
}
.stat-icon-wrap { margin-bottom: 12px; }
.stat-icon { font-size: 32px; }
.stat-label {
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 1;
  margin-bottom: 4px;
}
.stat-sub { font-size: 11px; color: #334155; }
.stat-trend {
  position: absolute;
  top: 16px; right: 14px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
}
.trend-arrow { color: #10b981; font-weight: 700; }
.trend-text { color: #10b981; }

/* 内容区 */
.content-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
}
.right-column { display: flex; flex-direction: column; gap: 16px; }

.ranking-card, .action-card, .activity-card {
  border-radius: 16px !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-title { font-size: 14px; font-weight: 600; color: #94a3b8; }
.chart-pills { display: flex; gap: 8px; }
.pill {
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 11px;
  background: rgba(255,255,255,0.04);
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}
.pill.active {
  background: rgba(96,165,250,0.12);
  color: #60a5fa;
}

/* 快捷操作 */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(15,23,42,0.6);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: inherit;
}
.action-btn:hover {
  transform: translateY(-2px);
  background: rgba(96,165,250,0.08);
  border-color: rgba(96,165,250,0.2);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.action-icon { font-size: 28px; }
.action-label { font-size: 13px; font-weight: 500; color: #94a3b8; }
.warning-btn:hover { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.2); }
.danger-btn:hover { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); }

/* 活动列表 */
.activity-list { display: flex; flex-direction: column; gap: 0; }
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  animation: fadeSlideUp 0.4s ease-out both;
  transition: background 0.2s;
}
.activity-item:last-child { border-bottom: none; }
.activity-item:hover { background: rgba(255,255,255,0.02); border-radius: 8px; padding-left: 8px; }
.activity-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 5px;
}
.dot-success { background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.5); }
.dot-warning { background: #fbbf24; box-shadow: 0 0 8px rgba(251,191,36,0.5); }
.dot-primary { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,0.5); }
.dot-info { background: #64748b; }
.dot-danger { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
.activity-body { flex: 1; }
.activity-text { font-size: 13px; color: #c8d6e5; margin-bottom: 4px; line-height: 1.4; }
.activity-time { font-size: 11px; color: #334155; }

/* 响应式 */
@media (max-width: 1100px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .content-row { grid-template-columns: 1fr; }
}
</style>
