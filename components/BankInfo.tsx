import React from "react";
import { cn, formatAmount, getAccountTypeColors } from "@/lib/utils";

const BankInfo = ({ account, type, appwriteItemId }: BankInfoProps) => {
  const isActive = appwriteItemId === account.appwriteItemId;
  const colors = getAccountTypeColors(account.type as AccountTypes);
  return (
    <div
      className={cn(`flex gap-4 px-6 py-5 rounded-lg w-full ${colors.bg}`, {
        "shadow-sm border-blue-700": type === "card" && isActive,
        "rounded-xl": type === "card",
        "hover:shadow-sm cursor-pointer": type === "card",
      })}
    >
      <div className="flex size-[40px] bg-blue-600 rounded-full text-white justify-center items-center font-medium text-2xl">{account.officialName[0]}</div>

      <div className="flex flex-col gap-[7px] w-full">
        <div className="flex justify-between w-full">
          <h1 className={`${colors.title} font-semibold text-2xl line-clamp-1`}>{account.name}</h1>
          {type === "full" && <p className={`rounded-full text-sm font-medium ${colors.subText} ${colors.lightBg} px-3 py-1`}>{account.subtype}</p>}{" "}
        </div>
        <h4 className="text-bankGradient text-lg font-semibold">{formatAmount(account.availableBalance)}</h4>
      </div>
    </div>
  );
};

export default BankInfo;
