"use client";

import Image from "next/image";
import React from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MobileSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="bg-white w-full max-w-[264px] xl:hidden">
      <Sheet>
        <SheetTrigger>
          <Image src="/icons/hamburger.svg" alt="hamburger menu" width={30} height={30} className="cursor-pointer" />
        </SheetTrigger>
        <SheetContent className="bg-white" side={"left"}>
          <Link href="/" className="flex mb-12 items-center cursor-pointer gap-2">
            <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34} />
            <p className="font-bold font-ibm-plex-serif text-[28px] leading-[34px] 2xl:text-26 text-black-1">Horizon</p>
          </Link>

          <SheetClose asChild>
            <nav>
              {sidebarLinks.map((item) => {
                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                return (
                  <SheetClose asChild key={item.label}>
                    <Link href={item.route} className={cn("flex w-full rounded-md px-4 py-4", { "bg-bankGradient": isActive })}>
                      <div className="flex gap-2">
                        <Image src={item.imgURL} alt={item.label} width={24} height={24} className={cn({ "brightness-[3] invert-0": isActive })} />
                        <p className={cn("text-base leading-6 text-black-2 font-semibold", { "!text-white": isActive })}>{item.label}</p>
                      </div>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetClose>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileSidebar;
