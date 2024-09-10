import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Class, ColorsEnum, Schedule } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { convertTime, getCardColors, toProperCase } from "@/lib/utils";
import { CalendarClock, Clock, DoorOpen, FilePen, User } from "lucide-react";

type Props = {
  activeSchedule: Class[];
  colors: Record<string, ColorsEnum>;
};

const ScheduleOverview = ({ activeSchedule, colors }: Props) => {
  return (
    <ScrollArea className="w-[20%] rounded-lg border">
      <div className="p-4 flex flex-col gap-2">
        {activeSchedule &&
          activeSchedule.map((courseClass) => {
            const schedules = courseClass.schedules.reduce<Schedule[]>(
              (acc, curr) => {
                if (
                  !acc.some(
                    (acc) => acc.start === curr.start && acc.end === curr.end
                  )
                )
                  acc.push(curr);
                return acc;
              },
              []
            );

            const days = courseClass.schedules.map((sched) => sched.day);

            const { color, border } = getCardColors(colors[courseClass.course]);

            return (
              <Card key={courseClass.code} className={`${color}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-bold text-lg">
                    {courseClass.course} [{courseClass.code}]
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <div className="flex gap-2">
                    <User size={18} strokeWidth={3} />{" "}
                    {courseClass.professor !== ""
                      ? toProperCase(courseClass.professor)
                      : "TBA"}
                  </div>
                  <div className="flex gap-2">
                    <CalendarClock size={18} strokeWidth={3} />
                    {days.join("/")}
                  </div>
                  {schedules.map((sched) => (
                    <div
                      className="flex gap-2 items-center"
                      key={`${sched.day}${sched.start}`}
                    >
                      <Clock size={18} strokeWidth={3} />

                      {`${convertTime(sched.start)} - ${convertTime(
                        sched.end
                      )} ${schedules.length > 1 ? `(${sched.day})` : ""}`}
                    </div>
                  ))}
                  {courseClass.rooms.map((room, index) =>
                    room !== "" ? (
                      <div key={room} className="flex gap-2 items-center">
                        <DoorOpen size={18} strokeWidth={3} />
                        {room}
                      </div>
                    ) : (
                      <React.Fragment key={index}></React.Fragment>
                    )
                  )}
                  <div className="flex gap-2">
                    <FilePen size={18} strokeWidth={3} />
                    {courseClass.remarks}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </ScrollArea>
  );
};

export default ScheduleOverview;
