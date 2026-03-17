import React from "react";

export const Icons = {
  WhatsApp: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.004 2C6.48 2 2.004 6.48 2.004 12C2.004 13.76 2.464 15.42 3.264 16.88L2 22L7.304 20.6C8.704 21.5 10.304 22 12.004 22C17.524 22 22.004 17.52 22.004 12C22.004 6.48 17.524 2 12.004 2ZM12.004 20.21C10.504 20.21 9.104 19.81 7.804 19.05L7.504 18.88L4.304 19.72L5.164 16.63L4.974 16.33C4.104 14.95 3.644 13.35 3.644 11.68C3.644 7.07 7.404 3.31 12.004 3.31C16.604 3.31 20.364 7.07 20.364 11.68C20.364 16.29 16.604 20.21 12.004 20.21ZM15.934 13.36C15.724 13.25 14.684 12.74 14.494 12.67C14.304 12.6 14.164 12.56 14.024 12.77C13.884 12.98 13.484 13.45 13.364 13.59C13.244 13.73 13.124 13.75 12.914 13.64C12.704 13.53 12.024 13.31 11.214 12.59C10.584 12.03 10.164 11.34 10.044 11.13C9.924 10.92 10.034 10.81 10.144 10.7C10.244 10.6 10.364 10.45 10.474 10.32C10.584 10.19 10.624 10.09 10.694 9.95C10.764 9.81 10.734 9.69 10.684 9.58C10.634 9.47 10.214 8.44 10.044 8.01C9.874 7.59 9.704 7.64 9.584 7.64C9.464 7.64 9.324 7.64 9.184 7.64C9.044 7.64 8.814 7.69 8.614 7.91C8.414 8.13 7.854 8.66 7.854 9.74C7.854 10.82 8.644 11.86 8.754 12.01C8.864 12.16 10.304 14.39 12.524 15.35C13.054 15.58 13.464 15.72 13.784 15.82C14.304 15.99 14.774 15.96 15.154 15.91C15.574 15.85 16.454 15.38 16.634 14.87C16.814 14.36 16.814 13.93 16.764 13.84C16.714 13.75 16.574 13.7 16.364 13.59" />
    </svg>
  ),
  Check: ({ className = "w-3 h-3" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  ArrowRight: ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Eye: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  EyeOff: ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ),
  Trash: ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  Meat: ({ className = "w-16 h-16" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z"></path>
      <path d="M10 10c0 3-2 5-5 5s-5-2-5-5 2-5 5-5 5 2 5 5z"></path>
      <path d="M14 14l-4-4"></path>
      <path d="M10 14l4-4"></path>
    </svg>
  ),
  Leaf: ({ className = "w-16 h-16" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C10.9 14.36 12 14 14 12c.5 1 1 2.09 1 4 0 3.3-2.87 6-6 6"></path>
      <line x1="11" y1="20" x2="11" y2="14"></line>
    </svg>
  ),
  Mailbox: ({ className = "w-16 h-16" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
      <polyline points="15 5 15 10 20 10"></polyline>
      <line x1="2" y1="13" x2="22" y2="13"></line>
    </svg>
  ),
  Dashboard: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Users: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  MapPin: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  ),
  Mail: ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
};
