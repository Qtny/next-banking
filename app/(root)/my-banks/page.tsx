import BankCard from "@/components/BankCard";
import HeaderBox from "@/components/HeaderBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { Progress } from "@/components/ui/progress";
import React from "react";
import Copy from "@/components/Copy";

const MyBanks = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string);
  const loggedIn: User = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  return (
    <section className="flex flex-col gap-8 py-12 px-8 w-full h-screen">
      <HeaderBox isHome={false} title="My Bank Accounts" subtext="Effortlessly Manage Your Banking Activities" user={loggedIn} />

      <div className="space-y-5 w-full">
        <h2 className="font-semibold text-base">Your Cards</h2>

        <div className="flex flex-wrap gap-10">
          {accountsData.map((account: Account) => {
            return (
              <div key={account.id} className="flex flex-col gap-4">
                <BankCard account={account} showBalance={false} userName={`${loggedIn.firstName} ${loggedIn.lastName}`} />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Spending this month</p>
                    <p className="text-sm font-normal">$ 1000.00</p>
                  </div>

                  <div className="w-full">
                    <Progress value={33} indicatorColor="bg-bankGradient" max={100} className="bg-gray-200" />
                  </div>
                </div>

                <Copy title={account.sharableId} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
