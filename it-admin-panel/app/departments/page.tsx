import { getDepartments } from '@/lib/api';

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Departments</h1>
      <ul>
        {departments.map((dept: { id: number; name: string }) => (
          <li key={dept.id}>{dept.name}</li>
        ))}
      </ul>
    </div>
  );
}
