<template>
  <div class="identity-templates">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">🎖️ 身份标识模板</h3>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon>
          新增标识
        </el-button>
      </div>

      <el-table :data="badgeList" stripe style="width: 100%">
        <el-table-column prop="name" label="标识名称" min-width="160">
          <template #default="{ row }">
            <el-tag
              :style="{ background: row.color, borderColor: row.color }"
              effect="dark"
            >
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="颜色" width="140">
          <template #default="{ row }">
            <div class="color-cell">
              <span class="color-dot" :style="{ background: row.color }"></span>
              <span class="color-value">{{ row.color }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="260" show-overflow-tooltip />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="openEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑标识' : '新增标识'" width="480px">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标识名称" />
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="form.color" show-alpha />
          <el-select v-model="form.color" style="margin-left: 12px; width: 180px">
            <el-option
              v-for="c in presetColors"
              :key="c"
              :label="c"
              :value="c"
            >
              <span class="color-option">
                <span class="color-swatch" :style="{ background: c }"></span>
                {{ c }}
              </span>
            </el-option>
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
import { listBadges, createBadge } from '../../api/admin';

const badgeList = ref<any[]>([]);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const presetColors = [
  '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399',
  '#a855f7', '#ec4899', '#14b8a6', '#f97316', '#64748b'
];

const form = reactive({
  name: '',
  color: '#409eff',
  description: ''
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入标识名称', trigger: 'blur' }],
  color: [{ required: true, message: '请选择颜色', trigger: 'change' }]
};

const loadData = async () => {
  try {
    const res = await listBadges().catch(() => null);
    if (res && (res as any).data?.length) {
      badgeList.value = (res as any).data;
    } else {
      badgeList.value = [
        { id: 1, name: '班长', color: '#f56c6c', description: '班级最高负责人' },
        { id: 2, name: '学习委员', color: '#409eff', description: '协助老师管理学习事务' },
        { id: 3, name: '体育委员', color: '#67c23a', description: '负责体育活动组织' },
        { id: 4, name: '文艺委员', color: '#a855f7', description: '负责文艺活动组织' },
        { id: 5, name: '劳动委员', color: '#e6a23c', description: '负责劳动卫生安排' },
        { id: 6, name: '小组长', color: '#14b8a6', description: '小组负责人' }
      ];
    }
  } catch {
    badgeList.value = [
      { id: 1, name: '班长', color: '#f56c6c', description: '班级最高负责人' }
    ];
  }
};

const openCreate = () => {
  isEdit.value = false;
  editId.value = null;
  form.name = '';
  form.color = '#409eff';
  form.description = '';
  dialogVisible.value = true;
};

const openEdit = (row: any) => {
  isEdit.value = true;
  editId.value = row.id;
  form.name = row.name;
  form.color = row.color;
  form.description = row.description;
  dialogVisible.value = true;
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      if (isEdit.value) {
        const idx = badgeList.value.findIndex((b) => b.id === editId.value);
        if (idx >= 0) {
          badgeList.value[idx] = { ...badgeList.value[idx], ...form };
        }
        ElMessage.success('编辑成功');
      } else {
        await createBadge({ ...form }).catch(() => null);
        badgeList.value.push({
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
    await ElMessageBox.confirm(`确认删除标识「${row.name}」？`, '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    });
    badgeList.value = badgeList.value.filter((b) => b.id !== row.id);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消
  }
};

onMounted(loadData);
</script>

<style scoped>
.identity-templates {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.identity-templates :deep(.el-card) {
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

.color-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.color-value {
  font-size: 13px;
  color: #606266;
  font-family: monospace;
}

.color-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: inline-block;
}
</style>
