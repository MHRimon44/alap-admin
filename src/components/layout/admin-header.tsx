import BrandLogo from "@/components/brand-logo";

export default function Header({
  title,
  sub,
  actions,
}: {
  title: string;
  sub: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="pageHeader">
      <div className="pageHeading">
        <div className="headerBrand">
          <BrandLogo size={28} />
          <p className="eyebrow">ALAP ADMIN</p>
        </div>
        <h1>{title}</h1>
        <p className="muted">{sub}</p>
      </div>
      {actions && <div className="headerActions">{actions}</div>}
    </header>
  );
}
