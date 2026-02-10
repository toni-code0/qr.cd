import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function StaticPage({ title, content }: { title: string; content: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-800 p-8 flex items-center justify-center font-display">
      <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border-white/20 text-white rounded-3xl overflow-hidden">
        <CardContent className="p-10">
          <Link href="/">
            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 uppercase tracking-widest text-xs font-bold">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </Link>
          <h1 className="text-4xl font-black mb-6 uppercase tracking-tight">{title}</h1>
          <div className="prose prose-invert max-w-none opacity-80 leading-relaxed">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
