import Image from "next/image";
import React from "react";
import useApplicationTheme from "../hooks/useApplicationTheme";
import LightLogo from "@/public/Logo_White.png";
import DarkLogo from "@/public/Logo_Black.png";

function MainLogo() {
  const applicationTheme = useApplicationTheme();
  return (
    <div className="flex items-center cursor-pointer">
      <Image
        src={applicationTheme == "light" ? DarkLogo : LightLogo}
        width={50}
        height={50}
        alt={"Website Logo"}
      />
      <div className="text-2xl">ProctorWeb</div>
    </div>
  );
}

export default MainLogo;
