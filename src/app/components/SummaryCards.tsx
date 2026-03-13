import { DollarSign, Wallet, CreditCard } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
}

export function SummaryCards({ totalIncome, totalExpenses, remainingBalance }: SummaryCardsProps) {
  return (
    <div className="space-y-3 sm:space-y-12 w-75">
      <Card className="bg-white shadow-lg rounded-3xl">
        <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm text-gray-600">Total Income</div>
            <div className="text-lg sm:text-2xl font-bold">₱{totalIncome.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg rounded-3xl">
        <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
            <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm text-gray-600">Total Expenses</div>
            <div className="text-lg sm:text-2xl font-bold">₱{totalExpenses.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg rounded-3xl">
        <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1e7b8f] flex items-center justify-center flex-shrink-0">
            <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs sm:text-sm text-gray-600">Remaining Balance</div>
            <div className="text-lg sm:text-2xl font-bold">₱{remainingBalance.toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}