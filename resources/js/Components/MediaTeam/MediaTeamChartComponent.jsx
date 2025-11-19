import React from "react";
import { User } from "lucide-react";

export default function MediaTeamChartComponent({ mediaTeam, onCardClick = null, onUploadClick = null, showUploadFeature = false }) {
    const getMediaTeamByRole = (role) => {
        return mediaTeam.filter((member) => member.role === role);
    };

    const MediaTeamCard = ({ member, index = 0 }) => {
        return (
            <div
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl hover:scale-105 transition-all duration-300 w-40 animate-fade-in-up relative cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onCardClick && onCardClick(member)}
            >
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-transparent rounded-tr-xl opacity-20"></div>

                <div className="relative">
                    <div 
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 flex items-center justify-center mb-2 shadow-lg border-4 border-white relative overflow-hidden group ${showUploadFeature ? 'cursor-pointer' : ''}`}
                        onClick={(e) => {
                            if (showUploadFeature && onUploadClick) {
                                e.stopPropagation();
                                onUploadClick(member);
                            }
                        }}
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-75"></div>

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
                        <User className={`w-8 h-8 text-white relative z-10 ${member.profile_picture ? 'hidden' : ''}`} />
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-center text-xs leading-tight uppercase tracking-wide">
                    {member.firstname} {member.lastname}
                </h3>

                <div className="mt-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full">
                    <p className="text-[10px] text-white font-bold">
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
        <div className="flex flex-col items-center justify-start gap-8 py-8">
            {/* Title */}
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    MEDIA TEAM CHART
                </h2>
                <p className="text-sm text-purple-600 font-medium">
                    PITON Media Team Structure
                </p>
            </div>

            {/* Director Level */}
            {director && (
                <div className="relative">
                    <MediaTeamCard member={director} index={0} />
                    {/* Vertical line down */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-purple-400"></div>
                </div>
            )}

            {/* Managing Director Level */}
            {managingDirector && (
                <div className="relative">
                    <MediaTeamCard member={managingDirector} index={1} />
                    {/* Vertical line down */}
                    {members.length > 0 && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-purple-400"></div>
                    )}
                </div>
            )}

            {/* Members Level */}
            {members.length > 0 && (
                <div className="relative">
                    {/* Horizontal line connecting members */}
                    {members.length > 1 && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-purple-400" style={{ top: '-12px' }}></div>
                    )}
                    
                    <div className="flex gap-6 justify-center flex-wrap max-w-5xl">
                        {members.map((member, idx) => (
                            <div key={member.media_team_id} className="relative">
                                {/* Vertical line up to horizontal connector */}
                                {members.length > 1 && (
                                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-12 bg-purple-400"></div>
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
