import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(2, { message: "Name is required" }),
    type: z.enum(["CURRENT", "SAVINGS", "CREDIT", "LOAN", "INVESTMENT"], { message: "Account type is required" }),
    balance: z.string().min(1, { message: "Initial balance is required" }),
    isDefault: z.boolean().default(false),
})

export const transactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"], { message: "Transaction type is required" }),
    amount: z.string().min(1, { message: "Amount is required" }),
    description: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    accountId: z.string().min(1, { message: "Account is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional()
}).superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring interval is required for recurring transactions",
            path: ["recurringInterval"]
        });
    }
})
