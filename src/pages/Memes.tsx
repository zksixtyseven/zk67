import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MatrixRain } from '@/components/MatrixRain';
import { Card } from '@/components/ui/card';
import { Loader2, Twitter, Github } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
interface Meme {
  id: string;
  image_url: string;
  created_at: string;
}
const Memes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchMemes();

    // Subscribe to real-time updates
    const channel = supabase.channel('memes-changes').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'memes'
    }, payload => {
      setMemes(prev => [payload.new as Meme, ...prev]);
    }).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const fetchMemes = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('memes').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setMemes(data || []);
    } catch (error) {
      console.error('Error fetching memes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background relative">
      <MatrixRain />
      <div className="relative z-10 p-4 md:p-8">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-4 z-10">
          <a href="https://x.com/ZK67_SOL" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm">
            <Twitter className="h-4 w-4" />
            <span>X / Twitter</span>
          </a>
          <a href="https://github.com/zksixtyseven/zk67" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm">
            <Github className="h-4 w-4" />
            <span>Github</span>
          </a>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <NavLink to="/">← Back to Terminal</NavLink>
              <h1 className="text-4xl font-bold text-primary font-mono terminal-glow">
                67 GALLERY
              </h1>
            </div>
            <NavLink to="/verifier">Verifier</NavLink>
          </div>

          <Card className="bg-card border-primary/30 terminal-glow p-6">
            {isLoading ? <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> : memes.length === 0 ? <div className="text-center py-12">
                <p className="text-muted-foreground font-mono">
                  No memes generated yet. Solve equations that equal 67 in the terminal to create memes!
                </p>
              </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memes.map(meme => <Card key={meme.id} className="bg-muted/50 border-primary/20 overflow-hidden hover:border-primary/40 transition-colors">
                    <img src={meme.image_url} alt="Generated meme" className="w-full h-64 object-cover" />
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground font-mono">
                        {new Date(meme.created_at).toLocaleString()}
                      </p>
                    </div>
                  </Card>)}
              </div>}
          </Card>
        </div>
      </div>
    </div>;
};
export default Memes;