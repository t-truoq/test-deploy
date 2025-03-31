"use client";

import axios from "axios";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  ArcElement,
} from "chart.js";
import { Package, TrendingUp, Users, Filter, ChevronDown } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalSales: 0,
    salesByDay: {},
    salesByMonth: {},
  });
  const [loading, setLoading] = useState(true); // Chỉ loading lần đầu
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    year: new Date().getFullYear(), // 2025
    month: null,
  });
  const [salesResponse, setSalesResponse] = useState([]);
  const [ordersResponse, setOrdersResponse] = useState([]);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  const applyFilters = useCallback(
    (salesData) => {
      const filteredSales = salesData.filter((payment) => {
        if (!payment || !payment.paymentTime) return false;
        const date = new Date(payment.paymentTime);
        const paymentYear = date.getUTCFullYear();
        const paymentMonth = date.getUTCMonth() + 1;

        const yearMatch = filter.year === paymentYear;
        const monthMatch = filter.month ? filter.month === paymentMonth : true;

        return yearMatch && monthMatch;
      });

      const totalSales = filteredSales
        .filter((payment) => payment.status !== "FAILED")
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      let salesByDay = {};
      let salesByMonth = {};

      if (filter.month) {
        salesByDay = filteredSales
          .filter((payment) => payment.status !== "FAILED")
          .reduce((acc, payment) => {
            const date = new Date(payment.paymentTime);
            const day = date.getUTCDate();
            acc[day] = (acc[day] || 0) + (payment.amount || 0);
            return acc;
          }, {});
      } else {
        salesByMonth = filteredSales
          .filter((payment) => payment.status !== "FAILED")
          .reduce((acc, payment) => {
            const date = new Date(payment.paymentTime);
            const month = date.getUTCMonth() + 1;
            acc[month] = (acc[month] || 0) + (payment.amount || 0);
            return acc;
          }, {});
      }

      setStats((prev) => ({
        ...prev,
        totalSales,
        salesByDay,
        salesByMonth,
      }));
    },
    [filter]
  );

  // Fetch dữ liệu chỉ chạy 1 lần khi component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Loading chỉ bật lần đầu
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
                "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/users",
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
                "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings",
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
                "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/v1/vnpay",
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
          setOrdersResponse(ordersResponse.data || []);
          setStats((prev) => ({ ...prev, totalUsers, totalOrders }));
          applyFilters(salesResponse.data || []);
        } else if (userRole === "SPECIALIST") {
          ordersResponse = await axios.get(
            "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings",
            config
          );
          const totalOrders =
            ordersResponse.data?.length || ordersResponse.data?.total || 0;
          setOrdersResponse(ordersResponse.data || []);
          setStats((prev) => ({ ...prev, totalOrders }));
        } else if (userRole === "CUSTOMER") {
          ordersResponse = await axios.get(
            "https://62dd-2402-800-78d0-a832-503e-9ecd-54a8-3bb0.ngrok-free.app/api/bookings",
            {
              ...config,
              params: { userId: decodedToken.sub },
            }
          );
          const totalOrders =
            ordersResponse.data?.length || ordersResponse.data?.total || 0;
          setOrdersResponse(ordersResponse.data || []);
          setStats((prev) => ({ ...prev, totalOrders }));
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false); // Tắt loading sau khi fetch xong
      }
    };

    fetchDashboardData();
  }, []); // Dependency array rỗng để chỉ chạy 1 lần khi mount

  // Lọc dữ liệu khi filter thay đổi, không cần loading
  useEffect(() => {
    if (salesResponse.length > 0) {
      applyFilters(salesResponse);
    }
  }, [filter, salesResponse, applyFilters]);

  const resetFilters = () => {
    setFilter({
      year: new Date().getFullYear(),
      month: null,
    });
  };

  const barChartData = {
    labels: filter.month
      ? Array.from({ length: 31 }, (_, i) => i + 1)
      : Array.from({ length: 12 }, (_, i) => i + 1),
    datasets: [
      {
        label: "Sales (VND)",
        data: filter.month
          ? Array.from({ length: 31 }, (_, i) => stats.salesByDay[i + 1] || 0)
          : Array.from(
              { length: 12 },
              (_, i) => stats.salesByMonth[i + 1] || 0
            ),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 10 } },
      title: {
        display: true,
        text: filter.month
          ? `Sales by Day - ${filter.month}/${filter.year}`
          : `Sales by Month - ${filter.year}`,
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            `Sales: ${(context.raw || 0).toLocaleString()} VND`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (VND)", font: { size: 12 } },
        ticks: {
          font: { size: 10 },
          callback: (value) => value.toLocaleString(),
        },
      },
      x: {
        title: {
          display: true,
          text: filter.month ? "Day" : "Month",
          font: { size: 12 },
        },
        ticks: {
          font: { size: 10 },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: true,
          maxTicksLimit: filter.month ? 10 : 12,
        },
      },
    },
  };

  const pieChartData = {
    labels: ["Pending", "Confirm", "In Progress", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Orders by Status",
        data: [
          ordersResponse.filter(
            (order) =>
              order.status.toUpperCase() === "PENDING" &&
              new Date(order.bookingDate).getUTCFullYear() === filter.year &&
              (!filter.month ||
                new Date(order.bookingDate).getUTCMonth() + 1 === filter.month)
          ).length,
          ordersResponse.filter(
            (order) =>
              order.status.toUpperCase() === "CONFIRM" &&
              new Date(order.bookingDate).getUTCFullYear() === filter.year &&
              (!filter.month ||
                new Date(order.bookingDate).getUTCMonth() + 1 === filter.month)
          ).length,
          ordersResponse.filter(
            (order) =>
              order.status.toUpperCase() === "IN_PROGRESS" &&
              new Date(order.bookingDate).getUTCFullYear() === filter.year &&
              (!filter.month ||
                new Date(order.bookingDate).getUTCMonth() + 1 === filter.month)
          ).length,
          ordersResponse.filter(
            (order) =>
              order.status.toUpperCase() === "COMPLETED" &&
              new Date(order.bookingDate).getUTCFullYear() === filter.year &&
              (!filter.month ||
                new Date(order.bookingDate).getUTCMonth() + 1 === filter.month)
          ).length,
          ordersResponse.filter(
            (order) =>
              order.status.toUpperCase() === "CANCELLED" &&
              new Date(order.bookingDate).getUTCFullYear() === filter.year &&
              (!filter.month ||
                new Date(order.bookingDate).getUTCMonth() + 1 === filter.month)
          ).length,
        ],
        backgroundColor: [
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 12 }, padding: 10 } },
      title: {
        display: true,
        text: filter.month
          ? `Orders by Status - ${filter.month}/${filter.year}`
          : `Orders by Status - ${filter.year}`,
        font: { size: 16, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw || 0} orders`,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white border-gray-100 p-8 rounded-xl shadow-lg border backdrop-blur-sm">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-[#3D021E] border-t-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl text-[#3D021E] font-medium">
            Loading dashboard...
          </h3>
          <p className="text-gray-500 mt-2">
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white border-gray-200 p-10 rounded-xl shadow-xl max-w-md w-full text-center border">
          <div className="w-20 h-20 mx-auto mb-6 text-[#3D021E]">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#3D021E] mb-2">Error</h2>
          <p className="text-gray-600 mb-8 text-lg">{error}</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] hover:from-[#4A0404] hover:to-[#7D1F4D] text-white rounded-lg transition-colors duration-300 shadow-md flex items-center justify-center gap-2 mx-auto"
            onClick={() => window.location.reload()}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9H9m-5 5H9m6 6v-5h-.582m-15.356-2A8.001 8.001 0 0019.418 15H15m5-5H15"
              />
            </svg>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const maxYear = Math.min(currentYear, 2025);
  const years = Array.from(
    { length: maxYear - 2019 + 1 },
    (_, i) => 2020 + i
  ).filter((year) => year <= maxYear);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] mb-6">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="relative rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 backdrop-blur-sm">
            <p className="mb-1 text-sm text-gray-600">Total Users</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <div className="rounded-full bg-blue-50 p-2 sm:p-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="relative rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 backdrop-blur-sm">
            <p className="mb-1 text-sm text-gray-600">Total Orders</p>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {stats.totalOrders.toLocaleString()}
              </h3>
              <div className="rounded-full bg-yellow-50 p-2 sm:p-3">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="relative rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100 backdrop-blur-sm">
            <p className="mb-1 text-sm text-gray-600">Total Sales</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  {stats.totalSales.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ₫
                </h3>
                <div className="rounded-full bg-green-50 p-2 sm:p-3">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-[#3D021E] font-medium flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filters
            </div>

            <div className="relative">
              <button
                className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
                  filter.year !== new Date().getFullYear()
                    ? "text-[#3D021E] border-[#3D021E]"
                    : "text-gray-700 border-gray-300"
                } bg-white border shadow-sm`}
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
              >
                <span>{filter.year}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showYearDropdown && (
                <div className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filter.year === year
                          ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                          : "text-gray-700"
                      } hover:bg-[#F8F2F5]`}
                      onClick={() => {
                        setFilter({ ...filter, year, month: null });
                        setShowYearDropdown(false);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                className={`flex items-center justify-between gap-2 px-4 py-2 text-sm rounded-lg min-w-[140px] ${
                  filter.month
                    ? "text-[#3D021E] border-[#3D021E]"
                    : "text-gray-700 border-gray-300"
                } bg-white border shadow-sm`}
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
              >
                <span>
                  {filter.month
                    ? new Date(0, filter.month - 1).toLocaleString("default", {
                        month: "long",
                      })
                    : "All Months"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showMonthDropdown && (
                <div className="absolute top-full mt-1 w-[150px] bg-white border-gray-200 border rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    className={`w-full text-left px-4 py-2 text-sm ${
                      !filter.month
                        ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                        : "text-gray-700"
                    } hover:bg-[#F8F2F5]`}
                    onClick={() => {
                      setFilter({ ...filter, month: null });
                      setShowMonthDropdown(false);
                    }}
                  >
                    All Months
                  </button>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <button
                      key={month}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        filter.month === month
                          ? "bg-[#F8F2F5] text-[#3D021E] font-medium"
                          : "text-gray-700"
                      } hover:bg-[#F8F2F5]`}
                      onClick={() => {
                        setFilter({ ...filter, month });
                        setShowMonthDropdown(false);
                      }}
                    >
                      {new Date(0, month - 1).toLocaleString("default", {
                        month: "long",
                      })}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="px-4 py-2 bg-gradient-to-r from-[#3D021E] to-[#6D0F3D] hover:from-[#4A0404] hover:to-[#7D1F4D] text-white rounded-lg text-sm transition-colors duration-300 shadow-md"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#3D021E]">
              {filter.month ? "Sales by Day" : "Sales by Month"}
            </h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-[#3D021E]">
              Orders by Status
            </h2>
            <div className="h-64 sm:h-80 lg:h-96">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
