"use client";
import React, { useEffect, useState } from "react";
import io from "socket.io-client"; // ✅ นำเข้า

// ... ส่วน import เดิมของคุณ ...

const ExpenseDashboard = () => {
  const [chartType, setChartType] = useState("line");
  const [animationKey, setAnimationKey] = useState(0);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    // เรียก API ปกติ
    fetch("https://expenses-api-o3fr.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setExpenseData(data);
        setLoading(false);
      });

    // ✅ เชื่อม Socket.IO
    const socket = io("https://expenses-api-o3fr.onrender.com");

    // ฟัง event เมื่อมี expense ใหม่
    socket.on("newExpenseAdded", (newExpense) => {
      console.log("Received new expense:", newExpense);

      // ดึงข้อมูลใหม่ หรือจะ push ก็ได้ถ้าโครงสร้างเหมาะสม
      fetch("https://expenses-api-o3fr.onrender.com/")
        .then((res) => res.json())
        .then((data) => {
          setExpenseData(data);
        });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ... โค้ดส่วนที่เหลือคงเดิม ...

  const totalExpense = expenseData.reduce(
    (sum, item) => sum + item.TOTAL_PRICE,
    0
  );
  const averageExpense = Math.round(totalExpense / expenseData.length) || 0;
  const maxExpense =
    Math.max(...expenseData.map((item) => item?.TOTAL_PRICE)) || 0;
  const minExpense =
    Math.min(...expenseData.map((item) => item?.TOTAL_PRICE)) || 0;

  const trend =
    expenseData[expenseData.length - 1]?.TOTAL_PRICE >
    expenseData[0]?.TOTAL_PRICE
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
        <div className="bg-gray-900/90 backdrop-blur-md p-4 border border-cyan-500/30 rounded-2xl shadow-2xl">
          <p className="font-semibold text-white text-sm mb-1">{`${label}`}</p>
          <p className="text-cyan-400 font-medium">
            {`฿${payload[0].value?.toLocaleString()}`}
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
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099cc" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="DAY" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="TOTAL_PRICE"
                fill="url(#barGradient)"
                radius={[8, 8, 0, 0]}
                className="drop-shadow-lg"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer key={animationKey} {...commonProps}>
            <AreaChart data={expenseData}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#0099cc" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="DAY" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="TOTAL_PRICE"
                stroke="#00d4ff"
                strokeWidth={3}
                fill="url(#areaGradient)"
                className="drop-shadow-lg"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      default:
        return (
          <ResponsiveContainer key={animationKey} {...commonProps}>
            <LineChart data={expenseData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099cc" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
              />
              <XAxis dataKey="DAY" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="TOTAL_PRICE"
                stroke="url(#lineGradient)"
                strokeWidth={4}
                dot={{
                  fill: "#00d4ff",
                  strokeWidth: 2,
                  r: 6,
                  className: "drop-shadow-lg",
                }}
                activeDot={{
                  r: 10,
                  stroke: "#00d4ff",
                  strokeWidth: 3,
                  className: "drop-shadow-lg",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend: cardTrend }) => (
    <div
      className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 ${
        hoveredCard === title ? "z-10" : ""
      }`}
      onMouseEnter={() => setHoveredCard(title)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">{title}</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {loading ? (
                <div className="h-8 w-20 bg-gray-700/50 rounded-lg animate-pulse" />
              ) : (
                `฿${value?.toLocaleString()}`
              )}
            </p>
            {cardTrend && (
              <p className="text-xs text-gray-400 flex items-center">
                {cardTrend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-red-400 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-400 mr-1" />
                )}
                {trendPercentage}%
              </p>
            )}
          </div>
          <div
            className={`${color} p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-spin border-t-cyan-500" />
            <Zap className="w-8 h-8 text-cyan-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-lg font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              EXPENSE DASHBOARD
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              ระบบวิเคราะห์การใช้จ่ายอัจฉริยะ - เชื่อมต่อข้อมูลแบบเรียลไทม์
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="รวมทั้งหมด"
              value={totalExpense}
              icon={DollarSign}
              color="bg-gradient-to-r from-cyan-500 to-blue-600"
            />
            <StatCard
              title="เฉลี่ย/วัน"
              value={averageExpense}
              icon={Activity}
              color="bg-gradient-to-r from-green-500 to-teal-600"
            />
            <StatCard
              title="สูงสุด"
              value={maxExpense}
              icon={TrendingUp}
              color="bg-gradient-to-r from-red-500 to-pink-600"
            />
            <StatCard
              title="แนวโน้ม"
              value={parseFloat(trendPercentage)}
              icon={BarChart3}
              color={
                trend === "up"
                  ? "bg-gradient-to-r from-red-500 to-pink-600"
                  : "bg-gradient-to-r from-green-500 to-teal-600"
              }
              trend={trend}
            />
          </div>

          {/* Chart Section */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="flex items-center space-x-3 mb-4 lg:mb-0">
                  <Eye className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">
                    วิเคราะห์การใช้จ่าย
                  </h2>
                </div>

                <div className="flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-700/50">
                  {[
                    { type: "line", label: "เส้น", icon: "📈" },
                    { type: "bar", label: "แท่ง", icon: "📊" },
                    { type: "area", label: "พื้นที่", icon: "🏔️" },
                  ].map(({ type, label, icon }) => (
                    <button
                      key={type}
                      onClick={() => handleChartTypeChange(type)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        chartType === type
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg transform scale-105"
                          : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full h-96 sm:h-[400px] bg-gray-800/30 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30">
                {renderChart()}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <RefreshCw className="w-4 h-4" />
              <p className="text-sm">
                อัปเดตล่าสุด:{" "}
                {new Date().toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;
