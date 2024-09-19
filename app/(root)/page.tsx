import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string);
  const loggedIn: User = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  return (
    <section className="h-screen w-full flex">
      <div className="w-full px-5 sm:px-8 py-7 lg:py-12 flex flex-col gap-8 font-inter max-xl:overflow-y-scroll no-scrollbar">
        <HeaderBox isHome={true} title="Welcome, " subtext="Access & manage your account and transactions efficiently" user={loggedIn} />

        <TotalBalanceBox totalBanks={accounts.totalBanks} totalCurrentBalance={accounts.totalCurrentBalance} accounts={accounts.data} />

        <RecentTransactions accounts={accounts.data} appwriteItemId={appwriteItemId} page={currentPage} transactions={account?.transactions} />
      </div>

      <RightSidebar user={loggedIn} transactions={account?.transactions} banks={accountsData} />
    </section>
  );
};

export default Home;
