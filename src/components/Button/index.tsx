import React from "react";
import "./_style.scss";

export type ButtonType = "primary" | "secondary" | "tertiary" | "warning";
interface IProps {
  className?: string;
  disabled?: boolean;
  type?: ButtonType;
  buttonType?: "button" | "reset" | "submit";
  outlined?: boolean;
  children?: React.ReactNode;
  svgPathFilled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, IProps>(
  (
    {
      disabled,
      onClick,
      type,
      outlined,
      children,
      className,
      buttonType = "button",
      svgPathFilled,
      isLoading,
    }: IProps,
    ref
  ) => {
    return (
      <button
        disabled={isLoading || disabled}
        onClick={(e) => onClick?.(e)}
        ref={ref}
        type={buttonType}
        className={
          "component-button " +
          (type ? type + " " : "primary ") +
          (outlined ? " outlined " : "") +
          (svgPathFilled ? "svg-path-filled " : "") +
          className
        }
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Input";

export { Button };
