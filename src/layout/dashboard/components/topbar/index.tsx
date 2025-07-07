import { User } from "@/types/apiTypes";
import "./_style.scss";
interface IProps {
  user: User;
  className?: string;
}

export const Topbar = ({ user, className }: IProps) => {
  return (
    <div className={"component topbar " + (className ?? "")}>
      <div>Bem vindo: {user.name}</div>
    </div>
  );
};
