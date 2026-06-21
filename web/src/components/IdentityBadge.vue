<template>
  <span
    class="identity-badge"
    :class="'identity-badge-' + type"
    :style="customStyle"
  >
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  text: string;
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  bg?: string;
  color?: string;
}>(), {
  type: 'primary'
});

const colorMap: Record<string, { bg: string; color: string }> = {
  primary: { bg: '#ecf5ff', color: '#409eff' },
  success: { bg: '#f0f9eb', color: '#67c23a' },
  warning: { bg: '#fdf6ec', color: '#e6a23c' },
  danger:  { bg: '#fef0f0', color: '#f56c6c' },
  info:    { bg: '#f4f4f5', color: '#909399' },
  purple:  { bg: '#f3e8ff', color: '#a855f7' }
};

const customStyle = computed(() => {
  const base = colorMap[props.type] || colorMap.primary;
  return {
    background: props.bg || base.bg,
    color: props.color || base.color
  };
});
</script>

<style scoped>
.identity-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}
</style>
