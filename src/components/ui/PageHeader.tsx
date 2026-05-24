import React from "react";
import { PageSubtitle, PageTitle } from "./Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <PageTitle>{title}</PageTitle>
        {description && <PageSubtitle>{description}</PageSubtitle>}
      </div>
      {action}
    </div>
  );
}

export type { PageHeaderProps };
