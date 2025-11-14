# Blue Theme Redesign - Implementation Tasks

## Task Overview
Convert the PITON Attendance Monitoring System to use a consistent blue color theme across all web pages and PDF exports.

---

## Phase 1: PDF Template Updates

### - [ ] 1. Fix PDF Header Layout (All Templates)
Update all 4 PDF templates to ensure logo and title are side-by-side horizontally.

- [ ] 1.1 Update events-with-sanctions.blade.php header layout
  - Add `flex-direction: row` to `.header-content`
  - Verify logo appears on left, title on right
  - Test PDF generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 1.2 Update event-sanctions.blade.php header layout
  - Add `flex-direction: row` to `.header-content`
  - Verify logo appears on left, title on right
  - Test PDF generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 1.3 Update members-list.blade.php header layout
  - Add `flex-direction: row` to `.header-content`
  - Verify logo appears on left, title on right
  - Test PDF generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 1.4 Update attendance-records.blade.php header layout
  - Add `flex-direction: row` to `.header-content`
  - Verify logo appears on left, title on right
  - Test PDF generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

### - [ ] 2. Apply Blue Theme to PDF Templates

- [ ] 2.1 Update events-with-sanctions.blade.php colors
  - Change table header background to #3B82F6 (blue-500)
  - Change table header text to white
  - Update border colors to blue (#2563EB)
  - Update status badges to blue theme
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 2.2 Update event-sanctions.blade.php colors
  - Change table header background to #3B82F6 (blue-500)
  - Change table header text to white
  - Update border colors to blue (#2563EB)
  - Update status badges to blue theme
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 2.3 Update members-list.blade.php colors
  - Change table header background to #3B82F6 (blue-500)
  - Change table header text to white
  - Update border colors to blue (#2563EB)
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 2.4 Update attendance-records.blade.php colors
  - Change table header background to #3B82F6 (blue-500)
  - Change table header text to white
  - Update border colors to blue (#2563EB)
  - Update status badges to blue theme
  - _Requirements: 3.1, 3.2, 3.3_

---

## Phase 2: Sanctions Pages

### - [ ] 3. Update Sanctions Index Page

- [ ] 3.1 Update buttons in Sanctions Index
  - Change Export PDF button from red to blue (bg-blue-600 hover:bg-blue-700)
  - Verify button hover states
  - _Requirements: 1.2, 1.3_

- [ ] 3.2 Update table headers in Sanctions Index
  - Change table header from bg-gray-50 to bg-blue-500 text-white
  - Verify text readability
  - _Requirements: 1.1_

- [ ] 3.3 Update status badges in Sanctions Index
  - Change active status badges to blue theme
  - Maintain closed status as red
  - _Requirements: 1.4_

### - [ ] 4. Update Sanctions EventDetail Page

- [ ] 4.1 Update buttons in EventDetail
  - Change Export PDF button from red to blue
  - Change Mark as Paid button from green to blue
  - Keep Edit button blue (already correct)
  - _Requirements: 1.2, 1.3_

- [ ] 4.2 Update table headers in EventDetail
  - Change table header from bg-gray-50 to bg-blue-500 text-white
  - Verify text readability
  - _Requirements: 1.1_

- [ ] 4.3 Update status badges in EventDetail
  - Update paid/unpaid badges to use blue accents
  - Maintain clear distinction between paid and unpaid
  - _Requirements: 1.4_

---

## Phase 3: Members Pages

### - [ ] 5. Update Members List Page

- [ ] 5.1 Update buttons in MemberList
  - Change Export PDF button from red to blue
  - Update any action buttons to blue theme
  - _Requirements: 1.2, 1.3_

- [ ] 5.2 Update table headers in MemberList
  - Change table header from bg-gray-50 to bg-blue-500 text-white
  - Verify text readability
  - _Requirements: 1.1_

### - [ ] 6. Update Member Table Component

- [ ] 6.1 Update MemberTable component colors
  - Change table header to blue theme
  - Update action buttons to blue
  - Verify dropdown menu styling
  - _Requirements: 1.1, 1.2, 1.3_

---

## Phase 4: Attendance Pages

### - [ ] 7. Update ViewAttendance Page

- [ ] 7.1 Update buttons in ViewAttendance
  - Change Export PDF button from red to blue
  - Update Add More Attendance button to blue variations
  - Change time-in button from green to blue
  - Change time-out button from orange to blue-600
  - _Requirements: 1.2, 1.3_

- [ ] 7.2 Update table headers in ViewAttendance
  - Change table header from bg-gray-50 to bg-blue-500 text-white
  - Verify text readability
  - _Requirements: 1.1_

### - [ ] 8. Update AttendanceTable Component

- [ ] 8.1 Update buttons in AttendanceTable
  - Keep New Event button blue (already correct)
  - Update Time In/Out buttons to blue variations
  - Change active status badges from green to blue
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 8.2 Update event cards in AttendanceTable
  - Change active status indicators from green to blue
  - Update hover states to blue
  - _Requirements: 1.4_

### - [ ] 9. Update TimeIn/TimeOut Pages

- [ ] 9.1 Update TimeIn page colors
  - Change submit button from green to blue
  - Update active window indicator from green to blue
  - Change step indicators to blue theme
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 9.2 Update TimeOut page colors
  - Change submit button from red to blue
  - Update active window indicator to blue
  - Change step indicators to blue theme
  - _Requirements: 1.2, 1.3, 1.4_

### - [ ] 10. Update TwoStepTimeIn/TimeOut Pages

- [ ] 10.1 Update TwoStepTimeIn colors
  - Change buttons from green to blue
  - Update step indicators to blue
  - Change active status to blue
  - _Requirements: 1.2, 1.3, 1.4_

- [ ] 10.2 Update TwoStepTimeOut colors
  - Change buttons from red to blue
  - Update step indicators to blue
  - Change active status to blue
  - _Requirements: 1.2, 1.3, 1.4_

---

## Phase 5: Testing and Verification

### - [ ] 11. Visual Testing

- [ ] 11.1 Test all web pages
  - Navigate to each page
  - Verify all buttons are blue
  - Check table headers are blue with white text
  - Confirm status badges use blue theme
  - Test all hover states
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 11.2 Test all PDF exports
  - Generate Events with Sanctions PDF
  - Generate Event Sanctions PDF
  - Generate Members List PDF
  - Generate Attendance Records PDF
  - Verify logo and title are side-by-side
  - Check table headers are blue
  - Confirm badges use blue colors
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

### - [ ] 12. Browser Compatibility Testing

- [ ] 12.1 Test in Chrome
  - Verify all pages render correctly
  - Test PDF generation
  - _Requirements: All_

- [ ] 12.2 Test in Firefox
  - Verify all pages render correctly
  - Test PDF generation
  - _Requirements: All_

- [ ] 12.3 Test in Edge
  - Verify all pages render correctly
  - Test PDF generation
  - _Requirements: All_

### - [ ] 13. Responsive Testing

- [ ] 13.1 Test desktop view (1920x1080)
  - Verify all pages look correct
  - Check button sizes and spacing
  - _Requirements: All_

- [ ] 13.2 Test tablet view (768x1024)
  - Verify responsive layout
  - Check button accessibility
  - _Requirements: All_

- [ ] 13.3 Test mobile view (375x667)
  - Verify mobile layout
  - Check touch targets
  - _Requirements: All_

---

## Phase 6: Build and Deploy

### - [ ] 14. Final Build

- [ ] 14.1 Run frontend build
  - Execute `npm run build`
  - Verify no build errors
  - Check bundle size
  - _Requirements: All_

- [ ] 14.2 Clear caches
  - Clear Laravel cache
  - Clear browser cache
  - Clear PDF cache
  - _Requirements: All_

- [ ] 14.3 Final verification
  - Test all pages one final time
  - Generate all PDF types
  - Verify everything works correctly
  - _Requirements: All_

---

## Summary

**Total Tasks:** 14 main tasks, 42 sub-tasks
**Estimated Time:** 4-6 hours
**Files to Modify:** 12 files (8 web interface + 4 PDF templates)
**Build Required:** Yes (npm run build)
**Testing Required:** Extensive visual and functional testing

## Notes

- All tasks should be completed in order
- Test after each phase before moving to the next
- Keep the original files backed up in case rollback is needed
- Document any issues encountered during implementation
