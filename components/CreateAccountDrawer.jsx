"use client";

import { useState, useEffect } from "react";
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema } from "@/app/lib/schema";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import useFetch from "@/hooks/useFetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreateAccountDrawer = ({ children }) => {

    const [open, setOpen] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "",
            balance: "0",
            isDefault: false,
        },
    });

    const { data: newAccount, error, fn: createAccountFn, loading: createAccountLoading } = useFetch(createAccount);

    useEffect(() => {
        if (newAccount && !createAccountLoading) {
            toast.success("Account created successfully!");
            reset();
            setOpen(false);
        }
    }, [createAccountLoading, newAccount])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account.");
        }
    }, [error])

    const onSubmit = async (data) => {
        await createAccountFn(data);
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle className='gradient-text-small'>Create New Account</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 pb-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-main">Account Name</label>
                            <Input id='name' placeholder='ex: Main Checking' className='text-subtext bg-background text-[14px] leading-[20px]' {...register("name")} />
                            {errors.name && (<p className="text-sm text-red-500">{errors.name.message}</p>)}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium text-main">Account Type</label>
                            <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                                <SelectTrigger id='type' className='text-subtext'>
                                    <SelectValue placeholder="Select Account Type" />
                                </SelectTrigger>
                                <SelectContent className='text-main bg-background_secondary'>
                                    <SelectItem value="CURRENT" className='cursor-pointer hover:bg-main hover:text-background'>CURRENT</SelectItem>
                                    <SelectItem value="SAVINGS" className='cursor-pointer hover:bg-main hover:text-background'>SAVINGS</SelectItem>
                                    <SelectItem value="CREDIT" className='cursor-pointer hover:bg-main hover:text-background'>CREDIT</SelectItem>
                                    <SelectItem value="LOAN" className='cursor-pointer hover:bg-main hover:text-background'>LOAN</SelectItem>
                                    <SelectItem value="INVESTMENT" className='cursor-pointer hover:bg-main hover:text-background'>INVESTMENT</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (<p className="text-sm text-red-500">{errors.type.message}</p>)}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="balance" className="text-sm font-medium text-main">Initial Balance</label>
                            <Input id='balance' type='number' step='any' min={0} placeholder='0.00' className='text-subtext bg-background text-[14px] leading-[20px]' {...register("balance")} />
                            {errors.balance && (<p className="text-sm text-red-500">{errors.balance.message}</p>)}
                        </div>
                        <div className="space-y-2 flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <label htmlFor="isDefault" className="text-sm font-medium text-main cursor-pointer">Set as Default</label>
                                <p className="text-subtext text-sm">This account will be selected by default for transactions.</p>
                            </div>
                            <Switch id='isDefault' onCheckedChange={(checked) => setValue("isDefault", checked)} checked={watch("isDefault")} />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <DrawerClose asChild>
                                <Button type='button' variant='outline' className='flex-1 text-main border-util_color hover:bg-main hover:text-background hover:border-background'>Cancel</Button>
                            </DrawerClose>
                            <Button type='submit' variant='outline' className='flex-1 text-main border-util_color hover:bg-main hover:text-background hover:border-background' disabled={createAccountLoading}>{createAccountLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>) : ("Create Account")}</Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer