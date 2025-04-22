"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const serializeTransaction = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
};

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }
        await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false },
        });

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });
        revalidatePath('/dashboard');
        return { success: true, data: serializeTransaction(account) };
    } catch (error) {
        console.error("Error updating default account:", error);
        return { success: false, error: error.message };
    }
}

export async function getAccountWithTransactions(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const account = await db.account.findUnique({
            where: { id: accountId, userId: user.id },
            include: {
                transactions: {
                    orderBy: { date: "desc" },
                },
                _count: {
                    select: { transactions: true },
                },
            },
        });

        if (!account) return null;


        return {
            ...serializeTransaction(account),
            transactions: account.transactions.map(serializeTransaction)
        };

    } catch (error) {
        console.error("Failed to get account with transactions:", error);
    }
}

export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id
            }
        });

        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const amount = Number(transaction.amount);
            const change = transaction.type === 'EXPENSE' ? amount : -amount;
            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {})

        //Delete transactions and update account balances in a transaction
        await db.$transaction(async (tx) => {
            //Delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id
                },
            });

            for (const [accountId, balanceChange] of Object.entries(accountBalanceChanges)) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange
                        },
                    },
                });
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

        return { success: true };

    } catch (error) {
        console.error('Failed to bulk delete transactions:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Make sure this account belongs to the user
        const account = await db.account.findUnique({
            where: {
                id: accountId,
            },
        });

        if (!account || account.userId !== user.id) {
            throw new Error("Account not found or access denied");
        }

        // Delete transactions first, then the account (in a transaction)
        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: {
                    accountId: accountId,
                    userId: user.id,
                },
            });

            await tx.account.delete({
                where: {
                    id: accountId,
                    userId: user.id,
                },
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

        return { success: true };
    } catch (error) {
        console.error("Error deleting account:", error);
        return { success: false, error: error.message };
    }
}

