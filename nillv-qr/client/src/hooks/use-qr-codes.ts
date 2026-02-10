import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type CreateQrCodeRequest, type UpdateQrCodeRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all QR codes
export function useQrCodes() {
  return useQuery({
    queryKey: [api.qr.list.path],
    queryFn: async () => {
      const res = await fetch(api.qr.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch QR codes");
      return api.qr.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single QR code with scan stats
export function useQrCode(id: number) {
  return useQuery({
    queryKey: [api.qr.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.qr.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch QR code details");
      return api.qr.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Create new QR code
export function useCreateQrCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateQrCodeRequest) => {
      const res = await fetch(api.qr.create.path, {
        method: api.qr.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create QR code");
      }
      return api.qr.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qr.list.path] });
      toast({
        title: "Success",
        description: "QR Code created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete QR code
export function useDeleteQrCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.qr.delete.path, { id });
      const res = await fetch(url, { 
        method: api.qr.delete.method,
        credentials: "include" 
      });
      
      if (!res.ok) throw new Error("Failed to delete QR code");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.qr.list.path] });
      toast({
        title: "Deleted",
        description: "QR Code has been removed",
      });
    },
  });
}

// Update QR code
export function useUpdateQrCode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateQrCodeRequest }) => {
      const url = buildUrl(api.qr.update.path, { id });
      const res = await fetch(url, {
        method: api.qr.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update QR code");
      }
      return api.qr.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.qr.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.qr.get.path, variables.id] });
      toast({
        title: "Success",
        description: "QR Code updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
