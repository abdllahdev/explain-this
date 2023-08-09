import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center space-y-6 bg-background">
      <h1 className="text-3xl font-black">Explain-This</h1>
      <Loader2 className="animate-spin" size={48} />
    </div>
  );
}
