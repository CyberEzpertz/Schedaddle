import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Class, DaysEnum, Filter, Schedule } from "./definitions";

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

export function filterInitialData(
  courses: Class[][],
  filter: Filter
): Class[][] {
  return courses.map((course) =>
    course.filter((courseClass) => {
      const isSchedInvalid = courseClass.schedules.some((sched) => {
        if (sched.day === "U") return false;

        const { start, end, modalities } = filter.specific[sched.day];

        return (
          sched.start < start ||
          sched.end > end ||
          !modalities.includes(courseClass.modality)
        );
      });

      // Keep the class if it passes both the schedule and modality filters
      return !isSchedInvalid;
    })
  );
}

export function militaryTimeToMinutes(time: number): number {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  return hours * 60 + minutes;
}

export function filterGeneratedSchedules(schedules: Class[][], filter: Filter) {
  return schedules.filter((sched) => {
    // 1. We reduce the scheds into a per day basis to do this easier.
    const deconstructed = sched.reduce<Record<DaysEnum, Schedule[]>>(
      (acc, curr) => {
        for (const classSched of curr.schedules) {
          if (classSched.day === "U") continue;
          acc[classSched.day].push(classSched);
        }
        return acc;
      },
      { M: [], T: [], W: [], H: [], F: [], S: [] }
    );

    // 2. We check each of the days one by one to see if any of them violate the
    // given filters.
    const isInvalid = Object.entries(deconstructed).some(([day, classes]) => {
      if (classes.length === 0) return false;

      const { maxPerDay, maxConsecutive } = filter.specific[day as DaysEnum];
      if (classes.length > maxPerDay) return true;
      if (classes.length < maxConsecutive) return false;

      let consecutive = 1;
      classes.sort((a, b) => a.start - b.start);

      for (let i = 1; i < classes.length; i++) {
        const remaining = classes.length - (i + 1);

        const previousEnd = militaryTimeToMinutes(classes[i - 1].end);
        const currentStart = militaryTimeToMinutes(classes[i].start);
        const timeDifference = currentStart - previousEnd;

        // If the time difference is LTE to 15, they're consecutive.
        // But if it's not, we reset back to 1 class.
        if (timeDifference <= 15) {
          consecutive += 1;
        } else {
          consecutive = 1;
        }

        if (consecutive > maxConsecutive) {
          return true;
        }

        // Early exit when there's not enough classes left to go over the maximum
        if (remaining + consecutive < maxConsecutive) return false;
      }

      return false;
    });

    return !isInvalid;
  });
}

export function createSchedules(
  courses: Class[][],
  filter?: Filter
): Class[][] {
  // This will store all currently made schedules.
  let createdScheds: Class[][] = [[]];

  if (filter) {
    courses = filterInitialData(courses, filter);
  }

  // First, iterate throughout all of the courses
  for (const course of courses) {
    // This will store the current combinations given the course and
    // currently created schedules.
    const newCombinations: Class[][] = [];

    // Iterate throughout all the created scheds so far.
    for (let i = createdScheds.length - 1; i >= 0; i--) {
      const currentSched = createdScheds[i];
      // This flag is to indicate that at least 1 combination exists.
      let schedExists = false;

      // Check if overlap between any of the classes inside the
      // combinations and the current course class.
      for (const courseClass of course) {
        const overlap = currentSched.some((schedClass) =>
          doClassesOverlap(courseClass.schedules, schedClass.schedules)
        );

        // If there's an overlap, we can't add it to the schedule.
        if (overlap) continue;

        // If there's no overlap, this schedule can continue as is.
        schedExists = true;
        newCombinations.push([...currentSched, courseClass]);
      }

      if (!schedExists) {
        createdScheds.splice(i, 1);
      }
    }

    createdScheds = newCombinations;
  }

  if (filter) return filterGeneratedSchedules(createdScheds, filter);

  return createdScheds;
}

export function convertTime(time: number) {
  const hour = Math.floor(time / 100);
  const minutes = time % 100;

  return `${hour > 12 ? hour - 12 : hour}:${
    minutes > 10 ? "" : "0"
  }${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

export function toProperCase(val: string) {
  return val
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/((?<=( |-)|^).)/g, (s) => s.toUpperCase());
}

export function getLocalStorage(name: string) {
  const stored = localStorage.getItem(name);
  const parsed = stored !== null ? JSON.parse(stored) : null;

  return parsed;
}

export function modifySelectedData(
  courseCode: string,
  data: Class[] | "DELETE"
) {
  const selectedData = getLocalStorage("selected_data") ?? {};

  if (data === "DELETE") {
    delete selectedData[courseCode];
    localStorage.setItem("selected_data", JSON.stringify(selectedData));
    return;
  }

  selectedData[courseCode] = data;
  localStorage.setItem("selected_data", JSON.stringify(selectedData));
  return;
}
