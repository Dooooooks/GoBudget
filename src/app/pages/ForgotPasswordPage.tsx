import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, User, ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageDialog } from "../components/MessageDialog";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
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

  const handleSendResetEmail = async () => {
    if (email.trim() === "") {
      setDialogState({
        open: true,
        title: "Missing Email",
        message: "Please enter your email address.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;

      setDialogState({
        open: true,
        title: "Email Sent",
        message:
          "If the address is valid, a password reset email has been sent. Check your inbox (and spam).",
        type: "success",
      });
    } catch (err) {
      setDialogState({
        open: true,
        title: "Email Failed",
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

      {/* Forgot Password Form */}
      <div className="container mx-auto px-6 py-20 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-12 w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => navigate("/login")}
            className="mb-4 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Login
          </Button>

          <h2 className="text-4xl font-bold text-center mb-4">FORGOT PASSWORD</h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your email to receive a password reset link
          </p>

          <div className="space-y-6">
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
                placeholder="you@gmail.com"
                required
              />
              <div className="pt-3">
                <Button
                  type="button"
                  onClick={handleSendResetEmail}
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full px-12 h-12 text-lg font-semibold"
                >
                  {loading ? "SENDING..." : "SEND RESET EMAIL"}
                </Button>
              </div>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#5b9bd5] hover:underline font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>

      <MessageDialog
        open={dialogState.open}
        onClose={handleCloseDialog}
        title={dialogState.title}
        message={dialogState.message}
        type={dialogState.type}
      />
    </div>
  );
}
