import { Loader2 } from "lucide-react";

interface Props {
  title?: string;
}

export default function Loader({ title }: Props) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-6 bg-background">
      {title && <h1 className="text-3xl font-black">{title}</h1>}
      <Loader2 className="animate-spin" size={48} />
    </div>
  );
}
