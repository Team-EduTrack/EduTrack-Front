type Props = {
  page: number;
  lastPage: number | null;
  onChange: (p: number) => void;
  maxButtons?: number;
};

export default function UserPagination({
  page,
  lastPage,
  onChange,
  maxButtons = 5,
}: Props) {
  const safePage = Math.max(1, page);

  const groupIndex = Math.floor((safePage - 1) / maxButtons);

  const start = groupIndex * maxButtons + 1;
  const end = lastPage
    ? Math.min(lastPage, start + maxButtons - 1)
    : start + maxButtons - 1;
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const hasPrevGroup = start > 1;
  const hasNextGroup = lastPage ? end < lastPage : true;

  const goPrevGroup = () => {
    const prevStart = Math.max(1, start - maxButtons);
    onChange(prevStart);
  };

  const goNextGroup = () => {
    const nextStart = start + maxButtons;
    onChange(nextStart);
  };

  return (
    <div className="join items-center">
      <button
        className="join-item btn btn-xs"
        onClick={goPrevGroup}
        disabled={!hasPrevGroup}
      >
        «
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`join-item btn btn-xs ${
            p === safePage ? "btn-active" : ""
          }`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="join-item btn btn-xs"
        onClick={goNextGroup}
        disabled={!hasNextGroup}
      >
        »
      </button>
    </div>
  );
}
