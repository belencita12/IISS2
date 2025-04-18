"use client";

type InputProps = {
  id: string;
  required?: boolean;
  className?: string;
  type: "text" | "number" | "formattedNumber";
  placeholder: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onkeydown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
};

export default function NumericInput({
  id,
  required,
  className = "",
  type,
  placeholder,
  value,
  onChange,
  onkeydown,
  error,
  disabled,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9,]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Delete"
    ) {
      e.preventDefault();
    }
  };

  const handleFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d,]/g, "");
    const parts = cleaned.split(",");

    if (parts.length > 2) return;

    const integerPart = parts[0].replace(/\./g, "");
    const decimalPart = parts[1] || "";

    if (integerPart === "") {
      onChange?.({
        ...e,
        target: { ...e.target, value: "0" },
      });
      return;
    }

    const cleanValue =
      decimalPart !== ""
        ? `${parseInt(integerPart)}.${decimalPart}`
        : `${parseInt(integerPart)}`;

    onChange?.({
      ...e,
      target: { ...e.target, value: cleanValue },
    });
  };

  const getFormattedValue = () => {
    if (value === undefined || value === "" || value === 0) return "";
    const [intPart, decPart] = String(value).split(".");
    const formatted = Number(intPart).toLocaleString("es-PY");
    return decPart ? `${formatted},${decPart}` : formatted;
  };

  const val = type === "formattedNumber" ? getFormattedValue() : value;

  const inputBaseClasses =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

  return (
    <div>
      <input
        id={id}
        name={id}
        type={type === "formattedNumber" ? "text" : type}
        placeholder={disabled ? "" : placeholder}
        disabled={disabled}
        value={val}
        required={required}
        min={type === "number" ? 1 : undefined}
        onChange={type === "formattedNumber" ? handleFormattedChange : onChange}
        onKeyDown={
          type === "formattedNumber" || type === "number"
            ? handleKeyDown
            : onkeydown
        }
        className={`${inputBaseClasses} ${className} ${
          error ? "border-red-500" : ""
        }`}
        maxLength={20}
      />
      {error && (
        <p title="mensaje de error" className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
