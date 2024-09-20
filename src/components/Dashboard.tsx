"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function Dashboard() {
  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CineSync Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Discover"
          description="Find new movies based on your preferences"
          onClick={() => console.log("Navigate to Discover")}
        />
        <DashboardCard
          title="Watchlist"
          description="Manage your movie watchlist"
          onClick={() => console.log("Navigate to Watchlist")}
        />
        <DashboardCard
          title="Friends"
          description="Connect with friends and share recommendations"
          onClick={() => console.log("Navigate to Friends")}
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function DashboardCard({ title, description, onClick }: DashboardCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card className="cursor-pointer" onClick={onClick}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
