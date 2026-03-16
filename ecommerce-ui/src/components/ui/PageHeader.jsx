import React from 'react';

function PageHeader({ title, subtitle, actions }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
                <h1 className="text-xl font-bold font-heading text-slate-800 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs text-slate-400 font-body mt-0.5">{subtitle}</p>
                )}
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export default PageHeader;
