export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl text-red-600">{message}</div>
    </div>
  );
}
