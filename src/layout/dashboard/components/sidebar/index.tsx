import "./_style.scss";

interface IProps {
  className?: string;
}

export const Sidebar = ({ className }: IProps) => {
  return (
    <div className={"component sidebar " + (className ?? "")}>Sidebar</div>
  );
};
