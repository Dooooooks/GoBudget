import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  User,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { MonthlyIncome } from "../components/MonthlyIncome";
import {
  MonthlyExpenses,
  Expense,
} from "../components/MonthlyExpenses";
import { BudgetCategories } from "../components/BudgetCategories";
import { SummaryCards } from "../components/SummaryCards";
import { HowToUse } from "../components/HowToUse";
import { supabase } from "../supabaseClient";
import {
  loadBudgetForUser,
  saveBudgetForUser,
  type BudgetState,
} from "../budgetRepo";

export function DashboardPage() {
  const navigate = useNavigate();
  const [primarySalary, setPrimarySalary] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", reason: "", amount: 0 },
    { id: "2", reason: "", amount: 0 },
    { id: "3", reason: "", amount: 0 },
    { id: "4", reason: "", amount: 0 },
  ]);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const saveTimer = useRef<number | null>(null);
  const [
    showNegativeBalancePopup,
    setShowNegativeBalancePopup,
  ] = useState(false);

  const handleUpdateExpense = (
    id: string,
    field: "reason" | "amount",
    value: string | number,
  ) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id
          ? { ...expense, [field]: value }
          : expense,
      ),
    );
  };

  const handleResetExpenses = () => {
    setExpenses([
      { id: "1", reason: "", amount: 0 },
      { id: "2", reason: "", amount: 0 },
      { id: "3", reason: "", amount: 0 },
      { id: "4", reason: "", amount: 0 },
    ]);
  };

  const handleLogout = () => {
    supabase.auth.signOut().finally(() => {
      navigate("/login");
    });
  };

  // Calculate totals
  const totalIncome = primarySalary + otherIncome;
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0,
  );
  const remainingBalance = totalIncome - totalExpenses;

  useEffect(() => {
    if (remainingBalance < 0) {
      setShowNegativeBalancePopup(true);
    } else {
      setShowNegativeBalancePopup(false);
    }
  }, [remainingBalance]);

  useEffect(() => {
    let mounted = true;
    setBudgetLoading(true);

    supabase.auth
      .getUser()
      .then(async ({ data, error }) => {
        if (!mounted) return;
        if (error || !data.user) {
          setBudgetLoading(false);
          return;
        }

        const budget = await loadBudgetForUser(data.user);
        if (!mounted) return;
        setPrimarySalary(budget.primarySalary);
        setOtherIncome(budget.otherIncome);
        setExpenses(budget.expenses as Expense[]);
        setBudgetLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setBudgetLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (budgetLoading) return;

    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
    }

    saveTimer.current = window.setTimeout(() => {
      supabase.auth
        .getUser()
        .then(({ data }) => {
          if (!data.user) return;
          const state: BudgetState = {
            primarySalary,
            otherIncome,
            expenses,
          };
          return saveBudgetForUser(data.user, state);
        })
        .catch(() => {
          // ignore
        });
    }, 500);

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [primarySalary, otherIncome, expenses, budgetLoading]);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-[#1e7b8f] text-white">
        <div className="container mx-auto px-6 py-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp
              className="h-10 w-10"
              strokeWidth={2.5}
            />
            <h1 className="text-4xl font-bold">
              Go<span className="text-cyan-200">Budget</span>
            </h1>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 text-lg font-semibold"
            onClick={handleLogout}
          >
            <User className="h-5 w-5 mr-2" />
            LOGOUT
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex flex-row gap-6">
        {budgetLoading && (
          <div className="text-gray-600">Loading your budget...</div>
        )}
        <div className="flex gap-6">
          <div className="space-y-6">
            <MonthlyIncome
              primarySalary={primarySalary}
              otherIncome={otherIncome}
              onUpdatePrimarySalary={setPrimarySalary}
              onUpdateOtherIncome={setOtherIncome}
            />
            <MonthlyExpenses
              expenses={expenses}
              onUpdateExpense={handleUpdateExpense}
              onReset={handleResetExpenses}
            />
          </div>
        </div>
        {/* Middle Column */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <div className="flex-auto">
              <BudgetCategories
                expenses={expenses}
                totalIncome={totalIncome}
              />
            </div>
            <div>
              <SummaryCards
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                remainingBalance={remainingBalance}
              />
            </div>
          </div>
          <div className="flex">
            <HowToUse />
          </div>
        </div>
      </div>

      {/* Negative Balance Popup */}
      {showNegativeBalancePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-80 z-50">
          <div className="bg-white rounded-lg shadow-xl w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowNegativeBalancePopup(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Over Budget!
                </h3>
              </div>
              <p className="text-gray-600">
                You are over your remaining balance. Please
                review your budget.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
