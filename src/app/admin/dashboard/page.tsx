"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Brain,
  CircleDollarSign,
  CreditCard,
  ShoppingCart,
  Users,
} from "lucide-react";

const recoveryData = [
  { month: "Jan", value: 4200 },
  { month: "Feb", value: 5100 },
  { month: "Mar", value: 4700 },
  { month: "Apr", value: 6800 },
  { month: "May", value: 7600 },
  { month: "Jun", value: 9200 },
  { month: "Jul", value: 10500 },
  { month: "Aug", value: 12100 },
];

const recoverySources = [
  { name: "Abandoned Carts", value: "$12,450", percentage: 42 },
  { name: "Failed Payments", value: "$8,720", percentage: 29 },
  { name: "Subscription Churn", value: "$5,830", percentage: 20 },
  { name: "Other", value: "$2,670", percentage: 9 },
];

const recentActivities = [
  {
    customer: "Sarah Johnson",
    action: "Payment recovered",
    amount: "$249.00",
    status: "Recovered",
  },
  {
    customer: "Michael Smith",
    action: "Cart recovery",
    amount: "$189.50",
    status: "Recovered",
  },
  {
    customer: "Emma Williams",
    action: "Payment retry",
    amount: "$420.00",
    status: "Pending",
  },
  {
    customer: "James Brown",
    action: "Subscription recovery",
    amount: "$129.00",
    status: "Recovered",
  },
];

const aiInsights = [
  "Customers who receive a recovery message within 30 minutes are more likely to complete their purchase.",
  "Your abandoned-cart recovery rate increased this month compared with the previous period.",
  "Failed payment recovery is currently the biggest opportunity for additional revenue.",
];

export default function DashboardPage() {
  const maxValue = Math.max(...recoveryData.map((item) => item.value));

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">
              AI Revenue Recovery
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Revenue Overview
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Monitor recovered revenue and identify new recovery opportunities.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Last 30 Days
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Recovered Revenue"
            value="$29,670"
            change="+18.4%"
            positive
            icon={<CircleDollarSign size={22} />}
          />

          <SummaryCard
            title="Recovery Rate"
            value="24.8%"
            change="+4.2%"
            positive
            icon={<ArrowUpRight size={22} />}
          />

          <SummaryCard
            title="Customers Recovered"
            value="1,284"
            change="+12.6%"
            positive
            icon={<Users size={22} />}
          />

          <SummaryCard
            title="Pending Recovery"
            value="$8,430"
            change="-3.1%"
            positive={false}
            icon={<ShoppingCart size={22} />}
          />
        </div>

        {/* Main Grid */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          {/* Revenue Chart */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Revenue Recovery Trend</h2>

              <p className="mt-1 text-sm text-slate-400">
                Recovered revenue over the last eight months.
              </p>
            </div>

            <div className="flex h-72 items-end gap-3 border-b border-l border-slate-800 px-4 pb-0">
              {recoveryData.map((item) => {
                const height = `${(item.value / maxValue) * 100}%`;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col justify-end"
                  >
                    <div className="group relative flex h-full items-end">
                      <div
                        className="w-full rounded-t-md bg-indigo-500 transition-all duration-300 group-hover:bg-indigo-400"
                        style={{ height }}
                      >
                        <div className="absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block">
                          ${item.value.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <span className="mt-3 text-center text-xs text-slate-500">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recovery Sources */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold">Recovery Sources</h2>

            <p className="mt-1 text-sm text-slate-400">
              Where recovered revenue is coming from.
            </p>

            <div className="mt-6 space-y-5">
              {recoverySources.map((source) => (
                <div key={source.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{source.name}</span>

                    <span className="font-medium text-white">
                      {source.value}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {source.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* AI Insights */}
        <section className="mt-6 rounded-2xl border border-indigo-900/60 bg-slate-900 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
              <Brain size={24} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">AI Recovery Insights</h2>

              <p className="mt-1 text-sm text-slate-400">
                AI-generated observations based on your recovery activity.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="text-sm leading-6 text-slate-300">{insight}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Recovery Activity
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Latest revenue recovery actions.
              </p>
            </div>

            <CreditCard className="text-slate-500" size={22} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Action</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentActivities.map((activity) => (
                  <tr
                    key={`${activity.customer}-${activity.action}`}
                    className="border-b border-slate-800/70 last:border-0"
                  >
                    <td className="py-4 text-sm font-medium text-white">
                      {activity.customer}
                    </td>

                    <td className="py-4 text-sm text-slate-400">
                      {activity.action}
                    </td>

                    <td className="py-4 text-sm text-slate-300">
                      {activity.amount}
                    </td>

                    <td className="py-4 text-right">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          activity.status === "Recovered"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  change,
  positive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
          {icon}
        </div>

        {positive ? (
          <ArrowUpRight size={18} className="text-emerald-400" />
        ) : (
          <ArrowDownRight size={18} className="text-amber-400" />
        )}
      </div>

      <p className="mt-5 text-sm text-slate-400">{title}</p>

      <div className="mt-1 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold text-white">{value}</p>

        <span
          className={`text-xs font-medium ${
            positive ? "text-emerald-400" : "text-amber-400"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}