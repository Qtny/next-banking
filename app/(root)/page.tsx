import HeaderBox from "@/components/HeaderBox";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import React from "react";

const Home = () => {
  const loggedIn: User = { firstName: "Qtny", lastName: "Terry", email: "qtny.dev@gmail.com" };
  return (
    <section className="h-screen w-full flex">
      <div className="w-full px-5 sm:px-8 py-7 lg:py-12 flex flex-col gap-8 font-inter max-xl:overflow-y-scroll no-scrollbar">
        <HeaderBox isHome={true} title="Welcome, " subtext="Access & manage your account and transactions efficiently" user={loggedIn} />

        <TotalBalanceBox bankCount={3} amount={1250.35} banks={[]} />
      </div>
      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[{ type: "mastercard" }, {}]}
      />
    </section>
  );
};

export default Home;
