import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { adminApi, MappingMentorapplicationUniversityResponse, MappingMentorapplicationUniversityRequest } from "./api";

const usePostMappingMentorapplicationUniversity = () => {
  return useMutation<MappingMentorapplicationUniversityResponse, AxiosError, { mentorApplicationId: string | number; data: MappingMentorapplicationUniversityRequest }>({
    mutationFn: (variables) => adminApi.postMappingMentorapplicationUniversity(variables),
  });
};

export default usePostMappingMentorapplicationUniversity;