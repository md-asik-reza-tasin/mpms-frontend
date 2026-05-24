"use client";

import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ISprint, SprintFormData } from "@/types";

interface SprintFormProps {
  initialData?: ISprint | null;
  isLoading?: boolean;
  onSubmit: (data: SprintFormData) => void;
  onCancel: () => void;
}

export default function SprintForm({ initialData, isLoading = false, onSubmit, onCancel }: SprintFormProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [order, setOrder] = useState<number | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData) return;
    setTitle(initialData.title || "");
    setStartDate(initialData.startDate ? new Date(initialData.startDate).toISOString().split("T")[0] : "");
    setEndDate(initialData.endDate ? new Date(initialData.endDate).toISOString().split("T")[0] : "");
    setOrder(initialData.order ?? "");
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      setError("Title, start date, and end date are required.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date cannot be after end date.");
      return;
    }
    setError("");
    onSubmit({
      title: title.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      order: order === "" ? undefined : Number(order),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
      <Input label="Sprint Title *" value={title} onChange={(event) => setTitle(event.target.value)} disabled={isLoading} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input label="Start Date *" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} disabled={isLoading} />
        <Input label="End Date *" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} disabled={isLoading} />
        <Input label="Order" type="number" value={order} onChange={(event) => setOrder(event.target.value === "" ? "" : Number(event.target.value))} disabled={isLoading} />
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" isLoading={isLoading}>{initialData ? "Save Sprint" : "Add Sprint"}</Button>
      </div>
    </form>
  );
}
