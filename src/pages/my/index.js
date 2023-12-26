import TopDetailNavigation from "@/components/layout/top-detail-navigation";
import MyStatus from "@/components/my/my-status";
import { Fragment } from "react";

export default function MyPage() {
  return (
    <Fragment>
      <TopDetailNavigation title="마이페이지" />
      <MyStatus />
    </Fragment>
  );
}
