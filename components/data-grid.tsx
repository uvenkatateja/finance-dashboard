"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import { useDataStore } from "@/features/store/data-store";
import { formatDateRange } from "@/lib/utils";

import { DataCard } from "./data-card";

export const DataGrid = () => {
  const transactions = useDataStore((s) => s.transactions);
  const categories = useDataStore((s) => s.categories);
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || undefined;
  const from = searchParams.get("from") || undefined;
  const accountId = searchParams.get("accountId") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  const summary = useMemo(() => {
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

    let income = 0;
    let expenses = 0;

    filtered.forEach((t) => {
      const amount = Number(t.amount);
      if (amount > 0) income += amount;
      if (amount < 0) expenses += Math.abs(amount);
    });

    return {
      incomeAmount: income,
      incomeChange: 2.5,
      expensesAmount: expenses,
      expensesChange: -1.2,
      remainingAmount: income - expenses,
      remainingChange: 5.0,
    };
  }, [transactions, from, to, accountId]);

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3">
      <DataCard
        title="Remaining"
        value={summary.remainingAmount}
        percentageChange={summary.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Income"
        value={summary.incomeAmount}
        percentageChange={summary.incomeChange}
        icon={FaArrowTrendUp}
        variant="success"
        dateRange={dateRangeLabel}
      />

      <DataCard
        title="Expenses"
        value={summary.expensesAmount}
        percentageChange={summary.expensesChange}
        icon={FaArrowTrendDown}
        variant="danger"
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
