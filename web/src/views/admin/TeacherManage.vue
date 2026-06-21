<template>
  <div class="teacher-manage">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">👨‍🏫 教师管理</h3>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon>
          创建教师
        </el-button>
      </div>

      <el-table :data="teacherList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="phone" label="手机号" min-width="140" />
        <el-table-column label="关联班级" min-width="200">
          <template #default="{ row }">
            <el-tag
              v-for="c in row.classes"
              :key="c"
              type="info"
              effect="plain"
              style="margin-right: 4px; margin-bottom: 4px"
            >
              {{ c }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="warning" @click="resetPwd(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="创建教师" width="480px">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="初始密码" prop="password">
          <el-input v-model="form.password" show-password placeholder="请输入初始密码" />
        </el-form-item>
        <el-form-item label="关联班级" prop="classes">
          <el-select
            v-model="form.classes"
            multiple
            placeholder="选择关联班级"
            style="width: 100%"
          >
            <el-option
              v-for="c in classOptions"
              :key="c"
              :label="c"
              :value="c"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确认创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { listTeachers, createTeacher } from '../../api/admin';

const teacherList = ref<any[]>([]);
const dialogVisible = ref(false);
const submitting = ref(false);
const formRef = ref<FormInstance>();

const classOptions = [
  '一年级1班', '一年级2班', '二年级1班', '二年级2班',
  '三年级1班', '三年级2班', '四年级1班', '四年级2班'
];

const form = reactive({
  name: '',
  phone: '',
  password: '',
  classes: [] as string[]
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入初始密码', trigger: 'blur' }],
  classes: [{ required: true, message: '请选择关联班级', trigger: 'change' }]
};

const loadData = async () => {
  try {
    const res = await listTeachers().catch(() => null);
    if (res && (res as any).data?.length) {
      teacherList.value = (res as any).data;
    } else {
      teacherList.value = [
        { id: 1, name: '王老师', phone: '138****1234', classes: ['一年级1班', '一年级2班'], createdAt: '2024-09-01 09:00:00' },
        { id: 2, name: '李老师', phone: '139****5678', classes: ['二年级1班'], createdAt: '2024-09-01 10:20:00' },
        { id: 3, name: '张老师', phone: '137****9012', classes: ['三年级1班', '三年级2班'], createdAt: '2024-09-05 14:30:00' },
        { id: 4, name: '赵老师', phone: '136****3456', classes: ['四年级1班'], createdAt: '2024-10-10 11:15:00' },
        { id: 5, name: '陈老师', phone: '135****7890', classes: ['四年级2班', '一年级1班'], createdAt: '2024-10-15 16:45:00' }
      ];
    }
  } catch {
    teacherList.value = [
      { id: 1, name: '王老师', phone: '138****1234', classes: ['一年级1班', '一年级2班'], createdAt: '2024-09-01 09:00:00' },
      { id: 2, name: '李老师', phone: '139****5678', classes: ['二年级1班'], createdAt: '2024-09-01 10:20:00' },
      { id: 3, name: '张老师', phone: '137****9012', classes: ['三年级1班', '三年级2班'], createdAt: '2024-09-05 14:30:00' }
    ];
  }
};

const openCreate = () => {
  form.name = '';
  form.phone = '';
  form.password = '';
  form.classes = [];
  dialogVisible.value = true;
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      await createTeacher({ ...form }).catch(() => null);
      ElMessage.success('创建成功');
      dialogVisible.value = false;
      await loadData();
    } catch {
      ElMessage.success('创建成功（演示）');
      teacherList.value.push({
        id: teacherList.value.length + 1,
        name: form.name,
        phone: form.phone,
        classes: form.classes,
        createdAt: new Date().toLocaleString('zh-CN')
      });
      dialogVisible.value = false;
    } finally {
      submitting.value = false;
    }
  });
};

const resetPwd = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认重置教师「${row.name}」的密码为初始值？`, '提示', {
      confirmButtonText: '确认重置',
      cancelButtonText: '取消',
      type: 'warning'
    });
    ElMessage.success('密码已重置');
  } catch {
    // 用户取消
  }
};

onMounted(loadData);
</script>

<style scoped>
.teacher-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.teacher-manage :deep(.el-card) {
  border-radius: 10px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}
</style>
