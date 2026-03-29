import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Users, 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Play,
  BarChart3,
  Globe,
  Lock
} from 'lucide-react';

const features = [
  {
    icon: Code2,
    title: 'Multi-Language Support',
    description: 'Support for JavaScript, Python, Java, and more with real-time syntax highlighting.',
  },
  {
    icon: Shield,
    title: 'Secure Environment',
    description: 'Sandboxed code execution with anti-cheating measures and plagiarism detection.',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Real-time test case execution with detailed results and performance metrics.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive analytics to track candidate performance and hiring insights.',
  },
  {
    icon: Globe,
    title: 'Remote-First',
    description: 'Conduct assessments globally with candidates from anywhere in the world.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption for all assessment data.',
  },
];

const stats = [
  { value: '10K+', label: 'Candidates Assessed' },
  { value: '500+', label: 'Companies Trust Us' },
  { value: '95%', label: 'Hiring Accuracy' },
  { value: '50%', label: 'Time Saved' },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold">TA</span>
            </div>
            <span className="font-bold text-xl text-foreground">TechAssess</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="gradient" onClick={() => navigate('/dashboard')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              The future of technical hiring
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
              Hire the best
              <span className="gradient-text"> developers</span>
              <br />with confidence
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              TechAssess helps you identify top engineering talent through real-world coding challenges, 
              automated evaluation, and comprehensive analytics.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="gradient" size="xl" onClick={() => navigate('/dashboard')} className="gap-2">
                Start Hiring
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/assessment')} className="gap-2">
                <Play className="w-5 h-5" />
                Try Demo
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mt-20"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to hire smarter
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From creating assessments to evaluating candidates, TechAssess provides a complete solution for technical hiring.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to transform your hiring?
              </h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join hundreds of companies using TechAssess to find and hire the best technical talent.
              </p>
              <Button 
                size="xl" 
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="gap-2 bg-background text-foreground hover:bg-background/90"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">TA</span>
            </div>
            <span className="font-semibold text-foreground">TechAssess</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 TechAssess. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
