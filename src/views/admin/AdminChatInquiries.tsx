import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { Eye, Trash2, MessageCircle, Download, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import SEO from "@/components/SEO";

interface ConversationMessage {
  role: string;
  content: string;
}

interface ChatInquiry {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  additional_notes: string | null;
  conversation_summary: string | null;
  conversation_history: ConversationMessage[];
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const AdminChatInquiries = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();

  const [inquiries, setInquiries] = useState<ChatInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ChatInquiry | null>(null);
  const [inquiryToDelete, setInquiryToDelete] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthorized && user) {
      fetchInquiries();
    }
  }, [isAuthorized, user]);

  const fetchInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_inquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map((item) => ({
        ...item,
        conversation_history: (item.conversation_history as unknown as ConversationMessage[]) || [],
      }));
      setInquiries(formattedData);
    } catch (error) {
      console.error("Error fetching chat inquiries:", error);
      toast.error("Failed to load chat inquiries");
    } finally {
      setLoadingInquiries(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("chat_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setInquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );

      toast.success("Status updated");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const { error } = await supabase.from("chat_inquiries").delete().eq("id", id);
      if (error) throw error;

      setInquiries((prev) => prev.filter((e) => e.id !== id));
      setSelectedInquiry(null);
      setInquiryToDelete(null);
      toast.success("Chat inquiry deleted");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete chat inquiry");
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (statusFilter !== "all" && inquiry.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      inquiry.name?.toLowerCase().includes(q) ||
      inquiry.phone?.toLowerCase().includes(q) ||
      inquiry.email?.toLowerCase().includes(q) ||
      inquiry.conversation_summary?.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    const rows = filteredInquiries;
    if (rows.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const escape = (v: string | null | undefined) =>
      `"${(v ?? "").toString().replace(/"/g, '""')}"`;
    const csv = [
      ["Name", "Phone", "Email", "Status", "Summary", "Date"],
      ...rows.map((r) => [
        escape(r.name),
        escape(r.phone),
        escape(r.email),
        escape(r.status),
        escape(r.conversation_summary || r.additional_notes),
        escape(format(new Date(r.created_at), "yyyy-MM-dd HH:mm")),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-inquiries-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground/60">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin - Chat Inquiries" noIndex={true} />
      <AdminLayout>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h1 className="font-serif italic text-3xl text-primary">
                Chat Inquiries
              </h1>
            </div>
            <p className="text-foreground/60">
              Leads captured from the AI chat widget.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={filteredInquiries.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Total</p>
            <p className="text-2xl font-serif text-primary">{inquiries.length}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">New</p>
            <p className="text-2xl font-serif text-blue-600">
              {inquiries.filter((e) => e.status === "new").length}
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Contacted</p>
            <p className="text-2xl font-serif text-yellow-600">
              {inquiries.filter((e) => e.status === "contacted").length}
            </p>
          </div>
          <div className="bg-card border border-border p-4 rounded-lg">
            <p className="text-sm text-foreground/60 mb-1">Converted</p>
            <p className="text-2xl font-serif text-green-600">
              {inquiries.filter((e) => e.status === "converted").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        {!loadingInquiries && inquiries.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <Input
                placeholder="Search by name, phone, email, or summary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Inquiries Table */}
        {loadingInquiries ? (
          <p className="text-foreground/60">Loading chat inquiries...</p>
        ) : inquiries.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <MessageCircle className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <p className="text-foreground/60">No chat inquiries yet.</p>
            <p className="text-sm text-foreground/40 mt-1">
              Leads will appear here when visitors submit their details via the chat widget.
            </p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <p className="text-foreground/60">No matches for current filters.</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Phone
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Summary
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-foreground/60">
                      Date
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-foreground/60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {inquiry.name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {inquiry.phone ? (
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="text-sm text-foreground hover:text-primary"
                          >
                            {inquiry.phone}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground/60">-</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {inquiry.email ? (
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-sm text-foreground hover:text-primary"
                          >
                            {inquiry.email}
                          </a>
                        ) : (
                          <p className="text-sm text-foreground/60">-</p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground/70 line-clamp-2 max-w-xs">
                          {inquiry.conversation_summary || inquiry.additional_notes || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          value={inquiry.status}
                          onValueChange={(value) =>
                            updateStatus(inquiry.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4 text-sm text-foreground/60">
                        {format(new Date(inquiry.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setInquiryToDelete(inquiry.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={!!selectedInquiry}
          onOpenChange={() => setSelectedInquiry(null)}
        >
          <DialogContent className="w-[95vw] max-w-2xl h-[90vh] p-0 overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-2">
              <DialogTitle className="font-serif italic text-xl text-primary">
                Chat Inquiry Details
              </DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6">
                <div className="space-y-6 mt-2">
                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60">Name</p>
                    <p className="font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Phone</p>
                    {selectedInquiry.phone ? (
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="font-medium hover:text-primary"
                      >
                        {selectedInquiry.phone}
                      </a>
                    ) : (
                      <p className="font-medium">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    {selectedInquiry.email ? (
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="font-medium hover:text-primary break-all"
                      >
                        {selectedInquiry.email}
                      </a>
                    ) : (
                      <p className="font-medium">Not provided</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Submitted</p>
                    <p className="font-medium">
                      {format(
                        new Date(selectedInquiry.created_at),
                        "MMMM d, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Status</p>
                    <Badge className={statusColors[selectedInquiry.status] || ""}>
                      {selectedInquiry.status}
                    </Badge>
                  </div>
                </div>

                {/* Summary */}
                {selectedInquiry.conversation_summary && (
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">AI Summary</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">
                      {selectedInquiry.conversation_summary}
                    </p>
                  </div>
                )}

                {/* Additional Notes */}
                {selectedInquiry.additional_notes && (
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Additional Notes</p>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">
                      {selectedInquiry.additional_notes}
                    </p>
                  </div>
                )}

                {/* Conversation History */}
                <div>
                  <p className="text-sm text-foreground/60 mb-2">Conversation</p>
                  <ScrollArea className="h-[300px] border border-border rounded-lg">
                    <div className="space-y-3 p-4">
                      {selectedInquiry.conversation_history.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm break-words whitespace-pre-wrap ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!inquiryToDelete}
          onOpenChange={(open) => !open && setInquiryToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Chat Inquiry</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this chat inquiry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => inquiryToDelete && deleteInquiry(inquiryToDelete)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </AdminLayout>
    </>
  );
};

export default AdminChatInquiries;
