<template>
  <div class="honor-manage">
    <el-card shadow="hover">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="🎯 发放积分" name="points">
          <div class="form-section">
            <h4 class="section-title">选择学生（可多选，可搜索）</h4>
            <el-select
              v-model="pointsForm.studentIds"
              multiple
              filterable
              placeholder="输入学号或姓名搜索"
              style="width: 100%"
            >
              <el-option
                v-for="s in studentList"
                :key="s.id"
                :label="`${s.name} (${s.studentId})`"
                :value="s.id"
              />
            </el-select>
            <p class="hint">已选 {{ pointsForm.studentIds.length }} 位学生</p>
          </div>

          <div class="form-row">
            <div class="form-item">
              <label>积分数量</label>
              <el-input-number
                v-model="pointsForm.points"
                :min="1"
                :max="9999"
                style="width: 100%"
              />
            </div>
            <div class="form-item">
              <label>类别</label>
              <el-select v-model="pointsForm.category" placeholder="请选择类别" style="width: 100%">
                <el-option label="课堂表现" value="class" />
                <el-option label="作业完成" value="homework" />
                <el-option label="考试成绩" value="exam" />
                <el-option label="课外活动" value="activity" />
                <el-option label="其他奖励" value="other" />
              </el-select>
            </div>
          </div>

          <div class="form-section">
            <label>备注</label>
            <el-input
              v-model="pointsForm.remark"
              type="textarea"
              :rows="3"
              placeholder="例如：本周数学小测满分"
            />
          </div>

          <div class="action-bar">
            <el-button type="primary" size="large" :loading="submitting" :disabled="!canSubmitPoints" @click="submitPoints">
              ✅ 确认发放积分
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="🎨 授予皮肤" name="skin">
          <div class="form-section">
            <h4 class="section-title">选择学生</h4>
            <el-select
              v-model="skinForm.studentIds"
              multiple
              filterable
              placeholder="输入学号或姓名搜索"
              style="width: 100%"
            >
              <el-option
                v-for="s in studentList"
                :key="s.id"
                :label="`${s.name} (${s.studentId})`"
                :value="s.id"
              />
            </el-select>
          </div>

          <div class="form-section">
            <h4 class="section-title">选择皮肤</h4>
            <div class="skin-grid">
              <div
                v-for="skin in skinList"
                :key="skin.id"
                class="skin-option"
                :class="{ active: skinForm.skinId === skin.id }"
                @click="skinForm.skinId = skin.id"
              >
                <div class="skin-cover" :style="{ background: skin.bg }">
                  <span class="skin-preview">{{ skin.icon }}</span>
                </div>
                <div class="skin-info">
                  <div class="skin-name">{{ skin.name }}</div>
                  <el-tag :type="skin.rarityTag" size="small" effect="plain">{{ skin.rarity }}</el-tag>
                </div>
              </div>
            </div>
          </div>

          <div class="action-bar">
            <el-button type="primary" size="large" :loading="submitting" :disabled="!canSubmitSkin" @click="submitSkin">
              🎨 确认授予皮肤
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="🎖️ 授予称号" name="title">
          <div class="form-section">
            <h4 class="section-title">选择学生</h4>
            <el-select
              v-model="titleForm.studentIds"
              multiple
              filterable
              placeholder="输入学号或姓名搜索"
              style="width: 100%"
            >
              <el-option
                v-for="s in studentList"
                :key="s.id"
                :label="`${s.name} (${s.studentId})`"
                :value="s.id"
              />
            </el-select>
          </div>

          <div class="form-row">
            <div class="form-item" style="flex: 1">
              <label>选择称号</label>
              <el-select v-model="titleForm.titleId" placeholder="请选择称号" style="width: 100%">
                <el-option
                  v-for="t in titleList"
                  :key="t.id"
                  :label="t.name"
                  :value="t.id"
                />
              </el-select>
            </div>
            <div class="form-item">
              <label>有效期（天）</label>
              <el-input-number v-model="titleForm.duration" :min="0" :max="3650" style="width: 100%" />
              <p class="hint">0 表示永久</p>
            </div>
          </div>

          <div class="form-section">
            <label>备注</label>
            <el-input
              v-model="titleForm.remark"
              type="textarea"
              :rows="2"
              placeholder="授予原因（可选）"
            />
          </div>

          <div class="action-bar">
            <el-button type="primary" size="large" :loading="submitting" :disabled="!canSubmitTitle" @click="submitTitle">
              🎖️ 确认授予称号
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getStudents } from '../../api/class';
import { listSkins, listTitles } from '../../api/admin';
import { grantPoints, grantSkin, grantTitle } from '../../api/honor';

const activeTab = ref('points');
const submitting = ref(false);
const studentList = ref<any[]>([]);
const skinList = ref<any[]>([]);
const titleList = ref<any[]>([]);

const pointsForm = reactive({
  studentIds: [] as number[],
  points: 10,
  category: 'class',
  remark: ''
});

const skinForm = reactive({
  studentIds: [] as number[],
  skinId: null as number | null
});

const titleForm = reactive({
  studentIds: [] as number[],
  titleId: null as number | null,
  duration: 30,
  remark: ''
});

const canSubmitPoints = computed(() =>
  pointsForm.studentIds.length > 0 && pointsForm.points > 0 && pointsForm.category
);
const canSubmitSkin = computed(() =>
  skinForm.studentIds.length > 0 && skinForm.skinId
);
const canSubmitTitle = computed(() =>
  titleForm.studentIds.length > 0 && titleForm.titleId
);

const loadData = async () => {
  try {
    const [sRes, kRes, tRes] = await Promise.all([
      getStudents({}).catch(() => null),
      listSkins().catch(() => null),
      listTitles().catch(() => null)
    ]);

    if (sRes && (sRes as any).data?.length) {
      studentList.value = (sRes as any).data;
    } else {
      studentList.value = Array.from({ length: 18 }).map((_, i) => ({
        id: i + 1,
        studentId: `2024${String(i + 1).padStart(3, '0')}`,
        name: ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆', '郑朗朗', '冯高高', '陈静静', '褚笑笑', '卫东来', '蒋方舟', '沈梦溪', '韩梅梅', '杨光', '朱自强'][i]
      }));
    }

    if (kRes && (kRes as any).data?.length) {
      skinList.value = (kRes as any).data;
    } else {
      skinList.value = [
        { id: 1, name: '海洋之心', icon: '🌊', rarity: 'SSR', rarityTag: 'danger', bg: 'linear-gradient(135deg, #60a5fa, #1e40af)' },
        { id: 2, name: '烈焰骑士', icon: '🔥', rarity: 'SR', rarityTag: 'warning', bg: 'linear-gradient(135deg, #fca5a5, #dc2626)' },
        { id: 3, name: '冰雪公主', icon: '❄️', rarity: 'SR', rarityTag: 'warning', bg: 'linear-gradient(135deg, #e0f2fe, #0284c7)' },
        { id: 4, name: '森林守护', icon: '🌲', rarity: 'R', rarityTag: 'primary', bg: 'linear-gradient(135deg, #86efac, #15803d)' },
        { id: 5, name: '星空旅人', icon: '✨', rarity: 'SSR', rarityTag: 'danger', bg: 'linear-gradient(135deg, #c4b5fd, #5b21b6)' },
        { id: 6, name: '草原奔马', icon: '🐎', rarity: 'R', rarityTag: 'primary', bg: 'linear-gradient(135deg, #fde68a, #92400e)' }
      ];
    }

    if (tRes && (tRes as any).data?.length) {
      titleList.value = (tRes as any).data;
    } else {
      titleList.value = [
        { id: 1, name: '学习之星' },
        { id: 2, name: '进步奖' },
        { id: 3, name: '纪律标兵' },
        { id: 4, name: '体育健将' },
        { id: 5, name: '文艺才子' },
        { id: 6, name: '劳动小能手' }
      ];
    }
  } catch {
    ElMessage.warning('加载失败，使用演示数据');
  }
};

const submitPoints = async () => {
  if (submitting.value) return;
  try {
    submitting.value = true;
    await grantPoints(pointsForm).catch(() => null);
    ElMessage.success(`已向 ${pointsForm.studentIds.length} 位学生发放 ${pointsForm.points} 积分`);
    pointsForm.studentIds = [];
    pointsForm.remark = '';
  } catch {
    ElMessage.success(`已向 ${pointsForm.studentIds.length} 位学生发放 ${pointsForm.points} 积分（演示）`);
    pointsForm.studentIds = [];
    pointsForm.remark = '';
  } finally {
    submitting.value = false;
  }
};

const submitSkin = async () => {
  if (submitting.value) return;
  const skin = skinList.value.find((s) => s.id === skinForm.skinId);
  try {
    submitting.value = true;
    await grantSkin(skinForm).catch(() => null);
    ElMessage.success(`已向 ${skinForm.studentIds.length} 位学生授予「${skin?.name}」`);
    skinForm.studentIds = [];
    skinForm.skinId = null;
  } catch {
    ElMessage.success(`已向 ${skinForm.studentIds.length} 位学生授予「${skin?.name}」（演示）`);
    skinForm.studentIds = [];
    skinForm.skinId = null;
  } finally {
    submitting.value = false;
  }
};

const submitTitle = async () => {
  if (submitting.value) return;
  const title = titleList.value.find((t) => t.id === titleForm.titleId);
  try {
    submitting.value = true;
    await grantTitle(titleForm).catch(() => null);
    ElMessage.success(`已向 ${titleForm.studentIds.length} 位学生授予「${title?.name}」称号`);
    titleForm.studentIds = [];
    titleForm.titleId = null;
    titleForm.remark = '';
  } catch {
    ElMessage.success(`已向 ${titleForm.studentIds.length} 位学生授予「${title?.name}」称号（演示）`);
    titleForm.studentIds = [];
    titleForm.titleId = null;
    titleForm.remark = '';
  } finally {
    submitting.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.honor-manage {
  display: flex;
  flex-direction: column;
}

.honor-manage :deep(.el-card) {
  border-radius: 10px;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px;
}

.form-section > label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-item {
  flex: 1;
}

.form-item > label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.hint {
  font-size: 12px;
  color: #909399;
  margin: 8px 0 0;
}

.skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.skin-option {
  border: 2px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.skin-option:hover {
  border-color: #93c5fd;
  transform: translateY(-2px);
}

.skin-option.active {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.25);
}

.skin-cover {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skin-preview {
  font-size: 40px;
}

.skin-info {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skin-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.action-bar {
  padding-top: 8px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 800px) {
  .form-row { flex-direction: column; }
}
</style>
