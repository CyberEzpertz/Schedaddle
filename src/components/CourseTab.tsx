"use client";
import { fetchCourse } from "@/lib/actions";
import { Course } from "@/lib/definitions";
import { useCallback, useEffect, useState } from "react";
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
import { Reorder, useDragControls } from "framer-motion";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { CircleOff, GripVertical } from "lucide-react";

const CourseTab = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const controls = useDragControls();

  const handleFetch = async (courseCode: string) => {
    const id = getLocalStorage("id_number");

    if (courses.some((course) => course.courseCode === courseCode)) {
      toast({
        title: "That's not possible...",
        description: "You already added that course!",
        variant: "destructive",
      });

      return;
    }

    if (!id) {
      toast({
        title: "You haven't set your ID yet!",
        description: "Set your ID on the button at the top right corner.",
        variant: "destructive",
      });

      return;
    }

    const data = await fetchCourse(courseCode, id);

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

  const handleSwap = useCallback((newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem("courses", JSON.stringify(newCourses));
  }, []);

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
    <div className="flex gap-4 flex-row flex-grow py-16 px-32 w-full self-stretch min-h-0">
      <div className="flex flex-col gap-4 w-[20%]">
        <Card>
          <CardContent className="pt-6">
            <CourseInput
              fetchHandler={handleFetch}
              courses={courses}
              setCourses={setCourses}
            />
          </CardContent>
        </Card>
        <Card className="flex flex-col grow">
          <CardHeader>
            <CardTitle>Course Codes</CardTitle>
          </CardHeader>
          <CardContent className="grow">
            {courses.length !== 0 ? (
              <Reorder.Group
                className="flex gap-2 row flex-col"
                axis="y"
                values={courses}
                onReorder={handleSwap}
              >
                {courses.map((course) => (
                  <Reorder.Item
                    key={course.courseCode}
                    value={course}
                    className="flex flex-row gap-2 items-center"
                  >
                    <GripVertical
                      onPointerDown={(e) => controls.start(e)}
                      className="shrink-0 text-muted-foreground cursor-grab"
                    />
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
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="text-sm text-muted-foreground size-full flex flex-col gap-2 items-center justify-center">
                <CircleOff />
                None added yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <DataTable
        columns={columns}
        data={activeCourse?.classes ?? []}
        lastFetched={activeCourse?.lastFetched}
        activeCourse={activeCourse?.courseCode ?? null}
      />
    </div>
  );
};

export default CourseTab;
