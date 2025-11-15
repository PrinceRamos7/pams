<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Attendance Records</title>
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
        .event-info {
            background-color: #f5f5f5;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .event-info h2 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
        }
        .event-info p {
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
        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        }
        .badge-present {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .badge-absent {
            background-color: #FEE2E2;
            color: #991B1B;
        }
        .badge-late {
            background-color: #FEF3C7;
            color: #92400E;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-content">
            <img src="{{ public_path('avatars/piton.png') }}" alt="PITON Logo" class="logo" style="display: block; margin: 0 auto 10px;">
            <h1>Attendance Records</h1>
        </div>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="event-info">
        <h2>{{ $event->agenda }}</h2>
        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->date)->format('F d, Y') }}</p>
        <p><strong>Time In:</strong> {{ \Carbon\Carbon::parse($event->time_in)->format('h:i A') }}</p>
        <p><strong>Time Out:</strong> {{ \Carbon\Carbon::parse($event->time_out)->format('h:i A') }}</p>
        <p><strong>Total Attendees:</strong> {{ $records->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Time In</th>
                <th>Time Out</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($records as $index => $record)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $record->member->student_id }}</td>
                <td>{{ $record->member->firstname }} {{ $record->member->lastname }}</td>
                <td>
                    @if($record->time_in)
                        {{ \Carbon\Carbon::parse($record->time_in)->format('h:i A') }}
                    @else
                        N/A
                    @endif
                </td>
                <td>
                    @if($record->time_out)
                        {{ \Carbon\Carbon::parse($record->time_out)->format('h:i A') }}
                    @else
                        N/A
                    @endif
                </td>
                <td>
                    <span class="badge 
                        @if($record->status === 'Present') badge-present
                        @elseif($record->status === 'late') badge-late
                        @else badge-absent
                        @endif">
                        {{ ucfirst($record->status) }}
                    </span>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">No attendance records found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>PITON Attendance Monitoring System - Attendance Records</p>
    </div>
</body>
</html>
