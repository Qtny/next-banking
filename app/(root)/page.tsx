import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import React from "react";

const Home = () => {
  const loggedIn = { firstName: "Qtny", lastName: "Terry" };
  return (
    <div className="h-screen w-full px-5 sm:px-8 py-7 lg:py-12 flex flex-col gap-8 font-inter max-xl:overflow-y-scroll no-scrollbar">
      <HeaderBox isHome={true} title="Welcome, " subtext="Access & manage your account and transactions efficiently" user={loggedIn} />

      <TotalBalanceBox bankCount={3} amount={1250.35} banks={[]} />
    </div>
  );
};

export default Home;
