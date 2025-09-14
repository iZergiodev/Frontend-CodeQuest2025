import Index from "@/pages/Index";
import { Layout } from "@/pages/Layout";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import CreatePost from "@/pages/CreatePost";
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

        ]
    },
    {
        path: "/*",
        element: <NotFound />,
    },

])