// import SideNav from "@/components/SideNav/SideNav";
// import Header from "@/components/Header/Header";

import "../../app/globals.css";
// import { Sidebar } from "@/components/ui/ui/sidebar";
import { SidebarDemo } from "@/components/SideBarOnrampPanel";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-950">
      <SidebarDemo />
      {children}
    </div>
  );
}
