import React from "react";

export default function FaceIOConfigCheck() {
    // No configuration needed! face-api.js is completely free!
    return (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                        ✅ Free Face Recognition Active!
                    </h3>
                    <p className="text-green-700 text-sm">
                        This system uses <strong>face-api.js</strong> - a completely FREE, open-source face recognition library. 
                        No API keys required, no registration needed, no limits!
                    </p>
                </div>
            </div>
        </div>
    );
}
