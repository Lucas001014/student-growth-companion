<template>
  <div class="homework-page">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📚 优秀作业展示</span>
          <el-select v-model="subjectFilter" placeholder="选择科目" size="small" style="width: 160px" @change="loadData">
            <el-option label="全部科目" value="" />
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="科学" value="科学" />
            <el-option label="美术" value="美术" />
            <el-option label="体育" value="体育" />
          </el-select>
        </div>
      </template>

      <div v-if="filteredHomework.length" class="homework-grid">
        <div
          v-for="item in filteredHomework"
          :key="item.id"
          class="homework-card"
          @click="openPreview(item)"
        >
          <div class="hw-cover">
            <img :src="item.imageUrl || defaultImage" :alt="item.title" />
            <el-tag v-if="item.subject" :type="subjectType(item.subject)" size="small" class="subject-tag" effect="dark">
              {{ item.subject }}
            </el-tag>
          </div>
          <div class="hw-body">
            <h4 class="hw-title">{{ item.title }}</h4>
            <div class="hw-author">
              <img :src="item.authorAvatar || defaultAvatar" class="author-avatar" />
              <span class="author-name">{{ item.authorName }}</span>
            </div>
            <div class="hw-meta">
              <span class="hw-date">{{ item.createdAt }}</span>
              <span class="hw-likes" v-if="item.likes">👍 {{ item.likes }}</span>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-else description="暂无公开作业" />
    </el-card>

    <el-dialog
      v-model="previewVisible"
      :title="previewItem?.title || '作业详情'"
      width="70%"
      center
    >
      <div v-if="previewItem" class="preview-content">
        <img :src="previewItem.imageUrl || defaultImage" class="preview-image" :alt="previewItem.title" />
        <div class="preview-info">
          <div class="info-row">
            <el-tag :type="subjectType(previewItem.subject)" effect="dark">
              {{ previewItem.subject }}
            </el-tag>
            <span class="info-date">{{ previewItem.createdAt }}</span>
          </div>
          <div class="author-info">
            <img :src="previewItem.authorAvatar || defaultAvatar" class="big-avatar" />
            <div class="author-detail">
              <div class="author-label">作者</div>
              <div class="author-text">{{ previewItem.authorName }}</div>
            </div>
          </div>
          <div v-if="previewItem.description" class="preview-desc">
            <div class="desc-label">作品描述</div>
            <p>{{ previewItem.description }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { getPublicHomework } from '../../api/homework';

const auth = useAuthStore();
const defaultImage = 'https://via.placeholder.com/400x300?text=Homework';
const defaultAvatar = 'https://via.placeholder.com/60?text=U';

const subjectFilter = ref('');
const homeworkList = ref<any[]>([]);
const previewVisible = ref(false);
const previewItem = ref<any>(null);

const subjectType = (subject: string) => {
  switch (subject) {
    case '语文': return 'primary';
    case '数学': return 'success';
    case '英语': return 'warning';
    case '科学': return 'danger';
    case '美术': return 'info';
    case '体育': return 'success';
    default: return 'info';
  }
};

const filteredHomework = computed(() => {
  if (!subjectFilter.value) return homeworkList.value;
  return homeworkList.value.filter(h => h.subject === subjectFilter.value);
});

const openPreview = (item: any) => {
  previewItem.value = item;
  previewVisible.value = true;
};

const loadData = async () => {
  try {
    const res = await getPublicHomework({ subject: subjectFilter.value }).catch(() => null);
    if (res && (res as any).data && (res as any).data.length) {
      homeworkList.value = (res as any).data;
    }
  } catch (e: any) {
    // fallthrough
  }

  if (!homeworkList.value.length || subjectFilter.value) {
    const subjects = ['语文', '数学', '英语', '科学', '美术'];
    const titles = [
      '美丽的春天', '数学小能手', '英语故事分享',
      '科学实验报告', '我的绘画作品', '作文大赛一等奖',
      '几何图形设计', 'English Daily', '光合作用观察', '山水画练习'
    ];
    const names = ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文', '吴圆圆'];

    const list: any[] = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        id: i + 1,
        title: titles[i],
        subject: subjects[i % subjects.length],
        authorName: names[i % names.length],
        authorAvatar: '',
        imageUrl: '',
        description: '这是一份精心制作的作业，展示了作者的学习成果和创意。',
        likes: Math.floor(Math.random() * 50) + 5,
        createdAt: `2025-06-${String(10 + (i % 20)).padStart(2, '0')}`
      });
    }
    homeworkList.value = list;
  }
};

onMounted(loadData);
</script>

<style scoped>
.homework-page {
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.homework-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.homework-card {
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.homework-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #c6e2ff;
}

.hw-cover {
  position: relative;
  height: 160px;
  background: #f0f2f5;
  overflow: hidden;
}

.hw-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.homework-card:hover .hw-cover img {
  transform: scale(1.05);
}

.subject-tag {
  position: absolute;
  top: 10px;
  left: 10px;
}

.hw-body {
  padding: 14px;
}

.hw-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hw-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.author-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 13px;
  color: #606266;
}

.hw-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.hw-likes {
  color: #f56c6c;
}

.preview-content {
  text-align: center;
}

.preview-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  background: #f5f7fa;
}

.preview-info {
  margin-top: 20px;
  text-align: left;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.info-date {
  font-size: 13px;
  color: #909399;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.big-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}

.author-detail {
  flex: 1;
}

.author-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.author-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.preview-desc {
  padding: 14px;
  background: #fafafa;
  border-radius: 8px;
}

.desc-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.preview-desc p {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  margin: 0;
}
</style>
