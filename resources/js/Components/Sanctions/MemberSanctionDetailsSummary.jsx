import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../ui/card";

export default function MemberSanctionDetailsSummary({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Total Sanctions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{summary.total_sanctions}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Total Amount
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ₱{parseFloat(summary.total_amount).toFixed(2)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Unpaid Amount
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        ₱{parseFloat(summary.unpaid_amount).toFixed(2)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                        Paid Amount
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        ₱{parseFloat(summary.paid_amount).toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
