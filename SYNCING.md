# DB 타입 동기화 파이프라인 (`database.types`)

`@0625chopin/shared`의 `src/database.ts`(export `@0625chopin/shared/database`)는 **Supabase 생성 DB
타입의 단일 소스**다. 두 앱(공개·admin)은 이 패키지 타입만 사용하며, 로컬 사본을 두지 않는다.

## 소유·원칙

- **단일 소스**: DB 타입은 오직 `@0625chopin/shared`에만 존재. 앱 레포에 `database.types.ts` 사본 금지.
- **마이그레이션 소유 = admin 레포**: 스키마 변경(`apply_migration`)은 admin 레포 작업 맥락에서 수행
  한다(admin_users/reports/RLS/admin RPC 등 백엔드가 거기서 관리됨). Supabase 프로젝트는 공유
  (`zmeyfvfkqnemnzafpzmn`).

## 표준 절차 (스키마 변경 시)

1. **마이그레이션 적용(원격)**: Supabase MCP `apply_migration` (또는 CLI) 로 원격 스키마 변경.
2. **타입 재생성**: `generate_typescript_types` 결과를 shared의 `src/database.ts`에 반영.
   ```bash
   # 예: Supabase CLI 사용 시
   supabase gen types typescript --project-id zmeyfvfkqnemnzafpzmn > src/database.ts
   npm run check-all     # lint+typecheck+build 로 타입 정합 확인
   ```
3. **버전 bump & 발행**:
   ```bash
   npm version patch      # 또는 minor (호환성에 따라)
   git push --follow-tags
   # GitHub Release 발행 → publish 워크플로 자동 발행 (PUBLISHING.md)
   ```
4. **양 앱 반영**:
   ```bash
   # 공개 앱 / admin 앱 각각
   npm update @0625chopin/shared
   npm run check-all      # 타입 변경 영향 확인
   git commit -am "chore: @0625chopin/shared 타입 갱신" && git push   # → Vercel 재배포
   ```

> 앱은 정확 버전 핀이라 `npm update` 전까지 이전 타입을 유지한다(의도된 결정성). 타입 브레이킹은
> minor/major bump로 신호를 준다.

## 드리프트 감시 (CI)

원격 스키마와 `src/database.ts`가 어긋나는지 주기적으로 감시한다. 워크플로:
`.github/workflows/db-types-drift.yml` (아래). 예약 실행으로 타입을 재생성해 `git diff`로 비교,
차이가 있으면 실패시켜 알림(수동 갱신 유도).

- **필요 시크릿**(shared 레포 Settings → Secrets): `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`.
- CI는 **감시·알림만** 한다(자동 커밋/발행하지 않음) — DB 타입 변경은 사람이 절차대로 반영한다.

## 롤백/주의

- 타입 재생성 후 `check-all` 실패 = 앱 코드가 새 스키마와 불일치 → 앱에서 사용부 수정 후 함께 릴리스.
- 절대 앱 레포에 DB 타입을 직접 수정/복제하지 말 것(드리프트 원인).
