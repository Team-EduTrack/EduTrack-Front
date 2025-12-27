import { useQuery } from "@tanstack/react-query";
import { getPrincipalLectures } from "../../api/principal/principalLectures";


export const principalLectureKeys = {
  all: ["principalLectures"] as const,
  list: (page: number, size: number) =>
    [...principalLectureKeys.all, page, size] as const,
};

export function usePrincipalLectures(page: number, size: number) {
  return useQuery({
    queryKey: principalLectureKeys.list(page, size),
    queryFn: () => getPrincipalLectures({ page, size }),
    staleTime: 30_000,
    placeholderData: (prev) => prev, 
  });
}
