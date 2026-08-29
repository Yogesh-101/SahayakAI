import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  message: string;
}

export default function PageLoading({ message }: PageLoadingProps) {
  return (
    <div className="text-center py-14 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
      <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-epfo-indigo" />
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}
