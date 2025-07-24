import axios, { AxiosResponse } from "axios";

import { MentorListParams, MentorResponse } from "@/types/mentor";

export const getMentorList = (params: MentorListParams = {}): Promise<AxiosResponse<MentorResponse>> => {
  const { region, size = 10, page = 0 } = params;

  const queryParams = new URLSearchParams({
    size: size.toString(),
    page: page.toString(),
  });

  if (region) {
    queryParams.append("region", region);
  }

  return axios.get(`/mentors?${queryParams.toString()}`);
};
