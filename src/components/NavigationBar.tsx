"use client";

import React from "react";
import { Card } from "./ui/card";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

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
    <Card className="p-4 flex items-center justify-center gap-2 w-60">
      <Link href="/" className={pathName === "/" ? activeButton : normalButton}>
        Courses
      </Link>
      <Link
        href="/schedules"
        className={pathName === "/schedules" ? activeButton : normalButton}
      >
        Schedules
      </Link>
    </Card>
  );
};

export default NavigationBar;
