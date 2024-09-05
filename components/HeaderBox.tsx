import React from "react";

const HeaderBox = ({ title, subtext, isHome, user }: { title: string; subtext: string; isHome: boolean; user: { firstName: string; lastName: string } }) => {
  return (
    <section>
      <h1 className="text-[30px] font-semibold">
        {title}
        {isHome && <span className="text-bankGradient">{user?.firstName || "Guest"}</span>}
      </h1>
      <p className="font-normal text-gray-600 text-base">{subtext}</p>
    </section>
  );
};

export default HeaderBox;
