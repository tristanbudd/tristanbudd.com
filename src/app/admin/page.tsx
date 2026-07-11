"use client";

/**
 * @file page.tsx
 * @description Accessible Admin Dashboard. Provides UI editors for Blog posts and Projects.
 */

import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  Edit,
  ExternalLink,
  FileText,
  Folder,
  Image as ImageIcon,
  LogOut,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import DbOfflineMessage from "../../components/DbOfflineMessage";
import { type BlogPost, BLOG_CATEGORIES } from "../../data/blog";
import { type CustomField, type Project } from "../../data/projects";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "maintenance" | "images">(
    "blogs"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Content States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDbOffline, setIsDbOffline] = useState(false);

  // Image Management States
  interface ImageMetadata {
    name: string;
    size: number;
    createdAt: string;
    url: string;
  }
  const [images, setImages] = useState<ImageMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageSearch, setImageSearch] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMarkdownIndex, setCopiedMarkdownIndex] = useState<number | null>(null);

  // Maintenance Settings States
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [bypassKey, setBypassKey] = useState("");
  const [isEnvForced, setIsEnvForced] = useState(false);
  const [maintenanceFormError, setMaintenanceFormError] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);
  const [copiedBypass, setCopiedBypass] = useState(false);

  // Modal & Form States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isProjModalOpen, setIsProjModalOpen] = useState(false);

  const [currentBlog, setCurrentBlog] = useState<Partial<
    BlogPost & { _originalSlug: string }
  > | null>(null);
  const [currentProj, setCurrentProj] = useState<Partial<
    Project & { _originalSlug: string }
  > | null>(null);

  const [blogFormErrors, setBlogFormErrors] = useState<Record<string, string>>({});
  const [projFormErrors, setProjFormErrors] = useState<Record<string, string>>({});

  // Import/Export States (Unified for Blogs and Projects)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<"blogs" | "projects">("blogs");
  const [importedItems, setImportedItems] = useState<(BlogPost | Project)[]>([]);
  const [selectedImportSlugs, setSelectedImportSlugs] = useState<Set<string>>(new Set());
  const [importConflictAction, setImportConflictAction] = useState<"overwrite" | "skip">("skip");
  const [isImporting, setIsImporting] = useState(false);
  const [importSearchQuery, setImportSearchQuery] = useState("");
  const [importResult, setImportResult] = useState<{
    created: number;
    updated: number;
    skipped: number;
  } | null>(null);
  const [importError, setImportError] = useState("");

  // Fetch data from MySQL database via API routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, projectsRes, maintRes, imagesRes] = await Promise.all([
          fetch("/api/admin/blogs"),
          fetch("/api/admin/projects"),
          fetch("/api/maintenance"),
          fetch("/api/admin/images"),
        ]);
        if (blogsRes.ok && projectsRes.ok && maintRes.ok) {
          const blogsData = await blogsRes.json();
          const projectsData = await projectsRes.json();
          const maintData = await maintRes.json();
          setBlogs(blogsData);
          setProjects(projectsData);
          setMaintenanceMode(maintData.maintenanceMode);
          setBypassKey(maintData.bypassKey);
          setIsEnvForced(maintData.isEnvForced || false);
          setIsDbOffline(false);
        } else {
          setIsDbOffline(true);
        }

        if (imagesRes.ok) {
          const imagesData = await imagesRes.json();
          setImages(imagesData);
        }
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
        setIsDbOffline(true);
      }
    };
    fetchData();
  }, []);

  // Image Handlers
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadImageFile(e.target.files[0]);
    }
  };

  const handleImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImageFile(e.dataTransfer.files[0]);
    }
  };

  const uploadImageFile = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setImages((prev) => [data, ...prev]);
      } else {
        setUploadError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError("An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/images?name=${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.name !== filename));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete image.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred during deletion.");
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyMarkdownToClipboard = (url: string, name: string, index: number) => {
    const md = `![${name.split("_")[0] || "Image"}](${url})`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdownIndex(index);
    setTimeout(() => setCopiedMarkdownIndex(null), 2000);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/admin/auth", {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/login");
        router.refresh();
      }
    } catch {
      alert("Logout failed. Please try again.");
    }
  };

  // Blog Handlers
  const openBlogCreate = () => {
    setCurrentBlog({
      title: "",
      slug: "",
      category: BLOG_CATEGORIES[0],
      excerpt: "",
      content: "",
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [],
      readingTime: "5 min read",
      preview: false,
    });
    setBlogFormErrors({});
    setIsBlogModalOpen(true);
  };

  const openBlogEdit = (post: BlogPost) => {
    setCurrentBlog({ ...post, _originalSlug: post.slug });
    setBlogFormErrors({});
    setIsBlogModalOpen(true);
  };

  const deleteBlog = async (slug: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const res = await fetch(`/api/admin/blogs?slug=${slug}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setBlogs(blogs.filter((b) => b.slug !== slug));
        } else {
          const err = await res.json();
          alert(`Delete failed: ${err.error || "Unknown error occurred"}`);
        }
      } catch (error) {
        console.error("Delete blog error:", error);
        alert("Failed to delete blog post. Connection error.");
      }
    }
  };

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBlog) return;

    // Validation
    const errors: Record<string, string> = {};
    if (!currentBlog.title?.trim()) errors.title = "Title is required.";
    if (!currentBlog.slug?.trim()) {
      errors.slug = "Slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(currentBlog.slug)) {
      errors.slug = "Slug must contain only lowercase letters, numbers, and dashes.";
    } else {
      // Check duplicate slug (excluding the editing post itself)
      const duplicate = blogs.some(
        (b) => b.slug === currentBlog.slug && b.slug !== currentBlog._originalSlug
      );
      if (duplicate) errors.slug = "Slug already exists in another post.";
    }
    if (!currentBlog.excerpt?.trim()) errors.excerpt = "Excerpt is required.";
    if (!currentBlog.content?.trim()) errors.content = "Content is required.";
    if (!currentBlog.publishedAt) errors.publishedAt = "Publish date is required.";

    if (Object.keys(errors).length > 0) {
      setBlogFormErrors(errors);
      return;
    }

    const savedPostData = { ...currentBlog };
    delete savedPostData._originalSlug;
    const savedPost = savedPostData as BlogPost;

    // Auto-compute reading time based on word count
    const wordCount = savedPost.content.trim().split(/\s+/).length;
    const computedReadingTime = `${Math.max(1, Math.round(wordCount / 200))} min read`;
    savedPost.readingTime = computedReadingTime;

    const originalSlug = currentBlog._originalSlug;
    const isEditing = originalSlug !== undefined;

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/blogs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...savedPost,
          _originalSlug: originalSlug,
        }),
      });

      if (res.ok) {
        const updatedPost = await res.json();
        if (isEditing) {
          setBlogs(blogs.map((b) => (b.slug === originalSlug ? updatedPost : b)));
        } else {
          setBlogs([updatedPost, ...blogs]);
        }
        setIsBlogModalOpen(false);
        setCurrentBlog(null);
      } else {
        const err = await res.json();
        alert(`Save failed: ${err.error || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Save blog error:", error);
      alert("Failed to save blog post. Connection error.");
    }
  };

  // Client-Side Export Handlers
  const exportBlog = (blog: BlogPost) => {
    try {
      const jsonString = JSON.stringify(blog, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blog-${blog.slug}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export blog error:", err);
      alert("Failed to export blog post.");
    }
  };

  const exportAllBlogs = () => {
    if (blogs.length === 0) {
      alert("No blog posts to export.");
      return;
    }
    try {
      const jsonString = JSON.stringify(blogs, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all-blog-posts.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export all blogs error:", err);
      alert("Failed to export blog posts.");
    }
  };

  const exportProject = (project: Project) => {
    try {
      const jsonString = JSON.stringify(project, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-${project.slug}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export project error:", err);
      alert("Failed to export project.");
    }
  };

  const exportAllProjects = () => {
    if (projects.length === 0) {
      alert("No projects to export.");
      return;
    }
    try {
      const jsonString = JSON.stringify(projects, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "all-projects.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export all projects error:", err);
      alert("Failed to export projects.");
    }
  };

  // Unified Client-Side Import Handlers
  const handleImportClick = (type: "blogs" | "projects") => {
    setImportType(type);
    document.getElementById("unified-import-input")?.click();
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== "string") {
          throw new Error("Invalid file content.");
        }
        const data = JSON.parse(text);

        // Normalize single item to an array
        const itemsArray = Array.isArray(data) ? data : [data];

        // Schema validation
        const validItems: (BlogPost | Project)[] = [];

        if (importType === "blogs") {
          for (const item of itemsArray) {
            if (
              typeof item === "object" &&
              item !== null &&
              typeof item.title === "string" &&
              typeof item.slug === "string" &&
              typeof item.content === "string"
            ) {
              validItems.push({
                title: item.title,
                slug: item.slug,
                content: item.content,
                excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
                publishedAt:
                  typeof item.publishedAt === "string"
                    ? item.publishedAt
                    : new Date().toISOString().split("T")[0],
                category: typeof item.category === "string" ? item.category : BLOG_CATEGORIES[0],
                readingTime: typeof item.readingTime === "string" ? item.readingTime : "5 min read",
                tags: Array.isArray(item.tags) ? item.tags : [],
                preview: typeof item.preview === "boolean" ? item.preview : false,
              });
            }
          }
        } else {
          for (const item of itemsArray) {
            if (
              typeof item === "object" &&
              item !== null &&
              typeof item.title === "string" &&
              typeof item.slug === "string" &&
              typeof item.description === "string" &&
              typeof item.extendedDescription === "string"
            ) {
              validItems.push({
                title: item.title,
                slug: item.slug,
                description: item.description,
                extendedDescription: item.extendedDescription,
                tags: Array.isArray(item.tags) ? item.tags : [],
                githubUrl: typeof item.githubUrl === "string" ? item.githubUrl : null,
                projectUrl: typeof item.projectUrl === "string" ? item.projectUrl : null,
                customFields: Array.isArray(item.customFields) ? item.customFields : [],
                publishedAt:
                  typeof item.publishedAt === "string"
                    ? item.publishedAt
                    : new Date().toISOString().split("T")[0],
                featured: typeof item.featured === "boolean" ? item.featured : false,
                preview: typeof item.preview === "boolean" ? item.preview : false,
              });
            }
          }
        }

        if (validItems.length === 0) {
          alert(
            `No valid ${importType === "blogs" ? "blog posts" : "projects"} found in the uploaded file. Please verify the JSON schema.`
          );
          return;
        }

        // Initialize import state
        setImportedItems(validItems);
        setSelectedImportSlugs(new Set(validItems.map((p) => p.slug)));
        setImportConflictAction("skip");
        setImportSearchQuery("");
        setImportError("");
        setImportResult(null);
        setIsImportModalOpen(true);
      } catch (err) {
        console.error("Parse JSON error:", err);
        alert("Failed to parse JSON file. Ensure it is a valid JSON document.");
      } finally {
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleToggleSelectImport = (slug: string) => {
    setSelectedImportSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleToggleSelectAllImport = (filteredSlugs: string[]) => {
    setSelectedImportSlugs((prev) => {
      const next = new Set(prev);
      const allFilteredSelected = filteredSlugs.every((slug) => next.has(slug));

      if (allFilteredSelected) {
        filteredSlugs.forEach((slug) => next.delete(slug));
      } else {
        filteredSlugs.forEach((slug) => next.add(slug));
      }
      return next;
    });
  };

  const executeImport = async () => {
    if (selectedImportSlugs.size === 0) {
      setImportError(
        `No ${importType === "blogs" ? "blog posts" : "projects"} selected for import.`
      );
      return;
    }

    const itemsToImport = importedItems.filter((p) => selectedImportSlugs.has(p.slug));
    setIsImporting(true);
    setImportError("");
    setImportResult(null);

    const apiUrl =
      importType === "blogs" ? "/api/admin/blogs/import" : "/api/admin/projects/import";

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posts: itemsToImport,
          overwrite: importConflictAction === "overwrite",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setImportResult({
          created: data.created,
          updated: data.updated,
          skipped: data.skipped,
        });

        // Refresh the list
        if (importType === "blogs") {
          const blogsRes = await fetch("/api/admin/blogs");
          if (blogsRes.ok) {
            const blogsData = await blogsRes.json();
            setBlogs(blogsData);
          }
        } else {
          const projectsRes = await fetch("/api/admin/projects");
          if (projectsRes.ok) {
            const projectsData = await projectsRes.json();
            setProjects(projectsData);
          }
        }
      } else {
        const data = await res.json();
        setImportError(data.error || `Failed to import ${importType}.`);
      }
    } catch (err) {
      console.error("Import error:", err);
      setImportError("Network error occurred during import.");
    } finally {
      setIsImporting(false);
    }
  };

  // Database is unavailableProject Handlers
  const openProjCreate = () => {
    setCurrentProj({
      title: "",
      slug: "",
      description: "",
      extendedDescription: "",
      tags: [],
      projectUrl: "",
      githubUrl: "",
      customFields: [],
      publishedAt: new Date().toISOString().split("T")[0],
      featured: false,
      preview: false,
    });
    setProjFormErrors({});
    setIsProjModalOpen(true);
  };

  const openProjEdit = (proj: Project) => {
    // Store original slug in state to support slug edits
    setCurrentProj({ ...proj, _originalSlug: proj.slug });
    setProjFormErrors({});
    setIsProjModalOpen(true);
  };

  const deleteProj = async (slug: string) => {
    if (confirm("Are you sure you want to delete this project case study?")) {
      try {
        const res = await fetch(`/api/admin/projects?slug=${slug}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setProjects(projects.filter((p) => p.slug !== slug));
        } else {
          const err = await res.json();
          alert(`Delete failed: ${err.error || "Unknown error occurred"}`);
        }
      } catch (error) {
        console.error("Delete project error:", error);
        alert("Failed to delete project case study. Connection error.");
      }
    }
  };

  const saveProj = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProj) return;

    // Validation
    const errors: Record<string, string> = {};
    if (!currentProj.title?.trim()) errors.title = "Title is required.";
    if (!currentProj.slug?.trim()) {
      errors.slug = "Slug is required.";
    } else if (!/^[a-z0-9-]+$/.test(currentProj.slug)) {
      errors.slug = "Slug must contain only lowercase letters, numbers, and dashes.";
    } else {
      const duplicate = projects.some(
        (p) => p.slug === currentProj.slug && p.slug !== currentProj._originalSlug
      );
      if (duplicate) errors.slug = "Slug already exists in another project.";
    }
    if (!currentProj.description?.trim()) errors.description = "Short description is required.";
    if (!currentProj.extendedDescription?.trim()) {
      errors.extendedDescription = "Extended case study description is required.";
    }

    if (Object.keys(errors).length > 0) {
      setProjFormErrors(errors);
      return;
    }

    const savedProjData = { ...currentProj };
    delete savedProjData._originalSlug;
    const savedProj = savedProjData as Project;

    const originalSlug = currentProj._originalSlug;
    const isEditing = originalSlug !== undefined;

    try {
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...savedProj,
          _originalSlug: originalSlug,
        }),
      });

      if (res.ok) {
        const updatedProj = await res.json();
        if (isEditing) {
          setProjects(projects.map((p) => (p.slug === originalSlug ? updatedProj : p)));
        } else {
          setProjects([updatedProj, ...projects]);
        }
        setIsProjModalOpen(false);
        setCurrentProj(null);
      } else {
        const err = await res.json();
        alert(`Save failed: ${err.error || "Unknown error occurred"}`);
      }
    } catch (error) {
      console.error("Save project error:", error);
      alert("Failed to save project. Connection error.");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const trimmedKey = bypassKey.trim();
    if (trimmedKey.length < 3) {
      setMaintenanceFormError("Bypass key must be at least 3 characters long.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) {
      setMaintenanceFormError(
        "Bypass key can only contain alphanumeric characters, hyphens, and underscores."
      );
      return;
    }
    setMaintenanceFormError("");

    setIsSavingSettings(true);
    setSaveSettingsSuccess(false);
    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceMode,
          bypassKey,
        }),
      });
      if (res.ok) {
        setSaveSettingsSuccess(true);
        setTimeout(() => setSaveSettingsSuccess(false), 3000);
      } else {
        const err = await res.json();
        alert(`Failed to save settings: ${err.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Save settings error:", error);
      alert("Failed to save maintenance settings. Connection error.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Stats derivation
  const totalBlogs = blogs.length;
  const totalProjects = projects.length;

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(imageSearch.toLowerCase())
  );

  return (
    <div className="font-outfit flex min-h-screen bg-zinc-50 text-black">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between overflow-x-hidden border-r border-zinc-200 bg-white shadow-xl transition-all duration-300 ease-in-out lg:static lg:flex lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isSidebarCollapsed
            ? "3xl:w-24 4xl:w-28 5xl:w-32 w-64 lg:w-20"
            : "3xl:w-80 4xl:w-96 5xl:w-md w-64 lg:w-64"
        }`}
        aria-label="Sidebar navigation"
      >
        <div>
          {/* Sidebar Header */}
          <div className="3xl:p-8 4xl:p-10 5xl:p-12 flex items-center justify-between border-b border-zinc-100 p-6">
            <h2
              className={`3xl:text-lg 4xl:text-xl 5xl:text-2xl text-sm font-extrabold tracking-wider whitespace-nowrap text-black uppercase ${
                isSidebarCollapsed ? "lg:hidden" : "block"
              }`}
            >
              admin panel
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`3xl:h-11 3xl:w-11 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:flex ${
                isSidebarCollapsed ? "lg:mx-auto" : ""
              }`}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4 w-4" />
              ) : (
                <ChevronLeft className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className="3xl:space-y-2.5 3xl:p-6 3xl:px-4 4xl:space-y-3.5 4xl:p-8 4xl:px-4.5 5xl:space-y-4 5xl:p-10 5xl:px-5 space-y-1.5 p-4 lg:px-3 lg:py-4"
            aria-label="Dashboard views"
          >
            <button
              onClick={() => {
                setActiveTab("blogs");
                setIsSidebarOpen(false);
              }}
              className={`3xl:gap-4.5 3xl:text-base 4xl:gap-6 4xl:text-lg 5xl:gap-8 5xl:text-xl 3xl:pl-[20px] 3xl:pr-4 4xl:pl-[23px] 4xl:pr-4.5 5xl:pl-[26px] 5xl:pr-5 flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all lg:justify-start lg:pr-3 lg:pl-[19px] ${
                activeTab === "blogs"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "blogs" ? "page" : undefined}
            >
              <FileText className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 shrink-0" />
              <span className={`whitespace-nowrap ${isSidebarCollapsed ? "lg:hidden" : "inline"}`}>
                Blog Posts
              </span>
              <span
                className={`3xl:px-3 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg ml-auto rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${
                  isSidebarCollapsed ? "lg:hidden" : "inline-block"
                } ${
                  activeTab === "blogs" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {totalBlogs}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("projects");
                setIsSidebarOpen(false);
              }}
              className={`3xl:gap-4.5 3xl:text-base 4xl:gap-6 4xl:text-lg 5xl:gap-8 5xl:text-xl 3xl:pl-[20px] 3xl:pr-4 4xl:pl-[23px] 4xl:pr-4.5 5xl:pl-[26px] 5xl:pr-5 flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all lg:justify-start lg:pr-3 lg:pl-[19px] ${
                activeTab === "projects"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "projects" ? "page" : undefined}
            >
              <Folder className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 shrink-0" />
              <span className={`whitespace-nowrap ${isSidebarCollapsed ? "lg:hidden" : "inline"}`}>
                Projects
              </span>
              <span
                className={`3xl:px-3 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg ml-auto rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${
                  isSidebarCollapsed ? "lg:hidden" : "inline-block"
                } ${
                  activeTab === "projects" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {totalProjects}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("images");
                setIsSidebarOpen(false);
              }}
              className={`3xl:gap-4.5 3xl:text-base 4xl:gap-6 4xl:text-lg 5xl:gap-8 5xl:text-xl 3xl:pl-[20px] 3xl:pr-4 4xl:pl-[23px] 4xl:pr-4.5 5xl:pl-[26px] 5xl:pr-5 flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all lg:justify-start lg:pr-3 lg:pl-[19px] ${
                activeTab === "images"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "images" ? "page" : undefined}
            >
              <ImageIcon className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 shrink-0" />
              <span className={`whitespace-nowrap ${isSidebarCollapsed ? "lg:hidden" : "inline"}`}>
                Images
              </span>
              <span
                className={`3xl:px-3 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg ml-auto rounded-full px-2 py-0.5 text-xs whitespace-nowrap ${
                  isSidebarCollapsed ? "lg:hidden" : "inline-block"
                } ${
                  activeTab === "images" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {images.length}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("maintenance");
                setIsSidebarOpen(false);
              }}
              className={`3xl:gap-4.5 3xl:text-base 4xl:gap-6 4xl:text-lg 5xl:gap-8 5xl:text-xl 3xl:pl-[20px] 3xl:pr-4 4xl:pl-[23px] 4xl:pr-4.5 5xl:pl-[26px] 5xl:pr-5 flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all lg:justify-start lg:pr-3 lg:pl-[19px] ${
                activeTab === "maintenance"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "maintenance" ? "page" : undefined}
            >
              <Settings className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 shrink-0" />
              <span className={`whitespace-nowrap ${isSidebarCollapsed ? "lg:hidden" : "inline"}`}>
                Maintenance
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="3xl:p-6 3xl:px-4 4xl:p-8 4xl:px-4.5 5xl:p-10 5xl:px-5 border-t border-zinc-100 p-4 lg:px-3 lg:py-4">
          <button
            onClick={handleLogout}
            className="text-red-650 3xl:pl-[20px] 3xl:pr-4 4xl:pl-[23px] 4xl:pr-4.5 5xl:pl-[26px] 5xl:pr-5 3xl:gap-4.5 3xl:text-base 4xl:gap-6 4xl:text-lg 5xl:gap-8 5xl:text-xl flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-hidden lg:justify-start lg:pr-3 lg:pl-[19px]"
            aria-label="Log out of admin panel"
          >
            <LogOut className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5 shrink-0" />
            <span className={`whitespace-nowrap ${isSidebarCollapsed ? "lg:hidden" : "inline"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex min-w-0 flex-1 flex-col" role="main">
        {/* Top Header */}
        <header className="3xl:h-28 3xl:px-12 4xl:h-36 4xl:px-16 5xl:h-44 5xl:px-20 flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black active:scale-95 lg:hidden"
              aria-label="Open sidebar menu"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-5 w-5"
              >
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="14" y2="16" />
              </svg>
            </button>
            <h1 className="3xl:text-3xl 4xl:text-4xl 5xl:text-5xl text-lg font-extrabold tracking-tight text-black sm:text-2xl">
              {activeTab === "blogs"
                ? "Manage Blog Posts"
                : activeTab === "projects"
                  ? "Manage Case Studies"
                  : activeTab === "images"
                    ? "Manage Media Library"
                    : "Maintenance Configuration"}
            </h1>
          </div>

          {/* Create Action Button */}
          {activeTab === "blogs" ? (
            <div className="flex gap-2.5">
              <input
                type="file"
                id="unified-import-input"
                accept=".json"
                onChange={handleImportFileSelect}
                className="hidden"
              />
              <button
                onClick={() => handleImportClick("blogs")}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Import blog posts"
              >
                <Upload className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={exportAllBlogs}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Export all blog posts"
              >
                <Download className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">Export All</span>
              </button>
              <button
                onClick={openBlogCreate}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Create new blog post"
              >
                <Plus className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">New Post</span>
              </button>
            </div>
          ) : activeTab === "projects" ? (
            <div className="flex gap-2.5">
              <input
                type="file"
                id="unified-import-input"
                accept=".json"
                onChange={handleImportFileSelect}
                className="hidden"
              />
              <button
                onClick={() => handleImportClick("projects")}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Import project case studies"
              >
                <Upload className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button
                onClick={exportAllProjects}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 hover:text-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Export all project case studies"
              >
                <Download className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">Export All</span>
              </button>
              <button
                onClick={openProjCreate}
                disabled={isDbOffline}
                className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
                aria-label="Create new project study"
              >
                <Plus className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
                <span className="hidden sm:inline">New Project</span>
              </button>
            </div>
          ) : activeTab === "images" ? (
            <button
              onClick={() => document.getElementById("image-file-input")?.click()}
              disabled={isDbOffline}
              className="3xl:gap-3 3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:gap-4 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:gap-5 5xl:px-10 5xl:py-6 5xl:text-xl flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition-all hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex sm:h-auto sm:w-auto sm:items-center sm:gap-2 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm sm:font-bold"
              aria-label="Upload new image"
            >
              <Plus className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4.5 w-4.5" />
              <span className="hidden sm:inline">Upload Image</span>
            </button>
          ) : null}
        </header>

        {/* Content Body Container */}
        <div className="3xl:space-y-12 3xl:p-12 4xl:space-y-16 4xl:p-16 5xl:space-y-20 5xl:p-20 flex-1 space-y-8 overflow-y-auto p-4 sm:p-8">
          {isDbOffline ? (
            <DbOfflineMessage
              title="Database Connection Offline"
              description="We are unable to connect to the database. You will not be able to view, create, edit, or delete items. Please ensure database services are running."
            />
          ) : (
            <>
              {/* Quick Statistics Panels - Tab Specific */}
              {(activeTab === "blogs" || activeTab === "projects") && (
                <div className="3xl:gap-8 4xl:gap-10 5xl:gap-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  {activeTab === "blogs" ? (
                    <>
                      <div className="3xl:rounded-3xl 3xl:p-8 4xl:p-10 5xl:p-12 relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                        <div className="3xl:h-[3px] 4xl:h-[4px] absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                        <div className="flex items-center justify-between">
                          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                            Total Blogs
                          </span>
                          <FileText className="3xl:h-7 3xl:w-7 4xl:h-9 4xl:w-9 5xl:h-11 5xl:w-11 h-5 w-5 text-zinc-400" />
                        </div>
                        <h2 className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl mt-2 text-3xl font-extrabold tracking-tight">
                          {totalBlogs}
                        </h2>
                      </div>
                      <div className="3xl:rounded-3xl 3xl:p-8 4xl:p-10 5xl:p-12 relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                        <div className="3xl:h-[3px] 4xl:h-[4px] absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                        <div className="flex items-center justify-between">
                          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                            Latest Post Date
                          </span>
                          <Calendar className="3xl:h-7 3xl:w-7 4xl:h-9 4xl:w-9 5xl:h-11 5xl:w-11 h-5 w-5 text-zinc-400" />
                        </div>
                        <h2 className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl mt-2 text-3xl font-extrabold tracking-tight">
                          {blogs.length > 0
                            ? blogs.reduce(
                                (latest, current) =>
                                  new Date(current.publishedAt) > new Date(latest)
                                    ? current.publishedAt
                                    : latest,
                                blogs[0].publishedAt
                              )
                            : "No posts"}
                        </h2>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="3xl:rounded-3xl 3xl:p-8 4xl:p-10 5xl:p-12 relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                        <div className="3xl:h-[3px] 4xl:h-[4px] absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                        <div className="flex items-center justify-between">
                          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                            Total Projects
                          </span>
                          <Folder className="3xl:h-7 3xl:w-7 4xl:h-9 4xl:w-9 5xl:h-11 5xl:w-11 h-5 w-5 text-zinc-400" />
                        </div>
                        <h2 className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl mt-2 text-3xl font-extrabold tracking-tight">
                          {totalProjects}
                        </h2>
                      </div>
                      <div className="3xl:rounded-3xl 3xl:p-8 4xl:p-10 5xl:p-12 relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                        <div className="3xl:h-[3px] 4xl:h-[4px] absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                        <div className="flex items-center justify-between">
                          <span className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                            Latest Project Date
                          </span>
                          <Calendar className="3xl:h-7 3xl:w-7 4xl:h-9 4xl:w-9 5xl:h-11 5xl:w-11 h-5 w-5 text-zinc-400" />
                        </div>
                        <h2 className="3xl:text-4xl 4xl:text-5xl 5xl:text-6xl mt-2 text-3xl font-extrabold tracking-tight">
                          {projects.length > 0
                            ? projects.reduce((latest, current) => {
                                const date = current.publishedAt || "";
                                return date && new Date(date) > new Date(latest) ? date : latest;
                              }, projects[0].publishedAt || "")
                            : "No projects"}
                        </h2>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* List Area */}
              <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
                {activeTab === "maintenance" ? (
                  <form onSubmit={handleSaveSettings} className="space-y-6 p-8">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-black">Maintenance Settings</h3>
                      <p className="text-sm leading-relaxed text-zinc-500">
                        Toggle maintenance mode across the application. When enabled, non-admin
                        visitors will see the maintenance screen. Authenticated administrators can
                        bypass this screen and browse normally.
                      </p>
                    </div>

                    {isEnvForced && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        <strong>Notice:</strong> Maintenance Mode is currently forced{" "}
                        <strong>ON</strong> via environment variable configuration.
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4">
                        <div>
                          <label className="text-sm font-bold text-black">Maintenance Mode</label>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Toggle site accessibility on/off
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          disabled={isEnvForced}
                          className="h-5 w-5 rounded-md border-zinc-300 text-black accent-black focus:ring-black"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-black">Bypass Key</label>
                        <p className="text-xs text-zinc-500">
                          Appended as a query parameter (e.g. ?bypass=key) to view the live site in
                          maintenance mode.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={bypassKey}
                            onChange={(e) => setBypassKey(e.target.value)}
                            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium focus:border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                            placeholder="e.g. secret_bypass_key"
                          />
                          {bypassKey && typeof window !== "undefined" && (
                            <button
                              type="button"
                              onClick={() => {
                                const bypassUrl = `${window.location.origin}/?bypass=${bypassKey}`;
                                navigator.clipboard.writeText(bypassUrl);
                                setCopiedBypass(true);
                                setTimeout(() => setCopiedBypass(false), 2000);
                              }}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-all hover:bg-zinc-50 active:scale-95"
                              title="Copy Bypass URL"
                            >
                              {copiedBypass ? (
                                <Check className="h-4.5 w-4.5 text-green-600" />
                              ) : (
                                <Copy className="h-4.5 w-4.5" />
                              )}
                            </button>
                          )}
                        </div>
                        {maintenanceFormError && (
                          <p className="text-red-650 mt-1 text-xs font-semibold">
                            {maintenanceFormError}
                          </p>
                        )}
                      </div>
                    </div>

                    {saveSettingsSuccess && (
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                        Settings saved successfully.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingSettings ? "Saving Settings..." : "Save Settings"}
                    </button>
                  </form>
                ) : activeTab === "images" ? (
                  <div className="space-y-6 p-8">
                    {/* Header Details */}
                    <div className="space-y-2">
                      <h3 className="font-outfit text-lg font-bold text-black">Media Library</h3>
                      <p className="text-sm leading-relaxed text-zinc-500">
                        Upload and manage images for your blog posts and project case studies. Files
                        are hosted on the tristanbudd.com domain.
                      </p>
                    </div>

                    {/* Upload & Search Controls Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Upload Section */}
                      <div className="space-y-4">
                        <label className="block text-xs font-bold tracking-wider text-zinc-700 uppercase">
                          Upload New Image
                        </label>
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onDrop={handleImageDrop}
                          className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 text-center transition-all hover:border-black hover:bg-zinc-50"
                        >
                          <input
                            type="file"
                            id="image-file-input"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                          <Upload className="mb-3 h-8 w-8 text-zinc-400" />
                          <p className="text-sm font-semibold text-zinc-900">
                            Drag and drop image here, or{" "}
                            <label
                              htmlFor="image-file-input"
                              className="cursor-pointer font-bold text-black underline hover:text-zinc-700"
                            >
                              browse files
                            </label>
                          </p>
                          <p className="mt-1 text-xs text-zinc-400">
                            Supports PNG, JPEG, GIF, WebP, SVG up to 5MB
                          </p>
                          {isUploading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/85 backdrop-blur-xs">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
                              <span className="mt-2 text-xs font-bold text-black">
                                Uploading image...
                              </span>
                            </div>
                          )}
                        </div>
                        {uploadError && (
                          <p className="text-red-650 text-xs font-semibold">{uploadError}</p>
                        )}
                      </div>

                      {/* Search & Stats Section */}
                      <div className="flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          <label
                            htmlFor="image-search-input"
                            className="block text-xs font-bold tracking-wider text-zinc-700 uppercase"
                          >
                            Filter Images
                          </label>
                          <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                              type="text"
                              id="image-search-input"
                              placeholder="Search by filename..."
                              value={imageSearch}
                              onChange={(e) => setImageSearch(e.target.value)}
                              className="w-full rounded-xl border border-zinc-200 py-2.5 pr-4 pl-10 text-sm focus:border-black focus:ring-1 focus:ring-black"
                            />
                          </div>
                        </div>

                        <div className="border-zinc-150 rounded-xl border bg-zinc-50/50 p-4 text-xs font-semibold text-zinc-500">
                          <div className="flex justify-between py-1">
                            <span>Total Files:</span>
                            <span className="font-bold text-black">{images.length}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>Total Storage Used:</span>
                            <span className="font-bold text-black">
                              {(
                                images.reduce((acc, img) => acc + img.size, 0) /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Grid */}
                    <div className="border-t border-zinc-100 pt-6">
                      {filteredImages.length === 0 ? (
                        <div className="py-12 text-center text-sm font-semibold text-zinc-400">
                          {imageSearch
                            ? "No images match your search."
                            : "No images uploaded yet. Upload your first image above!"}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {filteredImages.map((img, idx) => (
                            <div
                              key={img.name}
                              className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white transition-all hover:shadow-md"
                            >
                              {/* Thumbnail Container */}
                              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden border-b border-zinc-100 bg-zinc-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img.url}
                                  alt={img.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {/* Quick hover overlay */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  <a
                                    href={img.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="scale-90 transform rounded-lg bg-white/95 p-2 text-black transition-all group-hover:scale-100 hover:bg-white"
                                    title="Open image in new window"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </div>
                              </div>

                              {/* Details and Actions */}
                              <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
                                <div>
                                  <h4
                                    className="truncate text-sm font-bold text-zinc-950"
                                    title={img.name}
                                  >
                                    {img.name}
                                  </h4>
                                  <p className="text-zinc-450 mt-1 text-[11px] font-semibold">
                                    {(img.size / 1024).toFixed(1)} KB •{" "}
                                    {new Date(img.createdAt).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => copyToClipboard(img.url, idx)}
                                      className="text-zinc-650 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs font-semibold transition-colors hover:border-black hover:bg-zinc-50 hover:text-black"
                                    >
                                      {copiedIndex === idx ? (
                                        <>
                                          <Check className="h-3.5 w-3.5 text-green-600" />
                                          <span className="font-bold text-green-600">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3.5 w-3.5" />
                                          <span>Link</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={() =>
                                        copyMarkdownToClipboard(img.url, img.name, idx)
                                      }
                                      className="text-zinc-650 flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 px-2 py-1.5 text-xs font-semibold transition-colors hover:border-black hover:bg-zinc-50 hover:text-black"
                                    >
                                      {copiedMarkdownIndex === idx ? (
                                        <>
                                          <Check className="h-3.5 w-3.5 text-green-600" />
                                          <span className="font-bold text-green-600">Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="h-3.5 w-3.5" />
                                          <span>Markdown</span>
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  <button
                                    onClick={() => deleteImage(img.name)}
                                    className="text-red-650 flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/20 px-2 py-1.5 text-xs font-semibold transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete Image</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : activeTab === "blogs" ? (
                  // Blogs List Table
                  blogs.length === 0 ? (
                    <div className="3xl:p-16 3xl:text-base 4xl:p-20 4xl:text-lg 5xl:p-24 5xl:text-xl p-12 text-center text-zinc-500">
                      No blog posts found. Click &quot;New Post&quot; to write one.
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-[650px] border-collapse text-left lg:min-w-0">
                        <thead>
                          <tr className="3xl:text-sm 4xl:text-base 5xl:text-lg border-b border-zinc-200 bg-zinc-50 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                            <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                              Title
                            </th>
                            <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                              Published At
                            </th>
                            <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="3xl:text-base 4xl:text-lg 5xl:text-xl divide-y divide-zinc-100 text-sm font-medium">
                          {blogs.map((blog) => (
                            <tr key={blog.slug} className="transition-colors hover:bg-zinc-50/50">
                              <td className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="3xl:max-w-lg 4xl:max-w-xl 5xl:max-w-2xl block max-w-md truncate font-semibold text-black">
                                    {blog.title}
                                  </span>
                                  {blog.preview && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <span className="3xl:text-sm 4xl:text-base 5xl:text-lg block text-xs font-normal text-zinc-400">
                                  {blog.slug}
                                </span>
                              </td>
                              <td className="text-zinc-650 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                                {blog.publishedAt}
                              </td>
                              <td className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4 text-right">
                                <div className="3xl:gap-3 4xl:gap-4 5xl:gap-5 flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => exportBlog(blog)}
                                    className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                                    aria-label={`Export ${blog.title}`}
                                    title="Export post as JSON"
                                  >
                                    <Download className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => openBlogEdit(blog)}
                                    className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                                    aria-label={`Edit ${blog.title}`}
                                  >
                                    <Edit className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => deleteBlog(blog.slug)}
                                    className="text-red-650 3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                    aria-label={`Delete ${blog.title}`}
                                  >
                                    <Trash2 className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : // Projects List Table
                projects.length === 0 ? (
                  <div className="3xl:p-16 3xl:text-base 4xl:p-20 4xl:text-lg 5xl:p-24 5xl:text-xl p-12 text-center text-zinc-500">
                    No projects found. Click &quot;New Project&quot; to build one.
                  </div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left lg:min-w-0">
                      <thead>
                        <tr className="3xl:text-sm 4xl:text-base 5xl:text-lg border-b border-zinc-200 bg-zinc-50 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                          <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                            Title
                          </th>
                          <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                            Published At
                          </th>
                          <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                            Urls
                          </th>
                          <th className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="3xl:text-base 4xl:text-lg 5xl:text-xl divide-y divide-zinc-100 text-sm font-medium">
                        {projects.map((proj) => (
                          <tr key={proj.slug} className="transition-colors hover:bg-zinc-50/50">
                            <td className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="3xl:max-w-lg 4xl:max-w-xl 5xl:max-w-2xl block max-w-md truncate font-semibold text-black">
                                  {proj.title}
                                </span>
                                {proj.featured && (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                    Featured
                                  </span>
                                )}
                                {proj.preview && (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    Preview
                                  </span>
                                )}
                              </div>
                              <span className="3xl:text-sm 4xl:text-base 5xl:text-lg block text-xs font-normal text-zinc-400">
                                {proj.slug}
                              </span>
                            </td>
                            <td className="text-zinc-650 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4">
                              {proj.publishedAt || "N/A"}
                            </td>
                            <td className="text-zinc-450 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4 font-normal">
                              <div className="3xl:gap-3 4xl:gap-4 5xl:gap-5 flex gap-2">
                                {proj.githubUrl && (
                                  <span className="3xl:px-3 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg rounded-sm border border-zinc-200 px-2 py-0.5 text-xs">
                                    GitHub
                                  </span>
                                )}
                                {proj.projectUrl && (
                                  <span className="3xl:px-3 3xl:py-1 3xl:text-sm 4xl:px-4 4xl:py-1.5 4xl:text-base 5xl:px-5 5xl:py-2 5xl:text-lg rounded-sm border border-zinc-200 px-2 py-0.5 text-xs">
                                    Live
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 px-6 py-4 text-right">
                              <div className="3xl:gap-3 4xl:gap-4 5xl:gap-5 flex items-center justify-end gap-2">
                                <button
                                  onClick={() => exportProject(proj)}
                                  className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                                  aria-label={`Export ${proj.title}`}
                                  title="Export project as JSON"
                                >
                                  <Download className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openProjEdit(proj)}
                                  className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                                  aria-label={`Edit ${proj.title}`}
                                >
                                  <Edit className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => deleteProj(proj.slug)}
                                  className="text-red-650 3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                                  aria-label={`Delete ${proj.title}`}
                                >
                                  <Trash2 className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Blog Edit/Create Modal */}
      {isBlogModalOpen && currentBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="blog-modal-title"
        >
          <div className="3xl:max-w-4xl 4xl:max-w-5xl 5xl:max-w-6xl 3xl:rounded-3xl flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <header className="border-zinc-150 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 flex items-center justify-between border-b px-6 py-4">
              <h2
                id="blog-modal-title"
                className="3xl:text-xl 4xl:text-2xl 5xl:text-3xl text-base font-bold"
              >
                {currentBlog.slug ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4 w-4" />
              </button>
            </header>

            <form
              onSubmit={saveBlog}
              className="3xl:space-y-6 3xl:p-8 4xl:space-y-8 4xl:p-10 5xl:space-y-10 5xl:p-12 flex-1 space-y-4 p-6"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="blog-title"
                  className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="blog-title"
                  value={currentBlog.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const computedSlug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-");

                    setCurrentBlog({
                      ...currentBlog,
                      title: val,
                      // Auto populate slug on create, keep it static if edit
                      slug:
                        currentBlog.slug && currentBlog._originalSlug
                          ? currentBlog.slug
                          : computedSlug,
                    });
                  }}
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.title ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.title ? "blog-title-err" : undefined}
                />
                {blogFormErrors.title && (
                  <p
                    id="blog-title-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {blogFormErrors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="blog-slug"
                  className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="blog-slug"
                  value={currentBlog.slug || ""}
                  onChange={(e) =>
                    setCurrentBlog({ ...currentBlog, slug: e.target.value.toLowerCase() })
                  }
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.slug ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.slug ? "blog-slug-err" : undefined}
                />
                {blogFormErrors.slug && (
                  <p
                    id="blog-slug-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {blogFormErrors.slug}
                  </p>
                )}
              </div>

              {/* Category & Date Grid */}
              <div className="3xl:gap-6 4xl:gap-8 5xl:gap-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="blog-category"
                    className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                  >
                    Category
                  </label>
                  <select
                    id="blog-category"
                    value={currentBlog.category || BLOG_CATEGORIES[0]}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                    className="3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="blog-date"
                    className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                  >
                    Publish Date
                  </label>
                  <input
                    type="date"
                    id="blog-date"
                    value={currentBlog.publishedAt || ""}
                    onChange={(e) =>
                      setCurrentBlog({ ...currentBlog, publishedAt: e.target.value })
                    }
                    className="3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Preview mode toggle */}
              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="blog-preview"
                  checked={currentBlog.preview || false}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, preview: e.target.checked })}
                  className="h-5 w-5 cursor-pointer rounded-md border-zinc-300 text-black accent-black focus:ring-black"
                />
                <label
                  htmlFor="blog-preview"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] cursor-pointer text-xs font-bold text-zinc-700 uppercase select-none"
                >
                  Preview (Draft / Admin-Only)
                </label>
              </div>

              {/* Excerpt */}
              <div>
                <label
                  htmlFor="blog-excerpt"
                  className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Excerpt / Brief Description
                </label>
                <textarea
                  id="blog-excerpt"
                  rows={2}
                  value={currentBlog.excerpt || ""}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.excerpt ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.excerpt ? "blog-excerpt-err" : undefined}
                />
                {blogFormErrors.excerpt && (
                  <p
                    id="blog-excerpt-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {blogFormErrors.excerpt}
                  </p>
                )}
              </div>

              {/* Markdown Content */}
              <div>
                <label
                  htmlFor="blog-content"
                  className="3xl:text-sm 4xl:text-base 5xl:text-lg mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Markdown Content
                </label>
                <textarea
                  id="blog-content"
                  rows={6}
                  value={currentBlog.content || ""}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.content ? "border-red-500" : "border-zinc-300"
                  }`}
                  placeholder="# Enter your markdown text here..."
                  aria-describedby={blogFormErrors.content ? "blog-content-err" : undefined}
                />
                {blogFormErrors.content && (
                  <p
                    id="blog-content-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {blogFormErrors.content}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="3xl:gap-4.5 3xl:pt-6 4xl:gap-6 4xl:pt-8 5xl:gap-8 5xl:pt-10 flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:px-10 5xl:py-6 5xl:text-xl rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-6 5xl:text-xl rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Save Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Edit/Create Modal */}
      {isProjModalOpen && currentProj && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="proj-modal-title"
        >
          <div className="3xl:max-w-4xl 4xl:max-w-5xl 5xl:max-w-6xl 3xl:rounded-3xl flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <header className="border-zinc-150 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 flex items-center justify-between border-b px-6 py-4">
              <h2
                id="proj-modal-title"
                className="3xl:text-xl 4xl:text-2xl 5xl:text-3xl text-base font-bold"
              >
                {currentProj._originalSlug ? "Edit Project" : "Create New Project"}
              </h2>
              <button
                onClick={() => setIsProjModalOpen(false)}
                className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4 w-4" />
              </button>
            </header>

            <form
              onSubmit={saveProj}
              className="3xl:space-y-6 3xl:p-8 4xl:space-y-8 4xl:p-10 5xl:space-y-10 5xl:p-12 3xl:text-sm 4xl:text-base 5xl:text-lg flex-1 space-y-4 p-6 text-xs"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="proj-title"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Project Title
                </label>
                <input
                  type="text"
                  id="proj-title"
                  value={currentProj.title || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const computedSlug = val
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-");

                    setCurrentProj({
                      ...currentProj,
                      title: val,
                      slug: currentProj._originalSlug ? currentProj.slug : computedSlug,
                    });
                  }}
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.title ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.title ? "proj-title-err" : undefined}
                />
                {projFormErrors.title && (
                  <p
                    id="proj-title-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {projFormErrors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="proj-slug"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="proj-slug"
                  value={currentProj.slug || ""}
                  onChange={(e) =>
                    setCurrentProj({ ...currentProj, slug: e.target.value.toLowerCase() })
                  }
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.slug ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.slug ? "proj-slug-err" : undefined}
                />
                {projFormErrors.slug && (
                  <p
                    id="proj-slug-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {projFormErrors.slug}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="proj-date"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Published Date
                </label>
                <input
                  type="date"
                  id="proj-date"
                  value={currentProj.publishedAt || ""}
                  onChange={(e) => setCurrentProj({ ...currentProj, publishedAt: e.target.value })}
                  className="3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Featured Project Checkbox */}
              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="proj-featured"
                  checked={currentProj.featured || false}
                  onChange={(e) => setCurrentProj({ ...currentProj, featured: e.target.checked })}
                  className="h-5 w-5 cursor-pointer rounded-md border-zinc-300 text-black accent-black focus:ring-black"
                />
                <label
                  htmlFor="proj-featured"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] cursor-pointer text-xs font-bold text-zinc-700 uppercase select-none"
                >
                  Featured Project
                </label>
              </div>

              {/* Preview mode toggle */}
              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox"
                  id="proj-preview"
                  checked={currentProj.preview || false}
                  onChange={(e) => setCurrentProj({ ...currentProj, preview: e.target.checked })}
                  className="h-5 w-5 cursor-pointer rounded-md border-zinc-300 text-black accent-black focus:ring-black"
                />
                <label
                  htmlFor="proj-preview"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] cursor-pointer text-xs font-bold text-zinc-700 uppercase select-none"
                >
                  Preview (Draft / Admin-Only)
                </label>
              </div>

              {/* Sidebar Custom Fields */}
              <div className="3xl:space-y-4.5 4xl:space-y-6 5xl:space-y-7.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] block text-[10px] font-bold text-zinc-700 uppercase">
                    Sidebar Metadata Fields
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const fields = [...((currentProj.customFields as CustomField[]) || [])];
                      fields.push({ label: "", value: "", icon: "" });
                      setCurrentProj({ ...currentProj, customFields: fields });
                    }}
                    className="hover:text-zinc-650 3xl:text-sm 4xl:text-base 5xl:text-lg flex items-center gap-1 text-xs font-bold text-black transition-colors"
                  >
                    <Plus className="3xl:h-4.5 3xl:w-4.5 4xl:h-6 4xl:w-6 5xl:h-7.5 5xl:w-7.5 h-3.5 w-3.5" />{" "}
                    Add Field
                  </button>
                </div>

                {!currentProj.customFields ||
                (currentProj.customFields as CustomField[]).length === 0 ? (
                  <p className="3xl:text-sm 4xl:text-base 5xl:text-lg text-xs text-zinc-400 italic">
                    No custom fields added. Default fields (Role, Timeline, Platform) will be shown.
                  </p>
                ) : (
                  <div className="3xl:space-y-4 4xl:space-y-5 5xl:space-y-6 space-y-2.5">
                    {(currentProj.customFields as CustomField[]).map(
                      (field: CustomField, index: number) => (
                        <div
                          key={index}
                          className="border-zinc-150 grid grid-cols-1 gap-2 border-b pb-3 last:border-b-0 sm:grid-cols-3 sm:items-center sm:gap-2 sm:border-0 sm:pb-0"
                        >
                          <input
                            type="text"
                            placeholder="Label (e.g. Client)"
                            value={field.label}
                            onChange={(e) => {
                              const fields = [...(currentProj.customFields as CustomField[])];
                              fields[index] = { ...fields[index], label: e.target.value };
                              setCurrentProj({ ...currentProj, customFields: fields });
                            }}
                            className="3xl:px-4 3xl:py-3 3xl:text-sm 4xl:px-5 4xl:py-3.5 4xl:text-base 5xl:px-6 5xl:py-4 5xl:text-lg w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
                          />
                          <input
                            type="text"
                            placeholder="Icon (e.g. user)"
                            value={field.icon || ""}
                            onChange={(e) => {
                              const fields = [...(currentProj.customFields as CustomField[])];
                              fields[index] = { ...fields[index], icon: e.target.value };
                              setCurrentProj({ ...currentProj, customFields: fields });
                            }}
                            className="3xl:px-4 3xl:py-3 3xl:text-sm 4xl:px-5 4xl:py-3.5 4xl:text-base 5xl:px-6 5xl:py-4 5xl:text-lg w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
                          />
                          <div className="flex w-full items-center gap-2">
                            <input
                              type="text"
                              placeholder="Value (e.g. Acme Corp)"
                              value={field.value}
                              onChange={(e) => {
                                const fields = [...(currentProj.customFields as CustomField[])];
                                fields[index] = { ...fields[index], value: e.target.value };
                                setCurrentProj({ ...currentProj, customFields: fields });
                              }}
                              className="3xl:px-4 3xl:py-3 3xl:text-sm 4xl:px-5 4xl:py-3.5 4xl:text-base 5xl:px-6 5xl:py-4 5xl:text-lg min-w-0 flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const fields = (currentProj.customFields as CustomField[]).filter(
                                  (_: CustomField, i: number) => i !== index
                                );
                                setCurrentProj({ ...currentProj, customFields: fields });
                              }}
                              className="3xl:p-3 4xl:p-4 5xl:p-5 shrink-0 rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-50 hover:text-red-500"
                            >
                              <Trash2 className="3xl:h-5.5 3xl:w-5.5 4xl:h-7 4xl:w-7 5xl:h-8.5 5xl:w-8.5 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label
                  htmlFor="proj-desc"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Short Description
                </label>
                <textarea
                  id="proj-desc"
                  rows={2}
                  value={currentProj.description || ""}
                  onChange={(e) => setCurrentProj({ ...currentProj, description: e.target.value })}
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.description ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.description ? "proj-desc-err" : undefined}
                />
                {projFormErrors.description && (
                  <p
                    id="proj-desc-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {projFormErrors.description}
                  </p>
                )}
              </div>

              {/* External URLs Grid */}
              <div className="3xl:gap-6 4xl:gap-8 5xl:gap-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="proj-github"
                    className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                  >
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    id="proj-github"
                    value={currentProj.githubUrl || ""}
                    onChange={(e) => setCurrentProj({ ...currentProj, githubUrl: e.target.value })}
                    className="3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="proj-link"
                    className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                  >
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    id="proj-link"
                    value={currentProj.projectUrl || ""}
                    onChange={(e) => setCurrentProj({ ...currentProj, projectUrl: e.target.value })}
                    className="3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Extended Case Study Details */}
              <div>
                <label
                  htmlFor="proj-ext"
                  className="3xl:text-[14px] 4xl:text-[18px] 5xl:text-[22px] mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Extended Case Study Description
                </label>
                <textarea
                  id="proj-ext"
                  rows={4}
                  value={currentProj.extendedDescription || ""}
                  onChange={(e) =>
                    setCurrentProj({ ...currentProj, extendedDescription: e.target.value })
                  }
                  className={`3xl:px-6 3xl:py-4 3xl:text-base 4xl:px-8 4xl:py-5.5 4xl:text-lg 5xl:px-10 5xl:py-7 5xl:text-xl w-full rounded-xl border px-4 py-2.5 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.extendedDescription
                      ? "animate-shake border-red-500"
                      : "border-zinc-300"
                  }`}
                  placeholder="# Extended details..."
                  aria-describedby={projFormErrors.extendedDescription ? "proj-ext-err" : undefined}
                />
                {projFormErrors.extendedDescription && (
                  <p
                    id="proj-ext-err"
                    className="text-red-650 3xl:text-sm 4xl:text-base 5xl:text-lg mt-1 text-xs font-semibold"
                  >
                    {projFormErrors.extendedDescription}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="3xl:gap-4.5 3xl:pt-6 4xl:gap-6 4xl:pt-8 5xl:gap-8 5xl:pt-10 flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProjModalOpen(false)}
                  className="3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:px-10 5xl:py-6 5xl:text-xl rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-6 5xl:text-xl rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog/Project Import Confirmation Modal */}
      {isImportModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="import-modal-title"
        >
          <div className="3xl:max-w-4xl 4xl:max-w-5xl 5xl:max-w-6xl 3xl:rounded-3xl flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
            {/* Header */}
            <header className="border-zinc-150 3xl:px-8 3xl:py-6 4xl:px-10 4xl:py-8 5xl:px-12 5xl:py-10 flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2
                  id="import-modal-title"
                  className="3xl:text-xl 4xl:text-2xl 5xl:text-3xl text-base font-bold text-black"
                >
                  Import {importType === "blogs" ? "Blog Posts" : "Projects"}
                </h2>
                <p className="3xl:text-sm 4xl:text-base 5xl:text-lg mt-0.5 text-xs text-zinc-500">
                  Select {importType === "blogs" ? "posts" : "projects"} to import and choose
                  conflict resolution.
                </p>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="3xl:h-11 3xl:w-11 3xl:rounded-xl 4xl:h-14 4xl:w-14 5xl:h-17 5xl:w-17 flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
                aria-label="Close modal"
                disabled={isImporting}
              >
                <X className="3xl:h-6 3xl:w-6 4xl:h-7.5 4xl:w-7.5 5xl:h-9 5xl:w-9 h-4 w-4" />
              </button>
            </header>

            {importResult ? (
              /* Success / Result View */
              <div className="3xl:p-8 4xl:p-10 5xl:p-12 space-y-6 overflow-y-auto p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <Check className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-black">Import Completed Successfully</h3>
                  <p className="3xl:text-sm 4xl:text-base 5xl:text-lg text-sm text-zinc-500">
                    The JSON import has been processed.
                  </p>
                </div>
                <div className="mx-auto max-w-xs rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-semibold text-zinc-700">
                  <div className="border-zinc-150 flex justify-between border-b py-1">
                    <span>Created (New):</span>
                    <span className="font-bold text-green-600">{importResult.created}</span>
                  </div>
                  <div className="border-zinc-150 flex justify-between border-b py-1">
                    <span>Updated (Overwrite):</span>
                    <span className="font-bold text-blue-600">{importResult.updated}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Skipped (Conflicting):</span>
                    <span className="font-bold text-zinc-500">{importResult.skipped}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setImportResult(null);
                  }}
                  className="3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-6 5xl:text-xl rounded-xl bg-black px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Close
                </button>
              </div>
            ) : (
              /* Configuration and Selection View */
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="3xl:p-8 4xl:p-10 5xl:p-12 flex-1 space-y-6 overflow-y-auto p-6">
                  {/* Conflict resolution option */}
                  <div className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                    <h3 className="text-xs font-bold tracking-wider text-zinc-700 uppercase">
                      Conflict Resolution
                    </h3>
                    <p className="text-[11px] text-zinc-500">
                      Specify what to do if an imported item has the same slug as an existing one.
                    </p>
                    <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-6">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-zinc-700 select-none">
                        <input
                          type="radio"
                          name="conflict-action"
                          value="skip"
                          checked={importConflictAction === "skip"}
                          onChange={() => setImportConflictAction("skip")}
                          className="h-4.5 w-4.5 text-black accent-black focus:ring-black"
                        />
                        <span>Skip conflicting items</span>
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-zinc-700 select-none">
                        <input
                          type="radio"
                          name="conflict-action"
                          value="overwrite"
                          checked={importConflictAction === "overwrite"}
                          onChange={() => setImportConflictAction("overwrite")}
                          className="h-4.5 w-4.5 text-black accent-black focus:ring-black"
                        />
                        <span>Overwrite existing items</span>
                      </label>
                    </div>
                  </div>

                  {/* Search and Selection Counts */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                      <input
                        type="text"
                        placeholder={`Search ${importType === "blogs" ? "posts" : "projects"} to import...`}
                        value={importSearchQuery}
                        onChange={(e) => setImportSearchQuery(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 py-2 pr-4 pl-10 text-xs focus:border-black focus:ring-1 focus:ring-black"
                      />
                    </div>
                    <div className="text-right text-[11px] font-bold text-zinc-500">
                      Selected: {selectedImportSlugs.size} of {importedItems.length}
                    </div>
                  </div>

                  {importError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
                      {importError}
                    </div>
                  )}

                  {/* List of imported items */}
                  <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                    <table className="w-full border-collapse text-left text-xs font-medium">
                      <thead>
                        <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                          <th className="w-10 px-4 py-3">
                            <input
                              type="checkbox"
                              checked={
                                importedItems.length > 0 &&
                                importedItems
                                  .filter(
                                    (p) =>
                                      p.title
                                        .toLowerCase()
                                        .includes(importSearchQuery.toLowerCase()) ||
                                      p.slug.toLowerCase().includes(importSearchQuery.toLowerCase())
                                  )
                                  .every((p) => selectedImportSlugs.has(p.slug))
                              }
                              onChange={() =>
                                handleToggleSelectAllImport(
                                  importedItems
                                    .filter(
                                      (p) =>
                                        p.title
                                          .toLowerCase()
                                          .includes(importSearchQuery.toLowerCase()) ||
                                        p.slug
                                          .toLowerCase()
                                          .includes(importSearchQuery.toLowerCase())
                                    )
                                    .map((p) => p.slug)
                                )
                              }
                              className="h-4 w-4 cursor-pointer rounded-sm border-zinc-300 text-black accent-black focus:ring-black"
                            />
                          </th>
                          <th className="px-4 py-3">Title / Slug</th>
                          <th className="px-4 py-3">
                            {importType === "blogs" ? "Category" : "Description"}
                          </th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-zinc-150 divide-y">
                        {importedItems
                          .filter(
                            (p) =>
                              p.title.toLowerCase().includes(importSearchQuery.toLowerCase()) ||
                              p.slug.toLowerCase().includes(importSearchQuery.toLowerCase())
                          )
                          .map((item) => {
                            const exists =
                              importType === "blogs"
                                ? blogs.some((b) => b.slug === item.slug)
                                : projects.some((pr) => pr.slug === item.slug);
                            return (
                              <tr key={item.slug} className="hover:bg-zinc-50/50">
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedImportSlugs.has(item.slug)}
                                    onChange={() => handleToggleSelectImport(item.slug)}
                                    className="h-4 w-4 cursor-pointer rounded-sm border-zinc-300 text-black accent-black focus:ring-black"
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div
                                    className="max-w-xs truncate font-semibold text-black"
                                    title={item.title}
                                  >
                                    {item.title}
                                  </div>
                                  <div
                                    className="max-w-xs truncate text-[10px] text-zinc-400"
                                    title={item.slug}
                                  >
                                    {item.slug}
                                  </div>
                                </td>
                                <td
                                  className="max-w-xs truncate px-4 py-3 text-zinc-500"
                                  title={
                                    importType === "blogs"
                                      ? (item as BlogPost).category
                                      : (item as Project).description
                                  }
                                >
                                  {importType === "blogs"
                                    ? (item as BlogPost).category
                                    : (item as Project).description}
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                  {exists ? (
                                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 uppercase">
                                      Conflict
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700 uppercase">
                                      New
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Actions */}
                <footer className="3xl:gap-4.5 3xl:pt-6 4xl:gap-6 4xl:pt-8 5xl:gap-8 5xl:pt-10 flex justify-end gap-3 border-t border-zinc-100 bg-zinc-50 p-6">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="3xl:px-6 3xl:py-3.5 3xl:text-base 4xl:px-8 4xl:py-4.5 4xl:text-lg 5xl:px-10 5xl:py-6 5xl:text-xl rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                    disabled={isImporting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeImport}
                    disabled={isImporting || selectedImportSlugs.size === 0}
                    className="3xl:px-7 3xl:py-3.5 3xl:text-base 4xl:px-9 4xl:py-4.5 4xl:text-lg 5xl:px-11 5xl:py-6 5xl:text-xl flex items-center justify-center gap-1.5 rounded-xl bg-black px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                        <span>Importing...</span>
                      </>
                    ) : (
                      <span>Import {selectedImportSlugs.size} Selected</span>
                    )}
                  </button>
                </footer>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
