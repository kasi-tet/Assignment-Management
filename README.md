Assignment Manager Dashboard ============================

A modern, responsive, and animated dashboard for managing assignments and reviewing student submissions. Built with React, TypeScript, Tailwind CSS, and Headless UI — designed for modular architecture, team scalability, and production readiness.

🚀 Features

Strictly typed with TypeScript — zero any usage

Stylish, classic UI with Tailwind CSS and animated transitions

Modular component structure for easy onboarding and reuse

Dashboard stats with real-time assignment/submission metrics

Create, edit, delete assignments with modal support

Review submissions with feedback, grading, and status updates

Fully responsive across mobile, tablet, and desktop

🛠️ Tech Stack

Frontend: React + TypeScript

Styling: Tailwind CSS + Headless UI

State Management: Custom hooks (useAssignments)

Build Tool: Vite

Icons: Heroicons

📁 Folder Structure src/ ├── features/ │ └── asignments_submissions/ │ ├── pages/ │ │ └── assignment_sub.tsx │ ├── components/ │ │ ├── admin/ │ │ │ ├── AssignmentList.tsx │ │ │ ├── SubmissionList.tsx │ │ │ ├── DashboardStats.tsx │ │ │ └── CreateAssignmentModal.tsx │ │ └── common/ │ │ ├── Layout.tsx │ │ └── LoadingSpinner.tsx │ ├── hooks/ │ │ └── useAssignments.ts │ └── types/ │ └── assignment.ts

📦 Installation

Clone the repo git clone https://github.com/your-username/assignment-manager.git cd assignment-manager

Install dependencies npm install

Start development server npm run dev

🧪 Development Notes

Tailwind directives are defined in index.css: @tailwind base; @tailwind components; @tailwind utilities;

All components follow strict prop typing and modular separation

Transitions use @headlessui/react for smooth tab switching and modal animations

🧠 Author Built by Enock Muteti — Computer Science student, freelance developer, and lead planner for CISLU Tech Society platforms.