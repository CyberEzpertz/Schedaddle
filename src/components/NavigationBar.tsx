"use client";

import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { CalendarRange, TableProperties } from "lucide-react";
import IDInput from "./IDInput";

const NavigationBar = () => {
  const pathName = usePathname();

  const normalButton = buttonVariants({
    variant: "ghost",
    className: "flex gap-2 items-center",
  });

  const activeButton = buttonVariants({
    variant: "default",
    className: "flex gap-2 items-center",
  });

  return (
    <div className="p-4 flex items-center justify-between gap-2 w-full border-b px-16">
      <Link href="/" className="flex gap-2 font-extrabold text-lg items-center">
        <CalendarRange /> Schedaddle
      </Link>
      <div className="flex gap-2">
        <Link
          href="/"
          className={pathName === "/" ? activeButton : normalButton}
        >
          <TableProperties strokeWidth={1.5} size={22} />
          Courses
        </Link>
        <Link
          href="/schedules"
          className={pathName === "/schedules" ? activeButton : normalButton}
        >
          <CalendarRange strokeWidth={1.5} size={22} />
          Schedules
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <IDInput />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavigationBar;
