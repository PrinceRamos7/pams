<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Member;
use App\Models\Officer;
use App\Models\Batch;
use Carbon\Carbon;

class PitonMembersAndOfficersAY2025_2026Seeder extends Seeder
{
    public function run()
    {
        // Get or create the batch for PITON AY 2025-2026
        $batch = Batch::firstOrCreate(
            ['name' => 'PITON AY 2025-2026'],
            [
                'name' => 'PITON AY 2025-2026',
                'year' => 2025,
                'term' => '2025-2026'
            ]
        );

        $members = [
            ['student_id' => '22-10582', 'firstname' => 'Mercy Grace', 'lastname' => 'Cariño', 'birthdate' => '2004-07-05', 'sex' => 'Female', 'phone_number' => '09269423088', 'email' => 'mercygracegc@gmail.com', 'address' => 'Poilipol, Baligatan, City of Ilagan, Isabela', 'year' => 'Third Year'],
            ['student_id' => '24-00751', 'firstname' => 'Andrei Sam', 'lastname' => 'Pambid', 'birthdate' => '2005-12-26', 'sex' => 'Male', 'phone_number' => '09533480791', 'email' => 'pambidandreisam26@gmail.com', 'address' => 'Mangcuram, Ilagan, Isabela', 'year' => 'Second Year'],
            ['student_id' => '23-00776', 'firstname' => 'Prince Andrey', 'lastname' => 'Ramos', 'birthdate' => '2005-10-31', 'sex' => 'Male', 'phone_number' => '09707112132', 'email' => 'princeandreyramos7@gmail.com', 'address' => 'San Isidro, City of Ilagan, Isabela', 'year' => 'Third Year'],
            ['student_id' => '23-00001', 'firstname' => 'Miah', 'lastname' => 'Lozano', 'birthdate' => '2005-05-25', 'sex' => 'Female', 'phone_number' => '09081805143', 'email' => 'miahtolentinolozano@gmail.com', 'address' => 'Lapogan, Tumauini, Isabela', 'year' => 'Third Year'],
            ['student_id' => '24-00001', 'firstname' => 'Earl Stephen', 'lastname' => 'Castillejo', 'birthdate' => '2006-03-01', 'sex' => 'Male', 'phone_number' => '09364425306', 'email' => 'castillejoearlstephen1@gmail.com', 'address' => 'Alinguigan 2nd, City of Ilagan, Isabela', 'year' => 'Second Year'],
            ['student_id' => '24-00002', 'firstname' => 'Deejay', 'lastname' => 'Balila', 'birthdate' => '2003-12-11', 'sex' => 'Male', 'phone_number' => '09104650205', 'email' => 'deejaybalila7@gmail.com', 'address' => 'Cabisera 22, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '24-00764', 'firstname' => 'Jose Russel', 'lastname' => 'Aquino', 'birthdate' => '2004-07-30', 'sex' => 'Male', 'phone_number' => '09700851752', 'email' => 'aquinojoserussel@gmail.com', 'address' => 'Magsaysay, Naguilian, Isabela', 'year' => 'Second Year'],
            ['student_id' => '22-10512', 'firstname' => 'Joe Christian', 'lastname' => 'Bayucan', 'birthdate' => '2004-02-09', 'sex' => 'Male', 'phone_number' => '09976180799', 'email' => 'joechristianbayucan252@gmail.com', 'address' => 'Malalam, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '23-00782', 'firstname' => 'Renato', 'lastname' => 'Beronia Jr.', 'birthdate' => '2005-10-18', 'sex' => 'Male', 'phone_number' => '09678817154', 'email' => 'beroniarenatojr@gmail.com', 'address' => 'Sta. Isabel Sur, City of Ilagan, Isabela', 'year' => 'Third Year'],
            ['student_id' => '22-00001', 'firstname' => 'Mark Kevin', 'lastname' => 'Ramos', 'birthdate' => '2004-07-31', 'sex' => 'Male', 'phone_number' => '09510177285', 'email' => 'markkevinramos965@gmail.com', 'address' => 'Minanga, San Mariano, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '24-00003', 'firstname' => 'Gweyne', 'lastname' => 'Gangan', 'birthdate' => '2005-07-27', 'sex' => 'Male', 'phone_number' => '09053319803', 'email' => 'gweynegangan@gmail.com', 'address' => 'Baculod, City of Ilagan', 'year' => 'Second Year'],
            ['student_id' => '22-00002', 'firstname' => 'Arnie', 'lastname' => 'Paril', 'birthdate' => '2003-09-24', 'sex' => 'Male', 'phone_number' => '09694850323', 'email' => 'arnieparil@gmail.com', 'address' => 'Centro San Antonio, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-10668', 'firstname' => 'Kenski', 'lastname' => 'Quiling', 'birthdate' => '2004-10-23', 'sex' => 'Male', 'phone_number' => '09519804971', 'email' => 'kenskiquiling@gmail.com', 'address' => 'Upi, Gamu, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '24-00437', 'firstname' => 'Arjay', 'lastname' => 'Balmores', 'birthdate' => '2006-01-02', 'sex' => 'Male', 'phone_number' => '09750529890', 'email' => 'arjaybalmores1@gmail.com', 'address' => 'Rang-Ayan, Ilagan, Isabela', 'year' => 'Second Year'],
            ['student_id' => '22-00003', 'firstname' => 'John Xedric', 'lastname' => 'Alejo', 'birthdate' => '2004-06-07', 'sex' => 'Male', 'phone_number' => '09063852906', 'email' => 'johnxedricalejo07@gmail.com', 'address' => 'Centro San Antonio, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '24-00753', 'firstname' => 'Darryl', 'lastname' => 'Tamayo', 'birthdate' => '2005-11-22', 'sex' => 'Male', 'phone_number' => '09554778665', 'email' => 'tamayodarryl22@gmail.com', 'address' => 'Sta. Barbara, City of Ilagan, Isabela', 'year' => 'Second Year'],
            ['student_id' => '22-00004', 'firstname' => 'Kathrina', 'lastname' => 'dela Rosa', 'birthdate' => '2004-02-29', 'sex' => 'Female', 'phone_number' => '09204019042', 'email' => 'kathrinadelarosa12@gmail.com', 'address' => 'Ara, Benito Soliven, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-20031', 'firstname' => 'Reycarl', 'lastname' => 'Medico', 'birthdate' => '2004-05-05', 'sex' => 'Male', 'phone_number' => '09707112073', 'email' => 'reycarlmedico@gmail.com', 'address' => 'Centro San Antonio, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-00005', 'firstname' => 'Russel Kurtson', 'lastname' => 'Cabalonga', 'birthdate' => '2004-09-14', 'sex' => 'Male', 'phone_number' => '09466050322', 'email' => 'russelpaetcabalonga@gmail.com', 'address' => 'Alibagu, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-00006', 'firstname' => 'Chelsie', 'lastname' => 'Manahan', 'birthdate' => '2004-02-19', 'sex' => 'Female', 'phone_number' => '09462866429', 'email' => 'cmanahan38@gmail.com', 'address' => 'Surcoc, Naguilian, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '24-00765', 'firstname' => 'Carlo Sian', 'lastname' => 'Patubo', 'birthdate' => '2006-06-06', 'sex' => 'Male', 'phone_number' => '09121298317', 'email' => 'carlosianpatubo429@gmail.com', 'address' => 'Alinguigan 2nd, City of Ilagan, Isabela', 'year' => 'Second Year'],
            ['student_id' => '22-00007', 'firstname' => 'Lady Heart', 'lastname' => 'Rivera', 'birthdate' => '2002-12-17', 'sex' => 'Female', 'phone_number' => '09361642603', 'email' => 'ladyheartrivera@gmail.com', 'address' => 'Capitol, Delfin Albano, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-00008', 'firstname' => 'Harold', 'lastname' => 'Agriam', 'birthdate' => '2003-07-18', 'sex' => 'Male', 'phone_number' => '09605468332', 'email' => 'agriamharold18@gmail.com', 'address' => 'Morado, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '22-10660', 'firstname' => 'Raven', 'lastname' => 'Pacorsa', 'birthdate' => '2004-04-08', 'sex' => 'Female', 'phone_number' => '09630260408', 'email' => 'ravenpacorsa08@gmail.com', 'address' => 'Bagumbayan, City of Ilagan, Isabela', 'year' => 'Fourth Year'],
            ['student_id' => '25-00211', 'firstname' => 'Erlyn Joy', 'lastname' => 'Noveda', 'birthdate' => '2007-06-25', 'sex' => 'Female', 'phone_number' => '09996562688', 'email' => 'novedaerlynjoy@gmail.com', 'address' => 'Daramuangan Norte, San Mateo, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00001', 'firstname' => 'Dom Andrei', 'lastname' => 'Maneja', 'birthdate' => '2007-10-12', 'sex' => 'Male', 'phone_number' => '09166934737', 'email' => 'andreimaneja12@gmail.com', 'address' => 'Osmeña, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00018', 'firstname' => 'Henry', 'lastname' => 'Pereda III', 'birthdate' => '2007-09-12', 'sex' => 'Male', 'phone_number' => '09536890197', 'email' => 'peredahenry6@gmail.com', 'address' => 'Carmencita, Delfin Albano, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00161', 'firstname' => 'Henry', 'lastname' => 'Aggabao', 'birthdate' => '2007-01-19', 'sex' => 'Male', 'phone_number' => '09157417384', 'email' => 'aggabaohenry341@gmail.com', 'address' => 'Gayong Gayong Sur, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00002', 'firstname' => 'Daren Dave', 'lastname' => 'Aquilana', 'birthdate' => '2007-09-14', 'sex' => 'Male', 'phone_number' => '09995314835', 'email' => 'darendave431@gmail.com', 'address' => 'Centro San Antonio, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00110', 'firstname' => 'Kate Danielle', 'lastname' => 'Alcayde', 'birthdate' => '2007-08-12', 'sex' => 'Female', 'phone_number' => '09366245797', 'email' => 'kated.alcayde@gmail.com', 'address' => 'Calamagui 2nd, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00003', 'firstname' => 'Aerold', 'lastname' => 'Lanquita', 'birthdate' => '2007-03-25', 'sex' => 'Male', 'phone_number' => '09533149965', 'email' => 'aeroldlanquita22@gmail.com', 'address' => 'Sisim Alto, Tumauini, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00004', 'firstname' => 'Rhizen Alexie', 'lastname' => 'Buslig', 'birthdate' => '2007-04-26', 'sex' => 'Male', 'phone_number' => '09982426358', 'email' => 'rhizenalexiebuslig0@gmail.com', 'address' => 'Sipay, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '25-00005', 'firstname' => 'Vinze Rajah', 'lastname' => 'Marquez', 'birthdate' => '2003-04-07', 'sex' => 'Male', 'phone_number' => '09218792567', 'email' => 'marqvinz@gmail.com', 'address' => 'Calamagui 2nd, City of Ilagan, Isabela', 'year' => 'First Year'],
            ['student_id' => '23-00004', 'firstname' => 'James Paul', 'lastname' => 'Manglapuz', 'birthdate' => '2005-01-01', 'sex' => 'Male', 'phone_number' => '09360960916', 'email' => 'jamespaulmanglapuz115@gmail.com', 'address' => 'Marana 1st, City of Ilagan, Isabela', 'year' => 'Third Year'],
        ];

        $createdMembers = [];
        foreach ($members as $memberData) {
            $age = Carbon::parse($memberData['birthdate'])->age;
            
            // Find member by student_id OR email
            $member = Member::where('student_id', $memberData['student_id'])
                ->orWhere('email', $memberData['email'])
                ->first();
            
            if ($member) {
                // Update the member with new data (including potentially new student_id)
                $member->update(array_merge($memberData, [
                    'age' => $age,
                    'batch_id' => $batch->id,
                    'status' => 'Active',
                ]));
                $this->command->info("Updated: {$memberData['student_id']} - {$memberData['firstname']} {$memberData['lastname']}");
            } else {
                // Create new member
                $member = Member::create(array_merge($memberData, [
                    'age' => $age,
                    'batch_id' => $batch->id,
                    'status' => 'Active',
                ]));
                $this->command->info("Created: {$memberData['student_id']} - {$memberData['firstname']} {$memberData['lastname']}");
            }
            
            $createdMembers[$memberData['student_id']] = $member;
        }

        // Delete all existing officers for this batch to avoid duplicates
        Officer::where('batch_id', $batch->id)->delete();
        $this->command->info("Cleared existing officers for batch: {$batch->name}");

        // Create officers with positions
        $officers = [
            ['position' => 'President', 'student_id' => '22-00003'], // John Xedric Alejo
            ['position' => 'Vice President - Internal', 'student_id' => '24-00002'], // Deejay Balila
            ['position' => 'Vice President - External', 'student_id' => '22-10512'], // Joe Christian Bayucan
            ['position' => 'Secretary', 'student_id' => '22-10582'], // Mercy Grace Cariño
            ['position' => 'Treasurer', 'student_id' => '22-20031'], // Reycarl Medico
            ['position' => 'Auditor', 'student_id' => '22-10660'], // Raven Pacorsa
            ['position' => 'Business Manager', 'student_id' => '23-00776'], // Prince Andrey Ramos
            ['position' => 'Business Manager', 'student_id' => '23-00782'], // Renato Beronia Jr.
            ['position' => 'Public Information Officer (PIO)', 'student_id' => '22-10668'], // Kenski Quiling
            ['position' => 'Public Information Officer (PIO)', 'student_id' => '22-00004'], // Kathrina Dela Rosa
            ['position' => 'Attendance Officer', 'student_id' => '25-00211'], // Erlyn Joy Noveda
            ['position' => 'PITON Representative', 'student_id' => '23-00001'], // Miah Lozano
            ['position' => 'Media Team Director', 'student_id' => '22-00002'], // Arnie Paril
            ['position' => 'Media Team Managing Director', 'student_id' => '22-00001'], // Mark Kevin Ramos
        ];

        foreach ($officers as $officerData) {
            if (isset($createdMembers[$officerData['student_id']])) {
                $member = $createdMembers[$officerData['student_id']];
                
                Officer::create([
                    'member_id' => $member->member_id,
                    'batch_id' => $batch->id,
                    'position' => $officerData['position']
                ]);
                
                $this->command->info("Officer: {$officerData['position']} - {$member->firstname} {$member->lastname}");
            } else {
                $this->command->warn("Officer not created: {$officerData['position']} - Student ID {$officerData['student_id']} not found");
            }
        }

        $this->command->info('PITON Members and Officers for AY 2025-2026 seeded successfully!');
    }
}
