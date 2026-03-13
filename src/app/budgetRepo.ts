import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export type BudgetExpense = { id: string; reason: string; amount: number };

export type BudgetState = {
  primarySalary: number;
  otherIncome: number;
  expenses: BudgetExpense[];
};

const DEFAULT_BUDGET: BudgetState = {
  primarySalary: 0,
  otherIncome: 0,
  expenses: [
    { id: "1", reason: "", amount: 0 },
    { id: "2", reason: "", amount: 0 },
    { id: "3", reason: "", amount: 0 },
    { id: "4", reason: "", amount: 0 },
  ],
};

function toNumber(v: unknown, fallback = 0) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function normalizeExpenses(v: unknown): BudgetExpense[] {
  if (!Array.isArray(v)) return DEFAULT_BUDGET.expenses;
  const out = v
    .slice(0, 4)
    .map((e, idx) => {
      const obj = (e ?? {}) as Record<string, unknown>;
      return {
        id: typeof obj.id === "string" ? obj.id : String(idx + 1),
        reason: typeof obj.reason === "string" ? obj.reason : "",
        amount: toNumber(obj.amount, 0),
      };
    });

  while (out.length < 4) {
    out.push({ id: String(out.length + 1), reason: "", amount: 0 });
  }

  return out;
}

export async function loadBudgetForUser(user: User): Promise<BudgetState> {
  const { data, error } = await supabase
    .from("budgets")
    .select("primary_salary, other_income, expenses")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    const { error: upsertError } = await supabase.from("budgets").upsert(
      {
        user_id: user.id,
        primary_salary: DEFAULT_BUDGET.primarySalary,
        other_income: DEFAULT_BUDGET.otherIncome,
        expenses: DEFAULT_BUDGET.expenses,
      },
      { onConflict: "user_id" },
    );
    if (upsertError) throw upsertError;
    return DEFAULT_BUDGET;
  }

  return {
    primarySalary: toNumber(data.primary_salary, 0),
    otherIncome: toNumber(data.other_income, 0),
    expenses: normalizeExpenses(data.expenses),
  };
}

export async function saveBudgetForUser(user: User, state: BudgetState) {
  const { error } = await supabase.from("budgets").upsert(
    {
      user_id: user.id,
      primary_salary: state.primarySalary,
      other_income: state.otherIncome,
      expenses: state.expenses,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}
