<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Officers History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 5px 0;
            font-size: 20px;
        }
        .header p {
            margin: 3px 0;
            font-size: 11px;
            color: #666;
        }
        .batch-section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .batch-header {
            background-color: #2563eb;
            color: white;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        .batch-header h2 {
            margin: 0;
            font-size: 16px;
        }
        .batch-header p {
            margin: 5px 0 0 0;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #f3f4f6;
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .status-badge {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: bold;
        }
        .status-active {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-inactive {
            background-color: #f3f4f6;
            color: #374151;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9px;
            color: #666;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PITON Officers History</h1>
        <p>Generated on {{ $generatedAt }}</p>
    </div>

    @if(count($batches) > 0)
        @foreach($batches as $batch)
            <div class="batch-section">
                <div class="batch-header">
                    <h2>{{ $batch['name'] }}</h2>
                    <p>{{ $batch['officers_count'] }} Officer{{ $batch['officers_count'] != 1 ? 's' : '' }}
                        @if($batch['year']) • Year {{ $batch['year'] }} @endif
                    </p>
                </div>

                @if(count($batch['officers']) > 0)
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 30%;">Position</th>
                                <th style="width: 35%;">Member Name</th>
                                <th style="width: 20%;">Student ID</th>
                                <th style="width: 15%;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($batch['officers'] as $officer)
                                <tr>
                                    <td><strong>{{ $officer['position'] }}</strong></td>
                                    <td>{{ $officer['member_name'] }}</td>
                                    <td>{{ $officer['student_id'] }}</td>
                                    <td>
                                        @if(isset($officer['status']) && $officer['status'] === 'Alumni')
                                            <span class="status-badge" style="background-color: #f3e8ff; color: #6b21a8;">Alumni</span>
                                        @elseif(isset($officer['status']) && $officer['status'] === 'Inactive')
                                            <span class="status-badge status-inactive">Inactive</span>
                                        @elseif(isset($officer['status']) && $officer['status'] === 'Active')
                                            <span class="status-badge status-active">Active</span>
                                        @else
                                            <span class="status-badge status-inactive">Inactive</span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                @else
                    <p style="text-align: center; padding: 20px; color: #666;">No officers in this batch</p>
                @endif
            </div>
        @endforeach
    @else
        <div class="no-data">
            <p>No officer batches found</p>
        </div>
    @endif

    <div class="footer">
        <p>PITON Integrated Management System • Officers History Report</p>
    </div>
</body>
</html>
