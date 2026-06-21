<template>
  <div class="homework-confirm">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📝 确认作业完成情况</span>
        </div>
      </template>

      <el-alert
        title="请如实确认孩子的作业完成情况，这将影响孩子的积分和称号获得"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />

      <el-form :model="form" label-width="120px" ref="formRef">
        <el-form-item label="科 目">
          <el-select v-model="form.subject" placeholder="请选择科目" style="width: 100%; max-width: 400px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="科学" value="科学" />
            <el-option label="美术" value="美术" />
            <el-option label="体育" value="体育" />
          </el-select>
        </el-form-item>

        <el-form-item label="作业日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择作业日期"
            style="width: 100%; max-width: 400px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="作业内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请描述孩子完成的作业内容、题目数量等..."
          />
        </el-form-item>

        <el-form-item label="完成质量">
          <el-radio-group v-model="form.quality">
            <el-radio-button value="excellent">优秀 (+15 分)</el-radio-button>
            <el-radio-button value="good">良好 (+10 分)</el-radio-button>
            <el-radio-button value="normal">一般 (+5 分)</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="家长备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请填写对孩子完成作业的评价、建议等..."
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            提交确认
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" style="margin-top: 20px">
      <template #header>
        <div class="card-header">
          <span class="card-title">📌 最近提交</span>
        </div>
      </template>
      <el-table :data="recentList" stripe style="width: 100%">
        <el-table-column prop="subject" label="科目" width="100">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.subject }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="content" label="作业内容" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'"
              effect="dark"
            >
              {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已拒绝' : '待审批' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="奖励积分" width="100" align="right">
          <template #default="{ row }">
            <span v-if="row.status === 'approved'" style="color: #67c23a; font-weight: 600;">+{{ row.points }}</span>
            <span v-else style="color: #909399;">—</span>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!recentList.length" description="暂无提交记录" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { confirmHomework } from '../../../api/homework';

const router = useRouter();
const formRef = ref<any>(null);
const submitting = ref(false);

const form = reactive({
  subject: '',
  date: '',
  content: '',
  quality: 'good',
  remark: ''
});

const recentList = ref<any[]>([]);

const pointsByQuality: Record<string, number> = {
  excellent: 15,
  good: 10,
  normal: 5
};

const handleSubmit = async () => {
  if (!form.subject || !form.content) {
    ElMessage.warning('请填写科目和作业内容');
    return;
  }
  submitting.value = true;
  try {
    await confirmHomework({
      subject: form.subject,
      date: form.date,
      content: form.content,
      quality: form.quality,
      remark: form.remark,
      points: pointsByQuality[form.quality]
    }).catch(() => ({ data: {} }));

    recentList.value.unshift({
      id: Date.now(),
      subject: form.subject,
      date: form.date || new Date().toISOString().slice(0, 10),
      content: form.content,
      status: 'pending',
      points: pointsByQuality[form.quality]
    });

    ElMessage.success('作业确认已提交，等待老师审批');
    await ElMessageBox.confirm('是否跳转到确认历史页面查看？', '提交成功', {
      confirmButtonText: '去查看',
      cancelButtonText: '继续填写',
      type: 'success'
    });
    router.push('/parent/history');
  } catch (e: any) {
    ElMessage.error(e?.message || '提交失败');
  } finally {
    submitting.value = false;
  }
};

const handleReset = () => {
  form.subject = '';
  form.date = '';
  form.content = '';
  form.quality = 'good';
  form.remark = '';
};

onMounted(() => {
  recentList.value = [
    {
      id: 1,
      subject: '数学',
      date: '2025-06-20',
      content: '完成了第35页的10道计算题',
      status: 'approved',
      points: 15
    },
    {
      id: 2,
      subject: '语文',
      date: '2025-06-19',
      content: '朗读并背诵《静夜思》',
      status: 'approved',
      points: 10
    },
    {
      id: 3,
      subject: '英语',
      date: '2025-06-18',
      content: 'Unit 5 单词默写',
      status: 'pending',
      points: 10
    }
  ];
});
</script>

<style scoped>
.homework-confirm {
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
</style>
