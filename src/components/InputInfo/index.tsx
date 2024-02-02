"use client"

import { ComponentPropsWithoutRef, forwardRef } from "react";
import { twMerge } from 'tailwind-merge'

interface TInfo extends ComponentPropsWithoutRef<'input'>{
  subtitle: string;
  error?: string;
  valid?: boolean;
};

function InputInfo(
  { subtitle, readOnly = false, error, valid = false, ...restProps  }: TInfo,
  ref?: any
) {
  const borderBColor = error ? "border-b-[#f00]" : "border-b-[#003057]";
  const otherBorder = error
    ? "border-x-[#f00] border-t-[#f00]"
    : "border-x-[#CCC] border-t-[#CCC]";

  return (
    <div className={twMerge('w-full')}>
      <label
        className={
          twMerge('text-[12px] font-bold z-10 text-[#212529]')}
      >
        {subtitle}
      </label>
      <div
        className={twMerge(`
        h-[58px]
        w-full
        border-[1px] 
        border-solid
        border-b-[4px]
        ${borderBColor}
        ${otherBorder}
        flex 
        items-center
        justify-center 
    `)}
      >
        <input
          ref={ref}
          {...restProps}
          className={twMerge(`
          text-[18px]
          outline-none
          p-[8px]
          text-center
          w-full
          h-full
          font-bold
          disabled:bg-[#eee]
          ${error && "text-[#f00]"}
          ${readOnly && "text-[#003057]"}
          `)}
        />
      </div>
      <label
        className={twMerge("text-[12px] font-bold z-10 text-[#f00]")}
      >
        {error}
      </label>
    </div>
  );
}
export default forwardRef(InputInfo);
