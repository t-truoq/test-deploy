import { Users, Package, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="grid gap-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total Users Card */}
        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total User</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900">40,689</h3>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <p className="mt-2 flex items-center text-sm text-green-500">
            <ArrowUp className="mr-1 h-4 w-4" />
            8.5% Up from yesterday
          </p>
        </div>

        {/* Total Orders Card */}
        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Order</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900">10293</h3>
            <div className="rounded-full bg-yellow-50 p-3">
              <Package className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <p className="mt-2 flex items-center text-sm text-green-500">
            <ArrowUp className="mr-1 h-4 w-4" />
            1.3% Up from past week
          </p>
        </div>

        {/* Total Sales Card */}
        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Sales</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900">$89,000</h3>
            <div className="rounded-full bg-green-50 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <p className="mt-2 flex items-center text-sm text-red-500">
            <ArrowDown className="mr-1 h-4 w-4" />
            4.3% Down from yesterday
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
