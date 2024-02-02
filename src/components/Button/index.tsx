import { twMerge } from "tailwind-merge";

export type TButton = {
  btn: "primary" | "secondary";
  text: string;
  onClick?: () => void;
};

export default function Button({ text, btn, onClick }: TButton) {
  const btnStyle =
    btn === "primary"
      ? "bg-[#002C4F]  text-[#fff]"
      : "bg-[#ccc]  text-[#002C4F]";

  return (
    <button
      onClick={() => onClick?.()}
      type="button"
      className={twMerge(
        `h-[58px] w-full text-[18px] font-bold ${btnStyle}`
      )}
    >
      {text}
    </button>
  );
}
