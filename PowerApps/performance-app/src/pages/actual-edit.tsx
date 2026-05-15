import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { ChevronLeft, Upload, File } from "lucide-react"

export default function ActualEditPage() {
  useParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    actualValue: "82",
    period: "Q2",
    notes: "고객 조사 결과 기준",
    evidence: null as File | null,
  })

  const achievementRate = (82 / 85) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("실적이 저장되었습니다.")
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
            <h1 className="text-2xl font-semibold">실적 입력</h1>
            <p className="text-sm text-muted-foreground">분기별 실적을 입력하고 증빙 자료를 첨부하세요.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>목표 정보</CardTitle>
            <CardDescription>고객만족도</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">목표값</p>
                <p className="text-lg font-semibold">85</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">가중치</p>
                <p className="text-lg font-semibold">30%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>실적 입력</CardTitle>
            <CardDescription>분기별 실적값과 증빙 자료를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">기간 *</Label>
                  <Input
                    id="period"
                    value={formData.period}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualValue">실적값 *</Label>
                  <Input
                    id="actualValue"
                    type="number"
                    value={formData.actualValue}
                    onChange={(e) => setFormData({ ...formData, actualValue: e.target.value })}
                    placeholder="82"
                    required
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-slate-50 p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">달성률</p>
                  <Badge className={achievementRate >= 100 ? "bg-emerald-600" : "bg-blue-600"}>
                    {achievementRate.toFixed(1)}%
                  </Badge>
                </div>
                <Progress value={Math.min(achievementRate, 100)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">비고</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="실적 관련 추가 설명이나 주의사항을 입력하세요."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evidence">증빙 자료 첨부</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, 이미지, 엑셀 등 (최대 128MB)</p>
                  <input
                    id="evidence"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFormData({ ...formData, evidence: e.target.files[0] })
                        toast.success(`파일 업로드: ${e.target.files[0].name}`)
                      }
                    }}
                  />
                </div>
                {formData.evidence && (
                  <div className="flex items-center gap-2 mt-3 p-3 bg-emerald-50 rounded-lg">
                    <File className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-900">{formData.evidence.name}</span>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs text-blue-900">
                  📋 <strong>증빙 자료:</strong> 실적을 뒷받침할 수 있는 문서, 통계, 보고서 등을 첨부하면 승인이 신속하게 처리됩니다.
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
                      toast.success("실적이 제출되었습니다. 팀장의 승인을 기다려주세요.")
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
      </div>
    </div>
  )
}
