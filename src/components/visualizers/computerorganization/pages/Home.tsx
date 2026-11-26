'use client';

export interface ComputerOrganizationHomeProps {
  basePath?: string;
}

// Placeholder landing view; replaced by the full implementation in a later task.
export function ComputerOrganizationHome({ basePath }: ComputerOrganizationHomeProps) {
  return <main className="co-root">Computer Organization home {basePath}</main>;
}
