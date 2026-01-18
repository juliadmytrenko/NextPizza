import React from "react";
import GlobalLaout from "./GlobalLayout";
import AuthProvider from "./AuthProvider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalLaout>
      <AuthProvider>{children}</AuthProvider>
    </GlobalLaout>
  );
};

export default layout;
