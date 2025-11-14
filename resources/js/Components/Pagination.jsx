import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ links, className = '' }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            {links.map((link, index) => {
                // Skip if no URL (disabled state)
                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-2 text-sm text-gray-400 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                // Previous button
                if (index === 0) {
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="ml-1">Previous</span>
                        </Link>
                    );
                }

                // Next button
                if (index === links.length - 1) {
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="mr-1">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    );
                }

                // Page numbers
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                            link.active
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
