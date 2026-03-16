import React from 'react';

/**
 * Modern StatusBadge using Tailwind
 * @param {string} status - e.g. "active", "pending", "error", "warning", "success", "inactive", "delivered", "shipped", "processing", "cancelled"
 * @param {string} label - The text to display
 */
function StatusBadge({ status, label }) {
    let classes = "bg-slate-100 text-slate-600"; // default grey
    
    // Safety check: ensure status is a string and handle null/undefined/numbers/booleans
    const safeStatus = typeof status === 'string' 
        ? status 
        : (status != null ? String(status) : "");
        
    const normalizedStatus = safeStatus.toLowerCase();

    if (["active", "success", "delivered", "1", "true", "enabled"].includes(normalizedStatus)) {
        classes = "bg-emerald-50 text-emerald-700";
    } else if (["pending", "processing", "warning"].includes(normalizedStatus)) {
        classes = "bg-amber-50 text-amber-700";
    } else if (["error", "cancelled", "0", "false", "disabled", "inactive", "locked", "deleted"].includes(normalizedStatus)) {
        classes = "bg-red-50 text-red-600";
    } else if (["shipped", "info"].includes(normalizedStatus)) {
        classes = "bg-blue-50 text-blue-700";
    }

    // Safely render the label or status text
    const displayText = label || safeStatus || "UNKNOWN";

    return (
        <span className={`inline-flex items-center text-[10px] font-semibold font-body px-2 py-0.5 rounded-lg uppercase tracking-wide border border-transparent ${classes}`}>
            {displayText}
        </span>
    );
}

export default StatusBadge;
