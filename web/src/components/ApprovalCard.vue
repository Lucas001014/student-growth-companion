<template>
  <el-card class="approval-card" shadow="hover">
    <div class="approval-header">
      <el-tag :type="typeTag" size="small" effect="light">{{ typeLabel }}</el-tag>
      <span class="time">{{ time }}</span>
    </div>
    <div class="approval-body">
      <img :src="student.avatar || defaultAvatar" class="student-avatar" :alt="student.name" />
      <div class="student-info">
        <h4 class="student-name">{{ student.name }}</h4>
        <p class="student-id">学号：{{ student.studentId || '-' }}</p>
      </div>
    </div>
    <div class="approval-detail">
      <p class="detail-title">{{ title }}</p>
      <p class="detail-text">{{ detail }}</p>
      <div v-if="reason" class="detail-reason">
        <span class="reason-label">备注：</span>{{ reason }}
      </div>
    </div>
    <div class="approval-actions" v-if="status === 'pending'">
      <el-button type="success" :loading="loadingApprove" @click="handleApprove">通过</el-button>
      <el-button type="danger" plain :loading="loadingReject" @click="handleReject">拒绝</el-button>
    </div>
    <div class="approval-status" v-else>
      <el-tag :type="status === 'approved' ? 'success' : 'info'" size="large">
        {{ status === 'approved' ? '已通过' : '已拒绝' }}
      </el-tag>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  id?: string | number;
  type?: 'skin' | 'honor' | 'blindbox' | 'badges' | 'other';
  title: string;
  detail: string;
  reason?: string;
  time?: string;
  status?: 'pending' | 'approved' | 'rejected';
  loadingApprove?: boolean;
  loadingReject?: boolean;
  student: {
    name: string;
    studentId?: string;
    avatar?: string;
  };
}>(), {
  type: 'skin',
  status: 'pending',
  time: ''
});

const emit = defineEmits<{
  (e: 'approve', payload: { id?: string | number }): void;
  (e: 'reject', payload: { id?: string | number }): void;
}>();

const typeLabelMap: Record<string, string> = {
  skin: '皮肤申请',
  honor: '荣誉申请',
  blindbox: '盲盒奖励',
  badges: '身份标识',
  other: '其他申请'
};

const typeTagMap: Record<string, any> = {
  skin: 'primary',
  honor: 'warning',
  blindbox: 'danger',
  badges: 'success',
  other: 'info'
};

const typeLabel = computed(() => typeLabelMap[props.type] || '申请');
const typeTag = computed(() => typeTagMap[props.type] || 'info');

const defaultAvatar = 'https://via.placeholder.com/60?text=U';

const handleApprove = () => emit('approve', { id: props.id });
const handleReject = () => emit('reject', { id: props.id });
</script>

<style scoped>
.approval-card {
  border-radius: 10px;
}
.approval-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.time {
  font-size: 12px;
  color: #909399;
}
.approval-body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.student-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
}
.student-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px;
}
.student-id {
  font-size: 12px;
  color: #909399;
  margin: 0;
}
.approval-detail {
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  margin: 10px 0;
}
.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 6px;
}
.detail-text {
  font-size: 13px;
  color: #606266;
  margin: 0 0 6px;
  line-height: 1.5;
}
.detail-reason {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed #e4e7ed;
}
.reason-label {
  color: #e6a23c;
  font-weight: 600;
}
.approval-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.approval-status {
  text-align: right;
}
</style>
