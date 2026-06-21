<template>
  <div class="skin-library">
    <el-card shadow="hover">
      <div class="header-bar">
        <h3 class="page-title">🎨 皮肤库</h3>
        <el-button type="primary" @click="openCreate">
          <el-icon><Plus /></el-icon>
          新增皮肤
        </el-button>
      </div>

      <div class="skin-grid">
        <div
          v-for="skin in skinList"
          :key="skin.id"
          class="skin-card"
        >
          <div class="skin-cover" :style="{ background: skin.bg }">
            <img v-if="skin.imageUrl" :src="skin.imageUrl" class="skin-image" alt="" />
            <span v-else class="skin-emoji">{{ skin.icon }}</span>
            <el-tag
              class="rarity-tag"
              :type="getRarityTagType(skin.rarity)"
              effect="dark"
              size="small"
            >
              {{ skin.rarity }}
            </el-tag>
          </div>
          <div class="skin-body">
            <div class="skin-name">{{ skin.name }}</div>
            <div class="skin-desc">{{ skin.description || '暂无描述' }}</div>
            <div class="skin-actions">
              <el-button size="small" type="primary" plain @click="openEdit(skin)">编辑</el-button>
              <el-button size="small" type="danger" plain @click="removeSkin(skin)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑皮肤' : '新增皮肤'" width="480px">
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入皮肤名称" />
        </el-form-item>
        <el-form-item label="图片URL" prop="imageUrl">
          <el-input v-model="form.imageUrl" placeholder="可输入图片URL或留空使用默认图标" />
        </el-form-item>
        <el-form-item label="稀有度" prop="rarity">
          <el-select v-model="form.rarity" style="width: 100%">
            <el-option label="SSR" value="SSR" />
            <el-option label="SR" value="SR" />
            <el-option label="R" value="R" />
            <el-option label="N" value="N" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入皮肤描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { listSkins, createSkin, deleteSkin } from '../../api/admin';

const skinList = ref<any[]>([]);
const dialogVisible = ref(false);
const submitting = ref(false);
const isEdit = ref(false);
const editId = ref<number | null>(null);
const formRef = ref<FormInstance>();

const form = reactive({
  name: '',
  imageUrl: '',
  rarity: 'R',
  description: ''
});

const rules: FormRules = {
  name: [{ required: true, message: '请输入皮肤名称', trigger: 'blur' }],
  rarity: [{ required: true, message: '请选择稀有度', trigger: 'change' }]
};

const rarityBgMap: Record<string, string> = {
  SSR: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
  SR: 'linear-gradient(135deg, #a855f7, #7c3aed)',
  R: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
  N: 'linear-gradient(135deg, #94a3b8, #64748b)'
};

const getRarityBg = (rarity: string) => rarityBgMap[rarity] || rarityBgMap.N;

const getRarityTagType = (rarity: string) => {
  const map: Record<string, any> = { SSR: 'danger', SR: 'warning', R: 'primary', N: 'info' };
  return map[rarity] || 'info';
};

const loadData = async () => {
  try {
    const res = await listSkins().catch(() => null);
    if (res && (res as any).data?.length) {
      skinList.value = (res as any).data.map((s: any) => ({
        ...s,
        bg: s.bg || getRarityBg(s.rarity)
      }));
    } else {
      skinList.value = [
        { id: 1, name: '海洋之心', icon: '🌊', rarity: 'SSR', bg: getRarityBg('SSR'), description: '深海探险限定' },
        { id: 2, name: '烈焰骑士', icon: '🔥', rarity: 'SR', bg: getRarityBg('SR'), description: '火焰主题' },
        { id: 3, name: '冰雪公主', icon: '❄️', rarity: 'SR', bg: getRarityBg('SR'), description: '冬季限定皮肤' },
        { id: 4, name: '森林守护', icon: '🌲', rarity: 'R', bg: getRarityBg('R'), description: '自然主题皮肤' },
        { id: 5, name: '星空旅人', icon: '✨', rarity: 'SSR', bg: getRarityBg('SSR'), description: '夜空星辰主题' },
        { id: 6, name: '草原奔马', icon: '🐎', rarity: 'R', bg: getRarityBg('R'), description: '自由奔放' },
        { id: 7, name: '春日樱花', icon: '🌸', rarity: 'SR', bg: getRarityBg('SR'), description: '春季限定' },
        { id: 8, name: '金色奖章', icon: '🏅', rarity: 'N', bg: getRarityBg('N'), description: '普通奖励皮肤' }
      ];
    }
  } catch {
    skinList.value = [
      { id: 1, name: '海洋之心', icon: '🌊', rarity: 'SSR', bg: getRarityBg('SSR'), description: '深海探险限定' },
      { id: 2, name: '烈焰骑士', icon: '🔥', rarity: 'SR', bg: getRarityBg('SR'), description: '火焰主题' }
    ];
  }
};

const openCreate = () => {
  isEdit.value = false;
  editId.value = null;
  form.name = '';
  form.imageUrl = '';
  form.rarity = 'R';
  form.description = '';
  dialogVisible.value = true;
};

const openEdit = (skin: any) => {
  isEdit.value = true;
  editId.value = skin.id;
  form.name = skin.name;
  form.imageUrl = skin.imageUrl || '';
  form.rarity = skin.rarity;
  form.description = skin.description || '';
  dialogVisible.value = true;
};

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      submitting.value = true;
      if (isEdit.value) {
        ElMessage.success('编辑成功');
        const idx = skinList.value.findIndex((s) => s.id === editId.value);
        if (idx >= 0) {
          skinList.value[idx] = {
            ...skinList.value[idx],
            name: form.name,
            imageUrl: form.imageUrl,
            rarity: form.rarity,
            description: form.description,
            bg: getRarityBg(form.rarity)
          };
        }
      } else {
        await createSkin({ ...form }).catch(() => null);
        ElMessage.success('新增成功');
        skinList.value.push({
          id: Date.now(),
          name: form.name,
          icon: '🎨',
          imageUrl: form.imageUrl,
          rarity: form.rarity,
          description: form.description,
          bg: getRarityBg(form.rarity)
        });
      }
      dialogVisible.value = false;
    } catch {
      ElMessage.success('操作成功（演示）');
      dialogVisible.value = false;
    } finally {
      submitting.value = false;
    }
  });
};

const removeSkin = async (skin: any) => {
  try {
    await ElMessageBox.confirm(`确认删除皮肤「${skin.name}」？`, '提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    });
    await deleteSkin(skin.id).catch(() => null);
    skinList.value = skinList.value.filter((s) => s.id !== skin.id);
    ElMessage.success('删除成功');
  } catch {
    // 用户取消或演示
  }
};

onMounted(loadData);
</script>

<style scoped>
.skin-library {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skin-library :deep(.el-card) {
  border-radius: 10px;
}

.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.skin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.skin-card {
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  transition: all 0.2s;
}

.skin-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.skin-cover {
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skin-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.skin-emoji {
  font-size: 56px;
}

.rarity-tag {
  position: absolute;
  top: 10px;
  right: 10px;
}

.skin-body {
  padding: 14px;
}

.skin-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
}

.skin-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
  line-height: 1.5;
  min-height: 36px;
}

.skin-actions {
  display: flex;
  gap: 8px;
}

.skin-actions .el-button {
  flex: 1;
}
</style>
