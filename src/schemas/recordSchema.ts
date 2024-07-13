import { z } from "zod"

export const recordSchema = z.object({
    text: z.string().optional(),
    rating: z.number().optional(),
    formId: z.string().uuid({ message: "Invalid recordId" })
}) 