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
  restriction: z.enum(["NONE", "FROSH", "RESTRICTED"]),
  modality: z.enum([
    "TENTATIVE",
    "HYBRID",
    "F2F",
    "ONLINE",
    "PREDOMINANTLY ONLINE",
  ]),
  remarks: z.string(),
});
