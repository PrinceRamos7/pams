import React, { useState } from "react";
import { X, Upload, Download, AlertCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

export default function BulkAddMediaTeamModal({ isOpen, onClose, batches }) {
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            parseExcelFile(selectedFile);
        }
    };

    const parseExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const formattedData = jsonData.map((row) => ({
                    student_id: row["Student ID"] || row["student_id"] || "",
                    firstname: row["First Name"] || row["firstname"] || "",
                    lastname: row["Last Name"] || row["lastname"] || "",
                    sex: row["Sex"] || row["sex"] || "",
                    role: row["Role"] || row["role"] || "",
                    specialization: row["Specialization"] || row["specialization"] || "",
                    year: row["Year"] || row["year"] || "",
                    email: row["Email"] || row["email"] || "",
                    phone_number: row["Phone Number"] || row["phone_number"] || "",
                    address: row["Address"] || row["address"] || "",
                }));

                setParsedData(formattedData);
                toast.success(`Parsed ${formattedData.length} rows from Excel file`, { position: 'top-right' });
            } catch (error) {
                toast.error("Failed to parse Excel file. Please check the format.", { position: 'top-right' });
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const downloadTemplate = () => {
        const template = [
            {
                "Student ID": "XX-XXXXX",
                "First Name": "John",
                "Last Name": "Doe",
                "Sex": "Male",
                "Role": "Photographer",
                "Specialization": "Photography",
                "Year": "3rd Year",
                "Email": "john.doe@example.com",
                "Phone Number": "09123456789",
                "Address": "Sample Address",
            },
        ];

        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "MediaTeam");
        XLSX.writeFile(wb, "media_team_template.xlsx");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (parsedData.length === 0) {
            toast.error("Please upload a file with data", { position: 'top-right' });
            return;
        }

        const membersWithBatch = parsedData.map(member => ({
            ...member,
            batch_id: selectedBatch || null,
        }));

        const loadingToast = toast.loading('Importing members...', { position: 'top-right' });

        router.post('/media-team/bulk-import', { members: membersWithBatch }, {
            preserveScroll: true,
            onSuccess: (page) => {
                toast.dismiss(loadingToast);
                const response = page.props?.flash;
                if (response?.success) {
                    const data = response.data || {};
                    const successCount = data.successful || 0;
                    const failedCount = data.failed || 0;
                    
                    if (failedCount > 0) {
                        toast.success(
                            `Successfully imported ${successCount} members. ${failedCount} failed.`,
                            { position: 'top-right', duration: 5000 }
                        );
                        if (data.errors && data.errors.length > 0) {
                            console.error("Import errors:", data.errors);
                        }
                    } else {
                        toast.success(`Successfully imported ${successCount} members!`, { position: 'top-right' });
                    }
                }
                onClose();
            },
            onError: (errors) => {
                toast.dismiss(loadingToast);
                const errorMessage = Object.values(errors).flat().join(', ');
                toast.error(errorMessage || 'Failed to import members. Please try again.', { position: 'top-right' });
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl font-bold text-white">Bulk Add Media Team Members</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-blue-600 mt-0.5" size={20} />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Instructions:</p>
                                <ol className="list-decimal ml-4 space-y-1">
                                    <li>Download the Excel template</li>
                                    <li>Fill in the member details</li>
                                    <li>Upload the completed file</li>
                                    <li>Optionally select a batch for all members</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <Download size={20} />
                            Download Template
                        </button>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Upload Excel File *</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto mb-2 text-gray-400" size={40} />
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Click to upload
                            </label>
                            <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                            {file && (
                                <p className="mt-2 text-sm text-green-600 font-medium">
                                    Selected: {file.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Batch (Optional)</label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">No Batch</option>
                            {batches?.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.year}
                                </option>
                            ))}
                        </select>
                    </div>

                    {parsedData.length > 0 && (
                        <div className="mb-6">
                            <p className="text-sm font-medium mb-2">
                                Preview: {parsedData.length} members ready to import
                            </p>
                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-left">Name</th>
                                            <th className="p-2 text-left">Student ID</th>
                                            <th className="p-2 text-left">Role</th>
                                            <th className="p-2 text-left">Specialization</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedData.slice(0, 10).map((member, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="p-2">{member.firstname} {member.lastname}</td>
                                                <td className="p-2">{member.student_id || 'N/A'}</td>
                                                <td className="p-2">{member.role || '-'}</td>
                                                <td className="p-2">{member.specialization || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {parsedData.length > 10 && (
                                    <p className="text-center text-sm text-gray-500 py-2">
                                        ... and {parsedData.length - 10} more
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={parsedData.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Import Members
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
