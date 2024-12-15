"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { toast } from "react-hot-toast";
import { api } from "../../utils/url";
// import { useCheckToken } from "../../utils/authenticate";
import { loginWithAccessToken } from "../../utils/authenticate";

const LoginPage = () => {
  const { token, setToken, storeData, setStoreData } = useAuth();
  const router = useRouter();
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const checkToken = useCheckToken();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api({
        url: "/store/store-login",
        type: "post",
        data: { userName, password },
      });

      if (response.status === 200) {
        const data: any = response.data;
        setToken(data.accessToken);
        localStorage.setItem("jwtToken", data.accessToken);
        toast.success("Login successful!");
        router.push("/store-dashboard");
      } else {
        toast.error("Invalid credentials.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleSampleCreds = () => {
    setuserName("storeA");
    setPassword("storeA");
  };

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

      if (userValid) {
        router.push("/store-dashboard");
      } else {
        router.push("/");
      }
    };

    isUserLoggedIn();
  }, [router, setStoreData, setToken]);

  return (
    <div className="font-Manrope min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="min-h-screen flex justify-center items-center bg-green-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-3xl font-bold text-center text-yellow-500 mb-6">
            Login
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="userName"
                placeholder="Username"
                value={userName}
                onChange={(e) => setuserName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-green-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-yellow-500"
              />
            </div>
            <div className="mb-6 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg border-green-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 text-yellow-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-yellow-500" />
                ) : (
                  <FaEye className="text-yellow-500" />
                )}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Login
            </button>
          </form>
          <button
            type="button"
            onClick={handleSampleCreds}
            className="w-full mt-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Use Sample Creds
          </button>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-yellow-500 text-yellow-100 py-4 text-center fixed bottom-0 w-full">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Okra. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
