# Finance Dashboard UI

A clean, responsive, and completely interactive finance dashboard interface designed to simulate a modern personal finance tracking application. It is a powerful frontend application demonstrating advanced local state management, seamless data visualization, and an intuitive user experience without requiring an active backend architecture.

## Features & Implementation

### 1. Dashboard Overview
- **Summary Cards**: Displays Total Remaining Balance, Income, and Expenses with calculated percentage change indicators.
- **Time-Based Visualization**: Interactive charts (Area, Line, Bar) displaying income vs. expenses over time.
- **Categorical Visualization**: Interactive charts (Pie, Radar, Radial) breaking down expenses by categorized segments.

### 2. Transactions Logging
- View a robust list of transactions including Date, Amount, Category, Payee, and Account details.
- **Filtering**: Global filters by specific Date ranges and Account types.
- **Sorting & Search**: Clickable column headers allow for instant dynamic sorting, alongside a global search bar to locate specific Payees.

### 3. Role-Based Context (Simulated RBAC)
- State-driven "Admin" and "Viewer" roles can be swapped seamlessly from the top-right header dropdown.
- **Admin Role**: Full access workflow. View, Add, Edit, and Delete transactions, categories, and accounts. Loaded with a "Personal Finance" mock dataset.
- **Viewer Role**: Complete read-only access. UI components for modifying data are deliberately disabled or locked with access warnings. Loaded with a completely separate "Business/Client" mockup dataset to demonstrate total UI data isolation.

### 4. Insights Section
- A dedicated `/insights` tab providing dynamic calculations derived from the current active dataset:
  - Highest & Lowest spending categories.
  - Average transaction amounts & Most active account.
  - Formatted Monthly Comparisons tracking net income vs. expenses.
  - Visual progress bars breaking down category percentages.

### 5. Data Persistence & State Management
- Global Application state is handled flawlessly by **Zustand**.
- All data interacts through pure, instant client-side updates without needing artificial loading states or Mock APIs.
- Utilizing `zustand/middleware/persist`, **all modifications are safely maintained within the browser's `localStorage`**. Added transactions, deleted categories, or new accounts will persist safely between browser refreshes.

### 6. CSV Import Capabilities
- The application natively supports importing bulk CSV files in the Transactions page. Uploaded files are parsed dynamically and merged directly into the Zustand store, retaining immediate persistence.

### 7. Responsive UI/UX
- Heavily styled utilizing **Tailwind CSS** and **shadcn-ui**.
- The dashboard is built to be beautifully responsive across Mobile devices (hamburger sliding menus), Tablets, and Desktop viewing experiences.

---

## Tech Stack
- React 19 / Next.js 15 (App Router)
- Zustand (State Management + LocalStorage Persistence)
- Tailwind CSS & shadcn/ui (Styling & Components)
- Recharts (Data Visualization)
- TanStack React Table (Data grids & Sorting)

---

## Getting Started

### Prerequisites
Make sure **Node.js** (v18+) is installed on your local machine.

### Setup Instructions

1. **Clone the repository** (or extract the project files):
   ```bash
   git clone <repository-url>
   cd finance-dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install --legacy-peer-deps
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **View the Application**:
   Open [http://localhost:3000](http://localhost:3000) with your browser to explore the dashboard.

*(Note: There are no `.env` files or complex backend servers required to run this application. The environment runs exclusively and immediately in the client).*

---

## Overview of Approach

The foundational priority of this project was demonstrating excellent component architecture, clean data flow pipelines, and UI aesthetic without introducing bloated backend dependencies.

The core orchestration heavily revolves around a robust **Zustand store**. This local store is initialized with comprehensive mock transactions so that the dashboard doesn't initialize into a vacant state. The store is structured to simulate network independence—mutations update the application synchronously while instantly syncing parallel data down to `localStorage`.

To tackle the complexities of **Role-Based UI**, instead of hiding simple actionable buttons, the store architecture leverages two wholly isolated datasets (`adminData` and `viewerData`). By toggling the active role, it does not just lock down inputs, but seamlessly swaps the entire active data pipeline to prove that the application's state management is comprehensively reactive from root to leaf within the DOM tree.

Aesthetically, the layout prioritizes clean layouts utilizing bold gradients, distinct interactive hover-states, intuitive sliding sheets for create/edit forms, and beautiful data visualization charts configured for dark/light variations.
