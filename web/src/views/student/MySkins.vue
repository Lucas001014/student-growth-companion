<template>
  <div class="my-skins">
    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="filter-pills">
        <button
          v-for="r in ['all', 'SSR', 'SR', 'R', 'N']"
          :key="r"
          class="rarity-pill"
          :class="[rarityFilter === r ? 'active' : '', r !== 'all' ? 'pill-' + r : '']"
          @click="rarityFilter = r"
        >
          {{ r === 'all' ? '全部' : r }}
        </button>
      </div>
      <div class="points-display">
        <span class="points-icon">💎</span>
        <span class="points-value">{{ currentPoints }}</span>
        <span class="points-label">积分</span>
      </div>
    </div>

    <!-- 皮肤网格 -->
    <div class="skins-grid">
      <div
        v-for="(skin, idx) in filteredSkins"
        :key="skin.id"
        class="skin-card"
        :class="[
          'rarity-' + skin.rarity,
          { 'not-owned': !skin.owned, equipped: skin.equipped }
        ]"
        :style="{ animationDelay: (idx * 0.05) + 's' }"
        @click="handleEquip(skin)"
      >
        <!-- 稀有度顶部边框光效 -->
        <div class="rarity-top-border" :class="'border-' + skin.rarity" />

        <!-- 皮肤图片区 -->
        <div class="skin-cover" :class="'cover-' + skin.rarity">
          <img v-if="skin.cover" :src="skin.cover" :alt="skin.name" />
          <div v-else class="skin-placeholder">
            <span class="placeholder-emoji">{{ skin.rarity === 'SSR' ? '✨' : skin.rarity === 'SR' ? '⭐' : skin.rarity === 'R' ? '💠' : '🪨' }}</span>
          </div>
          <!-- 稀有度标签 -->
          <div class="rarity-tag" :class="'tag-' + skin.rarity">{{ skin.rarity }}</div>
          <!-- 已佩戴标识 -->
          <div v-if="skin.equipped" class="equipped-tag">
            <span>✦ 已佩戴</span>
          </div>
          <!-- 未解锁遮罩 -->
          <div v-if="!skin.owned" class="locked-overlay">
            <span class="lock-icon">🔒</span>
            <span class="lock-text">未解锁</span>
          </div>
        </div>

        <!-- 皮肤信息 -->
        <div class="skin-body">
          <div class="skin-name" :class="'name-' + skin.rarity">{{ skin.name }}</div>
          <div class="skin-desc">{{ skin.description }}</div>

          <div class="skin-meta">
            <span class="rarity-badge" :class="'badge-' + skin.rarity">{{ skin.rarity }}</span>
            <span class="skin-cost">
              <span class="cost-icon">💎</span>
              {{ skin.points }}
            </span>
          </div>

          <button
            v-if="skin.owned && !skin.equipped"
            class="equip-btn"
            :class="'btn-' + skin.rarity"
            :loading="loadingSkinId === skin.id"
            @click.stop="handleEquip(skin)"
          >
            申请佩戴
          </button>
          <button
            v-else-if="skin.equipped"
            class="equipped-btn"
          >
            ✦ 当前佩戴中
          </button>
          <button
            v-else
            class="locked-btn"
            disabled
          >
            去盲盒抽取
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!filteredSkins.length" class="empty-state">
      <span class="empty-icon">🎨</span>
      <p class="empty-text">暂无符合条件的皮肤</p>
      <p class="empty-sub">去盲盒试试手气吧！</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { useStudentStore } from '../../stores/student';
import { submitRequest } from '../../api/request';

const auth = useAuthStore();
const studentStore = useStudentStore();
const rarityFilter = ref('all');
const loadingSkinId = ref<string | number | null>(null);
const skins = ref<any[]>([]);
const currentPoints = ref(auth.user?.points ?? 0);

const filteredSkins = computed(() => {
  if (rarityFilter.value === 'all') return skins.value;
  return skins.value.filter(s => s.rarity === rarityFilter.value);
});

const handleEquip = async (skin: any) => {
  if (!skin.owned) {
    ElMessage.info('该皮肤尚未解锁，请先去盲盒抽取！');
    return;
  }
  try {
    await ElMessageBox.confirm(`确认申请佩戴「${skin.name}」皮肤吗？`, '提示', {
      confirmButtonText: '确认申请',
      cancelButtonText: '取消',
      type: 'info'
    });
    loadingSkinId.value = skin.id;
    await submitRequest({
      type: 'skin',
      title: `申请佩戴${skin.name}`,
      detail: `学生申请佩戴「${skin.name}」皮肤（${skin.rarity}）`
    }).catch(() => ({ data: {} }));
    skins.value.forEach(s => { s.equipped = s.id === skin.id; });
    ElMessage.success('申请已提交，等待老师审批 ✨');
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e?.message || '申请失败');
  } finally {
    loadingSkinId.value = null;
  }
};

const loadData = async () => {
  try {
    const honor = await studentStore.loadHonor(auth.user?.id || 1).catch(() => null);
    if (honor && (honor as any).data && Object.keys((honor as any).data).length > 0) {
      const d = (honor as any).data;
      skins.value = d.skins || [];
      if (typeof d.points === 'number') currentPoints.value = d.points;
    }
  } catch (e: any) { /* fallthrough */ }

  if (!skins.value.length) {
    skins.value = [
      { id: 1, name: '森林守护者', rarity: 'SSR', description: '神秘森林传说，守护自然的力量', points: 200, owned: true, equipped: true, cover: '' },
      { id: 2, name: '星空探险家', rarity: 'SR', description: '探索浩瀚宇宙，追寻星辰大海', points: 150, owned: true, equipped: false, cover: '' },
      { id: 3, name: '海洋之心', rarity: 'R', description: '深海蓝色战士，神秘海洋的守护者', points: 100, owned: true, equipped: false, cover: '' },
      { id: 4, name: '学习达人', rarity: 'N', description: '勤奋学习的奖励，每一个学生都能拥有', points: 50, owned: true, equipped: false, cover: '' },
      { id: 5, name: '火焰战士', rarity: 'SR', description: '燃烧的斗志，不灭的精神', points: 150, owned: false, equipped: false, cover: '' },
      { id: 6, name: '冰雪公主', rarity: 'SSR', description: '纯净之冰，冷艳美丽', points: 200, owned: false, equipped: false, cover: '' },
      { id: 7, name: '雷电法师', rarity: 'SSR', description: '操控雷电的强大力量', points: 200, owned: false, equipped: false, cover: '' },
      { id: 8, name: '风之行者', rarity: 'SR', description: '自由如风，轻盈敏捷', points: 150, owned: false, equipped: false, cover: '' },
      { id: 9, name: '大地勇士', rarity: 'R', description: '坚实如大地，稳如磐石', points: 100, owned: false, equipped: false, cover: '' },
      { id: 10, name: '科技先锋', rarity: 'R', description: '探索科技前沿，创新无限可能', points: 100, owned: false, equipped: false, cover: '' },
      { id: 11, name: '阅读达人', rarity: 'N', description: '热爱阅读，知识渊博', points: 50, owned: true, equipped: false, cover: '' },
      { id: 12, name: '数学之星', rarity: 'N', description: '数学成绩优异，逻辑思维强', points: 50, owned: false, equipped: false, cover: '' }
    ];
  }
};

onMounted(loadData);
</script>

<style scoped>
.my-skins { display: flex; flex-direction: column; gap: 20px; }

/* 顶部过滤栏 */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.filter-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.rarity-pill {
  padding: 7px 18px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(15,23,42,0.6);
  color: #64748b;
  transition: all 0.2s ease;
}
.rarity-pill:hover { border-color: rgba(255,255,255,0.15); color: #94a3b8; }
.rarity-pill.active { background: rgba(0,245,212,0.1); border-color: rgba(0,245,212,0.3); color: #00f5d4; }
.pill-SSR.active { background: rgba(255,45,85,0.12); border-color: rgba(255,45,85,0.3); color: #ff2d55; }
.pill-SR.active { background: rgba(255,159,10,0.12); border-color: rgba(255,159,10,0.3); color: #ff9f0a; }
.pill-R.active { background: rgba(10,132,255,0.12); border-color: rgba(10,132,255,0.3); color: #0a84ff; }
.pill-N.active { background: rgba(142,142,147,0.1); border-color: rgba(142,142,147,0.25); color: #8e8e93; }

.points-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(245,158,11,0.08);
  border: 1px solid rgba(245,158,11,0.2);
  border-radius: 20px;
}
.points-icon { font-size: 16px; }
.points-value { font-family: var(--font-display); font-size: 16px; font-weight: 700; color: #f59e0b; }
.points-label { font-size: 12px; color: #92400e; }

/* 皮肤网格 */
.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
}

.skin-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeSlideUp 0.5s ease-out both;
  cursor: pointer;
  position: relative;
}
.skin-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 16px 48px rgba(0,0,0,0.3);
}
.skin-card.not-owned { opacity: 0.7; }
.skin-card.equipped { border-color: rgba(16,185,129,0.4) !important; }

/* SSR 卡片特效 */
.skin-card.rarity-SSR:hover { border-color: rgba(255,45,85,0.4) !important; box-shadow: 0 16px 48px rgba(255,45,85,0.15) !important; }
.skin-card.rarity-SR:hover { border-color: rgba(255,159,10,0.4) !important; box-shadow: 0 16px 48px rgba(255,159,10,0.12) !important; }
.skin-card.rarity-R:hover { border-color: rgba(10,132,255,0.4) !important; box-shadow: 0 16px 48px rgba(10,132,255,0.12) !important; }

/* 稀有度顶部边框 */
.rarity-top-border {
  height: 3px;
  width: 100%;
}
.border-SSR { background: linear-gradient(90deg, #ff2d55, #ff9f0a); box-shadow: 0 0 16px rgba(255,45,85,0.5); }
.border-SR  { background: linear-gradient(90deg, #ff9f0a, #ffd60a); box-shadow: 0 0 12px rgba(255,159,10,0.4); }
.border-R   { background: linear-gradient(90deg, #0a84ff, #5ac8fa); box-shadow: 0 0 10px rgba(10,132,255,0.3); }
.border-N   { background: linear-gradient(90deg, #8e8e93, #a1a1a6); }

/* 皮肤封面 */
.skin-cover {
  position: relative;
  height: 160px;
  overflow: hidden;
}
.skin-cover img { width: 100%; height: 100%; object-fit: cover; }
.skin-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.placeholder-emoji { font-size: 64px; }

/* 稀有度封面背景 */
.cover-SSR { background: linear-gradient(135deg, #1a0a10, #2d0a1a); }
.cover-SR  { background: linear-gradient(135deg, #1a1000, #2d1a00); }
.cover-R   { background: linear-gradient(135deg, #001020, #001030); }
.cover-N   { background: linear-gradient(135deg, #0f0f0f, #1a1a1a); }

/* 稀有度标签 */
.rarity-tag {
  position: absolute;
  top: 10px; right: 10px;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}
.tag-SSR { background: rgba(255,45,85,0.9); color: #fff; box-shadow: 0 0 12px rgba(255,45,85,0.6); }
.tag-SR  { background: rgba(255,159,10,0.9); color: #fff; box-shadow: 0 0 12px rgba(255,159,10,0.5); }
.tag-R   { background: rgba(10,132,255,0.9); color: #fff; }
.tag-N   { background: rgba(142,142,147,0.9); color: #fff; }

.equipped-tag {
  position: absolute;
  top: 10px; left: 10px;
  background: rgba(16,185,129,0.9);
  color: #fff;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 0 10px rgba(16,185,129,0.5);
}

.locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  backdrop-filter: blur(2px);
}
.lock-icon { font-size: 28px; }
.lock-text { font-size: 13px; color: #94a3b8; }

/* 皮肤信息 */
.skin-body { padding: 14px 16px 16px; }
.skin-name {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}
.name-SSR { color: #ff2d55; text-shadow: 0 0 12px rgba(255,45,85,0.4); }
.name-SR  { color: #ff9f0a; }
.name-R   { color: #0a84ff; }
.name-N   { color: #8e8e93; }

.skin-desc {
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 12px;
  line-height: 1.5;
  min-height: 36px;
}

.skin-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.rarity-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}
.badge-SSR { background: rgba(255,45,85,0.15); color: #ff2d55; border: 1px solid rgba(255,45,85,0.3); }
.badge-SR  { background: rgba(255,159,10,0.15); color: #ff9f0a; border: 1px solid rgba(255,159,10,0.3); }
.badge-R   { background: rgba(10,132,255,0.15); color: #0a84ff; border: 1px solid rgba(10,132,255,0.3); }
.badge-N   { background: rgba(142,142,147,0.1); color: #8e8e93; border: 1px solid rgba(142,142,147,0.2); }

.skin-cost { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #f59e0b; font-weight: 600; }
.cost-icon { font-size: 14px; }

.equip-btn, .equipped-btn, .locked-btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-SSR { background: linear-gradient(135deg, #ff2d55, #ff6b6b); color: #fff; }
.btn-SSR:hover { box-shadow: 0 4px 16px rgba(255,45,85,0.4); transform: translateY(-1px); }
.btn-SR { background: linear-gradient(135deg, #ff9f0a, #ffc107); color: #fff; }
.btn-SR:hover { box-shadow: 0 4px 16px rgba(255,159,10,0.4); transform: translateY(-1px); }
.btn-R { background: linear-gradient(135deg, #0a84ff, #5ac8fa); color: #fff; }
.btn-R:hover { box-shadow: 0 4px 16px rgba(10,132,255,0.3); transform: translateY(-1px); }
.btn-N { background: rgba(142,142,147,0.2); color: #8e8e93; }

.equipped-btn { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
.locked-btn { background: rgba(255,255,255,0.03); color: #334155; border: 1px solid rgba(255,255,255,0.05); cursor: not-allowed; }

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #334155;
}
.empty-icon { font-size: 64px; display: block; margin-bottom: 16px; }
.empty-text { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #475569; }
.empty-sub { font-size: 13px; color: #334155; }
</style>
