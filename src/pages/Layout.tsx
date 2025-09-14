import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useState } from "react";
import { Outlet } from "react-router-dom"


export const Layout = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true)

  return (
    <>
      <Header />
      <div className={`flex ${isOpen ? 'ml-86' : 'ml-16'} transition-all duration-300 ease-in-out`}>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        <div className="flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};