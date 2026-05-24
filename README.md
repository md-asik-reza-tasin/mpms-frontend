# How MPMS Frontend Works

This is the frontend application for the **Minimal Project Management System (MPMS)**.

The frontend is built with:

- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Role-based UI
- Reusable components

The frontend connects with the backend API and displays dynamic data for projects, sprints, tasks, team members, reports, and user progress.

---

## Basic Frontend Flow

```txt
User opens website
↓
Frontend checks authentication
↓
If logged in, user goes to dashboard based on role
↓
Frontend fetches data from backend API
↓
Data is displayed in UI
↓
User performs actions
↓
Frontend sends request to backend
↓
UI updates after response
```

---

## 1. Authentication Flow

The frontend has a login page.

When a user logs in:

```txt
User enters email and password
↓
Frontend sends request to POST /api/auth/login
↓
Backend checks credentials
↓
Backend returns JWT token and user data
↓
Frontend stores token and user data in localStorage
↓
Frontend redirects user based on role
```

Role-based redirect:

```txt
Admin → /dashboard
Member → /my-tasks
```

The frontend stores:

```txt
mpms_token
mpms_user
```

These are used to keep the user logged in.

---

## 2. API Communication

The frontend uses an Axios instance to communicate with the backend.

API base URL:

```txt
NEXT_PUBLIC_API_URL=https://mpms-backend-fis1.onrender.com/api
```

Every API request goes through the Axios client.

Example:

```txt
Frontend calls api.get("/projects")
↓
Actual request becomes:
https://mpms-backend-fis1.onrender.com/api/projects
```

---

## 3. JWT Token Handling

After login, the frontend sends the JWT token with protected API requests.

The token is sent in the request header:

```txt
Authorization: Bearer JWT_TOKEN
```

This allows the backend to know:

```txt
Who is making the request
What role the user has
Whether the user is allowed to access the route
```

If the backend returns `401 Unauthorized`, the frontend removes the saved token and redirects the user to login.

---

## 4. Role-Based Frontend UI

The frontend uses two roles:

```txt
Admin
Member
```

Different users see different panels.

---

## Admin Panel

Admin can access:

```txt
/dashboard
/projects
/tasks
/team
/reports
```

Admin can:

```txt
Create projects
Edit projects
Delete projects
Create sprints
Edit sprints
Delete sprints
Create tasks
Assign tasks to members
Manage team members
View reports
Approve review tasks as done
```

---

## Member Panel

Member can access:

```txt
/my-tasks
/my-projects
/progress
```

Member can:

```txt
View assigned tasks
View assigned projects
Update task status
Add comments
Add time logs
Track progress
```

Member cannot access admin pages.

If a Member tries to access admin routes, the frontend blocks or redirects them.

---

## 5. Layout System

The frontend uses a dashboard layout.

Common layout includes:

```txt
Sidebar
Header
Main content area
Logout button
User profile info
```

The sidebar changes based on user role.

Admin sidebar:

```txt
Dashboard
Projects
Tasks
Team
Reports
```

Member sidebar:

```txt
My Tasks
My Projects
Progress
```

This keeps the UI clean and role-focused.

---

## 6. Project Management Flow

Admin can create and manage projects.

Project flow:

```txt
Admin opens /projects
↓
Frontend fetches GET /projects
↓
Projects are shown in table/card layout
↓
Admin can create, view, edit, or delete project
```

Create project flow:

```txt
Admin fills project form
↓
Frontend sends POST /projects
↓
Backend saves project
↓
Frontend redirects back to project list
↓
New project appears in UI
```

Project fields:

```txt
Title
Client
Description
Start Date
End Date
Budget
Status
Thumbnail
```

Project status:

```txt
planned
active
completed
archived
```

---

## 7. Project Details Page

When Admin clicks a project, the frontend opens the project details page.

This page shows:

```txt
Project summary
Project status
Budget
Start date
End date
Progress bar
Sprints list
Tasks under each sprint
```

Main concept:

```txt
Project → Sprints → Tasks
```

This page is important because Admin manages sprints and tasks from here.

---

## 8. Sprint Management Flow

A sprint belongs to a project.

Sprint flow:

```txt
Admin opens project details
↓
Frontend fetches project sprints
↓
Admin creates sprint
↓
Backend auto-generates sprint number
↓
Frontend shows sprint under project
```

Sprint fields:

```txt
Title
Sprint Number
Start Date
End Date
Order
```

Sprint number is handled by backend.

The frontend only sends:

```txt
title
startDate
endDate
order
```

---

## 9. Task Management Flow

Tasks belong to a project and sprint.

Task flow:

```txt
Admin opens project details
↓
Admin selects sprint
↓
Admin creates task
↓
Admin assigns task to Member
↓
Task appears under sprint
```

Task fields:

```txt
Title
Description
Assignee
Estimate Hours
Priority
Status
Due Date
Attachments
Subtasks
```

Task priority:

```txt
low
medium
high
urgent
```

Task status:

```txt
todo
in_progress
review
done
```

---

## 10. Task Status Workflow

Member task workflow:

```txt
todo → in_progress → review
```

Admin approval workflow:

```txt
review → done
```

Member can send a task to review.

Admin approves the task and marks it as done.

Frontend logic:

```txt
If user is Member and task status is review:
Show "Waiting for admin approval"

If user is Admin and task status is review:
Show "Approve as Done" button
```

---

## 11. Comments

Members can add comments to tasks.

Comment flow:

```txt
Member opens task details
↓
Member writes comment
↓
Frontend sends POST /tasks/:id/comments
↓
Backend saves comment
↓
Frontend refreshes comments list
```

Comment data usually includes:

```txt
User
Message
Created date
```

Comments help team communication inside a task.

---

## 12. Time Logs

Members can log work time.

Time log flow:

```txt
Member opens task details
↓
Member enters hours and note
↓
Frontend sends POST /tasks/:id/time-logs
↓
Backend saves time log
↓
Frontend updates task details and progress
```

Time log fields:

```txt
Hours
Note
Date
```

Time logs are used for reports.

---

## 13. Team Management

Admin can manage team members.

Team page shows:

```txt
Name
Email
Role
Department
Skills
Actions
```

Admin can:

```txt
Create team member
Edit team member
Delete team member
Generate test credentials
```

Since real email invite is optional, this project uses test credentials.

Example:

```txt
Admin creates Member account
↓
Admin sets email and temporary password
↓
Member can login using those credentials
```

---

## 14. Reports

Reports show project and user progress.

Admin reports can show:

```txt
Total projects
Active projects
Total tasks
Completed tasks
Total users
Project progress
Time logged
```

Project report:

```txt
Total tasks
Completed tasks
Remaining tasks
Progress percentage
Total time logged
```

User report:

```txt
Assigned tasks
Completed tasks
Pending tasks
Total time logged
```

Progress formula:

```txt
progress = completedTasks / totalTasks * 100
```

---

## 15. Member My Tasks Page

Member can see assigned tasks.

Page flow:

```txt
Member opens /my-tasks
↓
Frontend fetches assigned tasks
↓
Member sees task list
↓
Member can update status
↓
Member can open task details
```

The page shows:

```txt
Task title
Project
Sprint
Priority
Status
Due date
Estimate hours
```

---

## 16. Member My Projects Page

Member can see projects related to assigned tasks.

Flow:

```txt
Member opens /my-projects
↓
Frontend fetches assigned tasks/projects
↓
Frontend shows related project cards
```

Each project card shows:

```txt
Project title
Client
Status
Progress
Assigned task count
Completed task count
```

---

## 17. Member Progress Page

The progress page shows personal work summary.

It displays:

```txt
Assigned tasks
Completed tasks
Pending tasks
Total time logged
Progress percentage
```

This helps Member track their own work.

---

## 18. Reusable Components

The frontend uses reusable UI components to keep code clean.

Common reusable components:

```txt
Button
Input
Select
Textarea
Card
Badge
Modal
Table
ProgressBar
LoadingSpinner
EmptyState
ConfirmDialog
PageHeader
```

This avoids repeating the same Tailwind CSS code everywhere.

Example:

```txt
Instead of writing button styles again and again,
use <Button> component.
```

This makes the frontend more maintainable and production-friendly.

---

## 19. Loading, Error, and Empty States

Every page should handle three common states.

### Loading

Shown while data is being fetched.

```txt
Loading projects...
```

### Error

Shown if API request fails.

```txt
Failed to load projects.
```

### Empty State

Shown if there is no data.

```txt
No tasks found.
```

This improves user experience.

---

## 20. Responsive UI

The frontend works on:

```txt
Mobile
Tablet
Desktop
```

Responsive behavior:

```txt
Desktop → sidebar + table layout
Mobile → drawer/card layout
Tablet → flexible grid layout
```

This is important because the task requires responsive UI.

---

## 21. Full Frontend Workflow Example

### Admin Workflow

```txt
Admin logs in
↓
Redirects to /dashboard
↓
Creates a project
↓
Creates sprint under project
↓
Creates task under sprint
↓
Assigns task to Member
↓
Views report progress
```

### Member Workflow

```txt
Member logs in
↓
Redirects to /my-tasks
↓
Opens assigned task
↓
Updates status to in_progress
↓
Adds comment
↓
Adds time log
↓
Moves task to review
```

### Admin Approval Workflow

```txt
Admin opens task
↓
Sees task status = review
↓
Clicks Approve as Done
↓
Task status changes to done
↓
Progress and reports update
```

---

## 22. How Frontend and Backend Work Together

The frontend does not store main project data permanently.

The backend is the source of truth.

Frontend responsibility:

```txt
Display data
Collect user input
Send API requests
Show loading/error/success states
Protect pages by role
```

Backend responsibility:

```txt
Store data
Validate data
Authenticate users
Authorize roles
Return API responses
Calculate reports
```

Main flow:

```txt
Frontend UI action
↓
API request
↓
Backend controller
↓
MongoDB
↓
API response
↓
Frontend updates UI
```

---

## Summary

The MPMS frontend works as a role-based dashboard interface.

It allows:

```txt
Admin to manage projects, sprints, tasks, team, and reports
Member to manage assigned tasks, comments, time logs, and progress
```

The frontend uses:

```txt
Next.js
TypeScript
Tailwind CSS
Axios
Reusable components
JWT authentication
Role-based routing
Dynamic API data
```

The main goal of the frontend is to give users a clean, responsive, and easy-to-use interface for managing project work.
