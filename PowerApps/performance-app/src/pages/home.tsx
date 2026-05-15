import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Clock3, ClipboardCheck, Rocket, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { UserRole } from "@/lib/types"

type Objective = {
  id: string
  owner: string
  title: string
  progress: number
  status: "정상" | "주의" | "지연"
}

type Initiative = {
  id: string
  name: string
  dueDate: string
  lead: string
  health: "On Track" | "At Risk" | "Blocked"
}

const objectivesSeed: Objective[] = [
  { id: "OBJ-01", owner: "전략기획실", title: "핵심성과지표(KPI) 자동 집계율 90% 달성", progress: 76, status: "정상" },
  { id: "OBJ-02", owner: "인사팀", title: "부서별 성과평가 리드타임 30% 단축", progress: 59, status: "주의" },
  { id: "OBJ-03", owner: "재무팀", title: "성과 예산-실적 오차율 5% 이내 유지", progress: 41, status: "지연" },
]

const initiativesSeed: Initiative[] = [
  { id: "INIT-12", name: "분기 성과 입력 플로우 표준화", dueDate: "2026-06-07", lead: "김현우", health: "On Track" },
  { id: "INIT-09", name: "팀장 승인 SLA 알림 자동화", dueDate: "2026-05-31", lead: "박민지", health: "At Risk" },
  { id: "INIT-03", name: "성과 리포트 Power BI 연동", dueDate: "2026-05-24", lead: "이도윤", health: "Blocked" },
  { id: "INIT-17", name: "연간 KPI 사전 시뮬레이션 화면", dueDate: "2026-06-21", lead: "정하늘", health: "On Track" },
]

// 사용자 역할 감지
const getCurrentUserRole = (): UserRole => {
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role") as UserRole
  return role || "STAFF"
}

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const userRole = getCurrentUserRole()

  const filteredInitiatives = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return initiativesSeed
    return initiativesSeed.filter((item) => {
      return (
        item.id.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword) ||
        item.lead.toLowerCase().includes(keyword)
      )
    })
  }, [query])

  const completionRate = Math.round(
    objectivesSeed.reduce((sum, item) => sum + item.progress, 0) / objectivesSeed.length
  )

  const pendingApprovals = 12
  const riskItems = initiativesSeed.filter((x) => x.health !== "On Track").length

  const statusBadge = (status: Objective["status"]) => {
    if (status === "정상") return <Badge className="bg-emerald-600 text-white">정상</Badge>
    if (status === "주의") return <Badge className="bg-amber-500 text-white">주의</Badge>
    return <Badge variant="destructive">지연</Badge>
  }

  const healthBadge = (health: Initiative["health"]) => {
    if (health === "On Track") return <Badge className="bg-emerald-600 text-white">On Track</Badge>
    if (health === "At Risk") return <Badge className="bg-amber-500 text-white">At Risk</Badge>
    return <Badge variant="destructive">Blocked</Badge>
  }

  // 역할별 콘텐츠
  const renderStaffDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>작성 중인 목표</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">초안 상태</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>제출 대기 중</CardDescription>
            <CardTitle className="text-2xl">1</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">팀장 승인 대기</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>빠른 시작</CardTitle>
          <CardDescription>자주 사용하는 기능입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/plan-edit")}
          >
            <span>새 목표 작성</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/my-work")}
          >
            <span>실적 입력</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>팀원 목표</CardDescription>
            <CardTitle className="text-2xl">12</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">등록됨</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>승인 대기</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-1">
              <Clock3 className="w-5 h-5 text-amber-500" />3
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">검토 필요</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>팀 달성률</CardDescription>
            <CardTitle className="text-2xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">전체 평균</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>승인 처리</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full justify-between"
            onClick={() => navigate("/my-work")}
          >
            <span>승인 대기 항목 확인</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderExecDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>조직 목표</CardDescription>
            <CardTitle className="text-2xl">28</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">전체</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>조직 달성률</CardDescription>
            <CardTitle className="text-2xl">{completionRate}%</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">목표 대비</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>리스크 항목</CardDescription>
            <CardTitle className="text-2xl flex items-center gap-1">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              {riskItems}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">주의/지연</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>최근 승인</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">오늘 처리한 승인 2건, 대기 중인 것 0건</p>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/my-work")}
          >
            <span>대시보드 확인</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>활성 기간</CardDescription>
            <CardTitle className="text-2xl">1</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">Q2 진행 중</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>등록 사용자</CardDescription>
            <CardTitle className="text-2xl">127</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">활성 계정</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>KPI 지표</CardDescription>
            <CardTitle className="text-2xl">45</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">관리 중</CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>보안 이벤트</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">이번 주</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>관리 작업</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/admin")}
          >
            <span>시스템 관리 → 기간 관리</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/admin")}
          >
            <span>역할/권한 관리</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-full bg-gradient-to-b from-cyan-50 via-background to-background p-5 sm:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">통합성과관리시스템 · Power Platform</p>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">조직 성과 운영 대시보드</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                {userRole === "STAFF" && "목표를 수립하고 분기별 실적을 입력하세요."}
                {userRole === "MANAGER" && "팀원의 목표와 실적을 검토하고 승인하세요."}
                {userRole === "EXEC" && "조직의 중요 목표를 모니터링하고 승인하세요."}
                {userRole === "ADMIN" && "기간 관리, 사용자 권한, KPI 지표를 통제하세요."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => toast.success("분기 성과 보고서 생성 요청이 접수되었습니다.")}>보고서 생성</Button>
              <ModeToggle />
            </div>
          </div>
        </section>

        {/* 역할별 대시보드 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {userRole === "STAFF" && renderStaffDashboard()}
            {userRole === "MANAGER" && renderManagerDashboard()}
            {userRole === "EXEC" && renderExecDashboard()}
            {userRole === "ADMIN" && renderAdminDashboard()}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">전체 성과 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">목표 달성률</p>
                    <Badge className="bg-emerald-600">{completionRate}%</Badge>
                  </div>
                  <Progress value={completionRate} />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">승인 대기</p>
                    <Badge className="bg-blue-600">{pendingApprovals}</Badge>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">리스크</p>
                    <Badge className="bg-rose-600">{riskItems}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">안내</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• 분기별 목표 입력 기간: 4월~6월</p>
                <p>• 실적 제출 기한: 매월 말일</p>
                <p>• 승인 평균 소요: 2~3일</p>
                <p>
                  <a href="#" className="text-blue-600 hover:underline">
                    매뉴얼 보기
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 전체 조직 대시보드 (모든 역할 공개) */}
        <Tabs defaultValue="objectives" className="gap-4">
          <TabsList>
            <TabsTrigger value="objectives" className="gap-1">
              <TrendingUp className="size-4" /> 전략목표
            </TabsTrigger>
            <TabsTrigger value="initiatives" className="gap-1">
              <Rocket className="size-4" /> 실행과제
            </TabsTrigger>
            {(userRole === "MANAGER" || userRole === "EXEC") && (
              <TabsTrigger value="approvals" className="gap-1">
                <ClipboardCheck className="size-4" /> 결재현황
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle>전략목표 진행 현황</CardTitle>
                <CardDescription>부서별 핵심성과지표의 달성률과 상태를 모니터링합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {objectivesSeed.map((objective) => (
                  <div key={objective.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">{objective.id} · {objective.owner}</p>
                        <p className="font-medium">{objective.title}</p>
                      </div>
                      {statusBadge(objective.status)}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={objective.progress} className="h-2.5" />
                      <span className="w-12 text-right text-sm font-medium">{objective.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="initiatives">
            <Card>
              <CardHeader>
                <CardTitle>실행과제 관리</CardTitle>
                <CardDescription>과제명, 담당자, 상태를 기반으로 진행 위험을 빠르게 점검합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="과제 ID, 과제명, 담당자 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>과제 ID</TableHead>
                      <TableHead>과제명</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>마감일</TableHead>
                      <TableHead>상태</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInitiatives.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.lead}</TableCell>
                        <TableCell>{item.dueDate}</TableCell>
                        <TableCell>{healthBadge(item.health)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {(userRole === "MANAGER" || userRole === "EXEC") && (
            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>결재 큐 현황</CardTitle>
                  <CardDescription>우선순위 기반으로 승인 대기 항목을 처리하세요.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">긴급 승인</p>
                    <p className="mt-1 text-xl font-semibold">4건</p>
                    <p className="mt-2 text-xs text-muted-foreground">예산 변경 승인 2건, 일정 조정 승인 2건</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">일반 승인</p>
                    <p className="mt-1 text-xl font-semibold">8건</p>
                    <p className="mt-2 text-xs text-muted-foreground">성과 입력 승인 5건, 목표 수정 승인 3건</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="outline" onClick={() => toast.info("Power Automate 승인 플로우가 실행되었습니다.")}>
            승인 플로우 실행
          </Button>
          <Button onClick={() => toast.success("Dataverse 동기화가 완료되었습니다.")}>
            데이터 동기화
          </Button>
        </div>
      </div>
    </div>
  )
}