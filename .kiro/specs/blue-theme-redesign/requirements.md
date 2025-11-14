# Blue Theme Redesign Requirements

## Introduction
Transform the PITON Attendance Monitoring System to use a blue color theme throughout the application, replacing the current mixed color scheme with a consistent blue palette.

## Glossary
- **System**: PITON Attendance Monitoring System
- **Blue Theme**: Primary color scheme using shades of blue (#2563EB, #1E40AF, #3B82F6)
- **Table Headers**: The header row of data tables
- **Action Buttons**: Interactive buttons for user actions
- **PDF Reports**: Generated PDF documents for exports

## Requirements

### Requirement 1: Blue Theme for Web Interface

**User Story:** As a user, I want a consistent blue color theme throughout the application, so that the interface looks professional and cohesive.

#### Acceptance Criteria

1. WHEN viewing any table in the System, THE table headers SHALL display with blue background (#3B82F6)
2. WHEN viewing any primary action button, THE button SHALL display with blue background (#2563EB)
3. WHEN hovering over blue buttons, THE button SHALL display darker blue (#1E40AF)
4. WHEN viewing status badges, THE active/success states SHALL use blue colors instead of green
5. WHERE applicable, THE System SHALL replace red/green color schemes with blue variations

### Requirement 2: PDF Layout Correction

**User Story:** As a user, I want the PDF reports to show the logo and title side-by-side horizontally, so that the header looks professional and compact.

#### Acceptance Criteria

1. WHEN generating any PDF report, THE logo and title SHALL display horizontally aligned (side-by-side)
2. WHEN viewing the PDF header, THE logo SHALL appear on the left side
3. WHEN viewing the PDF header, THE title SHALL appear immediately to the right of the logo
4. THE PDF header SHALL use flexbox layout with horizontal orientation
5. THE logo SHALL maintain 60x60px dimensions

### Requirement 3: PDF Blue Theme

**User Story:** As a user, I want PDF reports to use the blue color theme, so that printed documents match the application branding.

#### Acceptance Criteria

1. WHEN viewing PDF table headers, THE headers SHALL display with blue background (#3B82F6)
2. WHEN viewing PDF status badges, THE badges SHALL use blue color scheme
3. WHEN viewing PDF borders, THE borders SHALL use blue accent colors
4. THE PDF footer SHALL include blue branding elements
5. THE overall PDF design SHALL maintain professional blue theme

## Affected Components

### Web Interface Files:
- Sanctions Index page
- Sanctions Event Detail page
- Members List page
- Attendance pages (ViewAttendance, TimeIn, TimeOut)
- Attendance Table component
- Member Table component

### PDF Template Files:
- events-with-sanctions.blade.php
- event-sanctions.blade.php
- members-list.blade.php
- attendance-records.blade.php

## Color Palette

### Primary Blue Shades:
- **Primary**: #2563EB (bg-blue-600)
- **Hover**: #1E40AF (bg-blue-700)
- **Light**: #3B82F6 (bg-blue-500)
- **Lighter**: #60A5FA (bg-blue-400)
- **Lightest**: #DBEAFE (bg-blue-100)

### Text Colors:
- **Dark Blue**: #1E3A8A (text-blue-900)
- **Medium Blue**: #1E40AF (text-blue-700)
- **Light Blue**: #3B82F6 (text-blue-600)
