"use client";

import ReceiptScanner from "./ReceiptScanner";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";


const AddTransactionForm = ({ accounts, categories, editMode = false, initialData = null }) => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const { register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      (editMode && initialData) ? {
        type: initialData.type,
        amount: initialData.amount.toString(),
        description: initialData.description,
        accountId: initialData.accountId,
        category: initialData.category,
        date: new Date(initialData.date),
        isRecurring: initialData.isRecurring,
        ...(initialData.recurringInterval && {
          recurringInterval: initialData.recurringInterval
        })
      }
        : {
          type: "EXPENSE",
          amount: "",
          description: "",
          accountId: accounts.find((ac) => ac.isDefault)?.id,
          date: new Date(),
          isRecurring: false,
        }
  });

  const { loading: transactionLoading, fn: transactionFn, data: transactionResult } = useFetch(editMode ? updateTransaction : createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount)
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading, editMode]);

  const filteredCategories = categories.filter((category) => category.type === type);

  const handleScanComplete = (scannedData) => {
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
    }
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
      {/* AI Receipt Scanner */}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      <div className="space-y-2">
        <label className="text-sm font-medium text-main">Type</label>
        <Select onValueChange={(value) => setValue("type", value)} defaultValue={type} >
          <SelectTrigger className='text-subtext'>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent className='text-main bg-background_secondary '>
            <SelectItem value='EXPENSE' className='cursor-pointer hover:bg-main hover:text-background'>Expense</SelectItem>
            <SelectItem value='INCOME' className='cursor-pointer hover:bg-main hover:text-background'>Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (<p className="text-sm text-red-500">{errors.type.message}</p>)}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-main">Amount</label>
          <Input type='number' step='any' min={0} className='text-subtext bg-background text-[14px] leading-[20px]' placeholder='0.00' {...register("amount")} />
          {errors.amount && (<p className="text-sm text-red-500">{errors.amount.message}</p>)}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-main">Account</label>
          <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")} >
            <SelectTrigger className='text-subtext'>
              <SelectValue placeholder='Select account' />
            </SelectTrigger>
            <SelectContent className='text-main bg-background_secondary'>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className='cursor-pointer hover:bg-main hover:text-background'>
                  {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <div className="w-full h-1 bg-background"></div>
              <CreateAccountDrawer>
                <Button variant='ghost' className='w-full select-none items-center text-sm outline-none hover:bg-main hover:text-background'>Create Account</Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (<p className="text-sm text-red-500">{errors.accountId.message}</p>)}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-main">Category</label>
        <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
          <SelectTrigger className='text-subtext'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent className='text-main bg-background_secondary'>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id} className='cursor-pointer hover:bg-main hover:text-background'>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (<p className="text-sm text-red-500">{errors.category.message}</p>)}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-main">Date</label>
        <Popover>
          <PopoverTrigger asChild className="text-subtext ">
            <Button variant='outline' className='w-full pl-3 text-left font-normal hover:bg-background hover:text-subtext hover:border hover:border-subtext'>
              {date ? format(date, "PPP") : <span className="text-subtext">Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 text-main opacity-80" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar mode='single' selected={date} onSelect={(date) => setValue("date", date)} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus className='bg-background_secondary' />
          </PopoverContent>
        </Popover>
        {errors.date && (<p className="text-sm text-red-500">{errors.date.message}</p>)}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-main">Description</label>
        <Input className='text-subtext bg-background text-[14px] leading-[20px]' placeholder='Enter description' {...register("description")} />
        {errors.description && (<p className="text-sm text-red-500">{errors.description.message}</p>)}
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <label className="text-sm font-medium text-main cursor-pointer">
            Recurring Transaction
          </label>
          <p className="text-sm text-subtext">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Switch checked={isRecurring} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
      </div>
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-main">Recurring Interval</label>
          <Select onValueChange={(value) => setValue("recurringInterval", value)} defaultValue={getValues("recurringInterval")}>
            <SelectTrigger className='text-subtext'>
              <SelectValue placeholder='Select interval' />
            </SelectTrigger>
            <SelectContent className='text-main bg-background_secondary'>
              <SelectItem value='DAILY' className='cursor-pointer hover:bg-main hover:text-background'>Daily</SelectItem>
              <SelectItem value='WEEKLY' className='cursor-pointer hover:bg-main hover:text-background'>Weekly</SelectItem>
              <SelectItem value='MONTHLY' className='cursor-pointer hover:bg-main hover:text-background'>Monthly</SelectItem>
              <SelectItem value='YEARLY' className='cursor-pointer hover:bg-main hover:text-background'>Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (<p className="text-sm text-red-500">{errors.recurringInterval.message}</p>)}
        </div>
      )}
      <div className="flex gap-4">
        <Button type='button' variant='outline' className='w-full text-main border-util_color hover:bg-main hover:text-background hover:border-background' onClick={() => router.back()}>Cancel</Button>
        <Button type='submit' variant='outline' className='w-full  text-main border-util_color hover:bg-main hover:text-background hover:border-background' disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? ("Update Transaction") : ("Create Transaction")}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm


