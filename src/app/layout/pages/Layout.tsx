import Header from "@/app/layout/components/Header"
import { Sidebar } from "@/app/layout/components/Sidebar"
import { useOpen } from "@/hooks/useOpen";
import { Outlet } from "react-router-dom"


export const Layout = () => {
  const { isOpen } = useOpen();

  return (
    <>
      <Header />
      <div className={`flex ${isOpen ? 'ml-86' : 'ml-16'} transition-all duration-300 ease-in-out`}>
        <Sidebar />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};