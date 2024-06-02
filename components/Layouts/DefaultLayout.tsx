"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main>
            <div className="mx-auto max-w-screen-2xl p-4 pt-0">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
