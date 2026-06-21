<template>
  <div class="class-overview">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">🏫 班级概览</h3>
        <div class="filter-bar">
          <span class="filter-label">按年级筛选：</span>
          <el-select v-model="gradeFilter" placeholder="全部年级" style="width: 160px" clearable>
            <el-option
              v-for="g in gradeOptions"
              :key="g"
              :label="g"
              :value="g"
            />
          </el-select>
        </div>
      </div>

      <el-table :data="filteredList" stripe style="width: 100%">
        <el-table-column prop="name" label="班级名称" min-width="140" />
        <el-table-column prop="grade" label="年级" width="120">
          <template #default="{ row }">
            <el-tag type="primary" effect="plain">{{ row.grade }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="studentCount" label="学生数" width="100" />
        <el-table-column prop="avgPoints" label="平均积分" width="120">
          <template #default="{ row }">
            <span class="points">{{ row.avgPoints }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="honorCount" label="荣誉发放数" width="130" />
        <el-table-column prop="teacherName" label="班主任" min-width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { listClasses } from '../../api/admin';

const classList = ref<any[]>([]);
const gradeFilter = ref('');

const gradeOptions = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];

const filteredList = computed(() => {
  if (!gradeFilter.value) return classList.value;
  return classList.value.filter((c) => c.grade === gradeFilter.value);
});

const loadData = async () => {
  try {
    const res = await listClasses().catch(() => null);
    if (res && (res as any).data?.length) {
      classList.value = (res as any).data;
    } else {
      classList.value = [
        { name: '一年级1班', grade: '一年级', studentCount: 42, avgPoints: 268, honorCount: 128, teacherName: '王老师' },
        { name: '一年级2班', grade: '一年级', studentCount: 40, avgPoints: 245, honorCount: 110, teacherName: '王老师' },
        { name: '二年级1班', grade: '二年级', studentCount: 45, avgPoints: 285, honorCount: 142, teacherName: '李老师' },
        { name: '二年级2班', grade: '二年级', studentCount: 43, avgPoints: 272, honorCount: 135, teacherName: '李老师' },
        { name: '三年级1班', grade: '三年级', studentCount: 46, avgPoints: 310, honorCount: 156, teacherName: '张老师' },
        { name: '三年级2班', grade: '三年级', studentCount: 44, avgPoints: 298, honorCount: 148, teacherName: '张老师' },
        { name: '四年级1班', grade: '四年级', studentCount: 48, avgPoints: 325, honorCount: 165, teacherName: '赵老师' },
        { name: '四年级2班', grade: '四年级', studentCount: 46, avgPoints: 312, honorCount: 158, teacherName: '陈老师' },
        { name: '五年级1班', grade: '五年级', studentCount: 45, avgPoints: 330, honorCount: 172, teacherName: '刘老师' },
        { name: '六年级1班', grade: '六年级', studentCount: 50, avgPoints: 358, honorCount: 188, teacherName: '孙老师' }
      ];
    }
  } catch {
    classList.value = [
      { name: '一年级1班', grade: '一年级', studentCount: 42, avgPoints: 268, honorCount: 128, teacherName: '王老师' },
      { name: '二年级1班', grade: '二年级', studentCount: 45, avgPoints: 285, honorCount: 142, teacherName: '李老师' },
      { name: '三年级1班', grade: '三年级', studentCount: 46, avgPoints: 310, honorCount: 156, teacherName: '张老师' }
    ];
  }
};

onMounted(loadData);
</script>

<style scoped>
.class-overview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.class-overview :deep(.el-card) {
  border-radius: 10px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: #606266;
}

.points {
  font-weight: 600;
  color: #409eff;
}
</style>
