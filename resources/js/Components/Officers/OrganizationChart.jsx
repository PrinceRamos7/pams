import React from "react";
import { User } from "lucide-react";

/**
 * Reusable Organization Chart Component
 * Can be embedded anywhere in the application
 */
export default function OrganizationChart({
    officers,
    onImageClick = null,
    showUploadFeature = false,
    className = "",
}) {
    // Helper function to get position-based default image
    const getPositionImage = (position, officerIndex = 0) => {
        const positionMap = {
            Adviser: `adviser-${officerIndex + 1}`,
            President: "president",
            "Vice President - Internal": "vice-president-internal",
            "Vice President - External": "vice-president-external",
            Secretary: "secretary",
            Treasurer: "treasurer",
            Auditor: "auditor",
            "Business Manager": `business-manager-${officerIndex + 1}`,
            "Public Information Officer (PIO)": `pio-${officerIndex + 1}`,
            "Attendance Officer": "attendance-officer",
            "PITON Representative": "piton-representative",
            "Media Team Director": "media-team-director",
            "Media Team Managing Director": "media-managing-director",
        };

        const imageName = positionMap[position] || "default";
        return `/images/officers/${imageName}.jpg`;
    };

    const getOfficersByPosition = (position) => {
        return officers.filter((officer) => officer.position === position);
    };

    const OfficerCard = ({
        officer,
        position,
        index = 0,
        positionIndex = 0,
    }) => {
        const positionImage = getPositionImage(position, positionIndex);
        const imageUrl = officer.profile_picture || positionImage;

        const handleClick = () => {
            if (showUploadFeature && onImageClick) {
                onImageClick({
                    url: imageUrl,
                    name: `${officer.firstname} ${officer.lastname}`,
                    position,
                    memberId: officer.member_id,
                });
            }
        };

        return (
            <div
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 w-40 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-transparent rounded-tr-xl opacity-20"></div>

                <div className="relative">
                    <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center mb-2 shadow-lg border-4 border-white relative overflow-hidden group ${
                            showUploadFeature ? "cursor-pointer" : ""
                        }`}
                        onClick={handleClick}
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>

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

                        <img
                            src={imageUrl}
                            alt={`${officer.firstname} ${officer.lastname}`}
                            className="w-full h-full rounded-full object-cover relative z-10"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                    "block";
                            }}
                        />
                        <User className="w-8 h-8 text-white relative z-10 hidden" />
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-center text-xs leading-tight uppercase tracking-wide">
                    {officer.firstname} {officer.lastname}
                </h3>

                <div className="mt-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <p className="text-[10px] text-white font-bold">
                        {position}
                    </p>
                </div>
            </div>
        );
    };

    // Static Adviser Card Component
    const AdviserCard = ({ adviserNumber, index }) => {
        const adviserImage = `/images/officers/adviser-${adviserNumber}.jpg`;
        const adviserId = `adviser-${adviserNumber}`;
        // Load saved name from localStorage or use default
        const savedName =
            typeof window !== "undefined"
                ? localStorage.getItem(adviserId)
                : null;
        const adviserName = savedName || `Adviser ${adviserNumber}`;

        const handleClick = () => {
            if (showUploadFeature && onImageClick) {
                onImageClick({
                    url: adviserImage,
                    name: adviserName,
                    position: "Adviser",
                    memberId: adviserId,
                    isAdviser: true,
                });
            }
        };

        return (
            <div
                className="flex flex-col items-center p-3 bg-white rounded-xl shadow-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl hover:scale-105 transition-all duration-300 w-40 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-400 to-transparent rounded-tr-xl opacity-20"></div>

                <div className="relative">
                    <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center mb-2 shadow-lg border-4 border-white relative overflow-hidden group ${
                            showUploadFeature ? "cursor-pointer" : ""
                        }`}
                        onClick={handleClick}
                    >
                        <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-75"></div>

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

                        <img
                            src={adviserImage}
                            alt={adviserName}
                            className="w-full h-full rounded-full object-cover relative z-10"
                            onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                    "block";
                            }}
                        />
                        <User className="w-8 h-8 text-white relative z-10 hidden" />
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-center text-xs leading-tight uppercase tracking-wide">
                    {adviserName}
                </h3>

                <div className="mt-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                    <p className="text-[10px] text-white font-bold">Adviser</p>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`flex flex-col items-center justify-start gap-4 ${className}`}
        >
            {/* Title */}
            <div className="text-center mb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    OFFICERS CHART
                </h2>
                <p className="text-sm text-blue-600 font-medium">
                    PITON Officers Structure
                </p>
            </div>

            {/* Advisers - Top Level (Static) */}
            <div className="relative">
                <div className="flex justify-center gap-8">
                    <AdviserCard adviserNumber={1} index={0} />
                    <AdviserCard adviserNumber={2} index={1} />
                </div>
                {/* Vertical line down from Advisers */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-blue-400"></div>
            </div>

            {/* President - Second Level */}
            {getOfficersByPosition("President").length > 0 && (
                <div className="relative">
                    <div className="flex justify-center gap-2">
                        {getOfficersByPosition("President").map(
                            (officer, idx) => (
                                <OfficerCard
                                    key={officer.officer_id}
                                    officer={officer}
                                    position="President"
                                    index={idx}
                                />
                            )
                        )}
                    </div>
                    {/* Vertical line down from President */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-blue-400"></div>
                </div>
            )}

            {/* Vice Presidents - Second Level */}
            <div className="relative">
                {/* Horizontal line connecting VPs */}
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-blue-400"></div>

                <div className="flex gap-32 justify-center relative pt-4">
                    {/* VP Internal */}
                    {getOfficersByPosition("Vice President - Internal").length >
                        0 && (
                        <div className="relative">
                            {/* Vertical line up to horizontal connector */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-4 bg-blue-400"></div>
                            {getOfficersByPosition(
                                "Vice President - Internal"
                            ).map((officer, idx) => (
                                <OfficerCard
                                    key={officer.officer_id}
                                    officer={officer}
                                    position="VP - Internal"
                                    index={idx + 1}
                                />
                            ))}
                            {/* Vertical line down from VP */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-blue-400"></div>
                        </div>
                    )}

                    {/* VP External */}
                    {getOfficersByPosition("Vice President - External").length >
                        0 && (
                        <div className="relative">
                            {/* Vertical line up to horizontal connector */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-4 bg-blue-400"></div>
                            {getOfficersByPosition(
                                "Vice President - External"
                            ).map((officer, idx) => (
                                <OfficerCard
                                    key={officer.officer_id}
                                    officer={officer}
                                    position="VP - External"
                                    index={idx + 2}
                                />
                            ))}
                            {/* Vertical line down from VP */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-12 bg-blue-400"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Core Officers - Third Level */}
            <div className="relative">
                {/* Horizontal line connecting core officers */}
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-blue-400"></div>

                <div className="flex gap-8 justify-center relative pt-4">
                    {/* Secretary */}
                    {getOfficersByPosition("Secretary").map((officer, idx) => (
                        <div key={officer.officer_id} className="relative">
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-4 bg-blue-400"></div>
                            <OfficerCard
                                officer={officer}
                                position="Secretary"
                                index={idx + 3}
                            />
                        </div>
                    ))}

                    {/* Treasurer */}
                    {getOfficersByPosition("Treasurer").map((officer, idx) => (
                        <div key={officer.officer_id} className="relative">
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-4 bg-blue-400"></div>
                            <OfficerCard
                                officer={officer}
                                position="Treasurer"
                                index={idx + 4}
                            />
                        </div>
                    ))}

                    {/* Auditor */}
                    {getOfficersByPosition("Auditor").map((officer, idx) => (
                        <div key={officer.officer_id} className="relative">
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0.5 h-4 bg-blue-400"></div>
                            <OfficerCard
                                officer={officer}
                                position="Auditor"
                                index={idx + 5}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Business Managers & PIO - Fourth Level */}
            <div className="flex gap-6 justify-center mt-8">
                {getOfficersByPosition("Business Manager").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="Business Manager"
                            index={idx + 6}
                            positionIndex={idx}
                        />
                    )
                )}
                {getOfficersByPosition("Public Information Officer (PIO)").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="PIO"
                            index={idx + 8}
                            positionIndex={idx}
                        />
                    )
                )}
            </div>

            {/* Support Officers - Fifth Level */}
            <div className="flex gap-6 justify-center mt-8">
                {getOfficersByPosition("Attendance Officer").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="Attendance Officer"
                            index={idx + 10}
                        />
                    )
                )}
                {getOfficersByPosition("PITON Representative").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="PITON Representative"
                            index={idx + 11}
                        />
                    )
                )}
            </div>

            {/* Media Team - Sixth Level */}
            <div className="flex gap-6 justify-center mt-8">
                {getOfficersByPosition("Media Team Director").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="Media Team Director"
                            index={idx + 12}
                        />
                    )
                )}
                {getOfficersByPosition("Media Team Managing Director").map(
                    (officer, idx) => (
                        <OfficerCard
                            key={officer.officer_id}
                            officer={officer}
                            position="MT Managing Director"
                            index={idx + 13}
                        />
                    )
                )}
            </div>
        </div>
    );
}
