<template>
  <div class="confirm-history">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📋 作业确认历史</span>
          <div class="filter-area">
            <el-select v-model="statusFilter" placeholder="全部状态" size="small" style="width: 140px" clearable @change="handleFilter">
              <el-option label="待审批" value="pending" />
              <el-option label="已通过" value="approved" />
              <el-option label="已拒绝" value="rejected" />
            </el-select>
            <el-select v-model="subjectFilter" placeholder="全部科目" size="small" style="width: 140px" clearable @change="handleFilter">
              <el-option label="语文" value="语文" />
              <el-option label="数学" value="数学" />
              <el-option label="英语" value="英语" />
              <el-option label="科学" value="科学" />
              <el-option label="美术" value="美术" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredList" stripe style="width: 100%">
        <el-table-column label="日期" width="130">
          <template #default="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目" width="100">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.subject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="作业描述" show-overflow-tooltip />
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="statusTagType(row.status)"
              effect="dark"
            >
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="奖励积分" width="110" align="right">
          <template #default="{ row }">
            <span v-if="row.status === 'approved'" class="points-positive">+{{ row.points }}</span>
            <span v-else-if="row.status === 'rejected'" class="points-zero">—</span>
            <span v-else class="points-pending">待定</span>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" width="100">
          <template #default="{ row }">
            <span>{{ row.approver || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="审批备注">
          <template #default="{ row }">
            <span v-if="row.remark" class="remark-text">{{ row.remark }}</span>
            <span v-else style="color: #c0c4cc;">—</span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!filteredList.length" description="暂无确认记录" />

      <div class="summary-bar" v-if="historyList.length">
        <div class="summary-item">
          <span class="summary-label">总 数：</span>
          <span class="summary-value">{{ historyList.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">已通过：</span>
          <span class="summary-value success">{{ approvedCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">待审批：</span>
          <span class="summary-value warning">{{ pendingCount }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">累计积分：</span>
          <span class="summary-value primary">+{{ totalPoints }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../../stores/auth';

const auth = useAuthStore();

const statusFilter = ref('');
const subjectFilter = ref('');
const historyList = ref<any[]>([]);

const statusTagType = (status: string) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'danger';
  return 'warning';
};

const statusLabel = (status: string) => {
  if (status === 'approved') return '已通过';
  if (status === 'rejected') return '已拒绝';
  return '待审批';
};

const filteredList = computed(() => {
  return historyList.value.filter(item => {
    if (statusFilter.value && item.status !== statusFilter.value) return false;
    if (subjectFilter.value && item.subject !== subjectFilter.value) return false;
    return true;
  });
});

const approvedCount = computed(() =>
  historyList.value.filter(i => i.status === 'approved').length
);
const pendingCount = computed(() =>
  historyList.value.filter(i => i.status === 'pending').length
);
const totalPoints = computed(() =>
  historyList.value.filter(i => i.status === 'approved').reduce((sum, i) => sum + (i.points || 0), 0)
);

const handleFilter = () => {
  // Filter is handled by computed, but we want to trigger reactivity
};

onMounted(() => {
  if (!historyList.value.length) {
    historyList.value = [
      {
        id: 1,
        date: '2025-06-20',
        subject: '数学',
        description: '完成了第35页的10道计算题，字迹工整',
        status: 'approved',
        points: 15,
        approver: '王老师',
        remark: '完成质量很好，继续保持！'
      },
      {
        id: 2,
        date: '2025-06-19',
        subject: '语文',
        description: '朗读并背诵《静夜思》',
        status: 'approved',
        points: 10,
        approver: '李老师',
        remark: '朗读流畅，背诵准确'
      },
      {
        id: 3,
        date: '2025-06-18',
        subject: '英语',
        description: 'Unit 5 单词默写',
        status: 'pending',
        points: 10,
        approver: '',
        remark: ''
      },
      {
        id: 4,
        date: '2025-06-17',
        subject: '科学',
        description: '完成了科学实验报告，并上传了实验照片',
        status: 'approved',
        points: 15,
        approver: '张老师',
        remark: '实验步骤描述详细，观察记录完整'
      },
      {
        id: 5,
        date: '2025-06-15',
        subject: '数学',
        description: '数学练习册第28-30页',
        status: 'rejected',
        points: 0,
        approver: '王老师',
        remark: '有3道题答案错误，请重新检查后提交'
      },
      {
        id: 6,
        date: '2025-06-14',
        subject: '美术',
        description: '上传了绘画作品《我的家园》',
        status: 'approved',
        points: 10,
        approver: '陈老师',
        remark: '色彩搭配很漂亮，有创意！'
      },
      {
        id: 7,
        date: '2025-06-12',
        subject: '语文',
        description: '完成本周的阅读理解练习',
        status: 'approved',
        points: 10,
        approver: '李老师',
        remark: ''
      },
      {
        id: 8,
        date: '2025-06-10',
        subject: '英语',
        description: 'Unit 4 单词学习与听写',
        status: 'pending',
        points: 10,
        approver: '',
        remark: ''
      }
    ];
  }
});
</script>

<style scoped>
.confirm-history {
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

.filter-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.points-positive {
  color: #67c23a;
  font-weight: 600;
}

.points-pending {
  color: #e6a23c;
}

.points-zero {
  color: #c0c4cc;
}

.remark-text {
  font-size: 12px;
  color: #606266;
}

.summary-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-label {
  font-size: 13px;
  color: #909399;
}

.summary-value {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.summary-value.success { color: #67c23a; }
.summary-value.warning { color: #e6a23c; }
.summary-value.primary { color: #409eff; }
</style>
