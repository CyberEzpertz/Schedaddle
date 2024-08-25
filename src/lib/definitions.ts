import { z } from "zod";

export const scheduleSchema = z.object({
  day: z.enum(["M", "T", "W", "H", "F", "S"]),
  start: z.number(),
  end: z.number(),
  date: z.string(),
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
  modality: z.string(),
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
export type course = z.infer<typeof courseArraySchema>;
