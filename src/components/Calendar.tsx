"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Class } from "@/lib/definitions";
import { cn, convertTime, daysEnum, toProperCase } from "@/lib/utils";
import { useState } from "react";

const CELL_SIZE_PX = 56;
const CELL_HEIGHT = "h-14";

const calculateHeight = (start: number, end: number) => {
  const startHour = Math.floor(start / 100);
  const endHour = Math.floor(end / 100);
  const startMinutes = start % 100;
  const endMinutes = end % 100;

  const totalMinutes = (endHour - startHour) * 60 + (endMinutes - startMinutes);

  // 16 here is to account for offset
  return (totalMinutes / 60) * CELL_SIZE_PX;
};

const Calendar = ({ courses }: { courses: Class[] }) => {
  const [hovered, setHovered] = useState<number | false>(false);
  const cardColors = [
    "dark:bg-rose-950",
    "dark:bg-amber-950",
    "dark:bg-green-950",
    "dark:bg-purple-950",
    "dark:bg-indigo-950",
    "dark:bg-blue-950",
    "dark:bg-sky-950",
    "dark:bg-teal-950",
  ];

  const cardShadows = [
    "dark:bg-rose-800 dark:shadow-rose-700/50",
    "dark:bg-amber-800 dark:shadow-amber-700/50",
    "dark:bg-green-800 dark:shadow-green-700/50",
    "dark:bg-purple-800 dark:shadow-purple-700/50",
    "dark:bg-indigo-800 dark:shadow-indigo-700/50",
    "dark:bg-blue-800 dark:shadow-blue-700/50",
    "dark:bg-sky-800 dark:shadow-sky-700/50",
    "dark:bg-teal-800 dark:shadow-teal-700/50",
  ];

  const getRandomColor = () => {
    return {
      color: cardColors.pop() as string,
      shadow: cardShadows.pop() as string,
    };
  };

  const courseColors: Record<string, Record<"shadow" | "color", string>> = {};

  const sortedClasses = courses.reduce<
    Record<keyof typeof daysEnum, (Class & { color: string; shadow: string })[]>
  >(
    (acc, course) => {
      for (const sched of course.schedules) {
        if (!courseColors[course.code]) {
          const { color, shadow } = getRandomColor();
          courseColors[course.code] = { color, shadow };
        }

        if (sched.day !== "U") {
          acc[sched.day].push({
            color: courseColors[course.code].color,
            shadow: courseColors[course.code].shadow,
            ...course,
          });
        }
      }

      return acc;
    },
    { M: [], T: [], W: [], H: [], F: [], S: [] }
  );

  console.log(sortedClasses);

  const headerStyle =
    "relative h-full w-full text-center rounded-lg py-2 px-2 mx-2 font-bold text-slate-400";

  return (
    <div className="flex h-full w-full flex-col">
      {/* Day Indicator Row */}
      <div className="flex w-full flex-row border-b border-slate-800 py-1">
        <div className="w-[50px] shrink-0"></div>
        <div className="w-2 shrink-0" />

        <div className={headerStyle}>MONDAY</div>
        <div className={headerStyle}>TUESDAY</div>
        <div className={headerStyle}>WEDNESDAY</div>
        <div className={headerStyle}>THURSDAY</div>
        <div className={headerStyle}>FRIDAY</div>
        <div className={headerStyle}>SATURDAY</div>
      </div>

      {/* Scrollable Container */}
      <div className="flex h-full w-full overflow-y-scroll">
        {/* Calendar Content */}
        <div className="flex h-max w-full flex-row">
          {/* Time indicators */}
          <div className="ml-2 flex w-[50px] shrink-0 flex-col items-end">
            {[...Array(16)].map((_, index) => (
              <div className={cn(`${CELL_HEIGHT} shrink-0`)} key={index}>
                {" "}
                <span className="relative top-[3px] w-7 text-nowrap pr-2 text-right text-xs text-slate-500">
                  {index + 7 > 12 ? index - 5 : index + 7}{" "}
                  {index + 7 >= 12 ? "PM" : "AM"}
                </span>
              </div>
            ))}
          </div>

          <div className="relative flex w-full flex-row">
            <div className="h-full w-0 pt-4">
              {[...Array(15)].map((_, index) => (
                <div
                  className={cn(
                    `${CELL_HEIGHT} after:absolute after:-z-10 after:h-[1px] after:w-full after:bg-slate-800 after:content-['']`
                  )}
                  key={index}
                />
              ))}
              <div
                className={cn(
                  `h-0 after:absolute after:-z-10 after:h-[1px] after:w-full after:bg-slate-800 after:content-['']`
                )}
              />
            </div>

            <div className="h-full w-2 shrink-0" />
            {(Object.keys(sortedClasses) as Array<keyof typeof daysEnum>).map(
              (day) => {
                return (
                  <div
                    className={`relative flex h-full w-full flex-col border-l border-slate-800 pr-2 ${
                      ["M", "W", "F"].includes(day) && "bg-slate-900/30"
                    }`}
                    key={day}
                  >
                    {sortedClasses[day].map((currClass, index) => {
                      const schedules = currClass.schedules.filter(
                        (sched) => sched.day === day
                      );

                      return (
                        <>
                          {schedules.map((sched) => {
                            const start = sched.start;
                            const end = sched.end;
                            return (
                              <Card
                                key={index}
                                onMouseEnter={() => setHovered(currClass.code)}
                                onMouseLeave={() => setHovered(false)}
                                className={cn(
                                  `border-0 p-3 ${
                                    hovered === currClass.code &&
                                    `scale-105 shadow-[0_0px_10px_3px_rgba(0,0,0,0.3)]`
                                  } absolute w-[95%] transition-all ${
                                    currClass.color
                                  }`,
                                  hovered === currClass.code && currClass.shadow
                                )}
                                style={{
                                  height: calculateHeight(start, end),
                                  top: calculateHeight(700, start) + 16,
                                }}
                              >
                                <div className="flex h-full flex-col justify-center gap-1">
                                  <CardTitle className="text-xs font-bold">
                                    {`${currClass.course} [${currClass.code}]`}
                                  </CardTitle>
                                  <div className="text-xs">
                                    <div>
                                      {convertTime(start)} - {convertTime(end)}
                                    </div>
                                    {currClass.professor && (
                                      <div className="overflow-hidden text-ellipsis text-nowrap">
                                        {`${toProperCase(currClass.professor)}`}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
