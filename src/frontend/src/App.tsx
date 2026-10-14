import { AppLayout } from "@/components/layout/AppLayout";
import AiPage from "@/pages/AiPage";
import CostPage from "@/pages/CostPage";
import MenuPage from "@/pages/MenuPage";
import OverviewPage from "@/pages/OverviewPage";
import PackagePage from "@/pages/PackagePage";
import PromotionsPage from "@/pages/PromotionsPage";
import QueuePage from "@/pages/QueuePage";
import ReportsPage from "@/pages/ReportsPage";
import SettingsPage from "@/pages/SettingsPage";
import StockPage from "@/pages/StockPage";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: "queue", element: <QueuePage /> },
      { path: "ai", element: <AiPage /> },
      { path: "cost", element: <CostPage /> },
      { path: "promotions", element: <PromotionsPage /> },
      { path: "package", element: <PackagePage /> },
      { path: "menu", element: <MenuPage /> },
      { path: "stock", element: <StockPage /> },
      { path: "reports", element: <ReportsPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
