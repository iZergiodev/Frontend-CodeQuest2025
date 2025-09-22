import Index from "@/pages/Index";
import { Layout } from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import CreatePost from "@/pages/CreatePost";
import CategoryPage from "@/pages/CategoryPage";
import {Profile} from "@/pages/Profile";
import AdminPanel from "@/pages/AdminPanel";
import PostRanking from "@/pages/PostRanking";
import Explore from "@/pages/Explore";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import ConditionalRoute from "@/components/ConditionalRoute";
import { createBrowserRouter } from "react-router-dom";
import Settings from "@/pages/Settings";

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <ConditionalRoute />,
            },
            {
                path: "/post/:slug",
                element: <PostDetail />,
            },
            {
                path: "/category/:categorySlug",
                element: <CategoryPage />,
            },
            {
                path: "/create-post",
                element: (
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/edit-post/:slug",
                element: (
                    <ProtectedRoute>
                        <CreatePost />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/settings",
                element: (
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin",
                element: (
                    <ProtectedRoute>
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    </ProtectedRoute>
                ),
            },
            {
                path: "/trending",
                element: <PostRanking />,
            },
            {
                path: "/popular",
                element: <PostRanking />,
            },
            {
                path: "/explore",
                element: <Explore />,
            },
        ]
    },
    {
        path: "/*",
        element: <NotFound />,
    },

], {
    future: {
        v7_startTransition: true,
    },
})