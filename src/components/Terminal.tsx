import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { generateProof, verifyProof, evaluateEquation, ZKProof } from '@/utils/zkProof';
import { Loader2, CheckCircle2, XCircle, Sparkles, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import terminalLogo from '@/assets/zk-67-terminal-logo.png';
interface Message {
  type: 'system' | 'equation' | 'proof' | 'verification';
  content: string;
  timestamp: Date;
  proof?: ZKProof;
  verified?: boolean;
  isGenerating?: boolean;
}
export const Terminal = () => {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'system',
    content: '> ZK-SNARK Equation Terminal v1.0',
    timestamp: new Date()
  }, {
    type: 'system',
    content: '> Connected to Lovable AI',
    timestamp: new Date()
  }, {
    type: 'system',
    content: '> Type "generate" to create a new equation or enter your own equation',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  const generateEquation = async () => {
    setIsLoading(true);
    addMessage({
      type: 'system',
      content: '> Generating equation...',
      timestamp: new Date(),
      isGenerating: true
    });
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-equation', {
        body: {}
      });
      if (error) throw error;
      const equation = data.equation;
      addMessage({
        type: 'equation',
        content: `${equation} = 67`,
        timestamp: new Date()
      });

      // Verify the equation
      const result = evaluateEquation(equation);
      if (result !== 67) {
        addMessage({
          type: 'system',
          content: `⚠ Warning: Equation evaluates to ${result}, not 67`,
          timestamp: new Date()
        });
      }

      // Generate proof
      await processProof(equation);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate equation',
        variant: 'destructive'
      });
      addMessage({
        type: 'system',
        content: `✗ Error: ${error.message}`,
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };
  const processProof = async (equation: string) => {
    addMessage({
      type: 'system',
      content: '> Generating zk-SNARK proof...',
      timestamp: new Date(),
      isGenerating: true
    });
    const result = evaluateEquation(equation);
    const proof = await generateProof(equation, result);
    addMessage({
      type: 'proof',
      content: `Proof generated`,
      timestamp: new Date(),
      proof
    });
    addMessage({
      type: 'system',
      content: '> Verifying proof...',
      timestamp: new Date(),
      isGenerating: true
    });
    const isValid = await verifyProof(proof, 67);
    addMessage({
      type: 'verification',
      content: isValid ? 'Proof VERIFIED ✓' : 'Proof INVALID ✗',
      timestamp: new Date(),
      verified: isValid
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const userInput = input.trim();
    setInput('');
    addMessage({
      type: 'system',
      content: `> ${userInput}`,
      timestamp: new Date()
    });
    if (userInput.toLowerCase() === 'generate') {
      await generateEquation();
    } else {
      // User provided equation
      const result = evaluateEquation(userInput);
      addMessage({
        type: 'equation',
        content: `${userInput} = ${result}`,
        timestamp: new Date()
      });
      if (result === 67) {
        setIsLoading(true);
        await processProof(userInput);
        setIsLoading(false);
      } else {
        addMessage({
          type: 'system',
          content: `✗ Equation does not equal 67 (result: ${result})`,
          timestamp: new Date()
        });
      }
    }
  };
  return <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
            <img src={terminalLogo} alt="zK-67 TERMINAL" className="h-30 ml-4" />
          </div>
          <a 
            href="https://x.com/zksixtyseven" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-md transition-colors group"
          >
            <Twitter className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-primary font-mono text-sm">@zksixtyseven</span>
          </a>
        </div>

        <Card className="bg-card border-primary/30 terminal-glow">
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
            {messages.map((msg, idx) => <div key={idx} className="space-y-2">
                {msg.type === 'system' && <div className="flex items-center gap-2">
                    {msg.isGenerating && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                    <p className="text-muted-foreground font-mono text-sm">
                      {msg.content}
                    </p>
                  </div>}
                
                {msg.type === 'equation' && <div className="p-4 bg-muted/50 rounded border border-primary/30">
                    <p className="text-primary font-mono text-lg font-bold">
                      {msg.content}
                    </p>
                  </div>}

                {msg.type === 'proof' && msg.proof && <div className="p-4 bg-card rounded border border-accent/30 space-y-2">
                    <div className="flex items-center gap-2 text-accent">
                      <Sparkles className="h-4 w-4" />
                      <p className="font-mono text-sm font-bold">ZK-SNARK PROOF</p>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground space-y-1">
                      <p>π_a: {msg.proof.pi_a[0].substring(0, 16)}...</p>
                      <p>π_b: {msg.proof.pi_b[0][0].substring(0, 16)}...</p>
                      <p>π_c: {msg.proof.pi_c[0].substring(0, 16)}...</p>
                      <p>Public: [{msg.proof.publicSignals.join(', ')}]</p>
                    </div>
                  </div>}

                {msg.type === 'verification' && <div className={`p-4 rounded border flex items-center gap-3 ${msg.verified ? 'bg-secondary/10 border-secondary success-glow' : 'bg-destructive/10 border-destructive'}`}>
                    {msg.verified ? <CheckCircle2 className="h-6 w-6 text-secondary" /> : <XCircle className="h-6 w-6 text-destructive" />}
                    <p className={`font-mono text-lg font-bold ${msg.verified ? 'text-secondary' : 'text-destructive'}`}>
                      {msg.content}
                    </p>
                  </div>}
              </div>)}
            <div ref={messagesEndRef} />
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder='Type "generate" or enter equation...' className="flex-1 bg-input border-primary/30 text-foreground font-mono focus:ring-primary" disabled={isLoading} />
          <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono terminal-glow">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'EXECUTE'}
          </Button>
        </form>

        <div className="text-center text-muted-foreground text-xs font-mono space-y-1">
          <p>Commands: "generate" | Custom equation</p>
          <p>All equations must equal 67 to generate valid proofs</p>
        </div>
      </div>
    </div>;
};