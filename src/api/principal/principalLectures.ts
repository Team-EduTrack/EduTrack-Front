import axios from "axios";

export type PrincipalLecture = {
  lectureId: number;
  title: string;
  teacherName: string;
  studentCount: number;
  imageUrl: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-based
  first: boolean;
  last: boolean;
};

export async function getPrincipalLectures(params: { page: number; size: number }) {
  const res = await axios.get<PageResponse<PrincipalLecture>>(
    "/api/principal/lectures",
    { params }
  );
  return res.data;
}
