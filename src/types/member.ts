export type Generation = '1期生' | '2期生' | '3期生' | '4期生' | '5期生' | '6期生';

export interface Member {
  code: string;
  name: string;
  englishName?: string;
  kana?: string;
  generation: Generation;
  imageUrl?: string;
  isGraduated: boolean;
  profileLink?: string;
}

export interface MembersByGeneration {
  [generation: string]: Member[];
}
