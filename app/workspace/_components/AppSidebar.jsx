"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  Book,
  Compass,
  WalletCards,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AddNewCourseDialog from "./AddNewCourseDialog";

const SidebarOptions = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/workspace" },
  { title: "My Learning", icon: Book, path: "/workspace/my-learning" },
  { title: "Explore Courses", icon: Compass, path: "/workspace/explore" },
  { title: "Billing", icon: WalletCards, path: "/workspace/billing" },
  { title: "Profile", icon: UserCircle2Icon, path: "/workspace/profile" },
];

export function AppSidebar() {
  const path = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex flex-row items-center">
        <Image src="/logo.svg" alt="logo" width={60} height={50} />
        <h2 className="font-bold text-lg">EduNova AI</h2>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:scale-[1.02] transition-all duration-200">
              Create New Course
            </Button>
          </AddNewCourseDialog>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarOptions.map((item, index) => {
                // const isActive = path === item.path || path.startsWith(item.path + "/");
                const isActive =
                  path === item.path ||
                  (item.path !== "/workspace" && path.startsWith(item.path));

                return (
                  <SidebarMenuButton key={index} asChild className="p-5">
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 text-[17px] rounded-md 
                        ${
                          isActive
                            ? "text-primary bg-purple-100"
                            : "text-gray-700"
                        }
                      `}
                    >
                      <item.icon className="h-7 w-7" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
