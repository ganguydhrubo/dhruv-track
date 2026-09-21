import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BehavioralPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Behavioral Observations</h1>
        <Button asChild>
          <Link href="/behavioral/new">New Observation</Link>
        </Button>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Behavior Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Result</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Employee</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">2023-10-25</td>
              <td className="p-4 align-middle">Retail Outlet A</td>
              <td className="p-4 align-middle font-medium">PPE Compliance</td>
              <td className="p-4 align-middle">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">COMPLIANT</span>
              </td>
              <td className="p-4 align-middle">Jane Smith</td>
            </tr>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle">2023-10-26</td>
              <td className="p-4 align-middle">LPG Plant B</td>
              <td className="p-4 align-middle font-medium">Following SOP</td>
              <td className="p-4 align-middle">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">NON_COMPLIANT</span>
              </td>
              <td className="p-4 align-middle">Unknown</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
