export function ErrorDiv({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      style={{
        background: '#ffe9e9',
        border: '1px solid #f5bcbc',
        color: '#a40000',
        padding: 8,
        borderRadius: 8,
      }}
    >
      ❌ Une erreur c'est produite : {message}
    </div>
  );
}
