# Conversation Context & Project Status

## Overall Status
We have successfully implemented the "Admin" button in the navigation bar and the "Dynamic Blog Content" and "Courses" feature. 
Crucially, we have shifted our entire data backend strategy from MySQL/AWS to **Microsoft SharePoint** via the **Microsoft Graph API**.

---

## Recent Discussion Log

### 1. Shift to SharePoint
**User:** Decided to pivot from using AWS RDS (MySQL) and AWS S3 to using Microsoft SharePoint for data and media storage.
**AI:** Implemented `lib/graph.ts` to manage Microsoft Graph API authentication using Client Credentials (Tenant ID, Client ID, Client Secret).

### 2. Media Uploads to SharePoint Document Library
**User:** How do media uploads work now?
**AI:** Built `/api/upload/route.ts` which takes form data, uploads the file to the SharePoint root drive (Document Library), and retrieves the SharePoint `ListItem` ID to use as a lookup column for other lists.

### 3. Dynamic Data from SharePoint Lists
**User:** How are courses and blogs stored?
**AI:** They are stored in SharePoint Lists (e.g., the `courses` list). The backend `/api/courses/route.ts` maps the SharePoint list fields to the frontend array format. Media references are stored as `LookupId`s pointing to the Document Library.

### 4. Admin Authentication
**User:** How does Admin login work?
**AI:** The login route `/api/admin/login/route.ts` queries an `admin_users` list on SharePoint to validate credentials.

---

## Next Steps for Next Session
1. Continue refining the SharePoint frontend integration (e.g., fetching actual image URLs from lookup IDs).
2. Deploy the Next.js frontend (likely on Netlify, as configured in `package.json` with `@netlify/plugin-nextjs`).
