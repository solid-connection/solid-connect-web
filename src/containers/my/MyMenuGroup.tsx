type MyMenuGroupItemProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  subject: string;
};

const MyMenuGroup = ({ children, icon, subject }: MyMenuGroupItemProps) => {
  return (
    <div>
      <div className="flex h-[33px] gap-1.5 bg-[#F4F5FA] py-2 pl-6">
        {icon} <span className="font-serif text-sm font-semibold text-primary-1">{subject}</span>
      </div>
      <div className="pb-5 pt-3">{children}</div>
    </div>
  );
};

export default MyMenuGroup;
