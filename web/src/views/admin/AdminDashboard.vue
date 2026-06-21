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
            <span class="chart-title">📊 各班级积分对比</span>
            <div class="chart-pills">
              <span class="pill active">积分</span>
              <span class="pill">荣誉</span>
            </div>
          </div>
        </template>
        <div ref="barChartRef" class="chart" />
      </el-card>
    </div>

    <!-- 底部统计 -->
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

      <el-card class="hot-card" shadow="never">
        <template #header>
          <span class="chart-title">🔥 热门皮肤 TOP 5</span>
        </template>
        <div class="hot-list">
          <div v-for="(item, idx) in hotSkins" :key="item.name" class="hot-item">
            <span class="hot-rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
            <div class="hot-info">
              <span class="hot-name">{{ item.name }}</span>
              <span class="hot-desc">{{ item.desc }}</span>
            </div>
            <span class="hot-rarity" :class="'rarity-' + item.rarity">{{ item.rarity }}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';
import { getDashboard } from '../../api/admin';

const lineChartRef = ref<HTMLDivElement | null>(null);
const barChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);

let lineChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

const stats = ref([
  { title: '班级总数', value: 0, icon: '🏫', gradient: 'linear-gradient(135deg, rgba(0,245,212,0.2), rgba(0,245,212,0.05))', trend: '+2 本月', sub: '活跃班级', valueColor: '#00f5d4' },
  { title: '教师人数', value: 0, icon: '👨‍🏫', gradient: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.05))', trend: '+3 本月', sub: '任课教师', valueColor: '#fbbf24' },
  { title: '学生总数', value: 0, icon: '👥', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))', trend: '+24 本月', sub: '注册学生', valueColor: '#a78bfa' },
  { title: '家长绑定率', value: '0%', icon: '👨‍👩‍👧', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))', trend: '+5%', sub: '绑定率', valueColor: '#10b981' },
  { title: '荣誉发放', value: 0, icon: '🎖️', gradient: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))', trend: '+52 本周', sub: '累计发放', valueColor: '#ef4444' },
  { title: '盲盒抽取', value: 0, icon: '🎁', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.03))', trend: '+180 今日', sub: '总抽取次数', valueColor: '#f59e0b' }
]);

const rarityDist = ref([
  { name: 'SSR', count: 8, color: '#ff2d55' },
  { name: 'SR', count: 24, color: '#ff9f0a' },
  { name: 'R', count: 48, color: '#0a84ff' },
  { name: 'N', count: 48, color: '#8e8e93' }
]);

const hotSkins = ref([
  { name: '星空探险家', desc: '最受欢迎的 SR 皮肤', rarity: 'SR' },
  { name: '森林守护者', desc: '传说级 SSR 皮肤', rarity: 'SSR' },
  { name: '海洋之心', desc: '经典 R 级皮肤', rarity: 'R' },
  { name: '学习达人', desc: '人手一件 N 级', rarity: 'N' },
  { name: '火焰战士', desc: '高人气 SR 皮肤', rarity: 'SR' }
]);

const genTrendData = () => {
  const dates: string[] = [];
  const values: number[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
    values.push(Math.floor(40 + Math.random() * 160 + (i < 7 ? 40 : 0)));
  }
  return { dates, values };
};

const genClassData = () => {
  const classes = ['一年级1班', '一年级2班', '二年级1班', '二年级2班', '三年级1班', '三年级2班'];
  const points = classes.map(() => Math.floor(800 + Math.random() * 1800));
  return { classes, points };
};

const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    const { dates, values } = genTrendData();
    lineChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(10,14,26,0.95)',
        borderColor: 'rgba(0,245,212,0.3)',
        textStyle: { color: '#e2e8f0' }
      },
      grid: { left: 50, right: 30, top: 20, bottom: 40 },
      xAxis: {
        type: 'category',
        data: dates,
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
    const { classes, points } = genClassData();
    barChart.setOption({
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(10,14,26,0.95)', borderColor: 'rgba(123,44,247,0.3)',
        textStyle: { color: '#e2e8f0' }
      },
      grid: { left: 60, right: 30, top: 20, bottom: 60 },
      xAxis: {
        type: 'category', data: classes,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        axisLabel: { color: '#4a5568', fontSize: 12, interval: 0 }
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
    const res = await getDashboard().catch(() => null);
    if (res && (res as any).data) {
      const d = (res as any).data;
      stats.value[0].value = d.classCount ?? 12;
      stats.value[1].value = d.teacherCount ?? 8;
      stats.value[2].value = d.studentCount ?? 420;
      stats.value[3].value = `${d.parentBindRate ?? 68}%`;
      stats.value[4].value = d.honorTotal ?? 2480;
      stats.value[5].value = d.drawTotal ?? 680;
    } else {
      stats.value[0].value = 12;
      stats.value[1].value = 8;
      stats.value[2].value = 420;
      stats.value[3].value = '68%';
      stats.value[4].value = 2480;
      stats.value[5].value = 680;
    }
  } catch {
    stats.value[0].value = 12;
    stats.value[1].value = 8;
    stats.value[2].value = 420;
    stats.value[3].value = '68%';
    stats.value[4].value = 2480;
    stats.value[5].value = 680;
  }
};

onMounted(async () => {
  await loadData();
  await nextTick();
  initCharts();
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

/* 热门排行 */
.hot-card { border-radius: 16px !important; }
.hot-list { display: flex; flex-direction: column; gap: 0; }
.hot-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.2s;
}
.hot-item:last-child { border-bottom: none; }
.hot-item:hover { background: rgba(255,255,255,0.02); border-radius: 8px; padding-left: 8px; }
.hot-rank {
  width: 24px; height: 24px;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}
.rank-1 { background: rgba(255,45,85,0.2); color: #ff2d55; }
.rank-2 { background: rgba(255,159,10,0.2); color: #ff9f0a; }
.rank-3 { background: rgba(10,132,255,0.2); color: #0a84ff; }
.rank-4, .rank-5 { background: rgba(142,142,147,0.15); color: #8e8e93; }
.hot-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.hot-name { font-size: 13px; font-weight: 600; color: #c8d6e5; }
.hot-desc { font-size: 11px; color: #475569; }
.hot-rarity {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}
.rarity-SSR { background: rgba(255,45,85,0.15); color: #ff2d55; border: 1px solid rgba(255,45,85,0.3); }
.rarity-SR { background: rgba(255,159,10,0.15); color: #ff9f0a; border: 1px solid rgba(255,159,10,0.3); }
.rarity-R { background: rgba(10,132,255,0.15); color: #0a84ff; border: 1px solid rgba(10,132,255,0.3); }
.rarity-N { background: rgba(142,142,147,0.1); color: #8e8e93; border: 1px solid rgba(142,142,147,0.2); }

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
