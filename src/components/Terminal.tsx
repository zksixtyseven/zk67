import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { generateProof, verifyProof, evaluateEquation, ZKProof } from '@/utils/zkProof';
import { Loader2, CheckCircle2, XCircle, Sparkles, Copy, CheckCheck, Twitter, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import terminalLogo from '@/assets/zk-67-terminal-logo.png';
interface Message {
  type: 'system' | 'equation' | 'proof' | 'verification' | 'meme';
  content: string;
  timestamp: Date;
  proof?: ZKProof;
  verified?: boolean;
  isGenerating?: boolean;
  imageUrl?: string;
}
export const Terminal = () => {
  const [messages, setMessages] = useState<Message[]>([{
    type: 'system',
    content: '> ZK-SNARK Equation Terminal v1.0',
    timestamp: new Date()
  }, {
    type: 'system',
    content: '> Connected to 67 AI',
    timestamp: new Date()
  }, {
    type: 'system',
    content: '> Type "generate" to create a new equation or enter your own equation',
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedProof, setCopiedProof] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
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
    
    // Play sound effect if verification is successful
    if (isValid) {
      const audio = new Audio('/67-sound.mp3');
      audio.play().catch(err => console.error('Error playing sound:', err));
    }
    
    addMessage({
      type: 'verification',
      content: isValid ? 'Proof VERIFIED ✓' : 'Proof INVALID ✗',
      timestamp: new Date(),
      verified: isValid
    });

    // Generate meme image if verification is successful
    if (isValid) {
      addMessage({
        type: 'system',
        content: '> Generating victory meme...',
        timestamp: new Date(),
        isGenerating: true
      });

      try {
        const { data: memeData, error: memeError } = await supabase.functions.invoke('generate-meme', {
          body: {}
        });

        if (memeError) throw memeError;

        addMessage({
          type: 'meme',
          content: 'Victory Meme Generated!',
          timestamp: new Date(),
          imageUrl: memeData.imageUrl
        });
      } catch (error) {
        console.error('Error generating meme:', error);
        addMessage({
          type: 'system',
          content: `✗ Failed to generate meme: ${error.message}`,
          timestamp: new Date()
        });
      }
    }
  };
  const copyProofData = (proof: ZKProof, field: string) => {
    let textToCopy = '';
    if (field === 'pi_a') {
      textToCopy = JSON.stringify(proof.pi_a);
    } else if (field === 'pi_b') {
      textToCopy = JSON.stringify(proof.pi_b);
    } else if (field === 'pi_c') {
      textToCopy = JSON.stringify(proof.pi_c);
    } else if (field === 'public') {
      textToCopy = JSON.stringify(proof.publicSignals);
    } else if (field === 'all') {
      textToCopy = JSON.stringify(proof, null, 2);
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopiedProof(field);
    setTimeout(() => setCopiedProof(null), 2000);
    toast({
      title: 'Copied!',
      description: 'Proof data copied to clipboard',
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
  return <div className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
            <img src={terminalLogo} alt="zK-67 TERMINAL" className="h-30 ml-4" />
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://x.com/ZK67_SOL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/zksixtyseven/zk67"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-accent">
                        <Sparkles className="h-4 w-4" />
                        <p className="font-mono text-sm font-bold">ZK-SNARK PROOF</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyProofData(msg.proof!, 'all')}
                        className="h-8 px-2"
                      >
                        {copiedProof === 'all' ? (
                          <CheckCheck className="h-4 w-4 text-secondary" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center justify-between">
                        <p>π_a: {msg.proof.pi_a[0].substring(0, 16)}...</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyProofData(msg.proof!, 'pi_a')}
                          className="h-6 px-1"
                        >
                          {copiedProof === 'pi_a' ? (
                            <CheckCheck className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>π_b: {msg.proof.pi_b[0][0].substring(0, 16)}...</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyProofData(msg.proof!, 'pi_b')}
                          className="h-6 px-1"
                        >
                          {copiedProof === 'pi_b' ? (
                            <CheckCheck className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>π_c: {msg.proof.pi_c[0].substring(0, 16)}...</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyProofData(msg.proof!, 'pi_c')}
                          className="h-6 px-1"
                        >
                          {copiedProof === 'pi_c' ? (
                            <CheckCheck className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>Public: [{msg.proof.publicSignals.join(', ')}]</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyProofData(msg.proof!, 'public')}
                          className="h-6 px-1"
                        >
                          {copiedProof === 'public' ? (
                            <CheckCheck className="h-3 w-3 text-secondary" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>}

                {msg.type === 'verification' && <div className={`p-4 rounded border flex items-center gap-3 ${msg.verified ? 'bg-secondary/10 border-secondary success-glow' : 'bg-destructive/10 border-destructive'}`}>
                    {msg.verified ? <CheckCircle2 className="h-6 w-6 text-secondary" /> : <XCircle className="h-6 w-6 text-destructive" />}
                    <p className={`font-mono text-lg font-bold ${msg.verified ? 'text-secondary' : 'text-destructive'}`}>
                      {msg.content}
                    </p>
                  </div>}

                {msg.type === 'meme' && msg.imageUrl && <div className="p-4 bg-card rounded border border-primary/30 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <p className="font-mono text-sm font-bold">{msg.content}</p>
                    </div>
                    <img 
                      src={msg.imageUrl} 
                      alt="Victory Meme" 
                      className="w-full rounded border border-primary/20 terminal-glow"
                    />
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
          <Button
            variant="link"
            onClick={() => navigate('/verifier')}
            className="text-primary hover:text-primary/80 font-mono text-xs"
          >
            → Open Proof Verifier
          </Button>
        </div>
      </div>
    </div>;
};