import MobileSidebar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import Image from "next/image";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return (
    <main className="flex max-md:flex-col gap-5">
      <Sidebar user={user} />
      <div className="flex size-full flex-col">
        <div className="flex justify-between items-center p-5  md:hidden">
          <Link href="/" className="flex items-center cursor-pointer gap-2">
            <Image src="/icons/logo.svg" alt="Horizon Logo" width={34} height={34} />
          </Link>
          <div>
            <MobileSidebar user={user} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
