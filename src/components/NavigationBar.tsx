"use client";

import React from "react";
import { Card } from "./ui/card";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

type Props = {};

const NavigationBar = () => {
  const pathName = usePathname();

  const normalButton = buttonVariants({
    variant: "ghost",
  });

  const activeButton = buttonVariants({
    variant: "secondary",
  });

  return (
    <div className="p-4 flex items-center justify-center gap-2 w-full border-b">
      <div>
        <Link
          href="/"
          className={pathName === "/" ? activeButton : normalButton}
        >
          Courses
        </Link>
        <Link
          href="/schedules"
          className={pathName === "/schedules" ? activeButton : normalButton}
        >
          Schedules
        </Link>
      </div>
      <ModeToggle />
    </div>
  );
};

export default NavigationBar;
