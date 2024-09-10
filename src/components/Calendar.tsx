"use client";
import { Card, CardTitle } from "@/components/ui/card";
import { Class, ColorsEnum, DaysEnum, DaysEnumSchema } from "@/lib/definitions";
import { cn, convertTime, getCardColors, toProperCase } from "@/lib/utils";
import { useCallback, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

const CELL_SIZE_PX = 56;
const CELL_HEIGHT = "h-14";

const Calendar = ({
  courses,
  colors,
}: {
  courses: Class[];
  colors: Record<string, ColorsEnum>;
}) => {
  const calculateHeight = useCallback((start: number, end: number) => {
    const startHour = Math.floor(start / 100);
    const endHour = Math.floor(end / 100);
    const startMinutes = start % 100;
    const endMinutes = end % 100;

    const totalMinutes =
      (endHour - startHour) * 60 + (endMinutes - startMinutes);

    // 16 here is to account for offset
    return (totalMinutes / 60) * CELL_SIZE_PX;
  }, []);

  const [hovered, setHovered] = useState<number | false>(false);

  const sortedClasses = courses.reduce<
    Record<DaysEnum, (Class & { color: string; shadow: string })[]>
  >(
    (acc, course) => {
      for (const sched of course.schedules) {
        if (sched.day !== "U") {
          const cardColors = getCardColors(colors[course.course]);

          acc[sched.day].push({
            ...cardColors,
            ...course,
          });
        }
      }

      return acc;
    },
    { M: [], T: [], W: [], H: [], F: [], S: [] }
  );

  const headerStyle =
    "relative h-full w-full text-center py-2 px-2 mx-2 font-bold text-muted-foreground";

  return (
    <div className="flex flex-shrink min-h-0 w-full flex-col border rounded-lg">
      {/* Day Indicator Row */}
      <div className="flex w-full flex-row border-b dark:border-muted py-1">
        <div className="w-[50px] shrink-0" />
        <div className="w-2 shrink-0" />

        <div className={headerStyle}>MONDAY</div>
        <div className={headerStyle}>TUESDAY</div>
        <div className={headerStyle}>WEDNESDAY</div>
        <div className={headerStyle}>THURSDAY</div>
        <div className={headerStyle}>FRIDAY</div>
        <div className={headerStyle}>SATURDAY</div>
      </div>

      {/* Scrollable Container */}
      <ScrollArea>
        {/* Calendar Content */}
        <div className="flex h-max w-full flex-row">
          {/* Time Column */}
          <div className="ml-2 flex w-[50px] shrink-0 flex-col items-end">
            {[...Array(16)].map((_, index) => (
              <div
                className={cn(`${CELL_HEIGHT} shrink-0`)}
                key={"time" + index}
              >
                {" "}
                <span className="relative top-[3px] w-7 text-nowrap pr-2 text-right text-xs text-gray-500">
                  {index + 7 > 12 ? index - 5 : index + 7}{" "}
                  {index + 7 >= 12 ? "PM" : "AM"}
                </span>
              </div>
            ))}
          </div>

          <div className="relative flex w-full flex-row">
            {/* Row Separators */}
            <div className="h-full w-0 pt-4">
              {[...Array(16)].map((_, index) => (
                <div
                  className={cn(
                    `${
                      index === 15 ? "h-0" : CELL_HEIGHT
                    } after:absolute after:-z-10 after:h-[1px] after:w-full after:bg-muted/50 after:content-['']`
                  )}
                  key={index}
                />
              ))}
            </div>

            <div className="h-full w-2 shrink-0" />
            {(Object.keys(sortedClasses) as Array<DaysEnum>).map((day) => {
              return (
                <div
                  className={`relative flex h-full w-full flex-col border-l border-muted/50 pr-2 ${
                    ["M", "W", "F"].includes(day) && "bg-muted/10"
                  }`}
                  key={day}
                >
                  {sortedClasses[day].map((currClass) => {
                    const schedules = currClass.schedules.filter(
                      (sched) => sched.day === day
                    );

                    return schedules.map((sched) => {
                      const start = sched.start;
                      const end = sched.end;
                      return (
                        <Card
                          key={`${currClass.course + start + end + sched.day}`}
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
                    });
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Calendar;
