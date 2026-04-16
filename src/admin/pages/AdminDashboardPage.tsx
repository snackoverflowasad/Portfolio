import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateAdminMessage,
  deleteAdminMessage,
  clearAdminToken,
  createAdminBlog,
  createAdminProject,
  deleteAdminBlog,
  deleteAdminProject,
  getAdminBlogs,
  getAdminMe,
  getAdminProjects,
  getAdminMessages,
  getSavedAdminToken,
  logoutAdmin,
  updateAdminBlog,
  updateAdminProject,
} from "../../api/admin";
import type {
  AdminAuthUser,
  AdminBlog,
  AdminBlogPayload,
  AdminMessage,
  AdminProject,
  AdminProjectPayload,
  ItemStatus,
} from "../../types";

type ContentTab = "projects" | "blogs" | "messages";
type FilterStatus = "all" | ItemStatus;
type ToastTone = "success" | "error" | "warning";
type PendingDelete =
  | { kind: "project"; id: string; title: string }
  | { kind: "blog"; id: string; title: string };

const projectStatuses: ItemStatus[] = ["draft", "published", "archived"];
const blogStatuses: ItemStatus[] = ["draft", "published", "archived"];

const emptyProjectForm: AdminProjectPayload = {
  title: "",
  summary: "",
  description: "",
  projectUrl: "",
  liveUrl: "",
  repositoryUrl: "",
  techStack: [],
  imageUrl: "",
  status: "draft",
  featured: false,
};

const emptyBlogForm: AdminBlogPayload = {
  title: "",
  summary: "",
  contentMarkdown: "",
  href: "",
  category: "",
  tags: [],
  coverImageUrl: "",
  status: "draft",
  featured: false,
};

function toCommaSeparated(values: string[]) {
  return values.join(", ");
}

function parseCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [profile, setProfile] = useState<AdminAuthUser | null>(null);
  const [isBootLoading, setIsBootLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ContentTab>("projects");

  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);

  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isBlogsLoading, setIsBlogsLoading] = useState(false);

  const [projectSearch, setProjectSearch] = useState("");
  const [blogSearch, setBlogSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] =
    useState<FilterStatus>("all");
  const [blogStatusFilter, setBlogStatusFilter] = useState<FilterStatus>("all");

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedBlogId, setSelectedBlogId] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [isActingOnMessage, setIsActingOnMessage] = useState(false);

  const [projectForm, setProjectForm] =
    useState<AdminProjectPayload>(emptyProjectForm);
  const [blogForm, setBlogForm] = useState<AdminBlogPayload>(emptyBlogForm);

  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const [projectTechInput, setProjectTechInput] = useState("");
  const [blogTagsInput, setBlogTagsInput] = useState("");

  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);

  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [isDeletingBlog, setIsDeletingBlog] = useState(false);

  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastTone, setToastTone] = useState<ToastTone>("success");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );

  const showToast = (message: string, tone: ToastTone) => {
    setToastMessage(message);
    setToastTone(tone);
  };

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const selectedBlog = useMemo(
    () => blogs.find((blog) => blog.id === selectedBlogId) ?? null,
    [blogs, selectedBlogId],
  );

  const selectedMessage = useMemo(
    () => messages.find((message) => message.id === selectedMessageId) ?? null,
    [messages, selectedMessageId],
  );

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesStatus =
        projectStatusFilter === "all" || project.status === projectStatusFilter;
      const matchesQuery =
        query.length === 0 ||
        project.title.toLowerCase().includes(query) ||
        (project.summary || "").toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [projectSearch, projectStatusFilter, projects]);

  const filteredBlogs = useMemo(() => {
    const query = blogSearch.trim().toLowerCase();

    return blogs.filter((blog) => {
      const matchesStatus =
        blogStatusFilter === "all" || blog.status === blogStatusFilter;
      const matchesQuery =
        query.length === 0 ||
        blog.title.toLowerCase().includes(query) ||
        (blog.summary || "").toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [blogSearch, blogStatusFilter, blogs]);

  const filteredMessages = useMemo(() => {
    const query = messageSearch.trim().toLowerCase();

    return messages.filter((message) => {
      if (query.length === 0) {
        return true;
      }

      return (
        message.senderName.toLowerCase().includes(query) ||
        message.senderEmail.toLowerCase().includes(query) ||
        message.subject.toLowerCase().includes(query) ||
        message.inquiryType.toLowerCase().includes(query)
      );
    });
  }, [messageSearch, messages]);

  const handleMarkMessageRead = async () => {
     console.log("token:", token, "selectedMessageId:", selectedMessageId);
    if (!token || !selectedMessageId) return;

    try {
      setIsActingOnMessage(true);
      setErrorMessage("");
      await updateAdminMessage(token, selectedMessageId, { status: "read" });
      setNotice("Message marked as read.");
      showToast("Message marked as read.", "success");
      await loadMessages(token);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update message.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsActingOnMessage(false);
    }
  };

  const handleArchiveMessage = async () => {
    if (!token || !selectedMessageId) return;

    try {
      setIsActingOnMessage(true);
      setErrorMessage("");
      await deleteAdminMessage(token, selectedMessageId);
      setNotice("Message archived successfully.");
      showToast("Message archived successfully.", "success");
      await loadMessages(token);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to archive message.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setIsActingOnMessage(false);
    }
  };
  const loadProjects = async (sessionToken: string) => {
    setIsProjectsLoading(true);

    try {
      const data = await getAdminProjects(sessionToken);
      const visibleProjects = data.filter((item) => item.status !== "archived");
      setProjects(visibleProjects);

      if (visibleProjects.length > 0) {
        setSelectedProjectId((prev) =>
          prev && visibleProjects.some((item) => item.id === prev)
            ? prev
            : visibleProjects[0].id,
        );
      } else {
        setSelectedProjectId("");
      }
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const loadBlogs = async (sessionToken: string) => {
    setIsBlogsLoading(true);

    try {
      const data = await getAdminBlogs(sessionToken);
      const visibleBlogs = data.filter((item) => item.status !== "archived");
      setBlogs(visibleBlogs);

      if (visibleBlogs.length > 0) {
        setSelectedBlogId((prev) =>
          prev && visibleBlogs.some((item) => item.id === prev)
            ? prev
            : visibleBlogs[0].id,
        );
      } else {
        setSelectedBlogId("");
      }
    } finally {
      setIsBlogsLoading(false);
    }
  };

  const loadMessages = async (sessionToken: string) => {
    setIsMessagesLoading(true);

    try {
      const data = await getAdminMessages(sessionToken);
      setMessages(data);

      if (data.length > 0) {
        setSelectedMessageId((prev) =>
          prev && data.some((item) => item.id === prev) ? prev : data[0].id,
        );
      } else {
        setSelectedMessageId("");
      }
    } finally {
      setIsMessagesLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const storedToken = getSavedAdminToken();
      if (!storedToken) {
        navigate("/v3/admin/login-page", { replace: true });
        return;
      }

      try {
        const me = await getAdminMe(storedToken);
        if (!isMounted) {
          return;
        }

        setProfile(me);
        setToken(storedToken);

        await Promise.all([
          loadProjects(storedToken),
          loadBlogs(storedToken),
          loadMessages(storedToken),
        ]);
      } catch (error) {
        clearAdminToken();
        if (isMounted) {
          navigate("/v3/admin/login-page", { replace: true });
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Session expired. Please log in again.",
          );
        }
      } finally {
        if (isMounted) {
          setIsBootLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!selectedProject) {
      setProjectForm(emptyProjectForm);
      setProjectTechInput("");
      setProjectImageFile(null);
      return;
    }

    setProjectForm({
      title: selectedProject.title,
      summary: selectedProject.summary ?? "",
      description: selectedProject.description ?? "",
      projectUrl: selectedProject.projectUrl ?? "",
      liveUrl: selectedProject.liveUrl ?? "",
      repositoryUrl: selectedProject.repositoryUrl ?? "",
      techStack: selectedProject.techStack ?? [],
      imageUrl: selectedProject.imageUrl ?? "",
      status: selectedProject.status,
      featured: Boolean(selectedProject.featured),
    });
    setProjectTechInput(toCommaSeparated(selectedProject.techStack ?? []));
    setProjectImageFile(null);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedBlog) {
      setBlogForm(emptyBlogForm);
      setBlogTagsInput("");
      setBlogImageFile(null);
      return;
    }

    setBlogForm({
      title: selectedBlog.title,
      summary: selectedBlog.summary ?? "",
      contentMarkdown: selectedBlog.contentMarkdown ?? "",
      href: selectedBlog.href ?? "",
      category: selectedBlog.category ?? "",
      tags: selectedBlog.tags ?? [],
      coverImageUrl: selectedBlog.coverImageUrl ?? "",
      status: selectedBlog.status,
      featured: Boolean(selectedBlog.featured),
    });
    setBlogTagsInput(toCommaSeparated(selectedBlog.tags ?? []));
    setBlogImageFile(null);
  }, [selectedBlog]);

  useEffect(() => {
    if (!toastMessage || pendingDelete) {
      return;
    }

    const timer = window.setTimeout(() => {
      setToastMessage("");
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [toastMessage, pendingDelete]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch {
      // clear local token even if backend logout fails
    } finally {
      clearAdminToken();
      navigate("/v3/admin/login-page", { replace: true });
    }
  };

  const handleProjectFieldChange = (
    field: keyof AdminProjectPayload,
    value: string | boolean,
  ) => {
    setProjectForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBlogFieldChange = (
    field: keyof AdminBlogPayload,
    value: string | boolean,
  ) => {
    setBlogForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateProjectNew = () => {
    setSelectedProjectId("");
    setProjectForm(emptyProjectForm);
    setProjectTechInput("");
    setProjectImageFile(null);
    setNotice("Ready to create a new project.");
    setErrorMessage("");
  };

  const handleCreateBlogNew = () => {
    setSelectedBlogId("");
    setBlogForm(emptyBlogForm);
    setBlogTagsInput("");
    setBlogImageFile(null);
    setNotice("Ready to create a new blog.");
    setErrorMessage("");
  };

  const handleProjectSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    const payload: AdminProjectPayload = {
      ...projectForm,
      techStack: parseCommaSeparated(projectTechInput),
    };

    if (!payload.title.trim()) {
      setErrorMessage("Project title is required.");
      return;
    }

    try {
      setIsSavingProject(true);
      setErrorMessage("");
      setNotice("");

      if (selectedProjectId) {
        await updateAdminProject(
          token,
          selectedProjectId,
          payload,
          projectImageFile,
        );
        setNotice("Project updated successfully.");
      } else {
        await createAdminProject(token, payload, projectImageFile);
        setNotice("Project created successfully.");
      }

      await loadProjects(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save project.",
      );
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleBlogSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    const payload: AdminBlogPayload = {
      ...blogForm,
      tags: parseCommaSeparated(blogTagsInput),
    };

    if (!payload.title.trim()) {
      setErrorMessage("Blog title is required.");
      return;
    }

    try {
      setIsSavingBlog(true);
      setErrorMessage("");
      setNotice("");

      if (selectedBlogId) {
        await updateAdminBlog(token, selectedBlogId, payload, blogImageFile);
        setNotice("Blog updated successfully.");
      } else {
        await createAdminBlog(token, payload, blogImageFile);
        setNotice("Blog created successfully.");
      }

      await loadBlogs(token);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save blog.",
      );
    } finally {
      setIsSavingBlog(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!token || !selectedProjectId) {
      return;
    }

    const item = projects.find((project) => project.id === selectedProjectId);
    if (!item) {
      return;
    }

    setPendingDelete({ kind: "project", id: item.id, title: item.title });
    showToast(`Archive project "${item.title}"?`, "warning");
  };

  const handleDeleteBlog = async () => {
    if (!token || !selectedBlogId) {
      return;
    }

    const item = blogs.find((blog) => blog.id === selectedBlogId);
    if (!item) {
      return;
    }

    setPendingDelete({ kind: "blog", id: item.id, title: item.title });
    showToast(`Archive blog "${item.title}"?`, "warning");
  };

  const handleConfirmDelete = async () => {
    if (!token || !pendingDelete) {
      return;
    }

    try {
      setErrorMessage("");

      if (pendingDelete.kind === "project") {
        setIsDeletingProject(true);
        await deleteAdminProject(token, pendingDelete.id);
        setProjects((prev) =>
          prev.filter((item) => item.id !== pendingDelete.id),
        );
        setSelectedProjectId((prev) => (prev === pendingDelete.id ? "" : prev));
        setNotice("Project archived successfully.");
        showToast("Project archived successfully.", "success");
        await loadProjects(token);
      } else {
        setIsDeletingBlog(true);
        await deleteAdminBlog(token, pendingDelete.id);
        setBlogs((prev) => prev.filter((item) => item.id !== pendingDelete.id));
        setSelectedBlogId((prev) => (prev === pendingDelete.id ? "" : prev));
        setNotice("Blog archived successfully.");
        showToast("Blog archived successfully.", "success");
        await loadBlogs(token);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete item.";
      setErrorMessage(message);
      showToast(message, "error");
    } finally {
      setPendingDelete(null);
      setIsDeletingProject(false);
      setIsDeletingBlog(false);
    }
  };

  const handleCancelDelete = () => {
    setPendingDelete(null);
    setToastMessage("Deletion cancelled.");
    setToastTone("warning");
  };

  const onProjectImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProjectImageFile(event.target.files?.[0] ?? null);
  };

  const onBlogImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBlogImageFile(event.target.files?.[0] ?? null);
  };

  if (isBootLoading) {
    return (
      <main className="min-h-screen bg-[#ebebdd] px-4 py-10 text-[#151515] sm:px-6">
        <div className="mx-auto max-w-[980px] border-2 border-[#111111] bg-white p-6 shadow-[5px_5px_0_#9f9f9f]">
          <h1 className="font-['Syne'] text-[clamp(24px,4vw,40px)]">
            Loading Dashboard...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#ebebdd] px-4 py-6 text-[#151515] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1380px] flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-3 border-2 border-[#111111] bg-white px-4 py-3 shadow-[5px_5px_0_#9f9f9f] sm:px-5">
          <div>
            <p className="m-0 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.16em] text-[#444]">
              v4 Admin Dashboard
            </p>
            <h1 className="m-0 font-['Syne'] text-[28px] leading-none">
              Content Control
            </h1>
            {profile?.email ? (
              <p className="m-0 mt-1 text-[13px] text-[#4a4a4a]">
                Logged in as {profile.email}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-white px-3 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
            >
              View Site
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#ffd9d9] px-3 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] text-[#111111] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {errorMessage ? (
          <p className="m-0 border-2 border-[#111111] bg-[#ffd9d9] px-4 py-3 font-['Syne'] text-[13px] font-bold text-[#8f1d1d]">
            {errorMessage}
          </p>
        ) : null}

        {notice ? (
          <p className="m-0 border-2 border-[#111111] bg-[#e8ffd7] px-4 py-3 font-['Syne'] text-[13px] font-bold text-[#1a5e1a]">
            {notice}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`border-2 border-[#111111] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${activeTab === "projects" ? "bg-[#9dff00]" : "bg-white"}`}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("blogs")}
            className={`border-2 border-[#111111] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${activeTab === "blogs" ? "bg-[#9fd5f8]" : "bg-white"}`}
          >
            Blogs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("messages")}
            className={`border-2 border-[#111111] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${activeTab === "messages" ? "bg-[#ffb0dd]" : "bg-white"}`}
          >
            Messages
          </button>
        </div>

        {activeTab === "messages" ? (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.45fr]">
            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="m-0 font-['Syne'] text-[26px] leading-none">
                  Messages
                </h2>
                <span className="border-2 border-[#111111] bg-[#ffe47c] px-2.5 py-1 font-['Syne'] text-[11px] font-extrabold uppercase tracking-[0.12em]">
                  Inbox
                </span>
              </div>

              <input
                type="search"
                value={messageSearch}
                onChange={(event) => setMessageSearch(event.target.value)}
                placeholder="Search by sender, email, subject"
                className="mb-3 w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
              />

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
                Showing {filteredMessages.length} of {messages.length}
              </p>

              <div className="max-h-[66vh] space-y-2 overflow-y-auto pr-1">
                {isMessagesLoading ? (
                  <p className="text-sm">Loading messages...</p>
                ) : null}

                {!isMessagesLoading && filteredMessages.map((message) => (
                  <button
                    key={message.id}
                    type="button"
                    onClick={() => setSelectedMessageId(message.id)}
                    className={`w-full border-2 border-[#111111] px-3 py-3 text-left shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${message.id === selectedMessageId ? "bg-[#ffdaef]" : "bg-[#f9f7ef]"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="m-0 font-['Syne'] text-[17px] leading-none">
                        {message.senderName}
                      </p>
                      <span
                        className={`border border-[#111111] px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.08em] ${message.status === "unread" ? "bg-[#9dff00]" : "bg-white"}`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-[12px] text-[#333]">
                      {message.subject}
                    </p>
                    <p className="m-0 mt-1 text-[11px] uppercase tracking-[0.08em] text-[#666]">
                      {message.receivedAt}
                    </p>
                  </button>
                ))}

                {!isMessagesLoading && filteredMessages.length === 0 ? (
                  <p className="text-sm text-[#555]">
                    No messages match this search.
                  </p>
                ) : null}
              </div>
            </article>

            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              {selectedMessage ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="m-0 font-['Syne'] text-[24px]">
                      Message Detail
                    </h3>
                    <span className="border-2 border-[#111111] bg-[#fff0b8] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em]">
                      {selectedMessage.inquiryType}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2">
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666]">
                        From
                      </p>
                      <p className="m-0 mt-1 font-['Syne'] text-[17px] leading-none">
                        {selectedMessage.senderName}
                      </p>
                    </div>
                    <div className="border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2">
                      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666]">
                        Received
                      </p>
                      <p className="m-0 mt-1 text-[14px]">
                        {selectedMessage.receivedAt}
                      </p>
                    </div>
                  </div>

                  <div className="border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666]">
                      Email
                    </p>
                    <p className="m-0 mt-1 text-[14px]">
                      {selectedMessage.senderEmail}
                    </p>
                  </div>

                  <div className="border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666]">
                      Subject
                    </p>
                    <p className="m-0 mt-1 font-['Syne'] text-[18px] leading-none">
                      {selectedMessage.subject}
                    </p>
                  </div>

                  <div className="border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.1em] text-[#666]">
                      Message
                    </p>
                    <p className="m-0 mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#1f1f1f]">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void handleMarkMessageRead()}
                      disabled={isActingOnMessage}
                      className="border-2 border-[#111111] bg-[#9dff00] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                    >
                      {isActingOnMessage ? "Saving..." : "Mark Read"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleArchiveMessage()}
                      disabled={isActingOnMessage}
                      className="border-2 border-[#111111] bg-[#ffd9d9] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                    >
                      {isActingOnMessage ? "Saving..." : "Archive"}
                    </button>
                    <a
                      href={`mailto:${selectedMessage.senderEmail}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                      className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#ffb0dd] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] text-[#111111] no-underline shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              ) : (
                <p className="m-0 text-sm text-[#555]">
                  Select a message to view details.
                </p>
              )}
            </article>
          </section>
        ) : activeTab === "projects" ? (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.45fr]">
            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="m-0 font-['Syne'] text-[26px] leading-none">
                  Projects
                </h2>
                <button
                  type="button"
                  onClick={handleCreateProjectNew}
                  className="border-2 border-[#111111] bg-[#f5d44f] px-3 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
                >
                  New Project
                </button>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_150px]">
                <input
                  type="search"
                  value={projectSearch}
                  onChange={(event) => setProjectSearch(event.target.value)}
                  placeholder="Search projects by title or summary"
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
                />
                <select
                  value={projectStatusFilter}
                  onChange={(event) =>
                    setProjectStatusFilter(event.target.value as FilterStatus)
                  }
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All statuses</option>
                  {projectStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
                Showing {filteredProjects.length} of {projects.length}
              </p>

              <div className="max-h-[66vh] space-y-2 overflow-y-auto pr-1">
                {isProjectsLoading ? (
                  <p className="text-sm">Loading projects...</p>
                ) : null}

                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full border-2 border-[#111111] px-3 py-3 text-left shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${project.id === selectedProjectId ? "bg-[#f5d44f]" : "bg-[#f9f7ef]"}`}
                  >
                    <p className="m-0 font-['Syne'] text-[18px] leading-none">
                      {project.title}
                    </p>
                    <p className="m-0 mt-1 text-xs uppercase tracking-[0.1em] text-[#555]">
                      {project.status}
                    </p>
                  </button>
                ))}

                {!isProjectsLoading && projects.length === 0 ? (
                  <p className="text-sm text-[#555]">No projects yet.</p>
                ) : null}
                {!isProjectsLoading &&
                projects.length > 0 &&
                filteredProjects.length === 0 ? (
                  <p className="text-sm text-[#555]">
                    No projects match this filter.
                  </p>
                ) : null}
              </div>
            </article>

            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              <form className="space-y-3" onSubmit={handleProjectSubmit}>
                <h3 className="m-0 font-['Syne'] text-[24px]">
                  {selectedProjectId ? "Edit Project" : "Create Project"}
                </h3>

                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(event) =>
                    handleProjectFieldChange("title", event.target.value)
                  }
                  placeholder="Title"
                  required
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <textarea
                  value={projectForm.summary ?? ""}
                  onChange={(event) =>
                    handleProjectFieldChange("summary", event.target.value)
                  }
                  placeholder="Summary"
                  rows={3}
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <textarea
                  value={projectForm.description ?? ""}
                  onChange={(event) =>
                    handleProjectFieldChange("description", event.target.value)
                  }
                  placeholder="Description"
                  rows={5}
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="url"
                    value={projectForm.projectUrl ?? ""}
                    onChange={(event) =>
                      handleProjectFieldChange("projectUrl", event.target.value)
                    }
                    placeholder="Project URL"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="url"
                    value={projectForm.liveUrl ?? ""}
                    onChange={(event) =>
                      handleProjectFieldChange("liveUrl", event.target.value)
                    }
                    placeholder="Live URL"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="url"
                    value={projectForm.repositoryUrl ?? ""}
                    onChange={(event) =>
                      handleProjectFieldChange(
                        "repositoryUrl",
                        event.target.value,
                      )
                    }
                    placeholder="Repository URL"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={projectTechInput}
                    onChange={(event) =>
                      setProjectTechInput(event.target.value)
                    }
                    placeholder="Tech stack (comma separated)"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="url"
                    value={projectForm.imageUrl ?? ""}
                    onChange={(event) =>
                      handleProjectFieldChange("imageUrl", event.target.value)
                    }
                    placeholder="Image URL fallback"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onProjectImageChange}
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={projectForm.status}
                    onChange={(event) =>
                      handleProjectFieldChange(
                        "status",
                        event.target.value as ItemStatus,
                      )
                    }
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  >
                    {projectStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={projectForm.featured}
                      onChange={(event) =>
                        handleProjectFieldChange(
                          "featured",
                          event.target.checked,
                        )
                      }
                    />
                    Featured
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSavingProject}
                    className="border-2 border-[#111111] bg-[#9dff00] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                  >
                    {isSavingProject
                      ? "Saving..."
                      : selectedProjectId
                        ? "Update Project"
                        : "Create Project"}
                  </button>

                  {selectedProjectId ? (
                    <button
                      type="button"
                      onClick={handleDeleteProject}
                      disabled={isDeletingProject}
                      className="border-2 border-[#111111] bg-[#ffd9d9] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                    >
                      {isDeletingProject ? "Deleting..." : "Delete Project"}
                    </button>
                  ) : null}
                </div>
              </form>
            </article>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1fr_1.45fr]">
            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="m-0 font-['Syne'] text-[26px] leading-none">
                  Blogs
                </h2>
                <button
                  type="button"
                  onClick={handleCreateBlogNew}
                  className="border-2 border-[#111111] bg-[#f5d44f] px-3 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px"
                >
                  New Blog
                </button>
              </div>

              <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_150px]">
                <input
                  type="search"
                  value={blogSearch}
                  onChange={(event) => setBlogSearch(event.target.value)}
                  placeholder="Search blogs by title or summary"
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
                />
                <select
                  value={blogStatusFilter}
                  onChange={(event) =>
                    setBlogStatusFilter(event.target.value as FilterStatus)
                  }
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none"
                >
                  <option value="all">All statuses</option>
                  {blogStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[#555]">
                Showing {filteredBlogs.length} of {blogs.length}
              </p>

              <div className="max-h-[66vh] space-y-2 overflow-y-auto pr-1">
                {isBlogsLoading ? (
                  <p className="text-sm">Loading blogs...</p>
                ) : null}

                {filteredBlogs.map((blog) => (
                  <button
                    key={blog.id}
                    type="button"
                    onClick={() => setSelectedBlogId(blog.id)}
                    className={`w-full border-2 border-[#111111] px-3 py-3 text-left shadow-[3px_3px_0_#111111] transition hover:-translate-y-px ${blog.id === selectedBlogId ? "bg-[#9fd5f8]" : "bg-[#f9f7ef]"}`}
                  >
                    <p className="m-0 font-['Syne'] text-[18px] leading-none">
                      {blog.title}
                    </p>
                    <p className="m-0 mt-1 text-xs uppercase tracking-[0.1em] text-[#555]">
                      {blog.status}
                    </p>
                  </button>
                ))}

                {!isBlogsLoading && blogs.length === 0 ? (
                  <p className="text-sm text-[#555]">No blogs yet.</p>
                ) : null}
                {!isBlogsLoading &&
                blogs.length > 0 &&
                filteredBlogs.length === 0 ? (
                  <p className="text-sm text-[#555]">
                    No blogs match this filter.
                  </p>
                ) : null}
              </div>
            </article>

            <article className="border-2 border-[#111111] bg-white p-4 shadow-[5px_5px_0_#9f9f9f] sm:p-5">
              <form className="space-y-3" onSubmit={handleBlogSubmit}>
                <h3 className="m-0 font-['Syne'] text-[24px]">
                  {selectedBlogId ? "Edit Blog" : "Create Blog"}
                </h3>

                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(event) =>
                    handleBlogFieldChange("title", event.target.value)
                  }
                  placeholder="Title"
                  required
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <textarea
                  value={blogForm.summary ?? ""}
                  onChange={(event) =>
                    handleBlogFieldChange("summary", event.target.value)
                  }
                  placeholder="Summary"
                  rows={3}
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <textarea
                  value={blogForm.contentMarkdown ?? ""}
                  onChange={(event) =>
                    handleBlogFieldChange("contentMarkdown", event.target.value)
                  }
                  placeholder="Content Markdown"
                  rows={8}
                  className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="url"
                    value={blogForm.href ?? ""}
                    onChange={(event) =>
                      handleBlogFieldChange("href", event.target.value)
                    }
                    placeholder="External Href"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={blogForm.category ?? ""}
                    onChange={(event) =>
                      handleBlogFieldChange("category", event.target.value)
                    }
                    placeholder="Category"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="text"
                    value={blogTagsInput}
                    onChange={(event) => setBlogTagsInput(event.target.value)}
                    placeholder="Tags (comma separated)"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="url"
                    value={blogForm.coverImageUrl ?? ""}
                    onChange={(event) =>
                      handleBlogFieldChange("coverImageUrl", event.target.value)
                    }
                    placeholder="Cover image URL fallback"
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onBlogImageChange}
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2 text-sm outline-none sm:col-span-2"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <select
                    value={blogForm.status}
                    onChange={(event) =>
                      handleBlogFieldChange(
                        "status",
                        event.target.value as ItemStatus,
                      )
                    }
                    className="w-full border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm outline-none"
                  >
                    {blogStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 border-2 border-[#111111] bg-[#f9f7ef] px-3 py-2.5 text-sm">
                    <input
                      type="checkbox"
                      checked={blogForm.featured}
                      onChange={(event) =>
                        handleBlogFieldChange("featured", event.target.checked)
                      }
                    />
                    Featured
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={isSavingBlog}
                    className="border-2 border-[#111111] bg-[#9fd5f8] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                  >
                    {isSavingBlog
                      ? "Saving..."
                      : selectedBlogId
                        ? "Update Blog"
                        : "Create Blog"}
                  </button>

                  {selectedBlogId ? (
                    <button
                      type="button"
                      onClick={handleDeleteBlog}
                      disabled={isDeletingBlog}
                      className="border-2 border-[#111111] bg-[#ffd9d9] px-4 py-2 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.14em] shadow-[3px_3px_0_#111111] transition hover:-translate-y-px disabled:opacity-60"
                    >
                      {isDeletingBlog ? "Deleting..." : "Delete Blog"}
                    </button>
                  ) : null}
                </div>
              </form>
            </article>
          </section>
        )}
      </div>

      {toastMessage ? (
        <div className="fixed bottom-4 right-4 z-50 w-[min(92vw,420px)] border-2 border-[#111111] bg-white p-3 shadow-[4px_4px_0_#111111]">
          <p
            className={`m-0 font-['Syne'] text-[13px] font-bold ${
              toastTone === "success"
                ? "text-[#1a5e1a]"
                : toastTone === "error"
                  ? "text-[#8f1d1d]"
                  : "text-[#5f4a00]"
            }`}
          >
            {toastMessage}
          </p>

          {pendingDelete ? (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="border-2 border-[#111111] bg-[#9dff00] px-3 py-1.5 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] shadow-[2px_2px_0_#111111]"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="border-2 border-[#111111] bg-white px-3 py-1.5 font-['Syne'] text-xs font-extrabold uppercase tracking-[0.12em] shadow-[2px_2px_0_#111111]"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}

export default AdminDashboardPage;
