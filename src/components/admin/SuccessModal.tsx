import Modal from "../common/Modal";
import Button from "../common/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  generatedCode: string;
}

export default function SuccessModal({ isOpen, onClose, generatedCode }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-xl text-gray-900 mb-2">원장 등록 완료</h3>
        <p className="text-gray-600 text-sm mb-6">원장 계정이 성공적으로 생성되었습니다</p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">발급된 학원코드</p>
          <p className="text-2xl font-bold text-primary">{generatedCode}</p>
        </div>
        <Button className="px-8" onClick={onClose}>확인</Button>
      </div>
    </Modal>
  );
}
