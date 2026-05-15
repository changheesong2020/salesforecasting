import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"

export default function PlanEditPage() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    planName: "고객만족도 85% 달성",
    kpiName: "고객만족도",
    targetValue: "85",
    weight: "30",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Dataverse 저장 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("목표가 저장되었습니다.")
      navigate("/my-work")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 via-background to-background p-5 sm:p-8">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-work")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">목표 {planId ? "수정" : "추가"}</h1>
            <p className="text-sm text-muted-foreground">성과 목표를 입력하고 팀장에게 제출하세요.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>KPI 목표 및 가중치를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="planName">목표명 *</Label>
                <Input
                  id="planName"
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  placeholder="예: 고객만족도 85% 달성"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpiName">KPI 지표 *</Label>
                <Input
                  id="kpiName"
                  value={formData.kpiName}
                  onChange={(e) => setFormData({ ...formData, kpiName: e.target.value })}
                  placeholder="예: 고객만족도"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">목표값 *</Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="85"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">가중치 (%) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="목표에 대한 추가 설명을 입력하세요."
                  rows={4}
                />
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs text-amber-900">
                  💡 <strong>주의:</strong> 제출 후에는 팀장의 반려가 있을 때만 수정할 수 있습니다.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/my-work")} type="button">
                  취소
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "저장 중..." : "저장"}
                </Button>
                <Button
                  variant="default"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsSubmitting(true)
                    setTimeout(() => {
                      toast.success("목표가 제출되었습니다. 팀장의 승인을 기다려주세요.")
                      navigate("/my-work")
                    }, 1000)
                  }}
                >
                  저장 및 제출
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>승인 이력</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-medium">초안으로 저장됨</p>
                  <p className="text-xs text-muted-foreground">2026-05-01 14:22</p>
                </div>
                <Badge variant="outline">저장</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">팀장 박영희에게 제출됨</p>
                  <p className="text-xs text-muted-foreground">2026-05-01 15:05</p>
                </div>
                <Badge className="bg-blue-100 text-blue-900">대기중</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
