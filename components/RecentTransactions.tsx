"use-client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import BankInfo from "./BankInfo";
import TransactionsTable from "./TransactionsTable";
import BankTabItem from "./BankTabItem";
import { Pagination } from "./Pagination";
import { NUMBER_PER_PAGE } from "@/constants";

const RecentTransactions = ({ accounts, appwriteItemId, page = 1, transactions }: RecentTransactionsProps) => {
  const totalPages = Math.ceil(transactions.length / NUMBER_PER_PAGE);

  const endIndex = page * NUMBER_PER_PAGE;
  const startIndex = endIndex - NUMBER_PER_PAGE;

  const slicedTransactions = transactions.slice(startIndex, endIndex);

  return (
    <section className="flex flex-col gap-[30px] pb-5">
      <div className="flex gap-5 justify-between items-center">
        <h1 className="font-semibold text-gray-900 text-2xl">Recent transactions</h1>
        <Link href={`/transaction-history?id=${appwriteItemId}`} className="border-[1px] border-gray-300 rounded-md px-4 py-2 shadow-md font-semibold text-base">
          View all
        </Link>
      </div>

      <Tabs defaultValue={appwriteItemId}>
        <TabsList>
          {accounts.map((a) => {
            return (
              <TabsTrigger value={a.appwriteItemId} key={a.id}>
                <BankTabItem key={a.id} account={a} appwriteItemId={appwriteItemId} />
              </TabsTrigger>
            );
          })}
        </TabsList>
        {accounts.map((account: Account) => (
          <TabsContent key={account.id} className="space-y-5" value={account.appwriteItemId}>
            <div className="flex flex-col gap-[20px]">
              <BankInfo account={account} type={"full"} appwriteItemId={account.appwriteItemId} />
            </div>

            <TransactionsTable transactions={slicedTransactions} />

            {totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
