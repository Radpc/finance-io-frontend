import { Outlet } from "react-router-dom";

export const LayoutAuth = () => {
  return (
    <div className="layout auth">
      <Outlet />
    </div>
  );
};
