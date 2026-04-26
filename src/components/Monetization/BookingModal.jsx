import { useState } from 'react';
import { X, Calendar as CalIcon, Clock, CreditCard, ShieldCheck } from 'lucide-react';
import { useToastStore } from '../../store/toastStore';
import { useSocialStore } from '../../store/socialStore';

export default function BookingModal({ onClose, mentorId, mentorName, rate }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');
  const addToast = useToastStore(state => state.addToast);
  const sendMentorshipRequest = useSocialStore(state => state.sendMentorshipRequest);
  
  // Frais d'application fictifs = 15%
  const fee = rate * 0.15;
  const total = rate + fee;

  const handlePay = () => {
    if(!selectedDate || !selectedTime) {
      addToast("Veuillez choisir une date et une heure", "error");
      return;
    }
    sendMentorshipRequest(mentorId, mentorName, {
      date: selectedDate,
      time: selectedTime,
      message: message,
      total: total
    });
    addToast(`Paiement de ${total.toFixed(2)}$ confirmé. Le montant est sécurisé jusqu'à la fin de la séance.`, "success");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[35px] w-full max-w-md p-8 shadow-2xl relative transform transition-all animate-in zoom-in-95">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors border-none cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-primary mb-2">Réserver une séance</h2>
        <p className="text-gray-500 font-medium mb-6">Coaching privé avec <span className="font-bold text-gray-800">{mentorName}</span></p>

        {/* Formulaire Date & Heure */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
              <CalIcon size={16} className="text-primary" /> Date souhaitée
            </label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Heure
            </label>
            <input 
              type="time" 
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Message de contact (Modèle Hybride) */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            Message pour le mentor (Optionnel)
          </label>
          <textarea 
            rows="3" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décrivez brièvement votre besoin (ex: aide pour un shooting, choix de tenue pro...)"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
          />
        </div>

        {/* Détail du paiement */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CreditCard size={18} /> Détail du paiement
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Coaching ({mentorName})</span>
              <span className="font-bold">{rate.toFixed(2)} $</span>
            </div>
            <div className="flex justify-between">
              <span>Frais de sécurité plateforme</span>
              <span className="font-bold">{fee.toFixed(2)} $</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base">
              <span className="font-black text-gray-800">Total</span>
              <span className="font-black text-primary">{total.toFixed(2)} $</span>
            </div>
          </div>
        </div>

        {/* Infos de Confiance */}
        <div className="flex items-start gap-3 bg-green-50 text-green-700 p-4 rounded-xl mb-8 text-xs font-medium leading-relaxed">
          <ShieldCheck size={24} className="shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <strong className="block text-sm">Garantie Trust Pay</strong>
            <p>Le tarif affiché est librement fixé par le mentor. L'application agit uniquement comme coffre-fort de sécurité.</p>
            <p className="mt-1 font-bold text-green-800">Si la séance n'a pas lieu, vous êtes intégralement remboursé.</p>
          </div>
        </div>

        {/* Bouton Paiement */}
        <button 
          onClick={handlePay}
          className="w-full bg-primary text-white font-black py-4 rounded-full text-lg shadow-lg hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1 transition-all border-none cursor-pointer"
        >
          Payer {total.toFixed(2)} $
        </button>
      </div>
    </div>
  );
}
