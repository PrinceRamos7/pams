import React from "react";
import { X, Home, User, Cake, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function ViewMemberModal({ member, closeModal }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">VIEW PROFILE</h2>
                    <button
                        onClick={closeModal}
                        className="text-white hover:text-gray-200 transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Profile Section */}
                <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-200">
                    {/* Avatar */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            {member.face_image ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                                    <img 
                                        src={member.face_image} 
                                        alt={`${member.firstname} ${member.lastname}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : member.profile_picture ? (
                                <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-white">
                                    <img 
                                        src={`/storage/${member.profile_picture}`} 
                                        alt={`${member.firstname} ${member.lastname}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                                    <User size={64} className="text-white" />
                                </div>
                            )}
                            {/* Face Registration Badge */}
                            {member.faceio_id && (
                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Name */}
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        {member.firstname} {member.lastname}
                    </h3>
                    
                    {/* Student ID */}
                    <p className="text-blue-600 font-semibold text-lg mb-2">
                        STUDENT ID: {member.student_id}
                    </p>
                    
                    {/* Face Registration Status */}
                    {member.faceio_id ? (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Face Registered
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-semibold">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Face Not Registered
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="p-6 grid grid-cols-2 gap-6">
                    {/* Left Column - Personal Details */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                            <Home className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-600 mb-1">Personal Details</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <User className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Sex</p>
                                <p className="text-sm font-medium text-gray-800">{member.sex || "-"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Calendar className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Year</p>
                                <p className="text-sm font-medium text-gray-800">{member.year || "-"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Cake className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Batch</p>
                                <p className="text-sm font-medium text-gray-800">{member.batch?.name || "-"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Information */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                            <Mail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-600 mb-1">Contact Information</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Mail className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-800 break-all">{member.email || "-"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Phone className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-800">{member.phone_number || "-"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <MapPin className="text-blue-600 mt-1 flex-shrink-0" size={18} />
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="text-sm font-medium text-gray-800">{member.address || "-"}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center mt-1 flex-shrink-0">
                                <span className="text-white text-xs font-bold">S</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500">Status</p>
                                <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mt-1">
                                    {member.status || "ENROLLED"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 pb-6 flex justify-center gap-4">
                    <button
                        onClick={closeModal}
                        className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}
