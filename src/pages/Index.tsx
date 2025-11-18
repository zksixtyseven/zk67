import { Terminal } from '@/components/Terminal';
import { MatrixRain } from '@/components/MatrixRain';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <MatrixRain />
      <div className="relative z-10">
        <Terminal />
      </div>
    </div>
  );
};

export default Index;
