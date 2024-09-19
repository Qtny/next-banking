"use client";

import React from "react";
import { cn, formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const BankTabItem = ({ account, appwriteItemId }: BankTabItemProps) => {
  const isActive = appwriteItemId === account.appwriteItemId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div onClick={handleBankChange} className={cn("border-b-[3px] border-white", { "border-bankGradient": isActive })}>
      <p
        className={cn("font-semibold text-base text-gray-500 pb-2", {
          "text-bankGradient": isActive,
        })}
      >
        {account.name}
      </p>
    </div>
  );
};

export default BankTabItem;
