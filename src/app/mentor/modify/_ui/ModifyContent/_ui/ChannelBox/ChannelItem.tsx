import { useController, useFormContext } from "react-hook-form";

import ChannelBadge from "@/components/ui/ChannelBadge";
import getErrorMessage from "@/lib/react-hook-form/getErrorMessage";

import type { ChannelType } from "@/types/mentor";
import ChannelSelect from "../../../../../../../components/mentor/ChannelSelct";

interface ChannelItemProps {
  index: number;
  channel?: { type: ChannelType; url: string };
}

const ChannelItem = ({ index, channel }: ChannelItemProps) => {
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
    <div className="mb-6">
      <div className="flex h-6.5 w-17.5 items-center justify-center overflow-hidden rounded-2xl">
        {channel?.type ? (
          <ChannelBadge channelType={channel.type} text={`내 채널${index + 1}`} />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded bg-gray-100 px-2 py-[3px] text-gray-500 typo-medium-2">
            내 채널{index + 1}
          </div>
        )}
      </div>
      <h2 className="mt-2.5 text-k-700 typo-medium-1">채널 선택</h2>
      <ChannelSelect
        control={control}
        name={`channels.${index}.type`}
        onChannelChange={() => setValue(`channels.${index}.url`, "")}
      />
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
            ? "border-gray-300 bg-white text-k-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            : "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
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
