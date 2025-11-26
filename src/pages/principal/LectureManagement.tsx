import { useState } from "react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Page from "../../components/common/Page";
import Table from "../../components/common/Table";
import FormInput from "../../components/common/Input";

const mockLectures = [
  { id: 1, name: "재미있는 영어", studentCount: 30 },
  { id: 2, name: "영문법 수업", studentCount: 20 },
  { id: 3, name: "보카 독파", studentCount: 33 },
];

export default function PrincipalLectureManagement() {
  const [addLectureModalOpen, setAddLectureModalOpen] = useState(false);
  const [lectures, setLectures] = useState(mockLectures);

  const handleAddLecture = () => {};

  const handleDeleteLecture = () => {};

  return (
    <Page>
      <div className="space-y-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              강의 리스트
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddLectureModalOpen(true)}
              >
                추가
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDeleteLecture}>
                삭제
              </Button>
            </div>
          </div>
          <Table
            columns={[
              {
                header: (
                  <input type="checkbox" className="checkbox checkbox-sm" />
                ),
                accessor: () => (
                  <input type="checkbox" className="checkbox checkbox-sm" />
                ),
                className: "w-12 text-center",
              },
              {
                header: "",
                accessor: (_, index) => index + 1,
                className: "text-left",
              },
              {
                header: "강의명",
                accessor: (lecture) => lecture.name,
                className: "text-center",
              },
              {
                header: "수강생",
                accessor: (lecture) => lecture.studentCount,
                className: " text-center",
              },
            ]}
            data={lectures}
            keyExtractor={(lecture) => lecture.id}
            emptyMessage="등록된 과제가 없습니다."
          />
        </Card>

        <Card className="mb-4" title="성적 비율">
          <div className="grid grid-cols-1 md:grid-cols-3 mb-4">
            <div className="flex items-center justify-center">
              <p className="w-10 text-right">출석</p>
              <FormInput type="number" className="ml-4" />
            </div>

            <div className="flex items-center justify-center">
              <p className="w-10 text-right">시험</p>
              <FormInput type="number" className="ml-4" />
            </div>

            <div className="flex items-center justify-center">
              <p className="w-10 text-right">과제</p>
              <FormInput type="number" className="ml-4" />
            </div>
          </div>

          <div className="flex justify-end pt-2 w-full">
            <Button type="submit">저장하기</Button>
          </div>
        </Card>
      </div>
    </Page>
  );
}
