import React from 'react';
import { Layout } from '../components';

interface PlaceholderPageProps {
    title: string;
    description: string;
    icon?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon = '🚧' }) => {
    return (
        <Layout pageTitle={title}>
            <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">{icon}</div>
                <h2 className="text-2xl font-semibold text-black mb-2">{title}</h2>
                <p className="text-gray-500 text-center max-w-md">{description}</p>
                <div className="mt-8">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        Em Breve
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default PlaceholderPage;
