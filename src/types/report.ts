// 신고 도메인 타입
// PRD_ADMIN 데이터 모델 reports 테이블을 camelCase로 1:1 매핑한다.
// reports 는 일반 사용자가 직접 insert 하는 특수 테이블이므로(FA050), 관리자 전용 엔티티와 달리
// 공개 앱(FO)·관리자 앱(BO)이 공유하는 단일 계약으로 shared 에 둔다.

/**
 * 신고 대상 유형
 * - product: 상품 / user: 사용자 / message: 채팅 메시지 / rating: 평점
 * - target_id 는 대상 엔티티를 논리 참조하며 FK 를 걸지 않는다(폴리모픽).
 */
export type ReportTargetType = "product" | "user" | "message" | "rating";

/**
 * 신고 처리 상태
 * - pending: 대기 / reviewing: 검토중 / resolved: 처리(제재·삭제) / rejected: 반려
 */
export type ReportStatus = "pending" | "reviewing" | "resolved" | "rejected";

/**
 * 신고 (사용자 → 상품/사용자/메시지/평점 대상)
 * - PRD_ADMIN: reports / FA050~FA052
 */
export interface Report {
  /** 고유 식별자 (UUID) */
  id: string;
  /** 신고자 (→ profiles.id) */
  reporterId: string;
  /** 신고 대상 유형 */
  targetType: ReportTargetType;
  /** 신고 대상 식별자 (대상 엔티티의 id) */
  targetId: string;
  /** 신고 사유 코드 (사유 선택) */
  reason: string;
  /** 신고 상세 내용 (선택, 미입력 시 null) */
  detail: string | null;
  /** 처리 상태 */
  status: ReportStatus;
  /** 처리한 관리자 (→ profiles.id). 미처리는 null */
  handledBy: string | null;
  /** 처리 결과 메모 (제재 연결/반려 사유 등). 미처리는 null */
  resolution: string | null;
  /** 신고 접수 시각 (ISO 8601) */
  createdAt: string;
  /** 처리 완료 시각 (ISO 8601). 미처리는 null */
  handledAt: string | null;
}
