# Quickstart: 乃木坂46スケジュールビューアー

**Date**: 2025-12-21
**Branch**: `001-schedule-viewer`

## Prerequisites

- Node.js 18.x 以上
- npm 9.x 以上（または yarn/pnpm）
- Git

## Setup

### 1. リポジトリのクローン

```bash
git clone https://github.com/[username]/nogi.git
cd nogi
git checkout 001-schedule-viewer
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く。

## Project Structure

```
nogi/
├── src/
│   ├── components/       # Reactコンポーネント
│   │   ├── Calendar/     # カレンダー表示
│   │   ├── Filter/       # フィルターUI
│   │   ├── Schedule/     # スケジュール詳細
│   │   └── common/       # 共通コンポーネント
│   ├── hooks/            # カスタムフック
│   ├── services/         # APIサービス
│   ├── types/            # TypeScript型定義
│   ├── utils/            # ユーティリティ
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── 404.html          # SPA用フォールバック
├── tests/
│   └── unit/             # ユニットテスト
├── specs/                # 仕様ドキュメント
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 開発サーバー起動（ホットリロード有効） |
| `npm run build` | 本番ビルド（`dist/`に出力） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run test` | ユニットテスト実行 |
| `npm run lint` | ESLintによるコードチェック |
| `npm run format` | Prettierによるフォーマット |

## Development Workflow

### 1. 機能開発

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルでテスト実行（ウォッチモード）
npm run test -- --watch
```

### 2. コード品質チェック

```bash
# リント
npm run lint

# フォーマット
npm run format

# 型チェック
npm run typecheck
```

### 3. ビルド確認

```bash
# ビルド
npm run build

# プレビュー（GitHub Pagesと同様のパスで確認）
npm run preview
```

## Key Components

### CalendarView

月間カレンダーを表示するメインコンポーネント。

```tsx
<CalendarView
  month={currentMonth}
  schedules={filteredSchedules}
  onDateClick={(date) => setSelectedDate(date)}
  onMonthChange={(month) => setCurrentMonth(month)}
/>
```

### MemberFilter

メンバー選択フィルターUI。

```tsx
<MemberFilter
  members={members}
  selectedMembers={selectedMembers}
  showGraduated={showGraduatedMembers}
  onMemberToggle={(code) => toggleMember(code)}
  onShowGraduatedToggle={() => setShowGraduatedMembers(!showGraduatedMembers)}
/>
```

### CategoryFilter

カテゴリ選択フィルターUI。

```tsx
<CategoryFilter
  categories={CATEGORIES}
  selectedCategories={selectedCategories}
  onCategoryToggle={(id) => toggleCategory(id)}
/>
```

## API Integration

### JSONP呼び出し

```typescript
import fetchJsonp from 'fetch-jsonp';

const fetchSchedules = async (yearMonth: string) => {
  const response = await fetchJsonp(
    `https://www.nogizaka46.com/s/n46/api/list/schedule?dy=${yearMonth}`,
    { jsonpCallbackFunction: 'res' }
  );
  const data = await response.json();
  return data.data.map(mapSchedule);
};
```

### オフラインキャッシュ

```typescript
// キャッシュ保存
const cacheData = <T>(key: string, data: T, ttlMs: number) => {
  const entry = {
    data,
    cachedAt: Date.now(),
    expiresAt: Date.now() + ttlMs,
  };
  localStorage.setItem(key, JSON.stringify(entry));
};

// キャッシュ取得
const getCachedData = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  const entry = JSON.parse(cached);
  if (Date.now() > entry.expiresAt) return null;
  return entry.data;
};
```

## Deployment

### GitHub Pages

1. `vite.config.ts`でbase pathを設定:

```typescript
export default defineConfig({
  base: '/nogi/',
  plugins: [react()],
});
```

2. ビルド & デプロイ:

```bash
npm run build
# distフォルダをgh-pagesブランチにプッシュ
```

または GitHub Actions で自動デプロイ（推奨）。

## Troubleshooting

### JSONP呼び出しエラー

**症状**: `Failed to fetch` エラー

**原因**: ブラウザ拡張機能がリクエストをブロックしている可能性

**対処**:
- 広告ブロッカーを一時的に無効化
- シークレットモードで試行

### カレンダーが表示されない

**症状**: ローディングが終わらない

**原因**: APIレスポンスの形式変更の可能性

**対処**:
1. ブラウザのDevToolsでネットワークタブを確認
2. APIレスポンスの形式を確認
3. `services/scheduleService.ts`のマッピング関数を修正

### GitHub Pagesで404

**症状**: デプロイ後にアセットが404

**原因**: base path設定が不正

**対処**:
1. `vite.config.ts`の`base`がリポジトリ名と一致しているか確認
2. React Routerの`basename`も同様に確認
