"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

interface CommentBoxProps {
  isLoading?: boolean;
  onSubmit: (message: string) => void;
}

export default function CommentBox({ isLoading = false, onSubmit }: CommentBoxProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setError("");
    onSubmit(message.trim());
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        label="Add Comment"
        rows={3}
        value={message}
        error={error}
        onChange={(event) => setMessage(event.target.value)}
        disabled={isLoading}
      />
      <div className="flex justify-end">
        <Button type="submit" isLoading={isLoading}>Post Comment</Button>
      </div>
    </form>
  );
}
