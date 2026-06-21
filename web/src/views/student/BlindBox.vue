<template>
  <div class="blind-box-page">
    <!-- 顶部积分显示 -->
    <div class="top-bar">
      <div class="points-chip">
        <span class="points-icon">💎</span>
        <span class="points-value">{{ currentPoints }}</span>
        <span class="points-label">可用积分</span>
      </div>
      <div class="total-draws">
        <span>🎁 累计抽取</span>
        <span class="draw-count">248 次</span>
      </div>
    </div>

    <!-- 盲盒选择区 -->
    <div class="boxes-grid">
      <div
        v-for="(box, idx) in boxes"
        :key="box.id"
        class="box-card"
        :class="'theme-' + box.theme"
        :style="{ animationDelay: (idx * 0.12) + 's' }"
      >
        <!-- 盒子图标区 -->
        <div class="box-header" :class="'header-' + box.theme">
          <div class="box-glow" :class="'glow-' + box.theme" />
          <div class="box-icon-wrap">
            <span class="box-icon">{{ box.icon }}</span>
          </div>
          <div class="theme-badge" :class="'badge-' + box.theme">{{ box.themeName }}</div>
        </div>

        <!-- 盒子信息 -->
        <div class="box-body">
          <h3 class="box-title">{{ box.name }}</h3>
          <p class="box-desc">{{ box.desc }}</p>

          <!-- 稀有度进度条 -->
          <div class="rarity-bars">
            <div v-for="r in box.rarityBars" :key="r.name" class="rarity-bar-row">
              <span class="rarity-bar-name" :class="'rarity-text-' + r.name">{{ r.name }}</span>
              <div class="rarity-bar-track">
                <div
                  class="rarity-bar-fill"
                  :class="'fill-' + r.name"
                  :style="{ width: r.prob + '%' }"
                />
              </div>
              <span class="rarity-bar-prob">{{ r.prob }}%</span>
            </div>
          </div>

          <div class="box-footer">
            <div class="box-cost">
              <span class="cost-icon">💎</span>
              <span class="cost-value">{{ box.cost }}</span>
              <span class="cost-label">积分/次</span>
            </div>
            <button
              class="draw-btn"
              :class="'draw-' + box.theme"
              :disabled="currentPoints < box.cost || drawingBoxId === box.id"
              @click="handleDraw(box)"
            >
              <span v-if="currentPoints < box.cost" class="btn-text">积分不足</span>
              <span v-else-if="drawingBoxId === box.id" class="btn-text">抽取中...</span>
              <span v-else class="btn-text">立即抽取</span>
              <span class="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 抽取结果弹窗 -->
    <el-dialog
      v-model="resultVisible"
      width="400px"
      :close-on-click-modal="false"
      center
      class="result-dialog"
    >
      <div class="result-content" v-if="lastResult">
        <!-- 稀有度背景光效 -->
        <div class="result-glow" :class="'glow-result-' + lastResult.rarity" />
        <div class="result-cover" :class="'result-' + lastResult.rarity">
          <img v-if="lastResult.cover" :src="lastResult.cover" :alt="lastResult.name" />
          <div v-else class="result-placeholder">
            <span class="result-emoji">{{ lastResult.rarity === 'SSR' ? '✨' : lastResult.rarity === 'SR' ? '⭐' : '💠' }}</span>
          </div>
          <div class="result-rarity-tag" :class="'rtag-' + lastResult.rarity">{{ lastResult.rarity }}</div>
        </div>
        <div class="result-name" :class="'rname-' + lastResult.rarity">{{ lastResult.name }}</div>
        <div class="result-desc">{{ lastResult.description }}</div>
        <div class="result-rarity-bar" :class="'rbar-' + lastResult.rarity">
          <span>{{ lastResult.rarity === 'SSR' ? '传说稀有' : lastResult.rarity === 'SR' ? '高级稀有' : lastResult.rarity === 'R' ? '普通稀有' : '常见' }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { useBlindBoxStore } from '../../stores/blindbox';
import { drawBlindBox } from '../../api/blindbox';

const auth = useAuthStore();
const blindboxStore = useBlindBoxStore();
const boxes = ref<any[]>([]);
const currentPoints = ref(auth.user?.points ?? 0);
const drawingBoxId = ref<string | number | null>(null);
const resultVisible = ref(false);
const lastResult = ref<any>(null);

const rarityList = ['SSR', 'SR', 'R', 'N'];
const nameByRarity = (rarity: string, i: number) => {
  const map: Record<string, string[]> = {
    SSR: ['雷霆战神', '凤凰涅槃', '神龙下凡'],
    SR: ['火焰战士', '风之行者', '暗影刺客'],
    R: ['海洋之心', '森林精灵', '雷电法师'],
    N: ['学习达人', '阅读之星', '数学能手']
  };
  return map[rarity][i % 3];
};
const descByRarity = (rarity: string) => {
  const map: Record<string, string> = {
    SSR: '传说级皮肤，极其稀有！', SR: '高级皮肤，品质优秀',
    R: '中级皮肤，值得收藏', N: '普通皮肤，常见奖励'
  };
  return map[rarity];
};

const handleDraw = async (box: any) => {
  if (currentPoints.value < box.cost) {
    ElMessage.warning('积分不足，快去完成任务赚取积分吧！');
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确认消耗 ${box.cost} 积分抽取「${box.name}」吗？`,
      '抽取确认', { confirmButtonText: '确认抽取', cancelButtonText: '取消', type: 'warning' }
    );
  } catch { return; }

  drawingBoxId.value = box.id;
  setTimeout(async () => {
    try {
      const res = await drawBlindBox({ boxId: box.id }).catch(() => ({ data: null }));
      let result: any;
      if (res && res.data) {
        result = res.data;
      } else {
        const rand = Math.random();
        let rarity = 'N';
        if (rand < 0.05) rarity = 'SSR';
        else if (rand < 0.2) rarity = 'SR';
        else if (rand < 0.5) rarity = 'R';
        const idx = Math.floor(Math.random() * 3);
        result = { id: Date.now(), name: nameByRarity(rarity, idx), rarity, description: descByRarity(rarity), cover: '' };
      }
      currentPoints.value -= box.cost;
      lastResult.value = result;
      drawingBoxId.value = null;
      resultVisible.value = true;
      setTimeout(() => {
        if (result.rarity === 'SSR') ElMessage.success('🎉 恭喜获得 SSR 传说皮肤！');
        else if (result.rarity === 'SR') ElMessage.success('✨ 恭喜获得 SR 高级皮肤！');
        else ElMessage.success('抽取成功！');
      }, 100);
    } catch (e: any) {
      ElMessage.error(e?.message || '抽取失败，请稍后重试');
      drawingBoxId.value = null;
    }
  }, 2200);
};

const loadData = async () => {
  try {
    await blindboxStore.load().catch(() => null);
    if (blindboxStore.list && blindboxStore.list.length) boxes.value = blindboxStore.list;
  } catch (e: any) { /* fallthrough */ }
  if (!boxes.value.length) {
    boxes.value = [
      {
        id: 1, name: '普通盲盒', desc: '普通概率，可能获得 R~N 级皮肤', cost: 20, icon: '📦',
        theme: 'default', themeName: '基础',
        rarityBars: [{ name: 'SSR', prob: 2 }, { name: 'SR', prob: 8 }, { name: 'R', prob: 30 }, { name: 'N', prob: 60 }]
      },
      {
        id: 2, name: '高级盲盒', desc: '较高概率，可能获得 SR~N 级皮肤', cost: 50, icon: '🎁',
        theme: 'purple', themeName: '高级',
        rarityBars: [{ name: 'SSR', prob: 5 }, { name: 'SR', prob: 15 }, { name: 'R', prob: 35 }, { name: 'N', prob: 45 }]
      },
      {
        id: 3, name: '传说盲盒', desc: '有机会获得 SSR 传说皮肤', cost: 100, icon: '💎',
        theme: 'gold', themeName: '传说',
        rarityBars: [{ name: 'SSR', prob: 10 }, { name: 'SR', prob: 25 }, { name: 'R', prob: 35 }, { name: 'N', prob: 30 }]
      }
    ];
  }
};

onMounted(loadData);
</script>

<style scoped>
.blind-box-page { display: flex; flex-direction: column; gap: 20px; }

/* 顶部 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.points-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 24px;
}
.points-icon { font-size: 20px; }
.points-value { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: #f59e0b; }
.points-label { font-size: 12px; color: #92400e; }
.total-draws {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #475569;
  padding: 8px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
}
.draw-count { font-family: var(--font-display); font-weight: 700; color: #64748b; }

/* 盲盒网格 */
.boxes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.box-card {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeSlideUp 0.5s ease-out both;
}
.box-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

/* 盒子头部 */
.box-header {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.box-glow {
  position: absolute;
  inset: 0;
  border-radius: 0;
}
.glow-default { background: radial-gradient(ellipse at center, rgba(59,130,246,0.2) 0%, transparent 70%); }
.glow-purple { background: radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, transparent 70%); }
.glow-gold { background: radial-gradient(ellipse at center, rgba(245,158,11,0.3) 0%, transparent 70%); }

.header-default { background: linear-gradient(135deg, #1e3a5f, #1e1b4b); }
.header-purple { background: linear-gradient(135deg, #2d1b4b, #4c1d95); }
.header-gold { background: linear-gradient(135deg, #1c1400, #3d2700); }

.box-icon-wrap {
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;
}
.box-icon { font-size: 72px; }

.theme-badge {
  position: absolute;
  top: 14px; right: 14px;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}
.badge-default { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); }
.badge-purple { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.3); }
.badge-gold { background: rgba(245,158,11,0.2); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3); }

/* 盒子内容 */
.box-body { padding: 20px; }
.box-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  letter-spacing: 1px;
}
.box-desc { font-size: 13px; color: #475569; margin-bottom: 16px; line-height: 1.5; min-height: 40px; }

/* 稀有度进度条 */
.rarity-bars { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.rarity-bar-row { display: flex; align-items: center; gap: 8px; }
.rarity-bar-name {
  width: 28px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}
.rarity-text-SSR { color: #ff2d55; }
.rarity-text-SR  { color: #ff9f0a; }
.rarity-text-R   { color: #0a84ff; }
.rarity-text-N   { color: #6b7280; }

.rarity-bar-track {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
  overflow: hidden;
}
.rarity-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}
.fill-SSR { background: linear-gradient(90deg, #ff2d55, #ff6b6b); }
.fill-SR  { background: linear-gradient(90deg, #ff9f0a, #ffd60a); }
.fill-R   { background: linear-gradient(90deg, #0a84ff, #5ac8fa); }
.fill-N   { background: linear-gradient(90deg, #6b7280, #9ca3af); }

.rarity-bar-prob { width: 36px; font-size: 11px; color: #475569; text-align: right; flex-shrink: 0; }

/* 底部 */
.box-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.box-cost {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.cost-icon { font-size: 16px; }
.cost-value { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: #f59e0b; }
.cost-label { font-size: 11px; color: #475569; }

.draw-btn {
  flex: 1;
  max-width: 160px;
  padding: 11px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.draw-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.draw-btn:hover::before { opacity: 1; }
.draw-btn:hover:not(:disabled) { transform: translateY(-2px); }

.draw-default { background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; }
.draw-default:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(59,130,246,0.4); }
.draw-purple { background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: #fff; }
.draw-purple:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(139,92,246,0.4); }
.draw-gold { background: linear-gradient(135deg, #d97706, #f59e0b); color: #fff; }
.draw-gold:hover:not(:disabled) { box-shadow: 0 8px 24px rgba(245,158,11,0.4); }
.draw-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-text { font-size: 13px; }
.btn-arrow { font-size: 16px; transition: transform 0.2s; }
.draw-btn:hover .btn-arrow { transform: translateX(3px); }

/* 结果弹窗 */
.result-content {
  text-align: center;
  position: relative;
  padding: 20px 0;
}
.result-glow {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 200px; height: 200px;
  border-radius: 50%;
  filter: blur(40px);
  z-index: 0;
}
.glow-result-SSR { background: rgba(255,45,85,0.3); }
.glow-result-SR  { background: rgba(255,159,10,0.3); }
.glow-result-R   { background: rgba(10,132,255,0.2); }
.glow-result-N   { background: rgba(142,142,147,0.15); }

.result-cover {
  position: relative;
  width: 180px; height: 180px;
  margin: 0 auto 20px;
  border-radius: 20px;
  overflow: hidden;
  z-index: 1;
}
.result-cover img { width: 100%; height: 100%; object-fit: cover; }
.result-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,0.03);
}
.result-emoji { font-size: 72px; }

.result-SSR { border: 3px solid #ff2d55; box-shadow: 0 0 30px rgba(255,45,85,0.4); }
.result-SR  { border: 3px solid #ff9f0a; box-shadow: 0 0 24px rgba(255,159,10,0.3); }
.result-R   { border: 3px solid #0a84ff; }
.result-N   { border: 3px solid #6b7280; }

.result-rarity-tag {
  position: absolute;
  top: 10px; right: 10px;
  padding: 3px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}
.rtag-SSR { background: rgba(255,45,85,0.9); color: #fff; }
.rtag-SR  { background: rgba(255,159,10,0.9); color: #fff; }
.rtag-R   { background: rgba(10,132,255,0.9); color: #fff; }
.rtag-N   { background: rgba(142,142,147,0.9); color: #fff; }

.result-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}
.rname-SSR { color: #ff2d55; text-shadow: 0 0 20px rgba(255,45,85,0.5); }
.rname-SR  { color: #ff9f0a; }
.rname-R   { color: #0a84ff; }
.rname-N   { color: #8e8e93; }

.result-desc { font-size: 13px; color: #64748b; margin-bottom: 16px; position: relative; z-index: 1; }
.result-rarity-bar {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}
.rbar-SSR { background: rgba(255,45,85,0.15); color: #ff2d55; border: 1px solid rgba(255,45,85,0.3); }
.rbar-SR  { background: rgba(255,159,10,0.15); color: #ff9f0a; border: 1px solid rgba(255,159,10,0.3); }
.rbar-R   { background: rgba(10,132,255,0.15); color: #0a84ff; border: 1px solid rgba(10,132,255,0.3); }
.rbar-N   { background: rgba(142,142,147,0.1); color: #8e8e93; border: 1px solid rgba(142,142,147,0.2); }
</style>
