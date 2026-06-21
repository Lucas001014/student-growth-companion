<template>
  <div class="ranking-list">
    <div
      v-for="(item, idx) in data"
      :key="item.id || idx"
      class="ranking-row"
      :class="{ 'ranking-row-top': idx < 3 }"
      :style="{ animationDelay: (idx * 0.05) + 's' }"
    >
      <div class="rank-badge" :class="'rank-' + (idx + 1)">
        <template v-if="idx === 0">🥇</template>
        <template v-else-if="idx === 1">🥈</template>
        <template v-else-if="idx === 2">🥉</template>
        <template v-else>{{ idx + 1 }}</template>
      </div>
      <img :src="item.avatar || defaultAvatar" :alt="item.name" class="avatar" />
      <div class="info">
        <div class="name-row">
          <span class="name">{{ item.name }}</span>
          <identity-badge
            v-for="(badge, i) in (item.badges || []).slice(0, 3)"
            :key="i"
            :text="badge.text"
            :type="badge.type"
          />
        </div>
        <div class="sub">
          <span>皮肤 {{ item.skinCount ?? 0 }} 件</span>
          <span class="dot">·</span>
          <span>称号 {{ item.titleCount ?? 0 }} 个</span>
        </div>
      </div>
      <div class="points">
        <span class="points-num">{{ item.points ?? 0 }}</span>
        <span class="points-label">积分</span>
      </div>
    </div>
    <div v-if="!data || data.length === 0" class="empty">暂无排行数据</div>
  </div>
</template>

<script setup lang="ts">
import IdentityBadge from './IdentityBadge.vue';

defineProps<{
  data: Array<{
    id?: string | number;
    name: string;
    avatar?: string;
    points?: number;
    skinCount?: number;
    titleCount?: number;
    badges?: Array<{ text: string; type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' }>;
  }>;
}>();

const defaultAvatar = 'https://via.placeholder.com/60?text=U';
</script>

<style scoped>
.ranking-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ranking-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: all 0.25s ease;
  animation: fadeSlideUp 0.4s ease-out both;
}
.ranking-row:hover {
  border-color: rgba(96, 165, 250, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateX(4px);
  background: rgba(15, 23, 42, 0.8);
}
.ranking-row-top {
  background: rgba(251, 191, 36, 0.06);
  border-color: rgba(251, 191, 36, 0.12);
}
.ranking-row-top:hover {
  border-color: rgba(251, 191, 36, 0.25);
}
.rank-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.04);
  color: #64748b;
  margin-right: 12px;
  flex-shrink: 0;
}
.rank-1 { background: linear-gradient(135deg, rgba(251,191,36,0.25), rgba(245,158,11,0.5)); color: #fff; box-shadow: 0 0 12px rgba(251,191,36,0.3); }
.rank-2 { background: linear-gradient(135deg, rgba(148,163,184,0.3), rgba(100,116,139,0.5)); color: #fff; }
.rank-3 { background: linear-gradient(135deg, rgba(249,115,22,0.3), rgba(234,88,12,0.5)); color: #fff; }
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.06);
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
  color: #e2e8f0;
}
.sub {
  font-size: 12px;
  color: #4a5568;
  margin-top: 4px;
}
.dot { margin: 0 6px; }
.points {
  text-align: right;
  margin-left: 12px;
  flex-shrink: 0;
}
.points-num {
  display: block;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #f59e0b;
  line-height: 1.1;
}
.points-label {
  font-size: 11px;
  color: #4a5568;
}
.empty {
  text-align: center;
  color: #4a5568;
  padding: 40px 0;
  font-size: 14px;
}
</style>
