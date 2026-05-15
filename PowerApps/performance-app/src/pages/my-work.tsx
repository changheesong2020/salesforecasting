import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PerformancePlan, PerformanceActual, UserRole } from "@/lib/types"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { FileText, CheckCircle, Clock, AlertCircle, Edit2 } from "lucide-react"

interface MyWorkProps {
  userRole?: UserRole
}

// 현재 사용자 역할 감지
const getCurrentUserRole = (): UserRole => {
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role") as UserRole
  return role || "STAFF"
}

// 모의 데이터
const mockPlans: PerformancePlan[] = [
  {
    id: "PL-001",
    planName: "고객만족도 85% 달성",
    organizationId: "ORG-001",
    kpiId: "KPI-001",
    kpiName: "고객만족도",
    targetValue: 85,
    weight: 30,
    ownerId: "USR-001",
    ownerName: "김철수",
    managerId: "USR-002",
    managerName: "박영희",
    status: "Approved",
    year: 2026,
    submittedDate: "2026-05-01",
    approvedDate: "2026-05-05",
  },
  {
    id: "PL-002",
    planName: "신규프로젝트 2건 완료",
    organizationId: "ORG-001",
    kpiId: "KPI-002",
    kpiName: "프로젝트 완료 건수",
    targetValue: 2,
    weight: 40,
    ownerId: "USR-001",
    ownerName: "김철수",
    managerId: "USR-002",
    managerName: "박영희",
    status: "Submitted",
    year: 2026,
    submittedDate: "2026-05-10",
  },
  {
    id: "PL-003",
    planName: "비용 절감 5% 달성",
    organizationId: "ORG-001",
    kpiId: "KPI-003",
    kpiName: "비용절감율",
    targetValue: 5,
    weight: 30,
    ownerId: "USR-001",
    ownerName: "김철수",
    managerId: "USR-002",
    managerName: "박영희",
    status: "Draft",
    year: 2026,
  },
]

const mockActuals: PerformanceActual[] = [
  {
    id: "ACT-001",
    planId: "PL-001",
    actualValue: 82,
    period: "Q2",
    achievementRate: 96.47,
    status: "Approved",
    submittedDate: "2026-05-08",
    approvedDate: "2026-05-12",
  },
  {
    id: "ACT-002",
    planId: "PL-002",
    actualValue: 1,
    period: "Q2",
    achievementRate: 50,
    status: "Submitted",
    submittedDate: "2026-05-13",
  },
]

export default function MyWorkPage({ userRole: propRole }: MyWorkProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const userRole = propRole || getCurrentUserRole()

  const filteredPlans = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return mockPlans.filter((plan) =>
      plan.planName.toLowerCase().includes(query) ||
      plan.kpiName?.toLowerCase().includes(query) ||
      plan.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const filteredActuals = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return mockActuals.filter((actual) => {
      const plan = mockPlans.find((p) => p.id === actual.planId)
      return (
        plan?.planName.toLowerCase().includes(query) ||
        actual.period.toLowerCase().includes(query) ||
        actual.id.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  const statusBadge = (status: PerformancePlan["status"]) => {
    const config: Record<PerformancePlan["status"], { label: string; className: string; icon: any }> = {
      Draft: { label: "초안", className: "bg-slate-500 text-white", icon: <FileText className="w-3 h-3" /> },
      Submitted: { label: "제출됨", className: "bg-blue-500 text-white", icon: <Clock className="w-3 h-3" /> },
      InReview: { label: "검토중", className: "bg-amber-500 text-white", icon: <AlertCircle className="w-3 h-3" /> },
      Approved: { label: "승인됨", className: "bg-emerald-600 text-white", icon: <CheckCircle className="w-3 h-3" /> },
      Rejected: { label: "반려됨", className: "bg-rose-600 text-white", icon: <AlertCircle className="w-3 h-3" /> },
      Closed: { label: "마감됨", className: "bg-gray-600 text-white", icon: null },
    }
    const c = config[status]
    return (
      <Badge className={c.className}>
        {c.icon && <span className="mr-1">{c.icon}</span>}
        {c.label}
      </Badge>
    )
  }

  const canEdit = (status: PerformancePlan["status"]) => {
    return status === "Draft" || status === "Rejected"
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 via-background to-background p-5 sm:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">나의 업무</h1>
            <p className="text-sm text-muted-foreground">
              {userRole === "STAFF" && "목표를 수립하고 분기별 실적을 입력하세요."}
              {userRole === "MANAGER" && "팀원의 목표와 실적을 검토하고 승인하세요."}
              {userRole === "EXEC" && "조직의 중요 목표를 모니터링하고 승인하세요."}
              {userRole === "ADMIN" && "전체 기간 및 권한을 관리하세요."}
            </p>
          </div>
        </section>

        <Tabs defaultValue="plans" className="gap-4">
          <TabsList>
            <TabsTrigger value="plans" className="gap-1">
              <FileText className="size-4" /> 목표 관리
            </TabsTrigger>
            <TabsTrigger value="actuals" className="gap-1">
              <CheckCircle className="size-4" /> 실적 관리
            </TabsTrigger>
            {(userRole === "MANAGER" || userRole === "EXEC") && (
              <TabsTrigger value="approvals" className="gap-1">
                <AlertCircle className="size-4" /> 승인 대기
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle>성과 목표</CardTitle>
                <CardDescription>올해 수립한 KPI 목표 목록입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="목표명, KPI, ID로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>목표명</TableHead>
                      <TableHead>KPI</TableHead>
                      <TableHead>목표값</TableHead>
                      <TableHead>가중치</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.length > 0 ? (
                      filteredPlans.map((plan) => (
                        <TableRow key={plan.id}>
                          <TableCell className="font-medium">{plan.planName}</TableCell>
                          <TableCell>{plan.kpiName}</TableCell>
                          <TableCell>{plan.targetValue}</TableCell>
                          <TableCell>{plan.weight}%</TableCell>
                          <TableCell>{statusBadge(plan.status)}</TableCell>
                          <TableCell className="space-x-2">
                            {canEdit(plan.status) && userRole === "STAFF" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigate(`/plan-edit/${plan.id}`)
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-1" /> 수정
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (userRole === "MANAGER" && plan.status === "Submitted") {
                                  navigate(`/approval-detail/plan/${plan.id}`)
                                } else {
                                  toast.info("목표 상세 정보를 확인할 수 있습니다.")
                                }
                              }}
                            >
                              상세
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          목표가 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actuals">
            <Card>
              <CardHeader>
                <CardTitle>성과 실적</CardTitle>
                <CardDescription>분기별 실적 입력 및 증빙 현황입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="목표명, 기간, ID로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>목표명</TableHead>
                      <TableHead>기간</TableHead>
                      <TableHead>실적값</TableHead>
                      <TableHead>달성률</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>작업</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActuals.length > 0 ? (
                      filteredActuals.map((actual) => {
                        const plan = mockPlans.find((p) => p.id === actual.planId)
                        return (
                          <TableRow key={actual.id}>
                            <TableCell className="font-medium">{plan?.planName}</TableCell>
                            <TableCell>{actual.period}</TableCell>
                            <TableCell>{actual.actualValue}</TableCell>
                            <TableCell>{actual.achievementRate?.toFixed(1)}%</TableCell>
                            <TableCell>{statusBadge(actual.status as any)}</TableCell>
                            <TableCell className="space-x-2">
                              {actual.status === "Draft" && userRole === "STAFF" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    navigate(`/actual-edit/${actual.id}`)
                                  }}
                                >
                                  <Edit2 className="w-4 h-4 mr-1" /> 수정
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" onClick={() => toast.info("실적 상세 정보")}>
                                상세
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          실적이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {(userRole === "MANAGER" || userRole === "EXEC") && (
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>승인 대기 항목</CardTitle>
                  <CardDescription>검토 필요한 목표/실적 승인 요청을 처리하세요.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4 hover:bg-accent cursor-pointer transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">고객만족도 85% 달성</p>
                          <p className="text-sm text-muted-foreground">김철수 · 제출됨 · 2026-05-10</p>
                        </div>
                        <Badge className="bg-amber-500 text-white">검토 필요</Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/approval-detail/plan/PL-001`)}
                        >
                          검토
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
