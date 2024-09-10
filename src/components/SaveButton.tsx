import { useState } from "react";
import { Class } from "@/lib/definitions";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Heart, HeartOff, Star, StarHalf, XCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Input } from "./ui/input";

type Props = {
  activeSched: Class[];
};

const isScheduleSaved = (
  saved: Record<string, Class[]>,
  sched2: Class[]
): string | false => {
  // Iterate through each saved schedule
  for (const key in saved) {
    const savedSched = saved[key];

    // Check if the saved schedule and sched2 have the same length
    if (savedSched.length !== sched2.length) continue;

    // Collect class codes from both savedSched and sched2
    const savedCodes = savedSched.map((cls) => cls.code).sort();
    const sched2Codes = sched2.map((cls) => cls.code).sort();

    // Compare the sorted arrays of class codes
    const isSameSchedule = savedCodes.every(
      (code, index) => code === sched2Codes[index]
    );

    if (isSameSchedule) return key;
  }

  // Return false if no matching schedule is found
  return false;
};

const SaveButton = ({ activeSched }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [saved, setSaved] = useLocalStorage<Record<string, Class[]>>(
    "saved_schedules",
    {}
  );

  const isSaved = isScheduleSaved(saved, activeSched);

  const FormSchema = z
    .object({
      name: z.string().min(1, {
        message: "Your schedule name can't be blank!",
      }),
    })
    .refine(
      (val) => {
        return !Object.keys(saved).includes(val.name);
      },
      {
        message: "You already have a schedule with that name.",
        path: ["name"],
      }
    );

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const newSaved = { ...saved, [data.name]: activeSched };
    setSaved(newSaved);
    setOpen(false);
  };

  const onDelete = (name: string) => {
    const newSaved = { ...saved };
    delete newSaved[name];

    setSaved(newSaved);
    setOpen(false);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  if (isSaved) {
    return (
      <Button
        className="flex flex-row gap-2 items-center justify-center"
        variant="secondary"
        onClick={() => onDelete(isSaved)}
      >
        <HeartOff size={16} />
        <span>Unsave</span>
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center justify-center"
        >
          <Heart strokeWidth={2} size={16} /> Save
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px]">
        <DialogHeader className="">
          <DialogTitle>Schedule Name</DialogTitle>
          <DialogDescription>
            What do you want this schedule to be called?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Most Optimal Schedule"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="ml-auto">
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SaveButton;
