<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Member Sanctions Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #3b82f6;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: bold;
        }
        .text-red {
            color: #dc2626;
        }
        .text-green {
            color: #16a34a;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Member Sanctions Report</h1>
        <p>PITON Integrated Management System</p>
        <p>Generated: {{ $generatedAt }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Member Name</th>
                <th class="text-center">Total Sanctions</th>
                <th class="text-right">Total Amount</th>
                <th class="text-right">Unpaid Amount</th>
                <th class="text-right">Paid Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($memberSanctions as $member)
            <tr>
                <td>{{ $member['student_id'] }}</td>
                <td>{{ $member['member_name'] }}</td>
                <td class="text-center">{{ $member['sanction_count'] }}</td>
                <td class="text-right font-bold">PHP {{ number_format($member['total_amount'], 2) }}</td>
                <td class="text-right font-bold text-red">PHP {{ number_format($member['unpaid_amount'], 2) }}</td>
                <td class="text-right font-bold text-green">PHP {{ number_format($member['paid_amount'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Master Prince123@gmail.com.</p>
    </div>
</body>
</html>
