"use client";

import { decryptId, paymentFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import BankDropdown from "./BankDropdown";
import CustomPaymentInput from "./CustomPaymentInput";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { createTransfer } from "@/lib/actions/dwolla.actions";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/actions/transaction.actions";

const PaymentForm = ({ accounts }: PaymentTransferFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  // form data
  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      email: "",
      name: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentFormSchema>) => {
    setIsLoading(true);
    try {
      // decrypt sharable id
      const receiverAccountId = decryptId(values.sharableId);

      // get bank account by id
      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });

      // get bank
      const senderBank = await getBank({ documentId: values.senderBank });

      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: values.amount,
      };

      // create transfer
      const transfer = await createTransfer(transferParams);

      // create transfer transaction
      if (transfer) {
        const transaction = {
          name: values.name === "" ? "" : values.name ?? "",
          amount: values.amount,
          senderId: senderBank.userId.$id,
          senderBankId: senderBank.$id,
          receiverId: receiverBank.userId.$id,
          receiverBankId: receiverBank.$id,
          email: values.email,
        };

        // create transaction
        const newTransaction = await createTransaction(transaction);

        // reset form and push to home is successful
        if (newTransaction) {
          form.reset();
          router.push("/");
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectBankSource = () => {
    return (
      <div className="py-6">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="flex max-md:flex-col max-md:gap-2 gap-8 w-full">
              <div className="w-full max-w-[280px]">
                <FormLabel>Select Your Bank Source</FormLabel>
                <FormDescription className="font-normal text-xs text-gray-600">Select the bank account you want to transfer funds from</FormDescription>
              </div>
              <div className="flex flex-col w-full gap-2">
                <FormControl>
                  <BankDropdown accounts={accounts} setValue={form.setValue} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </div>
            </FormItem>
          )}
        ></FormField>
      </div>
    );
  };

  const transferNote = () => {
    return (
      <div className="py-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex max-md:flex-col max-md:gap-2 gap-8 w-full">
                <div className="w-full max-w-[280px]">
                  <FormLabel>Transfer Note (Optional)</FormLabel>
                  <FormDescription className="font-normal text-xs text-gray-600">Please provide any additional information or instruction related to the transfer</FormDescription>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <FormControl>
                    <Textarea placeholder="Example: This is a fund transfer for you" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        ></FormField>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[850px] pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="divide-solid divide-gray-200 divide-y flex flex-col w-full gap-6">
          <div className="space-y-1">
            <h2 className="font-semibold text-lg text-gray-900">Transfer details</h2>
            <p className="font-normal text-sm text-gray-600">Enter the details of the recipient</p>
          </div>

          {selectBankSource()}
          {transferNote()}

          <div className="space-y-1 pt-6">
            <h2 className="font-semibold text-lg text-gray-900">Bank account details</h2>
            <p className="font-normal text-sm text-gray-600">Enter the bank account details of the recipient</p>
          </div>

          <CustomPaymentInput control={form.control} label="Recipient's Email Address" name="email" placeholder="Enter your email address" />
          <CustomPaymentInput control={form.control} label="Recipient's  Bank Account Number" name="sharableId" placeholder="Enter your sharable ID" />
          <CustomPaymentInput control={form.control} label="Amount" name="amount" placeholder="400.00" />

          <Button type="submit" className="bg-bank-gradient hover:opacity-80 text-white w-full" disabled={isLoading}>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Transfer Fund"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
