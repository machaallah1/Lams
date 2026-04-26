import { useState, useRef } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [imgUrl, setImgUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const user = useAuthStore(state => state.user);
  const addToast = useToastStore(state => state.addToast);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setImgUrl(objectUrl);
      setSelectedFile(file);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      await useSocialStore.getState().publishPostAPI(formData);
      
      setLoading(false);
      addToast("Style publié et validé par l'IA !", "success");
      navigate('/profile');
    } catch(err) {
      setLoading(false);
      addToast(err.message, "error");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center animate-in fade-in duration-500">
      <div className="glass w-[600px] p-10 rounded-[40px] text-center">
        <h1 className="text-3xl font-black text-primary mb-2">Partagez votre Style</h1>
        <p className="text-gray-500 mb-8 font-medium">L'IA analysera automatiquement votre tenue.</p>
        
        <form onSubmit={handlePublish} className="flex flex-col gap-6">
          {!imgUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-[350px] border-2 border-dashed border-primary/40 rounded-3xl bg-primary/5 flex flex-col items-center justify-center text-primary/70 cursor-pointer hover:bg-primary/10 hover:border-primary/60 transition-all duration-300 group"
            >
              <Upload size={48} className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              <p className="font-black text-xl mb-2 text-primary">Sélectionnez une photo</p>
              <p className="text-sm font-medium text-primary/60">Parcourez votre appareil (JPG, PNG)</p>
              <input 
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          ) : (
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-lg group bg-black/5 flex items-center justify-center">
              <img src={imgUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              <button 
                type="button" 
                onClick={() => { setImgUrl(''); setSelectedFile(null); }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-gray-800 hover:bg-red-500 hover:text-white transition-colors cursor-pointer border-none shadow-md"
               >
                <X size={20} />
              </button>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!imgUrl || loading}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 border-none cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Analyse IA en cours...</span>
            ) : (
              <>
                <CheckCircle size={22} />
                Publier sur le Feed
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
