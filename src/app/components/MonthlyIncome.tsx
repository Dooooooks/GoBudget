import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

interface MonthlyIncomeProps {
  primarySalary: number;
  otherIncome: number;
  onUpdatePrimarySalary: (value: number) => void;
  onUpdateOtherIncome: (value: number) => void;
}

export function MonthlyIncome({ 
  primarySalary, 
  otherIncome, 
  onUpdatePrimarySalary, 
  onUpdateOtherIncome 
}: MonthlyIncomeProps) {
  return (
    <Card className="bg-white shadow-lg rounded-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">Monthly Income:</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="number"
          placeholder="Primary Salary"
          value={primarySalary || ""}
          onChange={(e) => onUpdatePrimarySalary(parseFloat(e.target.value) || 0)}
          className="bg-gray-100 border-0 h-14 text-gray-600 placeholder:text-gray-400 rounded-full px-6 text-center"
          min="0"
          step="1"
        />
        <Input
          type="number"
          placeholder="Other Income"
          value={otherIncome || ""}
          onChange={(e) => onUpdateOtherIncome(parseFloat(e.target.value) || 0)}
          className="bg-gray-100 border-0 h-14 text-gray-600 placeholder:text-gray-400 rounded-full px-6 text-center"
          min="0"
          step="1"
        />
      </CardContent>
    </Card>
  );
}