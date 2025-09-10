import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import PostDetail from "@/pages/PostDetail";
import { createBrowserRouter } from "react-router-dom";

export const appRouter = createBrowserRouter([
    {
        path: '/',
        element: <Index />,
    },
    {
        path:"/post/:id",
        element: <PostDetail />,
    },
    {
        path:"/*",
        element: <NotFound />,
    },

])