import { motion } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { ArrowRight, Activity, Server, Box, Zap } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 pt-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Interactive Learning</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Master Kubernetes Scheduling
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Understand how Kubernetes decides where Pods run through animated simulations,
              interactive visualizations, and a fully functional scheduler lab.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/concepts"
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Explore Concepts
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
              >
                Open Scheduler Lab
                <Zap className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-24 grid md:grid-cols-3 gap-8"
          >
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <Server className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cluster Architecture</h3>
              <p className="text-muted-foreground">
                Learn how control plane components work together to orchestrate container workloads
                across multiple nodes.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <Box className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pod Scheduling</h3>
              <p className="text-muted-foreground">
                Understand the scheduling lifecycle: filtering, scoring, and binding decisions that
                determine pod placement.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <Activity className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Constraints & Rules</h3>
              <p className="text-muted-foreground">
                Explore scheduling constraints like affinity, anti-affinity, taints, and tolerations
                that control pod placement.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-[#326CE5]/10 rounded-2xl p-8 border border-[#326CE5]/30"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">What You'll Learn</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div className="space-y-2">
                <div className="font-medium">Control Plane</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• API Server & Scheduler</li>
                  <li>• Controller Manager</li>
                  <li>• etcd Storage</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Node Resources</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• CPU & Memory Requests</li>
                  <li>• Resource Limits</li>
                  <li>• Bin Packing Strategy</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Scheduling Rules</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Node Selection</li>
                  <li>• Affinity Rules</li>
                  <li>• Taints & Tolerations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Failure Handling</div>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Pending Pods</li>
                  <li>• Preemption</li>
                  <li>• Debugging Tips</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Start with the concept map to understand the full scope, then dive into specific
              topics or jump straight into the scheduler lab for hands-on experience.
            </p>
            <Link
              to="/concepts"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;
