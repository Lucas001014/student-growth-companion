import User from './User';
import ClassModel from './Class';
import Student from './Student';
import Skin from './Skin';
import Title from './Title';
import IdentityBadge from './IdentityBadge';
import PointsRecord from './PointsRecord';
import BlindBox from './BlindBox';
import BlindBoxItem from './BlindBoxItem';
import BlindBoxDraw from './BlindBoxDraw';
import Request from './Request';
import HomeworkUpload from './HomeworkUpload';
import Announcement from './Announcement';
import StudentSkin from './StudentSkin';
import StudentTitle from './StudentTitle';
import StudentIdentity from './StudentIdentity';
import TeacherClass from './TeacherClass';
import ScreenDevice from './ScreenDevice';

// 教师 <-> 班级 (多对多)
User.belongsToMany(ClassModel, { through: TeacherClass, foreignKey: 'teacher_id', as: 'classes' });
ClassModel.belongsToMany(User, { through: TeacherClass, foreignKey: 'class_id', as: 'teachers' });

// 班级 -> 学生 (一对多)
ClassModel.hasMany(Student, { foreignKey: 'class_id', as: 'students' });
Student.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });

// 学生 <-> 皮肤 (多对多, 附带佩戴、来源)
Student.belongsToMany(Skin, { through: StudentSkin, foreignKey: 'student_id', as: 'skins' });
Skin.belongsToMany(Student, { through: StudentSkin, foreignKey: 'skin_id', as: 'students' });
StudentSkin.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
StudentSkin.belongsTo(Skin, { foreignKey: 'skin_id', as: 'skin' });

// 学生 <-> 称号
Student.belongsToMany(Title, { through: StudentTitle, foreignKey: 'student_id', as: 'titles' });
Title.belongsToMany(Student, { through: StudentTitle, foreignKey: 'title_id', as: 'students' });
StudentTitle.belongsTo(Title, { foreignKey: 'title_id', as: 'title' });

// 学生 <-> 身份标识
Student.belongsToMany(IdentityBadge, { through: StudentIdentity, foreignKey: 'student_id', as: 'identities' });
IdentityBadge.belongsToMany(Student, { through: StudentIdentity, foreignKey: 'badge_id', as: 'students' });

// 积分记录
Student.hasMany(PointsRecord, { foreignKey: 'student_id', as: 'points_records' });
PointsRecord.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// 盲盒
BlindBox.hasMany(BlindBoxItem, { foreignKey: 'blind_box_id', as: 'items' });
BlindBoxItem.belongsTo(BlindBox, { foreignKey: 'blind_box_id', as: 'blind_box' });
BlindBox.hasMany(BlindBoxDraw, { foreignKey: 'blind_box_id', as: 'draws' });
BlindBoxDraw.belongsTo(BlindBox, { foreignKey: 'blind_box_id', as: 'blind_box' });
Student.hasMany(BlindBoxDraw, { foreignKey: 'student_id', as: 'draws' });
BlindBoxDraw.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// 申请记录
Student.hasMany(Request, { foreignKey: 'student_id', as: 'requests' });
Request.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// 选择题上传
Student.hasMany(HomeworkUpload, { foreignKey: 'student_id', as: 'homework_uploads' });
HomeworkUpload.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

// 公告
ClassModel.hasMany(Announcement, { foreignKey: 'class_id', as: 'announcements' });
Announcement.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });

// 教室屏幕
ClassModel.hasMany(ScreenDevice, { foreignKey: 'class_id', as: 'screens' });
ScreenDevice.belongsTo(ClassModel, { foreignKey: 'class_id', as: 'class' });

// 当前佩戴的皮肤/称号 - 用于学生查询
Student.hasOne(StudentSkin, { foreignKey: 'student_id', as: 'equipped_skin', scope: { is_equipped: 1 } });
Student.hasOne(StudentTitle, { foreignKey: 'student_id', as: 'equipped_title', scope: { is_equipped: 1 } });

export {
  User,
  ClassModel,
  Student,
  Skin,
  Title,
  IdentityBadge,
  PointsRecord,
  BlindBox,
  BlindBoxItem,
  BlindBoxDraw,
  Request,
  HomeworkUpload,
  Announcement,
  StudentSkin,
  StudentTitle,
  StudentIdentity,
  TeacherClass,
  ScreenDevice,
};
