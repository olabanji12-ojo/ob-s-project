import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { currentUser, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-40">
                <div className="w-12 h-12 border-4 border-[#8B5E3C] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-serif italic text-sm">Verifying credentials...</p>
            </div>
        );
    }

    if (!currentUser || !isAdmin) {
        return <Navigate to="/login_page" replace />;
    }

    return children;
};

export default AdminRoute;
