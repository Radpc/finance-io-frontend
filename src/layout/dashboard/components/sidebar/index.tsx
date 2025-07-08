import { Link } from "react-router-dom";
import "./_style.scss";

interface IProps {
  className?: string;
}

export const Sidebar = ({ className }: IProps) => {
  return (
    <div className={"component sidebar " + (className ?? "")}>
      <nav>
        <Link to={"/dashboard/categories"}>Categories</Link>
        <Link to={"/dashboard/payments"}>Payments</Link>
      </nav>
    </div>
  );
};
