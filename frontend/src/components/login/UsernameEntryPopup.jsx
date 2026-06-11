import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { toast } from "react-toastify";

library.add(fab);

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Internal Input Component aligned perfectly with your chat textareas/inputs
const Input = ({ type, placeholder, icon, value, onChange }) => {
    return (
        <div className="flex items-center border w-full focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-all duration-300 pr-3 gap-2 bg-canvas border-border h-[44px] rounded-2xl overflow-hidden">
            <i className={`fa-solid fa-${icon} text-tertiary text-base ml-4`}></i>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full h-full pl-1 bg-transparent outline-none placeholder-tertiary text-sm text-primary"
            />
        </div>
    );
};

function UsernameEntryPopup({ onClose, onSuccess }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chatList, addToChatList] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const toChat = async (chatID) => {

        try{
            const token = localStorage.getItem('token');

            const response = await fetch(`${API_URL}/chats`,{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // credentials: "include",
                body : JSON.stringify({"user_id" : chatID})

        
        })

            const data = await response.json();

            console.log("backend data", data)

            onClose()

        }catch(error) {
            console.error("Error:", error);
            // toast.error("Server error. Please try again.");
        }
    }
    // Dynamic Search Function calling your updated FastAPI backend
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Using Option 1 (Query Parameter) we set up previously
            const response = await fetch(`${API_URL}/users?user=${encodeURIComponent(searchQuery)}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Search failed");

            const data = await response.json();
            console.log(data)

            setSearchResults((data?.status || []).map(item => item ))
            // console.log("res", data.status.map(item => (item.id = item.username)))
            // );
            // setSearchResults(data.status.map(item => ({
            //     [item.id]: item.username
            // })))

            if (data.status?.length === 0) {
                toast.info("No matching users found.");
            }
        } catch (error) {
            console.error("Search Error:", error);
            toast.error("Failed to query users from server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("sr" , chatList)
        // toChat(chatList)
        // fetchChatList()
    }, [chatList])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 w-full h-screen animate-fade-in">
            {/* Backdrop using glass-effect tones */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Popup using your chat template variables */}
            <div className="relative bg-surface border border-border w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all">
                
                {/* Close Button matching your header action icons */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:text-accent hover:bg-surface-hover transition-colors"
                >
                    <i className="fa-solid fa-xmark text-sm"></i>
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-primary mb-1.5">
                        Start a New Chat
                    </h2>
                    <p className="text-xs text-secondary">
                        Search for your friends by their ChatX username
                    </p>
                </div>

                <form noValidate onSubmit={handleSearchSubmit}>
                    <div className="mb-4">
                        <Input
                            type="text"
                            placeholder="Enter username..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon="magnifying-glass"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !searchQuery.trim()}
                        className={`w-full h-10 rounded-2xl flex items-center justify-center font-medium text-sm transition-all duration-200 ${
                            searchQuery.trim() && !isLoading
                                ? 'bg-accent text-canvas hover:bg-accent-hover shadow-md shadow-accent/10 hover:scale-[1.01]'
                                : 'bg-surface-hover border border-border text-tertiary cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? "Searching..." : "Search User"}
                    </button>
                </form>

                {/* Render Result Container matching list mechanics */}
                {searchResults.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-border animate-fade-in">
                        <p className="text-[11px] text-tertiary font-semibold uppercase tracking-wider mb-2">
                            Search Results
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                            {searchResults.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        // onSuccess(username);
                                        addToChatList(item.id)
                                        toChat(item.id)
                                        
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 100);
                                    }}
                                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-hover border border-transparent hover:border-border text-left group transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold uppercase">
                                        {item.username.slice(0, 2)}
                                    </div>
                                    <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                                        {item.username}
                                    </span>
                                    <i className="fa-solid fa-chevron-right text-[10px] text-tertiary ml-auto opacity-0 group-hover:opacity-100 transition-all"></i>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UsernameEntryPopup;