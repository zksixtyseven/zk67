import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyProof, ZKProof } from '@/utils/zkProof';
import { CheckCircle2, XCircle, ArrowLeft, Twitter, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import terminalLogo from '@/assets/zk-67-terminal-logo.png';

const Verifier = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [piA, setPiA] = useState('');
  const [piB, setPiB] = useState('');
  const [piC, setPiC] = useState('');
  const [publicSignals, setPublicSignals] = useState('');
  const [expectedResult, setExpectedResult] = useState('67');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setVerificationResult(null);

      const proof: ZKProof = {
        pi_a: JSON.parse(piA),
        pi_b: JSON.parse(piB),
        pi_c: JSON.parse(piC),
        publicSignals: JSON.parse(publicSignals),
      };

      const result = await verifyProof(proof, parseInt(expectedResult));
      setVerificationResult(result);
      
      toast({
        title: result ? 'Proof Valid ✓' : 'Proof Invalid ✗',
        description: result 
          ? 'The zk-SNARK proof has been successfully verified!' 
          : 'The proof verification failed. Please check your inputs.',
        variant: result ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify proof. Please check your input format.',
        variant: 'destructive',
      });
      setVerificationResult(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasteAll = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const proof = JSON.parse(text);
      
      if (proof.pi_a && proof.pi_b && proof.pi_c && proof.publicSignals) {
        setPiA(JSON.stringify(proof.pi_a));
        setPiB(JSON.stringify(proof.pi_b));
        setPiC(JSON.stringify(proof.pi_c));
        setPublicSignals(JSON.stringify(proof.publicSignals));
        toast({
          title: 'Pasted!',
          description: 'Proof data has been loaded from clipboard',
        });
      } else {
        throw new Error('Invalid proof format');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to paste proof. Make sure you copied the full proof data.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Terminal
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
            <div className="h-3 w-3 rounded-full bg-secondary animate-pulse" />
            <img src={terminalLogo} alt="zK-67 TERMINAL" className="h-30 ml-4" />
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/ZK67_SOL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm"
            >
              <Twitter className="h-4 w-4" />
              <span>X / Twitter</span>
            </a>
            <a
              href="https://github.com/zksixtyseven/zk67"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-mono text-sm"
            >
              <Github className="h-4 w-4" />
              <span>Github</span>
            </a>
          </div>
        </div>

        <Card className="bg-card border-primary/30 terminal-glow p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-mono mb-2">
                ZK-SNARK PROOF VERIFIER
              </h1>
              <p className="text-muted-foreground text-sm font-mono">
                Paste proof components to verify cryptographic correctness
              </p>
            </div>

            <Button
              onClick={handlePasteAll}
              variant="outline"
              className="w-full border-primary/30 text-primary"
            >
              Paste Full Proof from Clipboard
            </Button>

            <div className="space-y-4">
              <div>
                <Label htmlFor="pi_a" className="text-primary font-mono">
                  π_a (Proof Point A)
                </Label>
                <Textarea
                  id="pi_a"
                  value={piA}
                  onChange={(e) => setPiA(e.target.value)}
                  placeholder='["0x1234...", "0x5678...", "0x9abc..."]'
                  className="font-mono text-xs bg-input border-primary/30 mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pi_b" className="text-primary font-mono">
                  π_b (Proof Point B)
                </Label>
                <Textarea
                  id="pi_b"
                  value={piB}
                  onChange={(e) => setPiB(e.target.value)}
                  placeholder='[["0x1234...", "0x5678..."], [...], [...]]'
                  className="font-mono text-xs bg-input border-primary/30 mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="pi_c" className="text-primary font-mono">
                  π_c (Proof Point C)
                </Label>
                <Textarea
                  id="pi_c"
                  value={piC}
                  onChange={(e) => setPiC(e.target.value)}
                  placeholder='["0x1234...", "0x5678...", "0x9abc..."]'
                  className="font-mono text-xs bg-input border-primary/30 mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="public" className="text-primary font-mono">
                  Public Signals
                </Label>
                <Textarea
                  id="public"
                  value={publicSignals}
                  onChange={(e) => setPublicSignals(e.target.value)}
                  placeholder='["67"]'
                  className="font-mono text-xs bg-input border-primary/30 mt-2"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="expected" className="text-primary font-mono">
                  Expected Result
                </Label>
                <Input
                  id="expected"
                  type="number"
                  value={expectedResult}
                  onChange={(e) => setExpectedResult(e.target.value)}
                  className="font-mono bg-input border-primary/30 mt-2"
                />
              </div>
            </div>

            <Button
              onClick={handleVerify}
              disabled={isVerifying || !piA || !piB || !piC || !publicSignals}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono terminal-glow"
            >
              {isVerifying ? 'VERIFYING...' : 'VERIFY PROOF'}
            </Button>

            {verificationResult !== null && (
              <div
                className={`p-4 rounded border flex items-center gap-3 ${
                  verificationResult
                    ? 'bg-secondary/10 border-secondary success-glow'
                    : 'bg-destructive/10 border-destructive'
                }`}
              >
                {verificationResult ? (
                  <CheckCircle2 className="h-6 w-6 text-secondary" />
                ) : (
                  <XCircle className="h-6 w-6 text-destructive" />
                )}
                <div>
                  <p
                    className={`font-mono text-lg font-bold ${
                      verificationResult ? 'text-secondary' : 'text-destructive'
                    }`}
                  >
                    {verificationResult ? 'Proof VERIFIED ✓' : 'Proof INVALID ✗'}
                  </p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {verificationResult
                      ? 'The cryptographic proof is mathematically valid'
                      : 'The proof verification failed'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Verifier;
