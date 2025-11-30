import { HiPlus } from "react-icons/hi";
import Button from "./common/Button";
import { Link } from "react-router-dom";

interface ViewMoreProps {
  to: string;
}

export default function ViewMore({ to }: ViewMoreProps) {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        size="sm"
        className="btn-circle border-none hover:border-none p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 outline-none focus-visible:outline-none"
      >
        <HiPlus className="w-4 h-4" />
      </Button>
    </Link>
  );
}
