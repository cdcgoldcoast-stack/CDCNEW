import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPageAccess } from "@/hooks/useAdminPageAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  Eye,
  ExternalLink,
  FileText,
  Database,
  Search,
  ArrowLeft,
} from "lucide-react";
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
import SEO from "@/components/SEO";
import { generateSlug } from "@/lib/slug";
import { revalidateAdminPaths } from "@/lib/adminRevalidate";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type PostSource = "mdx" | "db";

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  author: string;
  image: string | null;
  tags: string[];
  published_at: string;
  updated_at: string;
  draft: boolean;
  created_at: string;
}

interface MdxListItem {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author?: string;
  tags: string[];
  draft: boolean;
}

interface CombinedPost {
  source: PostSource;
  id: string; // DB id or "mdx:{slug}"
  slug: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  tags: string[];
  draft: boolean;
  row?: BlogRow; // present only for DB posts
}

const EMPTY_FORM = {
  slug: "",
  title: "",
  description: "",
  body: "",
  author: "Mark Mayne",
  image: "",
  tagsInput: "",
  publishedAt: "",
  draft: false,
};

type FormState = typeof EMPTY_FORM;

const isoToDateInput = (iso: string): string => {
  // Convert ISO timestamp to a <input type="datetime-local"> friendly value
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const dateInputToIso = (value: string): string => {
  if (!value) return new Date().toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

const AdminBlog = () => {
  const { user, isAuthorized, isCheckingAccess } = useAdminPageAccess();

  const [dbPosts, setDbPosts] = useState<BlogRow[]>([]);
  const [mdxPosts, setMdxPosts] = useState<MdxListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<BlogRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isAuthorized && user) {
      fetchAll();
    }
  }, [isAuthorized, user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // DB posts (admins see all via RLS)
      const { data: dbData, error: dbErr } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (dbErr) throw dbErr;
      setDbPosts((dbData as BlogRow[]) ?? []);

      // MDX posts — fetched via a small client helper route to avoid bundling
      // fs APIs. Fall back to empty if the endpoint isn't reachable.
      try {
        const res = await fetch("/admin/api/blog-mdx", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as { posts: MdxListItem[] };
          setMdxPosts(json.posts ?? []);
        } else {
          setMdxPosts([]);
        }
      } catch {
        setMdxPosts([]);
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const combined = useMemo<CombinedPost[]>(() => {
    const dbBySlug = new Set(dbPosts.map((p) => p.slug));
    const dbRows: CombinedPost[] = dbPosts.map((row) => ({
      source: "db",
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      author: row.author,
      publishedAt: row.published_at,
      tags: row.tags ?? [],
      draft: row.draft,
      row,
    }));
    const mdxRows: CombinedPost[] = mdxPosts
      .filter((p) => !dbBySlug.has(p.slug)) // DB wins
      .map((p) => ({
        source: "mdx",
        id: `mdx:${p.slug}`,
        slug: p.slug,
        title: p.title,
        description: p.description,
        author: p.author || "Mark Mayne",
        publishedAt: p.publishedAt,
        tags: p.tags ?? [],
        draft: p.draft,
      }));
    return [...dbRows, ...mdxRows].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [dbPosts, mdxPosts]);

  const filtered = useMemo(() => {
    if (!searchTerm) return combined;
    const needle = searchTerm.toLowerCase();
    return combined.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.slug.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle))
    );
  }, [combined, searchTerm]);

  const stats = useMemo(
    () => ({
      total: combined.length,
      published: combined.filter((p) => !p.draft).length,
      drafts: combined.filter((p) => p.draft).length,
      fromAdmin: dbPosts.length,
    }),
    [combined, dbPosts]
  );

  /* -------------------------------- Form --------------------------------- */

  const openNewPostForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      publishedAt: isoToDateInput(new Date().toISOString()),
    });
    setSlugTouched(false);
    setShowForm(true);
  };

  const openEditForm = (row: BlogRow) => {
    setEditingId(row.id);
    setForm({
      slug: row.slug,
      title: row.title,
      description: row.description,
      body: row.body,
      author: row.author,
      image: row.image ?? "",
      tagsInput: (row.tags ?? []).join(", "),
      publishedAt: isoToDateInput(row.published_at),
      draft: row.draft,
    });
    setSlugTouched(true);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (value: string) => {
    updateField("title", value);
    if (!slugTouched && !editingId) {
      updateField("slug", generateSlug(value));
    }
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return "Title is required";
    if (!form.slug.trim()) return "Slug is required";
    if (!/^[a-z0-9-]+$/.test(form.slug)) return "Slug can only contain lowercase letters, numbers, and hyphens";
    if (!form.description.trim()) return "Description is required";
    if (!form.body.trim()) return "Body is required";
    return null;
  };

  const savePost = async () => {
    const err = validateForm();
    if (err) {
      toast.error(err);
      return;
    }

    const tags = form.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        body: form.body,
        author: form.author.trim() || "Mark Mayne",
        image: form.image.trim() || null,
        tags,
        published_at: dateInputToIso(form.publishedAt),
        draft: form.draft,
      };

      if (editingId) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
        toast.success("Post created");
      }

      // Rebuild the public pages so the change appears immediately.
      await revalidateAdminPaths(["/blog", `/blog/${payload.slug}`]);

      closeForm();
      fetchAll();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save post";
      // Friendly message for the duplicate-slug case
      if (message.includes("duplicate key") || message.includes("blog_posts_slug")) {
        toast.error("A post with this slug already exists");
      } else {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!toDelete) return;
    try {
      const deletedSlug = toDelete.slug;
      const { error } = await supabase.from("blog_posts").delete().eq("id", toDelete.id);
      if (error) throw error;
      toast.success("Post deleted");
      setToDelete(null);
      await revalidateAdminPaths(["/blog", `/blog/${deletedSlug}`]);
      fetchAll();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete post";
      toast.error(message);
    }
  };

  /* -------------------------------- Render -------------------------------- */

  if (isCheckingAccess) {
    return (
      <AdminLayout>
        <div className="text-foreground/60">Checking access…</div>
      </AdminLayout>
    );
  }

  if (!isAuthorized) return null;

  /* -------- Create/Edit form view ----------------------------------------- */
  if (showForm) {
    return (
      <AdminLayout>
        <SEO title={editingId ? "Edit post | Admin" : "New post | Admin"} noIndex />

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Button variant="ghost" size="sm" onClick={closeForm} className="gap-1 mb-2 -ml-2">
              <ArrowLeft className="w-4 h-4" /> Back to posts
            </Button>
            <h1 className="font-serif italic text-3xl text-primary">
              {editingId ? "Edit post" : "New post"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={savePost} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : form.draft ? "Save draft" : "Publish"}
            </Button>
          </div>
        </div>

        <div className="max-w-3xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="How to plan your kitchen renovation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-foreground/50">(URL path, auto-filled from title)</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/60 shrink-0">/blog/</span>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }}
                placeholder="kitchen-renovation-planning"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="One-sentence summary shown in SERPs and the blog index."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Body (Markdown)</Label>
            <Textarea
              id="body"
              value={form.body}
              onChange={(e) => updateField("body", e.target.value)}
              placeholder={`## Start with a good heading\n\nWrite in plain markdown. Headings with ##, lists with -, **bold**, *italic*, > blockquotes, and [links](https://example.com) all work.`}
              rows={20}
              className="font-mono text-sm"
            />
            <p className="text-xs text-foreground/50">
              Supports: <code>## headings</code>, <code>**bold**</code>, <code>*italic*</code>,{" "}
              <code>- lists</code>, <code>&gt; blockquotes</code>, <code>[links](url)</code>, and simple tables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published at</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={form.publishedAt}
                onChange={(e) => updateField("publishedAt", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">
              Cover image URL <span className="text-foreground/50">(optional)</span>
            </Label>
            <Input
              id="image"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="https://…/image.webp"
            />
            <p className="text-xs text-foreground/50">
              Paste a URL. Copy one from Site Images if you&apos;ve already uploaded it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">
              Tags <span className="text-foreground/50">(comma-separated)</span>
            </Label>
            <Input
              id="tags"
              value={form.tagsInput}
              onChange={(e) => updateField("tagsInput", e.target.value)}
              placeholder="kitchen renovation, gold coast, planning"
            />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <input
              id="draft"
              type="checkbox"
              checked={form.draft}
              onChange={(e) => updateField("draft", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="draft" className="cursor-pointer">
              Save as draft (hidden from public until unchecked)
            </Label>
          </div>
        </div>
      </AdminLayout>
    );
  }

  /* -------- List view ----------------------------------------------------- */
  return (
    <AdminLayout>
      <SEO title="Blog | Admin" noIndex />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif italic text-4xl text-primary mb-2">Blog</h1>
          <p className="text-foreground/60">
            Write new posts or manage existing ones. Code posts in <code>/content/blog</code> stay
            editable from git.
          </p>
        </div>
        <Button onClick={openNewPostForm} className="gap-2">
          <Plus className="w-4 h-4" /> New post
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Total</p>
          <p className="text-2xl font-serif text-primary">{stats.total}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Published</p>
          <p className="text-2xl font-serif text-green-700">{stats.published}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">Drafts</p>
          <p className="text-2xl font-serif text-yellow-700">{stats.drafts}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <p className="text-sm text-foreground/60 mb-1">From admin</p>
          <p className="text-2xl font-serif text-foreground">{stats.fromAdmin}</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
        <Input
          placeholder="Search by title, slug, or tag…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="text-foreground/60 py-12 text-center">Loading posts…</div>
      ) : filtered.length === 0 ? (
        <div className="text-foreground/60 py-12 text-center border border-dashed border-border rounded-lg">
          {searchTerm ? "No posts match your search." : "No posts yet. Create your first one above."}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Author</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Published</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-foreground/60 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-foreground/60 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {post.source === "db" ? (
                        <Badge className="bg-primary/10 text-primary gap-1 border-0">
                          <Database className="w-3 h-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700 gap-1 border-0">
                          <FileText className="w-3 h-3" /> Code
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{post.title}</div>
                      <div className="text-xs text-foreground/50 mt-0.5">/blog/{post.slug}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/70">{post.author}</td>
                    <td className="px-4 py-3 text-sm text-foreground/60 whitespace-nowrap">
                      {format(new Date(post.publishedAt), "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      {post.draft ? (
                        <Badge className="bg-yellow-100 text-yellow-800 border-0">Draft</Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 border-0">Published</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!post.draft && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 hover:bg-muted rounded text-foreground/60 hover:text-foreground"
                            title="Open on site"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {post.source === "db" && post.row ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => openEditForm(post.row!)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setToDelete(post.row!)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        ) : (
                          <span
                            className="text-xs text-foreground/40 px-2"
                            title="Code posts live in /content/blog and are edited via git"
                          >
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes &ldquo;{toDelete?.title ?? ""}&rdquo; from the site. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deletePost} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBlog;
