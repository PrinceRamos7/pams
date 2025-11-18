import React, { useState } from "react";
import { ChevronDown, ChevronUp, User, Calendar, FileEdit, Clock } from "lucide-react";
import { Card, CardContent } from "../ui/card";

/**
 * Reusable Member History Component
 * Displays member history grouped by batch
 */
export default function MemberHistory({ batches, searchTerm = "", className = "", onEdit, onDelete }) {
    const [expandedBatch, setExpandedBatch] = useState(null);
    const [expandedMember, setExpandedMember] = useState(null);

    const toggleBatch = (batchId) => {
        setExpandedBatch(expandedBatch === batchId ? null : batchId);
    };

    const toggleMember = (memberId) => {
        setExpandedMember(expandedMember === memberId ? null : memberId);
    };

    // Filter batches and members based on search term
    const filteredBatches = batches.filter((batch) => {
        if (!searchTerm) return true;
        
        const batchNameMatch = batch.name.toLowerCase().includes(searchTerm.toLowerCase());
        const membersMatch = batch.members.some(
            (member) =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.student_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return batchNameMatch || membersMatch;
    });

    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'updated':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'deleted':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'created':
                return <User className="w-4 h-4" />;
            case 'updated':
                return <FileEdit className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const renderChanges = (oldValues, newValues) => {
        if (!oldValues && !newValues) return null;

        const changes = [];
        const allKeys = new Set([
            ...Object.keys(oldValues || {}),
            ...Object.keys(newValues || {})
        ]);

        allKeys.forEach(key => {
            if (key === 'updated_at' || key === 'created_at') return;
            
            const oldVal = oldValues?.[key];
            const newVal = newValues?.[key];
            
            if (oldVal !== newVal) {
                changes.push(
                    <div key={key} className="flex items-start gap-2 text-sm">
                        <span className="font-medium text-gray-700 capitalize min-w-[100px]">
                            {key.replace(/_/g, ' ')}:
                        </span>
                        <div className="flex-1">
                            {oldVal && (
                                <span className="text-red-600 line-through mr-2">
                                    {String(oldVal)}
                                </span>
                            )}
                            {newVal && (
                                <span className="text-green-600 font-medium">
                                    {String(newVal)}
                                </span>
                            )}
                        </div>
                    </div>
                );
            }
        });

        return changes.length > 0 ? (
            <div className="mt-2 space-y-1 p-3 bg-gray-50 rounded-lg">
                {changes}
            </div>
        ) : null;
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {filteredBatches.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-gray-500 text-lg">No member history found</p>
                    </CardContent>
                </Card>
            ) : (
                filteredBatches.map((batch) => (
                    <Card key={batch.id} className="overflow-hidden">
                        <div
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                            onClick={() => toggleBatch(batch.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {batch.name} ({batch.year})
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {batch.member_count} {batch.member_count === 1 ? 'Member' : 'Members'}
                                    </p>
                                </div>
                            </div>
                            {expandedBatch === batch.id ? (
                                <ChevronUp className="w-6 h-6 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-6 h-6 text-gray-600" />
                            )}
                        </div>

                        {expandedBatch === batch.id && (
                            <CardContent className="p-4 bg-white">
                                {batch.members.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">
                                        No members in this batch
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {batch.members.map((member, index) => (
                                            <div
                                                key={member.member_id || `officer-${member.student_id}-${index}`}
                                                className="border border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                <div
                                                    className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => toggleMember(member.member_id || `officer-${member.student_id}-${index}`)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {member.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {member.name}
                                                                {member.is_officer && (
                                                                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                                                        Officer
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {member.student_id} • {member.year}
                                                            </p>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                <span className="font-medium">Position:</span> {member.position || 'Member'} • <span className="font-medium">Status:</span> {member.status}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">
                                                            {member.history.length} {member.history.length === 1 ? 'change' : 'changes'}
                                                        </span>
                                                        {member.source === 'member' && (
                                                            <>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onEdit && onEdit(member);
                                                                    }}
                                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                                                    title="Edit Member"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onDelete && onDelete(member);
                                                                    }}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                                                    title="Delete Member"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </>
                                                        )}
                                                        {expandedMember === (member.member_id || `officer-${member.student_id}-${index}`) ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedMember === (member.member_id || `officer-${member.student_id}-${index}`) && (
                                                    <div className="p-4 bg-white space-y-3">
                                                        {member.history.length === 0 ? (
                                                            <p className="text-center text-gray-500 py-4">
                                                                No history available
                                                            </p>
                                                        ) : (
                                                            member.history.map((history) => (
                                                                <div
                                                                    key={history.id}
                                                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                                                >
                                                                    <div className="flex items-start justify-between mb-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getActionColor(history.action)}`}>
                                                                                {getActionIcon(history.action)}
                                                                                {history.action.toUpperCase()}
                                                                            </span>
                                                                            <span className="text-sm text-gray-600">
                                                                                by {history.user_name}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                            <Calendar className="w-3 h-3" />
                                                                            {history.created_at_human}
                                                                        </div>
                                                                    </div>

                                                                    {history.description && (
                                                                        <p className="text-sm text-gray-700 mb-2">
                                                                            {history.description}
                                                                        </p>
                                                                    )}

                                                                    {renderChanges(history.old_values, history.new_values)}

                                                                    <p className="text-xs text-gray-500 mt-2">
                                                                        {history.created_at}
                                                                    </p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        )}
                    </Card>
                ))
            )}
        </div>
    );
}
