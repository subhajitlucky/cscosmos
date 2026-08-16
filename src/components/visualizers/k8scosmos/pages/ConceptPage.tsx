import { useParams, Link } from '@/components/visualizers/shared/RouterShim';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ConceptVisualizer } from '../components/visualizations/ConceptVisualizer';
import { concepts, conceptOrder } from '../data/concepts';
import { motion } from 'framer-motion';
import { Code, AlertTriangle, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function ConceptPage() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = conceptId ? concepts[conceptId] : null;
  
  const currentIndex = conceptId ? conceptOrder.indexOf(conceptId) : -1;
  const prevConcept = currentIndex > 0 ? conceptOrder[currentIndex - 1] : null;
  const nextConcept = currentIndex < conceptOrder.length - 1 ? conceptOrder[currentIndex + 1] : null;

  if (!concept) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold mb-4">Concept not found</h1>
            <p className="text-muted-foreground">The requested concept does not exist.</p>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">{concept.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{concept.shortDefinition}</p>
          </motion.div>

          <ConceptVisualizer conceptId={concept.id} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Mental Model</h2>
              </div>
              <p className="text-foreground leading-relaxed">{concept.mentalModel}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Code className="w-5 h-5 text-foreground" />
                <h2 className="text-lg font-semibold">YAML Example</h2>
              </div>
              <div className="rounded-lg overflow-hidden border border-border">
                <SyntaxHighlighter
                  language="yaml"
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, padding: '1rem' }}
                >
                  {concept.yamlExample}
                </SyntaxHighlighter>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-semibold">Common Misconceptions</h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <ul className="space-y-3">
                  {concept.commonMisconceptions.map((misconception, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-red-500 font-bold mt-1">✗</span>
                      <span className="text-muted-foreground">{misconception}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-3">Key Takeaways</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• {concept.shortDefinition}</li>
                <li>• {concept.mentalModel.slice(0, 100)}...</li>
                <li>• Check the YAML example for implementation details</li>
                <li>• Be aware of the common misconceptions listed above</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              {prevConcept ? (
                <Link
                  to={`/concepts/${prevConcept}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="text-sm font-medium">{concepts[prevConcept].title}</div>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextConcept && (
                <Link
                  to={`/concepts/${nextConcept}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="text-sm font-medium">{concepts[nextConcept].title}</div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ConceptPage;
