import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { RotateCcw } from "lucide-react";

export interface Expense {
  id: string;
  reason: string;
  amount: number;
}

interface MonthlyExpensesProps {
  expenses: Expense[];
  onUpdateExpense: (id: string, field: 'reason' | 'amount', value: string | number) => void;
  onReset: () => void;
}

export function MonthlyExpenses({ expenses, onUpdateExpense, onReset }: MonthlyExpensesProps) {
  return (
    <Card className="bg-white shadow-lg rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">Monthly Expenses:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="flex items-center gap-0">
            <Input
              type="text"
              placeholder="Type Expense"
              value={expense.reason}
              onChange={(e) => onUpdateExpense(expense.id, 'reason', e.target.value)}
              className="bg-[#1e7b8f] text-white placeholder:text-white/80 border-0 h-14 rounded-r-none relative z-10 px-6"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)'
              }}
            />
            <Input
              type="number"
              placeholder="Type Amount"
              value={expense.amount || ""}
              onChange={(e) => onUpdateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)}
              className="bg-gray-100 border-0 h-14 text-gray-600 placeholder:text-gray-400 rounded-l-none -ml-5 pl-8"
              min="0"
              step="1"
            />
          </div>
        ))}
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full h-12 rounded-full border-2 border-red-400 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          RESET
        </Button>
      </CardContent>
    </Card>
  );
}