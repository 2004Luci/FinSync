"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, Trash, X } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { deleteBudget, updateBudget } from "@/actions/budget";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import ConfirmModal from "@/components/ConfirmModal";

const BudgetProgress = ({ initialBudget, currentExpenses }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [budget, setBudget] = useState(initialBudget);
    const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const percentUsed = budget ? (currentExpenses / budget.amount) * 100 : 0;

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error: updateError,
    } = useFetch(updateBudget);

    const {
        loading: isDeleting,
        fn: deleteBudgetFn,
        data: deleteResponse,
        error: deleteError,
    } = useFetch(deleteBudget);

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget);

        if (isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        await updateBudgetFn(amount);
    };

    const handleCancel = () => {
        setNewBudget(budget?.amount?.toString() || "");
        setIsEditing(false);
    };

    const clickDeleteBudget = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        await deleteBudgetFn();
        setIsModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (updatedBudget?.success) {
            setIsEditing(false);
            setBudget(updatedBudget.data);
            setNewBudget(updatedBudget.data.amount.toString());
            toast.success("Budget updated successfully");
        }
    }, [updatedBudget]);

    useEffect(() => {
        if (updateError) {
            toast.error(updateError.message || "Failed to update budget");
        }
    }, [updateError]);

    useEffect(() => {
        if (deleteResponse?.success) {
            toast.success("Budget deleted successfully");
            setBudget(null);
            setNewBudget("");
            setIsEditing(false);
        }
    }, [deleteResponse]);

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError.message || "Failed to delete budget");
        }
    }, [deleteError]);

    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete budget?"
            />
            <Card className="bg-background_secondary border-util_color">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-main/80">
                    <div className="flex-1">
                        <CardTitle>Monthly Budget (Default Account)</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-32"
                                        placeholder="Enter amount"
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleUpdateBudget}
                                        disabled={isLoading}
                                    >
                                        <Check className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-full flex items-center">
                                        <div className="flex items-center gap-2">
                                            <CardDescription className="text-subtext">
                                                {budget
                                                    ? `₹${currentExpenses.toFixed(2)} of ₹${budget.amount.toFixed(2)} spent`
                                                    : "No budget set"}
                                            </CardDescription>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setIsEditing(true)}
                                                className="h-6 w-6"
                                            >
                                                <Pencil className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex-grow" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={clickDeleteBudget}
                                            className="h-6 w-6"
                                            disabled={isDeleting}
                                        >
                                            <Trash className="h-3 w-3 text-red-500" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {budget && (
                        <div className="space-y-2">
                            <Progress
                                value={percentUsed}
                                extraStyles={`${percentUsed >= 90
                                    ? "bg-red-500"
                                    : percentUsed >= 75
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                            />
                            <p className="text-xs text-right text-subtext">
                                {percentUsed.toFixed(2)}% used
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default BudgetProgress;
