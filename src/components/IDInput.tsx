"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IdCard } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useLocalStorage from "@/hooks/useLocalStorage";

const FormSchema = z.object({
  idNumber: z
    .string()
    .min(8, {
      message: "Your ID number must be 8 numbers long.",
    })
    .regex(/^\d+$/, "Your ID should only contain numbers!"),
});

const IDInput = () => {
  const [id, setID] = useLocalStorage<string>("id_number", "");

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setID(data.idNumber);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      idNumber: "",
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <IdCard />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[380px]">
        <DialogHeader className="">
          <DialogTitle>ID Number</DialogTitle>
          <DialogDescription>
            {
              "We'll need your ID Number to fetch courses. Don't worry, this will only be stored locally!"
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={8} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription className="max-w-80">
                    {!!id && `Current ID: ${id}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogClose asChild>
              <Button type="submit" className="ml-auto">
                Save
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default IDInput;
