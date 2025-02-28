import clsx from "clsx";
import { Child } from "hono/jsx";

export type ButtonProps = {
  children: Child;
  color: "blue" | "green";
};

const blueClassNames = [
  "bg-blue-700",
  "focus:ring-blue-300",
  "hover:bg-blue-800",
  "dark:bg-blue-600",
  "dark:hover:bg-blue-700",
  "dark:focus:ring-blue-800",
];

const greenClassNames = [
  "bg-green-700",
  "focus:ring-green-300",
  "hover:bg-green-800",
  "dark:bg-green-600",
  "dark:hover:bg-green-700",
  "dark:focus:ring-green-800",
];

const colorToColorClassNames = {
  blue: blueClassNames,
  green: greenClassNames,
} satisfies Record<ButtonProps["color"], string[]>;

export const Button = (props: ButtonProps) => (
  <button
    type="submit"
    className={clsx(
      "w-32",
      "text-white",
      "end-2.5",
      "bottom-2.5",
      "focus:ring-4",
      "focus:outline-none",
      "font-medium",
      "rounded-lg",
      "text-sm",
      "px-4",
      "py-2",
      ...colorToColorClassNames[props.color]
    )}
  >
    {props.children}
  </button>
);
