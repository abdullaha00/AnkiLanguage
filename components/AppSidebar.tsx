
"use client"
import { Calendar, Home, Inbox, Search, Settings, Languages, User2, ChevronUp } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroupLabel, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenu, SidebarMenuButton, SidebarSeparator } from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { TbLanguageKatakana } from "react-icons/tb";
import { GrScan } from "react-icons/gr";
import { GiCardPick } from "react-icons/gi";
import { MessageSquare } from "lucide-react";

// Menu items.
const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Anki",
      url: "/anki",
      icon: GiCardPick,
    },
    {
      title: "OCR",
      url: "/ocr",
      icon: GrScan,
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
    }
  ];


export function AppSidebar() {

    return (
        
        <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                <TbLanguageKatakana />
                <span>Japanese</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>


        </SidebarHeader>
        <SidebarSeparator/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map(item => <SidebarMenuItem key={item.title}>

                                <SidebarMenuButton asChild>
                                    <Link href={item.url}> 
                                        <item.icon/>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>

                            </SidebarMenuItem>)}

                        </SidebarMenu>

                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                        <User2/>Guest<ChevronUp className="ml-auto size-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem>Account</DropdownMenuItem>
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                    </DropdownMenuContent>

                  </DropdownMenu>

                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        
        </Sidebar>

    );
    

}

export default AppSidebar;

