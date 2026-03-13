import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

interface MessageDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export function MessageDialog({
  open,
  onClose,
  title,
  message,
  type = "info",
}: MessageDialogProps) {
  const icons = {
    success: <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />,
    error: <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />,
    warning: <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />,
    info: <AlertCircle className="h-12 w-12 text-[#1e7b8f] mx-auto mb-4" />,
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            {icons[type]}
            <DialogTitle className="text-2xl font-bold mb-2">
              {title}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              {message}
            </DialogDescription>
          </div>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          <Button
            onClick={onClose}
            className="bg-[#1e7b8f] hover:bg-[#165e6e] text-white rounded-full px-8"
          >
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
