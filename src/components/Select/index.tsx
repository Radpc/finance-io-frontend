import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./_style.scss";

import SvgCross from "@/assets/img/icons/Cross.svg?react";
import SvgChevronDown from "@/assets/img/icons/ChevronDown.svg?react";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useDebounce } from "@/hooks/useDebounce";
import ReactDOM from "react-dom";

// type Nullabe<T> = T | null;

export interface Option<T> {
  label: string | React.ReactNode;
  optionLabel?: string | React.ReactNode;
  value: T;
  disabled?: boolean;
}

type SingleValue<T> = Option<T> | null;
type MultiValue<T> = readonly Option<T>[];
type SelectedOption<T, IsMulti> = IsMulti extends true
  ? MultiValue<T>
  : SingleValue<T>;
type SelectedValue<T, IsMulti> = IsMulti extends true ? T[] : T;

interface IProps<T, IsMulti extends boolean> {
  placeholder?: string;
  isMulti?: IsMulti;
  clearable?: boolean;
  options?: Option<T>[];
  optionsLoading?: boolean;
  disabled?: boolean;
  value?: SelectedValue<T, IsMulti>;
  small?: boolean;
  isSearchable?: boolean;
  className?: string;
  onChange?: (newValue: SelectedValue<T, IsMulti>) => void;
  customLabel?: (newValue: SelectedOption<T, IsMulti>) => React.ReactNode;
  compareBy?: (firstValue: T, secondValue: T) => boolean;
  label?: React.ReactNode;
  preppend?: string | React.ReactNode;
  onSearch?: (search: string) => unknown | Promise<unknown>;
  required?: boolean;
  error?: string;
  noError?: boolean;
  fallbackLabel?: (item: T) => string | React.ReactNode;
  optionsDirection?: "down" | "up";
  hasCheckbox?: boolean;
  headerContent?: React.ReactNode;
  headerOnClick?: () => void;
  headerContentClassName?: string;
}

enum SelectDirection {
  Down = "down",
  Up = "up",
}

const Select = <T, IsMulti extends boolean = false>({
  label,
  placeholder = "Selecione",
  options,
  isSearchable,
  disabled,
  small,
  clearable,
  value,
  customLabel,
  isMulti,
  optionsLoading,
  className,
  compareBy,
  onChange,
  preppend,
  onSearch,
  required,
  error,
  fallbackLabel,
  noError,
  hasCheckbox,
  headerContent,
  headerContentClassName,
  optionsDirection,
  headerOnClick,
}: IProps<T, IsMulti>) => {
  const document = useMemo(() => window.document, [window]);

  const [showMenu, setShowMenu] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    SelectedOption<T, IsMulti>
  >((isMulti ? [] : null) as never);
  const [selectedValue, setSelectedValue] = useState<SelectedValue<T, IsMulti>>(
    (isMulti ? [] : null) as never
  );
  const [searchValue, setSearchValue] = useState("");
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const searchRef = useRef<HTMLInputElement>(
    null as unknown as HTMLInputElement
  );
  const inputRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  const searchDebounce = useDebounce(searchValue);

  const debouncingSearch = useMemo(
    () => searchDebounce.trim() !== searchValue,
    [searchDebounce, searchValue]
  );

  const [coords, setCoords] = useState<{
    left?: number;
    top?: number;
    width?: number;
    bottom?: number;
  }>({ left: 0, top: 0, width: 0 });

  useEffect(() => {
    if (onSearch) emitOnSearch(searchValue);
  }, [searchValue]);

  const emitOnSearch = useCallback(
    (searchBy: string) => {
      if (onSearch) {
        const searchValue = searchBy.trim();
        onSearch(searchValue);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value as SelectedValue<T, IsMulti>);

      if (isMulti) {
        const vals = value as T[];
        const opts =
          options?.filter((o) => vals.some((v) => compareValues(o.value, v))) ||
          [];
        setSelectedOption(opts as unknown as SelectedOption<T, IsMulti>);
      } else {
        const v = value as T;
        const opt = options?.find((o) => compareValues(o.value, v)) || null;
        setSelectedOption(opt as unknown as SelectedOption<T, IsMulti>);
      }
    } else {
      setSelectedValue((isMulti ? [] : null) as never);
      setSelectedOption((isMulti ? [] : null) as never);
    }
  }, [value, options]);

  useOutsideClick(
    inputRef,
    () => {
      setShowMenu(false);
    },
    "click",
    document
  );

  const handleInputClick = () => {
    if (!disabled) setShowMenu(!showMenu);
  };

  const compareValues = useCallback(
    (value1: T, value2: T) =>
      compareBy ? compareBy(value1, value2) : value1 === value2,
    [compareBy]
  );

  const getDisplay = (): React.ReactNode => {
    const isArray = Array.isArray(selectedValue);

    if (
      selectedValue === null ||
      selectedValue === undefined ||
      selectedValue === "" ||
      (isArray && selectedValue.length === 0)
    ) {
      return <div className="placeholder">{placeholder}</div>;
    } else if (customLabel) {
      return customLabel(getValueOptions(selectedValue));
    } else if (isArray) {
      return (
        <div className="selected-options">
          {selectedValue.slice(0, 1).map((value, index) => (
            <div key={index} className="selected-option">
              <Tag removable onTagRemove={() => onTagRemove(value)}>
                {getValueOption(value)?.label ??
                  fallbackLabel?.(value) ??
                  value?.toString() ??
                  "-"}
              </Tag>
            </div>
          ))}
          {selectedValue.length > 1 && (
            <span className="plus">+{selectedValue.length - 1}</span>
          )}
        </div>
      );
    } else {
      return (
        <div className="selected-option">
          {getValueOption(selectedValue as T)?.label ??
            fallbackLabel?.(selectedValue as T)}
        </div>
      );
    }
  };

  const getValueOptions = (
    values: SelectedValue<T, IsMulti>
  ): SelectedOption<T, IsMulti> => {
    const isArray = Array.isArray(values);
    if (isArray) {
      return values.map((v) => getValueOption(v)).filter((a) => a) as never;
    } else {
      return getValueOption(values as T) as SelectedOption<T, IsMulti>;
    }
  };

  const getValueOption = (value: T): Option<T> | undefined => {
    if (isMulti) {
      const options = selectedOption as Option<T>[];
      return (
        options.find((o) => compareValues(o.value, value)) ||
        options?.find((o) => compareValues(o.value, value))
      );
    } else {
      const option = selectedOption as Option<T>;
      return option && compareValues(option.value, value)
        ? option
        : options?.find((o) => compareValues(o.value, value));
    }
  };

  const removeSelected = (valueToRemove: T): SelectedValue<T, IsMulti> => {
    return (selectedValue as T[]).filter(
      (o) => !compareValues(o, valueToRemove)
    ) as SelectedValue<T, IsMulti>;
  };

  const clearSelection = () => {
    const newSelected = (isMulti ? [] : null) as never;
    const newOptionsSelected = (isMulti ? [] : null) as never;
    setSelectedValue(newSelected);
    setSelectedOption(newOptionsSelected);
    onChange?.(newSelected);
  };

  const isCrossVisible = useMemo((): boolean => {
    const isArray = Array.isArray(selectedValue);
    if (isArray) {
      return selectedValue.length > 1;
    } else {
      return selectedValue !== null;
    }
  }, [selectedValue]);

  const onTagRemove = (value: T) => {
    const newSelected: SelectedValue<T, IsMulti> = removeSelected(value);
    setSelectedValue(newSelected as never);
    onChange?.(newSelected);

    // Remove from option select
    setSelectedOption(
      (oldOptions) =>
        (oldOptions as Option<T>[]).filter(
          (o) => !compareValues(o.value, value)
        ) as unknown as SelectedOption<T, IsMulti>
    );
  };

  const onOptionClick = (option: Option<T>) => {
    const isArray = Array.isArray(selectedValue);
    let newSelected;

    if (isArray) {
      if (selectedValue.some((o) => compareValues(o, option.value))) {
        newSelected = removeSelected(option.value);
        setSelectedOption(
          (oldOptions) =>
            (oldOptions as Option<T>[]).filter(
              (o) => !compareValues(o.value, option.value)
            ) as unknown as SelectedOption<T, IsMulti>
        );
      } else {
        newSelected = [...selectedValue, option.value];
        setSelectedOption(
          (oldOptions) =>
            [
              ...(oldOptions as Option<T>[]),
              option,
            ] as unknown as SelectedOption<T, IsMulti>
        );
      }
    } else {
      newSelected = option.value;
      setSelectedOption(option as SelectedOption<T, IsMulti>);
    }

    if (!isMulti) {
      setShowMenu(false);
    }

    setSelectedValue(newSelected as SelectedValue<T, IsMulti>);
    onChange?.(newSelected as SelectedValue<T, IsMulti>);
  };

  const isSelected = (option: Option<T>) => {
    const isArray = Array.isArray(selectedValue);

    if (isArray) {
      return selectedValue.some((o) => compareValues(o, option.value));
    } else if (!selectedValue) {
      return false;
    } else return compareValues(selectedValue as T, option.value);
  };

  const visibleOptions = useMemo(() => {
    if (!options) return [];

    if (!searchValue || onSearch) {
      return options;
    }

    // Manual filtering
    return options?.filter((option) => {
      const label = option.label;

      if (typeof label === "string") {
        return label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0;
      } else {
        return (
          (label
            ?.toString()
            .replace(/\W/g, "")
            .toLowerCase()
            .indexOf(searchValue.toLowerCase()) || 0) >= 0
        );
      }
    });
  }, [options, searchValue]);

  const direction = useMemo(() => {
    const spaceBelow =
      window.innerHeight -
      (inputRef.current?.getBoundingClientRect().bottom || 0);
    return spaceBelow > dropdownHeight
      ? SelectDirection.Down
      : SelectDirection.Up;
  }, [showMenu, dropdownHeight]);

  const onSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && visibleOptions.length > 0) {
      onOptionClick(visibleOptions[0]);
      setSearchValue("");
      // setShowMenu(false);
    }
  };

  const measuredRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      const height = node.getBoundingClientRect().height;
      setDropdownHeight(height);
    }
  }, []);

  const updateDropdownCoords = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect();
    const spaceBelow = window.innerHeight - (rect?.bottom || 0);
    const spaceAbove = rect?.top || 0;

    if (rect) {
      const opensDown = spaceBelow > dropdownHeight || spaceBelow >= spaceAbove;
      setCoords({
        left: rect.left,
        width: rect.width,
        top: opensDown ? rect.bottom + window.scrollY + 2 : undefined,
        bottom: !opensDown
          ? window.innerHeight - rect.top - window.scrollY + 12
          : undefined,
      });
    }
  }, [dropdownHeight, inputRef]);

  useEffect(() => {
    if (showMenu) {
      updateDropdownCoords();
      document.addEventListener("scroll", updateDropdownCoords, true);
      window.addEventListener("resize", updateDropdownCoords, true);
    }

    return () => {
      document.removeEventListener("scroll", updateDropdownCoords, true);
      window.removeEventListener("resize", updateDropdownCoords, true);
    };
  }, [
    updateDropdownCoords,
    showMenu,
    debouncingSearch,
    document,
    selectedValue,
  ]);

  return (
    <div
      className={
        "component-select " +
        (disabled ? "unavailable  " : "") +
        (error ? "error  " : "") +
        ("direction-" + direction + " ") +
        (className ?? "")
      }
    >
      {label && (
        <span className="select-label">
          {label}
          {required ? <span className="asterisk">*</span> : ""}
        </span>
      )}
      <div
        tabIndex={0}
        role="button"
        onKeyUp={(e) => e.key === "Enter" && handleInputClick()}
        ref={inputRef}
        onClick={handleInputClick}
        className={"select-input "}
      >
        <div className="content-input">
          {preppend}
          {getDisplay()}
        </div>
        <div className="icons">
          {clearable && isCrossVisible && (
            <SvgCross
              className={"icon cross hoverable "}
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
            />
          )}
          <SvgChevronDown
            className={showMenu ? "icon upside " : "icon hoverable"}
          />
        </div>
      </div>
      {showMenu &&
        ReactDOM.createPortal(
          <div
            ref={measuredRef}
            className={
              "component dropdown " +
              (optionsDirection === SelectDirection.Up ||
              direction === SelectDirection.Up
                ? "upside "
                : "") +
              (small ? "small" : "")
            }
            style={{ ...coords }}
          >
            {isSearchable && (
              <div className="search-box">
                <input
                  onKeyUp={onSearchKeyPress}
                  placeholder="Pesquisar"
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                  ref={searchRef}
                />
              </div>
            )}

            {headerContent && (
              <div
                onClick={headerOnClick}
                className={`select header-content ${
                  headerContentClassName ?? ""
                }`}
              >
                {headerContent}
              </div>
            )}

            <div className="options">
              {optionsLoading ? (
                <div className="loading">Carregando...</div>
              ) : visibleOptions.length > 0 ? (
                visibleOptions.map((option, index) => (
                  <div
                    tabIndex={index + 1}
                    role="button"
                    onClick={(e) => {
                      if (hasCheckbox) {
                        e.stopPropagation();
                      } else {
                        e.stopPropagation();
                        onOptionClick(option);
                      }
                    }}
                    key={`${index}_${option.label?.toString() || ""}`}
                    className={
                      `option ${isSelected(option) ? "selected" : ""} ` +
                      (option.disabled ? "disabled" : "")
                    }
                  >
                    {hasCheckbox ? (
                      <label className="checkbox-team">
                        <input
                          type="checkbox"
                          checked={isSelected(option)}
                          disabled={option.disabled}
                          onChange={() => onOptionClick(option)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ) : (
                      option.label
                    )}
                  </div>
                ))
              ) : (
                <div className="no-items">
                  <span>Sem resultados</span>
                </div>
              )}
            </div>
          </div>,
          document.getElementById("root") as HTMLElement
        )}
      {!noError && <small className="error">{error}</small>}
    </div>
  );
};

interface TagIProps {
  removable?: boolean;
  onTagRemove?: () => void;
  children?: React.ReactNode;
  noBackground?: boolean;
  plusSymbolTag?: boolean;
}

const Tag = ({
  onTagRemove,
  removable,
  children,
  noBackground = false,
  plusSymbolTag = false,
}: TagIProps) => {
  return (
    <div
      className={
        "component-tag " +
        (noBackground ? "no-background " : "") +
        (plusSymbolTag ? "plus-tag " : "")
      }
    >
      <div className="tag-content">{children}</div>
      {removable && (
        <SvgCross
          className="remove"
          onClick={(e) => {
            e.stopPropagation();
            onTagRemove?.();
          }}
        />
      )}
    </div>
  );
};

export { Select, Tag };
