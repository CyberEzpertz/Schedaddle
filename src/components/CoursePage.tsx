"use client";
import { fetchCourse } from "@/lib/actions";
import { Course } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CourseInput from "./CourseInput";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DataTable } from "./courseTable/data-table";
import { columns } from "./courseTable/columns";
import {
  createSchedules,
  getLocalStorage,
  modifySelectedData,
} from "@/lib/utils";
import { toast } from "./ui/use-toast";

const CoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

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

    if (data.classes.length === 0) {
      toast({
        title: "Oops... That course doesn't have any classes.",
        description:
          "Either that course doesn't exist or no classes have been published yet.",
        variant: "destructive",
      });

      return;
    }
    const newCourses = [...courses, data];

    setCourses(newCourses);
    localStorage.setItem("courses", JSON.stringify(newCourses));
  };

  const handleDelete = (courseCode: string) => {
    const newCourses = courses.filter(
      (course) => course.courseCode !== courseCode
    );

    if (activeCourse?.courseCode === courseCode) {
      setActiveCourse(null);
    }

    localStorage.setItem("courses", JSON.stringify(newCourses));
    localStorage.removeItem(`selectedRows_${courseCode}`);

    modifySelectedData(courseCode, "DELETE");

    setCourses(newCourses);
  };

  // Initialize the stored codes from local storage on component mount
  useEffect(() => {
    const data = getLocalStorage("courses");

    if (data) {
      setCourses(data);

      if (data.length !== 0) {
        setActiveCourse(data[0]);
      }
    }
  }, []);

  return (
    <div className="flex gap-4 flex-row h-4/5 px-32 w-full">
      <div className="flex flex-col gap-4">
        <Card>
          <CardContent className="pt-6">
            <CourseInput
              fetchHandler={handleFetch}
              courses={courses}
              setCourses={setCourses}
            />
          </CardContent>
        </Card>
        <Card className="grow">
          <CardHeader>
            <CardTitle>Course Codes</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 row flex-col">
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
                  onClick={() => handleDelete(course.courseCode)}
                >
                  X
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <DataTable
        columns={columns}
        data={activeCourse?.classes ?? []}
        activeCourse={activeCourse?.courseCode ?? null}
      />
    </div>
  );
};

export default CoursePage;
