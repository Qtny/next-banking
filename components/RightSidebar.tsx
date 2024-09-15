import Image from "next/image";
import Link from "next/link";
import React from "react";
import BankCard from "./BankCard";

const RightSidebar = ({ user, transactions, banks }: { user: User; transactions: Transaction[]; banks: Bank[] }) => {
  return (
    <aside className="h-screen gap-8 xl:flex hidden flex-col w-[500px] border-l border-[1px] border-gray-200">
      {/* Profile */}
      <section>
        <div className="h-[120px] w-full bg-gradient-mesh bg-no-repeat bg-cover" />
        <div className="px-6">
          <div className="rounded-full size-[96px] border-white border-[4px] bg-gray-500 relative -top-8 flex justify-center items-center font-bold text-3xl shadow-profile text-white font-ibm-plex-serif">
            {user?.name[0]}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold text-2xl text-gray-900">
              {user?.name}
            </h1>
            <h2 className="font-normal text-base text-gray-600">{user?.email}</h2>
          </div>
        </div>
      </section>

      {/* Banks */}
      <section className="w-full px-6 gap-6 flex flex-col">
        <div className="flex justify-between">
          <h2 className="font-semibold text-lg">My Banks</h2>
          <Link href="/" className="flex gap-3 justify-center items-center">
            <Image src="/icons/plus.svg" alt="plus symbol" width={20} height={20} />
            <span className="text-sm text-gray-600 font-semibold">Add Bank</span>
          </Link>
        </div>

        {/* maximum of 2 cards shown */}
        <div className="relative w-full">
          <div className="relative z-50 w-[90%]">
            <BankCard account={banks[0]} showBalance={false} userName="Qtwnt" />
          </div>
          <div className="absolute -bottom-6 right-0 w-[90%]">{banks[1] && <BankCard account={banks[1]} showBalance={false} userName="Heyka" />}</div>
        </div>
      </section>
    </aside>
  );
};

export default RightSidebar;
