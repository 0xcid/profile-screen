import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Search, 
  MapPin, 
  Briefcase, 
  Instagram, 
  UserPlus, 
  UserCheck, 
  UserMinus, 
  MessageCircle, 
  Send, 
  Check, 
  RotateCcw, 
  Heart, 
  MessageSquare, 
  Share2, 
  Smartphone, 
  Laptop, 
  X, 
  Clock, 
  Sparkles, 
  Bookmark, 
  ArrowLeft,
  Calendar,
  Compass,
  BriefcaseBusiness
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Interfaces & Types
interface Friend {
  name: string;
  avatar: string;
  mutualFriends: number;
  status: string;
}

interface Post {
  id: string;
  image: string;
  caption: string;
  likes: number;
  commentsCount: number;
  date: string;
  location?: string;
  isLiked?: boolean;
}

interface Message {
  id: string;
  sender: "user" | "alex";
  text: string;
  timestamp: string;
}

export default function App() {
  // Navigation & View Toggles
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");
  const [activeTab, setActiveTab] = useState<"postingan" | "tentang" | "teman">("postingan");
  
  // Friend Request States: 'pending' | 'accepted' | 'declined'
  const [requestStatus, setRequestStatus] = useState<"pending" | "accepted" | "declined">("pending");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Time for the mobile status bar
  const [currentTime, setCurrentTime] = useState("");

  // Post & Like States
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "post-1",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
      caption: "Mengejar matahari tenggelam di pesisir Bali. Ada ketenangan tersendiri melihat cakrawala berubah warna. 🌊🌅 #Denpasar #SunsetLovers",
      likes: 128,
      commentsCount: 14,
      date: "Kemarin, 18:15",
      location: "Sanur Beach, Bali",
      isLiked: false
    },
    {
      id: "post-2",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=600",
      caption: "Kopi hangat di sela-sela merancang masa depan pariwisata lokal bareng Tripkini. Semangat berkarya! ☕💼 #Tripkini #DeveloperLife",
      likes: 94,
      commentsCount: 8,
      date: "3 hari lalu",
      location: "Tripkini HQ",
      isLiked: false
    },
    {
      id: "post-3",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=600",
      caption: "Kumpul lagi bareng tim andalan. Mengenang perjalanan awal yang serba nekat tapi seru habis. Kapan trip lagi kita? 😎✊ @n_arsyana @octaviana_dw @bit_khoin",
      likes: 215,
      commentsCount: 32,
      date: "1 minggu lalu",
      location: "Uluwatu, Bali",
      isLiked: false
    }
  ]);

  // Image Lightbox State
  const [lightboxImage, setLightboxImage] = useState<Post | null>(null);

  // Messenger State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "alex", text: "Halo! Terima kasih sudah mengunjungi profil saya. Ada yang bisa saya bantu?", timestamp: "09:41" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Custom suggestion chips for quick replies in messenger
  const quickReplies = [
    { text: "Halo Alex! Salam kenal ya. 👋", reply: "Halo juga! Salam kenal kembali ya. Makasih banyak sudah menyapa!" },
    { text: "Fotonya keren-keren banget! 📸", reply: "Hehehe makasih banyak! Itu semua diambil pas keliling Bali sama temen-temen dekat." },
    { text: "Tripkini itu platform apa sih? 🌴", reply: "Tripkini itu platform travel planner digital yang lagi kami kembangkan untuk bantu wisatawan explore hidden gems di Indonesia dengan gampang!" }
  ];

  // Tick the clock for the iOS status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Friend List Search
  const [searchTerm, setSearchTerm] = useState("");
  const friendsList: Friend[] = [
    { name: "N Arsyana", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", mutualFriends: 18, status: "Berteman" },
    { name: "Octaviana Dw", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150", mutualFriends: 12, status: "Berteman" },
    { name: "Bit Khoin", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150", mutualFriends: 25, status: "Berteman" },
    { name: "Sanjaya Bali", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150", mutualFriends: 3, status: "Berteman" },
    { name: "Wayan Lestari", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150", mutualFriends: 9, status: "Berteman" },
    { name: "Kadek Aditya", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150", mutualFriends: 15, status: "Berteman" }
  ];

  const filteredFriends = friendsList.filter(friend => 
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Actions
  const handleConfirmRequest = () => {
    setRequestStatus("accepted");
    triggerToast("Permintaan pertemanan diterima! Anda sekarang berteman.");
  };

  const handleDeclineRequest = () => {
    setRequestStatus("declined");
    triggerToast("Permintaan pertemanan ditolak.");
  };

  const handleUndoAction = () => {
    setRequestStatus("pending");
    triggerToast("Tindakan dibatalkan.");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 4000);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1
          };
        }
        return post;
      })
    );
  };

  const handleSendMessage = (text: string, automatedResponseText?: string) => {
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp
    };
    
    setMessages(prev => [...prev, userMsg]);

    if (automatedResponseText) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const alexMsg: Message = {
          id: Math.random().toString(),
          sender: "alex",
          text: automatedResponseText,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        };
        setMessages(prev => [...prev, alexMsg]);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden antialiased">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            id="toast-notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-blue-400 font-medium text-sm"
          >
            <Sparkles className="w-4 h-4 text-blue-200 animate-pulse" />
            <span>{showToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header Area */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-md z-20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2.5 rounded-xl text-white shadow-lg">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              SocialConnect <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 font-sans">Mockup</span>
            </h1>
            <p className="text-xs text-slate-400">Replikasi Presisi & Interaktif Profil Publik - Alex Irawan</p>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 gap-1.5" id="view-mode-toggle">
          <button
            id="switch-mobile-btn"
            onClick={() => setViewMode("mobile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "mobile"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Tampilan HP</span>
          </button>
          <button
            id="switch-desktop-btn"
            onClick={() => setViewMode("desktop")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "desktop"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Tampilan Desktop</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative bg-slate-950/40">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* --- VIEW MODE 1: MOBILE SIMULATOR --- */}
        {viewMode === "mobile" && (
          <motion.div 
            id="mobile-phone-simulator"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-[395px] aspect-[9/19] rounded-[48px] bg-slate-950 p-3.5 border-4 border-slate-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col group/phone"
          >
            {/* Phone Screen Highlights & Bezels */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-[36px] z-30"></div>
            
            {/* Camera Notch & Speaker Grill */}
            <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-full z-40 flex items-center justify-center border border-slate-900 shadow-inner">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
              <div className="w-2.5 h-2.5 bg-indigo-950/60 rounded-full border border-slate-900 ml-4 shadow-inner relative overflow-hidden">
                <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-blue-400 rounded-full opacity-60"></div>
              </div>
            </div>

            {/* Inner Phone Screen */}
            <div className="flex-1 rounded-[36px] bg-slate-100 text-slate-900 overflow-hidden relative flex flex-col select-none">
              
              {/* iOS-Style Status Bar */}
              <div className="h-10 px-6 flex justify-between items-center text-white bg-slate-950/35 backdrop-blur-[2px] absolute top-0 inset-x-0 z-30 text-[11px] font-semibold tracking-tight">
                <span>{currentTime || "09:41"}</span>
                <div className="flex items-center gap-1.5">
                  <span className="opacity-90">LTE</span>
                  {/* Signal Icon */}
                  <div className="flex items-end gap-0.5 h-2 w-3.5">
                    <div className="w-0.5 h-1 bg-white rounded-full"></div>
                    <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-0.5 h-2 bg-white rounded-full"></div>
                    <div className="w-0.5 h-2.5 bg-white opacity-40 rounded-full"></div>
                  </div>
                  {/* Battery Icon */}
                  <div className="w-5 h-2.5 border border-white/80 rounded-[4px] p-0.5 flex items-center relative">
                    <div className="h-full w-4/5 bg-white rounded-[2px]"></div>
                    <div className="w-[1.5px] h-1 bg-white/80 rounded-r-sm absolute -right-[2.5px] top-[2px]"></div>
                  </div>
                </div>
              </div>

              {/* Scrollable Mobile Page Body */}
              <div className="flex-1 overflow-y-auto pb-6 scrollbar-none" id="mobile-viewport-scrollable">
                
                {/* 1. Cover Photo & Top Controls */}
                <div className="relative h-44 bg-slate-300 overflow-hidden" id="mobile-profile-cover">
                  {/* Real cover image replicating sunset */}
                  <img
                    src="https://images.unsplash.com/photo-1526244434298-88fcabaec235?auto=format&fit=crop&q=80&w=800"
                    alt="Cover Sunset"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Dark gradient mask for top bar legibility */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-slate-950/70 to-transparent"></div>
                  
                  {/* Header navigation bar overlay */}
                  <div className="absolute inset-x-4 top-11 flex justify-between items-center z-20">
                    <button id="nav-back-mobile" className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-950/60 transition-colors">
                      <ChevronLeft className="w-5 h-5 mr-0.5" />
                    </button>
                    <div className="flex gap-2">
                      <button id="nav-options-mobile" className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-950/60 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <button id="nav-search-mobile" className="w-8 h-8 rounded-full bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-slate-950/60 transition-colors">
                        <Search className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. White Card Overlap Container */}
                <div className="relative -mt-8 bg-white rounded-t-[28px] pt-4 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] z-10">
                  
                  {/* Profile Photo & Name Row */}
                  <div className="flex items-start gap-4">
                    {/* Profile Photo Container */}
                    <div className="relative -mt-16 z-20">
                      <div className="w-[100px] h-[100px] rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                        <img
                          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"
                          alt="Alex Irawan Avatar"
                          className="w-full h-full object-cover object-top scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* Ticking 5-hour indicator pill matching image "5 jam" */}
                      <span className="absolute bottom-[-4px] left-1/2 transform -translate-x-1/2 bg-[#edf7ed] text-[#2e7d32] border border-[#c3e6cb] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm whitespace-nowrap flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full animate-pulse"></span>
                        5 jam
                      </span>
                    </div>

                    {/* Name and Stats */}
                    <div className="flex-1 pt-1.5">
                      <h2 className="text-[21px] font-bold tracking-tight text-slate-900 leading-tight">Alex Irawan</h2>
                      <div className="text-[11.5px] text-slate-500 mt-1 flex flex-wrap items-center gap-x-1.5 leading-none">
                        <span className="font-bold text-slate-800">572</span><span>teman</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-800">4</span><span>bersama</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-bold text-slate-800">44</span><span>postingan</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Message */}
                  <div className="mt-4 text-[13.5px] text-slate-700 leading-normal font-medium">
                    Nothing Happens
                  </div>

                  {/* Inline metadata details (Denpasar, Tripkini, Instagram) */}
                  <div className="mt-4 pt-1 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-600 font-semibold" id="profile-meta-details-mobile">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>Denpasar</span>
                    </div>
                    <span className="text-slate-300 font-normal select-none">•</span>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>Tripkini</span>
                    </div>
                    <span className="text-slate-300 font-normal select-none">•</span>
                    <div className="flex items-center gap-1 text-slate-800 hover:text-blue-600 cursor-pointer">
                      <Instagram className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                      <span>0xcid</span>
                    </div>
                  </div>

                  {/* Mutual Friends Section */}
                  <div className="mt-4.5 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center gap-3">
                    <div className="flex -space-x-2.5 overflow-hidden">
                      {/* Sunset avatar */}
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=100"
                        alt="Mutual friend"
                        referrerPolicy="no-referrer"
                      />
                      {/* Girl standing avatar */}
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                        alt="Mutual friend"
                        referrerPolicy="no-referrer"
                      />
                      {/* Girl face avatar */}
                      <img
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                        alt="Mutual friend"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <p className="text-[11.5px] text-slate-600 leading-snug">
                      Berteman dengan <span className="font-bold text-slate-900">N Arsyana</span>, <span className="font-bold text-slate-900">Octaviana Dw</span>, <span className="font-bold text-slate-900">Bit Khoin</span> dan <span className="font-bold text-slate-900">1 lainnya</span>
                    </p>
                  </div>

                  {/* Action Buttons precisely replicating the layout & colors of image */}
                  <div className="mt-5 flex gap-2" id="profile-actions-bar-mobile">
                    {requestStatus === "pending" && (
                      <>
                        <button
                          id="confirm-btn-mobile"
                          onClick={handleConfirmRequest}
                          className="flex-1 bg-[#1877f2] hover:bg-blue-600 active:scale-[0.98] transition-all text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4 text-white" />
                          <span>Konfirmasi permintaan</span>
                        </button>
                        <button
                          id="decline-btn-mobile"
                          onClick={handleDeclineRequest}
                          className="bg-[#e4e6eb] hover:bg-slate-300 active:scale-[0.98] transition-all text-slate-800 py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Hapus
                        </button>
                      </>
                    )}

                    {requestStatus === "accepted" && (
                      <>
                        <button
                          id="accepted-btn-mobile"
                          onClick={handleUndoAction}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] transition-all text-slate-700 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <span>Berteman (Batalkan)</span>
                        </button>
                      </>
                    )}

                    {requestStatus === "declined" && (
                      <div className="flex-1 bg-amber-50 text-amber-800 p-2.5 rounded-xl text-xs border border-amber-100 flex justify-between items-center animate-fadeIn">
                        <span>Permintaan dibatalkan</span>
                        <button
                          onClick={handleUndoAction}
                          className="text-amber-900 font-bold underline flex items-center gap-1 hover:text-amber-950 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Urungkan</span>
                        </button>
                      </div>
                    )}

                    {/* Messenger icon button exactly matching style */}
                    <button
                      id="messenger-btn-mobile"
                      onClick={() => setIsChatOpen(true)}
                      className="bg-[#e4e6eb] hover:bg-slate-300 active:scale-[0.98] transition-all p-2.5 rounded-xl flex items-center justify-center text-slate-800 cursor-pointer"
                      title="Kirim Pesan"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.93 1.19 5.56 3.11 7.42.16.15.25.36.25.58l.02 2.1c.01.54.54.91 1.05.73l2.39-.85c.18-.06.38-.05.55.03C10.3 21.89 11.14 22 12 22c5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm1.18 11.66l-2.07-2.21-4.04 2.21c-.45.25-.97-.24-.74-.71l2.07-4.21 2.07 2.21 4.04-2.21c.45-.25.97.24.74.71l-2.07 4.21z" />
                      </svg>
                    </button>
                  </div>

                  {/* Tabs Selector */}
                  <div className="mt-6 border-t border-b border-slate-100 flex py-1" id="profile-tabs-mobile">
                    <button
                      id="tab-posts-mobile"
                      onClick={() => setActiveTab("postingan")}
                      className={`flex-1 py-2 text-center text-xs font-bold transition-all relative ${
                        activeTab === "postingan" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Postingan
                      {activeTab === "postingan" && (
                        <motion.div layoutId="activeMobileTabLine" className="absolute bottom-0 inset-x-4 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                    <button
                      id="tab-about-mobile"
                      onClick={() => setActiveTab("tentang")}
                      className={`flex-1 py-2 text-center text-xs font-bold transition-all relative ${
                        activeTab === "tentang" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Tentang
                      {activeTab === "tentang" && (
                        <motion.div layoutId="activeMobileTabLine" className="absolute bottom-0 inset-x-4 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                    <button
                      id="tab-friends-mobile"
                      onClick={() => setActiveTab("teman")}
                      className={`flex-1 py-2 text-center text-xs font-bold transition-all relative ${
                        activeTab === "teman" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Teman
                      {activeTab === "teman" && (
                        <motion.div layoutId="activeMobileTabLine" className="absolute bottom-0 inset-x-4 h-0.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="mt-4">
                    
                    {/* --- POSTINGAN TAB --- */}
                    {activeTab === "postingan" && (
                      <div className="space-y-4" id="posts-container-mobile">
                        {posts.map((post) => (
                          <div key={post.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            
                            {/* Post Header */}
                            <div className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"
                                  alt="Alex Profile"
                                  className="w-8 h-8 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">Alex Irawan</h4>
                                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                    <span>{post.date}</span>
                                    {post.location && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-600 flex items-center gap-0.5">
                                          <MapPin className="w-2.5 h-2.5" />
                                          {post.location}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button className="text-slate-400 hover:text-slate-700">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Post Image */}
                            <div 
                              className="relative aspect-video bg-slate-100 overflow-hidden cursor-zoom-in"
                              onClick={() => setLightboxImage(post)}
                            >
                              <img
                                src={post.image}
                                alt="Post media"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Post Body & Caption */}
                            <div className="p-3.5">
                              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {post.caption}
                              </p>

                              {/* Interactivity Bar */}
                              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-slate-500 text-xs font-bold">
                                <button 
                                  onClick={() => handleLikePost(post.id)}
                                  className={`flex items-center gap-1.5 hover:text-rose-600 transition-colors py-1 px-2 rounded-lg hover:bg-rose-50 ${
                                    post.isLiked ? "text-rose-600" : ""
                                  }`}
                                >
                                  <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-600 stroke-rose-600" : ""}`} />
                                  <span>{post.likes}</span>
                                </button>
                                <div className="flex items-center gap-1.5 py-1 px-2">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>{post.commentsCount}</span>
                                </div>
                                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 px-2 rounded-lg hover:bg-blue-50">
                                  <Share2 className="w-4 h-4" />
                                  <span>Bagikan</span>
                                </button>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* --- TENTANG TAB --- */}
                    {activeTab === "tentang" && (
                      <div className="space-y-4 text-xs" id="about-container-mobile">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 text-sm mb-3">Informasi Kontak & Dasarnya</h3>
                          <div className="space-y-3.5 text-slate-600">
                            <div className="flex items-start gap-2.5">
                              <MapPin className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />
                              <div>
                                <p className="font-semibold text-slate-800">Denpasar, Bali</p>
                                <p className="text-[10px] text-slate-400">Kota asal & tempat tinggal sekarang</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <BriefcaseBusiness className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />
                              <div>
                                <p className="font-semibold text-slate-800">Tripkini (Pariwisata Digital)</p>
                                <p className="text-[10px] text-slate-400">Pekerjaan sebagai Lead Developer</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <Instagram className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />
                              <div>
                                <p className="font-semibold text-slate-800">@0xcid</p>
                                <p className="text-[10px] text-slate-400">Instagram Publik</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                              <Calendar className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />
                              <div>
                                <p className="font-semibold text-slate-800">Bergabung Juli 2018</p>
                                <p className="text-[10px] text-slate-400">Anggota SocialConnect sejak lama</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <h3 className="font-bold text-slate-800 text-sm mb-2.5">Hobi & Ketertarikan</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {["Fotografi", "Travel & Trip", "Coding", "Sunset Hunting", "Pantai", "Kopi Hitam"].map((hobi) => (
                              <span key={hobi} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium text-[11px]">
                                {hobi}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- TEMAN TAB --- */}
                    {activeTab === "teman" && (
                      <div className="space-y-4" id="friends-container-mobile">
                        {/* Friends Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Cari teman..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                          />
                        </div>

                        {/* Friends Grid */}
                        <div className="grid grid-cols-2 gap-2.5">
                          {filteredFriends.map((friend, i) => (
                            <div key={i} className="bg-white border border-slate-100 p-2.5 rounded-xl flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
                              <img
                                src={friend.avatar}
                                alt={friend.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                                referrerPolicy="no-referrer"
                              />
                              <h4 className="mt-2 text-xs font-bold text-slate-800 truncate w-full px-1">{friend.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-0.5">{friend.mutualFriends} teman bersama</p>
                              <button className="mt-3 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-1 rounded-lg text-[10px] font-bold transition-all">
                                Lihat Profil
                              </button>
                            </div>
                          ))}
                        </div>

                        {filteredFriends.length === 0 && (
                          <div className="text-center py-6 text-slate-400 text-xs">
                            Tidak ada teman yang cocok dengan pencarian Anda.
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* MOCKUP EXPLAINER CAPTION BAR */}
              <div className="bg-slate-950/95 py-3 px-4 border-t border-slate-800 text-slate-400 text-[10px] font-medium text-center z-15">
                Mengikuti foto referensi dari <span className="text-white font-bold">0xcidb@gmail.com</span>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="h-5 bg-slate-950 flex justify-center items-end pb-1.5 z-30">
                <div className="w-28 h-1 bg-white/40 rounded-full"></div>
              </div>

              {/* --- INTERACTIVE MESSENGER MODAL (ALIVE!) --- */}
              <AnimatePresence>
                {isChatOpen && (
                  <motion.div
                    id="messenger-chat-modal"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="absolute inset-x-0 bottom-0 top-10 bg-white rounded-t-[24px] shadow-[0_-15px_40px_rgba(0,0,0,0.2)] z-40 flex flex-col overflow-hidden text-slate-800"
                  >
                    {/* Chat Header */}
                    <div className="bg-[#1877f2] text-white py-3 px-4 flex items-center justify-between shadow-md">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"
                          alt="Alex Profile"
                          className="w-8 h-8 rounded-full object-cover border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-xs font-bold leading-none text-white">Alex Irawan</h4>
                          <span className="text-[9px] text-blue-100 flex items-center gap-1 mt-1 leading-none">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
                            Aktif sekarang
                          </span>
                        </div>
                      </div>
                      <button 
                        id="close-chat-btn"
                        onClick={() => setIsChatOpen(false)}
                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 flex flex-col scrollbar-none">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col max-w-[75%] ${
                            msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-2xl text-xs leading-relaxed ${
                              msg.sender === "user"
                                ? "bg-[#1877f2] text-white rounded-tr-none"
                                : "bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                        </div>
                      ))}

                      {/* Animated Typing Indicator */}
                      {isTyping && (
                        <div className="self-start flex items-center gap-1 bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[40%]">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>

                    {/* Quick Suggestions Drawer */}
                    <div className="bg-white border-t border-slate-100 p-2.5 flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                      {quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          id={`quick-reply-btn-${idx}`}
                          onClick={() => handleSendMessage(reply.text, reply.reply)}
                          className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer"
                        >
                          {reply.text}
                        </button>
                      ))}
                    </div>

                    {/* Chat Footer Input */}
                    <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tulis pesan..."
                        disabled
                        className="flex-1 bg-slate-100 border-none rounded-xl py-2 px-4 text-xs font-medium text-slate-500 focus:outline-none placeholder:text-slate-400"
                      />
                      <button className="bg-slate-100 text-slate-400 p-2 rounded-xl cursor-not-allowed">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}

        {/* --- VIEW MODE 2: DESKTOP WEB PROFILE LAYOUT --- */}
        {viewMode === "desktop" && (
          <motion.div 
            id="desktop-profile-wrapper"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
          >
            {/* Desktop Hero Cover Image */}
            <div className="relative h-64 md:h-80 bg-slate-800 overflow-hidden" id="desktop-profile-cover">
              <img
                src="https://images.unsplash.com/photo-1526244434298-88fcabaec235?auto=format&fit=crop&q=80&w=1200"
                alt="Desktop Sunset Cover"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              {/* Profile Details floating inside desktop header */}
              <div className="absolute bottom-6 inset-x-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
                  
                  {/* Desktop Avatar Profile */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden shadow-2xl">
                      <img
                        src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300"
                        alt="Alex Irawan Avatar Desktop"
                        className="w-full h-full object-cover object-top scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Activity badging */}
                    <span className="absolute bottom-1 right-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                      5 jam
                    </span>
                  </div>

                  {/* Name and Quick stats */}
                  <div className="text-center md:text-left text-white pb-1.5">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">Alex Irawan</h2>
                    <p className="text-slate-300 mt-2 text-sm max-w-md font-medium leading-relaxed italic">"Nothing Happens"</p>
                    
                    <div className="mt-3.5 flex items-center justify-center md:justify-start gap-4 text-xs text-slate-300 font-semibold bg-slate-950/45 px-3 py-1.5 rounded-lg border border-slate-800/60 w-fit">
                      <span><strong className="text-blue-400">572</strong> Teman</span>
                      <span className="text-slate-700">•</span>
                      <span><strong className="text-blue-400">4</strong> Bersama</span>
                      <span className="text-slate-700">•</span>
                      <span><strong className="text-blue-400">44</strong> Postingan</span>
                    </div>
                  </div>

                </div>

                {/* Actions Area */}
                <div className="flex gap-2.5 justify-center" id="profile-actions-bar-desktop">
                  {requestStatus === "pending" && (
                    <>
                      <button
                        id="confirm-btn-desktop"
                        onClick={handleConfirmRequest}
                        className="bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Konfirmasi permintaan</span>
                      </button>
                      <button
                        id="decline-btn-desktop"
                        onClick={handleDeclineRequest}
                        className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </>
                  )}

                  {requestStatus === "accepted" && (
                    <>
                      <button
                        id="accepted-btn-desktop"
                        onClick={handleUndoAction}
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition-all text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/10 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Berteman (Konfirmasi)</span>
                      </button>
                    </>
                  )}

                  {requestStatus === "declined" && (
                    <div className="bg-amber-950/80 text-amber-200 px-4 py-2.5 rounded-xl text-xs border border-amber-900/40 flex items-center gap-4">
                      <span>Permintaan dibatalkan</span>
                      <button
                        onClick={handleUndoAction}
                        className="text-amber-400 font-bold underline hover:text-amber-300 cursor-pointer"
                      >
                        Urungkan
                      </button>
                    </div>
                  )}

                  <button
                    id="messenger-btn-desktop"
                    onClick={() => {
                      setViewMode("mobile");
                      setIsChatOpen(true);
                      triggerToast("Buka Messenger di simulator mobile!");
                    }}
                    className="bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all px-4 py-2.5 rounded-xl flex items-center justify-center text-slate-200 cursor-pointer"
                    title="Kirim Pesan"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>

              </div>

            </div>

            {/* Desktop Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6" id="desktop-grid-columns">
              
              {/* Left Column: Info & Mutuals */}
              <div className="space-y-6">
                
                {/* About Panel */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h3 className="font-bold text-white text-base font-display mb-4 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-blue-500" />
                    <span>Pendahuluan / Tentang</span>
                  </h3>
                  
                  <div className="space-y-4 text-sm text-slate-400">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-500 shrink-0 stroke-[2.5]" />
                      <div>
                        <p className="text-slate-200 font-bold">Denpasar, Bali</p>
                        <p className="text-xs text-slate-500">Tempat Tinggal Sekarang</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-slate-500 shrink-0 stroke-[2.5]" />
                      <div>
                        <p className="text-slate-200 font-bold">Tripkini</p>
                        <p className="text-xs text-slate-500">Lead Developer</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-slate-300 hover:text-blue-400 cursor-pointer">
                      <Instagram className="w-5 h-5 text-slate-500 shrink-0 stroke-[2.5]" />
                      <div>
                        <p className="text-slate-200 font-bold hover:text-blue-400 transition-colors">@0xcid</p>
                        <p className="text-xs text-slate-500">Username Instagram</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mutual Friends Desktop Panel */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                  <h3 className="font-bold text-white text-base font-display mb-4">
                    Pertemanan Bersama
                  </h3>
                  
                  {/* Avatars Grid */}
                  <div className="flex items-center gap-3 mb-4 bg-slate-900 p-3 rounded-xl border border-slate-800/80">
                    <div className="flex -space-x-3 overflow-hidden">
                      <img className="h-10 w-10 rounded-full ring-2 ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=100" alt="Friend 1" referrerPolicy="no-referrer" />
                      <img className="h-10 w-10 rounded-full ring-2 ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Friend 2" referrerPolicy="no-referrer" />
                      <img className="h-10 w-10 rounded-full ring-2 ring-slate-950 object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" alt="Friend 3" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-xs text-slate-400 leading-normal">
                      Saling kenal dengan <span className="font-bold text-slate-200">N Arsyana</span> dan 3 teman lainnya.
                    </div>
                  </div>

                  {/* Friends preview list */}
                  <div className="grid grid-cols-3 gap-2">
                    {friendsList.slice(0, 3).map((friend, idx) => (
                      <div key={idx} className="flex flex-col items-center p-2 rounded-lg bg-slate-900 border border-slate-800 text-center">
                        <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <span className="text-[10px] text-slate-300 font-bold mt-1.5 truncate w-full">{friend.name}</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Right Column (Span 2): Social Posts Stream */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="font-bold text-white text-lg font-display flex items-center gap-2">
                  <span>Postingan Terbaru</span>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-sans">
                    44 Total
                  </span>
                </h3>

                {posts.map((post) => (
                  <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    {/* Post Header */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-900">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"
                          alt="Alex Profile"
                          className="w-10 h-10 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">Alex Irawan</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                            <span>{post.date}</span>
                            {post.location && (
                              <>
                                <span>•</span>
                                <span className="text-blue-400 flex items-center gap-0.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {post.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-500 hover:text-slate-300 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Post Content Image */}
                    <div 
                      className="relative h-64 md:h-80 bg-slate-900 overflow-hidden cursor-zoom-in"
                      onClick={() => setLightboxImage(post)}
                    >
                      <img
                        src={post.image}
                        alt="Post media content"
                        className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Post Footer details */}
                    <div className="p-5">
                      <p className="text-slate-300 text-sm leading-relaxed font-medium">
                        {post.caption}
                      </p>

                      {/* Controls Row */}
                      <div className="mt-5 pt-4 border-t border-slate-900 flex items-center justify-between text-slate-400 text-sm font-bold">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-2 hover:text-rose-500 transition-colors py-1.5 px-3 rounded-lg hover:bg-rose-950/25 ${
                            post.isLiked ? "text-rose-500" : ""
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? "fill-rose-500 stroke-rose-500" : ""}`} />
                          <span>{post.likes} Suka</span>
                        </button>
                        
                        <div className="flex items-center gap-2 py-1.5 px-3">
                          <MessageSquare className="w-5 h-5" />
                          <span>{post.commentsCount} Komentar</span>
                        </div>

                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors py-1.5 px-3 rounded-lg hover:bg-blue-950/25">
                          <Share2 className="w-5 h-5" />
                          <span>Bagikan</span>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

            </div>

          </motion.div>
        )}

      </main>

      {/* --- PORTRAIT LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            id="image-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col justify-center items-center p-4 md:p-12 select-none"
          >
            {/* Close Button top-right */}
            <button
              id="close-lightbox"
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors shadow-lg cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Content Card */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Media Section */}
              <div className="flex-1 bg-black flex items-center justify-center relative aspect-video md:aspect-auto md:h-[500px]">
                <img
                  src={lightboxImage.image}
                  alt="Enlarged content"
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Sidebar Description Section */}
              <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-slate-900 border-t md:border-t-0 md:border-l border-slate-800">
                <div className="space-y-4">
                  
                  {/* Author detail */}
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100"
                      alt="Alex Profile"
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">Alex Irawan</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{lightboxImage.date}</p>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {lightboxImage.caption}
                  </p>

                  {lightboxImage.location && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-400 font-bold">
                      <MapPin className="w-4 h-4" />
                      <span>{lightboxImage.location}</span>
                    </div>
                  )}

                </div>

                {/* Footer and Stats inside lightbox */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <button 
                    onClick={() => handleLikePost(lightboxImage.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      lightboxImage.isLiked ? "text-rose-500" : "text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <Heart className={`w-4.5 h-4.5 ${lightboxImage.isLiked ? "fill-rose-500 stroke-rose-500" : ""}`} />
                    <span>{lightboxImage.likes} Suka</span>
                  </button>
                  <span className="text-xs text-slate-500 font-bold">
                    {lightboxImage.commentsCount} Komentar
                  </span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Credentials */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-semibold flex flex-col md:flex-row justify-between items-center px-12 gap-3 z-10">
        <p>Aplikasi mockup profil sosial, dikembangkan menggunakan React 19 & Tailwind CSS v4.</p>
        <div className="flex gap-4">
          <a href="https://github.com" className="hover:text-white transition-colors">GitHub</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Instagram @0xcid</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Tripkini Planner</a>
        </div>
      </footer>

    </div>
  );
}
