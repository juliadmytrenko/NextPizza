import React from "react";
import GlobalLayout from "./GlobalLayout";
import AuthProvider from "./AuthProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalLayout>
      <AuthProvider>{children}</AuthProvider>
    </GlobalLayout>
  );
};

export default layout;
