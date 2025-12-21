# Implementation Plan: 乃木坂46スケジュールビューアー

**Branch**: `001-schedule-viewer` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-schedule-viewer/spec.md`

## Summary

乃木坂46公式サイトのスケジュールAPIとメンバーAPIを活用し、月間カレンダー形式でスケジュールを表示するビューアーアプリを構築する。メンバー/カテゴリによるフィルタリング機能を提供し、公式サイトより見やすく使いやすいUIを実現する。GitHub Pagesでホスティングされる静的フロントエンドアプリケーションとして実装する。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18.x, Vite 5.x (ビルドツール)
**Storage**: localStorage (フィルター設定の永続化), IndexedDB/localStorage (オフラインキャッシュ)
**Testing**: Vitest (単体テスト), Playwright (E2Eテスト - 必要に応じて)
**Target Platform**: Web (GitHub Pages), モダンブラウザ (Chrome, Firefox, Safari, Edge 最新2バージョン)
**Project Type**: single (フロントエンドのみ)
**Performance Goals**: 初期表示 < 3秒, フィルタリング応答 < 1秒, バンドルサイズ < 500KB gzipped
**Constraints**: GitHub Pages静的ホスティング, バックエンドなし, JSONP API対応
**Scale/Scope**: 約100名のメンバー, 月間約150-200件のスケジュール

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static Frontend Only | ✅ PASS | 全てブラウザ内で実行、React + Viteで静的ビルド |
| II. GitHub Pages Compatibility | ✅ PASS | Viteでbase path設定可能、SPAには404.html対応 |
| III. Zero Backend Dependencies | ✅ PASS | 公式APIはpublic JSONP、認証トークン不要 |
| IV. Progressive Enhancement | ⚠️ PARTIAL | JSなしでの表示は困難（API依存）、ローディング状態は提供 |
| V. Simplicity First | ✅ PASS | React選択は複雑なUI状態管理に必要、最小限の依存 |

**Gate Result**: PASS (Progressive Enhancementは部分的だが、API駆動アプリの性質上許容)

## Project Structure

### Documentation (this feature)

```text
specs/001-schedule-viewer/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API response schemas)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── components/          # Reactコンポーネント
│   ├── Calendar/        # カレンダー表示
│   ├── Filter/          # フィルター UI
│   ├── Schedule/        # スケジュール表示
│   └── common/          # 共通コンポーネント
├── hooks/               # カスタムフック
├── services/            # API呼び出し、データ変換
├── types/               # TypeScript型定義
├── utils/               # ユーティリティ関数
├── App.tsx
├── main.tsx
└── index.css

public/
└── 404.html             # SPA用フォールバック

tests/
├── unit/                # Vitestユニットテスト
└── e2e/                 # Playwright E2Eテスト (optional)
```

**Structure Decision**: Single project (frontend-only) structure selected. React + Vite for modern development experience with TypeScript for type safety. Components organized by feature domain.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| React framework | 複雑なUI状態（フィルター、カレンダー、詳細表示）の管理 | Vanilla JSでは状態同期が煩雑になり保守性低下 |
| TypeScript | API型安全性、IDEサポート | JSでは型エラーが実行時まで検出されない |
