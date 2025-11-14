<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Events with Sanctions Report</title>
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
            position: relative;
        }
        .header-content {
            text-align: center;
        }
        .logo {
            width: 60px;
            height: 60px;
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
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-closed {
            background-color: #FEE2E2;
            color: #991B1B;
        }
        .badge-open {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Events with Sanctions Report</h1>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Event Name</th>
                <th>Date</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Sanctions Count</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($events as $index => $event)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $event->agenda }}</td>
                <td>{{ \Carbon\Carbon::parse($event->date)->format('M d, Y') }}</td>
                <td>{{ \Carbon\Carbon::parse($event->time_in)->format('h:i A') }}</td>
                <td>{{ \Carbon\Carbon::parse($event->time_out)->format('h:i A') }}</td>
                <td style="text-align: center;">{{ $event->sanctions_count }}</td>
                <td>
                    <span class="badge {{ $event->status === 'closed' ? 'badge-closed' : 'badge-open' }}">
                        {{ ucfirst($event->status) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center;">No events found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>PITON Attendance Monitoring System - Events with Sanctions Report</p>
    </div>
</body>
</html>
