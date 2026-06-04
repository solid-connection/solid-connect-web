import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReportedPostsState {
  reportedPostIds: number[];
  blockedUserIds: number[];
  blockedPostIds: number[];
  addReportedPost: (postId: number) => void;
  addBlockedUser: (userId: number) => void;
  addBlockedPost: (postId: number) => void;
  removeBlockedUser: (userId: number) => void;
}

const useReportedPostsStore = create<ReportedPostsState>()(
  persist(
    (set) => ({
      reportedPostIds: [],
      blockedUserIds: [],
      blockedPostIds: [],
      addReportedPost: (postId) => {
        set((state) => {
          if (state.reportedPostIds.includes(postId)) {
            return state;
          }

          return {
            reportedPostIds: [...state.reportedPostIds, postId],
          };
        });
      },
      addBlockedUser: (userId) => {
        set((state) => {
          if (state.blockedUserIds.includes(userId)) {
            return state;
          }

          return {
            blockedUserIds: [...state.blockedUserIds, userId],
          };
        });
      },
      addBlockedPost: (postId) => {
        set((state) => {
          if (state.blockedPostIds.includes(postId)) {
            return state;
          }

          return {
            blockedPostIds: [...state.blockedPostIds, postId],
          };
        });
      },
      removeBlockedUser: (userId) => {
        set((state) => ({
          blockedUserIds: state.blockedUserIds.filter((id) => id !== userId),
        }));
      },
    }),
    {
      name: "reported-community-posts-storage",
      partialize: (state) => ({
        reportedPostIds: state.reportedPostIds,
        blockedUserIds: state.blockedUserIds,
        blockedPostIds: state.blockedPostIds,
      }),
    },
  ),
);

export default useReportedPostsStore;
