"use client";

import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { formatAmount, formUrlQuery } from "@/lib/utils";
import { SelectGroup } from "@radix-ui/react-select";
import { useRouter, useSearchParams } from "next/navigation";

const BankDropdown = ({ accounts, otherStyles, setValue }: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    const account = accounts.find((account) => account.appwriteItemId === id)!;

    setSelected(account);
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: id,
    });
    router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

  return (
    <Select defaultValue={selected.id} onValueChange={handleBankChange}>
      <SelectTrigger className={`flex w-full gap-3 ${otherStyles} bg-white`}>
        <Image src="/icons/credit-card.svg" height={20} width={20} alt="account" />
        <SelectValue className="text-sm font-semibold text-black-2" />
      </SelectTrigger>
      <SelectContent className={`w-full md:w-[300px] ${otherStyles} bg-white`} align="end">
        {/* {accounts.map((account) => {
            const isSelected = appwriteItemId === account.appwriteItemId;
          return (
            <SelectItem disabled={isSelected} className="hover:bg-bankGradient hover:bg-opacity-30 cursor-pointer" key={account.id} value={account.appwriteItemId}>
              {account.name}
            </SelectItem>
          );
        })} */}
        <SelectGroup>
          <SelectLabel className="py-2 font-normal text-gray-500">Select a bank to display</SelectLabel>
          {accounts.map((account: Account) => (
            <SelectItem key={account.id} value={account.appwriteItemId} className="cursor-pointer border-t">
              <div className="flex flex-col ">
                <p className="text-16 font-medium">{account.name}</p>
                <p className="text-14 font-medium text-blue-600">{formatAmount(account.currentBalance)}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
