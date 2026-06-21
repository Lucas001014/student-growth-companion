<template>
  <div class="blind-box-wrap">
    <div
      v-if="!opened"
      class="blind-box"
      :class="{ 'is-rotating': spinning }"
      @click="handleClick"
    >
      <div class="box-inner">
        <div class="box-face box-front">🎁</div>
        <div class="box-face box-back">🎁</div>
        <div class="box-face box-right">✨</div>
        <div class="box-face box-left">✨</div>
        <div class="box-face box-top">🎁</div>
        <div class="box-face box-bottom">🎁</div>
      </div>
      <p class="hint">{{ spinning ? '抽取中...' : '点击开启盲盒' }}</p>
    </div>

    <div v-else class="result-card" :class="'rarity-' + (result?.rarity || 'N')">
      <div class="shine"></div>
      <div class="result-header">
        <span :class="['rarity-label', 'rarity-' + (result?.rarity || 'N']">
          获得 {{ result?.rarity || 'N' }} 奖励
        </span>
      </div>
      <img :src="result?.cover || defaultCover" class="result-cover" :alt="result?.name" />
      <h3 class="result-name">{{ result?.name || '神秘奖励' }}</h3>
      <p class="result-desc">{{ result?.description || '恭喜获得一件稀有奖励！' }}</p>
      <div class="result-footer">
        <el-button type="primary" @click="handleReset">再抽一次</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Result {
  id?: string | number;
  name: string;
  cover?: string;
  rarity?: 'N' | 'R' | 'SR' | 'SSR';
  description?: string;
}

const props = withDefaults(defineProps<{
  disabled?: boolean;
  spinDuration?: number;
}>(), {
  spinDuration: 1800
});

const emit = defineEmits<{
  (e: 'open'): void;
  (e: 'close'): void;
}>();

const expose = defineExpose<{
  setResult: (r: Result) => void;
  reset: () => void;
}>();

const spinning = ref(false);
const opened = ref(false);
const result = ref<Result | null>(null);
const defaultCover = 'https://via.placeholder.com/300x200?text=Prize';

const handleClick = () => {
  if (props.disabled || spinning.value) return;
  spinning.value = true;
  emit('open');
  setTimeout(() => {
    spinning.value = false;
    opened.value = true;
  }, props.spinDuration);
};

const setResult = (r: Result) => {
  result.value = r;
};

const handleReset = () => {
  opened.value = false;
  result.value = null;
};

const reset = handleReset;

const handleClose = () => {
  emit('close');
  handleReset();
};

expose.setResult = setResult;
expose.reset = reset;
</script>

<style scoped>
.blind-box-wrap {
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}
.blind-box {
  cursor: pointer;
  text-align: center;
}
.box-inner {
  width: 160px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.23, 1.2, 0.32, 1);
  margin: 0 auto;
}
.is-rotating .box-inner {
  transform: rotateX(720deg) rotateY(720deg);
}
.box-face {
  position: absolute;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  background: linear-gradient(135deg, #fde68a, #f59e0b);
  border: 4px solid #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
}
.box-front  { transform: translateZ(80px); }
.box-back   { transform: rotateY(180deg) translateZ(80px); }
.box-right  { transform: rotateY(90deg)  translateZ(80px); }
.box-left   { transform: rotateY(-90deg) translateZ(80px); }
.box-top    { transform: rotateX(90deg)  translateZ(80px); }
.box-bottom { transform: rotateX(-90deg) translateZ(80px); }
.hint {
  margin-top: 24px;
  font-size: 14px;
  color: #606266;
}
.result-card {
  position: relative;
  width: 320px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: popIn 0.5s ease;
}
@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.result-card.rarity-SSR { border: 3px solid #f56c6c; }
.result-card.rarity-SR  { border: 3px solid #e6a23c; }
.result-card.rarity-R   { border: 3px solid #409eff; }
.result-card.rarity-N   { border: 3px solid #909399; }
.shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,200,0.35) 0%, transparent 60%);
  animation: shineMove 3s linear infinite;
  pointer-events: none;
}
@keyframes shineMove {
  0% { transform: translate(-20%, -20%); }
  50% { transform: translate(10%, 10%); }
  100% { transform: translate(-20%, -20%); }
}
.rarity-label {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  background: #f4f4f5;
}
.result-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin: 12px 0;
}
.result-name {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin: 6px 0;
}
.result-desc {
  font-size: 13px;
  color: #909399;
  margin-bottom: 16px;
}
.result-footer {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
