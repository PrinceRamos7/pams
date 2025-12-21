<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student Performance Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #8b5cf6;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #8b5cf6;
            margin: 0;
            font-size: 28px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .student-info {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #8b5cf6;
        }
        .student-info h2 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 24px;
        }
        .student-info p {
            margin: 5px 0;
            color: #6b7280;
        }
        .score-summary {
            width: 100%;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .score-summary table {
            width: 100%;
            border: none;
        }
        .score-summary td {
            border: none;
            padding: 10px;
        }
        .score-summary .label {
            font-size: 14px;
            opacity: 0.9;
        }
        .score-summary .score {
            font-size: 48px;
            font-weight: bold;
        }
        .score-summary .grade {
            font-size: 36px;
            font-weight: bold;
            background: white;
            color: #8b5cf6;
            padding: 10px 20px;
            border-radius: 8px;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background: #8b5cf6;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }
        tr:hover {
            background: #f9fafb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-green {
            background: #d1fae5;
            color: #065f46;
        }
        .badge-blue {
            background: #dbeafe;
            color: #1e40af;
        }
        .badge-yellow {
            background: #fef3c7;
            color: #92400e;
        }
        .badge-orange {
            background: #fed7aa;
            color: #9a3412;
        }
        .badge-red {
            background: #fee2e2;
            color: #991b1b;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        .summary-box {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .summary-box h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>STUDENT PERFORMANCE REPORT</h1>
        <p>PITON Performance Analytics System</p>
        <p>Generated on: {{ now()->format('F d, Y h:i A') }}</p>
    </div>

    <div class="student-info">
        <h2>{{ $member->firstname }} {{ $member->lastname }}</h2>
        <p><strong>Student ID:</strong> {{ $member->student_id }}</p>
        <p><strong>Year Level:</strong> {{ $member->year }}</p>
        <p><strong>Batch:</strong> {{ $member->batch->year ?? 'N/A' }}</p>
    </div>

    <div class="score-summary">
        <table>
            <tr>
                <td style="width: 70%;">
                    <div class="label">Overall Performance Score</div>
                    <div class="score">{{ number_format($totalScore, 2) }}</div>
                </td>
                <td style="width: 30%; text-align: right; vertical-align: middle;">
                    <div class="grade">{{ $grade }}</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="summary-box">
        <h3>Performance Breakdown</h3>
        <p>Total Categories: {{ count($performances) }}</p>
        <p>Total Weight: {{ $totalWeight }}%</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th class="text-center">Score</th>
                <th class="text-center">Weight</th>
                <th class="text-center">Weighted Score</th>
                <th class="text-center">Contribution</th>
                <th>Remarks</th>
            </tr>
        </thead>
        <tbody>
            @foreach($performances as $performance)
            <tr>
                <td><strong>{{ $performance['category_name'] }}</strong></td>
                <td class="text-center">{{ number_format($performance['score'], 2) }}</td>
                <td class="text-center">{{ number_format($performance['weight'], 2) }}%</td>
                <td class="text-center">{{ number_format($performance['weighted_score'], 2) }}</td>
                <td class="text-center">
                    @if($totalScore > 0)
                        {{ number_format(($performance['weighted_score'] / $totalScore) * 100, 1) }}%
                    @else
                        0%
                    @endif
                </td>
                <td>{{ $performance['remarks'] ?? '-' }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background: #f3f4f6; font-weight: bold;">
                <td>TOTAL</td>
                <td class="text-center">-</td>
                <td class="text-center">{{ number_format($totalWeight, 2) }}%</td>
                <td class="text-center">{{ number_format($totalScore, 2) }}</td>
                <td class="text-center">100%</td>
                <td>-</td>
            </tr>
        </tfoot>
    </table>

    <div class="summary-box">
        <h3>Grade Scale</h3>
        <p><span class="badge badge-green">A</span> 90-100 | <span class="badge badge-blue">B</span> 80-89 | <span class="badge badge-yellow">C</span> 70-79 | <span class="badge badge-orange">D</span> 60-69 | <span class="badge badge-red">F</span> Below 60</p>
    </div>

    <div class="footer">
        <p>This is an official document generated by PITON Performance Analytics System</p>
        <p>&copy; {{ date('Y') }} PITON Organization. All rights reserved.</p>
    </div>
</body>
</html>
