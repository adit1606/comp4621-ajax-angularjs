<?php
// COMP 4621 Assignment 2 - Part 2
// gets a name from index.html and sends back that person's info as JSON

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

// list of people
$people = [
    [
        'name'       => 'Alice Johnson',
        'age'        => 28,
        'email'      => 'alice.johnson@example.com',
        'phone'      => '250-555-0101',
        'city'       => 'Kamloops, BC',
        'occupation' => 'Software Developer',
    ],
    [
        'name'       => 'Brian Lee',
        'age'        => 35,
        'email'      => 'brian.lee@example.com',
        'phone'      => '604-555-0144',
        'city'       => 'Vancouver, BC',
        'occupation' => 'Network Administrator',
    ],
    [
        'name'       => 'Chloe Martin',
        'age'        => 22,
        'email'      => 'chloe.martin@example.com',
        'phone'      => '403-555-0178',
        'city'       => 'Calgary, AB',
        'occupation' => 'Computing Science Student',
    ],
    [
        'name'       => 'David Singh',
        'age'        => 41,
        'email'      => 'david.singh@example.com',
        'phone'      => '780-555-0123',
        'city'       => 'Edmonton, AB',
        'occupation' => 'Database Administrator',
    ],
    [
        'name'       => 'Emma Wilson',
        'age'        => 30,
        'email'      => 'emma.wilson@example.com',
        'phone'      => '250-555-0199',
        'city'       => 'Victoria, BC',
        'occupation' => 'UX Designer',
    ],
    [
        'name'       => 'Farhan Ahmed',
        'age'        => 26,
        'email'      => 'farhan.ahmed@example.com',
        'phone'      => '416-555-0165',
        'city'       => 'Toronto, ON',
        'occupation' => 'Security Analyst',
    ],
];

// send JSON back and stop
function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE);
    exit;
}

// get the name and check it
$name = isset($_GET['name']) ? trim((string) $_GET['name']) : '';
$name = preg_replace('/\s+/', ' ', $name);   // remove extra spaces

if ($name === '') {
    respond(400, ['found' => false, 'message' => 'Please enter a name to search for.']);
}

if (mb_strlen($name) > 50) {
    respond(400, ['found' => false, 'message' => 'The name is too long (maximum 50 characters).']);
}

if (!preg_match("/^[\p{L} .'-]+$/u", $name)) {
    respond(400, ['found' => false, 'message' => 'Names may contain only letters, spaces, hyphens, periods and apostrophes.']);
}

// search by full name or first name (not case sensitive)
$needle  = mb_strtolower($name);
$matches = [];

foreach ($people as $person) {
    $full  = mb_strtolower($person['name']);
    $first = explode(' ', $full)[0];
    if ($needle === $full || $needle === $first) {
        $matches[] = $person;
    }
}

if (count($matches) === 1) {
    respond(200, ['found' => true, 'person' => $matches[0]]);
}

// not found - suggest names that contain what was typed
$suggestions = [];
foreach ($people as $person) {
    if (mb_strpos(mb_strtolower($person['name']), $needle) !== false) {
        $suggestions[] = $person['name'];
    }
}

respond(200, [
    'found'       => false,
    'message'     => 'No person named "' . $name . '" was found.',
    'suggestions' => $suggestions,
]);
