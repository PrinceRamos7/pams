<html>
<body>
    <h1>PITON Members List</h1>
    <p>Generated: {{ $generatedAt }}</p>
    <p>Total: {{ $members->count() }}</p>
    
    <table border="1" cellpadding="5" cellspacing="0" width="100%">
        <tr>
            <th>#</th>
            <th>Student ID</th>
            <th>Name</th>
        </tr>
        @foreach($members as $index => $member)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $member->student_id }}</td>
            <td>{{ $member->firstname }} {{ $member->lastname }}</td>
        </tr>
        @endforeach
    </table>
</body>
</html>
