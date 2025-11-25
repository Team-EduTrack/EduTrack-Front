interface Props {
  title: string;
  className?: string;
}

export default function PageTitle({ title, className = "" }: Props) {
  return (
    <h1 className={`text-2xl font-bold text-gray-900 ${className}`}>{title}</h1>
  );
}
