"use client";
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import DashboardHeader from "../DashboardHeader";
import { usePathname } from "next/navigation";
import FaceVerficationModal from "../FaceVerficationModal";
import FaceWebcam from "../FaceWebcam";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isQuizPage = pathname.startsWith("/dashboard/quiz/");
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        {!isQuizPage && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main>
            <div
              className={`mx-auto max-w-screen-2xl ${
                isQuizPage ? "p-12" : "p-4"
              } pt-0 `}
            >
              {children}
            </div>
          </main>
        </div>
        {isQuizPage && (
          <div className="h-screen w-72 p-2">
            <FaceWebcam />
          </div>
        )}
      </div>
    </>
  );
}
