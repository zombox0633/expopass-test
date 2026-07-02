import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-8">{children}</main>
      <Footer />
    </>
  );
}
