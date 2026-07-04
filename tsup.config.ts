import { defineConfig } from "tsup";

// @0625chopin/shared 빌드 설정
// - bundle: false → 소스 파일 구조를 dist에 1:1로 유지하고, RSC 지시문("use client")을
//   파일 상단에 그대로 보존한다(번들 시 지시문이 소실되는 문제 회피). 지시문 보존은 TS08에서 검증.
// - format: esm 단일. dts: true → 각 파일별 .d.ts 생성(단일 타입 계약 유지).
// - peerDeps(react/react-dom/next/tailwindcss/@supabase/*)는 external → 소비 앱이 제공.
// - styles.css는 esbuild가 dist로 복사(loader copy) → @0625chopin/shared/styles.css export.
export default defineConfig({
  // css는 dts 대상이 아니므로 entry에서 제외하고 빌드 후 별도 복사(scripts/copy-assets.mjs)한다.
  entry: ["src/**/*.ts", "src/**/*.tsx"],
  outDir: "dist",
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  bundle: false,
  external: [
    "next",
    "react",
    "react-dom",
    "tailwindcss",
    "@supabase/ssr",
    "@supabase/supabase-js",
  ],
});
