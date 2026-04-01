import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ──────────────────────────────────────────────
export type Account = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  amount: number;
  payee: string;
  notes?: string | null;
  date: string;
  accountId: string;
  categoryId?: string | null;
};

type Role = "admin" | "viewer";

interface RoleData {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
}

interface FinanceState {
  role: Role;
  adminData: RoleData;
  viewerData: RoleData;

  // Computed – returns current role's data
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];

  // Role
  setRole: (role: Role) => void;

  // Accounts
  addAccount: (data: { name: string }) => void;
  editAccount: (id: string, data: { name: string }) => void;
  deleteAccount: (id: string) => void;
  bulkDeleteAccounts: (ids: string[]) => void;

  // Categories
  addCategory: (data: { name: string }) => void;
  editCategory: (id: string, data: { name: string }) => void;
  deleteCategory: (id: string) => void;
  bulkDeleteCategories: (ids: string[]) => void;

  // Transactions
  addTransaction: (data: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  bulkDeleteTransactions: (ids: string[]) => void;
  bulkCreateTransactions: (data: Omit<Transaction, "id">[]) => void;
}

const uid = () => crypto.randomUUID();

// ── Admin Mock Data ────────────────────────────────────
const adminAccounts: Account[] = [
  { id: "acc_1", name: "Checking Account" },
  { id: "acc_2", name: "Savings Account" },
  { id: "acc_3", name: "Credit Card" },
];

const adminCategories: Category[] = [
  { id: "cat_1", name: "Food & Dining" },
  { id: "cat_2", name: "Transportation" },
  { id: "cat_3", name: "Entertainment" },
  { id: "cat_4", name: "Utilities" },
  { id: "cat_5", name: "Shopping" },
  { id: "cat_6", name: "Healthcare" },
  { id: "cat_7", name: "Salary" },
  { id: "cat_8", name: "Freelance" },
  { id: "cat_9", name: "Rent" },
];

const adminTransactions: Transaction[] = [
  { id: "txn_1",  amount: 4500,   payee: "Acme Corp",          notes: "Monthly salary",          date: "2025-03-01", accountId: "acc_1", categoryId: "cat_7" },
  { id: "txn_2",  amount: -120,   payee: "Grocery Mart",       notes: "Weekly groceries",        date: "2025-03-02", accountId: "acc_1", categoryId: "cat_1" },
  { id: "txn_3",  amount: -45,    payee: "Shell Gas Station",  notes: "Gas fill-up",             date: "2025-03-03", accountId: "acc_3", categoryId: "cat_2" },
  { id: "txn_4",  amount: -15.99, payee: "Netflix",            notes: "Monthly subscription",    date: "2025-03-04", accountId: "acc_3", categoryId: "cat_3" },
  { id: "txn_5",  amount: -85,    payee: "Electric Co.",       notes: "Electricity bill",        date: "2025-03-05", accountId: "acc_1", categoryId: "cat_4" },
  { id: "txn_6",  amount: 800,    payee: "Client: Johnson",    notes: "Freelance web design",    date: "2025-03-06", accountId: "acc_2", categoryId: "cat_8" },
  { id: "txn_7",  amount: -250,   payee: "Amazon",             notes: "Headphones + keyboard",   date: "2025-03-07", accountId: "acc_3", categoryId: "cat_5" },
  { id: "txn_8",  amount: -60,    payee: "CVS Pharmacy",       notes: "Prescriptions",           date: "2025-03-08", accountId: "acc_1", categoryId: "cat_6" },
  { id: "txn_9",  amount: -1200,  payee: "Landlord",           notes: "March rent",              date: "2025-03-09", accountId: "acc_1", categoryId: "cat_9" },
  { id: "txn_10", amount: -32.50, payee: "Uber",               notes: "Airport ride",            date: "2025-03-10", accountId: "acc_1", categoryId: "cat_2" },
  { id: "txn_11", amount: 4500,   payee: "Acme Corp",          notes: "Monthly salary",          date: "2025-02-01", accountId: "acc_1", categoryId: "cat_7" },
  { id: "txn_12", amount: -95,    payee: "Whole Foods",        notes: "Groceries",               date: "2025-02-03", accountId: "acc_1", categoryId: "cat_1" },
  { id: "txn_13", amount: -42,    payee: "Chevron",            notes: "Gas",                     date: "2025-02-05", accountId: "acc_3", categoryId: "cat_2" },
  { id: "txn_14", amount: -200,   payee: "Target",             notes: "Clothing",                date: "2025-02-08", accountId: "acc_3", categoryId: "cat_5" },
  { id: "txn_15", amount: 1200,   payee: "Client: Davis",      notes: "Logo design project",     date: "2025-02-10", accountId: "acc_2", categoryId: "cat_8" },
  { id: "txn_16", amount: -1200,  payee: "Landlord",           notes: "February rent",           date: "2025-02-09", accountId: "acc_1", categoryId: "cat_9" },
  { id: "txn_17", amount: -75,    payee: "Water Company",      notes: "Water bill",              date: "2025-02-12", accountId: "acc_1", categoryId: "cat_4" },
  { id: "txn_18", amount: -28,    payee: "Spotify + Disney+",  notes: "Streaming bundles",       date: "2025-02-14", accountId: "acc_3", categoryId: "cat_3" },
  { id: "txn_19", amount: 4500,   payee: "Acme Corp",          notes: "Monthly salary",          date: "2025-01-01", accountId: "acc_1", categoryId: "cat_7" },
  { id: "txn_20", amount: -110,   payee: "Trader Joe's",       notes: "Groceries",               date: "2025-01-04", accountId: "acc_1", categoryId: "cat_1" },
  { id: "txn_21", amount: -1200,  payee: "Landlord",           notes: "January rent",            date: "2025-01-09", accountId: "acc_1", categoryId: "cat_9" },
  { id: "txn_22", amount: -55,    payee: "Internet Provider",  notes: "Internet bill",           date: "2025-01-11", accountId: "acc_1", categoryId: "cat_4" },
  { id: "txn_23", amount: 650,    payee: "Client: Smith",      notes: "Content writing",         date: "2025-01-15", accountId: "acc_2", categoryId: "cat_8" },
  { id: "txn_24", amount: -180,   payee: "Best Buy",           notes: "Mouse + webcam",          date: "2025-01-18", accountId: "acc_3", categoryId: "cat_5" },
];

// ── Viewer Mock Data (read-only, different dataset) ────
const viewerAccounts: Account[] = [
  { id: "vacc_1", name: "Business Account" },
  { id: "vacc_2", name: "Petty Cash" },
];

const viewerCategories: Category[] = [
  { id: "vcat_1", name: "Office Supplies" },
  { id: "vcat_2", name: "Travel" },
  { id: "vcat_3", name: "Client Payments" },
  { id: "vcat_4", name: "Software" },
  { id: "vcat_5", name: "Marketing" },
];

const viewerTransactions: Transaction[] = [
  { id: "vtxn_1",  amount: 12000,  payee: "Client: TechStart Inc.",  notes: "Q1 consulting",       date: "2025-03-01", accountId: "vacc_1", categoryId: "vcat_3" },
  { id: "vtxn_2",  amount: -350,   payee: "Staples",                 notes: "Printer + paper",     date: "2025-03-03", accountId: "vacc_2", categoryId: "vcat_1" },
  { id: "vtxn_3",  amount: -89,    payee: "Figma",                   notes: "Monthly plan",        date: "2025-03-05", accountId: "vacc_1", categoryId: "vcat_4" },
  { id: "vtxn_4",  amount: -1200,  payee: "Delta Airlines",          notes: "NYC conference trip", date: "2025-03-07", accountId: "vacc_1", categoryId: "vcat_2" },
  { id: "vtxn_5",  amount: 8500,   payee: "Client: GreenLeaf Co.",   notes: "Website redesign",    date: "2025-03-10", accountId: "vacc_1", categoryId: "vcat_3" },
  { id: "vtxn_6",  amount: -500,   payee: "Google Ads",              notes: "March campaign",      date: "2025-03-12", accountId: "vacc_1", categoryId: "vcat_5" },
  { id: "vtxn_7",  amount: -45,    payee: "Notion",                  notes: "Team workspace",      date: "2025-03-14", accountId: "vacc_1", categoryId: "vcat_4" },
  { id: "vtxn_8",  amount: 15000,  payee: "Client: TechStart Inc.",  notes: "Q1 consulting pt2",   date: "2025-02-01", accountId: "vacc_1", categoryId: "vcat_3" },
  { id: "vtxn_9",  amount: -275,   payee: "Amazon Business",         notes: "Desk accessories",    date: "2025-02-05", accountId: "vacc_2", categoryId: "vcat_1" },
  { id: "vtxn_10", amount: -800,   payee: "Hilton Hotels",           notes: "SF meeting",          date: "2025-02-08", accountId: "vacc_1", categoryId: "vcat_2" },
  { id: "vtxn_11", amount: -300,   payee: "Facebook Ads",            notes: "Feb campaign",        date: "2025-02-10", accountId: "vacc_1", categoryId: "vcat_5" },
  { id: "vtxn_12", amount: 6000,   payee: "Client: BlueWave",        notes: "App prototype",       date: "2025-02-15", accountId: "vacc_1", categoryId: "vcat_3" },
  { id: "vtxn_13", amount: 9000,   payee: "Client: UrbanNest",       notes: "Branding project",    date: "2025-01-05", accountId: "vacc_1", categoryId: "vcat_3" },
  { id: "vtxn_14", amount: -150,   payee: "Office Depot",            notes: "Stationery",          date: "2025-01-08", accountId: "vacc_2", categoryId: "vcat_1" },
  { id: "vtxn_15", amount: -600,   payee: "United Airlines",         notes: "Chicago meeting",     date: "2025-01-12", accountId: "vacc_1", categoryId: "vcat_2" },
  { id: "vtxn_16", amount: -200,   payee: "LinkedIn Ads",            notes: "Jan campaign",        date: "2025-01-15", accountId: "vacc_1", categoryId: "vcat_5" },
];

// ── Helper: get current role data key ──────────────────
const getRoleKey = (role: Role): "adminData" | "viewerData" =>
  role === "admin" ? "adminData" : "viewerData";

// ── Store ──────────────────────────────────────────────
export const useDataStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      role: "admin",
      adminData: {
        accounts: adminAccounts,
        categories: adminCategories,
        transactions: adminTransactions,
      },
      viewerData: {
        accounts: viewerAccounts,
        categories: viewerCategories,
        transactions: viewerTransactions,
      },

      // Computed getters (re-evaluated on access)
      get accounts() { return get()[getRoleKey(get().role)].accounts; },
      get categories() { return get()[getRoleKey(get().role)].categories; },
      get transactions() { return get()[getRoleKey(get().role)].transactions; },

      setRole: (role) => set({ role }),

      // ── Account CRUD ──────────────────────────────
      addAccount: (data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              accounts: [...s[key].accounts, { id: uid(), name: data.name }],
            },
          };
        }),
      editAccount: (id, data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              accounts: s[key].accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
            },
          };
        }),
      deleteAccount: (id) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              accounts: s[key].accounts.filter((a) => a.id !== id),
            },
          };
        }),
      bulkDeleteAccounts: (ids) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              accounts: s[key].accounts.filter((a) => !ids.includes(a.id)),
            },
          };
        }),

      // ── Category CRUD ─────────────────────────────
      addCategory: (data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              categories: [...s[key].categories, { id: uid(), name: data.name }],
            },
          };
        }),
      editCategory: (id, data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              categories: s[key].categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
            },
          };
        }),
      deleteCategory: (id) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              categories: s[key].categories.filter((c) => c.id !== id),
            },
          };
        }),
      bulkDeleteCategories: (ids) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              categories: s[key].categories.filter((c) => !ids.includes(c.id)),
            },
          };
        }),

      // ── Transaction CRUD ──────────────────────────
      addTransaction: (data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              transactions: [...s[key].transactions, { ...data, id: uid(), amount: Number(data.amount) }],
            },
          };
        }),
      editTransaction: (id, data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              transactions: s[key].transactions.map((t) =>
                t.id === id ? { ...t, ...data, amount: data.amount ? Number(data.amount) : t.amount } : t
              ),
            },
          };
        }),
      deleteTransaction: (id) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              transactions: s[key].transactions.filter((t) => t.id !== id),
            },
          };
        }),
      bulkDeleteTransactions: (ids) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              transactions: s[key].transactions.filter((t) => !ids.includes(t.id)),
            },
          };
        }),
      bulkCreateTransactions: (data) =>
        set((s) => {
          const key = getRoleKey(s.role);
          return {
            [key]: {
              ...s[key],
              transactions: [
                ...s[key].transactions,
                ...data.map((d) => ({ ...d, id: uid(), amount: Number(d.amount) })),
              ],
            },
          };
        }),
    }),
    { name: "finance-dashboard-storage" }
  )
);
