import React from "react";
import { User } from "lucide-react";

export default function MediaTeamChartComponent({ mediaTeam, onCardClick = null, onUploadClick = null, showUploadFeature = false }) {
    const getMediaTeamByRole = (role) => {
        return mediaTeam.filter((member) => member.role === role);
    };

    const MediaTeamCard = ({ member, index = 0, isLeader = false }) => {
        return (
            <div
                className={`flex flex-col items-center p-4 bg-white rounded-2xl shadow-lg border-2 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-fade-in-up relative cursor-pointer ${
                    isLeader 
                        ? 'border-purple-400 w-48 bg-gradient-to-br from-purple-50 to-pink-50' 
                        : 'border-purple-200 hover:border-purple-400 w-44'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onCardClick && onCardClick(member)}
            >
                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-10 h-10 bg-gradient-to-br ${
                    isLeader ? 'from-purple-500' : 'from-purple-400'
                } to-transparent rounded-tr-2xl opacity-20`}></div>

                {/* Profile Picture */}
                <div className="relative mb-3">
                    <div 
                        className={`${isLeader ? 'w-20 h-20' : 'w-16 h-16'} rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden group ${showUploadFeature ? 'cursor-pointer' : ''}`}
                        onClick={(e) => {
                            if (showUploadFeature && onUploadClick) {
                                e.stopPropagation();
                                onUploadClick(member);
                            }
                        }}
                    >
                        {/* Animated ring */}
                        {isLeader && (
                            <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-75"></div>
                        )}

                        {/* Upload overlay */}
                        {showUploadFeature && (
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center z-20">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}

                        {member.profile_picture ? (
                            <img
                                src={member.profile_picture}
                                alt={`${member.firstname} ${member.lastname}`}
                                className="w-full h-full rounded-full object-cover relative z-10"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextElementSibling.style.display = "block";
                                }}
                            />
                        ) : null}
                        <User className={`${isLeader ? 'w-10 h-10' : 'w-8 h-8'} text-white relative z-10 ${member.profile_picture ? 'hidden' : ''}`} />
                    </div>
                </div>

                {/* Name */}
                <h3 className={`font-bold text-gray-900 text-center leading-tight uppercase tracking-wide ${
                    isLeader ? 'text-sm' : 'text-xs'
                }`}>
                    {member.firstname} {member.lastname}
                </h3>

                {/* Role Badge */}
                <div className={`mt-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-md ${
                    isLeader ? 'px-4 py-1.5' : ''
                }`}>
                    <p className={`text-white font-bold ${isLeader ? 'text-xs' : 'text-[10px]'}`}>
                        {member.role}
                    </p>
                </div>
            </div>
        );
    };

    const director = getMediaTeamByRole("Media Team Director")[0];
    const managingDirector = getMediaTeamByRole("Media Team Managing Director")[0];
    const members = getMediaTeamByRole("Media Team Member");

    return (
        <div className="flex flex-col items-center justify-start gap-8 py-8 px-4">
            {/* Enhanced Title */}
            <div className="text-center mb-4">
                <div className="inline-block">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-2">
                        MEDIA TEAM CHART
                    </h2>
                    <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full"></div>
                </div>
                <p className="text-sm text-purple-600 font-medium mt-3 tracking-wide">
                    PITON Media Team Structure
                </p>
            </div>

            {/* Director Level */}
            {director && (
                <div className="relative">
                    <MediaTeamCard member={director} index={0} isLeader={true} />
                    {/* Vertical line down with gradient */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-purple-400 to-purple-300"></div>
                </div>
            )}

            {/* Managing Director Level */}
            {managingDirector && (
                <div className="relative">
                    <MediaTeamCard member={managingDirector} index={1} isLeader={true} />
                    {/* Vertical line down with gradient */}
                    {members.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-gradient-to-b from-purple-400 to-purple-300"></div>
                    )}
                </div>
            )}

            {/* Members Level */}
            {members.length > 0 && (
                <div className="relative pt-12">
                    {/* Horizontal line connecting members - positioned above the cards */}
                    {members.length > 1 && (
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" style={{ top: '0px' }}></div>
                    )}
                    
                    <div className="flex gap-6 justify-center flex-wrap max-w-6xl">
                        {members.map((member, idx) => (
                            <div key={member.media_team_id} className="relative">
                                {/* Vertical line connecting to horizontal line - only if multiple members */}
                                {members.length > 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-12 bg-purple-400" style={{ top: '-48px' }}></div>
                                )}
                                <MediaTeamCard member={member} index={idx + 2} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!director && !managingDirector && members.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No media team members found</p>
                    <p className="text-gray-400 text-sm mt-2">Add members to see the organizational chart</p>
                </div>
            )}
        </div>
    );
}
