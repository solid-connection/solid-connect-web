import React from "react";

export const colors = [
  // 첫 번째 행
  [
    { name: "primary-900", class: "bg-primary-900" },
    { name: "primary-800", class: "bg-primary-800" },
    { name: "primary-700", class: "bg-primary-700" },
    { name: "primary-600", class: "bg-primary-600" },
    { name: "primary", class: "bg-primary" },
    { name: "primary-500", class: "bg-primary-500" },
    { name: "primary-400", class: "bg-primary-400" },
    { name: "primary-300", class: "bg-primary-300" },
    { name: "primary-200", class: "bg-primary-200" },
    { name: "primary-100", class: "bg-primary-100" },
  ],
  [
    { name: "secondary-900", class: "bg-secondary-900" },
    { name: "secondary-800", class: "bg-secondary-800" },
    { name: "secondary-700", class: "bg-secondary-700" },
    { name: "secondary", class: "bg-secondary" },
    { name: "secondary-600", class: "bg-secondary-600" },
    { name: "secondary-500", class: "bg-secondary-500" },
    { name: "secondary-400", class: "bg-secondary-400" },
    { name: "secondary-300", class: "bg-secondary-300" },
    { name: "secondary-200", class: "bg-secondary-200" },
    { name: "secondary-100", class: "bg-secondary-100" },
  ],
  [
    { name: "sub-a", class: "bg-sub-a" },
    { name: "sub-a-500", class: "bg-sub-a-500" },
    { name: "sub-a-100", class: "bg-sub-a-100" },
  ],
  [
    { name: "sub-b", class: "bg-sub-b" },
    { name: "sub-b-500", class: "bg-sub-b-500" },
    { name: "sub-b-100", class: "bg-sub-b-100" },
  ],
  [
    { name: "background-1", class: "bg-background-1" },
    { name: "background-2", class: "bg-background-2" },
  ],
  [
    { name: "line-1", class: "bg-line-1" },
    { name: "line-2", class: "bg-line-2" },
  ],
];

const ColorsPage = () => {
  return (
    <div className="w-full">
      <div className="p-8">
        <h1 className="mb-6 text-2xl font-bold">디자인 시스템 색상 팔레트</h1>
        <div className="space-y-4">
          {colors.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-4">
              {row.map((color, colIndex) => (
                <div key={colIndex} className="text-center">
                  <div className={`mx-auto h-16 w-16 ${color.class} rounded`} />
                  <p className="mt-2 text-sm">{color.name}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorsPage;
