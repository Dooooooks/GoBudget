import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, User } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageDialog } from "../components/MessageDialog";

export function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState<{
    open: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    title: "",
    message: "",
    type: "info",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setDialogState({
        open: true,
        title: "Password Mismatch",
        message: "The passwords you entered don't match. Please try again.",
        type: "error",
      });
      return;
    }

    if (email.trim() === "" || password.trim() === "") {
      setDialogState({
        open: true,
        title: "Invalid Input",
        message: "Email and password are required!",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      const hasSession = Boolean(data.session);
      setDialogState({
        open: true,
        title: "Sign Up Successful",
        message: hasSession
          ? "Your account has been created. Redirecting to your dashboard..."
          : "Check your email to confirm your account, then log in.",
        type: "success",
      });

      setTimeout(() => {
        navigate(hasSession ? "/dashboard" : "/login");
      }, 1500);
    } catch (err) {
      setDialogState({
        open: true,
        title: "Sign Up Failed",
        message: err instanceof Error ? err.message : "Unknown error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogState({ ...dialogState, open: false });
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-[#1e7b8f] text-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-10 w-10" strokeWidth={2.5} />
            <h1 className="text-4xl font-bold">
              Go<span className="text-cyan-200">Budget</span>
            </h1>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 text-lg font-semibold"
            onClick={() => navigate("/login")}
          >
            <User className="h-5 w-5 mr-2" />
            LOGIN
          </Button>
        </div>
      </header>

      {/* Sign Up Form */}
      <div className="container mx-auto px-6 py-20 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-12 w-full max-w-md">
          <h2 className="text-4xl font-bold text-center mb-8">SIGN UP</h2>
          
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-lg mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-200 border-0 rounded-full h-14 px-6"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-lg mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-200 border-0 rounded-full h-14 px-6"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-lg mb-2 block">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-200 border-0 rounded-full h-14 px-6"
                required
              />
            </div>

            <div className="flex flex-col items-center space-y-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#1e7b8f] hover:bg-[#165e6e] text-white rounded-full px-12 h-12 text-lg font-semibold"
              >
                {loading ? "SIGNING UP..." : "SIGN UP"}
              </Button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#5b9bd5] hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Message Dialog */}
      <MessageDialog
        open={dialogState.open}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
        onClose={handleCloseDialog}
      />
    </div>
  );
}
