"use client";
import fetchCourse from "@/lib/actions";
import { Course, courseArraySchema, courseSchema } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import CourseInput from "./CourseInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const CourseCodes = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  const handleFetch = async (courseCode: string) => {
    const data = await fetchCourse(courseCode);
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
    <div className="flex gap-4 flex-row">
      <Card>
        <CardContent className="pt-6">
          <CourseInput fetchHandler={handleFetch} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sample Data</CardTitle>
        </CardHeader>
        <CardContent>{JSON.stringify(courses[0])}</CardContent>
      </Card>
    </div>
  );
};

export default CourseCodes;
