"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import {
  ArrowUpDown,
  TrendingDown,
  TrendingUp,
  BarChart3,
  PieChart,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataStore } from "@/features/store/data-store";
import { formatCurrency } from "@/lib/utils";

const InsightsPage = () => {
  const transactions = useDataStore((s) => s.transactions);
  const categories = useDataStore((s) => s.categories);
  const accounts = useDataStore((s) => s.accounts);

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    // Highest spending category
    const categorySpending: Record<string, number> = {};
    transactions.forEach((t) => {
      if (Number(t.amount) < 0) {
        const catName =
          categories.find((c) => c.id === t.categoryId)?.name || "Uncategorized";
        categorySpending[catName] =
          (categorySpending[catName] || 0) + Math.abs(Number(t.amount));
      }
    });

    const sortedCategories = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a);

    const highestSpendingCategory = sortedCategories[0];
    const lowestSpendingCategory = sortedCategories[sortedCategories.length - 1];

    // Monthly comparison
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const month = format(new Date(t.date), "yyyy-MM");
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expenses: 0 };
      const amount = Number(t.amount);
      if (amount > 0) monthlyData[month].income += amount;
      if (amount < 0) monthlyData[month].expenses += Math.abs(amount);
    });

    const months = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b));

    // Average transaction
    const totalAmount = transactions.reduce((acc, t) => acc + Math.abs(Number(t.amount)), 0);
    const avgTransaction = totalAmount / transactions.length;

    // Largest single transaction
    const largestExpense = transactions.reduce(
      (max, t) => (Number(t.amount) < Number(max.amount) ? t : max),
      transactions[0]
    );
    const largestIncome = transactions.reduce(
      (max, t) => (Number(t.amount) > Number(max.amount) ? t : max),
      transactions[0]
    );

    // Most active account
    const accountActivity: Record<string, number> = {};
    transactions.forEach((t) => {
      const accName = accounts.find((a) => a.id === t.accountId)?.name || "Unknown";
      accountActivity[accName] = (accountActivity[accName] || 0) + 1;
    });
    const mostActiveAccount = Object.entries(accountActivity).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      highestSpendingCategory,
      lowestSpendingCategory,
      months,
      avgTransaction,
      largestExpense,
      largestIncome,
      mostActiveAccount,
      totalTransactions: transactions.length,
      totalCategories: categories.length,
      categoryBreakdown: sortedCategories,
    };
  }, [transactions, categories, accounts]);

  if (!insights) {
    return (
      <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardContent className="flex h-[350px] items-center justify-center">
            <p className="text-muted-foreground">No data available for insights.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto -mt-6 w-full max-w-screen-2xl pb-10">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Financial Insights</h2>

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Spending
            </CardTitle>
            <TrendingDown className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {insights.highestSpendingCategory?.[0] || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {insights.highestSpendingCategory
                ? formatCurrency(insights.highestSpendingCategory[1])
                : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lowest Spending
            </CardTitle>
            <TrendingUp className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {insights.lowestSpendingCategory?.[0] || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {insights.lowestSpendingCategory
                ? formatCurrency(insights.lowestSpendingCategory[1])
                : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Transaction
            </CardTitle>
            <ArrowUpDown className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {formatCurrency(insights.avgTransaction)}
            </p>
            <p className="text-sm text-muted-foreground">
              Across {insights.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Active Account
            </CardTitle>
            <BarChart3 className="size-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {insights.mostActiveAccount?.[0] || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {insights.mostActiveAccount?.[1] || 0} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Comparison */}
      <Card className="mb-8 border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.months.map(([month, data]) => {
              const net = data.income - data.expenses;
              return (
                <div key={month} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">
                      {format(new Date(month + "-01"), "MMMM yyyy")}
                    </p>
                    <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                      <span className="text-emerald-600">
                        Income: {formatCurrency(data.income)}
                      </span>
                      <span className="text-rose-600">
                        Expenses: {formatCurrency(data.expenses)}
                      </span>
                    </div>
                  </div>
                  <div className={`text-right font-semibold ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                    {net >= 0 ? "+" : ""}
                    {formatCurrency(net)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="mb-8 border-none drop-shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Spending by Category</CardTitle>
          <PieChart className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.categoryBreakdown.map(([name, amount]) => {
              const total = insights.categoryBreakdown.reduce(
                (acc, [, val]) => acc + val,
                0
              );
              const pct = total > 0 ? (amount / total) * 100 : 0;
              return (
                <div key={name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{name}</span>
                    <span className="text-muted-foreground">
                      {formatCurrency(amount)} ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notable Transactions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-none drop-shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(Number(insights.largestIncome.amount))}
            </p>
            <p className="text-sm text-muted-foreground">
              {insights.largestIncome.payee} •{" "}
              {format(new Date(insights.largestIncome.date), "MMM dd, yyyy")}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none drop-shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Largest Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-rose-600">
              {formatCurrency(Number(insights.largestExpense.amount))}
            </p>
            <p className="text-sm text-muted-foreground">
              {insights.largestExpense.payee} •{" "}
              {format(new Date(insights.largestExpense.date), "MMM dd, yyyy")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsPage;
