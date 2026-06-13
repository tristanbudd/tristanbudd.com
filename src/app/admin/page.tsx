"use client";

/**
 * @file page.tsx
 * @description Accessible Admin Dashboard. Provides UI editors for Blog posts and Projects.
 */

import {
  Edit,
  FileText,
  Folder,
  LogOut,
  Plus,
  Trash2,
  X,
  Calendar,
  Settings,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { type BlogPost } from "../../data/blog";
import { type CustomField, type Project } from "../../data/projects";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"blogs" | "projects" | "maintenance">("blogs");

  // Content States
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDbOffline, setIsDbOffline] = useState(false);

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

  // Fetch data from MySQL database via API routes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, projectsRes, maintRes] = await Promise.all([
          fetch("/api/admin/blogs"),
          fetch("/api/admin/projects"),
          fetch("/api/maintenance"),
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
      } catch (error) {
        console.error("Failed to load admin dashboard data:", error);
        setIsDbOffline(true);
      }
    };
    fetchData();
  }, []);

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
      category: "Tech",
      excerpt: "",
      content: "",
      publishedAt: new Date().toISOString().split("T")[0],
      tags: [],
      readingTime: "5 min read",
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

  return (
    <div className="font-outfit flex min-h-screen bg-zinc-50 text-black">
      {/* Sidebar Navigation */}
      <aside
        className="flex w-64 flex-col justify-between border-r border-zinc-200 bg-white"
        aria-label="Sidebar navigation"
      >
        <div>
          {/* Sidebar Header */}
          <div className="border-b border-zinc-100 p-6">
            <h2 className="text-sm font-extrabold tracking-wider text-black uppercase">
              admin panel
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 p-4" aria-label="Dashboard views">
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === "blogs"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "blogs" ? "page" : undefined}
            >
              <FileText className="h-4.5 w-4.5" />
              <span>Blog Posts</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "blogs" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {totalBlogs}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === "projects"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "projects" ? "page" : undefined}
            >
              <Folder className="h-4.5 w-4.5" />
              <span>Projects</span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "projects" ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                }`}
              >
                {totalProjects}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === "maintenance"
                  ? "bg-black text-white"
                  : "text-zinc-650 hover:bg-zinc-100 hover:text-black"
              }`}
              aria-current={activeTab === "maintenance" ? "page" : undefined}
            >
              <Settings className="h-4.5 w-4.5" />
              <span>Maintenance</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="border-t border-zinc-100 p-4">
          <button
            onClick={handleLogout}
            className="text-red-650 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:outline-hidden"
            aria-label="Log out of admin panel"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex min-w-0 flex-1 flex-col" role="main">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-black">
              {activeTab === "blogs"
                ? "Manage Blog Posts"
                : activeTab === "projects"
                  ? "Manage Case Studies"
                  : "Maintenance Configuration"}
            </h1>
          </div>

          {/* Create Action Button */}
          {activeTab === "blogs" ? (
            <button
              onClick={openBlogCreate}
              disabled={isDbOffline}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Create new blog post"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>New Post</span>
            </button>
          ) : activeTab === "projects" ? (
            <button
              onClick={openProjCreate}
              disabled={isDbOffline}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Create new project study"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>New Project</span>
            </button>
          ) : null}
        </header>

        {/* Content Body Container */}
        <div className="flex-1 space-y-8 overflow-y-auto p-8">
          {isDbOffline && (
            <div className="flex animate-pulse items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-xs">
              <span className="relative mt-1.5 flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="bg-red-650 relative inline-flex h-3 w-3 rounded-full"></span>
              </span>
              <div>
                <h4 className="text-sm font-bold">Database connection is offline</h4>
                <p className="mt-1 text-xs leading-relaxed text-red-700">
                  We are unable to connect to the database. You will not be able to view, create,
                  edit, or delete items. Please ensure database services are running.
                </p>
              </div>
            </div>
          )}

          {/* Quick Statistics Panels - Tab Specific */}
          {(activeTab === "blogs" || activeTab === "projects") && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {activeTab === "blogs" ? (
                <>
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        Total Blogs
                      </span>
                      <FileText className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{totalBlogs}</h2>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        Latest Post Date
                      </span>
                      <Calendar className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
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
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        Total Projects
                      </span>
                      <Folder className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{totalProjects}</h2>
                  </div>
                  <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs">
                    <div className="absolute top-0 left-0 h-[2px] w-full bg-zinc-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                        Latest Project Date
                      </span>
                      <Calendar className="h-5 w-5 text-zinc-400" />
                    </div>
                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
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
                    Toggle maintenance mode across the application. When enabled, non-admin visitors
                    will see the maintenance screen. Authenticated administrators can bypass this
                    screen and browse normally.
                  </p>
                </div>

                {isEnvForced && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                    <strong>Notice:</strong> Maintenance Mode is currently forced{" "}
                    <strong>ON</strong> by the server environment configuration (
                    <code>MAINTENANCE_MODE=true</code>) and cannot be disabled from this panel.
                  </div>
                )}

                <hr className="border-zinc-150/40" />

                {/* Toggle switch */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <label
                      htmlFor="maintenance-mode-toggle"
                      className="text-sm font-bold text-zinc-700"
                    >
                      Enable Maintenance Mode
                    </label>
                    <p className="text-xs text-zinc-500">
                      Redirect all standard website traffic to the system upgrades screen.
                    </p>
                  </div>
                  <button
                    type="button"
                    id="maintenance-mode-toggle"
                    disabled={isEnvForced}
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-black focus:ring-offset-2 focus:outline-hidden ${
                      maintenanceMode ? "bg-black" : "bg-zinc-200"
                    } ${isEnvForced ? "cursor-not-allowed opacity-50" : ""}`}
                    role="switch"
                    aria-checked={maintenanceMode}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        maintenanceMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <hr className="border-zinc-150/40" />

                {/* Password/Bypass token */}
                <div className="space-y-2">
                  <label htmlFor="bypass-key" className="text-sm font-bold text-zinc-700 uppercase">
                    Bypass Password / Token
                  </label>
                  <p className="text-xs text-zinc-500">
                    A secure password allowing visitors to bypass the maintenance page by appending
                    `?bypass=YOUR_PASSWORD` to the URL.
                  </p>
                  <input
                    type="text"
                    id="bypass-key"
                    value={bypassKey}
                    onChange={(e) => {
                      setBypassKey(e.target.value);
                      setMaintenanceFormError("");
                    }}
                    placeholder="Enter bypass password"
                    className="border-zinc-250 w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-hidden"
                  />
                  {maintenanceFormError && (
                    <p className="text-red-650 text-xs font-semibold">{maintenanceFormError}</p>
                  )}
                </div>

                {/* Bypass Link Documentation */}
                <div className="space-y-2.5 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                  <h4 className="text-sm font-bold text-zinc-800">Bypassing Maintenance Mode</h4>
                  <p className="text-xs leading-relaxed text-zinc-500">
                    Admins bypass maintenance mode automatically when authenticated. To allow
                    guests, clients, or testers to bypass the offline screen, share the bypass link
                    below.
                  </p>
                  {bypassKey && (
                    <div className="pt-1">
                      <p className="text-zinc-650 mb-1.5 text-xs font-semibold">
                        Bypass Link for Guests:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={
                            typeof window !== "undefined"
                              ? `${window.location.origin}/?bypass=${bypassKey}`
                              : `/?bypass=${bypassKey}`
                          }
                          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-xs text-zinc-600 select-all focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const bypassUrl =
                              typeof window !== "undefined"
                                ? `${window.location.origin}/?bypass=${bypassKey}`
                                : `/?bypass=${bypassKey}`;
                            navigator.clipboard.writeText(bypassUrl);
                            setCopiedBypass(true);
                            setTimeout(() => setCopiedBypass(false), 2000);
                          }}
                          className="flex h-8 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-semibold transition-colors hover:bg-zinc-50"
                          aria-label="Copy bypass link"
                        >
                          {copiedBypass ? (
                            <>
                              <Check className="text-green-650 h-3.5 w-3.5" />
                              <span className="font-bold text-green-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {saveSettingsSuccess && (
                  <div
                    role="alert"
                    className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
                  >
                    Maintenance settings saved successfully.
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-black focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSavingSettings ? "Saving..." : "Save Configuration"}
                  </button>
                </div>
              </form>
            ) : activeTab === "blogs" ? (
              // Blogs List Table
              blogs.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  No blog posts found. Click &quot;New Post&quot; to write one.
                </div>
              ) : (
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Published At</th>
                      <th className="px-6 py-4">Reading Time</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm font-medium">
                    {blogs.map((post) => (
                      <tr key={post.slug} className="transition-colors hover:bg-zinc-50/50">
                        <td className="px-6 py-4">
                          <span className="block max-w-md truncate font-semibold text-black">
                            {post.title}
                          </span>
                          <span className="block text-xs font-normal text-zinc-400">
                            {post.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full border border-zinc-200/50 bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-700">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-600">{post.publishedAt}</td>
                        <td className="px-6 py-4 font-normal text-zinc-500">{post.readingTime}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openBlogEdit(post)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                              aria-label={`Edit ${post.title}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteBlog(post.slug)}
                              className="text-red-650 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                              aria-label={`Delete ${post.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : // Projects List Table
            projects.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                No projects found. Click &quot;New Project&quot; to build one.
              </div>
            ) : (
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Published At</th>
                    <th className="px-6 py-4">Urls</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm font-medium">
                  {projects.map((proj) => (
                    <tr key={proj.slug} className="transition-colors hover:bg-zinc-50/50">
                      <td className="px-6 py-4">
                        <span className="block max-w-md truncate font-semibold text-black">
                          {proj.title}
                        </span>
                        <span className="block text-xs font-normal text-zinc-400">{proj.slug}</span>
                      </td>
                      <td className="text-zinc-650 px-6 py-4">{proj.publishedAt || "N/A"}</td>
                      <td className="text-zinc-450 px-6 py-4 font-normal">
                        <div className="flex gap-2">
                          {proj.githubUrl && (
                            <span className="rounded-sm border border-zinc-200 px-2 py-0.5 text-xs">
                              GitHub
                            </span>
                          )}
                          {proj.projectUrl && (
                            <span className="rounded-sm border border-zinc-200 px-2 py-0.5 text-xs">
                              Live
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openProjEdit(proj)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-all hover:border-black hover:bg-zinc-50 hover:text-black"
                            aria-label={`Edit ${proj.title}`}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteProj(proj.slug)}
                            className="text-red-650 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                            aria-label={`Delete ${proj.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
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
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <header className="border-zinc-150 flex items-center justify-between border-b px-6 py-4">
              <h2 id="blog-modal-title" className="text-base font-bold">
                {currentBlog.slug ? "Edit Blog Post" : "Create New Blog Post"}
              </h2>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <form onSubmit={saveBlog} className="flex-1 space-y-4 p-6">
              {/* Title */}
              <div>
                <label
                  htmlFor="blog-title"
                  className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.title ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.title ? "blog-title-err" : undefined}
                />
                {blogFormErrors.title && (
                  <p id="blog-title-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {blogFormErrors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="blog-slug"
                  className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.slug ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.slug ? "blog-slug-err" : undefined}
                />
                {blogFormErrors.slug && (
                  <p id="blog-slug-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {blogFormErrors.slug}
                  </p>
                )}
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="blog-category"
                    className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
                  >
                    Category
                  </label>
                  <select
                    id="blog-category"
                    value={currentBlog.category || "Tech"}
                    onChange={(e) => setCurrentBlog({ ...currentBlog, category: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="DevLog">DevLog</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="blog-date"
                    className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
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
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label
                  htmlFor="blog-excerpt"
                  className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Excerpt / Brief Description
                </label>
                <textarea
                  id="blog-excerpt"
                  rows={2}
                  value={currentBlog.excerpt || ""}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, excerpt: e.target.value })}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.excerpt ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={blogFormErrors.excerpt ? "blog-excerpt-err" : undefined}
                />
                {blogFormErrors.excerpt && (
                  <p id="blog-excerpt-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {blogFormErrors.excerpt}
                  </p>
                )}
              </div>

              {/* Markdown Content */}
              <div>
                <label
                  htmlFor="blog-content"
                  className="mb-1 block text-xs font-bold text-zinc-700 uppercase"
                >
                  Markdown Content
                </label>
                <textarea
                  id="blog-content"
                  rows={6}
                  value={currentBlog.content || ""}
                  onChange={(e) => setCurrentBlog({ ...currentBlog, content: e.target.value })}
                  className={`w-full rounded-xl border px-4 py-2.5 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    blogFormErrors.content ? "border-red-500" : "border-zinc-300"
                  }`}
                  placeholder="# Enter your markdown text here..."
                  aria-describedby={blogFormErrors.content ? "blog-content-err" : undefined}
                />
                {blogFormErrors.content && (
                  <p id="blog-content-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {blogFormErrors.content}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
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
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl">
            <header className="border-zinc-150 flex items-center justify-between border-b px-6 py-4">
              <h2 id="proj-modal-title" className="text-base font-bold">
                {currentProj._originalSlug ? "Edit Project" : "Create New Project"}
              </h2>
              <button
                onClick={() => setIsProjModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-zinc-100"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <form onSubmit={saveProj} className="flex-1 space-y-4 p-6 text-xs">
              {/* Title */}
              <div>
                <label
                  htmlFor="proj-title"
                  className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.title ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.title ? "proj-title-err" : undefined}
                />
                {projFormErrors.title && (
                  <p id="proj-title-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {projFormErrors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label
                  htmlFor="proj-slug"
                  className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
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
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.slug ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.slug ? "proj-slug-err" : undefined}
                />
                {projFormErrors.slug && (
                  <p id="proj-slug-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {projFormErrors.slug}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label
                  htmlFor="proj-date"
                  className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Published Date
                </label>
                <input
                  type="date"
                  id="proj-date"
                  value={currentProj.publishedAt || ""}
                  onChange={(e) => setCurrentProj({ ...currentProj, publishedAt: e.target.value })}
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Sidebar Custom Fields */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="block text-[10px] font-bold text-zinc-700 uppercase">
                    Sidebar Metadata Fields
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const fields = [...((currentProj.customFields as CustomField[]) || [])];
                      fields.push({ label: "", value: "", icon: "" });
                      setCurrentProj({ ...currentProj, customFields: fields });
                    }}
                    className="hover:text-zinc-650 flex items-center gap-1 text-xs font-bold text-black transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Field
                  </button>
                </div>

                {!currentProj.customFields ||
                (currentProj.customFields as CustomField[]).length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">
                    No custom fields added. Default fields (Role, Timeline, Platform) will be shown.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {(currentProj.customFields as CustomField[]).map(
                      (field: CustomField, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Label (e.g. Client)"
                            value={field.label}
                            onChange={(e) => {
                              const fields = [...(currentProj.customFields as CustomField[])];
                              fields[index] = { ...fields[index], label: e.target.value };
                              setCurrentProj({ ...currentProj, customFields: fields });
                            }}
                            className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
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
                            className="w-28 rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. Acme Corp)"
                            value={field.value}
                            onChange={(e) => {
                              const fields = [...(currentProj.customFields as CustomField[])];
                              fields[index] = { ...fields[index], value: e.target.value };
                              setCurrentProj({ ...currentProj, customFields: fields });
                            }}
                            className="flex-1 rounded-xl border border-zinc-300 px-3 py-2 text-xs focus:border-black focus:ring-1 focus:ring-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const fields = (currentProj.customFields as CustomField[]).filter(
                                (_: CustomField, i: number) => i !== index
                              );
                              setCurrentProj({ ...currentProj, customFields: fields });
                            }}
                            className="rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
                  className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Short Description
                </label>
                <textarea
                  id="proj-desc"
                  rows={2}
                  value={currentProj.description || ""}
                  onChange={(e) => setCurrentProj({ ...currentProj, description: e.target.value })}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black ${
                    projFormErrors.description ? "border-red-500" : "border-zinc-300"
                  }`}
                  aria-describedby={projFormErrors.description ? "proj-desc-err" : undefined}
                />
                {projFormErrors.description && (
                  <p id="proj-desc-err" className="text-red-650 mt-1 text-xs font-semibold">
                    {projFormErrors.description}
                  </p>
                )}
              </div>

              {/* External URLs Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="proj-github"
                    className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                  >
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    id="proj-github"
                    value={currentProj.githubUrl || ""}
                    onChange={(e) => setCurrentProj({ ...currentProj, githubUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="proj-link"
                    className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                  >
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    id="proj-link"
                    value={currentProj.projectUrl || ""}
                    onChange={(e) => setCurrentProj({ ...currentProj, projectUrl: e.target.value })}
                    className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 text-sm focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Extended Case Study Details */}
              <div>
                <label
                  htmlFor="proj-ext"
                  className="mb-1 block text-[10px] font-bold text-zinc-700 uppercase"
                >
                  Extended Case Study Description (optional)
                </label>
                <textarea
                  id="proj-ext"
                  rows={4}
                  value={currentProj.extendedDescription || ""}
                  onChange={(e) =>
                    setCurrentProj({ ...currentProj, extendedDescription: e.target.value })
                  }
                  className="w-full rounded-xl border border-zinc-300 px-4 py-2.5 font-mono text-sm focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="# Extended details..."
                />
              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProjModalOpen(false)}
                  className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
