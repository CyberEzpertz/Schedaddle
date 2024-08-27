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

const CourseCodes = () => {
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
    const parsed = getLocalStorage("courses");

    if (parsed) {
      setCourses(parsed);
      if (parsed.length !== 0) {
        setActiveCourse(parsed[0]);
      }
    }
  }, []);

  return (
    <div className="flex gap-4 flex-row h-4/5 overflow-hidden w-4/5">
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
      {activeCourse && (
        <DataTable
          columns={columns}
          data={activeCourse.classes}
          activeCourse={activeCourse.courseCode}
        />
      )}
    </div>
  );
};

export default CourseCodes;
