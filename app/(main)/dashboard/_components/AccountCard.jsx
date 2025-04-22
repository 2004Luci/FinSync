"use client";

import { deleteAccount, updateDefaultAccount } from "@/actions/accounts";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/useFetch";
import { ArrowUpRight, ArrowDownRight, Trash } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import ConfirmModal from "@/components/ConfirmModal";

const AccountCard = ({ account }) => {

    const { name, type, balance, id, isDefault } = account;
    const { loading: updateDefaultLoading, error, fn: updateDefaultFn, data: updatedAccount } = useFetch(updateDefaultAccount);
    const { loading: isDeleting, error: deleteError, fn: deleteAccountFn, data: deletedAccount } = useFetch(deleteAccount);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDefaultChange = async (event) => {
        event.preventDefault();

        if (isDefault) {
            toast.warning("You need at least one default account.");
            return; // Don't allow toggling off the default account 
        }
        await updateDefaultFn(id);
    };

    useEffect(() => {
        if (updatedAccount?.success) {
            toast.success("Default account updated successfully.");
        }
    }, [updatedAccount, updateDefaultLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update default account.");
        }
    }, [error]);

    const clickDeleteAccount = () => {
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async (accountId) => {
        await deleteAccountFn(accountId);
        setIsModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (deletedAccount?.success) {
            toast.success("Account deleted successfully");
        }
    }, [deletedAccount]);

    useEffect(() => {
        if (deleteError) {
            toast.error(deleteError.message || "Failed to delete account");
        }
    }, [deleteError]);


    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={handleCancelDelete}
                onConfirm={() => handleConfirmDelete(id)}
                message="Are you sure you want to delete this account?"
            />
            <Card className='hover:shadow-md transition-shadow group relative bg-background_secondary border-util_color'>
                <Link href={`/account/${id}`}>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                        <CardTitle className='text-sm font-medium capitalize text-main'>{name}</CardTitle>
                        <Switch checked={isDefault} onClick={handleDefaultChange} disabled={updateDefaultLoading} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-[24px] font-bold gradient-text-normal leading-[32px] mt-1 pb-1">
                            ₹{parseFloat(balance).toFixed(2)}
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <p className="text-xs text-subtext">
                                {type} Account
                            </p>
                            <Button variant="ghost" size="icon" className="h-6 w-6" disabled={isDeleting} onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                clickDeleteAccount();
                            }}>
                                <Trash className="h-3 w-3 text-red-500" />
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between text-sm text-subtext'>
                        <div className="flex items-center">
                            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                            Income
                        </div>
                        <div className="flex items-center">
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                            Expense
                        </div>
                    </CardFooter>
                </Link>
            </Card>
        </>);
};

export default AccountCard