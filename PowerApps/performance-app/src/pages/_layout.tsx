import { useState } from "react"
import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import type { UserRole } from "@/lib/types"
import { Menu, X, LogOut } from "lucide-react"

type LayoutProps = { showHeader?: boolean }

// 모의 사용자 역할 (실제로는 Dataverse에서 조회)
const getCurrentUserRole = (): UserRole => {
  // URL 파라미터나 세션에서 실제 역할을 가져올 수 있음
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role") as UserRole
  return role || "STAFF"
}

const getUserDisplayName = (): string => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("user") || "김철수"
}

const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    STAFF: "담당자",
    MANAGER: "팀장",
    EXEC: "임원",
    ADMIN: "관리자",
  }
  return labels[role]
}

export default function Layout({ showHeader = true }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const userRole = getCurrentUserRole()
  const displayName = getUserDisplayName()

  const roleColor: Record<UserRole, string> = {
    STAFF: "bg-blue-100 text-blue-900",
    MANAGER: "bg-emerald-100 text-emerald-900",
    EXEC: "bg-purple-100 text-purple-900",
    ADMIN: "bg-rose-100 text-rose-900",
  }

  const getMenuItems = () => {
    const baseItems = [
      { label: "홈", path: "/" },
      { label: "나의 업무", path: "/my-work" },
    ]

    if (userRole === "MANAGER" || userRole === "EXEC") {
      baseItems.push({ label: "대시보드", path: "/my-work?tab=approvals" })
    }

    if (userRole === "ADMIN") {
      baseItems.push({ label: "시스템 관리", path: "/admin" })
    }

    return baseItems
  }

  return (
    <div className="min-h-dvh flex flex-col">
      {showHeader && (
        <header className="border-b bg-card shadow-sm">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold cursor-pointer hover:text-primary" onClick={() => navigate("/")} title="Click to return home">
                  🎯 통합성과관리
                </h1>
              </div>

              {/* Desktop Menu */}
              <nav className="hidden md:flex items-center gap-1">
                {getMenuItems().map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <p className="text-sm font-medium">{displayName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded ${roleColor[userRole]}`}>
                    {getRoleLabel(userRole)}
                  </span>
                </div>
                <ModeToggle />

                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <nav className="md:hidden mt-3 pb-3 border-t pt-3 space-y-1">
                {getMenuItems().map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    alert("로그아웃 기능은 실제 환경에서 구현됩니다.")
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </nav>
            )}
          </div>
        </header>
      )}

      <main className="flex-1 flex">
        <div className="flex-1 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}