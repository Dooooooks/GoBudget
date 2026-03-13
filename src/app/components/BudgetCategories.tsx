import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface BudgetCategoriesProps {
  expenses: Array<{ reason: string; amount: number }>;
  totalIncome: number;
}

export function BudgetCategories({ expenses, totalIncome }: BudgetCategoriesProps) {
  const calculatePercentage = (amount: number) => {
    if (totalIncome === 0) return 0;
    return Math.min(((amount / totalIncome) * 100), 100);
  };

  // Show 4 expense slots
  const expenseSlots = Array(4).fill(null).map((_, index) => {
    const expense = expenses[index];
    return {
      label: expense?.reason || `Expense ${index + 1}`,
      percentage: expense?.amount > 0 ? calculatePercentage(expense.amount) : 0
    };
  });

  return (
    <Card className="bg-white shadow-lg rounded-3xl flex-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl text-wrap">Budget Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        {expenseSlots.map((slot, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between px-1 sm:px-2 gap-2">
              <span className="text-gray-800 font-medium text-sm sm:text-base flex-1">{slot.label}</span>
              <span className="font-semibold text-gray-700 text-sm sm:text-base flex-shrink-0">{slot.percentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-6 sm:h-8 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1e7b8f] to-[#2a9fb5] transition-all duration-300 ease-out rounded-full flex items-center justify-end pr-2 sm:pr-3"
                style={{ width: `${slot.percentage}%` }}
              >
                {slot.percentage > 10 && (
                  <span className="text-white text-xs sm:text-sm font-semibold">
                    {slot.percentage.toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}