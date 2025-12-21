# Data Model: 乃木坂46スケジュールビューアー

**Date**: 2025-12-21
**Branch**: `001-schedule-viewer`

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│    Schedule     │         │     Member      │
├─────────────────┤         ├─────────────────┤
│ code (PK)       │         │ code (PK)       │
│ title           │         │ name            │
│ date            │         │ englishName     │
│ startTime       │         │ kana            │
│ endTime         │    ┌───►│ generation      │
│ category        │    │    │ imageUrl        │
│ description     │    │    │ isGraduated     │
│ link            │    │    │ profileLink     │
│ memberCodes[]───┼────┘    └─────────────────┘
└─────────────────┘

┌─────────────────┐
│    Category     │
├─────────────────┤
│ id (PK)         │
│ name            │
│ color           │
└─────────────────┘
```

## Entities

### Schedule（スケジュール）

イベント・出演情報を表すエンティティ。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 一意識別子（公式API由来） |
| title | string | Yes | イベント・番組タイトル |
| date | string | Yes | 日付（YYYY/MM/DD形式） |
| startTime | string | No | 開始時間（HH:MM形式） |
| endTime | string | No | 終了時間（HH:MM形式） |
| category | CategoryType | Yes | カテゴリ種別 |
| description | string | No | 詳細説明（HTML含む可能性あり） |
| link | string | No | 公式サイト詳細ページURL |
| memberCodes | string[] | Yes | 出演メンバーコードの配列 |

**Validation Rules**:
- `code`は空文字不可
- `date`はYYYY/MM/DD形式
- `category`は定義済みカテゴリのいずれか

### Member（メンバー）

乃木坂46メンバー情報を表すエンティティ。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Yes | 一意識別子（公式API由来） |
| name | string | Yes | 名前（日本語） |
| englishName | string | No | 名前（ローマ字） |
| kana | string | No | 名前（ひらがな） |
| generation | string | Yes | 世代（例: "1期生", "6期生"） |
| imageUrl | string | No | プロフィール画像URL |
| isGraduated | boolean | Yes | 卒業済みフラグ |
| profileLink | string | No | 公式プロフィールページURL |

**Validation Rules**:
- `code`は空文字不可
- `generation`は"1期生"〜"6期生"のいずれか
- `isGraduated`はAPI由来の`graduation`フィールドを変換

### Category（カテゴリ）

スケジュールの種類を表す列挙型。

| ID | Name | Color | API Value |
|----|------|-------|-----------|
| tv | TV | #4CAF50 (緑) | `tv` |
| radio | ラジオ | #2196F3 (青) | `radio` |
| live | ライブ | #F44336 (赤) | `live` |
| cd | CD/音楽 | #FF9800 (オレンジ) | `cd` |
| other | その他 | #9E9E9E (グレー) | その他全て |

## TypeScript Type Definitions

```typescript
// src/types/schedule.ts
export type CategoryType = 'tv' | 'radio' | 'live' | 'cd' | 'other';

export interface Schedule {
  code: string;
  title: string;
  date: string; // YYYY/MM/DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  category: CategoryType;
  description?: string;
  link?: string;
  memberCodes: string[];
}

// src/types/member.ts
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

// src/types/category.ts
export interface CategoryInfo {
  id: CategoryType;
  name: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'tv', name: 'TV', color: '#4CAF50' },
  { id: 'radio', name: 'ラジオ', color: '#2196F3' },
  { id: 'live', name: 'ライブ', color: '#F44336' },
  { id: 'cd', name: 'CD/音楽', color: '#FF9800' },
  { id: 'other', name: 'その他', color: '#9E9E9E' },
];
```

## API Response to Entity Mapping

### Schedule API → Schedule Entity

```typescript
// 公式APIレスポンス
interface ScheduleApiResponse {
  code: string;
  title: string;
  date: string; // "2025/12/21"
  start_time: string;
  end_time: string;
  cate: string; // "tv", "radio", "live", etc.
  text: string; // HTML含む
  link: string;
  arti_code: string[][]; // ネストした配列
}

// マッピング関数
const mapSchedule = (api: ScheduleApiResponse): Schedule => ({
  code: api.code,
  title: api.title,
  date: api.date,
  startTime: api.start_time || undefined,
  endTime: api.end_time || undefined,
  category: mapCategory(api.cate),
  description: api.text || undefined,
  link: api.link || undefined,
  memberCodes: flattenMemberCodes(api.arti_code),
});

const mapCategory = (cate: string): CategoryType => {
  if (['tv', 'radio', 'live', 'cd'].includes(cate)) {
    return cate as CategoryType;
  }
  return 'other';
};

const flattenMemberCodes = (codes: string[][]): string[] => {
  return codes.flat().filter(Boolean);
};
```

### Member API → Member Entity

```typescript
// 公式APIレスポンス
interface MemberApiResponse {
  code: string;
  name: string;
  english_name: string;
  kana: string;
  cate: string; // "1期生", "6期生", etc.
  img: string;
  link: string;
  graduation: string; // "YES" or "NO"
}

// マッピング関数
const mapMember = (api: MemberApiResponse): Member => ({
  code: api.code,
  name: api.name,
  englishName: api.english_name || undefined,
  kana: api.kana || undefined,
  generation: api.cate as Generation,
  imageUrl: api.img || undefined,
  isGraduated: api.graduation === 'YES',
  profileLink: api.link || undefined,
});
```

## Derived Data Structures

### SchedulesByDate（日付別スケジュールマップ）

カレンダー表示のための派生データ構造。

```typescript
type SchedulesByDate = Map<string, Schedule[]>;

// 使用例
const schedulesByDate: SchedulesByDate = new Map();
schedulesByDate.set('2025/12/21', [schedule1, schedule2]);
```

### MembersByGeneration（世代別メンバーマップ）

メンバーフィルターUIのための派生データ構造。

```typescript
type MembersByGeneration = Map<Generation, Member[]>;

// 使用例
const membersByGen: MembersByGeneration = new Map();
membersByGen.set('6期生', [member1, member2, ...]);
```

## State Transitions

このアプリケーションでは複雑な状態遷移はなし。
データは読み取り専用（公式APIからの取得のみ）。

## Data Volume Estimates

| Data | Estimated Size | Storage Impact |
|------|----------------|----------------|
| メンバーデータ | 98件 × ~500B = ~50KB | localStorage: OK |
| 月間スケジュール | 150件 × ~1KB = ~150KB | localStorage: OK |
| 3ヶ月分キャッシュ | ~450KB | localStorage 5MB制限内 |
