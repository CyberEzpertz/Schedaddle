import { tree } from "next/dist/build/templates/app-page";
import { number, z } from "zod";

export const DaysEnumSchema = z.enum(["M", "T", "W", "H", "F", "S"]);
export type DaysEnum = z.infer<typeof DaysEnumSchema>;

export const ModalityEnumSchema = z.enum([
  "HYBRID",
  "F2F",
  "ONLINE",
  "PREDOMINANTLY ONLINE",
  "TENTATIVE",
]);

export type ModalityEnum = z.infer<typeof ModalityEnumSchema>;

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
  professor: z.string(),
  schedules: z.array(scheduleSchema),
  enrolled: z.number(),
  enrollCap: z.number(),
  rooms: z.array(z.string()),
  restriction: z.string(),
  modality: ModalityEnumSchema,
  remarks: z.string(),
});

export const classArraySchema = z.array(classSchema);
export const class2DArraySchema = z.array(classArraySchema);

export const courseSchema = z.object({
  courseCode: z.string(),
  classes: classArraySchema,
  last_fetched: z.date(),
});

const filterOptionsSchema = z.object({
  start: z.number(),
  end: z.number(),
  maxPerDay: z.number(),
  maxConsecutive: z.number(),
  modalities: z.array(ModalityEnumSchema),
  daysInPerson: z.array(DaysEnumSchema),
});

const filterSchema = z.object({
  general: filterOptionsSchema,
  specific: z.object({
    M: filterOptionsSchema.optional(),
    T: filterOptionsSchema.optional(),
    W: filterOptionsSchema.optional(),
    H: filterOptionsSchema.optional(),
    F: filterOptionsSchema.optional(),
    S: filterOptionsSchema.optional(),
    U: filterOptionsSchema.optional(),
  }),
});

export const courseArraySchema = z.array(courseSchema);
export type Schedule = z.infer<typeof scheduleSchema>;
export type Class = z.infer<typeof classSchema>;
export type Course = z.infer<typeof courseSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
export type Filter = z.infer<typeof filterSchema>;
