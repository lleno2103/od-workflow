import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TopBarProps {
    pageTitle: string;
}

const TopBar: React.FC<TopBarProps> = ({ pageTitle }) => {
    const { userEmail } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between h-14">
            <h2 className="text-base font-medium text-black">{pageTitle}</h2>

            <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden sm:block">{userEmail}</span>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
