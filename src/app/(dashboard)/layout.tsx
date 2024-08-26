import NavigationBar from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";

type Props = {};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <NavigationBar />
      {children}
    </div>
  );
}
