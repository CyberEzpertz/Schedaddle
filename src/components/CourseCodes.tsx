"use client";
import fetchCourse from "@/lib/actions";
import { Course, courseArraySchema, courseSchema } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "./ui/button";
import CourseInput from "./CourseInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataTable } from "./courseTable/data-table";
import { columns } from "./courseTable/columns";

const CourseCodes = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

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
      <div>
        <Card>
          <CardContent className="pt-6">
            <CourseInput fetchHandler={handleFetch} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Codes</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.map((course) => (
              <div key={course.courseCode} className="flex flex-row gap-2">
                <Button
                  variant={
                    activeCourse?.courseCode === course.courseCode
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setActiveCourse(course)}
                  className="w-full"
                >
                  {course.courseCode}
                </Button>
                <Button
                  size="icon"
                  className="shrink-0 hover:border-rose-700"
                  variant="outline"
                >
                  X
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div>
        {activeCourse && (
          <DataTable columns={columns} data={activeCourse.classes} />
        )}
      </div>
    </div>
  );
};

export default CourseCodes;
