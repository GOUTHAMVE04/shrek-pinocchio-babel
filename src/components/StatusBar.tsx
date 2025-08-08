const StatusBar = ({ status }: { status: string }) => {
  return (
    <aside aria-live="polite" className="container mx-auto px-4 mt-4">
      <div className="text-xs text-muted-foreground">{status}</div>
    </aside>
  );
};

export default StatusBar;
