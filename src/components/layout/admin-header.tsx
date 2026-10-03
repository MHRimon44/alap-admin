export default function Header({ title, sub }: { title: string; sub: string }) {
  return (
    <header>
      <p className="eyebrow">ALAP ADMIN</p>
      <h1>{title}</h1>
      <p className="muted">{sub}</p>
    </header>
  );
}
