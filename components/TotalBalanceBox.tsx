import React from "react";
import CountUpBox from "./CountUpBox";
import BankDoughnutChart from "./BankDoughnutChart";

const TotalBalanceBox = ({ accounts, totalBanks, totalCurrentBalance }: TotalBalanceBoxProps) => {
  return (
    <section className="border flex gap-6 border-gray-200 border-1 rounded-xl p-6 w-full shadow-chart">
      <div>
        <BankDoughnutChart accounts={accounts} />  
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="leading-6 text-base text-black font-semibold">Bank Accounts : {totalBanks}</h2>

        <h3 className="text-[14px] text-gray-600 font-medium leading-5">Total Current Balance</h3>
        <CountUpBox amount={totalCurrentBalance} />
      </div>
    </section>
  );
};

export default TotalBalanceBox;
