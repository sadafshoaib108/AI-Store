const monthlyData = [
  { month: "Jan", recovered: 4200, atRisk: 1800 },
  { month: "Feb", recovered: 4800, atRisk: 1600 },
  { month: "Mar", recovered: 5100, atRisk: 1400 },
  { month: "Apr", recovered: 4600, atRisk: 1900 },
  { month: "May", recovered: 5400, atRisk: 1200 },
  { month: "Jun", recovered: 6200, atRisk: 1100 },
  { month: "Jul", recovered: 5800, atRisk: 1300 },
  { month: "Aug", recovered: 6700, atRisk: 900 },
  { month: "Sep", recovered: 7100, atRisk: 850 },
  { month: "Oct", recovered: 6900, atRisk: 950 },
  { month: "Nov", recovered: 7400, atRisk: 800 },
  { month: "Dec", recovered: 7800, atRisk: 750 },
];

const recoverySources = [
  { label: "Abandoned Carts", value: 42, color: "bg-indigo-500" },
  { label: "Failed Payments", value: 28, color: "bg-blue-500" },
  { label: "Subscription Churn", value: 18, color: "bg-emerald-500" },
  { label: "Checkout Issues", value: 12, color: "bg-amber-500" },
];

const insights = [
  {
    title: "Checkout drop-off increased this week",
    description:
      "Mobile checkout completion dropped 8% compared to last week. Review the payment form for friction points.",
  },
  {
    title: "Several failed payments need attention",
    description:
      "14 payments worth $2,340 are stuck in a failed state and require manual retry or customer outreach.",
  },
  {
    title: "High-value customers are at risk",
    description:
      "3 enterprise accounts with $12,400 in annual recurring revenue show signs of churn risk.",
  },
  {
    title: "Recovery opportunity detected",
    description:
      "Abandoned cart recovery emails have a 24% open rate this month. Consider increasing send frequency.",
  },
];

const activities = [
  {
    customer: "Alice Johnson",
    issue: "Abandoned Cart",
    amount: "$129.99",
    status: "Recovered",
    date: "2026-08-31",
  },
  {
    customer: "Marcus Lee",
    issue: "Failed Payment",
    amount: "$349.00",
    status: "Pending",
    date: "2026-08-31",
  },
  {
    customer: "Sarah Chen",
    issue: "Subscription Churn",
    amount: "$79.00",
    status: "At Risk",
    date: "2026-08-30",
  },
  {
    customer: "David Patel",
    issue: "Checkout Error",
    amount: "$219.50",
    status: "Recovered",
    date: "2026-08-30",
  },
  {
    customer: "Emily Watson",
    issue: "Abandoned Cart",
    amount: "$89.99",
    status: "Pending",
    date: "2026-08-29",
  },
];

const maxValue = Math.max(...monthlyData.map((d) => d.recovered));
const chartHeight = 240;
const chartWidth = 900;
const padding = { top: 20, right: 20, bottom: 30, left: 50 };
const innerWidth = chartWidth - padding.left - padding.right;
const innerHeight = chartHeight - padding.top - padding.bottom;

const points = monthlyData.map((d, i) => ({
  x: padding.left + (i / (monthlyData.length - 1)) * innerWidth,
  y: padding.top + innerHeight - (d.recovered / maxValue) * innerHeight,
}));

const pathD = points
  .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
  .join(" ");

const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + innerHeight} L ${points[0].x} ${padding.top + innerHeight} Z`;

const yTicks = [0, 2000, 4000, 6000, 8000];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Revenue Overview
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor and recover lost revenue across all channels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>Last 30 days</option>
          </select>
          <button
            type="button"
            className="rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Revenue Recovered"
          value="$68,500"
          change="+12.5%"
          trend="up"
          description="vs last period"
        />
        <SummaryCard
          title="Revenue At Risk"
          value="$9,100"
          change="-8.2%"
          trend="down"
          description="improving"
        />
        <SummaryCard
          title="Recovery Rate"
          value="88.3%"
          change="+4.1%"
          trend="up"
          description="vs last period"
        />
        <SummaryCard
          title="Active Recovery Cases"
          value="24"
          change="-3"
          trend="down"
          description="pending resolution"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Revenue Recovery Trend
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Recovered revenue vs revenue at risk
              </p>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full min-w-[600px]"
              preserveAspectRatio="none"
            >
              {yTicks.map((tick) => {
                const y = padding.top + innerHeight - (tick / maxValue) * innerHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="#e4e4e7"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="text-[10px] fill-zinc-500"
                    >
                      ${tick.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              <path d={areaD} fill="rgba(79, 70, 229, 0.1)" />
              <path
                d={pathD}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="#4f46e5" />
              ))}
            </svg>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Recovery Sources
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Where recovered revenue comes from
          </p>
          <div className="space-y-3">
            {recoverySources.map((source) => (
              <div key={source.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-zinc-700 dark:text-zinc-300">
                    {source.label}
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {source.value}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${source.color}`}
                    style={{ width: `${source.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Recent Recovery Activity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="pb-2 font-medium text-zinc-500">Customer</th>
                  <th className="pb-2 font-medium text-zinc-500">Issue</th>
                  <th className="pb-2 font-medium text-zinc-500">Amount</th>
                  <th className="pb-2 font-medium text-zinc-500">Status</th>
                  <th className="pb-2 font-medium text-zinc-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {activities.map((item) => (
                  <tr key={item.customer + item.date}>
                    <td className="py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.customer}
                    </td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300">
                      {item.issue}
                    </td>
                    <td className="py-3 text-zinc-700 dark:text-zinc-300">
                      {item.amount}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.status === "Recovered"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : item.status === "Pending"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-zinc-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            AI Recovery Insights
          </h3>
          <div className="space-y-4">
            {insights.map((item) => (
              <div
                key={item.title}
                className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  change,
  trend,
  description,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
}) {
  const isPositive = trend === "up";

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium text-zinc-500">{title}</p>
      <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mt-1">
        {value}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            isPositive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-zinc-500">{description}</span>
      </div>
    </div>
  );
}
