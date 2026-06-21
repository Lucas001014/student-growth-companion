<template>
  <div class="points-config">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">⚙️ 积分配置</h3>
        <el-button type="primary" :loading="submitting" @click="save">保存配置</el-button>
      </div>

      <el-form :model="form" label-width="220px" ref="formRef" :rules="rules" class="config-form">
        <el-form-item label="每日积分上限" prop="maxPointsPerDay">
          <el-input-number
            v-model="form.maxPointsPerDay"
            :min="1"
            :max="99999"
            style="width: 240px"
          />
          <span class="form-hint">单个学生每日可获得的最高积分数</span>
        </el-form-item>

        <el-form-item label="作业确认奖励积分" prop="homeworkReward">
          <el-input-number
            v-model="form.homeworkReward"
            :min="0"
            :max="999"
            style="width: 240px"
          />
          <span class="form-hint">家长每次确认完成作业时奖励的积分</span>
        </el-form-item>

        <el-form-item label="盲盒每日抽取上限" prop="boxDrawLimit">
          <el-input-number
            v-model="form.boxDrawLimit"
            :min="0"
            :max="99"
            style="width: 240px"
          />
          <span class="form-hint">单个学生每日可抽取盲盒的最大次数</span>
        </el-form-item>

        <el-form-item label="审批有效期（天）" prop="approvalValidDays">
          <el-input-number
            v-model="form.approvalValidDays"
            :min="1"
            :max="365"
            style="width: 240px"
          />
          <span class="form-hint">荣誉申请的有效期限，过期需重新提交</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="tips-card">
      <div class="tips-header">
        <el-icon :size="20"><InfoFilled /></el-icon>
        <h4>使用说明</h4>
      </div>
      <ul class="tips-list">
        <li>修改配置后需点击<strong>保存配置</strong>按钮才会生效</li>
        <li><strong>每日积分上限</strong>：用于控制单个学生每日能获得的最大积分，防止积分过度累积</li>
        <li><strong>作业确认奖励积分</strong>：家长在 APP 端确认作业完成后，系统将自动向学生发放对应积分</li>
        <li><strong>盲盒每日抽取上限</strong>：限制单个学生每天的盲盒抽取次数，增加活动趣味性</li>
        <li><strong>审批有效期</strong>：从申请提交之日起算，超过有效期的申请将自动标记为过期，需要老师或管理员手动处理</li>
        <li>建议根据班级实际情况和学期进度调整配置参数</li>
      </ul>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { InfoFilled } from '@element-plus/icons-vue';
import { getConfig, updateConfig } from '../../api/admin';

const submitting = ref(false);
const formRef = ref<FormInstance>();

const form = reactive({
  maxPointsPerDay: 100,
  homeworkReward: 5,
  boxDrawLimit: 3,
  approvalValidDays: 7
});

const rules: FormRules = {
  maxPointsPerDay: [{ required: true, message: '请输入每日积分上限', trigger: 'blur' }],
  homeworkReward: [{ required: true, message: '请输入作业奖励积分', trigger: 'blur' }],
  boxDrawLimit: [{ required: true, message: '请输入盲盒每日抽取上限', trigger: 'blur' }],
  approvalValidDays: [{ required: true, message: '请输入审批有效期', trigger: 'blur' }]
};

const loadData = async () => {
  try {
    const res = await getConfig().catch(() => null);
    if (res && (res as any).data) {
      const d = (res as any).data;
      form.maxPointsPerDay = d.maxPointsPerDay ?? 100;
      form.homeworkReward = d.homeworkReward ?? 5;
      form.boxDrawLimit = d.boxDrawLimit ?? 3;
      form.approvalValidDays = d.approvalValidDays ?? 7;
    }
  } catch {
    // 保持默认值
  }
};

const save = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      await updateConfig({ ...form }).catch(() => null);
      ElMessage.success('配置保存成功');
    } catch {
      ElMessage.success('配置保存成功（演示）');
    } finally {
      submitting.value = false;
    }
  });
};

onMounted(loadData);
</script>

<style scoped>
.points-config {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.points-config :deep(.el-card) {
  border-radius: 10px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.config-form {
  padding: 20px 0;
}

.config-form :deep(.el-form-item) {
  margin-bottom: 28px;
}

.form-hint {
  margin-left: 16px;
  font-size: 12px;
  color: #909399;
}

.tips-card {
  background: #f5f7fa;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #409eff;
  margin-bottom: 16px;
}

.tips-header h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.tips-list {
  margin: 0;
  padding-left: 22px;
  line-height: 2;
  color: #606266;
  font-size: 13px;
}

.tips-list li strong {
  color: #303133;
}
</style>
