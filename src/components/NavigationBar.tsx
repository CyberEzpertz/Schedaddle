"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { CalendarRange, TableProperties } from "lucide-react";

const NavigationBar = () => {
  const pathName = usePathname();

  const normalButton = buttonVariants({
    variant: "ghost",
    className: "flex gap-2 items-center",
  });

  const activeButton = buttonVariants({
    variant: "secondary",
    className: "flex gap-2 items-center",
  });

  return (
    <div className="p-4 flex items-center justify-between gap-2 w-full border-b px-32">
      <Link href="/" className="flex gap-2 font-extrabold text-lg items-center">
        <CalendarRange /> SchedEZ
      </Link>
      <div className="flex gap-2">
        <Link
          href="/"
          className={pathName === "/" ? activeButton : normalButton}
        >
          <TableProperties strokeWidth={2} />
          Courses
        </Link>
        <Link
          href="/schedules"
          className={pathName === "/schedules" ? activeButton : normalButton}
        >
          <CalendarRange />
          Schedules
        </Link>
      </div>
      <ModeToggle />
    </div>
  );
};

export default NavigationBar;
