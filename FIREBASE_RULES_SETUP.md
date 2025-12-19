# Firebase Realtime Database Rules Setup

This document provides the Firebase Realtime Database security rules needed for this application to work correctly.

## Issue
The admin account (silasputerbaugh1@gmail.com) is unable to update announcement/hero text and other settings in the Firebase Realtime Database. This is due to restrictive or missing security rules.

## Solution
Configure the Firebase Realtime Database rules in the Firebase Console to allow:
1. Authenticated admin users to read/write to `announcement`, `settings`, `games`, and `trending` paths
2. All authenticated users to read games data
3. Authenticated users to write to their own leaderboard entries

## How to Apply These Rules

1. Go to the Firebase Console: https://console.firebase.google.com/
2. Select your project: **druskii**
3. Navigate to **Realtime Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the rules below
6. Click **Publish** to apply the changes

## Recommended Firebase Realtime Database Rules

```json
{
  "rules": {
    "games": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.email == 'silasputerbaugh1@gmail.com'"
    },
    "trending": {
      ".read": "auth != null",
      ".write": "auth != null && auth.token.email == 'silasputerbaugh1@gmail.com'"
    },
    "announcement": {
      ".read": true,
      ".write": "auth != null && auth.token.email == 'silasputerbaugh1@gmail.com'"
    },
    "settings": {
      ".read": true,
      ".write": "auth != null && auth.token.email == 'silasputerbaugh1@gmail.com'"
    },
    "leaderboards": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "presence": {
      ".read": true,
      "sessions": {
        ".write": true
      }
    }
  }
}
```

## Rules Explanation

### `games` and `trending` paths
- **Read**: Any authenticated user can read games data
- **Write**: Only the admin account (silasputerbaugh1@gmail.com) can add, update, or delete games

### `announcement` path
- **Read**: Anyone can read announcements (even non-authenticated users)
- **Write**: Only the admin account can create or update announcements

### `settings` path
- **Read**: Anyone can read settings (like hero text)
- **Write**: Only the admin account can update settings

### `leaderboards` path
- **Read**: Any authenticated user can read the leaderboard
- **Write**: Users can only update their own leaderboard entry (matched by UID)

### `presence` path
- **Read**: Anyone can see who's online
- **Write**: Anyone can write to `presence/sessions` to track their online status (no authentication required)

## Testing the Rules

After applying the rules:

1. Log in as the admin (silasputerbaugh1@gmail.com) on admin.html
2. Try updating the hero text in Settings
3. Try creating an announcement
4. Verify that the updates are saved successfully

## Additional Security Considerations

1. **Admin Account**: The admin email is hardcoded. Consider using Firebase Custom Claims for better admin role management in production.
2. **Rate Limiting**: Consider implementing rate limiting to prevent abuse.
3. **Validation**: Add data validation rules to ensure data integrity (e.g., string length limits, required fields).

## Alternative: More Permissive Rules for Testing

If you want to temporarily allow all authenticated users to write (for testing purposes only), use:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null"
  }
}
```

**⚠️ WARNING**: These permissive rules should ONLY be used for testing and NEVER in production!
