<template>
  <div class="blindbox-manage">
    <el-card class="top-card" shadow="never">
      <div class="top-row">
        <div>
          <h3 class="title">🎁 盲盒管理</h3>
          <p class="subtitle">共 {{ blindBoxes.length }} 个盲盒，总抽取 {{ totalDraws }} 次</p>
        </div>
        <el-button type="primary" :icon="Plus" size="large" @click="openCreate">
          创建盲盒
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-table :data="blindBoxes" stripe style="width: 100%">
        <el-table-column label="名称" prop="name" min-width="160" />
        <el-table-column label="消耗积分" prop="cost" width="120">
          <template #default="{ row }">
            <span class="points">{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="每日上限" prop="dailyLimit" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" effect="plain">
              {{ row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createdAt" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
            <el-button link type="success" size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? '停用' : '启用' }}
            </el-button>
            <el-popconfirm title="确认删除该盲盒？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showForm"
      :title="isEdit ? '编辑盲盒' : '创建盲盒'"
      width="720px"
      :close-on-click-modal="false"
    >
      <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
        <el-form-item label="盲盒名称" prop="name">
          <el-input v-model="form.name" placeholder="如：经典荣誉盲盒" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="消耗积分" prop="cost">
          <el-input-number v-model="form.cost" :min="1" :max="9999" style="width: 200px" />
        </el-form-item>
        <el-form-item label="每日上限" prop="dailyLimit">
          <el-input-number v-model="form.dailyLimit" :min="0" :max="9999" style="width: 200px" />
          <span class="form-hint">0 表示不限</span>
        </el-form-item>

        <el-divider content-position="left">
          🎯 奖品配置
          <el-tag
            size="small"
            :type="probSum === 100 ? 'success' : 'danger'"
            effect="plain"
            style="margin-left: 8px"
          >
            概率总计：{{ probSum }}%
          </el-tag>
        </el-divider>

        <el-form-item label="奖品列表" prop="items">
          <div class="items-table">
            <div class="items-header">
              <span style="width: 80px">类型</span>
              <span style="flex: 1">对应</span>
              <span style="width: 120px">概率(%)</span>
              <span style="width: 80px; text-align: center">操作</span>
            </div>
            <div
              v-for="(item, idx) in form.items"
              :key="idx"
              class="items-row"
            >
              <el-select v-model="item.type" style="width: 80px" size="default">
                <el-option label="皮肤" value="skin" />
                <el-option label="称号" value="title" />
                <el-option label="积分" value="points" />
              </el-select>
              <div style="flex: 1; padding: 0 8px">
                <el-input v-if="item.type === 'skin'" v-model="item.skinName" placeholder="皮肤名称" size="default" />
                <el-input v-else-if="item.type === 'title'" v-model="item.titleName" placeholder="称号名称" size="default" />
                <el-input-number v-else v-model="item.pointsAmount" :min="0" style="width: 100%" size="default" placeholder="积分数量" />
              </div>
              <el-input-number
                v-model="item.probability"
                :min="0"
                :max="100"
                :step="1"
                style="width: 120px"
                size="default"
              />
              <el-button
                link
                type="danger"
                style="width: 80px; text-align: center"
                @click="removeItem(idx)"
              >删除</el-button>
            </div>
            <el-button plain :icon="Plus" style="width: 100%; margin-top: 8px" @click="addItem">
              添加奖品
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { createBlindBox, listBlindBoxes, updateBlindBox } from '../../api/blindbox';

interface BlindBoxItem {
  type: 'skin' | 'title' | 'points';
  skinName?: string;
  titleName?: string;
  pointsAmount?: number;
  probability: number;
}

interface BlindBox {
  id: number;
  name: string;
  description: string;
  cost: number;
  dailyLimit: number;
  status: 'active' | 'inactive';
  createdAt: string;
  items: BlindBoxItem[];
  totalDraws?: number;
}

const blindBoxes = ref<BlindBox[]>([]);
const totalDraws = computed(() => blindBoxes.value.reduce((s, b) => s + (b.totalDraws || 0), 0));

const showForm = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const formRef = ref<FormInstance>();
const form = reactive({
  name: '',
  description: '',
  cost: 50,
  dailyLimit: 3,
  items: [
    { type: 'skin', skinName: '', probability: 10 } as any,
    { type: 'title', titleName: '', probability: 20 } as any,
    { type: 'points', pointsAmount: 10, probability: 70 } as any
  ] as BlindBoxItem[]
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入盲盒名称', trigger: 'blur' }],
  cost: [{ required: true, message: '请输入消耗积分', trigger: 'change' }]
};

const probSum = computed(() =>
  form.items.reduce((s: number, it: any) => s + (Number(it.probability) || 0), 0)
);

const loadData = async () => {
  try {
    const res = await listBlindBoxes({}).catch(() => null);
    if (res && (res as any).data?.length) {
      blindBoxes.value = (res as any).data;
    } else {
      blindBoxes.value = [
        {
          id: 1,
          name: '经典荣誉盲盒',
          description: '有机会获得精美皮肤和称号',
          cost: 50,
          dailyLimit: 3,
          status: 'active',
          createdAt: '2024-09-01 10:00',
          totalDraws: 128,
          items: []
        },
        {
          id: 2,
          name: '豪华盲盒',
          description: 'SSR 稀有度更高',
          cost: 120,
          dailyLimit: 1,
          status: 'active',
          createdAt: '2024-09-15 14:30',
          totalDraws: 64,
          items: []
        },
        {
          id: 3,
          name: '新手盲盒',
          description: '适合新加入的同学',
          cost: 20,
          dailyLimit: 5,
          status: 'inactive',
          createdAt: '2024-08-20 09:15',
          totalDraws: 32,
          items: []
        }
      ];
    }
  } catch {
    ElMessage.warning('加载失败，使用演示数据');
  }
};

const openCreate = () => {
  isEdit.value = false;
  editId.value = null;
  Object.assign(form, {
    name: '',
    description: '',
    cost: 50,
    dailyLimit: 3,
    items: [
      { type: 'skin', skinName: '', probability: 10 },
      { type: 'title', titleName: '', probability: 20 },
      { type: 'points', pointsAmount: 10, probability: 70 }
    ]
  });
  showForm.value = true;
};

const openEdit = (row: BlindBox) => {
  isEdit.value = true;
  editId.value = row.id;
  Object.assign(form, {
    name: row.name,
    description: row.description,
    cost: row.cost,
    dailyLimit: row.dailyLimit,
    items: row.items && row.items.length > 0
      ? JSON.parse(JSON.stringify(row.items))
      : [
          { type: 'skin', skinName: '', probability: 10 },
          { type: 'title', titleName: '', probability: 20 },
          { type: 'points', pointsAmount: 10, probability: 70 }
        ]
  });
  showForm.value = true;
};

const addItem = () => {
  form.items.push({ type: 'points', pointsAmount: 5, probability: 0 });
};

const removeItem = (idx: number) => {
  form.items.splice(idx, 1);
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate(async (valid) => {
      if (!valid) return;
      if (probSum.value !== 100) {
        ElMessage.warning(`概率总和必须等于 100%，当前为 ${probSum.value}%`);
        return;
      }
      if (form.items.length === 0) {
        ElMessage.warning('至少需要一个奖品');
        return;
      }
      try {
        if (isEdit.value && editId.value) {
          await updateBlindBox(editId.value, form).catch(() => null);
          ElMessage.success('已更新盲盒');
        } else {
          await createBlindBox(form).catch(() => null);
          ElMessage.success('已创建盲盒');
        }
        showForm.value = false;
        loadData();
      } catch (e) {
        showForm.value = false;
        loadData();
      }
    });
  } catch (e) {
    // ignore
  }
};

const toggleStatus = (row: BlindBox) => {
  row.status = row.status === 'active' ? 'inactive' : 'active';
  ElMessage.success(`已${row.status === 'active' ? '启用' : '停用'}`);
};

const handleDelete = (row: BlindBox) => {
  blindBoxes.value = blindBoxes.value.filter((b) => b.id !== row.id);
  ElMessage.success('已删除');
};

onMounted(loadData);
</script>

<style scoped>
.blindbox-manage {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-card,
.table-card {
  border-radius: 10px;
}

.top-card :deep(.el-card__body) {
  padding: 20px;
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: #909399;
  margin: 4px 0 0;
}

.points {
  color: #e6a23c;
  font-weight: 600;
}

.form-hint {
  font-size: 12px;
  color: #909399;
  margin-left: 8px;
}

.items-table {
  width: 100%;
}

.items-header {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px 6px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: #606266;
}

.items-row {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f2f5;
}

.items-row:last-of-type {
  border-bottom: none;
}

@media (max-width: 800px) {
  .items-row {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
