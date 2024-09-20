import { formatAmount } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const BankCard = ({ account, userName, showBalance }: { account: Account; userName: string; showBalance: boolean }) => {
  return (
    <Link href={`/transaction-history?id=${account.appwriteItemId}`} className=" max-w-[320px] flex relative">
      <div className={`h-[190px] w-[70%] ${account.type === "mastercard" ? "bg-gray-700" : "bg-bank-gradient"} rounded-l-xl p-4 pb-3 flex flex-col justify-between`}>
        <div>
          <h1 className="font-semibold text-base text-white">{account.name || userName}</h1>
          {showBalance && <p className="font-ibm-plex-serif font-black text-white">{formatAmount(account.currentBalance)}</p>}
        </div>
        <div className="flex flex-col text-white font-semibold gap-1">
          <div className="justify-between flex text-xs ">
            <h1>{userName}</h1>
            <h1>●●/●●</h1>
          </div>
          <h1 className="text-base tracking-[1.1px]">
            ●●●● ●●●● ●●●● <span>{account.mask}</span>
          </h1>
        </div>
      </div>
      <div
        className={`flex-1 size-full h-[190px] rounded-r-xl flex flex-col justify-between items-end p-4 ${
          account.type === "mastercard" ? "bg-gradient-mesh bg-top object-fill bg-cover" : "bg-bank-gradient"
        }`}
      >
        <Image src="/icons/Paypass.svg" width={20} height={20} alt="" />
        <Image src={account.type === "mastercard" ? "/icons/mastercard.svg" : "/icons/visa.svg"} width={45} height={45} alt="" />
      </div>
    </Link>
  );
};

export default BankCard;
