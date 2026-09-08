import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  FolderOpen,
  IndianRupee,
  Package,
  Plus,
  Shapes,
  ShoppingBag,
  Users,
} from "lucide-react";

const quickActions = [
  {
    title: "Add Product",
    description: "Create a new saree and add it to your store.",
    href: "/admin/products/new",
    icon: Plus,
  },
  {
    title: "Manage Products",
    description: "View, edit, archive, and publish products.",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Manage Categories",
    description: "Organize your sarees by category.",
    href: "/admin/categories",
    icon: Shapes,
  },
  {
    title: "Manage Collections",
    description: "Create and organize curated collections.",
    href: "/admin/collections",
    icon: FolderOpen,
  },
];

const stats = [
  {
    label: "Total Revenue",
    value: "₹2,48,500",
    change: "+14.2%",
    trend: "up",
    period: "vs last month",
    icon: IndianRupee,
  },
  {
    label: "Total Orders",
    value: "186",
    change: "+8.4%",
    trend: "up",
    period: "vs last month",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    value: "142",
    change: "+12.8%",
    trend: "up",
    period: "vs last month",
    icon: Users,
  },
  {
    label: "Average Order",
    value: "₹6,480",
    change: "-2.1%",
    trend: "down",
    period: "vs last month",
    icon: CreditCard,
  },
];

const recentOrders = [
  {
    id: "#NRG-1048",
    customer: "Ananya Sharma",
    product: "Handwoven Silk Saree",
    amount: "₹8,499",
    status: "Completed",
  },
  {
    id: "#NRG-1047",
    customer: "Meera Nair",
    product: "Kanjivaram Heritage Saree",
    amount: "₹12,999",
    status: "Processing",
  },
  {
    id: "#NRG-1046",
    customer: "Priya Menon",
    product: "Temple Border Saree",
    amount: "₹7,250",
    status: "Completed",
  },
  {
    id: "#NRG-1045",
    customer: "Kavya Rao",
    product: "Classic Mysore Silk",
    amount: "₹9,800",
    status: "Pending",
  },
];

const topProducts = [
  {
    name: "Kanjivaram Heritage Saree",
    orders: 28,
    revenue: "₹3,63,972",
  },
  {
    name: "Handwoven Silk Saree",
    orders: 24,
    revenue: "₹2,03,976",
  },
  {
    name: "Temple Border Saree",
    orders: 19,
    revenue: "₹1,37,750",
  },
  {
    name: "Classic Mysore Silk",
    orders: 15,
    revenue: "₹1,47,000",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page header */}
      <div className="flex flex-col gap-5 border-b border-black/[0.06] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A694F]">
            Store Overview
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#1C1D20] sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777B84]">
            Monitor your store performance, customer activity, orders, and
            product sales.
          </p>
        </div>

        <p className="text-xs text-[#777B84]">
          Last updated today, 10:24 AM
        </p>
      </div>

      {/* Stats */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-[#777B84]">
                  {stat.label}
                </p>

                <div className="flex size-9 items-center justify-center rounded-xl bg-[#F4F4F2] text-[#1C1D20]">
                  <Icon className="size-[18px]" strokeWidth={1.6} />
                </div>
              </div>

              <p className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#1C1D20]">
                {stat.value}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={
                    stat.trend === "up"
                      ? "inline-flex items-center gap-1 text-xs font-medium text-[#5D936C]"
                      : "inline-flex items-center gap-1 text-xs font-medium text-[#C45A5A]"
                  }
                >
                  <TrendIcon className="size-3.5" />
                  {stat.change}
                </span>

                <span className="text-xs text-[#A0A3AA]">
                  {stat.period}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Revenue and top products */}
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {/* Revenue overview */}
        <div className="rounded-2xl border border-black/[0.07] bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1C1D20]">
                Revenue Overview
              </p>

              <p className="mt-2 text-sm text-[#777B84]">
                Store revenue for the current month.
              </p>
            </div>

            <select
              className="h-9 rounded-lg border border-black/[0.08] bg-white px-3 text-xs text-[#777B84] outline-none"
              defaultValue="30days"
            >
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">This year</option>
            </select>
          </div>

          {/* Sample chart placeholder */}
          <div className="mt-10 flex h-[280px] items-end gap-2 sm:gap-3">
            {[38, 52, 44, 65, 57, 76, 62, 84, 72, 92, 80, 100].map(
              (height, index) => (
                <div
                  key={index}
                  className="group flex h-full flex-1 items-end"
                >
                  <div
                    className="w-full rounded-t-md bg-[#E6E7E4] transition-colors duration-200 hover:bg-[#9A694F]"
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>
              )
            )}
          </div>

          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.08em] text-[#A0A3AA]">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-black/[0.07] bg-white">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-sm font-semibold text-[#1C1D20]">
                Top Products
              </h2>

              <p className="mt-1 text-xs text-[#777B84]">
                Best sellers this month
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-xs font-medium text-[#9A694F] transition-opacity hover:opacity-70"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-black/[0.06]">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 px-5 py-4 sm:px-6"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F4F4F2] text-xs font-semibold text-[#777B84]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#1C1D20]">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-[#777B84]">
                    {product.orders} orders
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-[#1C1D20]">
                  {product.revenue}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent orders */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-black/[0.07] bg-white">
        <div className="flex flex-col gap-4 border-b border-black/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-[#1C1D20]">
              Recent Orders
            </h2>

            <p className="mt-1 text-xs text-[#777B84]">
              Latest customer purchases from your store.
            </p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-medium text-[#9A694F] transition-opacity hover:opacity-70"
          >
            View all orders
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#FAFAF9]">
                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B84]">
                  Order
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B84]">
                  Customer
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B84]">
                  Product
                </th>

                <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B84]">
                  Amount
                </th>

                <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777B84]">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-black/[0.05] last:border-b-0"
                >
                  <td className="px-6 py-5 text-sm font-medium text-[#1C1D20]">
                    {order.id}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#1C1D20]">
                    {order.customer}
                  </td>

                  <td className="px-6 py-5 text-sm text-[#777B84]">
                    {order.product}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-[#1C1D20]">
                    {order.amount}
                  </td>

                  <td className="px-6 py-5 text-right">
                    <OrderStatus status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile order cards */}
        <div className="divide-y divide-black/[0.06] md:hidden">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-5 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#1C1D20]">
                    {order.id}
                  </p>

                  <p className="mt-1 text-sm text-[#777B84]">
                    {order.customer}
                  </p>
                </div>

                <OrderStatus status={order.status} />
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="max-w-[70%] text-xs leading-5 text-[#777B84]">
                  {order.product}
                </p>

                <p className="text-sm font-semibold text-[#1C1D20]">
                  {order.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A694F]">
            Quick Access
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#1C1D20]">
            Manage your store
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className="group rounded-2xl border border-black/[0.07] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-black/[0.14] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)]"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#F4F4F2] text-[#1C1D20]">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>

                <h3 className="mt-5 text-sm font-semibold text-[#1C1D20]">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#777B84]">
                  {action.description}
                </p>

                <span className="mt-5 block text-xs font-medium text-[#9A694F]">
                  Open →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function OrderStatus({ status }: { status: string }) {
  const styles = {
    Completed:
      "border-green-100 bg-green-50 text-green-700",
    Processing:
      "border-blue-100 bg-blue-50 text-blue-700",
    Pending:
      "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        styles[status as keyof typeof styles] ??
        "border-black/[0.08] bg-black/[0.03] text-[#777B84]"
      }`}
    >
      {status}
    </span>
  );
}