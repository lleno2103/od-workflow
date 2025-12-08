import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleStorage = () => {
            const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            setIsCollapsed(collapsed);
        };

        handleStorage();
        const interval = setInterval(handleStorage, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main
                className={`flex-1 flex flex-col transition-all duration-200 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'
                    }`}
            >
                <TopBar pageTitle={pageTitle} />

                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
