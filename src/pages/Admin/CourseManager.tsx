import { FormEvent, useEffect, useMemo, useState } from 'react';
import { FileText, Pencil, Plus, Trash2, Video, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentFormState, CourseFormState, ManagedCourse } from '../../types/courseManager';
import {
  createCourse,
  createCourseContent,
  deleteCourse,
  deleteCourseContent,
  getManagedCourses,
  updateCourse,
  updateCourseContent,
} from '../../utils/courseManagerStorage';
import { isAdminSessionActive } from '../../utils/adminSession';
import { getAuthUser } from '../../utils/rbacAuth';

const INITIAL_COURSE_FORM: CourseFormState = {
  title: '',
  description: '',
  category: '',
  thumbnailUrl: '',
};

const INITIAL_CONTENT_FORM: ContentFormState = {
  type: 'video',
  title: '',
  url: '',
  topic: '',
};

const inputCls =
  'rounded-xl border border-[var(--border-default)] bg-[var(--bg-input)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:ring-2 focus:ring-indigo-500/30';

export const CourseManager = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ManagedCourse[]>(() => getManagedCourses());
  const [courseForm, setCourseForm] = useState<CourseFormState>(INITIAL_COURSE_FORM);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [contentForm, setContentForm] = useState<ContentFormState>(INITIAL_CONTENT_FORM);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);

  useEffect(() => {
    const ok = isAdminSessionActive() || getAuthUser()?.role === 'admin';
    if (!ok) {
      navigate('/admin-login', { replace: true });
    }
  }, [navigate]);

  const selectedCourse = useMemo(
    () => courses.find((course) => course.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );

  const handleCourseSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedCourses = editingCourseId
      ? updateCourse(editingCourseId, courseForm)
      : [createCourse(courseForm), ...courses];

    setCourses(updatedCourses);
    setCourseForm(INITIAL_COURSE_FORM);
    setEditingCourseId(null);
  };

  const handleCourseEdit = (course: ManagedCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnailUrl: course.thumbnailUrl,
    });
  };

  const handleCourseDelete = (courseId: string) => {
    const updatedCourses = deleteCourse(courseId);
    setCourses(updatedCourses);
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
  };

  const openContentModal = (courseId: string, item?: ContentFormState & { id: string }) => {
    setSelectedCourseId(courseId);

    if (!item) {
      setContentForm(INITIAL_CONTENT_FORM);
      setEditingContentId(null);
      return;
    }

    setEditingContentId(item.id);
    setContentForm({
      type: item.type,
      title: item.title,
      url: item.url,
      topic: item.topic,
    });
  };

  const handleContentSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCourseId) {
      return;
    }

    const updatedCourses = editingContentId
      ? updateCourseContent(selectedCourseId, editingContentId, contentForm)
      : createCourseContent(selectedCourseId, contentForm);

    setCourses(updatedCourses);
    setContentForm(INITIAL_CONTENT_FORM);
    setEditingContentId(null);
    setSelectedCourseId(null);
  };

  const handleDeleteContent = (courseId: string, contentId: string) => {
    setCourses(deleteCourseContent(courseId, contentId));
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      <header>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Course Manager</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Create, edit and organize courses, videos and documents.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 text-lg font-bold">
          {editingCourseId ? 'Edit Course' : 'Add New Course'}
        </h2>
        <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input
            className={inputCls}
            placeholder="Course Title"
            required
            value={courseForm.title}
            onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Course Category"
            required
            value={courseForm.category}
            onChange={(event) => setCourseForm({ ...courseForm, category: event.target.value })}
          />
          <input
            className={`${inputCls} md:col-span-2`}
            placeholder="Thumbnail Image URL"
            required
            value={courseForm.thumbnailUrl}
            onChange={(event) => setCourseForm({ ...courseForm, thumbnailUrl: event.target.value })}
          />
          <textarea
            className={`${inputCls} min-h-[90px] md:col-span-2`}
            placeholder="Course Description"
            required
            value={courseForm.description}
            onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })}
          />
          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
            >
              {editingCourseId ? 'Update Course' : 'Add Course'}
            </button>
            {editingCourseId && (
              <button
                type="button"
                onClick={() => {
                  setEditingCourseId(null);
                  setCourseForm(INITIAL_COURSE_FORM);
                }}
                className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] px-4 py-2 font-semibold text-[var(--text-secondary)]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Course Dashboard</h2>
        {courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-10 text-center text-sm text-[var(--text-muted)]">
            No courses yet. Add your first course above.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {courses.map((course) => {
              const videoCount = course.content.filter((item) => item.type === 'video').length;
              const documentCount = course.content.filter((item) => item.type === 'document').length;
              const groupedTopics = course.content.reduce<
                Record<string, typeof course.content>
              >((acc, item) => {
                const key = item.topic || 'General';
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(item);
                return acc;
              }, {});

              return (
                <article
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]"
                >
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-44 w-full object-cover bg-[var(--bg-elevated)]"
                  />
                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-[var(--text-primary)]">
                          {course.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)]">{course.category}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => handleCourseEdit(course)}
                          className="rounded-lg bg-amber-500/15 px-3 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300"
                        >
                          <Pencil className="mr-1 inline h-4 w-4" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCourseDelete(course.id)}
                          className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300"
                        >
                          <Trash2 className="mr-1 inline h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-[var(--text-secondary)]">{course.description}</p>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-indigo-700 dark:text-indigo-300">
                        {videoCount} Videos
                      </span>
                      <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-cyan-700 dark:text-cyan-300">
                        {documentCount} Documents
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openContentModal(course.id)}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                      <Plus className="h-4 w-4" /> Add Video / Document
                    </button>

                    <div className="space-y-3">
                      {Object.entries(groupedTopics).map(([topic, topicItems]) => (
                        <div
                          key={topic}
                          className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)]/60 p-3"
                        >
                          <h4 className="font-semibold text-[var(--text-primary)]">{topic}</h4>
                          <ul className="mt-2 space-y-2">
                            {topicItems.map((item) => (
                              <li
                                key={item.id}
                                className="flex items-center justify-between gap-2 text-sm"
                              >
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                  {item.type === 'video' ? (
                                    <Video className="h-4 w-4" />
                                  ) : (
                                    <FileText className="h-4 w-4" />
                                  )}
                                  {item.title}
                                </a>
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => openContentModal(course.id, item)}
                                    className="rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-2 py-1 text-[var(--text-secondary)]"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteContent(course.id, item.id)}
                                    className="rounded-md border border-[var(--border-default)] bg-[var(--bg-card)] px-2 py-1 text-rose-600 dark:text-rose-400"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5 text-[var(--text-primary)] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editingContentId
                  ? 'Edit Content'
                  : `Add Content to ${selectedCourse.title}`}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourseId(null);
                  setEditingContentId(null);
                  setContentForm(INITIAL_CONTENT_FORM);
                }}
                className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="space-y-3">
              <select
                className={`w-full ${inputCls}`}
                value={contentForm.type}
                onChange={(event) =>
                  setContentForm({
                    ...contentForm,
                    type: event.target.value as ContentFormState['type'],
                  })
                }
              >
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
              <input
                className={`w-full ${inputCls}`}
                placeholder={contentForm.type === 'video' ? 'Video Title' : 'Document Title'}
                required
                value={contentForm.title}
                onChange={(event) => setContentForm({ ...contentForm, title: event.target.value })}
              />
              <input
                className={`w-full ${inputCls}`}
                placeholder={contentForm.type === 'video' ? 'Video URL' : 'PDF / Drive Link'}
                required
                value={contentForm.url}
                onChange={(event) => setContentForm({ ...contentForm, url: event.target.value })}
              />
              <input
                className={`w-full ${inputCls}`}
                placeholder="Topic Name (e.g. Arrays)"
                required
                value={contentForm.topic}
                onChange={(event) => setContentForm({ ...contentForm, topic: event.target.value })}
              />
              <button
                className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500"
                type="submit"
              >
                {editingContentId ? 'Update Content' : 'Save Content'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
