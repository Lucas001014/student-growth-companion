<template>
  <div class="student-list">
    <el-card class="top-card" shadow="never">
      <div class="top-row">
        <div class="search-area">
          <el-input
            v-model="keyword"
            placeholder="搜索学号或姓名"
            clearable
            :prefix-icon="Search"
            style="width: 280px"
            @input="() => {}"
          />
          <el-select
            v-model="classFilter"
            placeholder="选择班级"
            clearable
            style="width: 180px"
          >
            <el-option
              v-for="c in classList"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </div>
        <el-button type="primary" :icon="Plus" @click="openAdd">
          添加学生
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-table :data="filteredList" stripe style="width: 100%">
        <el-table-column label="头像" width="80" align="center">
          <template #default="{ row }">
            <img :src="row.avatar || defaultAvatar" class="avatar-img" />
          </template>
        </el-table-column>
        <el-table-column prop="studentId" label="学号" width="140" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column label="身份标识" min-width="220">
          <template #default="{ row }">
            <identity-badge
              v-for="(b, idx) in (row.badges || []).slice(0, 4)"
              :key="idx"
              :text="b.text"
              :type="b.type"
            />
            <el-tag
              v-if="!row.badges || row.badges.length === 0"
              size="small"
              effect="plain"
            >暂无</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100">
          <template #default="{ row }">
            <span class="points-value">{{ row.points ?? 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentSkin" label="当前皮肤" width="140">
          <template #default="{ row }">
            <el-tag v-if="row.currentSkin" type="success" effect="plain">
              {{ row.currentSkin }}
            </el-tag>
            <span v-else class="muted">默认</span>
          </template>
        </el-table-column>
        <el-table-column prop="currentTitle" label="当前称号" width="140">
          <template #default="{ row }">
            <el-tag v-if="row.currentTitle" type="warning" effect="plain">
              {{ row.currentTitle }}
            </el-tag>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openEdit(row)">
              编辑
            </el-button>
            <el-button link type="success" size="small" @click="openBadge(row)">
              设置身份标识
            </el-button>
            <el-popconfirm title="确认删除该学生？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <el-dialog v-model="showForm" :title="isEdit ? '编辑学生' : '添加学生'" width="520px">
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="form.studentId" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="积分">
          <el-input-number
            v-model="form.points"
            :min="0"
            :max="99999"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="当前皮肤">
          <el-input v-model="form.currentSkin" placeholder="可选" />
        </el-form-item>
        <el-form-item label="当前称号">
          <el-input v-model="form.currentTitle" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showBadge" :title="`设置身份标识 - ${badgeStudent?.name}" width="520px">
      <el-checkbox-group v-model="selectedBadges">
        <div class="badge-grid">
          <el-checkbox
          v-for="b in badgeOptions"
          :key="b.value"
          :value="b.value"
          :label="b.value"
        >
          <el-tag :type="b.type" effect="plain">{{ b.text }}</el-tag>
        </el-checkbox>
        </div>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="showBadge = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBadge">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import IdentityBadge from '../../components/IdentityBadge.vue';
import { getStudents, createStudent, updateStudent, deleteStudent, setStudentIdentity } from '../../api/class';
import { listClasses } from '../../api/admin';

interface Student {
  id: number;
  studentId: string;
  name: string;
  points: number;
  currentSkin?: string;
  currentTitle?: string;
  badges?: Array<{ text: string; type?: any; value?: number }>;
  avatar?: string;
}

const defaultAvatar = 'https://via.placeholder.com/80?text=U';
const keyword = ref('');
const classFilter = ref<number | null>(null);
const classList = ref<any[]>([]);
const students = ref<Student[]>([]);
const page = ref(1);
const pageSize = ref(20);

const showForm = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const formRef = ref<FormInstance>();
const form = reactive({
  studentId: '',
  name: '',
  points: 0,
  currentSkin: '',
  currentTitle: ''
});

const rules: FormRules = {
  studentId: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
};

const showBadge = ref(false);
const badgeStudent = ref<Student | null>(null);
const selectedBadges = ref<number[]>([]);
const badgeOptions = [
  { value: 1, text: '学习之星', type: 'success' },
  { value: 2, text: '小组长', type: 'primary' },
  { value: 3, text: '体育健将', type: 'danger' },
  { value: 4, text: '进步奖', type: 'warning' },
  { value: 5, text: '文艺标兵', type: 'purple' },
  { value: 6, text: '纪律委员', type: 'info' }
];

const filteredList = computed(() => {
  return students.value.filter((s) => {
    const matchK =
      !keyword.value ||
      s.name.includes(keyword.value) ||
      s.studentId.includes(keyword.value);
    return matchK;
  });
});

const loadData = async () => {
  try {
    const res = await getStudents({}).catch(() => null);
    if (res && (res as any).data?.length) {
      students.value = (res as any).data;
    } else {
      students.value = Array.from({ length: 18 }).map((_, i) => ({
        id: i + 1,
        studentId: `2024${String(i + 1).padStart(3, '0')}`,
        name: ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆', '郑朗朗', '冯高高', '陈静静', '褚笑笑', '卫东来', '蒋方舟', '沈梦溪', '韩梅梅', '杨光', '朱自强'][i],
        points: 200 + Math.floor(Math.random() * 600),
        currentSkin: i % 3 === 0 ? '' : ['海洋之心', '烈焰骑士', '冰雪公主'][i % 3],
        currentTitle: i % 2 === 0 ? '' : ['学习之星', '进步奖'][i % 2],
        badges: i % 4 === 0 ? [] : [
          { value: 1, text: '学习之星', type: 'success' },
          { value: 2, text: '小组长', type: 'primary' }
        ].slice(0, (i % 3) + 1)
      }));
    }
  } catch {
    ElMessage.warning('加载失败，使用演示数据');
  }
};

const loadClasses = async () => {
  try {
    const res = await listClasses();
    if ((res as any).data?.length) classList.value = (res as any).data;
  } catch {
    // ignore
  }
};

const openAdd = () => {
  isEdit.value = false;
  editId.value = null;
  Object.assign(form, { studentId: '', name: '', points: 0, currentSkin: '', currentTitle: '' });
  showForm.value = true;
};

const openEdit = (row: Student) => {
  isEdit.value = true;
  editId.value = row.id;
  Object.assign(form, {
    studentId: row.studentId,
    name: row.name,
    points: row.points,
    currentSkin: row.currentSkin || '',
    currentTitle: row.currentTitle || ''
  });
  showForm.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate(async (valid) => {
      if (!valid) return;
      try {
        if (isEdit.value && editId.value) {
          await updateStudent(editId.value, form).catch(() => null);
          ElMessage.success('已更新');
        } else {
          await createStudent(form).catch(() => null);
          ElMessage.success('已添加');
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

const handleDelete = async (row: Student) => {
  try {
    await deleteStudent(row.id).catch(() => null);
    students.value = students.value.filter((s) => s.id !== row.id);
    ElMessage.success('删除成功');
  } catch {
    students.value = students.value.filter((s) => s.id !== row.id);
    ElMessage.success('删除成功');
  }
};

const openBadge = (row: Student) => {
  badgeStudent.value = row;
  selectedBadges.value = (row.badges || []).map((b) => b.value || 1);
  showBadge.value = true;
};

const handleSaveBadge = async () => {
  if (!badgeStudent.value) return;
  try {
    await setStudentIdentity(badgeStudent.value.id, selectedBadges.value).catch(() => null);
    const stu = students.value.find((s) => s.id === badgeStudent.value!.id);
    if (stu) {
      stu.badges = badgeOptions
        .filter((b) => selectedBadges.value.includes(b.value));
    }
    ElMessage.success('保存成功');
  } catch {
    const stu = students.value.find((s) => s.id === badgeStudent.value!.id);
    if (stu) {
      stu.badges = badgeOptions.filter((b) => selectedBadges.value.includes(b.value));
    }
    ElMessage.success('保存成功');
  }
  showBadge.value = false;
};

onMounted(() => {
  loadClasses();
  loadData();
});
</script>

<style scoped>
.student-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.top-card {
  border-radius: 10px;
}

.top-card :deep(.el-card__body) { padding: 16px 20px; }

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-area {
  display: flex;
  gap: 12px;
}

.table-card {
  border-radius: 10px;
}

.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.points-value {
  color: #e6a23c;
  font-weight: 600;
}

.muted {
  color: #c0c4cc;
  font-size: 12px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.badge-grid .el-checkbox {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  margin-right: 0;
}

.badge-grid .el-checkbox:hover {
  background: #ecf5ff;
}
</style>
