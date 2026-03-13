import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function HowToUse() {
  return (
    /* Changed h-full to h-fit and added w-full max-w-5xl for a 'longer' look */
    <Card className="bg-white shadow-lg rounded-3xl w-full max-w-5xl h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">How to Use:</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Changed from a vertical list to a 3-column grid to reduce height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm leading-relaxed">
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 mr-2">
                1.
              </span>
              Enter your{" "}
              <span className="font-semibold">
                Primary Salary
              </span>{" "}
              and{" "}
              <span className="font-semibold">
                Other Income
              </span>
              .
            </p>
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 mr-2">
                2.
              </span>
              Add{" "}
              <span className="font-semibold">
                Monthly Expenses
              </span>{" "}
              by name and amount.
            </p>
          </div>

          <div className="space-y-2 border-l-0 md:border-l md:pl-6 border-gray-100">
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 mr-2">
                3.
              </span>
              View your{" "}
              <span className="font-semibold">
                Budget Breakdown
              </span>{" "}
              and percentage allocation.
            </p>
            <p className="text-gray-700">
              <span className="font-bold text-blue-600 mr-2">
                4.
              </span>
              Monitor{" "}
              <span className="font-semibold">
                Income, Expenses,
              </span>{" "}
              and <span className="font-semibold">Balance</span>
              .
            </p>
          </div>

          <div className="flex items-center border-l-0 md:border-l md:pl-6 border-gray-100">
            <p className="text-gray-700">
              <span className="font-bold text-red-500 mr-2">
                5.
              </span>
              Use the{" "}
              <span className="font-semibold text-red-600">
                RESET
              </span>{" "}
              button to clear all data and start fresh.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}