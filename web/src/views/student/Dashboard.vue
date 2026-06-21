<template>
  <div class="dashboard">
    <!-- 顶部数据统计 -->
    <div class="stats-row">
      <div
        v-for="(stat, idx) in stats"
        :key="stat.title"
        class="stat-card"
        :class="'stat-' + idx"
        :style="{ animationDelay: (idx * 0.08) + 's' }"
      >
        <div class="stat-bg-glow" :style="{ background: stat.gradient }" />
        <div class="stat-icon-wrap">
          <span class="stat-icon">{{ stat.icon }}</span>
        </div>
        <div class="stat-body">
          <div class="stat-label">{{ stat.title }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-sub" v-if="stat.sub">{{ stat.sub }}</div>
        </div>
        <div class="stat-trend" v-if="stat.trend">
          <span class="trend-arrow">↑</span>
          <span class="trend-text">{{ stat.trend }}</span>
        </div>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="chart-header">
            <span class="chart-title">📈 学生活跃趋势（近 30 天）</span>
            <div class="chart-pills">
              <span class="pill active">日活</span>
              <span class="pill">周活</span>
            </div>
          </div>
        </template>
        <div ref="lineChartRef" class="chart" />
      </el-card>

      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="chart-header">
            <span class="chart-title">🏆 各班级积分排行</span>
            <div class="chart-pills">
              <span class="pill active">积分</span>
              <span class="pill">荣誉</span>
            </div>
          </div>
        </template>
        <div ref="barChartRef" class="chart" />
      </el-card>
    </div>

    <!-- 稀有度分布 + 最近动态 -->
    <div class="bottom-row">
      <el-card class="rarity-card" shadow="never">
        <template #header>
          <span class="chart-title">🎨 皮肤稀有度分布</span>
        </template>
        <div ref="pieChartRef" class="chart-pie" />
        <div class="rarity-legend">
          <div class="legend-item" v-for="item in rarityDist" :key="item.name">
            <span class="legend-dot" :style="{ background: item.color }" />
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-count">{{ item.count }} 件</span>
          </div>
        </div>
      </el-card>

      <el-card class="activity-card" shadow="never">
        <template #header>
          <span class="chart-title">📜 最新荣誉动态</span>
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
              <div class="activity-meta">
                <span class="activity-student">{{ item.student }}</span>
                <span class="activity-time">{{ item.time }}</span>
              </div>
            </div>
            <div class="activity-points" v-if="item.points">+{{ item.points }}</div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const lineChartRef = ref<HTMLDivElement | null>(null);
const barChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);
let lineChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

const stats = ref([
  { title: '班级总数', value: 12, icon: '🏫', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.05))', trend: '+2 本月', sub: '活跃班级' },
  { title: '教师人数', value: 18, icon: '👨‍🏫', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))', trend: '+3 本月', sub: '任课教师' },
  { title: '学生总数', value: 486, icon: '👥', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', trend: '+24 本月', sub: '注册学生' },
  { title: '皮肤总数', value: 128, icon: '🎨', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', trend: '+15 本周', sub: '已激活' },
  { title: '盲盒抽取', value: '3.2k', icon: '🎁', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))', trend: '+180 今日', sub: '总抽取次数' },
  { title: '荣誉发放', value: '1.8k', icon: '🎖️', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))', trend: '+52 本周', sub: '累计发放' }
]);

const rarityDist = ref([
  { name: 'SSR', count: 8, color: '#ff2d55' },
  { name: 'SR', count: 24, color: '#ff9f0a' },
  { name: 'R', count: 48, color: '#0a84ff' },
  { name: 'N', count: 48, color: '#8e8e93' }
]);

const recentActivities = ref([
  { text: '张小明 获得「学习之星」称号', student: '三年级(1)班', time: '2 分钟前', type: 'success', points: '' },
  { text: '李思思 抽取到 SSR 皮肤「星空战士」', student: '三年级(1)班', time: '8 分钟前', type: 'warning', points: '' },
  { text: '王大力 获得积分 +15（课堂表现优秀）', student: '三年级(1)班', time: '20 分钟前', type: 'primary', points: '15' },
  { text: '赵小雨 申请佩戴「冰雪女王」皮肤', student: '三年级(2)班', time: '45 分钟前', type: 'info', points: '' },
  { text: '钱朵朵 确认数学作业上传', student: '三年级(2)班', time: '1 小时前', type: 'success', points: '' }
]);

const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    const dates: string[] = [];
    const values: number[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
      dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
      values.push(Math.floor(40 + Math.random() * 160 + (i < 7 ? 40 : 0)));
    }
    lineChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(0,245,212,0.3)',
        textStyle: { color: '#e2e8f0' }
      },
      grid: { left: 50, right: 30, top: 20, bottom: 40 },
      xAxis: {
        type: 'category', data: dates,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: { color: '#4a5568', fontSize: 11 }
      },
      yAxis: {
        type: 'value', name: '活跃人数', nameTextStyle: { color: '#4a5568' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
        axisLabel: { color: '#4a5568' }
      },
      series: [{
        data: values, type: 'line', smooth: true, symbol: 'circle', symbolSize: 5,
        lineStyle: { color: '#00f5d4', width: 2.5 },
        itemStyle: { color: '#00f5d4' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,245,212,0.25)' },
            { offset: 1, color: 'rgba(0,245,212,0.01)' }
          ])
        }
      }]
    });
  }

  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value);
    const classes = ['一(1)', '一(2)', '二(1)', '二(2)', '三(1)', '三(2)'];
    const points = [2400, 1980, 3150, 2800, 3600, 3200];
    barChart.setOption({
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(10,14,26,0.95)', borderColor: 'rgba(123,44,247,0.3)',
        textStyle: { color: '#e2e8f0' }
      },
      grid: { left: 60, right: 30, top: 20, bottom: 50 },
      xAxis: {
        type: 'category', data: classes,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: { color: '#4a5568', fontSize: 12 }
      },
      yAxis: {
        type: 'value', name: '积分总量', nameTextStyle: { color: '#4a5568' },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
        axisLabel: { color: '#4a5568' }
      },
      series: [{
        name: '积分', type: 'bar', data: points, barWidth: 36,
        itemStyle: {
          borderRadius: [6, 6, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#7b2ff7' },
            { offset: 1, color: '#00f5d4' }
          ])
        },
        label: { show: true, position: 'top', color: '#64748b', fontWeight: 600 }
      }]
    });
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: {
        backgroundColor: 'rgba(10,14,26,0.95)', borderColor: 'rgba(0,245,212,0.3)',
        textStyle: { color: '#e2e8f0' }
      },
      series: [{
        type: 'pie', radius: ['50%', '75%'], center: ['50%', '50%'],
        data: [
          { value: 8, name: 'SSR', itemStyle: { color: '#ff2d55' } },
          { value: 24, name: 'SR', itemStyle: { color: '#ff9f0a' } },
          { value: 48, name: 'R', itemStyle: { color: '#0a84ff' } },
          { value: 48, name: 'N', itemStyle: { color: '#8e8e93' } }
        ],
        label: { color: '#64748b', fontSize: 12 },
        labelLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
      }]
    });
  }
};

const handleResize = () => {
  lineChart?.resize(); barChart?.resize(); pieChart?.resize();
};

const loadData = async () => {
  try {
    const api = await import('../../api/admin').catch(() => null);
    if (api) {
      const res = await api.getDashboard().catch(() => null);
      if (res && res.data) {
        const d = res.data;
        stats.value[0].value = d.classCount ?? 12;
        stats.value[1].value = d.teacherCount ?? 18;
        stats.value[2].value = d.studentCount ?? 486;
      }
    }
  } catch { /* use mock data */ }
};

onMounted(async () => {
  await loadData();
  setTimeout(() => { initCharts(); }, 100);
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose(); barChart?.dispose(); pieChart?.dispose();
});
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* 统计卡片 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
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
  border-color: rgba(0,245,212,0.2);
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
.stat-icon-wrap {
  margin-bottom: 12px;
}
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

/* 图表行 */
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-card {
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
  background: rgba(0,245,212,0.12);
  color: #00f5d4;
}
.chart { width: 100%; height: 280px; }
.chart-pie { width: 100%; height: 180px; }

/* 稀有度分布 */
.rarity-card { border-radius: 16px !important; }
.rarity-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.legend-item { display: flex; align-items: center; gap: 8px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-name { flex: 1; font-size: 13px; color: #94a3b8; }
.legend-count { font-size: 12px; color: #475569; }

/* 活动列表 */
.activity-card { border-radius: 16px !important; }
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
.dot-warning { background: #f59e0b; box-shadow: 0 0 8px rgba(245,158,11,0.5); }
.dot-primary { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,0.5); }
.dot-info { background: #64748b; }
.dot-danger { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,0.5); }
.activity-body { flex: 1; }
.activity-text { font-size: 13px; color: #c8d6e5; margin-bottom: 4px; line-height: 1.4; }
.activity-meta { display: flex; gap: 12px; }
.activity-student { font-size: 11px; color: #4a5568; }
.activity-time { font-size: 11px; color: #334155; }
.activity-points {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: #f59e0b;
  flex-shrink: 0;
}

/* 底部行 */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* 响应式 */
@media (max-width: 1400px) { .stats-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1100px) { .stats-row { grid-template-columns: repeat(2, 1fr); } .chart-row { grid-template-columns: 1fr; } .bottom-row { grid-template-columns: 1fr; } }
</style>
