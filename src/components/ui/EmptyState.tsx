import React from "react";
import Card from "./Card";
import { MutedText, SectionTitle } from "./Typography";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-10 text-center">
      <SectionTitle>{title}</SectionTitle>
      {description && <MutedText className="mt-2">{description}</MutedText>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Card>
  );
}

export type { EmptyStateProps };
