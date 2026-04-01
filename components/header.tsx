"use client";

import { useDataStore } from "@/features/store/data-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Filters } from "./filters";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { WelcomeMsg } from "./welcome-msg";

export const Header = () => {
  const role = useDataStore((state) => state.role);
  const setRole = useDataStore((state) => state.setRole);

  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 lg:pb-32">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>

          <div className="flex items-center gap-x-4">
            <Select value={role} onValueChange={(r) => setRole(r as "admin" | "viewer")}>
              <SelectTrigger className="w-[120px] bg-white/20 border-none text-white hover:bg-white/30 transition shadow-none focus:ring-transparent focus:ring-offset-0">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <WelcomeMsg />
        <Filters />
      </div>
    </header>
  );
};
