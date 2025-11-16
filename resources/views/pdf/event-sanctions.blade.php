<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Event Sanctions Report</title>
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
        .badge-paid {
            background-color: #DBEAFE;
            color: #1E40AF;
        }
        .badge-unpaid {
            background-color: #FEE2E2;
            color: #991B1B;
        }
        .badge-excused {
            background-color: #F3E8FF;
            color: #6B21A8;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Event Sanctions Report</h1>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="event-info">
        <h2>{{ $event->agenda }}</h2>
        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->date)->format('F d, Y') }}</p>
        <p><strong>Time In:</strong> {{ \Carbon\Carbon::parse($event->time_in)->format('h:i A') }}</p>
        <p><strong>Time Out:</strong> {{ \Carbon\Carbon::parse($event->time_out)->format('h:i A') }}</p>
        <p><strong>Total Sanctions:</strong> {{ $sanctions->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($sanctions as $index => $sanction)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $sanction->member->student_id }}</td>
                <td>{{ $sanction->member->firstname }} {{ $sanction->member->lastname }}</td>
                <td>{{ $sanction->reason }}</td>
                <td>PHP {{ number_format($sanction->amount, 2) }}</td>
                <td>
                    @if($sanction->status === 'paid')
                        <span class="badge badge-paid">Paid</span>
                    @elseif($sanction->status === 'excused')
                        <span class="badge badge-excused">Excused</span>
                    @else
                        <span class="badge badge-unpaid">Unpaid</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center;">No sanctions found for this event</td>
            </tr>
            @endforelse
        </tbody>
        @if($sanctions->count() > 0)
        <tfoot>
            <tr>
                <th colspan="4" style="text-align: right;">Total Amount:</th>
                <th colspan="2">PHP {{ number_format($sanctions->sum('amount'), 2) }}</th>
            </tr>
            <tr>
                <th colspan="4" style="text-align: right;">Paid Amount:</th>
                <th colspan="2">PHP {{ number_format($sanctions->where('status', 'paid')->sum('amount'), 2) }}</th>
            </tr>
            <tr>
                <th colspan="4" style="text-align: right;">Excused Amount:</th>
                <th colspan="2">PHP {{ number_format($sanctions->where('status', 'excused')->sum('amount'), 2) }}</th>
            </tr>
            <tr>
                <th colspan="4" style="text-align: right;">Unpaid Amount:</th>
                <th colspan="2">PHP {{ number_format($sanctions->where('status', 'unpaid')->sum('amount'), 2) }}</th>
            </tr>
        </tfoot>
        @endif
    </table>

    <div class="footer">
        <p>PITON Attendance Monitoring System - Event Sanctions Report</p>
    </div>
</body>
</html>
