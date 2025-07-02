"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Activity,
} from "lucide-react";

const ExpenseDashboard = () => {
  const [chartType, setChartType] = useState("line");
  const [animationKey, setAnimationKey] = useState(0);
  const [expenseData, setExpenseData] = useState([]);

  // const expenseData = [
  //   { day: "จันทร์", amount: 1250, DAY: "Mon", category: "อาหาร" },
  //   { day: "อังคาร", amount: 890, DAY: "Tue", category: "เดินทาง" },
  //   { day: "พุธ", amount: 2100, DAY: "Wed", category: "ช้อปปิ้ง" },
  //   { day: "พฤหัสบดี", amount: 756, DAY: "Thu", category: "อาหาร" },
  //   { day: "ศุกร์", amount: 1850, DAY: "Fri", category: "บันเทิง" },
  //   { day: "เสาร์", amount: 3200, DAY: "Sat", category: "ช้อปปิ้ง" },
  //   { day: "อาทิตย์", amount: 980, DAY: "Sun", category: "อาหาร" },
  // ];

  useEffect(()=>{
    fetch("https://expenses-api-o3fr.onrender.com/")
      .then((res) => res.json())
      .then((data) => setExpenseData(data));
  },[])

  const totalExpense = expenseData.reduce(
    (sum, item) => sum + item.TOTAL_PRICE,
    0
  );
  const averageExpense = Math.round(totalExpense / expenseData.length);
  const maxExpense = Math.max(...expenseData.map((item) => item?.TOTAL_PRICE));
  const minExpense = Math.min(...expenseData.map((item) => item?.TOTAL_PRICE));

  const trend =
    expenseData[expenseData.length - 1]?.TOTAL_PRICE > expenseData[0]?.TOTAL_PRICE
      ? "up"
      : "down";
  const trendPercentage = Math.abs(
    ((expenseData[expenseData.length - 1]?.TOTAL_PRICE -
      expenseData[0]?.TOTAL_PRICE) /
      expenseData[0]?.TOTAL_PRICE) *
      100
  ).toFixed(1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label}`}</p>
          <p className="text-blue-600">
            {`ใช้จ่าย: ${payload[0].value} บาท`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleChartTypeChange = (type) => {
    setChartType(type);
    setAnimationKey((prev) => prev + 1);
  };

  const renderChart = () => {
    const commonProps = {
      width: "100%",
      height: 400,
      data: expenseData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer key={animationKey} {...commonProps}>
            <BarChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="DAY" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer key={animationKey} {...commonProps}>
            <AreaChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="DAY" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="TOTAL_PRICE"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer key={animationKey} {...commonProps}>
            <LineChart data={expenseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="DAY" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="TOTAL_PRICE"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            📊 Dashboard การใช้จ่าย
          </h1>
          <p className="text-gray-600 text-lg">
            สรุปการใช้จ่ายรายวันในสัปดาห์นี้
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">รวมทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  ฿{totalExpense}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">เฉลี่ย/วัน</p>
                <p className="text-2xl font-bold text-gray-900">
                  ฿{averageExpense}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">สูงสุด</p>
                <p className="text-2xl font-bold text-gray-900">
                  ฿{maxExpense}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">แนวโน้ม</p>
                <p className="text-2xl font-bold text-gray-900 flex items-center">
                  {trend === "up" ? (
                    <TrendingUp className="w-5 h-5 text-red-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-green-500 mr-1" />
                  )}
                  {trendPercentage}%
                </p>
              </div>
              <div
                className={`${
                  trend === "up" ? "bg-red-100" : "bg-green-100"
                } p-3 rounded-lg`}
              >
                <BarChart3
                  className={`w-6 h-6 ${
                    trend === "up" ? "text-red-600" : "text-green-600"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">
              กราฟการใช้จ่ายรายวัน
            </h2>

            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleChartTypeChange("line")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === "line"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                เส้น
              </button>
              <button
                onClick={() => handleChartTypeChange("bar")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === "bar"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                แท่ง
              </button>
              <button
                onClick={() => handleChartTypeChange("area")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === "area"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                พื้นที่
              </button>
            </div>
          </div>

          <div className="w-full h-96 sm:h-[400px]">{renderChart()}</div>
        </div>


        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>อัปเดตล่าสุด: {new Date().toLocaleDateString("th-TH")}</p>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;
