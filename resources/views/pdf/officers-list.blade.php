<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Officers List</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563EB;
            padding-bottom: 10px;
        }
        .logo {
            width: 60px;
            height: 60px;
            display: block;
            margin: 0 auto 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            color: #1E3A8A;
        }
        .header p {
            margin: 5px 0;
            color: #1E40AF;
        }
        .summary {
            background-color: #f5f5f5;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .summary p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background-color: #3B82F6;
            color: white;
            padding: 10px;
            text-align: left;
            border: 1px solid #2563EB;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
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
        <img src="{{ public_path('avatars/piton.png') }}" alt="PITON Logo" class="logo">
        <h1>PITON Current Officers</h1>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="summary">
        <p><strong>Total Officers:</strong> {{ count($officers) }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Position</th>
                <th>Officer Name</th>
                <th>Date Appointed</th>
            </tr>
        </thead>
        <tbody>
            @forelse($officers as $index => $officer)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $officer['position'] }}</td>
                <td>{{ $officer['member_name'] }}</td>
                <td>{{ \Carbon\Carbon::parse($officer['created_at'])->format('F d, Y') }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="4" style="text-align: center;">No officers found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>PITON Attendance Monitoring System - Officers List</p>
    </div>
</body>
</html>
