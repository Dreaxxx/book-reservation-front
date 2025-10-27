export function SuccessDiv({ message }: { message: string | null }) {
    if (!message) return null;
    return (
        <div style={{ background: '#e6ffed', border: '1px solid #a3f3b1', color: '#006400', padding: 8, borderRadius: 8 }}>
            ✅ {message}
        </div>
    );
}