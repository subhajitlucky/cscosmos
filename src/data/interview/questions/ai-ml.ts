import type { InterviewQuestion } from '../types';

export const aiMlQuestions: InterviewQuestion[] = [
  {
    slug: 'why-attention-scales-by-sqrt-dk',
    category: 'ai-ml',
    topic: 'Transformers',
    title: 'Why does attention scale the logits by √d_k?',
    difficulty: 'advanced',
    frequency: 'sometimes',
    round: 'concept',
    type: 'concept',
    tags: ['transformers', 'attention', 'softmax', 'scaling', 'gradients'],
    oneLiner:
      'The 1/√d_k factor looks like a footnote, but it decides whether attention learns or saturates into one-hot weights.',
    whyAsked:
      'Interviewers use this question to separate candidates who memorized the Transformer diagram from those who understand why the architecture resists saturation. The tell is whether you can connect d_k, the variance of a dot product, and the softmax Jacobian into one causal chain instead of reciting "to keep gradients stable". Follow-ups about QK normalization, temperature, and numerically stable softmax reveal whether the mental model generalizes beyond the original paper.',
    mentalModel:
      'Every attention logit is a dot product of two roughly independent random vectors, so its variance grows linearly with d_k and its standard deviation grows with √d_k. Large logits push softmax into saturation, where the largest weight approaches 1, the rest approach 0, and the Jacobian collapses so almost no gradient reaches the queries and keys. Dividing by √d_k restores unit variance and keeps softmax in its responsive, well-conditioned regime.',
    steps: [
      {
        title: 'Variance grows with d_k',
        body: `Start with a single attention logit: the dot product of one query row against one key column, written as a sum of d_k products. If query and key entries are roughly independent with zero mean and modest variance, the variance of the sum grows linearly with d_k, so its standard deviation grows with the square root of d_k. At d_k = 64 the logits already have a standard deviation near eight; at d_k = 512 it approaches twenty-three. Softmax is exponential, so it amplifies exactly the gaps the scaling leaves behind. Drag the slider in the animation to change d_k and watch the unscaled logit histogram widen while the largest softmax weight climbs toward one. Dividing the logits by √d_k rescales their variance back to roughly one, which keeps softmax in the range where it can represent differences instead of saturating on them.`,
        animation: {
          kind: 'custom',
          key: 'attention-scaling',
        },
      },
      {
        title: 'The scaled dot-product pipeline',
        body: `Attention is a pipeline, not a single multiply. First the input tokens are projected into three matrices: queries ask what each token is looking for, keys advertise what each token contains, and values carry the content to be mixed. Every query is dotted with every key to produce an n × n score matrix, and that is where the scaling by √d_k lands, before any exponentiation. Softmax then normalizes each row of scaled scores into weights that sum to one, turning raw similarity into a distribution. Finally, each token's output is the weighted sum of all value vectors, so every position collects context from the positions it attends to. Watch the animation as each phase feeds the next: tokens to Q/K/V, logits, weights, and finally context vectors. The scale factor sits at the softmax boundary on purpose — after the dot product, before the nonlinearity that turns magnitudes into decisions.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'tokens', label: 'Tokens', sublabel: 'n embeddings' },
            { id: 'qkv', label: 'Q / K / V', sublabel: 'linear projections' },
            { id: 'scores', label: 'Scaled Dot Products', sublabel: 'n × n logits' },
            { id: 'weights', label: 'Softmax', sublabel: 'row-normalized' },
            { id: 'context', label: 'Weighted Sum', sublabel: 'context vectors' },
          ],
          phases: [
            { id: 'p1', caption: 'The sequence arrives as n token embeddings of dimension d_model.', activeNodeIds: ['tokens'] },
            { id: 'p2', caption: 'Three projections split every token into a query, a key, and a value.', packets: [{ from: 'tokens', to: 'qkv' }], doneNodeIds: ['tokens'], activeNodeIds: ['qkv'] },
            { id: 'p3', caption: 'All pairwise query-key dot products are divided by √d_k before softmax.', packets: [{ from: 'qkv', to: 'scores', label: '÷ √d_k' }], doneNodeIds: ['qkv'], activeNodeIds: ['scores'] },
            { id: 'p4', caption: 'Softmax normalizes each row into attention weights that sum to one.', packets: [{ from: 'scores', to: 'weights', label: 'softmax' }], doneNodeIds: ['scores'], activeNodeIds: ['weights'] },
            { id: 'p5', caption: 'Each output is the weighted sum of value vectors — a new context vector per token.', packets: [{ from: 'weights', to: 'context', label: 'Σ wᵢvᵢ' }], doneNodeIds: ['weights'], activeNodeIds: ['context'] },
            { id: 'p6', caption: 'Stacking the rows yields the full attention output for this head.', doneNodeIds: ['tokens', 'qkv', 'scores', 'weights'], activeNodeIds: ['context'] },
          ],
        },
      },
      {
        title: 'Saturation versus healthy weights',
        body: `Saturation is what makes the scale factor matter. When logits are large, exp amplifies the largest one far more than the rest, so softmax returns a near one-hot vector: one weight close to one and every other weight close to zero. That looks decisive, and it is a dead end for learning. The Jacobian of softmax is diag(p) − p pᵀ, and when p is close to one-hot, every entry of that Jacobian approaches zero, so almost no gradient survives the trip back to the queries and keys. The head effectively stops updating. Scaling by √d_k prevents the logits from arriving that large in the first place. Compare the two panels in the animation: the unscaled row collapses onto a single token, while the scaled row spreads attention across several plausible tokens. A spread distribution has nonzero entropy and a well-conditioned Jacobian, which is exactly what the backward pass needs.`,
        animation: {
          kind: 'before-after',
          beforeLabel: 'Unscaled logits — softmax saturates',
          afterLabel: 'Divided by √d_k — softmax stays responsive',
          before: [
            { text: '// d_k = 512, logits used as-is', tone: 'neutral' },
            { text: 'logits: [ 28.6, -3.2, 18.9, -12.7 ]', tone: 'danger' },
            { text: 'softmax: [ 0.99994, 0.00000, 0.00006, 0.00000 ]', tone: 'danger' },
            { text: '// one weight ≈ 1, the rest ≈ 0 — a near one-hot argmax', tone: 'danger' },
            { text: '// softmax Jacobian ≈ 0 everywhere: the head stops learning', tone: 'danger' },
          ],
          after: [
            { text: '// d_k = 512, logits divided by √512 ≈ 22.6', tone: 'neutral' },
            { text: 'logits/√d_k: [ 1.26, -0.14, 0.84, -0.56 ]', tone: 'success' },
            { text: 'softmax: [ 0.486, 0.119, 0.317, 0.078 ]', tone: 'success' },
            { text: '// a spread distribution — several tokens receive attention', tone: 'success' },
            { text: '// nonzero entropy and nonzero Jacobian: gradients flow', tone: 'success' },
          ],
          frames: [
            { id: 'f1', caption: 'The same query and keys, viewed before and after scaling.', beforeIndex: 0, afterIndex: 0 },
            { id: 'f2', caption: 'Unscaled dot products inherit a standard deviation close to √d_k.', beforeIndex: 1, afterIndex: 1 },
            { id: 'f3', caption: 'Softmax exponentiates the spread: the largest logit dominates.', beforeIndex: 2, afterIndex: 2 },
            { id: 'f4', caption: 'Scaling keeps logit variance near one, so weights stay spread.', beforeIndex: 3, afterIndex: 3 },
            { id: 'f5', caption: 'Only the unscaled row has a near-zero gradient across the softmax.', beforeIndex: 4, afterIndex: 4 },
          ],
        },
      },
      {
        title: 'Trace the scaling in PyTorch',
        body: `The standard PyTorch one-liner hides the entire mechanism behind familiar operators. First, queries, keys, and values are linear projections of the same input tensor. The score matrix is one batched matmul, Q @ K.T, giving all pairwise dot products at once. Then every logit is divided by the square root of d_k — the per-head dimension, not the model dimension — before softmax normalizes each row. Multiplying by V produces each token's contextualized vector. Watch the shape variables in the animation: Q and K are (n, d_k), scores are (n, n), and the softmax rows always sum to one regardless of sequence length. Modern code often calls F.scaled_dot_product_attention(q, k, v), which fuses these steps and adds a numerically stable softmax, but the math being executed is exactly the line shown here. The scale factor is constant per head, so it costs nothing at runtime.`,
        animation: {
          kind: 'code-trace',
          language: 'python',
          code: `Q = X @ W_q              # queries (n, d_k)
K = X @ W_k              # keys    (n, d_k)
V = X @ W_v              # values  (n, d_v)
scores = Q @ K.T         # all pairwise logits (n, n)
attn = softmax(scores / math.sqrt(d_k)) @ V`,
          frames: [
            { id: 'f1', caption: 'The same input is projected into queries, keys, and values.', activeLines: [1, 2, 3], variables: [{ name: 'X', value: '(n, d_model)' }, { name: 'Q', value: '(n, d_k)' }, { name: 'K', value: '(n, d_k)' }, { name: 'V', value: '(n, d_v)' }] },
            { id: 'f2', caption: 'One matmul produces every pairwise similarity in the batch.', activeLines: [4], variables: [{ name: 'scores', value: '(n, n)', changed: true }, { name: 'd_k', value: '512' }] },
            { id: 'f3', caption: 'The scale factor is applied to the logits before softmax, once per head.', activeLines: [5], variables: [{ name: 'd_k', value: '512' }, { name: 'sqrt(d_k)', value: '22.6', changed: true }] },
            { id: 'f4', caption: 'Softmax makes each row a distribution, so the weights sum to one.', activeLines: [5], variables: [{ name: 'weights', value: '(n, n)', changed: true }, { name: 'row sum', value: '1.0' }] },
            { id: 'f5', caption: 'Multiplying by V mixes values into a contextualized vector per token.', activeLines: [5], variables: [{ name: 'attn', value: '(n, d_v)', changed: true }, { name: 'max weight', value: '0.49' }] },
          ],
        },
      },
      {
        title: 'Keep logits well-conditioned',
        body: `Production softmax implementations subtract the row maximum before exponentiating for numerical stability, but that trick only prevents overflow — it does not fix saturation. Subtracting a constant leaves the relative gaps between logits unchanged, so if the raw logits have a standard deviation of twenty, the distribution is still one-hot after the shift. Keeping logits well-conditioned requires something upstream: dividing by √d_k is the original fix, and modern models add their own tools. Query-key normalization rescales q and k to unit variance so their dot products stay bounded as heads grow; attention logit soft-capping compresses extreme logits; temperature schedules and careful initialization keep propagation stable through the residual stream. Watch the animation: the max subtraction is a safety rail, the scaling is the actual fix, and the gradient signal only stays usable when the two are in place together.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'logits', label: 'Raw Logits' },
            { id: 'shift', label: 'Subtract Row Max' },
            { id: 'exp', label: 'Exponentiate' },
            { id: 'normalize', label: 'Normalize' },
            { id: 'weights', label: 'Weights + Gradients' },
          ],
          phases: [
            { id: 'p1', caption: 'Raw QKᵀ logits can be large positive or negative, so exp would overflow float16.', activeNodeIds: ['logits'] },
            { id: 'p2', caption: 'Subtracting the row max shifts every logit by a constant — softmax is unchanged.', packets: [{ from: 'logits', to: 'shift' }], doneNodeIds: ['logits'], activeNodeIds: ['shift'] },
            { id: 'p3', caption: 'Now the largest exponent is exactly one and the rest are safely below it.', packets: [{ from: 'shift', to: 'exp' }], doneNodeIds: ['shift'], activeNodeIds: ['exp'] },
            { id: 'p4', caption: 'Dividing by the sum returns a proper probability distribution.', packets: [{ from: 'exp', to: 'normalize' }], doneNodeIds: ['exp'], activeNodeIds: ['normalize'] },
            { id: 'p5', caption: 'Scaling by √d_k upstream is what keeps these values out of saturation.', packets: [{ from: 'normalize', to: 'weights' }], doneNodeIds: ['normalize'], activeNodeIds: ['weights'] },
            { id: 'p6', caption: 'Well-conditioned weights give the backward pass gradients that actually flow.', doneNodeIds: ['logits', 'shift', 'exp', 'normalize'], activeNodeIds: ['weights'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Scaling by the model dimension instead of the per-head dimension: the denominator must be d_k = d_model / num_heads, or the logits are shrunk too aggressively and attention flattens toward uniform.',
      'Applying the scale after softmax: dividing the weights by √d_k breaks their sum-to-one constraint — the factor belongs on the logits before the softmax.',
      'Trusting the numerically stable softmax (row-max subtraction) to fix saturation: it prevents overflow but leaves the relative logit gaps untouched, so one-hot weights and vanishing gradients remain.',
      'Hard-coding the scale from sequence length: the factor depends only on d_k and is constant per head — recomputing it from context length is a conceptual bug.',
      'Dismissing the issue because small heads still train: the effect is mild for tiny d_k, which is why the failure only shows up as head size or depth grows.',
    ],
    followUps: [
      { q: 'Why does the softmax gradient vanish when the distribution saturates?', a: 'The Jacobian is diag(p) − p pᵀ; when one probability is ≈1 and the rest ≈0, every entry approaches zero, so almost no gradient reaches the logits.' },
      { q: 'Would scaling help if we avoided softmax entirely?', a: 'Yes in spirit — the goal is keeping pre-activation variance near one. Alternatives such as QK normalization bound the dot product regardless of d_k.' },
      { q: 'What happens if you divide by √d_k twice?', a: 'The logits become too small, the softmax flattens toward uniform attention, and the model loses its ability to focus — the mirror image of saturation.' },
    ],
    relatedEngine: { label: 'Explore the AI visualizer', href: '/fullstack/aicosmos' },
  },
  {
    slug: 'rag-end-to-end-pipeline',
    category: 'ai-ml',
    topic: 'RAG',
    title: 'Design a RAG pipeline end to end',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'system-design',
    type: 'design',
    tags: ['rag', 'vector-search', 'embeddings', 'reranking', 'grounding'],
    oneLiner:
      'Two pipelines, one grounded answer: ingestion makes knowledge retrievable, query turns a question into a cited response.',
    whyAsked:
      'System-design interviewers use RAG to test whether you can decompose a fuzzy product requirement into two concrete data pipelines and reason about quality at every stage. Strong candidates discuss chunking and embedding-space consistency, explain why retrieval is optimized for recall and reranking for precision, and can name the failure modes — hallucination on retrieval misses, stale indexes, context dilution — with mitigations. Weak answers stop at "embed everything and put it in a vector database".',
    mentalModel:
      'RAG is a retrieval contract between two pipelines: ingestion turns documents into retrievable embedded chunks with metadata, and query turns a question into an embedded search, a reranked shortlist, and a grounded, cited answer. Retrieval quality sets the ceiling for generation quality — if the right passage never makes the shortlist, no prompt can recover the answer, so evaluate retrieval and generation separately.',
    steps: [
      {
        title: 'Ingestion builds the index',
        body: `Retrieval quality is decided before the user ever asks a question. Ingestion is an offline pipeline that turns an organization's messy sources — PDFs, HTML pages, support tickets, database rows — into a searchable index. Parsing extracts text and preserves structure as metadata. Chunking splits the text into passages small enough to embed meaningfully and large enough to stay self-contained. Each chunk is then embedded by the same model the query path will use, because retrieval only works if both sides live in the same vector space. Finally, vectors plus metadata are upserted into the vector database, idempotently keyed by document id and chunk index so a re-run replaces rather than duplicates. Watch the animation: every phase turns raw representation into something more retrievable. Treat ingestion as a versioned, repeatable job rather than a one-off script, because a stale or partially updated index silently degrades every query that follows.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'docs', label: 'Raw Documents', sublabel: 'PDF, HTML, tickets' },
            { id: 'parse', label: 'Parse + Clean', sublabel: 'text + structure' },
            { id: 'chunk', label: 'Chunk', sublabel: 'windows + overlap' },
            { id: 'embed', label: 'Embedding Model', sublabel: 'batched' },
            { id: 'vdb', label: 'Vector DB Upsert', sublabel: 'vectors + metadata' },
          ],
          phases: [
            { id: 'p1', caption: 'Documents arrive as PDFs, HTML, tickets, and database rows.', activeNodeIds: ['docs'] },
            { id: 'p2', caption: 'Parsing extracts text and preserves headings, tables, and source ids as metadata.', packets: [{ from: 'docs', to: 'parse' }], doneNodeIds: ['docs'], activeNodeIds: ['parse'] },
            { id: 'p3', caption: 'Text is split into chunks with overlap so no idea is cut in half.', packets: [{ from: 'parse', to: 'chunk' }], doneNodeIds: ['parse'], activeNodeIds: ['chunk'] },
            { id: 'p4', caption: 'Each chunk is embedded once, in batches, by the model the query path will reuse.', packets: [{ from: 'chunk', to: 'embed' }], doneNodeIds: ['chunk'], activeNodeIds: ['embed'] },
            { id: 'p5', caption: 'Vectors are upserted with metadata — source, section, timestamp — for filtering and citations.', packets: [{ from: 'embed', to: 'vdb' }], doneNodeIds: ['embed'], activeNodeIds: ['vdb'] },
            { id: 'p6', caption: 'The index is a snapshot; re-ingestion is how new knowledge enters it.', doneNodeIds: ['docs', 'parse', 'chunk', 'embed'], activeNodeIds: ['vdb'] },
          ],
        },
      },
      {
        title: 'Chunk size and overlap',
        body: `Chunking is the highest-leverage decision in the pipeline because an embedding compresses a chunk into a single vector. Make the chunk too large and it discusses several topics at once; the vector drifts toward the average and stops matching any specific question. Make it too small and it loses its referents — the pronoun whose noun lives in the previous sentence — so retrieval finds fragments that cannot answer anything. A window in the range of a few hundred tokens with ten to twenty percent overlap is a common starting point, and overlap is what protects facts that straddle a boundary: the sentence appears whole in at least one chunk. Watch the animation as the splitter repeats the boundary tokens in both adjacent chunks. Structure-aware splitting helps further: keep headings with their sections, never cut tables or code blocks, and attach the section title to every chunk so the embedding carries context. Then tune empirically with retrieval evaluation.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'doc', label: 'Document' },
            { id: 'splitter', label: 'Token Splitter', sublabel: 'window size' },
            { id: 'chunkA', label: 'Chunk n' },
            { id: 'chunkB', label: 'Chunk n+1' },
            { id: 'embed', label: 'Embedding' },
          ],
          phases: [
            { id: 'p1', caption: 'A long document is handed to the chunker.', activeNodeIds: ['doc'] },
            { id: 'p2', caption: 'The text is split on a token window — say 512 tokens — not by paragraph luck.', packets: [{ from: 'doc', to: 'splitter' }], doneNodeIds: ['doc'], activeNodeIds: ['splitter'] },
            { id: 'p3', caption: 'Chunk n covers the first window and becomes one retrievable unit.', packets: [{ from: 'splitter', to: 'chunkA' }], doneNodeIds: ['splitter'], activeNodeIds: ['chunkA'] },
            { id: 'p4', caption: 'Chunk n+1 restarts 10–20% earlier, repeating the boundary sentences.', packets: [{ from: 'chunkA', to: 'chunkB', label: 'overlap' }], activeNodeIds: ['chunkB'] },
            { id: 'p5', caption: 'Both chunks embed separately; overlap keeps a boundary-spanning fact whole in one of them.', packets: [{ from: 'chunkA', to: 'embed' }, { from: 'chunkB', to: 'embed' }], doneNodeIds: ['chunkA', 'chunkB'], activeNodeIds: ['embed'] },
            { id: 'p6', caption: 'Chunk size trades dilution against lost context; overlap trades index size for continuity.', doneNodeIds: ['doc', 'splitter', 'chunkA', 'chunkB'], activeNodeIds: ['embed'] },
          ],
        },
      },
      {
        title: 'Query path embeds and retrieves',
        body: `The query path mirrors ingestion but at interactive latency. The user question is embedded with the exact same model, then searched against an approximate nearest neighbor index such as HNSW or IVF. ANN search is what makes retrieval cheap: instead of comparing against every vector, it walks a navigable graph or probes the most promising clusters, trading a small amount of recall for orders-of-magnitude speed. Because this stage optimizes recall, it deliberately over-fetches: ten to one hundred candidates ranked by vector similarity. Watch the animation: the query becomes a vector, the vector probes the index, and a candidate list returns. Metadata filters — tenant, date, source — can be applied before or after the search depending on the engine, and pre-filtering is usually more accurate but harder to keep fast. Same model, same normalization, same dimensionality on both sides; mixing embedding models silently destroys the geometry.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'query', label: 'User Query' },
            { id: 'qembed', label: 'Query Embedding' },
            { id: 'ann', label: 'ANN Search', sublabel: 'HNSW / IVF' },
            { id: 'index', label: 'Vector Index' },
            { id: 'candidates', label: 'Top-k Candidates', sublabel: 'recall-oriented' },
          ],
          phases: [
            { id: 'p1', caption: 'The question arrives with optional filters: tenant, date, source.', activeNodeIds: ['query'] },
            { id: 'p2', caption: 'The query is embedded with the exact model used during ingestion.', packets: [{ from: 'query', to: 'qembed' }], doneNodeIds: ['query'], activeNodeIds: ['qembed'] },
            { id: 'p3', caption: 'The vector enters an approximate nearest neighbor search.', packets: [{ from: 'qembed', to: 'ann' }], doneNodeIds: ['qembed'], activeNodeIds: ['ann'] },
            { id: 'p4', caption: 'The index is probed for approximate neighbors — fast, but recall is a tuning knob, not a guarantee.', packets: [{ from: 'ann', to: 'index', label: 'probe' }], doneNodeIds: ['ann'], activeNodeIds: ['index'] },
            { id: 'p5', caption: 'k candidates return ranked by vector similarity, not by whether they answer the question.', packets: [{ from: 'index', to: 'candidates', label: 'top-k' }], doneNodeIds: ['index'], activeNodeIds: ['candidates'] },
            { id: 'p6', caption: 'This stage buys recall: cheap, approximate, and deliberately generous.', doneNodeIds: ['query', 'qembed', 'ann', 'index'], activeNodeIds: ['candidates'] },
          ],
        },
      },
      {
        title: 'Reranking buys precision',
        body: `Vector similarity finds candidates; a reranker decides which ones actually answer the question. The retrieval stage uses a bi-encoder: query and chunk are embedded independently, so all chunk vectors can be precomputed, and each similarity comparison is a fixed-size dot product. The corpus-size win comes from ANN indexing over those precomputed vectors, not from the comparison being constant-time. That speed comes at a cost — the two texts never see each other, so the score is a coarse approximation of relevance. A cross-encoder reads the query and one candidate concatenated, letting full attention compare them token by token. It is far more precise and far too slow to run across the whole corpus, which is exactly why it belongs after retrieval. Watch the animation: fifty noisy candidates enter, and a handful of precise passages leave. This two-stage design is the standard precision-recall split, and it usually fits a latency budget of tens of milliseconds for a few dozen candidates. Hybrid keyword search and late-interaction models like ColBERT are variations on the same trade.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'candidates', label: 'Top-k Candidates', sublabel: 'k ≈ 50' },
            { id: 'cross', label: 'Cross-Encoder', sublabel: 'query + chunk' },
            { id: 'topn', label: 'Top-n Passages', sublabel: 'n ≈ 5' },
          ],
          phases: [
            { id: 'p1', caption: 'Retrieval returned k noisy candidates ranked by vector similarity.', activeNodeIds: ['candidates'] },
            { id: 'p2', caption: 'The cross-encoder reads the query and each candidate together with full attention.', packets: [{ from: 'candidates', to: 'cross' }], doneNodeIds: ['candidates'], activeNodeIds: ['cross'] },
            { id: 'p3', caption: 'It emits a true relevance score per pair — far sharper than cosine similarity.', activeNodeIds: ['cross'] },
            { id: 'p4', caption: 'Candidates are reordered by that score and truncated to n passages.', packets: [{ from: 'cross', to: 'topn' }], doneNodeIds: ['cross'], activeNodeIds: ['topn'] },
            { id: 'p5', caption: 'Precision now: fifty candidates in, the few that can answer out.', doneNodeIds: ['candidates', 'cross'], activeNodeIds: ['topn'] },
          ],
        },
      },
      {
        title: 'Ground generation with citations',
        body: `Generation is where retrieval becomes an answer. The reranked passages are packed into a token budget — system instructions first, then numbered context chunks, then the question — and any passage that does not fit is dropped so the window never overflows. Each chunk keeps a stable id, and the prompt instructs the model to answer only from the provided context and cite the ids it used. Watch the animation: top-n passages flow into the budget, the prompt, and a grounded answer whose citations map back to exact sources. This design exposes the failure modes you must name in an interview. When retrieval misses, the model hallucinates fluently unless instructed to abstain; a stale index quietly serves outdated answers; long contexts lose middle passages; and retrieved text can itself carry prompt-injection instructions. Grounding, citations, freshness jobs, and separate retrieval and generation evaluations are the defenses.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'topn', label: 'Top-n Passages', sublabel: 'with metadata' },
            { id: 'budget', label: 'Token Budget', sublabel: 'fit the window' },
            { id: 'prompt', label: 'Prompt Assembly', sublabel: 'numbered chunks' },
            { id: 'llm', label: 'Grounded LLM', sublabel: 'answer from context' },
            { id: 'answer', label: 'Answer + Citations' },
          ],
          phases: [
            { id: 'p1', caption: 'The selected passages arrive with source ids and metadata attached.', activeNodeIds: ['topn'] },
            { id: 'p2', caption: 'The assembler fills the context window: system rules, numbered chunks, then the question.', packets: [{ from: 'topn', to: 'budget' }], doneNodeIds: ['topn'], activeNodeIds: ['budget'] },
            { id: 'p3', caption: 'Chunks are truncated or dropped from the bottom until the budget fits.', activeNodeIds: ['budget'] },
            { id: 'p4', caption: 'Each chunk is labeled with a stable id and the prompt demands citations.', packets: [{ from: 'budget', to: 'prompt' }], doneNodeIds: ['budget'], activeNodeIds: ['prompt'] },
            { id: 'p5', caption: 'The model answers only from the context, and abstains when it is insufficient.', packets: [{ from: 'prompt', to: 'llm' }], doneNodeIds: ['prompt'], activeNodeIds: ['llm'] },
            { id: 'p6', caption: 'The answer returns with citations that map back to exact source chunks.', packets: [{ from: 'llm', to: 'answer' }], doneNodeIds: ['topn', 'budget', 'prompt', 'llm'], activeNodeIds: ['answer'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Embedding queries with a different model or normalization than ingestion: the query and documents land in different vector spaces, so freeze the embedding model and version the index alongside it.',
      'Fixed-size character chunking slices through tables, code, and sentences: use structure-aware splitting (headings, code fences) with 10–20% overlap so boundary facts stay whole.',
      'Optimizing only top-k similarity and skipping reranking: the answer sits buried under near-duplicates — retrieve k = 50 fast, then rerank to n = 5 precise.',
      'Hallucination when retrieval misses: give the model an explicit "insufficient context" escape hatch and evaluate retrieval recall separately from answer quality.',
      'Stale index: a source is updated but old chunks remain — key chunks by document version, re-ingest on change, and delete superseded vectors.',
    ],
    followUps: [
      { q: 'Why not just put the whole knowledge base in the context window?', a: 'Cost grows with every token, irrelevant text distracts the model, and long-context recall is uneven — retrieval selects the few passages that matter and keeps spend predictable.' },
      { q: 'When would you use hybrid search instead of pure vectors?', a: 'When queries contain exact identifiers, acronyms, or rare terms: combine BM25 keyword matching with dense retrieval and fuse the rankings, often with reciprocal rank fusion.' },
      { q: 'How do you evaluate a RAG system?', a: 'Score retrieval separately (recall@k, MRR) and generation separately (faithfulness to context, answer correctness, citation accuracy) on a labeled set of question-answer-source triples.' },
      { q: 'How would you handle multi-hop questions?', a: 'Decompose the question into sub-questions, retrieve per step, and feed intermediate answers back into the next retrieval — or let an agent iterate with tools until it can answer.' },
    ],
    relatedEngine: { label: 'Explore the AI visualizer', href: '/fullstack/aicosmos' },
  },
  {
    slug: 'backpropagation-gradient-flow',
    category: 'ai-ml',
    topic: 'Training',
    title: 'How does backpropagation compute every gradient?',
    difficulty: 'intermediate',
    frequency: 'very-often',
    round: 'concept',
    type: 'concept',
    tags: ['backpropagation', 'chain-rule', 'gradients', 'optimization', 'vanishing-gradients'],
    oneLiner:
      'One forward pass computes the loss; one backward pass applies the chain rule to every weight; one step moves them downhill.',
    whyAsked:
      'This question tests whether you understand training as a computational graph rather than a library call. Interviewers listen for the chain rule stated precisely, for why activations are cached, and for the intuition that depth turns gradients into long products that can vanish or explode. The follow-ups — reverse versus forward mode, residual connections, gradient accumulation — show whether the model extends to the debugging questions that real training runs generate.',
    mentalModel:
      'The forward pass computes activations and a scalar loss, caching everything the derivatives will need. The backward pass walks the graph in reverse, letting each layer multiply the gradient it receives by its own local Jacobian, so every weight ends up with dL/dW. An optimizer then nudges each parameter along the negative gradient scaled by the learning rate. Depth makes that backward product long, which is why gradient magnitudes need residual paths, normalization, and careful initialization to stay near one.',
    steps: [
      {
        title: 'Forward pass computes the loss',
        body: `Training starts with a forward pass. The input batch flows through each layer: a linear transform followed by a nonlinearity, producing activations a1, a2, and finally the output prediction. The loss function compares that prediction with the target and reduces the difference to a single scalar — cross-entropy for classification, mean squared error for regression. Watch the animation as the signal moves left to right, one node at a time, until the scalar loss appears at the end. The crucial detail is what the framework does silently: every intermediate activation and pre-activation is cached, because the backward pass will need those exact values as multiplicative factors. Without the cache, gradient computation would have to recompute the forward pass; with it, each local derivative can be evaluated cheaply. That cached graph of tensors is the computation graph autograd builds, and the scalar loss is its root.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'input', label: 'Input x' },
            { id: 'h1', label: 'Hidden 1', sublabel: 'a1 = σ(z1)' },
            { id: 'h2', label: 'Hidden 2', sublabel: 'a2 = σ(z2)' },
            { id: 'output', label: 'Output ŷ' },
            { id: 'loss', label: 'Loss L', sublabel: 'scalar' },
          ],
          phases: [
            { id: 'p1', caption: 'The input batch enters; weights and biases are the parameters to be learned.', activeNodeIds: ['input'] },
            { id: 'p2', caption: 'Layer 1 computes z1 then a1 = σ(z1), caching both for later.', packets: [{ from: 'input', to: 'h1', label: 'z1 = W1x + b1' }], doneNodeIds: ['input'], activeNodeIds: ['h1'] },
            { id: 'p3', caption: 'Layer 2 repeats the pattern: linear transform, then nonlinearity.', packets: [{ from: 'h1', to: 'h2' }], doneNodeIds: ['h1'], activeNodeIds: ['h2'] },
            { id: 'p4', caption: 'The output layer produces raw logits ŷ.', packets: [{ from: 'h2', to: 'output' }], doneNodeIds: ['h2'], activeNodeIds: ['output'] },
            { id: 'p5', caption: 'The loss compares ŷ with the target y and reduces to a single number.', packets: [{ from: 'output', to: 'loss', label: 'ŷ vs y' }], doneNodeIds: ['output'], activeNodeIds: ['loss'] },
            { id: 'p6', caption: 'Every activation is stored — the backward pass will need them as factors.', doneNodeIds: ['input', 'h1', 'h2', 'output'], activeNodeIds: ['loss'] },
          ],
        },
      },
      {
        title: 'Backward pass applies the chain rule',
        body: `The backward pass is the chain rule applied mechanically, from the loss toward the inputs. Start with dL/dL = 1 at the scalar root. Each layer receives a gradient with respect to its output and multiplies it by its own local Jacobian to produce the gradient with respect to its input: dL/dx = dL/dz · dz/dx. For a linear layer z = Wx + b, that local derivative is just W; for an activation, it is the elementwise derivative evaluated at the cached pre-activation. Watch the animation as gradient packets travel in reverse, each hop multiplying the signal by a local term. The reverse order is forced by dependencies: a layer's gradient is only computable once the gradient from the layer above it is known. That is also why reverse-mode autodiff is the right choice for deep learning — one scalar loss and millions of parameters means a single backward sweep yields every parameter gradient at once.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'loss', label: 'Loss L' },
            { id: 'output', label: 'Output Layer' },
            { id: 'h2', label: 'Hidden 2' },
            { id: 'h1', label: 'Hidden 1' },
            { id: 'input', label: 'Input x' },
          ],
          phases: [
            { id: 'p1', caption: 'Start at the scalar loss, where dL/dL = 1.', activeNodeIds: ['loss'] },
            { id: 'p2', caption: 'The loss derivative with respect to each output is computed directly.', packets: [{ from: 'loss', to: 'output', label: 'dL/dŷ' }], doneNodeIds: ['loss'], activeNodeIds: ['output'] },
            { id: 'p3', caption: 'The output layer multiplies by its local Jacobian — the chain rule in action.', packets: [{ from: 'output', to: 'h2', label: 'dL/dz2' }], doneNodeIds: ['output'], activeNodeIds: ['h2'] },
            { id: 'p4', caption: 'Each earlier layer multiplies the incoming gradient by its own local derivative.', packets: [{ from: 'h2', to: 'h1', label: 'dL/dz1 = dL/dz2 · W2 · σ′(z1)' }], doneNodeIds: ['h2'], activeNodeIds: ['h1'] },
            { id: 'p5', caption: 'The signal reaches the input, but input gradients are discarded — parameter gradients are kept.', packets: [{ from: 'h1', to: 'input', label: 'dL/dx' }], doneNodeIds: ['h1'], activeNodeIds: ['input'] },
            { id: 'p6', caption: 'At every node the same rule holds: received gradient times local derivative.', doneNodeIds: ['loss', 'output', 'h2', 'h1'], activeNodeIds: ['input'] },
          ],
        },
      },
      {
        title: 'Gradients accumulate at every weight',
        body: `Parameter gradients appear at the point where each weight multiplies an activation. For a linear layer, the gradient with respect to the weights is the outer product of the incoming gradient δ and the cached input: dL/dW = δ aᵀ, and the bias gradient is δ summed over the batch. This is why forward activations were cached — they are the second factor in every weight gradient. Watch the animation: the reverse signal reaches the output weights first, then hidden-2 weights, then hidden-1 weights, and each layer fills a gradient buffer shaped exactly like its parameters. Frameworks accumulate into that buffer rather than overwrite it, which is convenient for gradient accumulation over micro-batches but dangerous if you forget to zero the buffers between optimization steps. Batch size is folded in by summing or averaging these per-example gradients. After the sweep every parameter has a gradient of the same shape, ready for the optimizer.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'loss', label: 'Loss L' },
            { id: 'outW', label: 'Output Weights W3' },
            { id: 'h2W', label: 'Hidden 2 Weights W2' },
            { id: 'h1W', label: 'Hidden 1 Weights W1' },
            { id: 'grads', label: 'Gradient Buffers', sublabel: 'same shape as params' },
          ],
          phases: [
            { id: 'p1', caption: 'The scalar loss is the root of the reverse traversal.', activeNodeIds: ['loss'] },
            { id: 'p2', caption: 'Output weights receive ∂L/∂W3 from the output error and the cached activations.', packets: [{ from: 'loss', to: 'outW', label: '∂L/∂W3' }], doneNodeIds: ['loss'], activeNodeIds: ['outW'] },
            { id: 'p3', caption: 'The backward signal continues inward as dL/dz2.', packets: [{ from: 'outW', to: 'h2W', label: 'dL/dz2' }], doneNodeIds: ['outW'], activeNodeIds: ['h2W'] },
            { id: 'p4', caption: 'Hidden-2 weights combine that signal with layer-1 activations: ∂L/∂W = δ aᵀ.', packets: [{ from: 'h2W', to: 'h1W', label: '∂L/∂W2' }], doneNodeIds: ['h2W'], activeNodeIds: ['h1W'] },
            { id: 'p5', caption: 'Hidden-1 weights are last; every parameter now has a gradient of matching shape.', packets: [{ from: 'h1W', to: 'grads', label: '∂L/∂W1' }], doneNodeIds: ['h1W'], activeNodeIds: ['grads'] },
            { id: 'p6', caption: 'Accumulated across the batch, gradients tell each weight its direction and magnitude.', doneNodeIds: ['loss', 'outW', 'h2W', 'h1W'], activeNodeIds: ['grads'] },
          ],
        },
      },
      {
        title: 'Descend in the negative direction',
        body: `Gradients point uphill. The gradient dL/dW tells you how the loss changes as a weight increases, so the descent update moves the parameter in the opposite direction: W ← W − η · dL/dW, where η is the learning rate. Watch the animation as the optimizer consumes the gradient buffer and writes new values back into the parameters. Plain SGD uses the raw gradient; momentum adds a running velocity that smooths noisy directions; Adam divides each gradient by a running estimate of its scale, giving every weight an adaptive step. Modern frameworks zero the gradient buffers after each update, because accumulation across iterations would otherwise mix in stale information. The learning rate matters as much as the direction: too small and training crawls, too large and the step overshoots the minimum, making the loss bounce or diverge even though every gradient was computed correctly.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'grads', label: 'Gradient Buffers', sublabel: 'dL/dW' },
            { id: 'opt', label: 'Optimizer', sublabel: 'SGD / momentum / Adam' },
            { id: 'update', label: 'Weight Update', sublabel: 'W ← W − η · dL/dW' },
            { id: 'params', label: 'Updated Parameters' },
          ],
          phases: [
            { id: 'p1', caption: 'Gradients point uphill: they describe the loss increase per unit of weight.', activeNodeIds: ['grads'] },
            { id: 'p2', caption: 'The optimizer reads each gradient; plain SGD applies W ← W − η · dL/dW.', packets: [{ from: 'grads', to: 'opt' }], doneNodeIds: ['grads'], activeNodeIds: ['opt'] },
            { id: 'p3', caption: 'Momentum smooths noisy directions; Adam rescales per parameter using running statistics.', activeNodeIds: ['opt'] },
            { id: 'p4', caption: 'The step is the learning rate times the gradient, adapted or raw.', packets: [{ from: 'opt', to: 'update' }], doneNodeIds: ['opt'], activeNodeIds: ['update'] },
            { id: 'p5', caption: 'Every parameter moves a little in the direction that lowers the loss.', packets: [{ from: 'update', to: 'params' }], doneNodeIds: ['update'], activeNodeIds: ['params'] },
            { id: 'p6', caption: 'Zero the buffers and repeat — one training step complete.', doneNodeIds: ['grads', 'opt', 'update'], activeNodeIds: ['params'] },
          ],
        },
      },
      {
        title: 'When gradients vanish or explode',
        body: `Backpropagation multiplies one local derivative per layer, so depth turns the gradient into a product of many factors with its own dynamics. If each factor has magnitude below one — sigmoid saturates at a derivative of at most 0.25 — the product shrinks geometrically and early layers receive a vanishing signal that barely moves them. If the factors exceed one, the same product explodes into massive updates or NaNs. Watch the animation: the backward signal decays through the stack until almost nothing reaches layer one. The fixes restore the product's magnitude near one from both sides. Residual connections add an identity term that carries gradients across blocks unchanged. Normalization layers keep activations and their derivatives well-scaled. Non-saturating activations like ReLU or GELU avoid the sigmoid's tiny derivative, careful He or Xavier initialization starts the product balanced, and gradient clipping caps the occasional spike. Diagnose by logging per-layer gradient norms, not just the loss.`,
        animation: {
          kind: 'step-flow',
          nodes: [
            { id: 'deep', label: 'Layer N' },
            { id: 'mid', label: 'Layer k' },
            { id: 'early', label: 'Layer 1' },
            { id: 'vanish', label: 'Vanishing Signal' },
            { id: 'explode', label: 'Exploding Signal' },
            { id: 'norms', label: 'Grad-Norm Check' },
            { id: 'fixes', label: 'Stabilizers', sublabel: 'residuals, norm, init, clipping' },
          ],
          phases: [
            { id: 'p1', caption: 'Backward starts at the loss and multiplies one local derivative per layer.', activeNodeIds: ['deep'] },
            { id: 'p2', caption: 'A layer passes its received gradient multiplied by its own Jacobian.', packets: [{ from: 'deep', to: 'mid', label: 'grad × J' }], doneNodeIds: ['deep'], activeNodeIds: ['mid'] },
            { id: 'p3', caption: 'With sigmoid-like derivatives below one, the product shrinks at every hop.', packets: [{ from: 'mid', to: 'early', label: '0.25 ×' }], doneNodeIds: ['mid'], activeNodeIds: ['early'] },
            { id: 'p4', caption: 'Fifty layers of 0.25 leave a signal near 10⁻³⁰ — the early layers stop moving.', activeNodeIds: ['vanish'] },
            { id: 'p5', caption: 'If the local derivatives exceed one, the same product explodes into NaN updates.', errorNodeIds: ['explode'], activeNodeIds: ['explode'] },
            { id: 'p6', caption: 'Per-layer gradient norms expose the decay or the spike immediately.', activeNodeIds: ['norms'] },
            { id: 'p7', caption: 'Residual paths, normalization, ReLU/GELU, careful init, and clipping keep the product near one.', doneNodeIds: ['deep', 'mid', 'early', 'vanish', 'norms'], activeNodeIds: ['fixes'] },
          ],
        },
      },
    ],
    edgeCases: [
      'Forgetting to zero gradients between steps: PyTorch accumulates into .grad, so two iterations without zero_grad() sum two batches of gradients — call optimizer.zero_grad() every step.',
      'Blowing up memory by keeping the whole autograd graph alive: detach tensors used only for metrics and wrap evaluation in torch.no_grad(), or the graph pins activations for the entire run.',
      'Debugging a silent vanishing signal by watching the loss alone: log per-layer gradient norms (hooks or a profiler) so a decaying backward signal is visible before training plateaus.',
      'Clipping gradients and declaring victory: clipping caps NaNs but does not fix a bad init or saturated activations — pair it with residual and normalization fixes.',
      'Choosing a learning rate too large for the loss surface: the step overshoots and the loss diverges even though gradients are correct — sweep the LR or add warmup and a schedule.',
    ],
    followUps: [
      { q: 'Why does backprop need the forward activations cached?', a: 'Each weight gradient is the product of the incoming gradient and the layer input — δ aᵀ — so the activations computed forward are the factors the chain rule needs on the way back.' },
      { q: 'Why compute gradients in reverse instead of forward mode?', a: 'There is one scalar loss and millions of parameters; reverse mode gets every dL/dw in a single sweep, while forward mode would need one pass per parameter.' },
      { q: 'What exactly does the optimizer do with the gradients?', a: 'It updates each parameter in the negative gradient direction scaled by the learning rate, optionally with momentum or adaptive per-parameter scaling like Adam.' },
      { q: 'How do residual connections fight vanishing gradients?', a: 'They add an identity path around each block, so the local Jacobian contains an identity term that carries the gradient through without shrinking.' },
    ],
    relatedEngine: { label: 'Explore the AI visualizer', href: '/fullstack/aicosmos' },
  },
];
