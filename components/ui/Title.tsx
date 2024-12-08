export default function TitleSection({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="text-center caca text-4xl md:text-5xl xl:text-5xl font-bold">{children}</div>
    );
  }