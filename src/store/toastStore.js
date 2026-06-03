import { create } from 'zustand';
import { toast } from 'sonner';

export const useToastStore = create(() => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        style: {
          borderRadius: '25px',
          background: '#ffffff',
          color: '#8b5cf6',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          fontWeight: '700',
          fontFamily: 'Inter, sans-serif',
          padding: '12px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
        }
      });
    } else {
      toast.error(message, {
        style: {
          borderRadius: '25px',
          background: '#ffffff',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          fontWeight: '700',
          fontFamily: 'Inter, sans-serif',
          padding: '12px 24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)'
        }
      });
    }
  },
}));
