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
import { DaysEnumSchema, ModalityEnumSchema } from "@/lib/definitions";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Toggle } from "./ui/toggle";
const formSchema = z
  .object({
    start: z.coerce.number().min(0).max(2400),
    end: z.coerce.number().min(0).max(2400),
    maxPerDay: z.coerce.number().min(1).max(10),
    maxConsecutive: z.coerce.number().min(1).max(10),
    modalities: z.array(ModalityEnumSchema),
    daysInPerson: z.array(DaysEnumSchema),
  })
  .refine((schema) => schema.start < schema.end, {
    message: "Start can't be greater than or equal to end time.",
    path: ["start"],
  });

export function FilterForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start: 0,
      end: 2400,
      maxPerDay: 10,
      maxConsecutive: 10,
      modalities: [
        "F2F",
        "HYBRID",
        "ONLINE",
        "PREDOMINANTLY ONLINE",
        "TENTATIVE",
      ],
      daysInPerson: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid grid-cols-2 gap-8 w-full">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="w-auto">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input className="" placeholder="Placeholder" {...field} />
                </FormControl>
                <FormDescription className="">
                  The earliest possible time for a class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="w-auto">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input placeholder="Placeholder" {...field} />
                </FormControl>
                <FormDescription>
                  The latest possible time for a class.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="maxPerDay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{"Max Courses / Day"}</FormLabel>
                <FormControl>
                  <Input placeholder="Placeholder" {...field} />
                </FormControl>
                <FormDescription>
                  How many courses are allowed per day? {"(Max of 10)"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxConsecutive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Consecutive Courses</FormLabel>
                <FormControl>
                  <Input placeholder="Placeholder" {...field} />
                </FormControl>
                <FormDescription>
                  How many courses do you want back-to-back?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="modalities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modalities</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="flex flex-row justify-items-stretch"
                  type="multiple"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  {ModalityEnumSchema.options.map((modality) => (
                    <ToggleGroupItem
                      key={modality}
                      value={modality}
                      className="border w-full text-nowrap"
                    >
                      {modality}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormDescription>
                Select the modalities that you want to see in your schedules.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="daysInPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days in-person</FormLabel>
              <FormControl>
                <ToggleGroup
                  className="flex flex-row"
                  type="multiple"
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  {DaysEnumSchema.options.map((day) => (
                    <ToggleGroupItem
                      key={day}
                      value={day}
                      className="border w-full"
                    >
                      {day}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormDescription>
                Which days are you available to take in-person?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
