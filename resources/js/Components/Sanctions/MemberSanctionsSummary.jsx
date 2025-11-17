import React from "react";
import {
    Card,
    CardContent,
} from "../ui/card";

export default function MemberSanctionsSummary({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 mb-1">Total Members with Sanctions</div>
                    <div className="text-3xl font-bold text-gray-900">{summary.total_members}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 mb-1">Total Sanctions</div>
                    <div className="text-3xl font-bold text-gray-900">{summary.total_sanctions || 0}</div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 mb-1">Total Unpaid Amount</div>
                    <div className="text-3xl font-bold text-red-600">
                        ₱{parseFloat(summary.total_unpaid).toFixed(2)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="text-sm text-gray-600 mb-1">Total Paid Amount</div>
                    <div className="text-3xl font-bold text-green-600">
                        ₱{parseFloat(summary.total_paid).toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
