// 빌드 후 정적 에셋(디자인 토큰 CSS)을 dist로 복사한다.
// tsup의 dts 단계가 .css를 처리하지 못하므로 entry에서 제외하고 여기서 복사한다.
import { copyFileSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });
copyFileSync("src/styles.css", "dist/styles.css");
console.log("[copy-assets] src/styles.css → dist/styles.css");
