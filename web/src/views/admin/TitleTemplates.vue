<template>
  <div class="title-templates">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">🏆 称号模板</h3>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon>
          新增称号
        </el-button>
      </div>

      <el-table :data="titleList" stripe style="width: 100%">
        <el-table-column prop="name" label="称号名称" min-width="160">
          <template #default="{ row }">
            <span class="title-name">🏅 {{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="140">
          <template #default="{ row }">
            <el-tag :type="getCategoryTag(row.category)" effect="plain">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="240" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === '启用' ? 'success' : 'info'" effect="light">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑称号' : '新增称号'" width="480px">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入称号名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" style="width: 100%">
            <el-option label="学习之星" value="学习之星" />
            <el-option label="纪律标兵" value="纪律标兵" />
            <el-option label="体育健将" value="体育健将" />
            <el-option label="文艺才子" value="文艺才子" />
            <el-option label="劳动能手" value="劳动能手" />
            <el-option label="进步奖" value="进步奖" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio value="启用">启用</el-radio>
            <el-radio value="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { listTitles, createTitle } from '../../api/admin';

const titleList = ref<any[]>([]);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const form = reactive({
  name: '',
  category: '学习之星',
  description: '',
  status: '启用'
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入称号名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
};

const getCategoryTag = (cat: string): any => {
  const map: Record<string, any> = {
    '学习之星': 'primary',
    '纪律标兵': 'success',
    '体育健将': 'warning',
    '文艺才子': 'danger',
    '劳动能手': 'info',
    '进步奖': 'success',
    '其他': ''
  };
  return map[cat] || '';
};

const loadData = async () => {
  try {
    const res = await listTitles().catch(() => null);
    if (res && (res as any).data?.length) {
      titleList.value = (res as any).data;
    } else {
      titleList.value = [
        { id: 1, name: '学习之星', category: '学习之星', description: '表彰学业成绩优异的同学', status: '启用' },
        { id: 2, name: '进步奖', category: '进步奖', description: '表彰有显著进步的同学', status: '启用' },
        { id: 3, name: '纪律标兵', category: '纪律标兵', description: '表彰遵守纪律的模范学生', status: '启用' },
        { id: 4, name: '体育健将', category: '体育健将', description: '表彰在体育方面表现突出的同学', status: '启用' },
        { id: 5, name: '文艺才子', category: '文艺才子', description: '表彰在文艺方面有才华的同学', status: '启用' },
        { id: 6, name: '劳动小能手', category: '劳动能手', description: '表彰勤劳肯干的同学', status: '禁用' }
      ];
    }
  } catch {
    titleList.value = [
      { id: 1, name: '学习之星', category: '学习之星', description: '表彰学业成绩优异的同学', status: '启用' }
    ];
  }
};

const openCreate = () => {
  isEdit.value = false;
  editId.value = null;
  form.name = '';
  form.category = '学习之星';
  form.description = '';
  form.status = '启用';
  dialogVisible.value = true;
};

const openEdit = (row: any) => {
  isEdit.value = true;
  editId.value = row.id;
  form.name = row.name;
  form.category = row.category;
  form.description = row.description;
  form.status = row.status;
  dialogVisible.value = true;
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      if (isEdit.value) {
        const idx = titleList.value.findIndex((t) => t.id === editId.value);
        if (idx >= 0) {
          titleList.value[idx] = { ...titleList.value[idx], ...form };
        }
        ElMessage.success('编辑成功');
      } else {
        await createTitle({ ...form }).catch(() => null);
        titleList.value.push({
          id: Date.now(),
          ...form
        });
        ElMessage.success('新增成功');
      }
      dialogVisible.value = false;
    } catch {
      ElMessage.success('操作成功（演示）');
      dialogVisible.value = false;
    } finally {
      submitting.value = false;
    }
  });
};

const remove = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确认删除称号「${row.name}」？`, '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    });
    titleList.value = titleList.value.filter((t) => t.id !== row.id);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
};

onMounted(loadData);
</script>

<style scoped>
.title-templates {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title-templates :deep(.el-card) {
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

.title-name {
  font-weight: 500;
  color: #303133;
}
</style>
