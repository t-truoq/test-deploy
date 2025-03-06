"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export function ManageAccount() {
  const [activeTab, setActiveTab] = useState("personal");
  const [accountInfo, setAccountInfo] = useState({
    firstName: "Thanh Tam",
    lastName: "Bede",
    email: "thanhtam@example.com",
    phone: "+1234567890",
    role: "Staff",
    department: "Engineering",
    notifications: true,
    language: "english",
    timezone: "UTC+7",
  });

  const handleAccountInfoChange = (field, value) => {
    setAccountInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    console.log("Account info updated:", accountInfo);
    alert("Account information updated successfully!");
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Account</h1>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
              <h2 className="text-xl font-semibold">{`${accountInfo.firstName} ${accountInfo.lastName}`}</h2>
              <p className="text-sm text-gray-500">{accountInfo.email}</p>
              <span className="mt-2 px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                {accountInfo.role}
              </span>
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-lg shadow">
            <div className="flex border-b">
              <button
                className={`flex-1 py-4 px-6 text-center ${
                  activeTab === "personal"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center ${
                  activeTab === "account"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("account")}
              >
                Account
              </button>
            </div>

            {activeTab === "personal" && (
              <form onSubmit={handleAccountSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={accountInfo.firstName}
                      onChange={(e) =>
                        handleAccountInfoChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={accountInfo.lastName}
                      onChange={(e) =>
                        handleAccountInfoChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={accountInfo.email}
                    onChange={(e) =>
                      handleAccountInfoChange("email", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={accountInfo.phone}
                    onChange={(e) =>
                      handleAccountInfoChange("phone", e.target.value)
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === "account" && (
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive email notifications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={accountInfo.notifications}
                      onChange={(e) =>
                        handleAccountInfoChange(
                          "notifications",
                          e.target.checked
                        )
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <hr className="my-6" />
                <div>
                  <label
                    htmlFor="language"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={accountInfo.language}
                    onChange={(e) =>
                      handleAccountInfoChange("language", e.target.value)
                    }
                  >
                    <option value="english">English</option>
                    <option value="spanish">Tiếng việt</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Timezone
                  </label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={accountInfo.timezone}
                    onChange={(e) =>
                      handleAccountInfoChange("timezone", e.target.value)
                    }
                  >
                    <option value="UTC+7">UTC+7</option>
                    <option value="UTC+8">UTC+8</option>
                    <option value="UTC+9">UTC+9</option>
                  </select>
                </div>
                <button
                  onClick={handleAccountSubmit}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
