# Research: 乃木坂46スケジュールビューアー

**Date**: 2025-12-21
**Branch**: `001-schedule-viewer`

## 1. JSONP API対応

### Decision
`fetch-jsonp` ライブラリを使用してJSONP APIを呼び出す

### Rationale
- 乃木坂46公式APIはJSONP形式（`res({...})`でラップ）で提供されており、標準のFetch APIではCORS制約により直接呼び出せない
- `fetch-jsonp`はPromiseベースのAPIを提供し、async/awaitと組み合わせて使用可能
- 軽量で、ネイティブfetchと同様のインターフェースを持つ

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| ネイティブFetch API | JSONP非対応、CORS制約あり |
| jQuery.ajax | jQueryは大きすぎる依存、Reactプロジェクトには不要 |
| 手動script要素挿入 | コードが複雑になる、エラーハンドリングが困難 |
| プロキシサーバー | バックエンドが必要、Constitution違反 |

### Implementation Notes
```typescript
import fetchJsonp from 'fetch-jsonp';

const fetchSchedule = async (yearMonth: string) => {
  const response = await fetchJsonp(
    `https://www.nogizaka46.com/s/n46/api/list/schedule?dy=${yearMonth}`,
    { jsonpCallback: 'callback', jsonpCallbackFunction: 'res' }
  );
  return response.json();
};
```

## 2. GitHub Pages デプロイ設定

### Decision
Viteの`base`オプションでリポジトリ名を設定し、GitHub Actionsでデプロイ

### Rationale
- GitHub Pagesはプロジェクトページを`username.github.io/repo-name/`で提供
- Viteの`base`設定がないと、アセットパスが解決できず404エラーになる
- GitHub Actionsで自動デプロイを設定することで、pushごとに自動更新

### Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/nogi/', // リポジトリ名に合わせて変更
});
```

### SPA Routing
```typescript
// React Router使用時
const router = createBrowserRouter(routes, {
  basename: '/nogi/', // baseと一致させる
});
```

### 404.html対応
GitHub PagesはSPAのクライアントサイドルーティングをサポートしないため、404.htmlを使用してindex.htmlにリダイレクトする技法を使用:

```html
<!-- public/404.html -->
<!DOCTYPE html>
<html>
  <head>
    <script>
      // パスをクエリパラメータに変換してindex.htmlにリダイレクト
      const path = window.location.pathname;
      window.location.replace('/?path=' + encodeURIComponent(path));
    </script>
  </head>
</html>
```

## 3. オフラインキャッシュ戦略

### Decision
localStorageを使用してAPIレスポンスをキャッシュ

### Rationale
- IndexedDBより実装がシンプル
- スケジュールデータ量（月間150-200件）はlocalStorageの5MB制限内に収まる
- メンバーデータ（98名）も同様に小さい

### Implementation Strategy
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

const CACHE_TTL = 30 * 60 * 1000; // 30分

const getCachedData = <T>(key: string): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const entry: CacheEntry<T> = JSON.parse(cached);
  if (Date.now() > entry.expiresAt) {
    localStorage.removeItem(key);
    return null;
  }
  return entry.data;
};
```

## 4. カレンダーUI実装

### Decision
カスタム実装（React + CSS Grid）

### Rationale
- 要件がシンプル（月間ビューのみ）
- ライブラリ追加によるバンドルサイズ増加を避ける
- Simplicity First原則に従う

### Alternatives Considered
| Alternative | Rejected Because |
|-------------|------------------|
| react-big-calendar | 機能過多、バンドルサイズ増加 |
| @fullcalendar/react | 複雑な設定、ライセンス確認必要 |
| date-fns + カスタム | date-fnsは採用（日付操作のみ） |

### Implementation Approach
- CSS Gridで7列（曜日）のカレンダーグリッド
- 各セルにその日のスケジュールをカテゴリ別色分けで表示
- 日付クリックでモーダル/詳細パネル表示

## 5. 状態管理

### Decision
React hooks (useState, useReducer, Context) のみ使用

### Rationale
- アプリの規模が小さく、グローバル状態は限定的
- Redux等の外部ライブラリは不要な複雑さ
- フィルター状態とキャッシュデータのみ管理

### State Structure
```typescript
interface AppState {
  // 表示状態
  currentMonth: Date;
  selectedDate: Date | null;

  // フィルター状態
  selectedMembers: string[];
  selectedCategories: string[];
  showGraduatedMembers: boolean;

  // データ
  schedules: Schedule[];
  members: Member[];

  // UI状態
  isLoading: boolean;
  error: Error | null;
}
```

## 6. スタイリング

### Decision
CSS Modules + CSS変数

### Rationale
- スコープ付きCSSでスタイル衝突を防止
- CSS変数でカテゴリ色などのテーマ管理
- ビルドツール設定不要（Vite標準サポート）

### Category Colors
```css
:root {
  --color-tv: #4CAF50;      /* 緑 */
  --color-radio: #2196F3;   /* 青 */
  --color-live: #F44336;    /* 赤 */
  --color-cd: #FF9800;      /* オレンジ */
  --color-other: #9E9E9E;   /* グレー */
}
```

## References

- [fetch-jsonp - npm](https://www.npmjs.com/package/fetch-jsonp)
- [Deploying a Static Site | Vite](https://vite.dev/guide/static-deploy)
- [Deploying Vite React App to GitHub Pages](https://dev.to/rashidshamloo/deploying-vite-react-app-to-github-pages-35hf)
