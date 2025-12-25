import axios from "axios";

export type UnitDto = {
  unitId: number;
  lectureId: number;
  name: string;
};

export type CreateUnitRequest = {
  lectureId: number;
  name: string;
};

export async function getUnitsByLecture(lectureId: number) {
  const res = await axios.get<UnitDto[]>(`/api/units/lectures/${lectureId}`);
  return res.data;
}

export async function createUnit(body: CreateUnitRequest) {
  const res = await axios.post<UnitDto>(`/api/units`, body);
  return res.data;
}
