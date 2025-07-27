import { Plus, LogIn, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/shared/ui/shadcn/sidebar";

import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Switch } from "@/shared/ui/shadcn/switch";
import { Label } from "@/shared/ui/shadcn/label";
import { themeStore } from "../model/themeStore";
import { userStore } from "../model/userStore";
import { useEffect } from "react";
import NavUser from "./NavUser";

const items = [
  {
    title: "Сreate user",
    to: "/user/create",
    icon: Plus,
  },
  {
    title: "Users",
    to: "/",
    icon: Users,
  },
];

function AppSidebar() {
  useEffect(() => {
    userStore.fetchUser();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          {userStore.user && (
            <>
              <NavUser />
              <SidebarSeparator className="my-2" />
            </>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {userStore.user ? (
                items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.to}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem key="Login">
                  <SidebarMenuButton asChild>
                    <Link to="/login">
                      <LogIn />
                      <span>Login</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-4 p-2">
          <Switch
            id="dark-mode"
            checked={themeStore.theme === "dark"}
            onCheckedChange={(checked) =>
              themeStore.setTheme(checked ? "dark" : "light")
            }
          />
          <Label htmlFor="dark-mode">Dark mode</Label>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default observer(AppSidebar);
