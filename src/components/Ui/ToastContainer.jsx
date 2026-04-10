import { useToastStore } from '../../store/toastStore';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div 
          key={toast.id}
          className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 font-bold text-sm"
        >
          {toast.type === 'success' ? <CheckCircle size={18} className="text-green-400" /> : <AlertCircle size={18} className="text-red-400" />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
