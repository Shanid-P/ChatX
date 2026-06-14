'use client'
import { useEffect, useState, useRef } from 'react';
import {  getLastMessage, getUnreadCount } from '../data/mockData';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import UsernameEntryPopup from './login/UsernameEntryPopup'


let myUserId;

import { jwtDecode } from "jwt-decode";

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://chatx-r9e0.onrender.com' || 'http://127.0.0.1:8000';



 



export default function Sidebar({ activeChat, onClose, contacts, setContacts }) {

  const [searchQuery, setSearchQuery] = useState('');
  // const [contacts, setContacts] = useState([]);
  const [findUserPopup, handleFindUsers] = useState(false);
  const [isActive, setActive] = useState();

  const navigate = useNavigate();

  console.log('sie bar contacts', contacts)
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

 

 

  const onSelectChat = (chatID) =>{
    console.log(chatID);
    navigate(`/message/${chatID}`);
    console.log('navigated')
  }








  return (
    <div className="flex flex-col h-full bg-surface p-5">
      {/* {findUserPopup && <UsernameEntryPopup/>} */}
      {findUserPopup && <UsernameEntryPopup onClose={() => handleFindUsers(false)} />}
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-primary tracking-tight">Chats</h2>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent"
            title="Filter"
          >
            <i className="fa-solid fa-filter text-sm"></i>
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent"
            title="New Chat"
          >
            <i className="fa-solid fa-pen-to-square text-sm"></i>
          </button>
          {/* Close button - visible on mobile */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent lg:hidden"
            title="Close"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-tertiary text-xs"></i>
          <input
            type="text"
            placeholder="Search or start new chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-canvas border border-border rounded-xl py-2.5 pl-9 pr-4 text-sm text-primary placeholder-tertiary outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
        </div>
      </div>

      {/* Section Label */}
      <div className="px-4 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-tertiary">
          All Chats
        </span>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filteredContacts.map((contact, index) => {
          // const lastMessage = getLastMessage(contact.id);
          // const unreadCount = getUnreadCount(contact.id);
          // const isActive = activeChat === contact.id;

          return (
            <button
              key={contact.id}
              onClick={() => {onSelectChat(contact.id);
                setActive(contact.id)
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xs border-b border-gray-200 transition-all duration-200 mb-0.5 group animate-fade-in ${
                isActive === contact.id
                  ? 'bg-accent/10 border border-accent/20'
                  : 'hover:bg-surface-hover'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {/* <img
                  src={contact.avatar}
                  alt={contact.username}
                  className={`w-11 h-11 rounded-full object-cover ring-2 transition-all ${
                    isActive ? 'ring-accent/40' : 'ring-border group-hover:ring-border-light'
                  }`}
                /> */}

                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold uppercase">
                  {contact.username.slice(0, 2)}
              </div>


                {contact.status === 'online' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-online rounded-full border-2 border-surface animate-pulse-glow"></span>
                )}
              </div>

              {/* Info */}
              <div className="flex w-full min-w-0 text-left items-center">
                <div className='flex flex-col w-full'>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium truncate ${
                      isActive ? 'text-accent' : 'text-primary'
                    }`}
                  >
                    {contact.username}
                  </span>
                  {/* <span className="text-[10px] text-tertiary flex-shrink-0 ml-2">
                    {lastMessage?.timestamp}
                  </span> */}
                </div>
                <div className="flex items-center mt-0.5">
                  <p className="text-xs text-secondary truncate pr-2">
                    {contact.lastMsg && (
                      <i className="fa-solid fa-check-double text-accent/60 mr-0.5 text-[8px]"></i>
                     )}
                    {/* {contact.lastMsg && 
                      <>
                        <i className="fa-solid fa-phone text-tertiary mr-1 text-[10px]"></i>
                        {contact.lastMsg}
                      </>
                    ) : ( */}
                      {contact.lastMsg}
                    {/* // } */}
                  </p>
                  
                </div>
                </div>
                <div className="flex">
                  {contact.unreadCount > 0 && (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] flex items-center justify-center bg-accent text-canvas text-[10px] font-bold rounded-full px-1">
                      {contact.unreadCount}
                    </span>
                   )} 
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Action */}
      <div className="p-3 border-t border-border">
        <button
        onClick={() => handleFindUsers(true)} 
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium transition-all group">
          <i className="fa-solid fa-comment-dots group-hover:scale-110 transition-transform"></i>
          <span>Find People</span>
        </button>
      </div>
    </div>
  );
}
