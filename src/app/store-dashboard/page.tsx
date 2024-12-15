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

  const router = useRouter();

  useEffect(() => {
    const isUserLoggedIn = async () => {
      const accessToken = localStorage.getItem("jwtToken");
      console.log(accessToken, "accessToken");

      if (!accessToken) {
        console.log("No token found, redirecting to login.");
        return router.push("/");
      }

      const userValid = await loginWithAccessToken(
        accessToken,
        setStoreData,
        setToken
      );

      if (userValid) {
        console.log("User is valid, redirecting to dashboard.");
        router.push("/store-dashboard");
      } else {
        console.log("Invalid token, redirecting to login.", userValid);
        router.push("/");
      }
    };

    isUserLoggedIn();
  }, [router, setStoreData, setToken]);

  useEffect(() => {
    console.log("Token:", token);
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

      const data: any = response.data;
      if (response.status === 200) {
        setOrders(data.ordersAssociated);
        setFilteredOrders(data.ordersAssociated);
      } else {
        console.error("Error fetching orders:");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  //   const handleFilterChange = (e) => {
  //     setFilters({ ...filters, [e.target.name]: e.target.value });
  //   };

  //   const applyFilters = () => {
  //     let result = [...orders];
  //     if (filters.from && filters.to) {
  //       result = result.filter(
  //         (order) =>
  //           new Date(order.date) >= new Date(filters.from) &&
  //           new Date(order.date) <= new Date(filters.to)
  //       );
  //     }
  //     if (filters.aggregator) {
  //       result = result.filter(
  //         (order) => order.aggregator === filters.aggregator
  //       );
  //     }
  //     setFilteredOrders(result);
  //   };

  //   const handleSort = (field) => {
  //     const sortedOrders = [...filteredOrders].sort((a, b) =>
  //       field === "date"
  //         ? new Date(a[field]) - new Date(b[field])
  //         : a[field] - b[field]
  //     );
  //     setFilteredOrders(sortedOrders);
  //     setSortBy(field);
  //   };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-6">
        Store Dashboard: {storeData?.name}
      </h1>
      <div className="flex gap-4 mb-4">
        {/* Filters */}
        <input
          type="date"
          name="from"
          value={filters.from}
          //   onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="From"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          //   onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="To"
        />
        <input
          type="text"
          name="aggregator"
          value={filters.aggregator}
          //   onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="Aggregator"
        />
        <button
          //   onClick={applyFilters}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Apply Filters
        </button>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="border border-gray-300 p-2">Store ID</th>
            <th className="border border-gray-300 p-2">Items</th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              //   onClick={() => handleSort("aggregator")}
            >
              Aggregator
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              //   onClick={() => handleSort("netAmount")}
            >
              Net Amount
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              //   onClick={() => handleSort("grossAmount")}
            >
              Gross Amount
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              //   onClick={() => handleSort("tax")}
            >
              Tax
            </th>
            <th
              className="border border-gray-300 p-2 cursor-pointer"
              //   onClick={() => handleSort("discounts")}
            >
              Discounts
            </th>
            <th className="border border-gray-300 p-2">Event Log</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order: any, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 p-2">{order.storeId}</td>
              <td className="border border-gray-300 p-2">
                {order.items.join(", ")}
              </td>
              <td className="border border-gray-300 p-2">{order.aggregator}</td>
              <td className="border border-gray-300 p-2">{order.netAmount}</td>
              <td className="border border-gray-300 p-2">
                {order.grossAmount}
              </td>
              <td className="border border-gray-300 p-2">{order.tax}</td>
              <td className="border border-gray-300 p-2">{order.discount}%</td>
              <td className="border border-gray-300 p-2">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreDashboard;
