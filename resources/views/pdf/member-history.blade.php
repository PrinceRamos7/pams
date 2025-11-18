<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Member History Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .batch-section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        .batch-header {
            background-color: #3b82f6;
            color: white;
            padding: 8px;
            font-weight: bold;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .member-section {
            margin-left: 15px;
            margin-bottom: 15px;
            border-left: 3px solid #e5e7eb;
            padding-left: 10px;
        }
        .member-name {
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        .member-info {
            color: #6b7280;
            font-size: 9px;
            margin-bottom: 8px;
        }
        .history-item {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
        }
        .history-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .action-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }
        .action-created {
            background-color: #d1fae5;
            color: #065f46;
        }
        .action-updated {
            background-color: #dbeafe;
            color: #1e40af;
        }
        .action-deleted {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .changes {
            margin-top: 5px;
            padding: 5px;
            background-color: #ffffff;
            border-left: 2px solid #3b82f6;
        }
        .change-item {
            margin: 3px 0;
            font-size: 9px;
        }
        .old-value {
            color: #dc2626;
            text-decoration: line-through;
        }
        .new-value {
            color: #16a34a;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
            padding-top: 10px;
        }
        .no-data {
            text-align: center;
            color: #9ca3af;
            padding: 20px;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>MEMBER HISTORY REPORT</h1>
        <p>Generated on: {{ $generatedAt }}</p>
        <p>Total Batches: {{ $batches->count() }} | Total Members: {{ $batches->sum(function($b) { return $b->members->count(); }) }}</p>
    </div>

    @forelse($batches as $batch)
        <div class="batch-section">
            <div class="batch-header">
                {{ $batch->name }} ({{ $batch->year }}) - {{ $batch->members->count() }} Members
            </div>

            @forelse($batch->members as $member)
                <div class="member-section">
                    <div class="member-name">
                        {{ $member->firstname }} {{ $member->lastname }}
                    </div>
                    <div class="member-info">
                        Student ID: {{ $member->student_id }} | Year: {{ $member->year }} | Status: {{ $member->status }}
                    </div>

                    @forelse($member->history as $history)
                        <div class="history-item">
                            <div class="history-header">
                                <div>
                                    <span class="action-badge action-{{ $history->action }}">
                                        {{ strtoupper($history->action) }}
                                    </span>
                                    <span style="margin-left: 5px; color: #6b7280;">
                                        by {{ $history->user ? $history->user->name : 'System' }}
                                    </span>
                                </div>
                                <span style="color: #9ca3af; font-size: 8px;">
                                    {{ $history->created_at->format('M d, Y h:i A') }}
                                </span>
                            </div>

                            @if($history->description)
                                <div style="margin: 5px 0; color: #374151;">
                                    {{ $history->description }}
                                </div>
                            @endif

                            @if($history->old_values || $history->new_values)
                                <div class="changes">
                                    @php
                                        $oldValues = $history->old_values ?? [];
                                        $newValues = $history->new_values ?? [];
                                        $allKeys = array_unique(array_merge(array_keys($oldValues), array_keys($newValues)));
                                    @endphp

                                    @foreach($allKeys as $key)
                                        @if(!in_array($key, ['updated_at', 'created_at']))
                                            @php
                                                $oldVal = $oldValues[$key] ?? null;
                                                $newVal = $newValues[$key] ?? null;
                                            @endphp
                                            @if($oldVal != $newVal)
                                                <div class="change-item">
                                                    <strong>{{ ucfirst(str_replace('_', ' ', $key)) }}:</strong>
                                                    @if($oldVal)
                                                        <span class="old-value">{{ $oldVal }}</span>
                                                    @endif
                                                    @if($newVal)
                                                        <span class="new-value">{{ $newVal }}</span>
                                                    @endif
                                                </div>
                                            @endif
                                        @endif
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    @empty
                        <div class="no-data">No history available</div>
                    @endforelse
                </div>
            @empty
                <div class="no-data">No members in this batch</div>
            @endforelse
        </div>
    @empty
        <div class="no-data">No batches found</div>
    @endforelse

    <div class="footer">
        <p>PITON Attendance Monitoring System - Member History Report</p>
        <p>This is a computer-generated document. No signature required.</p>
    </div>
</body>
</html>
