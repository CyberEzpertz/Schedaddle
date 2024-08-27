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
    <>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-0 gap-4 grow">
        {children}
      </div>
    </>
  );
}
