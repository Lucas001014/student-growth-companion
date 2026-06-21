<template>
  <el-card class="skin-card" shadow="hover">
    <div class="skin-cover">
      <img :src="cover" :alt="name" @error="handleImgError" />
      <span :class="['rarity-tag', 'rarity-' + rarity]">{{ rarity }}</span>
    </div>
    <div class="skin-info">
      <h3 class="skin-name">{{ name }}</h3>
      <p class="skin-desc">{{ description }}</p>
      <div class="skin-footer">
        <el-tag :type="rarityTagType" size="small" effect="plain">稀有度 {{ rarity }}</el-tag>
        <span class="skin-points">{{ points }} 积分</span>
      </div>
      <el-button
        class="apply-btn"
        :type="buttonType"
        :disabled="disabled"
        :loading="loading"
        @click="handleApply"
      >{{ buttonText }}</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id?: string | number;
  name: string;
  cover?: string;
  rarity?: 'N' | 'R' | 'SR' | 'SSR';
  description?: string;
  points?: number;
  owned?: boolean;
  equipped?: boolean;
  loading?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'apply', payload: { id?: string | number; name: string }): void;
}>();

const rarity = computed(() => props.rarity || 'N');
const points = computed(() => props.points ?? 0);
const cover = computed(() => props.cover || 'https://via.placeholder.com/300x180?text=Skin');
const description = computed(() => props.description || '一件炫酷的荣誉皮肤');

const rarityTagType = computed(() => {
  switch (rarity.value) {
    case 'SSR': return 'danger';
    case 'SR': return 'warning';
    case 'R': return 'primary';
    default: return 'info';
  }
});

const buttonType = computed(() => (props.equipped ? 'success' : 'primary'));
const buttonText = computed(() => {
  if (props.equipped) return '已佩戴';
  if (props.owned) return '申请佩戴';
  return '申请佩戴';
});

const handleImgError = (e: Event) => {
  const img = e.target as HTMLImageElement;
  img.src = 'https://via.placeholder.com/300x180?text=Skin';
};

const handleApply = () => {
  if (props.equipped) return;
  emit('apply', { id: props.id, name: props.name });
};
</script>

<style scoped>
.skin-card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease;
}
.skin-card:hover {
  transform: translateY(-3px);
}
.skin-cover {
  position: relative;
  height: 160px;
  background: #f0f2f5;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.skin-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.rarity-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.92);
}
.rarity-N { color: #909399; }
.rarity-R { color: #409eff; }
.rarity-SR { color: #e6a23c; }
.rarity-SSR { color: #f56c6c; }
.skin-info {
  padding: 8px 4px 0;
}
.skin-name {
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0 6px;
  color: #303133;
}
.skin-desc {
  font-size: 12px;
  color: #909399;
  height: 34px;
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.skin-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
}
.skin-points {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 600;
}
.apply-btn {
  width: 100%;
  margin-top: 6px;
}
</style>
