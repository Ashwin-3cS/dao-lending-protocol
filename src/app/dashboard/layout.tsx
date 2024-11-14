import {
  Sidebar,
  SidebarBody,
  SidebarProvider,
} from "@/components/ui/sidebarHelper";
import "../../app/globals.css";
import Navbar from "@/components/Navbar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-black">
      <SidebarProvider>
        <SidebarBody />
      </SidebarProvider>
    </div>
  );
}
