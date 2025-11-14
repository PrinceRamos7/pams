<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Members List</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 10px;
            padding: 15px;
        }
        h1 {
            text-align: center;
            color: #1E3A8A;
            font-size: 18px;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3B82F6;
        }
        .info {
            text-align: center;
            margin-bottom: 15px;
            font-size: 9px;
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        th {
            background-color: #3B82F6;
            color: #ffffff;
            padding: 8px 5px;
            text-align: left;
            border: 1px solid #2563EB;
            font-size: 9px;
            font-weight: bold;
        }
        td {
            padding: 6px 5px;
            border: 1px solid #cccccc;
            font-size: 9px;
        }
        tr:nth-child(even) {
            background-color: #f5f5f5;
        }
        .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 8px;
            color: #999;
            padding-top: 10px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <h1>PITON Members List</h1>
    
    <div class="info">
        <p>Generated on: {{ $generatedAt }}</p>
        <p>Total Members: {{ $members->count() }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">#</th>
                <th width="12%">Student ID</th>
                <th width="23%">Name</th>
                <th width="10%">Year</th>
                <th width="12%">Status</th>
                <th width="23%">Email</th>
                <th width="15%">Contact</th>
            </tr>
        </thead>
        <tbody>
            @forelse($members as $index => $member)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $member->student_id }}</td>
                <td>{{ $member->firstname }} {{ $member->lastname }}</td>
                <td>{{ $member->year ?? 'N/A' }}</td>
                <td>{{ $member->status ?? 'N/A' }}</td>
                <td>{{ $member->email ?? 'N/A' }}</td>
                <td>{{ $member->phone_number ?? 'N/A' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; padding: 15px;">No members found</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>PITON Attendance Monitoring System - Members List</p>
    </div>
</body>
</html>
