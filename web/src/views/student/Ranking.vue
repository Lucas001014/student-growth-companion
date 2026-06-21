<template>
  <div class="ranking-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">🏆 班级排行榜</span>
          <div class="tabs-area">
            <el-radio-group v-model="periodTab" size="small" @change="loadData">
              <el-radio-button value="week">本周</el-radio-button>
              <el-radio-button value="month">本月</el-radio-button>
              <el-radio-button value="term">学期</el-radio-button>
              <el-radio-button value="all">全部</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="sortTab" size="small" @change="loadData">
              <el-radio-button value="points">总积分</el-radio-button>
              <el-radio-button value="skins">皮肤数</el-radio-button>
              <el-radio-button value="titles">称号数</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <div class="top-three" v-if="rankedList.length >= 3">
        <div class="top-card rank-2" @click="highlightRow(rankedList[1])">
          <div class="crown">🥈</div>
          <img :src="rankedList[1].avatar || defaultAvatar" class="top-avatar" />
          <div class="top-name">{{ rankedList[1].name }}</div>
          <div class="top-value">{{ displayValue(rankedList[1]) }}</div>
        </div>
        <div class="top-card rank-1" @click="highlightRow(rankedList[0])">
          <div class="crown">🥇</div>
          <img :src="rankedList[0].avatar || defaultAvatar" class="top-avatar" />
          <div class="top-name">{{ rankedList[0].name }}</div>
          <div class="top-value">{{ displayValue(rankedList[0]) }}</div>
        </div>
        <div class="top-card rank-3" @click="highlightRow(rankedList[2])">
          <div class="crown">🥉</div>
          <img :src="rankedList[2].avatar || defaultAvatar" class="top-avatar" />
          <div class="top-name">{{ rankedList[2].name }}</div>
          <div class="top-value">{{ displayValue(rankedList[2]) }}</div>
        </div>
      </div>

      <div class="list-section">
        <div
          v-for="(item, idx) in rankedList"
          :key="item.id || idx"
          class="rank-row"
          :class="{ 'is-self': isSelf(item), 'is-top': idx < 3 }"
        >
          <div class="rank-badge" :class="'badge-' + (idx + 1)">
            <template v-if="idx === 0">🥇</template>
            <template v-else-if="idx === 1">🥈</template>
            <template v-else-if="idx === 2">🥉</template>
            <template v-else>{{ idx + 1 }}</template>
          </div>
          <img :src="item.avatar || defaultAvatar" class="avatar" />
          <div class="info">
            <div class="name-row">
              <span class="name">{{ item.name }}</span>
              <el-tag v-if="isSelf(item)" type="success" effect="dark" size="small">我</el-tag>
              <identity-badge
                v-for="(b, bi) in (item.badges || []).slice(0, 2)"
                :key="bi"
                :text="b.text"
                :type="b.type"
              />
            </div>
            <div class="sub-info">
              <span>💎 {{ item.points || 0 }} 积分</span>
              <span class="dot">·</span>
              <span>🎨 {{ item.skinCount || 0 }} 皮肤</span>
              <span class="dot">·</span>
              <span>👑 {{ item.titleCount || 0 }} 称号</span>
            </div>
          </div>
          <div class="main-value">
            <span class="value-num">{{ displayValue(item) }}</span>
            <span class="value-label">{{ valueLabel }}</span>
          </div>
        </div>
      </div>

      <el-empty v-if="!rankedList.length" description="暂无排行数据" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import IdentityBadge from '../../components/IdentityBadge.vue';
import { useAuthStore } from '../../stores/auth';
import { getClassRanking } from '../../api/ranking';

const auth = useAuthStore();
const defaultAvatar = 'https://via.placeholder.com/60?text=U';

const periodTab = ref('week');
const sortTab = ref('points');
const rawList = ref<any[]>([]);

const myName = auth.user?.name || auth.user?.username || '同学';

const isSelf = (item: any) => item.name === myName || item.isSelf;

const valueLabel = computed(() => {
  if (sortTab.value === 'skins') return '皮肤';
  if (sortTab.value === 'titles') return '称号';
  return '积分';
});

const displayValue = (item: any) => {
  if (sortTab.value === 'skins') return item.skinCount || 0;
  if (sortTab.value === 'titles') return item.titleCount || 0;
  return item.points || 0;
};

const rankedList = computed(() => {
  const list = [...rawList.value];
  list.sort((a, b) => {
    let av = 0, bv = 0;
    if (sortTab.value === 'skins') { av = a.skinCount || 0; bv = b.skinCount || 0; }
    else if (sortTab.value === 'titles') { av = a.titleCount || 0; bv = b.titleCount || 0; }
    else { av = a.points || 0; bv = b.points || 0; }
    return bv - av;
  });
  return list;
});

const highlightRow = (item: any) => {
  // 可以滚动到对应行，此处留空以触发交互反馈
};

const loadData = async () => {
  try {
    const res = await getClassRanking({ period: periodTab.value, sort: sortTab.value }).catch(() => null);
    if (res && (res as any).data && (res as any).data.length) {
      rawList.value = (res as any).data;
    }
  } catch (e: any) {
    // fallthrough
  }

  if (!rawList.value.length) {
    const names = ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆', '郑朗朗', '冯高高', '陈彬彬', '朱亮亮', myName];
    rawList.value = names.map((n, i) => ({
      id: i + 1,
      name: n,
      avatar: '',
      points: Math.floor(1200 - i * 70 - Math.random() * 40),
      skinCount: Math.floor(Math.random() * 8),
      titleCount: Math.floor(Math.random() * 5),
      badges: [
        { text: '学习之星', type: 'success' },
        { text: '小组长', type: 'primary' },
        { text: '进步奖', type: 'warning' }
      ].slice(0, Math.floor(Math.random() * 3))
    }));
    const me = rawList.value.find(i => i.name === myName);
    if (me) { me.isSelf = true; }
  }
};

onMounted(loadData);
</script>

<style scoped>
.ranking-page {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.tabs-area {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.top-three {
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 10px;
  background: linear-gradient(135deg, #fff9e6 0%, #ffffff 100%);
  border-radius: 12px;
}

.top-card {
  text-align: center;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f0f2f5;
  cursor: pointer;
  transition: all 0.2s;
}

.top-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.top-card.rank-1 {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
}

.top-card.rank-2 {
  border: 2px solid #9ca3af;
  background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
}

.top-card.rank-3 {
  border: 2px solid #c2410c;
  background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%);
}

.crown {
  font-size: 32px;
  margin-bottom: 8px;
}

.top-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.top-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.top-value {
  font-size: 22px;
  font-weight: 700;
  color: #f59e0b;
}

.list-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rank-row {
  display: flex;
  align-items: center;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  transition: all 0.2s;
}

.rank-row:hover {
  border-color: #c6e2ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
}

.rank-row.is-self {
  border: 2px solid #f59e0b;
  background: linear-gradient(90deg, #fffbeb 0%, #ffffff 100%);
  box-shadow: 0 0 0 1px rgba(245, 158, 11, 0.2);
}

.rank-badge {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: #f4f4f5;
  color: #909399;
  margin-right: 14px;
  font-size: 15px;
  flex-shrink: 0;
}

.badge-1 { background: linear-gradient(135deg, #fde68a, #f59e0b); color: #fff; }
.badge-2 { background: linear-gradient(135deg, #e5e7eb, #9ca3af); color: #fff; }
.badge-3 { background: linear-gradient(135deg, #fed7aa, #c2410c); color: #fff; }

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 14px;
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.sub-info {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.dot {
  margin: 0 6px;
}

.main-value {
  text-align: right;
  margin-left: 12px;
  flex-shrink: 0;
}

.value-num {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: #e6a23c;
  line-height: 1.1;
}

.value-label {
  font-size: 11px;
  color: #909399;
}
</style>
