import React from "react";
import { User } from "lucide-react";

/**
 * Reusable Member Chart Component
 * Displays members in a visual chart format grouped by year
 */
export default function MemberChartComponent({ 
    members, 
    searchTerm = "", 
    cardSize = "medium",
    onMemberClick 
}) {
    // Filter members based on search
    const filteredMembers = members.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        return (
            member.firstname.toLowerCase().includes(searchLower) ||
            member.lastname.toLowerCase().includes(searchLower) ||
            (member.student_id && member.student_id.toLowerCase().includes(searchLower))
        );
    });

    // Group filtered members by year
    const membersByYear = {
        "First Year": filteredMembers.filter(m => m.year === "First Year"),
        "Second Year": filteredMembers.filter(m => m.year === "Second Year"),
        "Third Year": filteredMembers.filter(m => m.year === "Third Year"),
        "Fourth Year": filteredMembers.filter(m => m.year === "Fourth Year"),
    };

    const cardSizes = {
        small: { width: 'w-40', imageSize: 'w-28 h-28', textSize: 'text-xs', padding: 'p-3' },
        medium: { width: 'w-56', imageSize: 'w-40 h-40', textSize: 'text-sm', padding: 'p-4' },
        large: { width: 'w-72', imageSize: 'w-52 h-52', textSize: 'text-base', padding: 'p-6' },
    };

    const currentSize = cardSizes[cardSize];

    const MemberCard = ({ member, index }) => {
        const imageUrl = member.profile_picture || member.face_image || '/images/default-avatar.jpg';

        return (
            <div
                onClick={() => onMemberClick && onMemberClick(member)}
                className={`group relative flex flex-col items-center ${currentSize.padding} bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 animate-fade-in-up cursor-pointer transform hover:scale-105 hover:-translate-y-2 border border-gray-100 hover:border-blue-300 overflow-hidden`}
                style={{ animationDelay: `${index * 30}ms` }}
            >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>
                
                {/* Profile Image */}
                <div className={`relative ${currentSize.imageSize} rounded-3xl overflow-hidden mb-4 shadow-lg ring-4 ring-blue-50 group-hover:ring-blue-200 transition-all duration-300`}>
                    <img
                        src={imageUrl}
                        alt={`${member.firstname} ${member.lastname}`}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextElementSibling.style.display = "flex";
                        }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 hidden items-center justify-center">
                        <User className={`${cardSize === 'large' ? 'w-24 h-24' : cardSize === 'medium' ? 'w-16 h-16' : 'w-12 h-12'} text-white`} />
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                        <span className="text-white text-xs font-semibold">Click to view</span>
                    </div>
                </div>

                {/* Member Info */}
                <div className="relative z-10 text-center w-full">
                    <h3 className={`font-bold text-gray-900 ${currentSize.textSize} leading-tight mb-1 group-hover:text-blue-600 transition-colors duration-300`}>
                        {member.firstname} {member.lastname}
                    </h3>

                    {member.student_id && (
                        <p className={`${cardSize === 'large' ? 'text-sm' : 'text-xs'} text-gray-500 font-medium mb-2`}>
                            {member.student_id}
                        </p>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center justify-center gap-2 mt-2">
                        {member.faceio_id && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-semibold">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Face ID
                            </span>
                        )}
                        <span className={`inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full ${cardSize === 'large' ? 'text-xs' : 'text-[10px]'} font-semibold`}>
                            {member.status || 'Active'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Members by Year */}
            {Object.entries(membersByYear).map(([year, yearMembers]) => (
                yearMembers.length > 0 && (
                    <div key={year} className="mb-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                        {year.charAt(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {year}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {yearMembers.length} {yearMembers.length === 1 ? 'Member' : 'Members'}
                                </p>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {yearMembers.map((member, index) => (
                                <MemberCard
                                    key={member.member_id}
                                    member={member}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )
            ))}

            {filteredMembers.length === 0 && (
                <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {searchTerm ? 'No members found' : 'No members yet'}
                    </h3>
                    <p className="text-gray-500">
                        {searchTerm 
                            ? `No members match "${searchTerm}". Try a different search term.`
                            : 'Start by adding members to see them here.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
