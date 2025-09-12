import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { Outlet } from "react-router-dom"


export const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-grow ml-86 p-4 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};