<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MediaTeam;
use App\Models\Batch;
use Carbon\Carbon;

class MediaTeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the current batch (AY 2025-2026)
        $currentBatch = Batch::where('year', '2025-2026')->first();

        $mediaTeamMembers = [
            // Media Team Director
            [
                'student_id' => '22-11313',
                'firstname' => 'Arnie Lelina',
                'lastname' => 'Paril',
                'birthdate' => '2003-09-24',
                'sex' => 'Male',
                'phone_number' => '9694850323',
                'email' => 'arnielparil@gmail.com',
                'year' => '4A-WMAD',
                'address' => 'Centro San Antonio, City of Ilagan, Isabela',
                'role' => 'Media Team Director',
                'status' => 'Active',
            ],
            // Media Team Managing Director
            [
                'student_id' => '22-10682',
                'firstname' => 'Mark Kevin Magundayao',
                'lastname' => 'Ramos',
                'birthdate' => '2004-07-31',
                'sex' => 'Male',
                'phone_number' => '9510177285',
                'email' => 'markkevinramos965@gmail.com',
                'year' => '4A-WMAD',
                'address' => 'Minanga, San Mariano, Isabela',
                'role' => 'Media Team Managing Director',
                'status' => 'Active',
            ],
            // Media Team Members
            [
                'student_id' => '24-00751',
                'firstname' => 'Andrei Sam Paddanan',
                'lastname' => 'Pambid',
                'birthdate' => '2005-12-26',
                'sex' => 'Male',
                'phone_number' => '9533480791',
                'email' => 'pambidandreisam26@gmail.com',
                'year' => '2A-WMAD',
                'address' => 'Mangcuram, Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '24-00764',
                'firstname' => 'Jose Russel Marinduque',
                'lastname' => 'Aquino',
                'birthdate' => '2004-07-30',
                'sex' => 'Male',
                'phone_number' => '9700851752',
                'email' => 'aquinojoserussel@gmail.com',
                'year' => '2A-WMAD',
                'address' => 'Magsaysay, Naguilian, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '24-00753',
                'firstname' => 'Darryl Navalta',
                'lastname' => 'Tamayo',
                'birthdate' => '2005-11-22',
                'sex' => 'Male',
                'phone_number' => '9554778665',
                'email' => 'tamayodarryl22@gmail.com',
                'year' => '2A-WMAD',
                'address' => 'Sta.Barbara, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-00211',
                'firstname' => 'Erlyn Joy Sobrevilla',
                'lastname' => 'Noveda',
                'birthdate' => '2007-06-25',
                'sex' => 'Female',
                'phone_number' => '9996562688',
                'email' => 'novedaerlynjoy@gmail.com',
                'year' => '1A-WMAD',
                'address' => 'Daramuangan Norte, San Mateo, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => null, // No student ID provided
                'firstname' => 'Dom Andrei L.',
                'lastname' => 'Maneja',
                'birthdate' => '2007-10-12',
                'sex' => 'Male',
                'phone_number' => '9166934737',
                'email' => 'andreimaneja12@gmail.com',
                'year' => '1A-WMAD',
                'address' => 'Osmeña, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-00018',
                'firstname' => 'Henry B.',
                'lastname' => 'Pereda III',
                'birthdate' => '2007-09-12',
                'sex' => 'Male',
                'phone_number' => '9536890197',
                'email' => 'peredahenry6@gmail.com',
                'year' => '1A-NS',
                'address' => 'Carmencita, Delfin Albano, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-00161',
                'firstname' => 'Henry A.',
                'lastname' => 'Aggabao',
                'birthdate' => '2007-01-19',
                'sex' => 'Male',
                'phone_number' => '9157417384',
                'email' => 'aggabaohenry341@gmal.com',
                'year' => '1A-WMAD',
                'address' => 'Gayong Gayong Sur, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-01129',
                'firstname' => 'Daren Dave M.',
                'lastname' => 'Aquilana',
                'birthdate' => '2007-09-14',
                'sex' => 'Male',
                'phone_number' => '9995314835',
                'email' => 'darendave431@gmail.com',
                'year' => '1A-WMAD',
                'address' => 'Centro San Antonio, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-00110',
                'firstname' => 'Kate Danielle R.',
                'lastname' => 'Alcayde',
                'birthdate' => '2007-08-12',
                'sex' => 'Female',
                'phone_number' => '9366245797',
                'email' => 'kated.alcayde@gmail.com',
                'year' => '1A-WMAD',
                'address' => 'Calamagui 2nd, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-0012',
                'firstname' => 'Aerold D.',
                'lastname' => 'Lanquita',
                'birthdate' => '2007-03-25',
                'sex' => 'Male',
                'phone_number' => '9533149965',
                'email' => 'aeroldlanquita22@gmail.com',
                'year' => '1A-WMAD',
                'address' => 'Sisim Alto, Tumauini, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '25-00105',
                'firstname' => 'Rhizen Alexie L.',
                'lastname' => 'Buslig',
                'birthdate' => '2007-04-26',
                'sex' => 'Male',
                'phone_number' => '9982426358',
                'email' => 'rhizenalexiebuslig0@gamil.com',
                'year' => '1A-WMAD',
                'address' => 'Sipay, City Of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '22-10833',
                'firstname' => 'Vinze Rajah S.',
                'lastname' => 'Marquez',
                'birthdate' => '2003-04-07',
                'sex' => 'Male',
                'phone_number' => '9218792567',
                'email' => 'marqvinz@gmail.com',
                'year' => '2B-NS',
                'address' => 'Calamagui 2nd, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
            [
                'student_id' => '23-00287',
                'firstname' => 'James Paul Q.',
                'lastname' => 'Manglapuz',
                'birthdate' => '2005-01-01',
                'sex' => 'Male',
                'phone_number' => '9360960916',
                'email' => 'jamespaulmanglapuz115@gmail.com',
                'year' => '2B-NS',
                'address' => 'Marana 1st, City of Ilagan, Isabela',
                'role' => 'Media Team Member',
                'status' => 'Active',
            ],
        ];

        foreach ($mediaTeamMembers as $member) {
            // Calculate age from birthdate
            $age = $member['birthdate'] ? Carbon::parse($member['birthdate'])->age : null;

            MediaTeam::create([
                'student_id' => $member['student_id'],
                'firstname' => $member['firstname'],
                'lastname' => $member['lastname'],
                'birthdate' => $member['birthdate'],
                'age' => $age,
                'sex' => $member['sex'],
                'phone_number' => $member['phone_number'],
                'email' => $member['email'],
                'year' => $member['year'],
                'address' => $member['address'],
                'role' => $member['role'],
                'status' => $member['status'],
                'batch_id' => $currentBatch?->id,
            ]);
        }

        $this->command->info('Media Team members seeded successfully!');
        $this->command->info('Total members: ' . count($mediaTeamMembers));
        $this->command->info('- 1 Media Team Director');
        $this->command->info('- 1 Media Team Managing Director');
        $this->command->info('- 13 Media Team Members');
    }
}
