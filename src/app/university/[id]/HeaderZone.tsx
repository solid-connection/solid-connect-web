interface HeaderZoneProps {
  title: string;
  children?: React.ReactNode;
}

const HeaderZone = ({ title, children }: HeaderZoneProps) => {
  return (
    <div>
      <div className="mb-3 text-base font-semibold text-k-900">{title}</div>
      {children}
    </div>
  );
};

export default HeaderZone;
