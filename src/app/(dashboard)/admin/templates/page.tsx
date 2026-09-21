import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplatesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Inspection Templates</h1>
        <Button asChild>
          <Link href="/admin/templates/new">New Template</Link>
        </Button>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Division Type</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Questions Count</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle font-medium">Retail Safety Monthly</td>
              <td className="p-4 align-middle">SAFETY</td>
              <td className="p-4 align-middle">RETAIL</td>
              <td className="p-4 align-middle">15</td>
              <td className="p-4 align-middle">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <td className="p-4 align-middle font-medium">LPG Plant Audit</td>
              <td className="p-4 align-middle">AUDIT</td>
              <td className="p-4 align-middle">LPG</td>
              <td className="p-4 align-middle">42</td>
              <td className="p-4 align-middle">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
