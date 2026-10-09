export function AnimationCaption({ caption }: { caption: string }) {
  return (
    <p className="border-t border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground" aria-live="polite">
      {caption}
    </p>
  );
}
