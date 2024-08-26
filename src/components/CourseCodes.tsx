"use client";
import { fetchCourse } from "@/lib/actions";
import { Course } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CourseInput from "./CourseInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataTable } from "./courseTable/data-table";
import { columns } from "./courseTable/columns";
import { createSchedules } from "@/lib/utils";
import { toast } from "./ui/use-toast";

const CourseCodes = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);

  const handleFetch = async (courseCode: string) => {
    if (courses.some((course) => course.courseCode === courseCode)) {
      toast({
        title: "That's not possible...",
        description: "You already added that course!",
        variant: "destructive",
      });

      return;
    }

    const data = await fetchCourse(courseCode);
    const newCourses = [...courses, data];

    setCourses(newCourses);
    localStorage.setItem("courses", JSON.stringify(newCourses));
  };

  const handleDelete = (courseCode: string) => {
    const newCourses = courses.filter(
      (course) => course.courseCode !== courseCode
    );

    if (activeCourse === courseCode) {
      setActiveCourse(null);
    }

    localStorage.setItem("courses", JSON.stringify(newCourses));
    setCourses(newCourses);
  };

  // Initialize the stored codes from local storage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("courses");
    const parsed = stored !== null ? JSON.parse(stored) : null;

    if (parsed) {
      setCourses(parsed);
    }
  }, []);

  const schedules = createSchedules(courses);
  console.log(schedules);

  return (
    <div className="flex gap-4 flex-row">
      <div className="flex flex-col gap-4">
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
                    activeCourse === course.courseCode ? "default" : "outline"
                  }
                  onClick={() => setActiveCourse(course.courseCode)}
                  className="w-full"
                >
                  {course.courseCode}
                </Button>
                <Button
                  size="icon"
                  className="shrink-0 hover:border-rose-700"
                  variant="outline"
                  onClick={() => handleDelete(course.courseCode)}
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
          <DataTable
            columns={columns}
            data={courses.flatMap((course) => course.classes)}
            activeCourse={activeCourse}
          />
        )}
      </div>
    </div>
  );
};

export default CourseCodes;
