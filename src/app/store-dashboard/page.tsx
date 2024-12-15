"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "../../../utils/url";
import { loginWithAccessToken } from "../../../utils/authenticate";
import { useRouter } from "next/navigation";

const StoreDashboard = () => {
  const { token, storeData, setToken, setStoreData } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", aggregator: "" });
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const router = useRouter();

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const accessToken = localStorage.getItem("jwtToken");
      if (!accessToken) {
        return router.push("/");
      }

      const userValid = await loginWithAccessToken(
        accessToken,
        setStoreData,
        setToken
      );

      if (!userValid) {
        router.push("/");
      }
    };

    isUserLoggedIn();
  }, [router, setStoreData, setToken]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await api({
        url: "/store/store-details",
        type: "get",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const data: any = response.data;
        setOrders(data.ordersAssociated);
        setFilteredOrders(data.ordersAssociated);
      } else {
        console.error("Error fetching orders:");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSort = (field: any) => {
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order);
    setSortBy(field);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      const valA = field === "deliveryTime" ? new Date(a[field]) : a[field];
      const valB = field === "deliveryTime" ? new Date(b[field]) : b[field];

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredOrders(sortedOrders);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-6 py-14">
      <div className="max-w-6xl w-full">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6 text-center">
          Store Dashboard: {storeData?.name}
        </h1>
         {/* Filters */}
         <div className="flex space-x-4 mb-4">
         <input
            type="date"
            name="from"
            value={filters.from}
            className="border p-2 rounded bg-gray-800 text-white"
            placeholder="From"
          />
          <input
            type="date"
            name="to"
            value={filters.to}
            className="border p-2 rounded bg-gray-800 text-white"
            placeholder="To"
          />
          <input
            type="text"
            name="aggregator"
            value={filters.aggregator}
            className="border p-2 rounded bg-gray-800 text-white"
            placeholder="Aggregator"
          />
          <button className="bg-yellow-500 text-gray-900 px-4 py-2 rounded hover:bg-yellow-600">
            Apply Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-4 border border-gray-700 text-yellow-300">Order ID</th>
                <th className="p-4 border border-gray-700 text-yellow-300">Items</th>
                <th className="p-4 border border-gray-700 text-yellow-300">Aggregator</th>
                <th
                  className="p-4 border border-gray-700 text-yellow-300 cursor-pointer"
                  onClick={() => handleSort("netAmount")}
                >
                  Net Amount {sortBy === "netAmount" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 border border-gray-700 text-yellow-300 cursor-pointer"
                  onClick={() => handleSort("grossAmount")}
                >
                  Gross Amount {sortBy === "grossAmount" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 border border-gray-700 text-yellow-300 cursor-pointer"
                  onClick={() => handleSort("tax")}
                >
                  Tax {sortBy === "tax" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-4 border border-gray-700 text-yellow-300 cursor-pointer"
                  onClick={() => handleSort("discount")}
                >
                  Discounts {sortBy === "discount" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 border border-gray-700 text-yellow-300">Status</th>
                <th
                  className="p-4 border border-gray-700 text-yellow-300 cursor-pointer"
                  onClick={() => handleSort("deliveryTime")}
                >
                  Delivery Time {sortBy === "deliveryTime" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: any, index) => (
                <tr
                  key={index}
                  className="odd:bg-gray-800 even:bg-gray-700 text-center"
                >
                  <td className="p-4 border border-gray-700 text-green-400">
                    {order._id.substring(order._id.length - 5)}
                  </td>
                  <td className="p-4 border border-gray-700">
                    {order.items.join(", ")}
                  </td>
                  <td className="p-4 border border-gray-700">
                    {order.aggregator}
                  </td>
                  <td className="p-4 border border-gray-700">
                    {order.netAmount}
                  </td>
                  <td className="p-4 border border-gray-700">
                    {order.grossAmount}
                  </td>
                  <td className="p-4 border border-gray-700">{order.tax}</td>
                  <td className="p-4 border border-gray-700">
                    {order.discount}%
                  </td>
                  <td className="p-4 border border-gray-700">{order.status}</td>
                  <td className="p-4 border border-gray-700">
                    {new Date(order.deliveryTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
