import ImageApp from "@/components/image-app";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">AI Image Generator</h1>
        <ImageApp />
      </div>
    </main>
  );
}
