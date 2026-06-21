<template>
  <div class="my-honor">
    <el-card shadow="hover">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="🎨 皮肤库" name="skins">
          <div v-if="ownedSkins.length" class="skins-grid">
            <div
              v-for="skin in ownedSkins"
              :key="skin.id"
              class="skin-box"
              :class="{ equipped: skin.equipped }"
            >
              <div class="skin-cover" :class="'rarity-' + skin.rarity">
                <img :src="skin.cover || defaultSkin" :alt="skin.name" />
                <el-tag v-if="skin.equipped" type="success" effect="dark" class="equipped-tag">已佩戴</el-tag>
                <span class="rarity-tag">{{ skin.rarity }}</span>
              </div>
              <div class="skin-body">
                <div class="skin-name">{{ skin.name }}</div>
                <div class="skin-desc">{{ skin.description }}</div>
                <div class="skin-footer">
                  <el-tag size="small" :type="rarityType(skin.rarity)" effect="plain">
                    稀有度 {{ skin.rarity }}
                  </el-tag>
                  <span class="skin-points">{{ skin.points }} 积分</span>
                </div>
                <el-button
                  v-if="!skin.equipped"
                  type="primary"
                  size="small"
                  class="equip-btn"
                  :loading="loadingSkinId === skin.id"
                  @click="handleEquip(skin)"
                >申请佩戴</el-button>
              </div>
            </div>
          </div>
          <el-empty v-else description="还没有拥有任何皮肤，快去抽取盲盒吧！" />
        </el-tab-pane>

        <el-tab-pane label="👑 称号库" name="titles">
          <div v-if="titles.length" class="titles-grid">
            <div
              v-for="title in titles"
              :key="title.id"
              class="title-box"
              :class="{ 'is-current': title.current }"
            >
              <div class="title-icon">{{ title.current ? '👑' : '🎖️' }}</div>
              <div class="title-name">{{ title.name }}</div>
              <div class="title-desc">{{ title.description }}</div>
              <el-tag v-if="title.current" type="warning" effect="dark" size="small">当前称号</el-tag>
              <el-tag v-else type="info" size="small">{{ title.obtainedAt || '已获得' }}</el-tag>
            </div>
          </div>
          <el-empty v-else description="暂无称号，继续努力吧！" />
        </el-tab-pane>

        <el-tab-pane label="💎 积分明细" name="points">
          <el-table :data="pointsLog" stripe style="width: 100%">
            <el-table-column prop="time" label="时间" width="180" />
            <el-table-column label="变动" width="120">
              <template #default="{ row }">
                <span :class="row.change > 0 ? 'change-positive' : 'change-negative'">
                  {{ row.change > 0 ? '+' : '' }}{{ row.change }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="类别" width="140">
              <template #default="{ row }">
                <el-tag size="small" :type="categoryType(row.category)" effect="plain">
                  {{ row.category }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
            <el-table-column label="余额" width="120" align="right">
              <template #default="{ row }">
                <span class="balance">{{ row.balance }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { useStudentStore } from '../../stores/student';
import { submitRequest } from '../../api/request';

const auth = useAuthStore();
const studentStore = useStudentStore();
const defaultSkin = 'https://via.placeholder.com/300x200?text=Skin';

const activeTab = ref('skins');
const loadingSkinId = ref<string | number | null>(null);
const ownedSkins = ref<any[]>([]);
const titles = ref<any[]>([]);
const pointsLog = ref<any[]>([]);

const rarityType = (rarity: string) => {
  switch (rarity) {
    case 'SSR': return 'danger';
    case 'SR': return 'warning';
    case 'R': return 'primary';
    default: return 'info';
  }
};

const categoryType = (cat: string) => {
  if (cat.includes('奖励') || cat.includes('获得')) return 'success';
  if (cat.includes('消耗') || cat.includes('盲盒')) return 'warning';
  if (cat.includes('申请')) return 'primary';
  return 'info';
};

const handleEquip = async (skin: any) => {
  try {
    await ElMessageBox.confirm(`确认申请佩戴「${skin.name}」皮肤吗？`, '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'info'
    });
    loadingSkinId.value = skin.id;
    await submitRequest({
      type: 'skin',
      title: `申请佩戴${skin.name}`,
      detail: `学生申请佩戴「${skin.name}」皮肤（${skin.rarity}）`
    }).catch(() => ({ data: {} }));
    ownedSkins.value.forEach(s => { s.equipped = s.id === skin.id; });
    ElMessage.success('申请已提交，等待老师审批');
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e?.message || '申请失败');
  } finally {
    loadingSkinId.value = null;
  }
};

const loadData = async () => {
  try {
    const honor = await studentStore.loadHonor(auth.user?.id || 1).catch(() => null);
    if (honor && (honor as any).data) {
      const d = (honor as any).data;
      ownedSkins.value = d.skins || [];
      titles.value = d.titles || [];
      pointsLog.value = d.pointsLog || [];
    }
  } catch (e: any) {
    // fallthrough
  }

  if (!ownedSkins.value.length) {
    ownedSkins.value = [
      { id: 1, name: '森林守护者', rarity: 'SSR', description: '神秘森林传说', points: 200, equipped: true, cover: '' },
      { id: 2, name: '星空探险家', rarity: 'SR', description: '探索浩瀚宇宙', points: 150, equipped: false, cover: '' },
      { id: 3, name: '海洋之心', rarity: 'R', description: '深海蓝色战士', points: 100, equipped: false, cover: '' },
      { id: 4, name: '学习达人', rarity: 'N', description: '勤奋学习的奖励', points: 50, equipped: false, cover: '' },
      { id: 5, name: '火焰战士', rarity: 'SR', description: '燃烧的斗志', points: 150, equipped: false, cover: '' },
      { id: 6, name: '冰雪公主', rarity: 'SSR', description: '纯净之冰', points: 200, equipped: false, cover: '' }
    ];
  }

  if (!titles.value.length) {
    titles.value = [
      { id: 1, name: '学习之星', description: '月度学习积极分子', current: true, obtainedAt: '2025-03-01' },
      { id: 2, name: '进步奖', description: '成绩进步最大', current: false, obtainedAt: '2025-02-15' },
      { id: 3, name: '文明守纪', description: '遵守纪律好榜样', current: false, obtainedAt: '2025-01-20' },
      { id: 4, name: '助人为乐', description: '热心帮助同学', current: false, obtainedAt: '2024-12-10' }
    ];
  }

  if (!pointsLog.value.length) {
    pointsLog.value = [
      { time: '2025-06-20 09:30', change: 10, category: '课堂奖励', remark: '课堂表现优秀', balance: 480 },
      { time: '2025-06-19 15:20', change: 20, category: '称号奖励', remark: '获得「学习之星」称号', balance: 470 },
      { time: '2025-06-18 10:00', change: -30, category: '盲盒消耗', remark: '抽取神秘盲盒', balance: 450 },
      { time: '2025-06-17 14:30', change: 15, category: '作业奖励', remark: '作业完成优秀', balance: 480 },
      { time: '2025-06-15 09:00', change: 5, category: '课堂奖励', remark: '主动回答问题', balance: 465 },
      { time: '2025-06-10 16:00', change: 50, category: '皮肤奖励', remark: '获得「森林守护者」皮肤', balance: 460 },
      { time: '2025-06-05 10:30', change: 8, category: '课堂奖励', remark: '小组作业第一', balance: 410 }
    ];
  }
};

onMounted(loadData);
</script>

<style scoped>
.my-honor {
  display: flex;
  flex-direction: column;
}

.skins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.skin-box {
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: all 0.2s;
}

.skin-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.skin-box.equipped {
  border-color: #67c23a;
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.15);
}

.skin-cover {
  position: relative;
  height: 130px;
  background: #f0f2f5;
}

.skin-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipped-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.rarity-tag {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.92);
}

.rarity-SSR .rarity-tag { color: #f56c6c; }
.rarity-SR .rarity-tag { color: #e6a23c; }
.rarity-R .rarity-tag { color: #409eff; }
.rarity-N .rarity-tag { color: #909399; }

.skin-body {
  padding: 12px;
}

.skin-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.skin-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
  min-height: 32px;
  line-height: 1.4;
}

.skin-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.skin-points {
  font-size: 13px;
  color: #e6a23c;
  font-weight: 600;
}

.equip-btn {
  width: 100%;
}

.titles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.title-box {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  transition: all 0.2s;
}

.title-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.title-box.is-current {
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
  border-color: #e6a23c;
}

.title-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.title-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.title-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.4;
}

.change-positive {
  color: #67c23a;
  font-weight: 600;
}

.change-negative {
  color: #f56c6c;
  font-weight: 600;
}

.balance {
  font-weight: 600;
  color: #303133;
}
</style>
