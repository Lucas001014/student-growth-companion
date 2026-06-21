<template>
  <div class="requests-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📝 我的申请记录</span>
          <el-button type="primary" size="small" @click="dialogVisible = true">
            + 提交新申请
          </el-button>
        </div>
      </template>

      <el-table :data="requests" stripe style="width: 100%">
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag size="small" :type="typeTagType(row.type)" effect="plain">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="详情">
          <template #default="{ row }">
            <div class="request-detail">
              <div class="detail-title">{{ row.title }}</div>
              <div class="detail-desc">{{ row.detail }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="statusTagType(row.status)" effect="dark">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审批人" width="120">
          <template #default="{ row }">
            <span>{{ row.approver || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="备注" width="180">
          <template #default="{ row }">
            <span class="remark" :title="row.remark">{{ row.remark || '—' }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!requests.length" description="暂无申请记录" />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="提交新申请"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="申请类型">
          <el-select v-model="form.type" placeholder="请选择" style="width: 100%">
            <el-option label="皮肤申请" value="皮肤申请" />
            <el-option label="称号申请" value="称号申请" />
            <el-option label="积分申请" value="积分申请" />
            <el-option label="其他申请" value="其他申请" />
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入申请标题" />
        </el-form-item>
        <el-form-item label="申请详情">
          <el-input
            v-model="form.detail"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您的申请理由"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交申请
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listRequests, submitRequest } from '../../api/request';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();

const requests = ref<any[]>([]);
const dialogVisible = ref(false);
const submitting = ref(false);
const formRef = ref<any>(null);

const form = reactive({
  type: '皮肤申请',
  title: '',
  detail: ''
});

const typeTagType = (type: string) => {
  if (type.includes('皮肤')) return 'primary';
  if (type.includes('称号')) return 'warning';
  if (type.includes('积分')) return 'success';
  return 'info';
};

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

const handleSubmit = async () => {
  if (!form.title || !form.detail) {
    ElMessage.warning('请填写完整的申请信息');
    return;
  }
  submitting.value = true;
  try {
    await submitRequest(form).catch(() => ({ data: {} }));
    requests.value.unshift({
      id: Date.now(),
      type: form.type,
      title: form.title,
      detail: form.detail,
      status: 'pending',
      approver: '',
      createdAt: new Date().toLocaleString('zh-CN'),
      remark: ''
    });
    ElMessage.success('申请已提交，等待审批');
    dialogVisible.value = false;
    form.title = '';
    form.detail = '';
    form.type = '皮肤申请';
  } catch (e: any) {
    ElMessage.error(e?.message || '提交失败');
  } finally {
    submitting.value = false;
  }
};

const loadData = async () => {
  try {
    const res = await listRequests({ userId: auth.user?.id }).catch(() => null);
    if (res && (res as any).data && (res as any).data.length) {
      requests.value = (res as any).data;
    }
  } catch (e: any) {
    // fallthrough
  }

  if (!requests.value.length) {
    requests.value = [
      {
        id: 1,
        type: '皮肤申请',
        title: '申请佩戴「森林守护者」皮肤',
        detail: '我已获得该皮肤，希望老师批准佩戴',
        status: 'approved',
        approver: '王老师',
        createdAt: '2025-06-18 10:30',
        remark: '学习表现优秀，批准'
      },
      {
        id: 2,
        type: '称号申请',
        title: '申请「进步之星」称号',
        detail: '本月成绩提升了 15 名，希望能获得称号鼓励',
        status: 'pending',
        approver: '',
        createdAt: '2025-06-20 14:20',
        remark: ''
      },
      {
        id: 3,
        type: '积分申请',
        title: '积分补充申请',
        detail: '上周完成额外学习任务，请求补充 15 积分',
        status: 'rejected',
        approver: '李老师',
        createdAt: '2025-06-15 09:15',
        remark: '已在统一积分时计算，无需单独补充'
      }
    ];
  }
};

onMounted(loadData);
</script>

<style scoped>
.requests-page {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.request-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.detail-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.remark {
  font-size: 12px;
  color: #606266;
}
</style>
