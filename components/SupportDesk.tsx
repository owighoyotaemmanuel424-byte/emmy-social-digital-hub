'use client';

import React, { useState } from 'react';
import { useReseller } from '@/context/ResellerContext';
import {
  LifeBuoy,
  MessageSquare,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'answered' | 'closed';
  created_at: string;
  messages: Array<{
    sender: 'user' | 'support';
    text: string;
    time: string;
  }>;
}

export function SupportDesk() {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'TCK-9402',
      subject: 'Inquiry regarding MTN Corporate Data delivery latency',
      department: 'Technical',
      priority: 'medium',
      status: 'answered',
      created_at: '2 hours ago',
      messages: [
        {
          sender: 'user',
          text: 'Hello, our MTN 2GB SME plan completed in 3 seconds, just wanted to confirm if corporate gifting route is equally fast.',
          time: '2 hours ago',
        },
        {
          sender: 'support',
          text: 'Hi Emmanuel! Yes, both SME and Corporate Gifting routes on JejeLaye v1 operate on dedicated Tier-1 Telco pipes with sub-5s response.',
          time: '1 hour ago',
        },
      ],
    },
  ]);

  const [selectedTicketId, setSelectedTicketId] = useState<string>('TCK-9402');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);

  // New ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newDepartment, setNewDepartment] = useState('Technical');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newMessage, setNewMessage] = useState('');

  // Reply form
  const [replyText, setReplyText] = useState('');

  const currentTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;

    const newTicket: Ticket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newSubject,
      department: newDepartment,
      priority: newPriority,
      status: 'open',
      created_at: 'Just now',
      messages: [
        {
          sender: 'user',
          text: newMessage,
          time: 'Just now',
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setIsCreatingTicket(false);
    setNewSubject('');
    setNewMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !currentTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === currentTicket.id) {
        return {
          ...t,
          status: 'open' as const,
          messages: [
            ...t.messages,
            {
              sender: 'user' as const,
              text: replyText,
              time: 'Just now',
            },
          ],
        };
      }
      return t;
    });

    setTickets(updated);
    setReplyText('');
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900">Support Desk & Ticket Resolution</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Direct communication channel with JejeLaye engineering and billing staff.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingTicket(!isCreatingTicket)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          {isCreatingTicket ? 'View Tickets' : 'New Ticket'}
        </button>
      </div>

      {isCreatingTicket ? (
        /* CREATE TICKET VIEW */
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs max-w-2xl mx-auto space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">Open a New Support Ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Brief summary of your query"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Department</label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none"
                >
                  <option value="Technical">Technical & API</option>
                  <option value="Billing">Billing & Wallet</option>
                  <option value="Virtual Numbers">Virtual Numbers</option>
                  <option value="Gift Cards">Gift Card Trades</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (Urgent)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Include transaction reference if related to an order..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingTicket(false)}
                className="flex-1 rounded-lg border border-neutral-300 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-lg bg-emerald-700 py-2 text-xs font-bold text-white hover:bg-emerald-800"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* TICKETS MASTER-DETAIL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ticket List */}
          <div className="lg:col-span-5 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">My Tickets</h3>
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedTicketId === t.id ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-neutral-900">{t.id}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      t.status === 'answered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : t.status === 'open'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-neutral-900 mt-1 line-clamp-1">{t.subject}</div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-2">
                  <span>{t.department}</span>
                  <span>{t.created_at}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Conversation Thread */}
          <div className="lg:col-span-7 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between min-h-[420px]">
            {currentTicket ? (
              <>
                <div className="space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900">{currentTicket.id}</span>
                      <span className="text-[11px] text-neutral-500">{currentTicket.department} Department</span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900 mt-1">{currentTicket.subject}</h3>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {currentTicket.messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`rounded-lg p-3 text-xs space-y-1 ${
                          m.sender === 'user' ? 'bg-neutral-100 ml-6 text-neutral-900' : 'bg-emerald-50 mr-6 text-emerald-950 border border-emerald-100'
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-semibold opacity-70">
                          <span>{m.sender === 'user' ? 'You' : 'JejeLaye Support Engineer'}</span>
                          <span>{m.time}</span>
                        </div>
                        <p>{m.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSendReply} className="mt-4 pt-3 border-t border-neutral-100 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your reply message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText}
                    className="rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50 shrink-0"
                  >
                    Reply
                  </button>
                </form>
              </>
            ) : (
              <div className="text-xs text-neutral-500 text-center my-auto">Select a ticket to view messages.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
