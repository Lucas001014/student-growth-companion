import { HomeworkUpload, Student, ClassModel } from '../models/index';

class HomeworkService {
  async uploadHomework(
    studentId: number,
    subject: string,
    imageUrl: string,
    description?: string
  ): Promise<any> {
    const student = await Student.findOne({ where: { id: studentId, is_deleted: 0 } });
    if (!student) throw new Error('学生不存在');
    const upload = await HomeworkUpload.create({
      student_id: studentId,
      subject,
      image_url: imageUrl,
      description,
      is_public: 0,
    });
    return upload;
  }

  async setVisibility(uploadId: number, isPublic: number, teacherNote?: string): Promise<any> {
    const upload = await HomeworkUpload.findByPk(uploadId);
    if (!upload) throw new Error('作业上传不存在');
    const now = new Date();
    await upload.update({
      is_public: isPublic ? 1 : 0,
      teacher_note: teacherNote ?? upload.teacher_note,
      reviewed_at: isPublic ? now : upload.reviewed_at,
    });
    return upload;
  }

  async getPublicHomework(classId: number, subject?: string): Promise<any[]> {
    const where: any = { is_public: 1 };
    if (subject) where.subject = subject;
    const list = await HomeworkUpload.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'student_no', 'name', 'class_id'],
          where: { class_id: classId, is_deleted: 0 },
        },
      ],
      order: [['created_at', 'DESC']],
      limit: 200,
    });
    return list;
  }

  async getMyUploads(studentId: number): Promise<any[]> {
    const list = await HomeworkUpload.findAll({
      where: { student_id: studentId },
      order: [['created_at', 'DESC']],
      limit: 100,
    });
    return list;
  }
}

export const homeworkService = new HomeworkService();
export default homeworkService;
