"use client";
import fetchCourse from "@/lib/actions";
import { Course, courseArraySchema, courseSchema } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";

const CourseCodes = () => {
  const [code, setCode] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);

  const handleFetch = async () => {
    const code = "GEETHIC";
    const data = await fetchCourse(code);
    const newCourses = [...courses, data];

    setCourses(newCourses);
    localStorage.setItem("courses", JSON.stringify(newCourses));
  };

  // Initialize the stored codes from local storage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("courses");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    if (parsed) {
      setCourses(parsed);
    }
  }, []);

  return (
    <div>
      <Button onClick={handleFetch}>Fetch Sample Course</Button>
      <p>{JSON.stringify(courses)}</p>
    </div>
  );
};

export default CourseCodes;
