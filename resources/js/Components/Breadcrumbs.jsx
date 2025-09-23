import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";

/**
 * Breadcrumbs component
 * @param {Array<{href?: string, label: string}>} crumbs
 */
export default function Breadcrumbs({ crumbs }) {
    return (
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            {crumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                    {index < crumbs.length - 1 ? (
                        <Link
                            href={crumb.href}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {crumb.label}
                        </Link>
                    ) : (
                        <span className="font-semibold text-gray-800">
                            {crumb.label}
                        </span>
                    )}
                    {index < crumbs.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}
