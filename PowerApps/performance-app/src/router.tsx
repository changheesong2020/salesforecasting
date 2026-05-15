import { createBrowserRouter } from "react-router-dom"
import Layout from "@/pages/_layout"
import HomePage from "@/pages/home"
import MyWorkPage from "@/pages/my-work"
import PlanEditPage from "@/pages/plan-edit"
import ActualEditPage from "@/pages/actual-edit"
import ApprovalDetailPage from "@/pages/approval-detail"
import AdminDashboardPage from "@/pages/admin-dashboard"
import NotFoundPage from "@/pages/not-found"

// IMPORTANT: Do not remove or modify the code below!
// Normalize basename when hosted in Power Apps
const BASENAME = new URL(".", location.href).pathname
if (location.pathname.endsWith("/index.html")) {
  history.replaceState(null, "", BASENAME + location.search + location.hash);
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout showHeader={true} />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "my-work", element: <MyWorkPage /> },
      { path: "plan-edit/:planId?", element: <PlanEditPage /> },
      { path: "actual-edit/:actualId?", element: <ActualEditPage /> },
      { path: "approval-detail/:type/:recordId", element: <ApprovalDetailPage /> },
      { path: "admin", element: <AdminDashboardPage /> },
    ],
  },
], { 
  basename: BASENAME // IMPORTANT: Set basename for proper routing when hosted in Power Apps
})