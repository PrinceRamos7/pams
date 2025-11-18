<?php

namespace Database\Seeders;

use App\Models\Officer;
use App\Models\Member;
use App\Models\Batch;
use Illuminate\Database\Seeder;

class PitonOfficersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the batch for PITON AY 2025-2026
        $batch = Batch::create([
            'name' => 'PITON AY 2025-2026',
            'year' => 2025,
            'term' => 'Academic Year'
        ]);

        // Create members with their details
        $members = [
            [
                'student_id' => '22-00001',
                'firstname' => 'John Xedric',
                'lastname' => 'Alejo',
                'sex' => 'Male',
                'age' => 21,
                'birthdate' => '2004-06-07',
                'phone_number' => '09063852906',
                'address' => 'Centro San Antonio, City of Ilagan, Isabela',
                'email' => 'johnxedricalejo07@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00002',
                'firstname' => 'Deejay',
                'lastname' => 'Balila',
                'sex' => 'Male',
                'age' => 22,
                'birthdate' => '2003-12-11',
                'phone_number' => '09104650205',
                'address' => 'Cabisera 22, City of Ilagan, Isabela',
                'email' => 'deejaybalila7@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00003',
                'firstname' => 'Joe Christian',
                'lastname' => 'Bayucan',
                'sex' => 'Male',
                'age' => 21,
                'birthdate' => '2004-02-09',
                'phone_number' => '09976180799',
                'address' => 'Malalam City of Ilagan, Isabela',
                'email' => 'joechristianbayucan252@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '23-00004',
                'firstname' => 'Mercy Grace',
                'lastname' => 'Cariño',
                'sex' => 'Female',
                'age' => 21,
                'birthdate' => '2004-07-05',
                'phone_number' => '09269423088',
                'address' => 'Poilipol, Baligatan, City of Ilagan, Isabela',
                'email' => 'mercygracegc@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00015',
                'firstname' => 'Reycarl',
                'lastname' => 'Medico',
                'sex' => 'Male',
                'age' => 21,
                'birthdate' => '2004-05-05',
                'phone_number' => '09707112073',
                'address' => 'Centro San Antonio, City of Ilagan, Isabela',
                'email' => 'reycarlmedico@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-10660',
                'firstname' => 'Raven',
                'lastname' => 'Pacorsa',
                'sex' => 'Female',
                'age' => 21,
                'birthdate' => '2004-04-08',
                'phone_number' => '09630260408',
                'address' => 'Bagumbayan, City of Ilagan, Isabela',
                'email' => 'ravenpacorsa08@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '23-00776',
                'firstname' => 'Prince Andrey',
                'lastname' => 'Ramos',
                'sex' => 'Male',
                'age' => 20,
                'birthdate' => '2005-10-31',
                'phone_number' => '09707112132',
                'address' => 'San Isidro, City of Ilagan Isabela',
                'email' => 'princeandreyramos7@gmail.com',
                'year' => 'Third Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '23-00782',
                'firstname' => 'Renato',
                'lastname' => 'Beronia',
                'sex' => 'Male',
                'age' => 20,
                'birthdate' => '2005-10-18',
                'phone_number' => '09678817154',
                'address' => 'Sta. Isabel Sur, City of ilagan, Isabela',
                'email' => 'beroniarenatojr@gmail.com',
                'year' => 'Third Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00006',
                'firstname' => 'Kathrina',
                'lastname' => 'Dela Rosa',
                'sex' => 'Female',
                'age' => 21,
                'birthdate' => '2004-02-29',
                'phone_number' => '09204019042',
                'address' => 'Ara, Benito Soliven, Isabela',
                'email' => 'kathrinadelarosa12@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00007',
                'firstname' => 'Kenski',
                'lastname' => 'Quiling',
                'sex' => 'Male',
                'age' => 21,
                'birthdate' => '2004-10-23',
                'phone_number' => '09519804971',
                'address' => 'Upi, Gamu, Isabela',
                'email' => 'kenskiquiling@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '25-00221',
                'firstname' => 'Erlyn Joy',
                'lastname' => 'Noveda',
                'sex' => 'Female',
                'age' => 18,
                'birthdate' => '2007-06-25',
                'phone_number' => '09996562688',
                'address' => 'Daramuangan Norte, San Mateo, Isabela',
                'email' => 'novedaerlynjoy@gmail.com',
                'year' => 'First Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '23-00009',
                'firstname' => 'Miah',
                'lastname' => 'Lozano',
                'sex' => 'Female',
                'age' => 20,
                'birthdate' => '2005-05-25',
                'phone_number' => '09081805143',
                'address' => 'Lapogan, Tumauini, Isabela',
                'email' => 'miahtolentinolozano@gmail.com',
                'year' => 'Third Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00010',
                'firstname' => 'Anie',
                'lastname' => 'Paril',
                'sex' => 'Male',
                'age' => 22,
                'birthdate' => '2003-09-24',
                'phone_number' => '09694850323',
                'address' => 'Centro San Antonio, City of Ilagan, Isabela',
                'email' => 'arnieparil@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
            [
                'student_id' => '22-00011',
                'firstname' => 'Mark Kevin',
                'lastname' => 'Ramos',
                'sex' => 'Male',
                'age' => 21,
                'birthdate' => '2004-07-31',
                'phone_number' => '09510177285',
                'address' => 'Minanga, San Mariano, Isabela',
                'email' => 'markkevinramos965@gmail.com',
                'year' => 'Fourth Year',
                'status' => 'Active',
                'batch_id' => $batch->id,
            ],
        ];

        $createdMembers = [];
        foreach ($members as $memberData) {
            $createdMembers[] = Member::create($memberData);
        }

        // Create officers with positions
        $officers = [
            ['President', 0], // John Xedric Alejo
            ['Vice President - Internal', 1], // Deejay Balila
            ['Vice President - External', 2], // Joe Christian Bayucan
            ['Secretary', 3], // Mercy Grace Cariño
            ['Treasurer', 4], // Reycarl Medico
            ['Auditor', 5], // Raven Pacorsa
            ['Business Manager', 6], // Prince Andrey Ramos
            ['Business Manager', 7], // Renato Beronia
            ['Public Information Officer (PIO)', 8], // Kathrina Dela Rosa
            ['Public Information Officer (PIO)', 9], // Kenski Quiling
            ['Attendance Officer', 10], // Erlyn Joy Noveda
            ['PITON Representative', 11], // Miah Lozano
            ['Media Team Director', 12], // Anie Paril
            ['Media Team Managing Director', 13], // Mark Kevin Ramos
        ];

        foreach ($officers as $officer) {
            Officer::create([
                'position' => $officer[0],
                'member_id' => $createdMembers[$officer[1]]->member_id,
                'batch_id' => $batch->id,
            ]);
        }

        $this->command->info('PITON AY 2025-2026 batch, members, and officers seeded successfully!');
    }
}
