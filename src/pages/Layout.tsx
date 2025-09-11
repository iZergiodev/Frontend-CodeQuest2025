import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Outlet } from "react-router-dom"


export const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex ml-86">
        <Sidebar />
        <div className="flex-grow p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};