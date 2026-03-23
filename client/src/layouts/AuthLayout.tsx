import React from 'react';
import { Code2, Cpu, Database, Globe, Shield } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    footerText,
    footerLinkText,
    footerLinkHref
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
            {/* Header */}
            <header className="py-6 px-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                            <Code2 className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">CodePlatform</h1>
                            <p className="text-sm text-gray-600">For Developers, By Developers</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Cpu size={20} className="text-blue-600" />
                        <Database size={20} className="text-blue-600" />
                        <Globe size={20} className="text-blue-600" />
                        <Shield size={20} className="text-blue-600" />
                    </div>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-12">

                    {/* Auth Form */}
                    <div className="lg:w-1/2 max-w-md w-full">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                                <p className="text-gray-600 mt-2">{subtitle}</p>
                            </div>

                            {children}

                            <div className="text-center text-sm text-gray-500 mt-8">
                                <p>
                                    {footerText}{' '}
                                    <a
                                        href={footerLinkHref}
                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        {footerLinkText}
                                    </a>
                                </p>
                            </div>

                            {/* Privacy Links */}
                            <div className="flex justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
                                <span className="text-gray-300">•</span>
                                <a href="#" className="text-sm text-gray-500 hover:text-gray-700">Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;