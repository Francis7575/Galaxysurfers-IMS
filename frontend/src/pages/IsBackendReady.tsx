import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const waitForBackend = async () => {
  let isReady = false;
  let attempts = 0;

  while (!isReady && attempts < 20) {
    try {
      await axiosInstance.get("/health");
      isReady = true;
    } catch {
      await new Promise((res) => setTimeout(res, 3000));
      attempts++;
    }
  }

  return isReady;
};

const CenteredContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen flex flex-col justify-center items-center px-6 text-center gap-2">
    {children}
  </div>
);

const IsBackendReady = () => (
  <CenteredContainer>
    <svg
      className="animate-spin h-12 w-12 text-green-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    <p className="mt-2 text-lg uppercase max-w-xl text-gray-700">
      The server may take up to 50 seconds to become active. Thank you for your patience.
    </p>
  </CenteredContainer>
);

const ErrorMessage = () => (
  <CenteredContainer>
    <p className="text-lg font-bold uppercase text-red-600 max-w-md">
      The server is currently unreachable. Please try again later.
    </p>
  </CenteredContainer>
);

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const [backendReady, setBackendReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackend = async () => {
      if (import.meta.env.MODE === "production") {
        const ready = await waitForBackend();
        setBackendReady(ready);
      } else {
        setBackendReady(true);
      }
      setLoading(false);
    };

    checkBackend();
  }, []);

  if (loading) return <IsBackendReady />;
  if (!backendReady) return <ErrorMessage />;

  return <>{children}</>;
};

export default AppLoader;
