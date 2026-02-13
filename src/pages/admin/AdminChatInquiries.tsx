import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
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
import { Eye, Trash2, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [inquiries, setInquiries] = useState<ChatInquiry[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<ChatInquiry | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      toast.error("You don't have admin permissions.");
      navigate("/");
    }
  }, [isAdmin, loading, user, navigate]);

  useEffect(() => {
    if (isAdmin && user) {
      fetchInquiries();
    }
  }, [isAdmin, user]);

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
    if (!confirm("Are you sure you want to delete this chat inquiry?")) return;

    try {
      const { error } = await supabase.from("chat_inquiries").delete().eq("id", id);
      if (error) throw error;

      setInquiries((prev) => prev.filter((e) => e.id !== id));
      setSelectedInquiry(null);
      toast.success("Chat inquiry deleted");
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      toast.error("Failed to delete chat inquiry");
    }
  };

  if (loading || !isAdmin) {
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
        <div className="p-8">
        {/* Header */}
        <div className="mb-8">
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
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-muted/30">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">
                          {inquiry.name}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{inquiry.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-foreground">{inquiry.email || "-"}</p>
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
                            onClick={() => deleteInquiry(inquiry.id)}
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
                    <p className="font-medium">{selectedInquiry.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <p className="font-medium">{selectedInquiry.email || "Not provided"}</p>
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
      </div>
    </AdminLayout>
    </>
  );
};

export default AdminChatInquiries;
