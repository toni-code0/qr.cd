import { useQrCodes } from "@/hooks/use-qr-codes";
import { QrCard } from "@/components/QrCard";
import { CreateQrDialog } from "@/components/CreateQrDialog";
import { Loader2, QrCode } from "lucide-react";

export default function Dashboard() {
  const { data: qrCodes, isLoading } = useQrCodes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My QR Codes</h1>
          <p className="text-muted-foreground mt-1">Manage and track your campaigns</p>
        </div>
        <CreateQrDialog />
      </div>

      {qrCodes && qrCodes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {qrCodes.map((qr) => (
            <QrCard key={qr.id} qr={qr} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-border rounded-2xl bg-secondary/10">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No QR Codes Yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            Create your first QR code to start tracking scans and managing your links.
          </p>
          <CreateQrDialog />
        </div>
      )}
    </div>
  );
}
