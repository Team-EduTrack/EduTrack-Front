import { FiCalendar } from "react-icons/fi";
import Button from "../Button";
import FormInput from "../Input";
import Modal from "../Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MakeLectureModal({ isOpen, onClose }: Props) {
  const handleSubmit = () => {};
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="강의 생성하기" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="강의명"
              placeholder="강의명을 입력하세요"
              className="w-full"
            />
          </div>
          <Button children="저장" type="submit"></Button>
        </div>
        <div className="w-full flex gap-3 items-end justify-between">
          <div className="flex-1">
            <FormInput
              label="담당 강사"
              placeholder="강사명을 입력하세요"
              className="w-full"
            />
          </div>
          <Button children="찾기" type="submit"></Button>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            강의 설명
          </label>
          <textarea
            className="textarea textarea-bordered
            w-full h-24 
            text-sm 
            transition-all
            focus:border-primary "
            placeholder="강의 설명을 입력하세요"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            강의 기간
          </label>
          <div className="flex justify-between ">
            <label className="label">
              <input type="checkbox" className="checkbox" />월
            </label>
            <label className="label">
              <input type="checkbox" className="checkbox" />화
            </label>
            <label className="label">
              <input type="checkbox" className="checkbox" />수
            </label>
            <label className="label">
              <input type="checkbox" className="checkbox" />목
            </label>
            <label className="label">
              <input type="checkbox" className="checkbox" />금
            </label>
            <label className="label">
              <input type="checkbox" className="checkbox" />토
            </label>
          </div>
        </div>
        <div className="flex pt-4 pb-8">
          <div className="flex items-center gap-2 flex-1 ">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              시작
            </span>
            <div className="relative">
              <input
                type="date"
                className="input input-bordered bg-white pr-10"
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded whitespace-nowrap">
              종료
            </span>
            <div className="relative">
              <input
                type="date"
                className="input input-bordered bg-white pr-10"
              />
              <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </form>
      <div className="flex justify-end">
        <Button children="생성하기"></Button>
      </div>
    </Modal>
  );
}
