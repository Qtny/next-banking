import HeaderBox from "@/components/HeaderBox";
import PaymentForm from "@/components/PaymentForm";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const PaymentTransfer = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string);
  const loggedIn: User = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="flex flex-col gap-8 py-12 px-8 h-screen w-full">
      <HeaderBox isHome={false} title="Payment Transfer" subtext="Please provide any specific details or notes related to the payment transfer" user={loggedIn} />

      <PaymentForm accounts={accountsData} />
    </section>
  );
};

export default PaymentTransfer;
