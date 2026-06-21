<template>
  <el-button
    :type="isParent ? 'primary' : 'default'"
    size="small"
    :icon="isParent ? UserFilled : User"
    @click="handleSwitch"
  >
    {{ isParent ? '家长模式' : '学生模式' }}
  </el-button>

  <el-dialog
    v-model="dialogVisible"
    title="切换家长模式"
    width="400px"
    :close-on-click-modal="false"
  >
    <el-alert type="info" :closable="false" show-icon style="margin-bottom: 16px">
      切换为家长模式需要输入家长密码，请联系班主任获取或在账号设置中配置。
    </el-alert>
    <el-form :model="form" label-width="90px">
      <el-form-item label="家长密码">
        <el-input
          v-model="form.password"
          type="password"
          show-password
          placeholder="请输入家长密码"
          @keyup.enter="handleConfirm"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">确认切换</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { User, UserFilled } from '@element-plus/icons-vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const dialogVisible = ref(false);
const loading = ref(false);
const form = ref({ password: '' });

const isParent = computed(() => auth.mode === 'parent');

const handleSwitch = async () => {
  if (isParent.value) {
    try {
      await auth.switchModeTo({ mode: 'student' });
      ElMessage.success('已切换到学生模式');
    } catch (e: any) {
      ElMessage.error(e?.message || '切换失败');
    }
    return;
  }
  form.value.password = '';
  dialogVisible.value = true;
};

const handleConfirm = async () => {
  if (!form.value.password) {
    ElMessage.warning('请输入家长密码');
    return;
  }
  loading.value = true;
  try {
    await auth.switchModeTo({ mode: 'parent', parentPassword: form.value.password });
    ElMessage.success('已切换到家长模式');
    dialogVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.message || '密码不正确');
  } finally {
    loading.value = false;
  }
};
</script>
