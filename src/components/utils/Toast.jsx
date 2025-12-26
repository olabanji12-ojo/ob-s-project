import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    const icons = {
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const bgColors = {
        error: 'bg-red-50 border-red-100',
        success: 'bg-green-50 border-green-100',
        info: 'bg-blue-50 border-blue-100',
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
                >
                    <div className={`${bgColors[type]} border shadow-2xl rounded-2xl p-4 flex items-center gap-4`}>
                        <div className="flex-shrink-0">
                            {icons[type]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 leading-tight">
                                {message}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
