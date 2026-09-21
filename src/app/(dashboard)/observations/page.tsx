export default function ObservationsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Safety Observations</h1>
        <a href="/observations/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          New Observation
        </a>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">Unsafe Acts</div>
          <div className="text-2xl font-bold">12</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">Unsafe Conditions</div>
          <div className="text-2xl font-bold">8</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
          <div className="text-sm font-medium text-muted-foreground">Near Misses</div>
          <div className="text-2xl font-bold">3</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow p-4 bg-destructive/10">
          <div className="text-sm font-medium text-destructive">Critical Priority</div>
          <div className="text-2xl font-bold text-destructive">2</div>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Severity</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">2023-10-25</td>
              <td className="p-4 align-middle">UNSAFE_CONDITION</td>
              <td className="p-4 align-middle">Retail Outlet A</td>
              <td className="p-4 align-middle">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800">MEDIUM</span>
              </td>
              <td className="p-4 align-middle max-w-[300px] truncate">Spill in aisle 3 not cleaned up promptly.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
