"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { IProject } from "@/types";

interface ProjectFormProps {
  initialData?: Partial<IProject>;
  onSubmit: (data: Partial<IProject>) => void;
  isLoading: boolean;
  onCancel: () => void;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState(0);
  const [status, setStatus] = useState("planned");
  const [thumbnail, setThumbnail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setClient(initialData.client || "");
      setDescription(initialData.description || "");
      
      // Formatting date strings to YYYY-MM-DD for date input
      if (initialData.startDate) {
        setStartDate(new Date(initialData.startDate).toISOString().split("T")[0]);
      }
      if (initialData.endDate) {
        setEndDate(new Date(initialData.endDate).toISOString().split("T")[0]);
      }
      
      setBudget(initialData.budget || 0);
      setStatus(initialData.status || "planned");
      setThumbnail(initialData.thumbnail || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !description || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }

    setError("");
    onSubmit({
      title,
      client,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      budget: Number(budget),
      status: status as any,
      thumbnail: thumbnail || undefined,
    });
  };

  const statusOptions = [
    { value: "planned", label: "Planned" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium animate-in fade-in-50">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Project Title *"
          placeholder="e.g. Website Redesign"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          label="Client Name *"
          placeholder="e.g. Acme Corp"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <Textarea
        label="Description *"
        placeholder="Provide brief details about the project scope..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isLoading}
        rows={4}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date *"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          label="End Date *"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Budget ($)"
          type="number"
          placeholder="0"
          value={budget || ""}
          onChange={(e) => setBudget(Number(e.target.value))}
          disabled={isLoading}
          min={0}
        />
        <Select
          label="Status *"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Input
        label="Thumbnail Image URL"
        placeholder="https://images.unsplash.com/photo-..."
        value={thumbnail}
        onChange={(e) => setThumbnail(e.target.value)}
        disabled={isLoading}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Save Changes" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
export type { ProjectFormProps };
