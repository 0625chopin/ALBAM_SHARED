// 신고(reports) 사유·상태·대상 라벨
// 사유(reason)는 정책 고정형 코드값이므로 shared 상수로 단일 관리한다.
// FO 신고 모달의 사유 드롭다운과 BO 처리 큐 표시가 동일 라벨을 공유한다.

import type { ReportStatus, ReportTargetType } from "../types";

/** 신고 사유 코드 라벨 (FA050) */
export const REPORT_REASON_LABEL: Record<string, string> = {
  fake_info: "허위 상품 정보",
  abuse: "욕설·비방",
  no_show: "미거래·약속 불이행",
  malicious: "악의적 행위",
  prohibited: "금지 품목",
};

/** 신고 처리 상태 라벨 */
export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "대기",
  reviewing: "검토중",
  resolved: "처리완료",
  rejected: "반려",
};

/** 신고 대상 유형 라벨 */
export const REPORT_TARGET_LABEL: Record<ReportTargetType, string> = {
  product: "상품",
  user: "사용자",
  message: "메시지",
  rating: "평점",
};

/** 코드값 라벨 조회 (미정의 시 원본 코드 반환) */
export function labelOf(map: Record<string, string>, code: string): string {
  return map[code] ?? code;
}
