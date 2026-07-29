import ChatWidget from '../components/ChatWidget';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">Ornitech Next.js Frontend</h1>
      <ChatWidget />
    </div>
  );
}
