"use client";
import React, { useState } from "react";
import { Home, Search, Flame, FileText } from "lucide-react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const links = [
  {
    label: "Home",
    href: "/home",
    icon: <Home size={20} className="shrink-0 text-white" />,
  },
  {
    label: "Explore",
    href: "#",
    icon: <Search size={20} className="shrink-0 text-white" />,
  },
  {
    label: "Trending",
    href: "#",
    icon: <Flame size={20} className="shrink-0 text-white" />,
  },
  {
    label: "All Posts",
    href: "#",
    icon: <FileText size={20} className="shrink-0 text-white" />,
  },
];

const LeftSideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody
          className={cn(
            "justify-between gap-10 bg-gradient-to-b from-blue-600 via-violet-600 to-white h-full overflow-hidden"
          )}
        >
          <div className="flex flex-1 flex-col h-full">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
};

const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-white"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre"
      >
        
      </motion.span>
    </a>
  );
};

export default LeftSideBar;