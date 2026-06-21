import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import '../models/index';
import User from '../models/User';
import ClassModel from '../models/Class';
import Skin from '../models/Skin';
import Title from '../models/Title';
import Student from '../models/Student';

async function syncDB(alter: boolean = true): Promise<void> {
  try {
    await sequelize.sync({ alter });
    console.log('[syncDB] 表结构同步完成');

    const [admin, adminCreated] = await User.findOrCreate({
      where: { phone: '13800000000' },
      defaults: {
        phone: '13800000000',
        password_hash: await bcrypt.hash('admin123', 10),
        name: '超级管理员',
        role: 'admin',
        is_active: 1,
      },
    });
    if (adminCreated) console.log('[syncDB] 默认管理员已创建：13800000000 / admin123');

    const [teacher, teacherCreated] = await User.findOrCreate({
      where: { phone: '13900000000' },
      defaults: {
        phone: '13900000000',
        password_hash: await bcrypt.hash('teacher123', 10),
        name: '示例老师',
        role: 'teacher',
        is_active: 1,
      },
    });
    if (teacherCreated) console.log('[syncDB] 示例老师已创建：13900000000 / teacher123');

    const [cls] = await ClassModel.findOrCreate({
      where: { name: '三年级一班' },
      defaults: { name: '三年级一班', grade: '三年级' },
    });
    console.log('[syncDB] 班级：', cls.id);

    const [skin1] = await Skin.findOrCreate({
      where: { name: '小白龙' },
      defaults: { name: '小白龙', image_url: '/skins/xiaobailong.png', rarity: 'N', description: '初级皮肤' },
    });
    const [skin2] = await Skin.findOrCreate({
      where: { name: '金色战士' },
      defaults: { name: '金色战士', image_url: '/skins/golden.png', rarity: 'SR', description: 'SR级皮肤' },
    });
    console.log('[syncDB] 示例皮肤：', skin1.id, skin2.id);

    const [title1] = await Title.findOrCreate({
      where: { name: '学习小能手' },
      defaults: { name: '学习小能手', icon: '/titles/study1.png', category: 'study' },
    });
    const [title2] = await Title.findOrCreate({
      where: { name: '品德之星' },
      defaults: { name: '品德之星', icon: '/titles/moral1.png', category: 'moral' },
    });
    console.log('[syncDB] 示例称号：', title1.id, title2.id);

    console.log('[syncDB] 完成');
  } catch (e) {
    console.error('[syncDB] 出错：', e);
  }
}

if (require.main === module) {
  syncDB(true).then(() => process.exit(0));
}

export default syncDB;
export { syncDB };
