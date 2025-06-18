
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-insight">Insight</span>One
        </h1>
        <p className="text-xl text-foreground mb-4">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
