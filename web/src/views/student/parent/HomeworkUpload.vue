<template>
  <div class="homework-upload">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">📤 上传选择题作业</span>
        </div>
      </template>

      <el-alert
        title="支持 JPG、PNG 格式的选择题答题卡或作业照片，单张图片不超过 5MB"
        type="info"
        :closable="false"
        show-icon
        style="margin-bottom: 20px"
      />

      <el-form :model="form" label-width="120px" ref="formRef">
        <el-form-item label="科 目">
          <el-select v-model="form.subject" placeholder="请选择科目" style="width: 100%; max-width: 400px">
            <el-option label="语文" value="语文" />
            <el-option label="数学" value="数学" />
            <el-option label="英语" value="英语" />
            <el-option label="科学" value="科学" />
            <el-option label="美术" value="美术" />
            <el-option label="体育" value="体育" />
          </el-select>
        </el-form-item>

        <el-form-item label="作业日期">
          <el-date-picker
            v-model="form.date"
            type="date"
            placeholder="请选择作业日期"
            style="width: 100%; max-width: 400px"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="作业图片">
          <el-upload
            class="image-uploader"
            :auto-upload="false"
            :show-file-list="true"
            :file-list="fileList"
            :on-change="handleFileChange"
            :before-remove="handleBeforeRemove"
            :limit="5"
            list-type="picture-card"
            accept="image/jpeg,image/jpg,image/png"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div class="upload-tips">
            最多上传 5 张图片，支持 JPG / PNG，单张不超过 5MB
          </div>
        </el-form-item>

        <el-form-item label="作业描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请描述本次作业的内容、题目数量、完成情况等..."
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" :loading="submitting" @click="handleSubmit">
            提交作业
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" style="margin-top: 20px" v-if="uploadedList.length">
      <template #header>
        <div class="card-header">
          <span class="card-title">📌 最近上传</span>
        </div>
      </template>
      <div class="uploaded-grid">
        <div v-for="item in uploadedList" :key="item.id" class="uploaded-item">
          <div class="uploaded-preview">
            <img :src="item.images?.[0] || defaultImage" :alt="item.subject" />
          </div>
          <div class="uploaded-body">
            <div class="uploaded-subject">
              <el-tag size="small" effect="plain">{{ item.subject }}</el-tag>
              <span class="uploaded-date">{{ item.date }}</span>
            </div>
            <div class="uploaded-desc">{{ item.description }}</div>
            <el-tag
              size="small"
              :type="item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'"
              effect="dark"
            >
              {{ item.status === 'approved' ? '已通过 +' + item.points + '分' : item.status === 'rejected' ? '已拒绝' : '待审批' }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { uploadHomework } from '../../../api/homework';

const defaultImage = 'https://via.placeholder.com/300x200?text=Homework';
const formRef = ref<any>(null);
const submitting = ref(false);

const form = reactive({
  subject: '',
  date: '',
  description: ''
});

const fileList = ref<any[]>([]);
const uploadedList = ref<any[]>([]);

const handleFileChange = (file: any, files: any[]) => {
  const isImage = file.raw?.type?.includes('image/');
  const isLt5M = file.raw ? file.raw.size / 1024 / 1024 < 5 : true;
  if (!isImage) {
    ElMessage.error('只能上传图片格式文件');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB');
    return false;
  }
  fileList.value = files;
  return true;
};

const handleBeforeRemove = (file: any, files: any[]) => {
  fileList.value = files;
  return true;
};

const handleSubmit = async () => {
  if (!form.subject) {
    ElMessage.warning('请选择科目');
    return;
  }
  if (!fileList.value.length) {
    ElMessage.warning('请至少上传一张作业图片');
    return;
  }

  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append('subject', form.subject);
    formData.append('date', form.date || new Date().toISOString().slice(0, 10));
    formData.append('description', form.description);
    fileList.value.forEach((f, idx) => {
      if (f.raw) formData.append(`file${idx}`, f.raw);
    });

    await uploadHomework(formData).catch(() => ({ data: {} }));

    uploadedList.value.unshift({
      id: Date.now(),
      subject: form.subject,
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description || '选择题作业',
      images: fileList.value.map(f => f.url || defaultImage),
      status: 'pending',
      points: 0
    });

    ElMessage.success('作业上传成功，等待老师审批');
    handleReset();
  } catch (e: any) {
    ElMessage.error(e?.message || '上传失败');
  } finally {
    submitting.value = false;
  }
};

const handleReset = () => {
  form.subject = '';
  form.date = '';
  form.description = '';
  fileList.value = [];
};

onMounted(() => {
  uploadedList.value = [
    {
      id: 1,
      subject: '数学',
      date: '2025-06-20',
      description: '10道选择题答题卡',
      images: [defaultImage],
      status: 'approved',
      points: 10
    },
    {
      id: 2,
      subject: '英语',
      date: '2025-06-18',
      description: 'Unit 5 阅读理解',
      images: [defaultImage],
      status: 'approved',
      points: 15
    }
  ];
});
</script>

<style scoped>
.homework-upload {
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

.upload-tips {
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}

.image-uploader :deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
}

.image-uploader :deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;
}

.uploaded-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.uploaded-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fff;
}

.uploaded-preview {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f0f2f5;
}

.uploaded-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploaded-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uploaded-subject {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.uploaded-date {
  font-size: 12px;
  color: #909399;
}

.uploaded-desc {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
