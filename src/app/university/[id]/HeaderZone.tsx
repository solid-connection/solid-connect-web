const HeaderZone = ({ title, children }: { title: string; children?: React.ReactNode }) => {
  return (
    <div>
      <div className="mb-3 text-base font-semibold text-k-900">{title}</div>
      {children}
    </div>
  );
};

export default HeaderZone;
