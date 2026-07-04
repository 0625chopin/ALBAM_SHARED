# @0625chopin/shared

알밤마켓 **공개 앱(ALBAM_MARKET)** 과 **관리자 앱(albam-admin)** 이 공유하는 라이브러리.
도메인 타입 · Supabase 클라이언트 · UI 프리미티브 · 유틸 · 디자인 토큰의 **단일 소스**다.

> 설계 근거: 상위 앱 레포의 `docs/adr/0001-shared-distribution-mechanism.md`,
> `docs/adr/0002-shared-boundary-inventory.md`, `docs/adr/0004-version-pinning.md`,
> `docs/division.md`.

## 배포 형태

- **서버 배포 아님.** 이 저장소는 GitHub Actions로 **GitHub Packages(npm)** 에 발행되는 라이브러리다.
- 두 앱은 빌드 시 `@0625chopin/shared`를 private 레지스트리에서 인증 설치한다.

## 설치 (소비 앱)

소비 앱 레포 루트에 `.npmrc`:

```
@0625chopin:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

- `NPM_TOKEN` = GitHub PAT(`read:packages`). 로컬 셸 env / Vercel 프로젝트 env에 주입.
- `next.config.ts`에 `transpilePackages: ['@0625chopin/shared']` 필수.

```bash
npm install @0625chopin/shared
```

## Exports (subpath)

| import | 내용 |
| --- | --- |
| `@0625chopin/shared/types` | 도메인 타입 |
| `@0625chopin/shared/database` | Supabase 생성 DB 타입(단일 소스) |
| `@0625chopin/shared/supabase/{client,server,proxy,storage,admin}` | Supabase 클라이언트 |
| `@0625chopin/shared/format` · `/utils` · `/constants` | 포맷·유틸·상수 |
| `@0625chopin/shared/queries/map` | snake↔camel 매퍼 |
| `@0625chopin/shared/ui/*` · `/common/*` | UI 프리미티브·공용 컴포넌트 |
| `@0625chopin/shared/styles.css` | Tailwind v4 `@theme` 디자인 토큰 |

> 실제 소스는 TS06(이관)에서 채워진다. 현재는 스캐폴드(TS05) 상태.

## 개발

```bash
npm install          # 공개 의존성만(레지스트리 인증 불필요)
npm run build        # tsup → dist(ESM + .d.ts), styles.css 복사
npm run typecheck    # tsc --noEmit
```

## 버전 정책

- `next`/`react`/`react-dom`/`tailwindcss`/`@supabase/*`는 **peerDependencies**(소비 앱이 제공).
- 정확 버전 핀은 `docs/adr/0004-version-pinning.md` 참조. 프레임워크 상향은 3레포 동시.

## 발행

- GitHub Actions `push main → version → npm publish`(TS09에서 구성).
- 수동: `NPM_TOKEN`(write:packages) 설정 후 `npm publish`.
