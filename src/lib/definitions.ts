import { tree } from "next/dist/build/templates/app-page";
import { number, z } from "zod";

export type DaysEnum = "M" | "T" | "W" | "H" | "F" | "S";

const ModalityEnum = z.enum([
  "HYBRID",
  "F2F",
  "ONLINE",
  "PREDOMINANTLY ONLINE",
  "TENTATIVE",
]);

export type ModalityEnum = z.infer<typeof ModalityEnum>;

export const scheduleSchema = z.object({
  day: z.enum(["M", "T", "W", "H", "F", "S", "U"]),
  start: z.number(),
  end: z.number(),
  date: z.string(),
  isOnline: z.boolean(),
});

export const classSchema = z.object({
  code: z.number(),
  course: z.string(),
  section: z.string(),
  professor: z.nullable(z.string()),
  schedules: z.array(scheduleSchema),
  enrolled: z.number(),
  enrollCap: z.number(),
  rooms: z.array(z.string()),
  restriction: z.string(),
  modality: ModalityEnum,
  remarks: z.string(),
});

export const classArraySchema = z.array(classSchema);

export const courseSchema = z.object({
  courseCode: z.string(),
  classes: classArraySchema,
  last_fetched: z.date(),
});

export const courseArraySchema = z.array(courseSchema);
export type Schedule = z.infer<typeof scheduleSchema>;
export type Class = z.infer<typeof classSchema>;
export type Course = z.infer<typeof courseSchema>;

export interface FilterOptions {
  start: number;
  end: number;
  maxPerDay: number;
  maxConsecutive: number;
  modalities: ModalityEnum[];
  daysInPerson: DaysEnum[];
}

export interface Filter {
  general: FilterOptions;
  specific: {
    M?: FilterOptions;
    T?: FilterOptions;
    W?: FilterOptions;
    H?: FilterOptions;
    F?: FilterOptions;
    S?: FilterOptions;
    U?: FilterOptions;
  };
}
