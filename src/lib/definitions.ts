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

const filterOptionsSchema = z
  .object({
    enabled: z.boolean(),
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

export const filterSchema = z.object({
  general: filterOptionsSchema,
  specific: z.object({
    M: filterOptionsSchema,
    T: filterOptionsSchema,
    W: filterOptionsSchema,
    H: filterOptionsSchema,
    F: filterOptionsSchema,
    S: filterOptionsSchema,
  }),
});

export const courseArraySchema = z.array(courseSchema);
export type Schedule = z.infer<typeof scheduleSchema>;
export type Class = z.infer<typeof classSchema>;
export type Course = z.infer<typeof courseSchema>;
export type FilterOptions = z.infer<typeof filterOptionsSchema>;
export type Filter = z.infer<typeof filterSchema>;
