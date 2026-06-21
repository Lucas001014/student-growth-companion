<template>
  <div class="approval-center">
    <el-card shadow="never" class="main-card">
      <el-tabs v-model="activeTab" class="dark-tabs">
        <el-tab-pane label="🎒 学生申请" name="student">
          <div v-if="filteredStudent.length === 0" class="empty-state">
            <span class="empty-icon">📋</span>
            <p class="empty-text">暂无待处理的学生申请</p>
          </div>
          <div v-else class="card-grid">
            <div v-for="item in filteredStudent" :key="item.id" class="approval-card-item">
              <div class="card-top">
                <span class="type-tag" :class="'tag-' + item.type">{{ typeLabelMap[item.type] || item.type }}</span>
                <span class="time">{{ item.time }}</span>
              </div>
              <div class="card-body">
                <div class="avatar-wrap">
                  <img :src="item.avatar || defaultAvatar" class="avatar" />
                </div>
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                  <div class="sid">学号：{{ item.studentId }}</div>
                </div>
              </div>
              <div class="card-detail">
                <p class="detail-title">{{ item.title }}</p>
                <p class="detail-text">{{ item.detail }}</p>
              </div>
              <div class="card-actions" v-if="item.status === 'pending'">
                <button class="approve-btn" @click="approve(item)">
                  <span>✓</span> 通过
                </button>
                <button class="reject-btn" @click="reject(item)">
                  <span>✗</span> 拒绝
                </button>
              </div>
              <div class="card-status" v-else>
                <span class="status-badge" :class="item.status === 'approved' ? 'approved' : 'rejected'">
                  {{ item.status === 'approved' ? '✓ 已通过' : '✗ 已拒绝' }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="👨‍👩‍👧 家长申请" name="parent">
          <div v-if="filteredParent.length === 0" class="empty-state">
            <span class="empty-icon">👨‍👩‍👧</span>
            <p class="empty-text">暂无待处理的家长申请</p>
          </div>
          <div v-else class="card-grid">
            <div v-for="item in filteredParent" :key="item.id" class="approval-card-item">
              <div class="card-top">
                <span class="type-tag tag-parent">家长申请</span>
                <span class="time">{{ item.time }}</span>
              </div>
              <div class="card-body">
                <div class="avatar-wrap">
                  <img :src="item.avatar || defaultAvatar" class="avatar" />
                </div>
                <div class="info">
                  <div class="name">{{ item.parentName }}</div>
                  <div class="sid">孩子：{{ item.name }} ({{ item.studentId }})</div>
                </div>
              </div>
              <div class="card-detail">
                <p class="detail-title">{{ item.title }}</p>
                <p class="detail-text">{{ item.detail }}</p>
              </div>
              <div class="card-actions" v-if="item.status === 'pending'">
                <button class="approve-btn" @click="approve(item)"><span>✓</span> 通过</button>
                <button class="reject-btn" @click="reject(item)"><span>✗</span> 拒绝</button>
              </div>
              <div class="card-status" v-else>
                <span class="status-badge" :class="item.status === 'approved' ? 'approved' : 'rejected'">
                  {{ item.status === 'approved' ? '✓ 已通过' : '✗ 已拒绝' }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="📝 选择题上传" name="choice">
          <div v-if="filteredChoice.length === 0" class="empty-state">
            <span class="empty-icon">📝</span>
            <p class="empty-text">暂无待处理的选择题上传</p>
          </div>
          <div v-else class="card-grid">
            <div v-for="item in filteredChoice" :key="item.id" class="approval-card-item">
              <div class="card-top">
                <span class="type-tag tag-info">题目上传</span>
                <span class="time">{{ item.time }}</span>
              </div>
              <div class="card-body">
                <div class="avatar-wrap">
                  <img :src="item.avatar || defaultAvatar" class="avatar" />
                </div>
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                  <div class="sid">学号：{{ item.studentId }}</div>
                </div>
              </div>
              <div class="card-detail">
                <p class="detail-title">{{ item.title }}</p>
                <p class="detail-text">{{ item.detail }}</p>
                <div class="preview" v-if="item.preview">
                  <img :src="item.preview" class="preview-img" />
                </div>
              </div>
              <div class="card-actions" v-if="item.status === 'pending'">
                <button class="approve-btn" @click="approve(item)"><span>✓</span> 通过</button>
                <button class="reject-btn" @click="reject(item)"><span>✗</span> 拒绝</button>
              </div>
              <div class="card-status" v-else>
                <span class="status-badge" :class="item.status === 'approved' ? 'approved' : 'rejected'">
                  {{ item.status === 'approved' ? '✓ 已通过' : '✗ 已拒绝' }}
                </span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="showReject"
      title="拒绝申请"
      width="480px"
      class="dark-dialog"
    >
      <p class="reject-hint">请填写拒绝原因：</p>
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="4"
        placeholder="例如：请完善申请理由后再提交"
      />
      <template #footer>
        <button class="dialog-cancel-btn" @click="showReject = false">取消</button>
        <button class="dialog-confirm-btn" @click="confirmReject">确认拒绝</button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRequests, approveRequest } from '../../api/request';

interface RequestItem {
  id: number;
  type: string;
  title: string;
  detail: string;
  name: string;
  parentName?: string;
  studentId: string;
  avatar?: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  category: 'student' | 'parent' | 'choice';
  preview?: string;
}

const activeTab = ref('student');
const defaultAvatar = 'https://via.placeholder.com/80?text=U';
const requests = ref<RequestItem[]>([]);
const showReject = ref(false);
const rejectTarget = ref<RequestItem | null>(null);
const rejectReason = ref('');

const typeLabelMap: Record<string, string> = {
  skin: '皮肤申请',
  honor: '荣誉申请',
  blindbox: '盲盒奖励',
  badges: '身份标识',
  other: '其他申请'
};

const filteredStudent = computed(() => requests.value.filter((r) => r.category === 'student'));
const filteredParent = computed(() => requests.value.filter((r) => r.category === 'parent'));
const filteredChoice = computed(() => requests.value.filter((r) => r.category === 'choice'));

const loadData = async () => {
  try {
    const res = await listRequests({}).catch(() => null);
    if (res && (res as any).data?.length) {
      requests.value = (res as any).data;
    } else {
      const names = ['张小明', '李思思', '王大力', '赵小雨', '钱朵朵', '孙天天', '周文文'];
      requests.value = [
        { id: 1, type: 'skin', title: '申请兑换「海洋之心」皮肤', detail: '我这一周表现良好，想兑换海洋之心皮肤作为奖励。', name: names[0], studentId: '2024001', time: '今天 09:24', status: 'pending', category: 'student' },
        { id: 2, type: 'honor', title: '申请「学习之星」称号', detail: '本月连续三次小测满分，请求授予称号。', name: names[1], studentId: '2024002', time: '今天 10:12', status: 'pending', category: 'student' },
        { id: 3, type: 'badges', title: '申请「体育健将」身份标识', detail: '在校运动会获得100米第一名。', name: names[2], studentId: '2024003', time: '昨天 16:33', status: 'pending', category: 'student' },
        { id: 4, type: 'blindbox', title: '请求开启一次盲盒', detail: '积分充足，想尝试抽取皮肤。', name: names[3], studentId: '2024004', time: '昨天 14:10', status: 'approved', category: 'student' },
        { id: 5, type: 'other', title: '请假申请', detail: '明天需要去医院复查，请假一天。', name: '李思思妈妈', parentName: '李思思妈妈', studentId: '2024002', time: '今天 08:15', status: 'pending', category: 'parent' },
        { id: 6, type: 'other', title: '反馈课堂纪律问题', detail: '孩子反映最近课堂纪律有些松散，希望老师多关注。', name: '王大力爸爸', parentName: '王大力爸爸', studentId: '2024003', time: '昨天 20:45', status: 'pending', category: 'parent' },
        { id: 7, type: 'other', title: '数学题上传 - 第一题', detail: '我已经完成今日数学选择题，请老师批阅。', name: names[4], studentId: '2024005', time: '今天 07:30', status: 'pending', category: 'choice' },
        { id: 8, type: 'other', title: '语文题上传 - 古诗背诵', detail: '已完成今日古诗默写。', name: names[5], studentId: '2024006', time: '昨天 19:20', status: 'pending', category: 'choice' },
        { id: 9, type: 'other', title: '英语听力上传', detail: '英语听力作业音频上传。', name: names[6], studentId: '2024007', time: '昨天 21:00', status: 'approved', category: 'choice' }
      ];
    }
  } catch {
    ElMessage.warning('加载失败，使用演示数据');
  }
};

const approve = async (item: RequestItem) => {
  try {
    await ElMessageBox.confirm(`确认通过「${item.name}」的申请？`, '确认通过', {
      type: 'success',
      confirmButtonText: '通过',
      cancelButtonText: '取消'
    });
    try {
      await approveRequest(item.id, { status: 'approved' }).catch(() => null);
      item.status = 'approved';
      ElMessage.success('已通过');
    } catch {
      item.status = 'approved';
      ElMessage.success('已通过');
    }
  } catch {
    // cancelled
  }
};

const reject = (item: RequestItem) => {
  rejectTarget.value = item;
  rejectReason.value = '';
  showReject.value = true;
};

const confirmReject = async () => {
  if (!rejectTarget.value) return;
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请填写拒绝原因');
    return;
  }
  try {
    await approveRequest(rejectTarget.value.id, {
      status: 'rejected',
      reason: rejectReason.value
    }).catch(() => null);
    rejectTarget.value.status = 'rejected';
    ElMessage.success('已拒绝');
    showReject.value = false;
  } catch {
    rejectTarget.value.status = 'rejected';
    ElMessage.success('已拒绝');
    showReject.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.approval-center { display: flex; flex-direction: column; }

.main-card {
  border-radius: 16px !important;
  border: 1px solid rgba(255,255,255,0.06) !important;
}

/* Tabs 暗色化 */
.dark-tabs :deep(.el-tabs__header) {
  background: rgba(15,23,42,0.3);
  border-radius: 12px 12px 0 0;
  padding: 8px 16px 0;
  margin: 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.dark-tabs :deep(.el-tabs__nav-wrap::after) { display: none; }
.dark-tabs :deep(.el-tabs__item) {
  color: #64748b !important;
  font-size: 14px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}
.dark-tabs :deep(.el-tabs__item.is-active) {
  color: #60a5fa !important;
}
.dark-tabs :deep(.el-tabs__active-bar) {
  background-color: #60a5fa !important;
  height: 2px;
}
.dark-tabs :deep(.el-tabs__content) {
  padding: 20px;
}

/* 空状态 */
.empty-state {
  padding: 60px 20px;
  text-align: center;
}
.empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.empty-text { font-size: 14px; color: #4a5568; }

/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.approval-card-item {
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 16px;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
  animation: fadeSlideUp 0.4s ease-out both;
}
.approval-card-item:hover {
  border-color: rgba(96,165,250,0.2);
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.type-tag {
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.tag-skin { background: rgba(139,92,246,0.15); color: #a78bfa; border: 1px solid rgba(139,92,246,0.25); }
.tag-honor { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.tag-blindbox { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
.tag-badges { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
.tag-other { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }
.tag-parent { background: rgba(251,191,36,0.15); color: #fbbf24; border: 1px solid rgba(251,191,36,0.25); }
.tag-info { background: rgba(96,165,250,0.15); color: #60a5fa; border: 1px solid rgba(96,165,250,0.25); }

.time { font-size: 12px; color: #334155; }

.card-body {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.avatar-wrap { flex-shrink: 0; }
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255,255,255,0.06);
}
.info { flex: 1; }
.name { font-size: 15px; font-weight: 600; color: #e2e8f0; margin-bottom: 2px; }
.sid { font-size: 12px; color: #4a5568; }

.card-detail {
  padding: 10px 12px;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  margin: 10px 0;
}
.detail-title { font-size: 14px; font-weight: 600; color: #c8d6e5; margin: 0 0 6px; }
.detail-text { font-size: 13px; color: #64748b; line-height: 1.6; margin: 0; }

.preview { margin-top: 8px; border-radius: 6px; overflow: hidden; }
.preview-img { width: 100%; max-height: 160px; object-fit: cover; }

.card-actions { display: flex; gap: 10px; justify-content: flex-end; }
.card-status { text-align: right; }

.approve-btn, .reject-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}
.approve-btn {
  background: rgba(16,185,129,0.15);
  color: #10b981;
  border: 1px solid rgba(16,185,129,0.25);
}
.approve-btn:hover {
  background: rgba(16,185,129,0.25);
  box-shadow: 0 4px 12px rgba(16,185,129,0.2);
  transform: translateY(-1px);
}
.reject-btn {
  background: rgba(239,68,68,0.1);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.2);
}
.reject-btn:hover {
  background: rgba(239,68,68,0.2);
  box-shadow: 0 4px 12px rgba(239,68,68,0.15);
  transform: translateY(-1px);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}
.status-badge.approved { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }
.status-badge.rejected { background: rgba(142,142,147,0.1); color: #8e8e93; border: 1px solid rgba(142,142,147,0.2); }

/* 拒绝弹窗 */
.reject-hint { font-size: 13px; color: #64748b; margin-bottom: 10px; }

.dialog-cancel-btn, .dialog-confirm-btn {
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}
.dialog-cancel-btn {
  background: rgba(255,255,255,0.05);
  color: #64748b;
  border: 1px solid rgba(255,255,255,0.08);
}
.dialog-cancel-btn:hover { background: rgba(255,255,255,0.08); }
.dialog-confirm-btn {
  background: rgba(239,68,68,0.15);
  color: #ef4444;
  border: 1px solid rgba(239,68,68,0.25);
}
.dialog-confirm-btn:hover { background: rgba(239,68,68,0.25); }
</style>
