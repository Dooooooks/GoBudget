import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, User, ArrowLeft } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { MessageDialog } from "../components/MessageDialog";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
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

  const handleCloseDialog = () => {
    setDialogState((s) => ({ ...s, open: false }));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.trim() === "") {
      setDialogState({
        open: true,
        title: "Invalid Password",
        message: "Password cannot be empty.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setDialogState({
        open: true,
        title: "Password Mismatch",
        message: "The passwords you entered do not match.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setDialogState({
        open: true,
        title: "Password Updated",
        message: "Your password has been updated. You can now log in.",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setDialogState({
        open: true,
        title: "Update Failed",
        message: err instanceof Error ? err.message : "Unknown error",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200">
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

          <h2 className="text-4xl font-bold text-center mb-4">
            RESET PASSWORD
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Enter a new password for your account
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <Label htmlFor="newPassword" className="text-lg mb-2 block">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-gray-200 border-0 rounded-full h-14 px-6"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-lg mb-2 block">
                Confirm New Password
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
                className="bg-[#1e7b8f] hover:bg-[#165e6e] disabled:opacity-60 text-white rounded-full px-12 h-12 text-lg font-semibold"
              >
                {loading ? "UPDATING..." : "UPDATE PASSWORD"}
              </Button>
            </div>
          </form>
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
