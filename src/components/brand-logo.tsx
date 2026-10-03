import Image from "next/image";

export default function BrandLogo({ size = 42, className = "" }: { size?: number; className?: string }) {
  return <Image src="/logo.png" alt="Alap logo" width={size} height={size} className={`brandLogo ${className}`} priority />;
}
