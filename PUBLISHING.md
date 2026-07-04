# @0625chopin/shared 발행 · 소비 가이드

GitHub Packages(npm) private 패키지 발행/소비 절차. (근거: `docs/adr/0001` — 상위 앱 레포)

## ⚠️ 선행 결정 — 스코프 = 저장소 소유자

GitHub Packages npm은 **패키지 스코프가 저장소 소유자(user/org)와 일치**해야 한다.

| 옵션 | 패키지명 | 저장소 소유자 | 비고 |
| --- | --- | --- | --- |
| A. org 생성(권장) | `@0625chopin/shared` | GitHub org **almbam** | 브랜드 유지, 팀 확장 용이 |
| B. 개인 계정 | `@0625chopin/shared` | 사용자 **0625chopin** | org 불필요. `package.json` name + 소비 앱 import 스코프를 `@0625chopin`로 교체 |

> 현재 파일은 **옵션 A(@0625chopin)** 기준. 옵션 B를 택하면 `package.json`의 `name`·`publishConfig`,
> `.npmrc`의 `@0625chopin:` 스코프, `.github/workflows/publish.yml`의 `scope`, 소비 앱 import를 모두
> `@0625chopin`로 바꾼다.

## 발행 (계정 소유자 1회 셋업)

1. **저장소 생성 & push**
   ```bash
   cd almbam-shared
   git add -A && git commit -m "chore: @0625chopin/shared 초기 스캐폴드 + 공유 소스"
   gh repo create <owner>/almbam-shared --private --source=. --remote=origin --push
   ```
2. **최초 발행** (Actions 없이 로컬에서):
   ```bash
   # write:packages 권한 PAT 를 NPM_TOKEN 으로 export
   export NPM_TOKEN=<GitHub PAT: write:packages>
   npm ci && npm run check-all && npm publish
   ```
   또는 GitHub에서 **Release 발행** → `.github/workflows/publish.yml`이 자동 발행.
3. 발행 확인: 저장소 → Packages 탭에 `@0625chopin/shared 0.1.0`.

## 소비 (공개 앱 · admin 앱)

소비 앱 레포 루트 `.npmrc`:
```
@0625chopin:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```
- **로컬**: 셸에 `export NPM_TOKEN=<PAT: read:packages>` 후 `npm install @0625chopin/shared`.
- **Vercel**: 프로젝트 env에 `NPM_TOKEN`(read:packages) 등록 → 빌드 시 자동 인증.
- `next.config.ts`에 `transpilePackages: ['@0625chopin/shared']`.

## 버전 갱신 루프

1. shared 수정 → `npm version patch|minor` → push/Release → 발행.
2. 소비 앱에서 `npm update @0625chopin/shared` → lock 갱신 → 커밋 → 재배포.
3. DB 타입 변경 시: 상위 앱 원격 `apply_migration` → `generate_typescript_types` → 본 패키지
   `src/database.ts` 반영 → 발행 → 소비 앱 update (TS20 파이프라인).

## 로컬 개발(발행 전) — file 링크

발행 전 소비 앱에서 로컬 검증하려면 `file:` 링크 사용:
```bash
# 소비 앱에서
npm install file:../almbam-shared
```
> 단, `file:`는 로컬 검증용. **프로덕션/Vercel 배포는 발행된 버전**을 사용해야 한다.
