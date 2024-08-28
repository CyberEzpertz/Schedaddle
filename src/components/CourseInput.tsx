"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  courseCode: z.string().length(7, "Length should be 7!"),
});

type props = {
  fetchHandler: (courseCode: string) => Promise<void>;
};

const CourseInput = ({ fetchHandler }: props) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsFetching(true);

    await fetchHandler(values.courseCode.toUpperCase());

    setIsFetching(false);
  };

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="courseCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Code</FormLabel>
              <FormControl>
                <Input placeholder="GE12345" {...field} />
              </FormControl>
              <FormDescription>
                Input a course code you want to add.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isFetching}>
          {isFetching ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            "Add Course"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CourseInput;
