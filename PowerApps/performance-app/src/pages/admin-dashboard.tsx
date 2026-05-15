import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Calendar, Users, Settings, Lock } from "lucide-react"

interface Period {
  id: string
  year: number
  period: string
  isOpen: boolean
  openDate: string
  closeDate: string
}

const mockPeriods: Period[] = [
  {
    id: "PER-001",
    year: 2026,
    period: "Q1",
    isOpen: false,
    openDate: "2026-01-01",
    closeDate: "2026-03-31",
  },
  {
    id: "PER-002",
    year: 2026,
    period: "Q2",
    isOpen: true,
    openDate: "2026-04-01",
    closeDate: "2026-06-30",
  },
  {
    id: "PER-003",
    year: 2026,
    period: "Q3",
    isOpen: false,
    openDate: "2026-07-01",
    closeDate: "2026-09-30",
  },
]

export default function AdminDashboardPage() {
  const [periods] = useState<Period[]>(mockPeriods)
  const [, setSelectedPeriod] = useState<Period | null>(null)

  const handleOpenPeriod = (period: Period) => {
    toast.success(`${period.year} ${period.period} 기간이 오픈되었습니다.`)
  }

  const handleClosePeriod = (period: Period) => {
    toast.success(`${period.year} ${period.period} 기간이 마감되었습니다.`)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-purple-50 via-background to-background p-5 sm:p-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">관리자 대시보드</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">시스템 운영</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              기간 관리, 사용자 권한, KPI 지표사전, 감사 로그를 통제합니다.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>활성 기간</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calendar className="size-5 text-blue-500" /> {periods.filter((p) => p.isOpen).length}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">입력 가능한 기간</CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>등록 사용자</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="size-5 text-emerald-600" /> 127
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">활성 계정</CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>KPI 지표</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Settings className="size-5 text-amber-500" /> 45
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">관리 중인 지표</CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>보안 이벤트</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="size-5 text-rose-500" /> 3
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">이번 주</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기간 관리</CardTitle>
            <CardDescription>목표 및 실적 입력 기간을 오픈/마감합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>연도</TableHead>
                  <TableHead>기간</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((period) => (
                  <TableRow key={period.id}>
                    <TableCell>{period.year}</TableCell>
                    <TableCell className="font-medium">{period.period}</TableCell>
                    <TableCell>{period.openDate}</TableCell>
                    <TableCell>{period.closeDate}</TableCell>
                    <TableCell>
                      {period.isOpen ? (
                        <Badge className="bg-emerald-600 text-white">오픈</Badge>
                      ) : (
                        <Badge variant="outline">마감</Badge>
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {!period.isOpen ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPeriod(period)}
                        >
                          오픈
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleClosePeriod(period)}
                        >
                          마감
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => setSelectedPeriod(period)}>
                        상세
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>역할/권한 관리</CardTitle>
            <CardDescription>사용자 역할을 할당하고 조직을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">STAFF (담당자)</p>
                  <p className="text-xs text-muted-foreground">목표 수립, 실적 입력</p>
                </div>
                <Badge className="bg-blue-100 text-blue-900">82명</Badge>
              </div>
              <Button variant="outline" size="sm">사용자 관리</Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">MANAGER (팀장)</p>
                  <p className="text-xs text-muted-foreground">승인/반려, 조직 성과 관리</p>
                </div>
                <Badge className="bg-emerald-100 text-emerald-900">28명</Badge>
              </div>
              <Button variant="outline" size="sm">사용자 관리</Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">EXEC (임원)</p>
                  <p className="text-xs text-muted-foreground">조직 성과 조회, 2단 승인</p>
                </div>
                <Badge className="bg-purple-100 text-purple-900">10명</Badge>
              </div>
              <Button variant="outline" size="sm">사용자 관리</Button>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">ADMIN (관리자)</p>
                  <p className="text-xs text-muted-foreground">시스템 설정, 감사</p>
                </div>
                <Badge className="bg-rose-100 text-rose-900">7명</Badge>
              </div>
              <Button variant="outline" size="sm">사용자 관리</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>KPI 지표사전</CardTitle>
            <CardDescription>조직별 성과 지표를 정의하고 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button>+ 지표 추가</Button>
            <p className="text-sm text-muted-foreground mt-4">지표 목록 추가 예정 (고객만족도, 프로젝트 완료, 비용절감 등)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>감사 로그</CardTitle>
            <CardDescription>시스템 접근 및 데이터 변경 이력을 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>최근 감사 로그:</p>
              <ul className="mt-2 space-y-2 text-xs">
                <li>📝 2026-05-14 14:22 - 김철수가 목표 PL-001 수정</li>
                <li>✅ 2026-05-14 13:45 - 박영희가 실적 ACT-001 승인</li>
                <li>🔒 2026-05-14 13:10 - 관리자가 Q2 기간 마감</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
