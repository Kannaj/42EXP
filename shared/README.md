# Shared

This folder contains react/redux files. This folder is shared by both the `server` and `client` folders.

---

## actions and reducers

Hopefully , these folders should be pretty straightforward. A few notes

  - The state in client is formed by 4 objects.
    - User state which contains user info such as
      - isAuthenticated
      - User skillset along with commends for each skill00
      - User xp and level
    - Project state which contains an array of projects the user is part of
      - Project name
      - Project id
      - Project messages
      - unread message count
    - Notification state which contains read and unread messages
    - Loader state which simply overlays the app with a loader when a request is being made.

The rest of the state (API calls) is handled outside of redux by react alone.

---

## components and containers

Pretty straightforward really. Will add more info if required.

---

## utils

Misc operations

---
