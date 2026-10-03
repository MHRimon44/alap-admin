import BrandLogo from "@/components/brand-logo";

export default function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <header>
      <div className="headerBrand">
        <BrandLogo size={28} />
        <p className="eyebrow">ALAP ADMIN</p>
      </div>
      <h1>{title}</h1>
      <p className="muted">{sub}</p>
    </header>
  );
}
