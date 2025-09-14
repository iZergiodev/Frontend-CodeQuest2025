import Index from "@/app/layout/pages/Index";
import { Layout } from "@/app/layout/pages/Layout";
import NotFound from "@/app/layout/pages/NotFound";
import PostDetail from "@/features/post/pages/PostDetail";
import CreatePost from "@/features/user/pages/CreatePost";
import { createBrowserRouter } from "react-router-dom";
import {Profile} from "@/features/user/pages/Profile";

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
                path: "/profile",
                element: <Profile />,
            },

        ]
    },
    {
        path: "/*",
        element: <NotFound />,
    },

])