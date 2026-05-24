"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface TimeLogFormProps {
  isLoading?: boolean;
  onSubmit: (data: { hours: number; note?: string; date?: string }) => void;
}

export default function TimeLogForm({ isLoading = false, onSubmit }: TimeLogFormProps) {
  const [hours, setHours] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!hours || Number(hours) <= 0) {
      setError("Hours must be greater than zero.");
      return;
    }
    setError("");
    onSubmit({ hours: Number(hours), note: note.trim() || undefined, date: date ? new Date(date).toISOString() : undefined });
    setHours("");
    setNote("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">{error}</div>}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input label="Hours" type="number" min={0.25} step={0.25} value={hours} onChange={(event) => setHours(event.target.value === "" ? "" : Number(event.target.value))} disabled={isLoading} />
        <Input label="Date" type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={isLoading} />
        <Input label="Note" value={note} onChange={(event) => setNote(event.target.value)} disabled={isLoading} />
      </div>
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>Add Time Log</Button>
      </div>
    </form>
  );
}
