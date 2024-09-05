"use client";

import React from "react";
import CountUp from "react-countup";

const CountUpBox = ({ amount }: { amount: number }) => {
  return (
    <p className="text-[30px] leading-[38px] text-gray-900 font-semibold">
      <CountUp duration={1.5} decimals={2} decimal="," prefix="$" start={0} end={amount} />
    </p>
  );
};

export default CountUpBox;
