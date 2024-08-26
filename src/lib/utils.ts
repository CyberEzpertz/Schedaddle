import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Class, Course, Schedule } from "./definitions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function doClassesOverlap(sched1: Schedule[], sched2: Schedule[]) {
  const doSchedsOverlap = (sched1: Schedule, sched2: Schedule) => {
    // 915 - 1045 vs 730 - 930
    return sched1.start <= sched2.end && sched2.start <= sched1.end;
  };

  for (const currSched1 of sched1) {
    for (const currSched2 of sched2) {
      if (currSched1.day !== currSched2.day) continue;

      const overlap = doSchedsOverlap(currSched1, currSched2);
      if (overlap) return true;
    }
  }

  return false;
}

export function createSchedules(courses: Course[]) {
  // This will store all currently made schedules.
  let createdScheds: Class[][] = [[]];

  // First, iterate throughout all of the courses
  for (const course of courses) {
    // This will store the current combinations given the course and
    // currently created schedules
    const newCombinations: Class[][] = [];

    // Iterate throughout all the created scheds so far.
    for (const combo of createdScheds) {
      // This flag is to indicate that at least 1 combination exists.
      let schedExists = false;

      // Check if overlap between any of the classes inside the combinations
      // and the current course class.
      for (const courseClass of course.classes) {
        const overlap = combo.some((comboClass) =>
          doClassesOverlap(courseClass.schedules, comboClass.schedules)
        );

        // If there's an overlap, we can't add it to the schedule.
        if (overlap) continue;

        schedExists = true;
        newCombinations.push([...combo, courseClass]);
      }

      if (!schedExists) return [];
    }

    createdScheds = newCombinations;
  }

  return createdScheds;
}
