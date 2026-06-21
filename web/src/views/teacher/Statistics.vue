<template>
  <div class="statistics">
    <div class="stats-row">
      <el-card shadow="hover" class="stat-item">
        <div class="stat-icon blue">📊</div>
        <div>
          <div class="stat-label">总发放积分</div>
          <div class="stat-value">{{ formatNum(totalPoints) }}</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-item">
        <div class="stat-icon orange">🎖️</div>
        <div>
          <div class="stat-label">总授予荣誉</div>
          <div class="stat-value">{{ formatNum(totalHonors) }}</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-item">
        <div class="stat-icon purple">🎁</div>
        <div>
          <div class="stat-label">总盲盒抽取</div>
          <div class="stat-value">{{ formatNum(totalDraws) }}</div>
        </div>
      </el-card>
      <el-card shadow="hover" class="stat-item">
        <div class="stat-icon green">👥</div>
        <div>
          <div class="stat-label">活跃学生数</div>
          <div class="stat-value">{{ activeStudents }}</div>
        </div>
      </el-card>
    </div>

    <div class="chart-row">
      <el-card shadow="hover" class="chart-card">
        <template #header>
          <span class="card-title">📈 近 30 天积分发放趋势</span>
        </template>
        <div ref="lineChartRef" class="chart" />
      </el-card>

      <el-card shadow="hover" class="chart-card">
        <template #header>
          <span class="card-title">🥧 积分类别占比</span>
        </template>
        <div ref="pieChartRef" class="chart" />
      </el-card>
    </div>

    <div class="chart-row">
      <el-card shadow="hover" class="chart-card full">
        <template #header>
          <span class="card-title">🎁 盲盒抽取统计</span>
        </template>
        <div ref="barChartRef" class="chart" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as echarts from 'echarts';

const lineChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);
const barChartRef = ref<HTMLDivElement | null>(null);

let lineChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;
let barChart: echarts.ECharts | null = null;

const totalPoints = ref(12480);
const totalHonors = ref(386);
const totalDraws = ref(224);
const activeStudents = ref(42);

const formatNum = (n: number) => n.toLocaleString('zh-CN');

const genTrendData = () => {
  const dates: string[] = [];
  const values: number[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 24 * 3600 * 1000);
    dates.push(`${d.getMonth() + 1}/${d.getDate()}`);
    values.push(Math.floor(200 + Math.random() * 800 + (i < 7 ? 200 : 0)));
  }
  return { dates, values };
};

const initCharts = () => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value);
    const { dates, values } = genTrendData();
    lineChart.setOption({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#409eff',
        textStyle: { color: '#303133' }
      },
      grid: { left: 50, right: 30, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#e4e7ed' } },
        axisLabel: { color: '#909399', fontSize: 11 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: '#f0f2f5' } },
        axisLabel: { color: '#909399' }
      },
      series: [
        {
          data: values,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#409eff', width: 3 },
          itemStyle: { color: '#409eff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64,158,255,0.35)' },
              { offset: 1, color: 'rgba(64,158,255,0.02)' }
            ])
          }
        }
      ]
    });
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value);
    pieChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} 积分 ({d}%)' },
      legend: {
        orient: 'vertical',
        right: 20,
        top: 'center',
        textStyle: { color: '#606266', fontSize: 13 }
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['38%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            color: '#606266',
            fontSize: 11
          },
          labelLine: { length: 8, length2: 8 },
          data: [
            { value: 4820, name: '课堂表现', itemStyle: { color: '#409eff' } },
            { value: 3260, name: '作业完成', itemStyle: { color: '#67c23a' } },
            { value: 2680, name: '考试成绩', itemStyle: { color: '#e6a23c' } },
            { value: 1420, name: '课外活动', itemStyle: { color: '#a855f7' } },
            { value: 300, name: '其他奖励', itemStyle: { color: '#f56c6c' } }
          ]
        }
      ]
    });
  }

  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value);
    const boxes = ['经典荣誉盲盒', '豪华盲盒', '新手盲盒', '秋日限定', '节日盲盒'];
    const data = [128, 64, 32, 45, 18];
    barChart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#a855f7',
        textStyle: { color: '#303133' }
      },
      grid: { left: 50, right: 40, top: 40, bottom: 60 },
      xAxis: {
        type: 'category',
        data: boxes,
        axisLine: { lineStyle: { color: '#e4e7ed' } },
        axisLabel: { color: '#606266', fontSize: 12, interval: 0 }
      },
      yAxis: {
        type: 'value',
        name: '抽取次数',
        nameTextStyle: { color: '#909399' },
        splitLine: { lineStyle: { color: '#f0f2f5' } },
        axisLabel: { color: '#909399' }
      },
      series: [
        {
          name: '抽取次数',
          type: 'bar',
          data,
          barWidth: 48,
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#a855f7' },
              { offset: 1, color: '#ec4899' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            color: '#606266',
            fontWeight: 600
          }
        }
      ]
    });
  }
};

const handleResize = () => {
  lineChart?.resize();
  pieChart?.resize();
  barChart?.resize();
};

onMounted(async () => {
  await nextTick();
  initCharts();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  lineChart?.dispose();
  pieChart?.dispose();
  barChart?.dispose();
});
</script>

<style scoped>
.statistics {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 12px;
  color: #fff;
}

.stat-icon.blue { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.stat-icon.orange { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.stat-icon.purple { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }
.stat-icon.green { background: linear-gradient(135deg, #34d399, #10b981); }

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.chart-row.full {
  grid-template-columns: 1fr;
}

.chart-card {
  border-radius: 10px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.chart {
  width: 100%;
  height: 360px;
}

@media (max-width: 1100px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .chart-row { grid-template-columns: 1fr; }
}
</style>
