import React, { useState } from "react";
import {
  Send,
  DollarSign,
  MapPin,
  Utensils,
  Tag,
  Sparkles,
} from "lucide-react";

export default function FoodExpenseForm() {
  const [formData, setFormData] = useState({
    Name: "",
    Category_id: 1,
    Price: "",
    Desc: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Price" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("https://expenses-api-o3fr.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Price: parseFloat(formData.Price),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ Name: "", Category_id: 1, Price: "", Desc: "" });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setError("เกิดข้อผิดพลาดในการส่งข้อมูล");
      }
    } catch (err) {
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            เพิ่มรายการอาหาร
          </h1>
          <p className="text-gray-300">บันทึกความอร่อยของคุณ</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-white/20">
            {/* Name Field */}
            <div className="relative mb-6">
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                ชื่ออาหาร
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                placeholder="ข้าวมันไก่"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm appearance-none"
                style={{
                  WebkitAppearance: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "16px",
                }}
                required
              />
            </div>

            {/* Category Field */}
            <div className="relative mb-6">
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                หมวดหมู่
              </label>
              <select
                name="Category_id"
                value={formData.Category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm appearance-none"
                style={{
                  WebkitAppearance: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "16px",
                }}
              >
                <option value={1} className="bg-gray-800 text-white">
                  อาหารหลัก
                </option>
                <option value={2} className="bg-gray-800 text-white">
                  ขนม
                </option>
                <option value={3} className="bg-gray-800 text-white">
                  เครื่องดื่ม
                </option>
              </select>
            </div>

            {/* Price Field */}
            <div className="relative mb-6">
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                ราคา (บาท)
              </label>
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleChange}
                placeholder="40.00"
                step="0.01"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm appearance-none"
                style={{
                  WebkitAppearance: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "16px",
                }}
                required
              />
            </div>

            {/* Description Field */}
            <div className="relative mb-6">
              <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                รายละเอียด
              </label>
              <textarea
                name="Desc"
                value={formData.Desc}
                onChange={handleChange}
                placeholder="ข้าง 7-11"
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent focus:bg-white/20 transition-all duration-300 backdrop-blur-sm resize-none appearance-none"
                style={{
                  WebkitAppearance: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "white",
                  borderRadius: "16px",
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                กำลังส่ง...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                บันทึกรายการ
              </>
            )}
          </button>

          {/* Success Message */}
          {submitted && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-green-300 text-center font-medium">
                ✨ บันทึกสำเร็จแล้ว!
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-red-300 text-center font-medium">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>🍽️ ทุกมื้ออาหารคือความทรงจำ</p>
        </div>
      </div>
    </div>
  );
}
