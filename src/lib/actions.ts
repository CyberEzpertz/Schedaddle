"use server";

import { class2DArraySchema, classArraySchema, Course } from "./definitions";

export async function fetchCourse(courseCode: string, id: string) {
  const res = await fetch(
    `${process.env.COURSE_API}/api/courses?id=${id}&courses=${courseCode}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Something went wrong while fetching.");
  }

  const parsed = (await res.json())[0];
  const parsedData = classArraySchema.parse(parsed);

  const newCourse: Course = {
    courseCode: courseCode,
    classes: parsedData,
    last_fetched: new Date(),
  };

  return newCourse;
}

export async function fetchMultipleCourses(courseCodes: string[]) {
  const id = process.env.ID_NUMBER;

  const res = await fetch(
    `${process.env.COURSE_API}/api/courses?id=${id}&courses=${courseCodes.join(
      "&courses="
    )}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Something went wrong while fetching.");
  }

  const parsed = await res.json();
  const parsedData = class2DArraySchema.parse(parsed);

  const updatedCourses = parsedData.map((classes) => {
    return {
      courseCode: classes[0].course,
      classes: classes,
      last_fetched: new Date(),
    };
  });

  return updatedCourses;
}
