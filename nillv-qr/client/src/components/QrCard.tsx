import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { QrCode } from "@shared/schema";
import { Link } from "wouter";
import { BarChart2, ExternalLink, Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";
import { useDeleteQrCode } from "@/hooks/use-qr-codes";
import { EditQrDialog } from "@/components/EditQrDialog";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QrCardProps {
  qr: QrCode;
}

export function QrCard({ qr }: QrCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const deleteMutation = useDeleteQrCode();
  const trackingUrl = `${window.location.origin}/s/${qr.slug}`;

  return (
    <Card className="overflow-hidden card-hover border-border/40 group bg-card/50 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-8">
          <div className="p-5 bg-white rounded-2xl shadow-sm border border-border/50 group-hover:border-primary/20 transition-colors">
            <QRCodeSVG 
              value={trackingUrl} 
              size={140} 
              level="H"
              className="w-full h-auto"
            />
          </div>
          <div className="text-center w-full space-y-2">
            <h3 className="font-bold text-xl truncate w-full group-hover:text-primary transition-colors" title={qr.title}>
              {qr.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate w-full flex items-center justify-center gap-1.5 font-medium uppercase tracking-widest">
              <ExternalLink className="w-3 h-3" />
              {new URL(qr.destinationUrl).hostname}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border/20">
            <span className="block text-3xl font-bold text-primary tracking-tighter">{qr.scansCount}</span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Scans</span>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border/20">
            <span className="block text-xl font-bold text-foreground/80 mt-1">
              {qr.createdAt ? format(new Date(qr.createdAt), "MMM d") : "-"}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Created</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link href={`/qr/${qr.id}`} className="flex-1">
          <Button variant="default" className="w-full gap-2">
            <BarChart2 className="w-4 h-4" />
            Details
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowEdit(true)}
          className="text-muted-foreground hover:text-primary hover:bg-primary/10"
        >
          <Pencil className="w-4 h-4" />
        </Button>

        <EditQrDialog 
          qr={qr} 
          open={showEdit} 
          onOpenChange={setShowEdit} 
        />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the QR code "{qr.title}". This action cannot be undone and the link will stop working.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(qr.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
