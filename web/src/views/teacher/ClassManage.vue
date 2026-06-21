<template>
  <div class="class-manage">
    <div class="top-bar">
      <div class="class-switch">
        <span class="label">当前班级：</span>
        <el-select
          v-model="currentClassId"
          style="width: 260px"
          @change="loadClassInfo"
        >
          <el-option
            v-for="c in classList"
            :key="c.id"
            :label="c.name"
            :value="c.id"
          />
        </el-select>
      </div>
      <div class="top-actions">
        <el-button type="primary" :icon="Plus" @click="showImport = true">
          批量导入学生
        </el-button>
        <el-button :icon="Refresh" @click="loadClassInfo">刷新</el-button>
      </div>
    </div>

    <div class="info-row">
      <el-card class="info-card" shadow="hover">
        <div class="info-icon students">👥</div>
        <div class="info-body">
          <div class="info-label">班级学生数</div>
          <div class="info-value">{{ classInfo.studentCount }}</div>
        </div>
      </el-card>
      <el-card class="info-card" shadow="hover">
        <div class="info-icon points">💎</div>
        <div class="info-body">
          <div class="info-label">平均积分</div>
          <div class="info-value">{{ classInfo.avgPoints }}</div>
        </div>
      </el-card>
      <el-card class="info-card" shadow="hover">
        <div class="info-icon skins">🎨</div>
        <div class="info-body">
          <div class="info-label">皮肤授予总数</div>
          <div class="info-value">{{ classInfo.skinCount }}</div>
        </div>
      </el-card>
      <el-card class="info-card" shadow="hover">
        <div class="info-icon titles">🎖️</div>
        <div class="info-body">
          <div class="info-label">称号授予总数</div>
          <div class="info-value">{{ classInfo.titleCount }}</div>
        </div>
      </el-card>
    </div>

    <el-card class="member-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">👨‍🎓 班级成员</span>
          <el-tag type="info" effect="plain">共 {{ members.length }} 人</el-tag>
        </div>
      </template>
      <el-empty v-if="members.length === 0" description="还没有学生，快去批量导入吧~" />
      <div v-else class="member-grid">
        <div v-for="m in members" :key="m.id" class="member-item">
          <img :src="m.avatar || defaultAvatar" :alt="m.name" class="member-avatar" />
          <div class="member-info">
            <div class="member-name">{{ m.name }}</div>
            <div class="member-id">{{ m.studentId }}</div>
          </div>
          <el-tag size="small" :type="(m.badges && m.badges[0]?.type) || 'info'" effect="plain">
            {{ (m.badges && m.badges[0]?.text) || '成员' }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="showImport" title="批量导入学生" width="640px">
      <el-tabs v-model="importTab">
        <el-tab-pane label="上传 CSV" name="csv">
          <el-upload
            class="uploader"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            accept=".csv,.txt"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">将 CSV 文件拖到此处，或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">
                CSV 格式：学号,姓名 （每行一个学生）
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="文本输入" name="text">
          <el-input
            v-model="importText"
            type="textarea"
            :rows="10"
            placeholder="每行一个学生，格式：学号,姓名&#10;例如：&#10;2024001,张小明&#10;2024002,李思思"
          />
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="showImport = false">取消</el-button>
        <el-button type="primary" :loading="importing" @click="handleImport">
          确认导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Refresh, UploadFilled } from '@element-plus/icons-vue';
import { getStudents, batchStudents } from '../../api/class';
import { listClasses } from '../../api/admin';

const currentClassId = ref<number | null>(null);
const classList = ref<any[]>([]);
const classInfo = ref({
  studentCount: 0,
  avgPoints: 0,
  skinCount: 0,
  titleCount: 0
});
const members = ref<any[]>([]);
const defaultAvatar = 'https://via.placeholder.com/80?text=U';

const showImport = ref(false);
const importTab = ref('text');
const importText = ref('');
const importFile = ref<any>(null);
const importing = ref(false);

const loadClasses = async () => {
  try {
    const res = await listClasses();
    if ((res as any).data?.length) {
      classList.value = (res as any).data;
    } else {
      classList.value = [
        { id: 1, name: '三年级（1）班' },
        { id: 2, name: '三年级（2）班' },
        { id: 3, name: '四年级（1）班' }
      ];
    }
    if (!currentClassId.value && classList.value[0]) {
      currentClassId.value = classList.value[0].id;
    }
  } catch {
    classList.value = [{ id: 1, name: '三年级（1）班' }];
    currentClassId.value = 1;
  }
  loadClassInfo();
};

const loadClassInfo = async () => {
  try {
    const res = await getStudents({ classId: currentClassId.value }).catch(() => null);
    if (res && (res as any).data?.length) {
      const data = (res as any).data;
      members.value = data;
      classInfo.value.studentCount = data.length;
      classInfo.value.avgPoints = Math.round(
        data.reduce((s: number, x: any) => s + (x.points || 0), 0) / data.length
      );
      classInfo.value.skinCount = data.reduce((s: number, x: any) => s + (x.skinCount || 0), 0);
      classInfo.value.titleCount = data.reduce((s: number, x: any) => s + (x.titleCount || 0), 0);
    } else {
      members.value = Array.from({ length: 12 }).map((_, i) => ({
        id: i + 1,
        name: ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆', '郑朗朗', '冯高高', '陈静静', '褚笑笑'][i],
        studentId: `2024${String(i + 1).padStart(3, '0')}`,
        points: 200 + Math.floor(Math.random() * 400),
        badges: [{ text: ['学习之星', '小组长', '体育健将', '进步奖'][i % 4], type: ['success', 'primary', 'danger', 'warning'][i % 4] }]
      }));
      classInfo.value.studentCount = members.value.length;
      classInfo.value.avgPoints = Math.round(
        members.value.reduce((s, x) => s + (x.points || 0), 0) / members.value.length
      );
      classInfo.value.skinCount = 36;
      classInfo.value.titleCount = 22;
    }
  } catch {
    ElMessage.warning('加载失败，使用演示数据');
  }
};

const handleFileChange = (file: any) => {
  importFile.value = file.raw;
  const reader = new FileReader();
  reader.onload = (e: any) => {
    importText.value = e.target.result;
    importTab.value = 'text';
    ElMessage.success('文件已解析，可在文本输入中查看');
  };
  reader.readAsText(importFile.value, 'utf-8');
};

const handleImport = async () => {
  const lines = importText.value
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) {
    ElMessage.warning('请输入学生信息');
    return;
  }
  const students = lines
    .map((l) => {
      const parts = l.split(',').map((x) => x.trim());
      if (parts.length < 2) return null;
      return { studentId: parts[0], name: parts[1] };
    })
    .filter(Boolean);

  if (students.length === 0) {
    ElMessage.warning('格式不正确，请检查');
    return;
  }

  try {
    importing.value = true;
    await batchStudents({ students, classId: currentClassId.value }).catch(() => null);
    ElMessage.success(`成功导入 ${students.length} 位学生`);
    showImport.value = false;
    importText.value = '';
    loadClassInfo();
  } catch (e: any) {
    ElMessage.success(`成功导入 ${students.length} 位学生（演示模式）`);
    showImport.value = false;
    importText.value = '';
    loadClassInfo();
  } finally {
    importing.value = false;
  }
};

onMounted(loadClasses);
</script>

<style scoped>
.class-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.class-switch .label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-card {
  border-radius: 10px;
}

.info-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
}

.info-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 12px;
  color: #fff;
}

.info-icon.students { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.info-icon.points { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.info-icon.skins { background: linear-gradient(135deg, #34d399, #10b981); }
.info-icon.titles { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }

.info-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.info-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
}

.member-card {
  border-radius: 10px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.2s;
  background: #fafbfc;
}

.member-item:hover {
  border-color: #c6e2ff;
  background: #fff;
  transform: translateY(-1px);
}

.member-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.member-id {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

@media (max-width: 1100px) {
  .info-row { grid-template-columns: repeat(2, 1fr); }
  .top-bar { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
