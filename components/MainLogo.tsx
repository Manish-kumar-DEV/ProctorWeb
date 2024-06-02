import Image from "next/image";
import React from "react";
import useApplicationTheme from "@/app/hooks/useApplicationTheme";
import LightLogo from "@/public/Logo_White.png";
import DarkLogo from "@/public/Logo_Black.png";
import Link from "next/link";

function MainLogo({ showText = true }) {
  const applicationTheme = useApplicationTheme();
  return (
    <Link href="/">
      <div className="flex items-center cursor-pointer">
        <Image
          src={applicationTheme == "light" ? DarkLogo : LightLogo}
          width={50}
          height={50}
          alt={"Website Logo"}
        />
        {showText && <div className="text-2xl">ProctorWeb</div>}
      </div>
    </Link>
  );
}

export default MainLogo;
