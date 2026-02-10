import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateQrCode } from "@/hooks/use-qr-codes";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { updateQrCodeSchema, type QrCode } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

interface EditQrDialogProps {
  qr: QrCode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditQrDialog({ qr, open, onOpenChange }: EditQrDialogProps) {
  const mutation = useUpdateQrCode();

  const form = useForm<z.infer<typeof updateQrCodeSchema>>({
    resolver: zodResolver(updateQrCodeSchema),
    defaultValues: {
      title: qr.title,
      destinationUrl: qr.destinationUrl,
    },
  });

  const onSubmit = (data: z.infer<typeof updateQrCodeSchema>) => {
    mutation.mutate({ id: qr.id, data }, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit QR Code</DialogTitle>
          <DialogDescription>
            Update the title or destination URL. The QR code image itself will remain the same.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Label>Campaign Title</Label>
                  <FormControl>
                    <Input placeholder="Summer Sale 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="destinationUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>Destination URL</Label>
                  <FormControl>
                    <Input placeholder="https://example.com/promo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
