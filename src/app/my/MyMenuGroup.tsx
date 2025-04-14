type MyMenuGroupItemProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  subject: string;
};

const MyMenuGroup = ({ children, icon, subject }: MyMenuGroupItemProps) => (
  <div>
    <div className="flex h-[27px] items-center gap-1.5 bg-primary-100 py-1 pl-5">
      {icon} <span className="text-base font-semibold text-primary">{subject}</span>
    </div>
    <div className="flex flex-col gap-0.5 pb-4 pt-1">{children}</div>
  </div>
);

export default MyMenuGroup;
