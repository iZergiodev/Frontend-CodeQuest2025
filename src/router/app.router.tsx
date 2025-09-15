import Index from "@/pages/Index";
import { Layout } from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import CreatePost from "@/pages/CreatePost";
import CategoryPage from "@/pages/CategoryPage";
import { createBrowserRouter } from "react-router-dom";

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Index />,
            },
            {
                path: "/post/:id",
                element: <PostDetail />,
            },
            {
                path: "/create-post",
                element: <CreatePost />,
            },
            {
                path: "/category/:categorySlug",
                element: <CategoryPage />,
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