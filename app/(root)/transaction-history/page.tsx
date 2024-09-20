import BankDropdown from "@/components/BankDropdown";
import HeaderBox from "@/components/HeaderBox";
import { Pagination } from "@/components/Pagination";
import TransactionsTable from "@/components/TransactionsTable";
import { NUMBER_PER_PAGE } from "@/constants";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn: User = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id });

  if (!accounts) return;

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  const account = await getAccount({ appwriteItemId });

  const totalPages = Math.ceil(account.transactions.length / NUMBER_PER_PAGE);

  const endIndex = currentPage * NUMBER_PER_PAGE;
  const startIndex = endIndex - NUMBER_PER_PAGE;

  const slicedTransactions = account.transactions.slice(startIndex, endIndex);

  // console.log("Total pages => ", totalPages);
  // console.log(`From items ${startIndex} to ${endIndex}`);
  // console.log("Projected transactions => ", slicedTransactions);

  return (
    <section className="flex flex-col gap-8 py-12 px-8 h-screen w-full">
      <div className="flex justify-between">
        <HeaderBox isHome={false} title="Transaction History" subtext="Gain Insights and Track Your Transactions Over Time" user={loggedIn} />
        {/* Come back for Bank Dropdown */}
        <BankDropdown accounts={accountsData} otherStyles="md:w-[300px]" />
      </div>

      <div className="flex justify-between items-center p-6 rounded-xl text-white bg-bankGradient w-full h-fit">
        <div className="space-y-4 max-xl:space-y-2">
          <h1 className="font-bold text-2xl max-xl:text-lg">{account?.data.name}</h1>
          <p className="text-sm font-normal max-xl:text-xs">{account?.data.officialName}</p>
          <h1 className="text-sm font-normal max-xl:text-xs tracking-[1.1px]">
            ●●●● ●●●● ●●●● <span>{account?.data.mask}</span>
          </h1>
        </div>

        <div className="flex flex-col items-start p-4 bg-white bg-opacity-30 rounded-lg">
          <p className="font-medium text-sm max-xl:text-xs">Current Balance</p>
          <h1 className="font-semibold text-2xl max-xl:text-lg">{formatAmount(account?.data.currentBalance)}</h1>
        </div>
      </div>

      <TransactionsTable transactions={slicedTransactions as Transaction[]} />

      {totalPages > 1 && <Pagination page={currentPage} totalPages={totalPages} />}
    </section>
  );
};

export default TransactionHistory;
