import Image from "next/image";

export const Loader = ({ width, className }) => {
  return (
    <Image
      src="/assets/loader.svg"
      alt=""
      width={width ?? 110}
      height={0}
      className={`loader ${className}`}
    />
  );
};
