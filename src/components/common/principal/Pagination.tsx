type Props = {
  page: number; // 0-based
  totalPages: number; // 0이면 표시 안 함
  onChange: (page: number) => void;
  maxButtons?: number; // 기본 5
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  maxButtons = 5,
}: Props) {
  if (totalPages <= 0) return null;

  const half = Math.floor(maxButtons / 2);

  let start = Math.max(0, page - half);
  let end = Math.min(totalPages - 1, start + maxButtons - 1);
  start = Math.max(0, end - (maxButtons - 1));

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="join ">
      {pages.map((p) => (
        <button
          key={p}
          className={`join-item btn btn-xs ${p === page ? "btn-active" : ""}`}
          onClick={() => onChange(p)}
        >
          {p + 1}
        </button>
      ))}
    </div>
  );
}
