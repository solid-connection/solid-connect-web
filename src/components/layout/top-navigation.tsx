export default function TopNavigation() {
  return (
    <div
      className="bg-primary-1 fixed top-0 z-[100] h-[56px] w-full max-w-[600px]"
      style={{
        boxShadow:
          "0px 1px 5px 0px rgba(0, 0, 0, 0.12), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="text-secondary-2 ml-[20px] mt-[15px] font-serif text-[16px] font-semibold leading-[160%] tracking-[0.15px]">
        Solid Connection
      </div>
    </div>
  );
}
