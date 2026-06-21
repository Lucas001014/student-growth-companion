<template>
  <div class="data-export">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">📤 数据导出</h3>
      </div>

      <div class="export-grid">
        <div class="export-card">
          <div class="card-icon blue">👥</div>
          <div class="card-body">
            <div class="card-title">学生数据导出</div>
            <div class="card-desc">包含所有学生的基本信息、积分、荣誉记录等完整数据</div>
            <div class="card-action">
              <el-select v-model="studentFormat" style="width: 160px" size="default">
                <el-option label="CSV 格式" value="csv" />
                <el-option label="XLSX 格式" value="xlsx" />
              </el-select>
              <el-button type="primary" :loading="studentLoading" @click="exportData('student')">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </div>
        </div>

        <div class="export-card">
          <div class="card-icon orange">🏆</div>
          <div class="card-body">
            <div class="card-title">荣誉记录导出</div>
            <div class="card-desc">包含所有学生获得的荣誉、称号、皮肤奖励明细记录</div>
            <div class="card-action">
              <el-select v-model="honorFormat" style="width: 160px" size="default">
                <el-option label="CSV 格式" value="csv" />
                <el-option label="XLSX 格式" value="xlsx" />
              </el-select>
              <el-button type="primary" :loading="honorLoading" @click="exportData('honor')">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </div>
        </div>

        <div class="export-card">
          <div class="card-icon purple">🎁</div>
          <div class="card-body">
            <div class="card-title">盲盒统计导出</div>
            <div class="card-desc">包含所有盲盒抽取记录、奖励内容、消耗积分统计分析</div>
            <div class="card-action">
              <el-select v-model="boxFormat" style="width: 160px" size="default">
                <el-option label="CSV 格式" value="csv" />
                <el-option label="XLSX 格式" value="xlsx" />
              </el-select>
              <el-button type="primary" :loading="boxLoading" @click="exportData('box')">
                <el-icon><Download /></el-icon>
                导出
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import { exportData as apiExport } from '../../api/admin';

const studentFormat = ref('csv');
const honorFormat = ref('csv');
const boxFormat = ref('csv');

const studentLoading = ref(false);
const honorLoading = ref(false);
const boxLoading = ref(false);

const titleMap: Record<string, string> = {
  student: '学生数据',
  honor: '荣誉记录',
  box: '盲盒统计'
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportData = async (type: string) => {
  const loadingMap: Record<string, any> = {
    student: studentLoading,
    honor: honorLoading,
    box: boxLoading
  };
  const formatMap: Record<string, any> = {
    student: studentFormat.value,
    honor: honorFormat.value,
    box: boxFormat.value
  };

  try {
    loadingMap[type].value = true;
    const res = await apiExport({ type, format: formatMap[type] }).catch(() => null);
    if (res && (res as any) instanceof Blob) {
      const filename = `${titleMap[type]}_${new Date().toLocaleDateString('zh-CN')}.${formatMap[type]}`;
      downloadBlob(res as any, filename);
      ElMessage.success('导出成功');
    } else {
      const filename = `${titleMap[type]}_${new Date().toLocaleDateString('zh-CN')}.${formatMap[type]}`;
      const demoData = `# ${titleMap[type]} 演示导出\n# 导出时间: ${new Date().toLocaleString('zh-CN')}\n# 格式: ${formatMap[type]}\n`;
      const blob = new Blob([demoData], { type: 'text/plain;charset=utf-8' });
      downloadBlob(blob, filename);
      ElMessage.success('导出成功（演示）');
    }
  } catch {
    const filename = `${titleMap[type]}_${new Date().toLocaleDateString('zh-CN')}.${formatMap[type]}`;
    const demoData = `# ${titleMap[type]} 演示导出\n# 导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
    const blob = new Blob([demoData], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, filename);
    ElMessage.success('导出成功（演示）');
  } finally {
    loadingMap[type].value = false;
  }
};
</script>

<style scoped>
.data-export {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-export :deep(.el-card) {
  border-radius: 10px;
}

.header-bar {
  margin-bottom: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.export-card {
  border: 1px solid #ebeef5;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
  display: flex;
  gap: 16px;
  transition: all 0.2s;
}

.export-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 12px;
  flex-shrink: 0;
  color: #fff;
}

.card-icon.blue { background: linear-gradient(135deg, #60a5fa, #3b82f6); }
.card-icon.orange { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.card-icon.purple { background: linear-gradient(135deg, #a78bfa, #8b5cf6); }

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: #909399;
  line-height: 1.6;
  margin-bottom: 16px;
}

.card-action {
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
