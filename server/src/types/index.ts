export type UserRole = 'admin' | 'teacher';
export type StudentMode = 'student' | 'parent';
export type Rarity = 'N' | 'R' | 'SR' | 'SSR';
export type TitleCategory = 'study' | 'behavior' | 'moral' | 'special' | 'blindbox';
export type PointsSource = 'teacher_grant' | 'homework_confirm' | 'blindbox' | 'exchange';
export type BlindBoxItemType = 'skin' | 'title' | 'points' | 'empty';
export type RequestType = 'skin_change' | 'title_change' | 'homework_confirm';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type RankingType = 'points' | 'skins' | 'titles';
export type RankingPeriod = 'week' | 'month' | 'semester' | 'all';

export interface JwtPayload {
  id: number;
  role: UserRole | 'student';
  name: string;
  classId?: number;
  mode?: StudentMode;
  studentNo?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
