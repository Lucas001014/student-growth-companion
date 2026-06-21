<template>
  <div class="announcement">
    <el-card class="top-card" shadow="never">
      <div class="top-row">
        <div>
          <h3 class="title">📢 公告中心</h3>
          <p class="subtitle">共 {{ announcements.length }} 条公告</p>
        </div>
        <el-button type="primary" :icon="Plus" size="large" @click="openCreate">
          发布公告
        </el-button>
      </div>
    </el-card>

    <el-card class="table-card" shadow="hover">
      <el-table :data="announcements" stripe style="width: 100%">
        <el-table-column label="标题" prop="title" min-width="220" />
        <el-table-column label="内容" prop="content" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="content-text">{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" prop="creator" width="120" />
        <el-table-column label="创建时间" prop="createdAt" width="180" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="openView(row)">
              查看
            </el-button>
            <el-popconfirm title="确认删除该公告？" @confirm="handleDelete(row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="announcements.length === 0" description="暂无公告" />
    </el-card>

    <el-dialog v-model="showForm" title="发布公告" width="600px">
      <el-form :model="form" label-width="80px" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入公告标题" maxlength="60" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="请输入公告详细内容"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">发布</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showView" :title="viewItem?.title" width="600px">
      <div class="view-body">
        <div class="view-meta">
          <el-tag type="info" effect="plain">创建者：{{ viewItem?.creator }}</el-tag>
          <span class="time">{{ viewItem?.createdAt }}</span>
        </div>
        <div class="view-content">{{ viewItem?.content }}</div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showView = false">我知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';

interface Announcement {
  id: number;
  title: string;
  content: string;
  creator: string;
  createdAt: string;
}

const announcements = ref<Announcement[]>([]);
const showForm = ref(false);
const showView = ref(false);
const viewItem = ref<Announcement | null>(null);
const formRef = ref<FormInstance>();
const form = reactive({
  title: '',
  content: ''
});

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
};

const loadData = () => {
  announcements.value = [
    {
      id: 1,
      title: '📢 关于本学期期中测评的通知',
      content: '各位同学和家长好，本学期期中测评将于下周一（11月4日）上午开始，请各位同学做好准备。测评内容包括语文、数学、英语三科，详细安排请查看班级课表。如有特殊情况请及时与老师沟通。',
      creator: '张老师',
      createdAt: '2024-10-28 15:30'
    },
    {
      id: 2,
      title: '🏆 九月荣誉积分排行公布',
      content: '九月班级荣誉积分排行榜已出！恭喜以下同学获得月度之星：\n1. 张小明 - 520 分\n2. 李思思 - 480 分\n3. 王大力 - 462 分\n\n所有获奖同学将获得专属称号和皮肤奖励。继续加油！',
      creator: '李老师',
      createdAt: '2024-10-01 09:00'
    },
    {
      id: 3,
      title: '🎁 新盲盒「秋日限定」上线',
      content: '全新「秋日限定」盲盒已经上线，包含限定皮肤「秋日枫叶」和称号「秋日行者」。消耗积分：80/次，每日上限 2 次。快去抽取你的专属奖励吧！',
      creator: '系统管理员',
      createdAt: '2024-10-15 12:00'
    },
    {
      id: 4,
      title: '⚠️ 关于作业上传规范的提示',
      content: '最近发现部分同学的选择题上传图片不清晰，导致批阅困难。请同学们拍照时注意：\n1. 光线充足，避免阴影\n2. 保持手机与纸面平行\n3. 只拍摄相关题目区域\n\n感谢大家的配合！',
      creator: '张老师',
      createdAt: '2024-10-20 14:20'
    }
  ];
};

const openCreate = () => {
  form.title = '';
  form.content = '';
  showForm.value = true;
};

const openView = (row: Announcement) => {
  viewItem.value = row;
  showView.value = true;
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate((valid) => {
      if (!valid) return;
      announcements.value.unshift({
        id: Date.now(),
        title: form.title,
        content: form.content,
        creator: '我',
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
      });
      ElMessage.success('公告已发布');
      showForm.value = false;
    });
  } catch (e) {
    // ignore
  }
};

const handleDelete = (row: Announcement) => {
  announcements.value = announcements.value.filter((a) => a.id !== row.id);
  ElMessage.success('已删除');
};

onMounted(loadData);
</script>

<style scoped>
.announcement {
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

.content-text {
  color: #606266;
  font-size: 13px;
}

.view-body {
  padding: 8px 4px;
}

.view-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e4e7ed;
  margin-bottom: 16px;
}

.view-meta .time {
  font-size: 12px;
  color: #909399;
}

.view-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>
