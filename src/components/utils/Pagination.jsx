import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center space-x-2 mt-12 py-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${currentPage === page
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-gray-200 text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
