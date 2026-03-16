import React from 'react';

function ActionButton({ icon, label, onClick, variant = "primary", danger = false, disabled = false, className = "" }) {
    let baseClasses = "flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-body";

    if (variant === "primary") {
        if (danger) {
            baseClasses += " text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20";
        } else {
            baseClasses += " text-white bg-brand-600 hover:bg-brand-700 shadow-sm shadow-brand-600/20";
        }
    } else if (variant === "secondary") {
        if (danger) {
            baseClasses += " text-red-600 border border-red-200 bg-white hover:border-red-500 hover:bg-red-50 shadow-sm";
        } else {
            baseClasses += " text-slate-600 border border-slate-200 bg-white hover:border-brand-500 hover:text-brand-600 shadow-sm";
        }
    } else if (variant === "ghost") {
        if (danger) {
            baseClasses += " text-red-500 hover:bg-red-50";
        } else {
            baseClasses += " text-slate-500 hover:text-brand-600 hover:bg-brand-50";
        }
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
        >
            {icon && <i className={`${icon} text-xs leading-none`} />}
            {label && <span>{label}</span>}
        </button>
    );
}

export default ActionButton;
