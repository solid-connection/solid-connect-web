import { useController, useFormContext } from "react-hook-form";

import getErrorMessage from "@/lib/react-hook-form/getErrorMessage";

import type { ChannelType } from "@/types/mentor";
import ChannelSelect from "../../../../../../../components/mentor/ChannelSelct";

const CHANNEL_TAG_COLORS = [
  "bg-sub-c-100 text-sub-c-500",
  "bg-sub-e-100 text-sub-e-500",
  "bg-sub-d-100 text-sub-d-500",
  "bg-sub-f-100 text-sub-f-500",
];

interface ChannelItemProps {
  index: number;
  channel?: { type: ChannelType; url: string };
}

const ChannelItem = ({ index }: ChannelItemProps) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // 특정 필드만 감시
  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    field: { value: channelType },
  } = useController({
    name: `channels.${index}.type`,
    control,
    defaultValue: null,
  });

  const isChannelSelected = Boolean(channelType && channelType !== "" && channelType !== null);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const channelTypeError = errors.channels?.[index]?.type;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const channelUrlError = errors.channels?.[index]?.url;

  return (
    <div className={`mb-6 ${index > 0 ? "animate-channel-reveal" : ""}`}>
      <div className="flex h-6.5 w-17.5 items-center justify-center overflow-hidden rounded-2xl">
        <div
          className={`flex h-full w-full items-center justify-center rounded px-2 py-[3px] typo-medium-2 ${CHANNEL_TAG_COLORS[index] ?? "bg-gray-100 text-gray-500"}`}
        >
          내 채널 {index + 1}
        </div>
      </div>
      <h2 className="mt-2.5 text-k-700 typo-medium-1">채널 선택</h2>
      <div className="mt-2">
        <ChannelSelect
          control={control}
          name={`channels.${index}.type`}
          onChannelChange={() => setValue(`channels.${index}.url`, "")}
        />
      </div>
      {channelTypeError && (
        <p className="mt-1 text-red-500 typo-regular-2">{getErrorMessage(channelTypeError) || "채널을 선택해주세요"}</p>
      )}

      <h2 className="mt-5 text-k-700 typo-medium-1">
        링크 삽입 {isChannelSelected && <span className="text-red-500">*</span>}
      </h2>
      <input
        {...register(`channels.${index}.url`)}
        disabled={!isChannelSelected}
        className={`mt-2 h-11 w-full rounded-lg border px-4 py-3 typo-regular-2 ${
          isChannelSelected
            ? "border-k-100 bg-white text-k-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            : "cursor-not-allowed border-k-100 bg-k-50 text-gray-400"
        }`}
        placeholder={isChannelSelected ? "URL을 입력해주세요." : "채널을 먼저 선택해주세요."}
      />
      {isChannelSelected && channelUrlError && (
        <p className="mt-1 text-red-500 typo-regular-2">{getErrorMessage(channelUrlError) || "URL을 입력해주세요"}</p>
      )}
    </div>
  );
};

export default ChannelItem;
