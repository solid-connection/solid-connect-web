import clsx from "clsx";

// 읽기 전용 필드 컴포넌트
interface ReadOnlyFieldProps {
  label: string;
  value: string;
  placeholder?: string;
}

const ReadOnlyField = ({ label, value, placeholder }: ReadOnlyFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-k-700 typo-medium-2">{label}</label>
      <div className="w-full rounded-lg border border-gray-300 bg-k-50 p-3">
        {/* 읽기 전용 값은 primary-200, 값 없으면 k-400 */}
        <span className={clsx("typo-regular-2", value ? "text-primary-200" : "text-k-400")}>
          {value || placeholder}
        </span>
      </div>
    </div>
  );
};
export default ReadOnlyField;
