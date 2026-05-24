"use client";

import React, { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { KeyRound, Pencil, Plus, Trash2, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Select from "@/components/ui/Select";
import userService from "@/services/userService";
import { IUser, UserFormData } from "@/types";

type TeamFormState = UserFormData & {
  skillsText: string;
};

type CreatedCredential = {
  name: string;
  email: string;
  role: IUser["role"];
  temporaryPassword: string;
};

type ApiErrorBody = {
  message?: string;
};

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
];

const createEmptyForm = (): TeamFormState => ({
  name: "",
  email: "",
  password: "",
  role: "Member",
  department: "",
  skills: [],
  skillsText: "",
});

const parseSkills = (value: string) =>
  value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

const generateTestPassword = () => {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";

  if (typeof window !== "undefined" && window.crypto) {
    const values = new Uint32Array(10);
    window.crypto.getRandomValues(values);
    return `Test@${Array.from(values, (value) => characters[value % characters.length]).join("")}1`;
  }

  return `Test@${Math.random().toString(36).slice(2, 10)}1`;
};

const getRoleVariant = (role: IUser["role"]) => {
  if (role === "Admin") return "danger";
  return "info";
};

export default function TeamPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<TeamFormState>(createEmptyForm);
  const [createdCredential, setCreatedCredential] = useState<CreatedCredential | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");

    try {
      setUsers(await userService.getUsers());
    } catch (fetchError) {
      setError(getErrorMessage(fetchError, "Failed to fetch team members."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreateForm = () => {
    setEditingUser(null);
    setForm(createEmptyForm());
    setError("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  const openEditForm = (member: IUser) => {
    setEditingUser(member);
    setForm({
      name: member.name,
      email: member.email,
      password: "",
      role: member.role,
      department: member.department || "",
      skills: member.skills || [],
      skillsText: (member.skills || []).join(", "),
    });
    setError("");
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingUser(null);
    setForm(createEmptyForm());
  };

  const handleGeneratePassword = () => {
    setForm((current) => ({
      ...current,
      password: generateTestPassword(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!editingUser && !form.password?.trim()) {
      setError("Generate or enter a temporary password for the new team member.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    const payload: UserFormData = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department?.trim(),
      skills: parseSkills(form.skillsText),
    };

    if (!editingUser) {
      payload.password = form.password?.trim();
    }

    try {
      if (editingUser) {
        await userService.updateUser(editingUser._id, payload);
        setSuccessMessage("Team member updated.");
      } else {
        await userService.createUser(payload);
        setCreatedCredential({
          name: payload.name,
          email: payload.email,
          role: payload.role,
          temporaryPassword: payload.password || "",
        });
        setSuccessMessage("Team member created. Share the test credentials manually.");
      }

      setIsFormOpen(false);
      setEditingUser(null);
      setForm(createEmptyForm());
      await fetchUsers();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Failed to save team member."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    setError("");
    setSuccessMessage("");

    try {
      await userService.deleteUser(id);
      await fetchUsers();
      setSuccessMessage("Team member deleted.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Failed to delete team member."));
    }
  };

  const renderSkills = (skills?: string[]) => {
    if (!skills?.length) {
      return <span className="text-sm text-slate-500">No skills added</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
          >
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const renderActions = (member: IUser) => (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0"
        onClick={() => openEditForm(member)}
        title="Edit team member"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        onClick={() => handleDelete(member._id)}
        title="Delete team member"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <DashboardLayout allowedRoles={["Admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Team & Roles</h1>
            <p className="mt-1 text-sm text-slate-500">Manage admins and members</p>
          </div>
          <Button className="gap-2" onClick={openCreateForm}>
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        </div>

        <Card className="border-indigo-100 bg-indigo-50/50">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-white text-indigo-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-950">Test Credentials</h2>
              <p className="mt-1 text-sm text-slate-600">
                Create a team member with a temporary password and share it manually.
              </p>
            </div>
          </div>
        </Card>

        {successMessage && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        )}

        {createdCredential && (
          <Card className="border-emerald-200 bg-white">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">Temporary Test Credentials</h2>
                <p className="mt-1 text-sm text-slate-500">Only shown now. Share them manually with the team member.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => setCreatedCredential(null)}>
                Dismiss
              </Button>
            </div>
            <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Name</p>
                <p className="mt-1 font-medium text-slate-900">{createdCredential.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Email</p>
                <p className="mt-1 break-all font-medium text-slate-900">{createdCredential.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Role</p>
                <div className="mt-1">
                  <Badge variant={getRoleVariant(createdCredential.role)}>{createdCredential.role}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Temporary Password</p>
                <p className="mt-1 break-all rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-slate-900">
                  {createdCredential.temporaryPassword}
                </p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200/60 bg-white py-24 shadow-sm">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <Card className="py-12 text-center">
            <h2 className="text-base font-semibold text-slate-950">No team members yet</h2>
            <p className="mt-2 text-sm text-slate-500">Add a team member to start managing roles and skills.</p>
          </Card>
        ) : (
          <>
            <div className="hidden overflow-x-auto rounded-xl border border-slate-200/60 bg-white shadow-sm lg:block">
              <table className="w-full min-w-[980px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Department</th>
                    <th className="px-5 py-4">Skills</th>
                    <th className="px-5 py-4">Test Credentials</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {users.map((member) => (
                    <tr key={member._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600">
                            {member.name ? member.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                          </div>
                          <span className="font-semibold text-slate-950">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{member.email}</td>
                      <td className="px-5 py-4">
                        <Badge variant={getRoleVariant(member.role)}>{member.role}</Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{member.department || "Not assigned"}</td>
                      <td className="px-5 py-4">{renderSkills(member.skills)}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">Shown after creation only</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">{renderActions(member)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 lg:hidden">
              {users.map((member) => (
                <Card key={member._id} className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600">
                        {member.name ? member.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-950">{member.name}</h2>
                        <p className="break-all text-sm text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleVariant(member.role)}>{member.role}</Badge>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Department</p>
                      <p className="mt-1 text-slate-700">{member.department || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Skills</p>
                      <div className="mt-1">{renderSkills(member.skills)}</div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Test Credentials</p>
                      <p className="mt-1 text-slate-500">Shown after creation only</p>
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-4">{renderActions(member)}</div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <Card className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-slate-200 bg-white">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-950">
                {editingUser ? "Edit Team Member" : "Add Team Member"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingUser
                  ? "Update role, department, and skills for this team member."
                  : "Create test credentials that can be shared manually."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Name *"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  disabled={isSaving}
                />
                <Input
                  label="Email *"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  disabled={isSaving}
                />
                <Select
                  label="Role *"
                  value={form.role}
                  onChange={(event) => setForm({ ...form, role: event.target.value as IUser["role"] })}
                  disabled={isSaving}
                  options={roleOptions}
                />
                <Input
                  label="Department"
                  value={form.department || ""}
                  onChange={(event) => setForm({ ...form, department: event.target.value })}
                  disabled={isSaving}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Skills"
                    placeholder="React, Next.js, MongoDB"
                    value={form.skillsText}
                    onChange={(event) => setForm({ ...form, skillsText: event.target.value })}
                    disabled={isSaving}
                  />
                </div>

                {!editingUser && (
                  <div className="md:col-span-2">
                    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-end">
                      <div className="flex-1">
                        <Input
                          label="Temporary Password *"
                          type="text"
                          value={form.password || ""}
                          onChange={(event) => setForm({ ...form, password: event.target.value })}
                          disabled={isSaving}
                        />
                      </div>
                      <Button type="button" variant="outline" onClick={handleGeneratePassword} disabled={isSaving}>
                        Generate Test Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" onClick={closeForm} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  {editingUser ? "Save Changes" : "Create Team Member"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
