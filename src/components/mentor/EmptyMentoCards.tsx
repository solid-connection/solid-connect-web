interface EmptyMentoCardsProps {
  message?: string;
}
const EmptyMentoCards = ({ message = "존재하지 않습니다" }: EmptyMentoCardsProps) => {
  return (
    <div className="shadow-sdwB flex h-[66px] w-full flex-shrink-0 items-center justify-center gap-[10px] rounded-lg bg-white px-4 py-[14px]">
      <p className="text-ellipsis text-sm font-normal leading-normal text-k-600">{message}</p>
    </div>
  );
};
export default EmptyMentoCards;
