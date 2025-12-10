import type { MyLectureResponse } from "../../api/generated/edutrack";

export function mapLecture(api: MyLectureResponse) {
  return {
    id: api.lectureId!,
    title: api.lectureTitle ?? "",
    teacher: api.teacherName ?? "",
  };
}