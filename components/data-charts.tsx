"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { useDataStore } from "@/features/store/data-store";

import { Chart } from "./chart";
import { SpendingPie } from "./spending-pie";

export const DataCharts = () => {
  const transactions = useDataStore((s) => s.transactions);
  const categories = useDataStore((s) => s.categories);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId") || "";

  const { daysData, categoriesData } = useMemo(() => {
    let filtered = transactions;

    if (accountId && accountId !== "all") {
      filtered = filtered.filter((t) => t.accountId === accountId);
    }
    if (from) {
      filtered = filtered.filter((t) => new Date(t.date) >= new Date(from));
    }
    if (to) {
      filtered = filtered.filter((t) => new Date(t.date) <= new Date(to));
    }

    const categoryMap: Record<string, number> = {};
    const daysMap: Record<string, { income: number; expenses: number }> = {};

    filtered.forEach((t) => {
      const amount = Number(t.amount);

      if (amount < 0) {
        const catName =
          categories.find((c) => c.id === t.categoryId)?.name || "Uncategorized";
        categoryMap[catName] = (categoryMap[catName] || 0) + Math.abs(amount);
      }

      const dateStr = new Date(t.date).toISOString().split("T")[0];
      if (!daysMap[dateStr]) daysMap[dateStr] = { income: 0, expenses: 0 };
      if (amount > 0) daysMap[dateStr].income += amount;
      if (amount < 0) daysMap[dateStr].expenses += Math.abs(amount);
    });

    const categoriesData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    const daysData = Object.entries(daysMap)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .map(([date, values]) => ({
        date,
        income: values.income,
        expenses: values.expenses,
      }));

    return { daysData, categoriesData };
  }, [transactions, categories, from, to, accountId]);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={daysData} />
      </div>

      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={categoriesData} />
      </div>
    </div>
  );
};
