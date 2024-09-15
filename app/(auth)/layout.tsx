import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex justify-between w-screen">
      {children}
      <div className="bg-sky-1 flex w-1/2 h-screen">
        <Image src="/icons/auth-image.svg" alt="auth image" height={682} width={1024} />
      </div>
    </main>
  );
}
