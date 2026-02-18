type ApplicationSectionTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

const ApplicationSectionTitle = ({ title, description, className = "" }: ApplicationSectionTitleProps) => {
  return (
    <div className={className}>
      <h2 className="text-k-900 typo-bold-5">{title}</h2>
      {description ? <p className="mt-1 text-k-500 typo-regular-2">{description}</p> : null}
    </div>
  );
};

export default ApplicationSectionTitle;
