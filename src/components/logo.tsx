import React from "react";

export const Logo = ({ showText = true }: { showText?: boolean }) => {
  return (
    <>
      <div className="size-5 border-4 border-black dark:border-white rounded-xs"></div>
      {showText && <p className="text-2xl font-bold leading-tight">Relion</p>}
    </>
  );
};
