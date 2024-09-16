import { logOutAccount } from "@/lib/actions/user.actions";
import Image from "next/image";
import React from "react";

const Footer = ({ user }: { user: User }) => {
  const handleLogout = async () => {
    await logOutAccount();
  };

  return (
    <div className="flex md:flex-col md:justify-center md:items-center md:gap-6 md:pb-4 xl:flex-row justify-between w-full border-t border-gray-200 pt-8 gap-2">
      <div className="flex gap-3">
        <div className="rounded-full size-[40px] bg-gray-500 flex justify-center items-center font-bold text-xl shadow-profile text-white font-ibm-plex-serif">{user.name[0]}</div>

        <div className="flex md:hidden xl:flex flex-col justify-between items-start">
          <h1 className="font-semibold text-sm text-gray-700">{user.name}</h1>
          <p className="font-normal text-sm text-gray-600 text-ellipsis whitespace-nowrap">{user.email}</p>
        </div>
      </div>

      <Image src="/icons/logout.svg" alt="log out button" width={20} height={20} className="cursor-pointer" onClick={handleLogout} />
    </div>
  );
};

export default Footer;
