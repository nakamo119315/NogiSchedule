# API Contracts: 乃木坂46スケジュールビューアー

**Date**: 2025-12-21
**Branch**: `001-schedule-viewer`

## Overview

このアプリケーションは乃木坂46公式サイトの外部APIを使用します。
バックエンドは持たないため、APIコントラクトは外部API仕様の文書化です。

## External APIs

### 1. Schedule API

**Endpoint**: `https://www.nogizaka46.com/s/n46/api/list/schedule`

**Method**: GET (JSONP)

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dy | string | Yes | 年月（YYYYMM形式、例: "202512"） |
| callback | string | No | JSONPコールバック関数名 |

**Request Example**:
```
https://www.nogizaka46.com/s/n46/api/list/schedule?dy=202512
```

**Response Format**: JSONP

```javascript
res({
  "count": "162",
  "data": [
    {
      "code": "106266",
      "title": "乃木坂46 40thSGアンダーライブ",
      "date": "2025/12/21",
      "start_time": "17:00",
      "end_time": "20:00",
      "cate": "live",
      "text": "<p>詳細説明...</p>",
      "link": "https://www.nogizaka46.com/s/n46/page/...",
      "arti_code": [["12345"], ["67890"]]
    }
  ]
})
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| count | string | 総件数 |
| data | array | スケジュール配列 |
| data[].code | string | スケジュール識別子 |
| data[].title | string | タイトル |
| data[].date | string | 日付（YYYY/MM/DD） |
| data[].start_time | string | 開始時間（HH:MM） |
| data[].end_time | string | 終了時間（HH:MM） |
| data[].cate | string | カテゴリ（tv/radio/live/cd/etc） |
| data[].text | string | 説明（HTML含む） |
| data[].link | string | 詳細ページURL |
| data[].arti_code | string[][] | メンバーコード（ネスト配列） |

**Known Categories**:
- `tv`: テレビ出演
- `radio`: ラジオ出演
- `live`: ライブ・イベント
- `cd`: CD/音楽関連
- その他の値: その他カテゴリとして扱う

---

### 2. Member API

**Endpoint**: `https://www.nogizaka46.com/s/n46/api/list/member`

**Method**: GET (JSONP)

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | string | No | JSONPコールバック関数名 |

**Request Example**:
```
https://www.nogizaka46.com/s/n46/api/list/member
```

**Response Format**: JSONP

```javascript
res({
  "count": "98",
  "data": [
    {
      "code": "63111",
      "name": "矢田 萌葉",
      "english_name": "moeka yada",
      "kana": "やだ もえか",
      "cate": "6期生",
      "img": "https://...",
      "link": "https://www.nogizaka46.com/s/n46/artist/...",
      "pick": "選抜メンバー",
      "god": "福神",
      "under": "アンダー",
      "birthday": "2008/01/27",
      "blood": "B型",
      "constellation": "みずがめ座",
      "graduation": "NO",
      "groupcode": "6期生"
    }
  ]
})
```

**Response Fields**:

| Field | Type | Description |
|-------|------|-------------|
| count | string | 総メンバー数 |
| data | array | メンバー配列 |
| data[].code | string | メンバー識別子 |
| data[].name | string | 名前（日本語） |
| data[].english_name | string | 名前（ローマ字） |
| data[].kana | string | 名前（ひらがな） |
| data[].cate | string | 世代（1期生〜6期生） |
| data[].img | string | プロフィール画像URL |
| data[].link | string | プロフィールページURL |
| data[].graduation | string | 卒業フラグ（"YES"/"NO"） |
| data[].birthday | string | 生年月日 |
| data[].blood | string | 血液型 |

**Note**: `pick`, `god`, `under`フィールドは本アプリでは使用しない。

---

## Client-Side Service Interface

### ScheduleService

```typescript
interface ScheduleService {
  /**
   * 指定月のスケジュールを取得
   * @param yearMonth YYYYMM形式の年月
   * @returns スケジュール配列
   */
  fetchSchedules(yearMonth: string): Promise<Schedule[]>;

  /**
   * キャッシュからスケジュールを取得（オフライン用）
   * @param yearMonth YYYYMM形式の年月
   * @returns キャッシュされたスケジュール配列、なければnull
   */
  getCachedSchedules(yearMonth: string): Schedule[] | null;
}
```

### MemberService

```typescript
interface MemberService {
  /**
   * 全メンバー情報を取得
   * @returns メンバー配列
   */
  fetchMembers(): Promise<Member[]>;

  /**
   * キャッシュからメンバーを取得（オフライン用）
   * @returns キャッシュされたメンバー配列、なければnull
   */
  getCachedMembers(): Member[] | null;

  /**
   * メンバーコードから名前を取得
   * @param code メンバーコード
   * @returns メンバー名、見つからなければ"不明"
   */
  getMemberName(code: string): string;
}
```

---

## Error Handling

### Network Errors

```typescript
interface ApiError {
  type: 'NETWORK_ERROR' | 'PARSE_ERROR' | 'TIMEOUT';
  message: string;
  originalError?: Error;
}
```

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| ネットワーク切断 | キャッシュデータを表示、エラーメッセージ表示 |
| APIタイムアウト | 10秒後にタイムアウト、リトライボタン表示 |
| 不正なJSONP | パースエラーとして処理、リトライボタン表示 |
| 空のレスポンス | 「スケジュールがありません」メッセージ表示 |

---

## Caching Strategy

### Cache Keys

```typescript
const CACHE_KEYS = {
  schedules: (yearMonth: string) => `nogi_schedule_${yearMonth}`,
  members: () => 'nogi_members',
  lastUpdated: (key: string) => `${key}_updated`,
};
```

### Cache TTL

| Data | TTL | Rationale |
|------|-----|-----------|
| スケジュール | 30分 | 頻繁な更新はないが、当日の変更に対応 |
| メンバー | 24時間 | 変更頻度が低い |

### Cache Structure

```typescript
interface CacheEntry<T> {
  data: T;
  cachedAt: number; // Unix timestamp
  expiresAt: number; // Unix timestamp
}
```
