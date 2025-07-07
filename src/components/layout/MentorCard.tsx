import Image from "next/image";
import React from "react";

interface MentorCardProps {
  name: string;
  description: string;
  avatar?: string;
}

const MentorCard = ({ name, description, avatar }: MentorCardProps) => {
  return (
    <div className="mb-3 flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex-shrink-0">
        {avatar ? (
          <Image src={avatar} alt={name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                fill="#9CA3AF"
              />
              <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" fill="#9CA3AF" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 text-sm font-medium text-k-900">{name}</h3>
        <p
          className="overflow-hidden text-ellipsis text-xs text-gray-600"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

export default MentorCard;
