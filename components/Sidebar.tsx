"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer";

const Sidebar = ({ user }: { user: User }) => {
  const pathname = usePathname();

  return (
    <section className="flex 2xl:w-[355px] flex-col pt-8 w-fit h-screen border-r border-gray-200 bg-white sm:p-4 xl:p-6 max-md:hidden">
      <nav className="flex flex-col gap-2 items-center md:items-start h-full">
        <Link href="/" className="flex mb-12 items-center cursor-pointer gap-2">
          <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34} />
          <p className="font-bold font-ibm-plex-serif text-[28px] leading-[34px] 2xl:text-26 text-black-1 max-xl:hidden">Horizon</p>
        </Link>

        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex flex-col gap-2">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
              return (
                <Link href={item.route} key={item.label} className={cn("flex w-full rounded-md px-4 py-4", { "bg-bankGradient": isActive })}>
                  <div className="flex gap-2 max-xl:size-6">
                    <Image src={item.imgURL} alt={item.label} width={24} height={24} className={cn({ "brightness-[3] invert-0": isActive })} />
                    <p className={cn("text-base leading-6 text-black-2 font-semibold max-xl:hidden", { "!text-white": isActive })}>{item.label}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <Footer user={user} />
        </div>
      </nav>
    </section>
  );
};

export default Sidebar;
