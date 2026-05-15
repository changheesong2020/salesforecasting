// 역할 정의
export type UserRole = "STAFF" | "MANAGER" | "EXEC" | "ADMIN"

// 상태 정의
export type PlanStatus = "Draft" | "Submitted" | "InReview" | "Approved" | "Rejected" | "Closed"
export type ApprovalStatus = "Draft" | "Submitted" | "InReview" | "Approved" | "Rejected"

// 사용자 정보
export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId: string
  organizationName: string
}

// KPI 지표
export interface KPIDictionary {
  id: string
  name: string
  organizationId: string
  unit: string
  description: string
}

// 성과 목표 (Plan)
export interface PerformancePlan {
  id: string
  planName: string
  organizationId: string
  kpiId: string
  kpiName?: string
  targetValue: number
  weight: number
  ownerId: string
  ownerName?: string
  managerId: string
  managerName?: string
  execId?: string
  status: PlanStatus
  year: number
  submittedDate?: string
  approvedDate?: string
  rejectionReason?: string
}

// 성과 실적 (Actual)
export interface PerformanceActual {
  id: string
  planId: string
  actualValue: number
  period: string // "Q1", "Q2", "Q3", "Q4", "M1"~"M12"
  achievementRate?: number // 자동 계산: actualValue / plan.targetValue * 100
  evidence?: string
  status: ApprovalStatus
  notes?: string
  submittedDate?: string
  approvedDate?: string
}

// 승인 이력
export interface ApprovalLog {
  id: string
  planId: string
  actualId?: string
  approverRole: UserRole
  approverId: string
  approverName?: string
  decision: "Submitted" | "Approved" | "Rejected" | "Recall"
  reason?: string
  decisionDate: string
  previousStatus: PlanStatus | ApprovalStatus
  newStatus: PlanStatus | ApprovalStatus
}

// 기간 통제
export interface PeriodControl {
  id: string
  year: number
  period: string
  isOpen: boolean
  openDate: string
  closeDate: string
}

// 조직
export interface Organization {
  id: string
  name: string
  parentOrgId?: string
}
