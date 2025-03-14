import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Package, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDay: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    year: new Date().getFullYear(), // 2025
    month: new Date().getMonth() + 1, // 3
    day: null, // Không lọc theo ngày mặc định
  });
  const [salesResponse, setSalesResponse] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userRole = decodedToken.role?.toUpperCase();
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        };

        let usersResponse, ordersResponse, salesResponse;

        if (userRole === "ADMIN" || userRole === "STAFF") {
          [usersResponse, ordersResponse, salesResponse] = await Promise.all([
            axios
              .get(
                "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/users",
                config
              )
              .catch((err) => {
                console.error(
                  "Users API Error:",
                  err.response?.data || err.message
                );
                return { data: { result: [] } };
              }),
            axios
              .get(
                "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings",
                config
              )
              .catch((err) => {
                console.error(
                  "Bookings API Error:",
                  err.response?.data || err.message
                );
                return { data: [] };
              }),
            axios
              .get(
                "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/v1/vnpay",
                config
              )
              .catch((err) => {
                console.error(
                  "Sales API Error:",
                  err.response?.data || err.message
                );
                return { data: [] };
              }),
          ]);

          const totalUsers = usersResponse.data?.result?.length || 0;
          const totalOrders =
            ordersResponse.data?.length || ordersResponse.data?.total || 0;

          setSalesResponse(salesResponse.data || []);
          setStats((prev) => ({ ...prev, totalUsers, totalOrders }));
          applyFilters(salesResponse.data || []); // Áp dụng bộ lọc mặc định
        } else if (userRole === "SPECIALIST") {
          ordersResponse = await axios.get(
            "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings",
            config
          );
          const totalOrders =
            ordersResponse.data?.length || ordersResponse.data?.total || 0;
          setStats((prev) => ({ ...prev, totalOrders }));
        } else if (userRole === "CUSTOMER") {
          ordersResponse = await axios.get(
            "https://adf4-2405-4802-811e-11a0-5c40-f238-ce80-2dce.ngrok-free.app/api/bookings",
            {
              ...config,
              params: { userId: decodedToken.sub },
            }
          );
          const totalOrders =
            ordersResponse.data?.length || ordersResponse.data?.total || 0;
          setStats((prev) => ({ ...prev, totalOrders }));
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm áp dụng bộ lọc chỉ cho Sales
  const applyFilters = (salesData) => {
    const filteredSales = salesData.filter((payment) => {
      if (!payment || !payment.paymentTime) return false;
      const date = new Date(payment.paymentTime);
      const paymentYear = date.getUTCFullYear();
      const paymentMonth = date.getUTCMonth() + 1; // 0-based to 1-based
      const paymentDay = date.getUTCDate();

      const yearMatch = filter.year === paymentYear;
      const monthMatch = filter.month === paymentMonth;
      const dayMatch = filter.day ? filter.day === paymentDay : true;

      return yearMatch && monthMatch && dayMatch;
    });

    const totalSales = filteredSales
      .filter((payment) => payment.status === "SUCCESS")
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    const salesByDay = filteredSales
      .filter((payment) => payment.status === "SUCCESS")
      .reduce((acc, payment) => {
        const date = new Date(payment.paymentTime);
        const day = date.getUTCDate();
        acc[day] = (acc[day] || 0) + (payment.amount || 0);
        return acc;
      }, {});

    console.log("Filtered Sales By Day:", salesByDay);

    setStats((prev) => ({
      ...prev,
      totalSales,
      salesByDay,
    }));
  };

  const handleFilter = () => {
    applyFilters(salesResponse);
  };

  const chartData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Sales ($)",
        data: Array.from(
          { length: 31 },
          (_, i) => stats.salesByDay[i + 1] || 0
        ),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Sales by Day - ${filter.month}/${filter.year}`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount ($)" } },
      x: { title: { display: true, text: "Day" } },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-3 gap-6">
        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Users</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </h3>
            <div className="rounded-full bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Orders</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-semibold text-gray-900">
              {stats.totalOrders.toLocaleString()}
            </h3>
            <div className="rounded-full bg-yellow-50 p-3">
              <Package className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="relative rounded-lg bg-white p-6">
          <p className="mb-1 text-sm text-gray-600">Total Sales</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-3xl font-semibold text-gray-900">
                ${stats.totalSales.toLocaleString()}
              </h3>
              <div className="rounded-full bg-green-50 p-3">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
            {/* Bộ lọc tích hợp */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Year:
                </label>
                <select
                  value={filter.year}
                  onChange={(e) =>
                    setFilter({ ...filter, year: parseInt(e.target.value) })
                  }
                  className="p-1 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - 2 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Month:
                </label>
                <select
                  value={filter.month}
                  onChange={(e) =>
                    setFilter({ ...filter, month: parseInt(e.target.value) })
                  }
                  className="p-1 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Day:
                </label>
                <select
                  value={filter.day || ""}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      day: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="p-1 border rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleFilter}
                className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Sales Details</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Dashboard;
