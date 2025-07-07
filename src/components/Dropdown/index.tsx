import React, { useCallback, useRef, useState } from "react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import "./_style.scss";

interface FromProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
  ref: React.Ref<HTMLButtonElement>;
  isOpen?: boolean;
}

interface IProps {
  className?: string;
  children?: React.ReactNode;
  from: (fromProps: FromProps) => React.ReactNode;
  closeOnDropdownClick?: boolean;
  buttons?: boolean;
}

export const Dropdown = ({
  from,
  children,
  className,
  closeOnDropdownClick = true,
  buttons,
}: IProps) => {
  // Dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);
  const buttonRef = useRef<HTMLButtonElement>(
    null as unknown as HTMLButtonElement
  );

  const handleDropdownToggle = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setDropdownOpen((prev) => !prev);
    },
    []
  );

  const customButton = from({
    onClick: handleDropdownToggle,
    ref: buttonRef,
    isOpen: dropdownOpen,
  });

  useOutsideClick(dropdownRef, () => {
    setDropdownOpen(false);
  });

  return (
    <div
      ref={dropdownRef}
      onClick={() => setDropdownOpen((d) => !d)}
      className={"component dropdown-team "}
    >
      {customButton}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (closeOnDropdownClick) setDropdownOpen(false);
        }}
        className={
          "dropdown " +
          (dropdownOpen ? "" : "hidden ") +
          (buttons ? "buttons " : "") +
          (className ?? "")
        }
      >
        {children}
      </div>
    </div>
  );
};
