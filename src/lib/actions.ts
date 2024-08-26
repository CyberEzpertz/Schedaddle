"use server";

import { classArraySchema, Course } from "./definitions";

export async function fetchCourse(courseCode: string) {
  const id = process.env.ID_NUMBER;

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
