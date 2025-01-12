export function Debug({ children }: { children: any }) {
  return <pre className="text-xs">{JSON.stringify(children, null, 2)}</pre>;
}
