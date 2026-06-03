import { useState, useRef, useEffect } from 'react';
import { Send, Upload, Sparkles, Bot, X } from 'lucide-react';
import PremiumPaywall from '../components/AiStylist/PremiumPaywall';
import { useToastStore } from '../store/toastStore';



export default function AiChat() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Bonjour ! Je suis votre IA Styliste personnelle. Prêt à améliorer votre style ? Envoyez-moi une photo ou posez-moi une question." }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const addToast = useToastStore(state => state.addToast);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubscribe = () => {
    setIsSubscribed(true);
    addToast("Abonnement activé ! L'IA est prête à vous conseiller.", "success");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !imagePreview) return;
    
    const newMsg = { 
      id: Date.now(), 
      sender: 'me', 
      text: inputText, 
      image: imagePreview 
    };
    
    const textForAi = inputText;
    const imageForAi = imagePreview;
    const currentHistory = [...messages, newMsg];
    
    setMessages(prev => [...prev, newMsg]);
    setInputText("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textForAi,
          image: imageForAi,
          history: currentHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          text: data.text
        }]);
      } else {
        throw new Error("Erreur de communication avec l'IA");
      }
    } catch(err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "Désolé, j'ai rencontré un problème lors de l'analyse. Pouvez-vous réessayer ?"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full h-full p-4 md:p-8 overflow-hidden relative">
      {!isSubscribed && <PremiumPaywall onSubscribe={handleSubscribe} />}

      <div className="max-w-4xl mx-auto h-full flex flex-col glass rounded-[40px] overflow-hidden shadow-sm">
        
        {/* Chat Header */}
        <div className="bg-white/80 backdrop-blur-md p-6 border-b border-primary/10 flex items-center gap-4 z-10">
          <div className="w-14 h-14 bg-gradient-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-primary flex items-center gap-2">
              Vision Stylist AI <Sparkles size={16} className="text-orange-400" />
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En ligne
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 font-semibold">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-5 rounded-3xl text-sm font-medium leading-relaxed flex flex-col gap-3 ${
                msg.sender === 'me' 
                  ? 'bg-primary text-white rounded-br-sm shadow-md text-left' 
                  : 'bg-white text-gray-700 rounded-bl-sm shadow-sm border border-gray-100 text-left'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded style" className="max-w-full max-h-[250px] rounded-2xl object-cover shadow-sm" />
                )}
                {msg.text && <p className="m-0 leading-relaxed">{msg.text}</p>}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-400 p-4 px-6 rounded-3xl rounded-bl-sm shadow-sm border border-gray-100 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image Preview Area */}
        {imagePreview && (
          <div className="px-6 py-3 border-t border-primary/10 bg-gray-50/80 backdrop-blur flex items-center gap-4 relative animate-in slide-in-from-bottom-2 duration-200">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm bg-white shrink-0">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-bl-xl w-5 h-5 flex items-center justify-center cursor-pointer border-none text-[10px] font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-gray-700 font-extrabold truncate max-w-[200px]">{selectedImage?.name}</span>
              <span className="text-[10px] text-gray-400 font-medium">Image prête à être analysée par l'IA</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white/50 backdrop-blur-md border-t border-primary/10">
          <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-inner border border-gray-100">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
              disabled={!isSubscribed}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={!isSubscribed}
              className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition-all bg-gray-50 rounded-full border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              title="Ajouter une photo de style"
            >
              <Upload size={20} />
            </button>
            <input 
              type="text" 
              placeholder={imagePreview ? "Ajouter une question sur cette photo..." : "Demandez un conseil (ex: 'Est-ce que cette veste me va ?')"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none focus:outline-none px-2 text-sm text-gray-700 placeholder-gray-400 font-medium disabled:opacity-50"
              disabled={!isSubscribed}
            />
            <button 
              onClick={handleSend}
              disabled={!isSubscribed || (!inputText.trim() && !imagePreview)}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors border-none cursor-pointer shadow-md shrink-0"
            >
              <Send size={18} className="translate-x-[-1px]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
