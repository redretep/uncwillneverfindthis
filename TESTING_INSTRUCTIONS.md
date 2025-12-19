# Testing Instructions

This document provides step-by-step instructions for testing the fixes implemented in this PR.

## Issue Summary

1. **Admin cannot update announcement/hero text** - Firebase rules need to be configured
2. **New users need username prompt** - Show a one-time popup after signup to set a username
3. **Online counter not updating** - Firebase rules prevented writes to `presence/sessions`

## Prerequisites

Before testing, you **MUST** apply the Firebase Realtime Database rules. See `FIREBASE_RULES_SETUP.md` for detailed instructions.

### Quick Firebase Rules Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **druskii**
3. Navigate to **Realtime Database** → **Rules** tab
4. Copy the rules from `FIREBASE_RULES_SETUP.md`
5. Click **Publish**

## Test Plan

### Test 1: Admin Can Update Hero Text

**Objective**: Verify admin can update site settings after Firebase rules are applied

**Steps**:
1. Open `https://druskii128.github.io/admin.html` in a browser
2. Log in with admin credentials (silasputerbaugh1@gmail.com)
3. Click the "settings" button
4. Update the hero text (e.g., change to "druskii is super gnarly -s")
5. Click "save"
6. Verify you see "hero text updated successfully!" message
7. Open `https://druskii128.github.io/` in a new tab
8. Verify the hero text displays your updated text below "druskii128"

**Expected Result**: ✅ Hero text updates successfully without errors

**If Test Fails**: 
- Check browser console for errors
- Verify Firebase rules were applied correctly
- Ensure you're logged in as the admin email

---

### Test 2: Admin Can Create Announcements

**Objective**: Verify admin can create announcements after Firebase rules are applied

**Steps**:
1. On `admin.html`, click "create announcement"
2. Fill in:
   - Title: "Welcome!"
   - Content: "Thanks for visiting our site!"
   - Button Text: "Got it"
3. Click "create announcement"
4. Verify you see "announcement created successfully!" message
5. Open `https://druskii128.github.io/` in a new tab
6. Verify the announcement banner appears at the top of the page
7. Click "Got it" to dismiss it
8. Refresh the page - announcement should not appear again (dismissed)

**Expected Result**: ✅ Announcement creates and displays successfully

---

### Test 3: New User Username Prompt

**Objective**: Verify new users see a username prompt popup after signing up

**Steps**:
1. Open `https://druskii128.github.io/login.html` in an incognito/private window
2. Click "sign up" to switch to signup form
3. Enter a new email and password (e.g., test123@example.com)
4. Click "create account"
5. You should be redirected to the home page
6. **After ~1 second**, a popup should appear with:
   - Welcome emoji 👋
   - "welcome!" heading
   - "customize your profile by setting a username"
   - Input field with current username (first part of email)
   - "skip for now" and "save username" buttons

**Expected Result**: ✅ Username prompt popup appears for new users

---

### Test 4: Username Prompt - Save Username

**Objective**: Verify users can save a custom username from the prompt

**Steps**:
1. Follow Test 3 steps 1-6 to see the username prompt
2. In the username input field, type a new username (e.g., "coolgamer123")
3. Click "save username"
4. Verify button changes to "saving..." then "✓ saved!"
5. Popup should close automatically after ~800ms
6. Click the profile icon (👤) in the top right
7. Verify your new username appears in the profile menu

**Expected Result**: ✅ Username saves successfully and displays in profile

**Validation Rules Tested**:
- Minimum 3 characters ✓
- Maximum 20 characters ✓
- Only letters, numbers, underscore, hyphen allowed ✓

---

### Test 5: Username Prompt - Skip

**Objective**: Verify users can skip the username prompt

**Steps**:
1. Follow Test 3 steps 1-6 to see the username prompt
2. Click "skip for now" button
3. Popup should close immediately
4. Username should remain as default (first part of email)

**Expected Result**: ✅ Prompt closes and user can continue with default username

---

### Test 6: Username Prompt - Only Shows Once

**Objective**: Verify the username prompt only appears once per user

**Steps**:
1. After completing Test 4 or Test 5 (username prompt was shown)
2. Refresh the page multiple times
3. Close and reopen the browser
4. Navigate away and back to the home page

**Expected Result**: ✅ Username prompt does NOT appear again

---

### Test 7: Username Prompt - Does Not Show for Existing Users

**Objective**: Verify existing users don't see the prompt

**Steps**:
1. Log in with an existing account (not a new signup)
2. Navigate to the home page

**Expected Result**: ✅ Username prompt does NOT appear

---

### Test 8: Username Validation

**Objective**: Verify username validation works correctly

**Steps**:
1. Show the username prompt (follow Test 3)
2. Try these invalid inputs:
   - Empty string → "please enter a username"
   - "ab" (too short) → "username must be at least 3 characters"
   - "a".repeat(21) (too long) → "username must be 20 characters or less"
   - "test@user" (invalid char) → "username can only contain letters, numbers, _ and -"
3. Try valid inputs:
   - "test_user" ✓
   - "cool-gamer-123" ✓
   - "Player1" ✓

**Expected Result**: ✅ All validation messages appear correctly

---

### Test 9: Multiple Admin Operations

**Objective**: Verify admin can perform multiple operations without errors

**Steps**:
1. Log in as admin
2. Add a new game
3. Toggle a game to trending
4. Update hero text
5. Create an announcement
6. Edit a leaderboard entry

**Expected Result**: ✅ All operations complete successfully without Firebase permission errors

---

### Test 10: Online Counter Updates

**Objective**: Verify the online player counter updates in real-time

**Steps**:
1. Open `https://druskii128.github.io/` in a browser (Browser A)
2. Log in with any authenticated user account
3. Note the "online" and "in game" counters in the top section
4. Open `https://druskii128.github.io/` in a different browser or incognito window (Browser B)
5. Log in with a different authenticated user account
6. Observe both counters:
   - "X online" should increase by 1 in both browsers
7. In Browser B, navigate to a game (e.g., `/projects/subway-surfers-san-francisco/`)
8. Observe the counters in Browser A:
   - "X online" should remain the same or increase
   - "X in game" should increase by 1
9. Close Browser B
10. Wait ~30 seconds and observe Browser A:
    - Both counters should decrease to reflect the closed session

**Expected Result**: ✅ Online counter updates correctly when users join/leave and enter games

**If Test Fails**:
- Check browser console for Firebase permission errors like "PERMISSION_DENIED"
- Verify Firebase rules include the `presence/sessions` write rule for authenticated users
- Ensure you're logged in (not anonymous)

---

## Known Issues / Notes

1. **Firebase Rules**: The fixes will NOT work until Firebase Realtime Database rules are updated via the Firebase Console
2. **Online Counter Fix**: The previous Firebase rules prevented the online counter from updating because the write rule structure didn't match how the presence tracking system writes data
3. **Local Storage**: Username prompt uses localStorage to track if it was shown. Clearing browser data will show it again for testing
4. **Session Storage**: The "new user signup" flag uses sessionStorage and clears after the prompt is shown
5. **Admin Email**: Currently hardcoded as `silasputerbaugh1@gmail.com` in both client and Firebase rules

## Rollback Instructions

If issues occur, you can rollback by:
1. Reverting the Firebase rules to previous version in Firebase Console
2. Removing `<script src="JS/username-prompt.js"></script>` from index.html
3. Removing the `sessionStorage.setItem('new-user-signup', 'true');` line from login.html

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Check browser DevTools → Application → Session/Local Storage
3. Verify Firebase rules match the documentation exactly
4. Ensure you're testing with the correct admin email
