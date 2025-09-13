import Header from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { useOpen } from "@/hooks/useOpen";
import { useState } from "react";
import { Outlet } from "react-router-dom"


export const Layout = () => {

  const {isOpen} = useOpen();

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