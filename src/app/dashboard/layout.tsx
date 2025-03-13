import SideNav from "@/components/global/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 md:sticky">
        <SideNav />
      </div>
      <div className="flex-grow py-6 px-3 md:overflow-y-auto md:px-1 md:py-8">
        {children}
      </div>
    </div>
  );
}
