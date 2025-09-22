import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useOpen } from "@/hooks/useOpen";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Outlet } from "react-router-dom"


export const Layout = () => {
  const { isOpen } = useOpen();
  useScrollToTop();

  return (
    <>
      <Header />
      <div className="flex">
        {/* Desktop Sidebar - handled by Sidebar component */}
        <Sidebar />
        <div className={`flex-grow overflow-auto transition-all duration-300 ease-in-out ${isOpen ? 'md:ml-86' : 'md:ml-16'}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};