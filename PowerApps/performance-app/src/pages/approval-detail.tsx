import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { ChevronLeft, CheckCircle2, XCircle, Clock } from "lucide-react"

export default function ApprovalDetailPage() {
  useParams()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("목표가 승인되었습니다.")
      navigate("/my-work")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("반려 사유를 입력하세요.")
      return
    }
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("목표가 반려되었습니다.")
      navigate("/my-work")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-50 via-background to-background p-5 sm:p-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-work")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">승인 처리</h1>
            <p className="text-sm text-muted-foreground">목표/실적을 검토하고 승인 또는 반려하세요.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>고객만족도 85% 달성</CardTitle>
                <CardDescription>KPI: 고객만족도 · 담당자: 김철수</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-900">제출됨</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">목표값</p>
                <p className="text-2xl font-semibold">85</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">가중치</p>
                <p className="text-2xl font-semibold">30%</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">조직</p>
                <p className="text-2xl font-semibold">전략기획실</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">목표 설명</h3>
              <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded">
                고객 만족도를 85% 이상으로 유지하기 위해 서비스 품질 개선 및 고객 피드백 활용에 중점을 두겠습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>제출 이력</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div className="w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">제출됨</p>
                  <p className="text-xs text-muted-foreground">2026-05-01 15:05 · 김철수</p>
                  <p className="text-xs text-muted-foreground mt-1">팀장 박영희에게 승인 요청</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-50"></div>
                </div>
                <div>
                  <p className="font-medium text-sm">대기 중</p>
                  <p className="text-xs text-muted-foreground">당신의 승인을 기다리는 중</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>승인 처리</CardTitle>
            <CardDescription>목표를 검토하고 승인 또는 반려하세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showRejectForm ? (
              <div className="flex gap-3">
                <Button
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={isProcessing}
                  onClick={handleApprove}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {isProcessing ? "처리 중..." : "승인"}
                </Button>
                <Button
                  variant="outline"
                  className="border-rose-500 text-rose-600 hover:bg-rose-50"
                  disabled={isProcessing}
                  onClick={() => setShowRejectForm(true)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  반려
                </Button>
              </div>
            ) : (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">반려 사유 *</Label>
                  <Textarea
                    id="reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="반려 사유를 입력하세요. 담당자가 이를 참고하여 목표를 수정할 수 있습니다."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectForm(false)
                      setRejectionReason("")
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isProcessing || !rejectionReason.trim()}
                    onClick={handleReject}
                  >
                    {isProcessing ? "처리 중..." : "반려"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-900">
            💡 <strong>팁:</strong> 반려 시 담당자에게 Teams/Email로 알림이 발송되며, 담당자는 피드백을 반영하여 목표를 수정 후 재제출할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
