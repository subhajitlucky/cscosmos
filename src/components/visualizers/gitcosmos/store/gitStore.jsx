import { create } from 'zustand';

class GitEngine {
  constructor() {
    this.commits = [];
    this.branches = {};
    this.tags = {};
    this.head = { type: 'branch', ref: null };
    this.commitCounter = 0;
  }

  init() {
    this.commits = [];
    this.branches = { main: null };
    this.tags = {};
    this.head = { type: 'branch', ref: 'main' };
    this.commitCounter = 0;
  }

  generateCommitHash() {
    const hash = (this.commitCounter + 1).toString(16).padStart(8, '0');
    this.commitCounter++;
    return hash;
  }

  commit(message, parentHashes = []) {
    const hash = this.generateCommitHash();

    // Automatically use current commit as parent if not provided and exists
    const finalParentHashes = parentHashes.length > 0
      ? parentHashes
      : (this.getCurrentCommitHash() ? [this.getCurrentCommitHash()] : []);

    const commit = {
      hash,
      message,
      parentHashes: finalParentHashes,
      timestamp: Date.now(),
      tree: {},
      author: 'GitCosmos User',
    };
    this.commits.push(commit);

    const currentBranchRef = this.head.type === 'branch' ? this.head.ref : null;
    if (currentBranchRef && this.branches[currentBranchRef] !== undefined) {
      this.branches[currentBranchRef] = hash;
    }

    if (this.head.type === 'detached') {
      this.head = { type: 'detached', ref: hash };
    }

    return commit;
  }

  createBranch(name, startCommit = null) {
    if (this.branches[name]) {
      throw new Error(`Branch '${name}' already exists`);
    }

    const startHash = startCommit || this.getCurrentCommitHash();
    this.branches[name] = startHash;
    return { success: true, message: `Created branch '${name}' at ${startHash ? startHash.substring(0, 7) : 'root'}` };
  }

  deleteBranch(name) {
    if (!this.branches[name]) {
      throw new Error(`Branch '${name}' does not exist`);
    }

    if (this.head.type === 'branch' && this.head.ref === name) {
      throw new Error(`Cannot delete currently checked-out branch '${name}'`);
    }

    delete this.branches[name];
    return { success: true, message: `Deleted branch '${name}'` };
  }

  checkout(ref) {
    const branch = this.branches[ref];
    const commit = this.commits.find((c) => c.hash === ref);

    if (branch !== undefined) {
      this.head = { type: 'branch', ref };
      return { success: true, message: `Switched to branch '${ref}'` };
    } else if (commit) {
      this.head = { type: 'detached', ref: commit.hash };
      return { success: true, message: `Switched to detached HEAD at ${commit.hash.substring(0, 7)}` };
    } else {
      throw new Error(`'${ref}' is not a valid branch or commit hash`);
    }
  }

  getCurrentCommitHash() {
    if (this.head.type === 'branch') {
      return this.branches[this.head.ref] || null;
    }
    return this.head.ref;
  }

  getCurrentCommit() {
    const hash = this.getCurrentCommitHash();
    return this.commits.find((c) => c.hash === hash) || null;
  }

  getCommit(hash) {
    return this.commits.find((c) => c.hash === hash) || null;
  }

  getBranchTip(branchName) {
    return this.branches[branchName] || null;
  }

  getBranchCommits(branchName) {
    const branchHash = this.branches[branchName];
    if (!branchHash) return [];
    return this.getCommitHistory(branchHash);
  }

  getCommitHistory(startHash) {
    const visited = new Set();
    const history = [];
    let currentHash = startHash;

    while (currentHash && !visited.has(currentHash)) {
      visited.add(currentHash);
      const commit = this.getCommit(currentHash);
      if (commit) {
        history.unshift(commit);
        currentHash = commit.parentHashes[0] || null;
      } else {
        break;
      }
    }

    return history;
  }

  getAncestors(hash) {
    const ancestors = new Set();
    const queue = [hash];

    while (queue.length > 0) {
      const current = queue.shift();
      const commit = this.getCommit(current);
      if (commit) {
        for (const parent of commit.parentHashes) {
          if (!ancestors.has(parent)) {
            ancestors.add(parent);
            queue.push(parent);
          }
        }
      }
    }

    return Array.from(ancestors);
  }

  merge(sourceBranch, withCommitMessage = null) {
    const sourceHash = this.branches[sourceBranch];
    const targetHash = this.getCurrentCommitHash();

    if (!sourceHash) {
      throw new Error(`Branch '${sourceBranch}' does not exist`);
    }

    if (!targetHash) {
      throw new Error('No commits on current branch');
    }

    const sourceAncestors = this.getAncestors(sourceHash);
    if (sourceAncestors.includes(targetHash)) {
      this.branches[this.head.ref] = sourceHash;
      return { type: 'fast-forward', commit: null, message: `Fast-forwarded to ${sourceBranch}` };
    }

    const targetAncestors = this.getAncestors(targetHash);
    if (targetAncestors.includes(sourceHash)) {
      return { type: 'already-up-to-date', commit: null, message: 'Already up to date.' };
    }

    const mergeMessage = withCommitMessage || `Merge branch '${sourceBranch}' into ${this.head.ref}`;
    const mergeCommit = this.commit(mergeMessage, [targetHash, sourceHash]);

    return { type: 'merge', commit: mergeCommit, message: `Merged ${sourceBranch} into ${this.head.ref}` };
  }

  rebase(targetBranch) {
    const currentBranchName = this.head.type === 'branch' ? this.head.ref : null;
    const currentHash = this.getCurrentCommitHash();
    const targetHash = this.branches[targetBranch];

    if (!currentBranchName) {
      throw new Error('Cannot rebase in detached HEAD state');
    }

    if (!targetHash) {
      throw new Error(`Branch '${targetBranch}' does not exist`);
    }

    const commitsToRebase = this.getCommitHistory(currentHash).filter(
      (c) => !this.getAncestors(targetHash).includes(c.hash)
    );

    const rebasedCommits = [];
    let lastHash = targetHash;

    for (const commit of commitsToRebase) {
      const newHash = this.generateCommitHash();
      const newCommit = {
        ...commit,
        hash: newHash,
        parentHashes: [lastHash],
        message: `${commit.message} (rebased)`,
      };
      this.commits.push(newCommit);
      rebasedCommits.push(newCommit);
      lastHash = newHash;
    }

    if (rebasedCommits.length > 0) {
      this.branches[currentBranchName] = rebasedCommits[rebasedCommits.length - 1].hash;
    } else {
      this.branches[currentBranchName] = targetHash;
    }

    return rebasedCommits;
  }

  reset(mode = 'mixed', steps = 1) {
    const currentCommit = this.getCurrentCommit();
    if (!currentCommit) {
      throw new Error('No commits to reset');
    }

    let targetHash = currentCommit.hash;
    for (let i = 0; i < steps; i++) {
      const commit = this.getCommit(targetHash);
      if (commit && commit.parentHashes[0]) {
        targetHash = commit.parentHashes[0];
      } else {
        break;
      }
    }

    if (this.head.type === 'branch') {
      this.branches[this.head.ref] = targetHash;
    } else {
      this.head = { type: 'detached', ref: targetHash };
    }

    return { mode, targetHash };
  }

  revert(hash) {
    const commitToRevert = this.getCommit(hash);
    if (!commitToRevert) {
      throw new Error(`Commit '${hash}' not found`);
    }

    const currentHash = this.getCurrentCommitHash();
    const revertMessage = `Revert "${commitToRevert.message}"`;
    return this.commit(revertMessage, [currentHash]);
  }

  createTag(name, commitHash = null) {
    const targetHash = commitHash || this.getCurrentCommitHash();
    if (!targetHash) {
      throw new Error('No commits available for tagging');
    }
    this.tags[name] = targetHash;
    return { success: true, message: `Created tag '${name}' at ${targetHash.substring(0, 7)}` };
  }

  deleteTag(name) {
    delete this.tags[name];
    return { success: true, message: `Deleted tag '${name}'` };
  }

  getFullState() {
    return {
      commits: [...this.commits],
      branches: { ...this.branches },
      tags: { ...this.tags },
      head: { ...this.head },
      commitCounter: this.commitCounter,
    };
  }

  restoreState(state) {
    this.commits = [...state.commits];
    this.branches = { ...state.branches };
    this.tags = { ...state.tags };
    this.head = { ...state.head };
    this.commitCounter = state.commitCounter;
  }

  getGraphData() {
    const levels = {};
    const visited = new Set();

    const assignLevel = (hash, level = 0) => {
      if (visited.has(hash)) return;
      visited.add(hash);

      if (levels[hash] === undefined) {
        levels[hash] = level;
      } else {
        levels[hash] = Math.min(levels[hash], level);
      }

      const commit = this.getCommit(hash);
      if (commit) {
        commit.parentHashes.forEach((parent) => assignLevel(parent, level + 1));
      }
    };

    for (const branchHash of Object.values(this.branches)) {
      if (branchHash) assignLevel(branchHash);
    }

    for (const tagHash of Object.values(this.tags)) {
      if (!visited.has(tagHash)) assignLevel(tagHash);
    }

    const nodes = this.commits.map((commit) => ({
      id: commit.hash,
      level: levels[commit.hash] || 0,
      parents: commit.parentHashes,
      message: commit.message,
      timestamp: commit.timestamp,
      branches: Object.entries(this.branches)
        .filter(([, hash]) => hash === commit.hash)
        .map(([name]) => name),
      tags: Object.entries(this.tags)
        .filter(([, hash]) => hash === commit.hash)
        .map(([name]) => name),
    }));

    return { nodes, branches: this.branches, tags: this.tags, head: this.head };
  }
}

const gitEngine = new GitEngine();
gitEngine.init();

const useGitStore = create((set, get) => {
  const recordHistory = (setFn) => {
    set((state) => {
      const result = typeof setFn === 'function' ? setFn(state) : setFn;
      const newState = gitEngine.getFullState();
      return {
        ...result,
        state: newState,
        history: [...state.history.slice(0, state.historyIndex + 1), newState],
        historyIndex: state.historyIndex + 1,
      };
    });
  };

  return {
    state: gitEngine.getFullState(),
    history: [gitEngine.getFullState()],
    historyIndex: 0,

    commit: (message) => {
      recordHistory(() => {
        gitEngine.commit(message);
      });
    },

    createBranch: (name, startCommit) => {
      recordHistory(() => {
        gitEngine.createBranch(name, startCommit);
      });
    },

    deleteBranch: (name) => {
      recordHistory(() => {
        gitEngine.deleteBranch(name);
      });
    },

    checkout: (ref) => {
      recordHistory(() => {
        gitEngine.checkout(ref);
      });
    },

    merge: (sourceBranch, message) => {
      let result;
      recordHistory(() => {
        result = gitEngine.merge(sourceBranch, message);
      });
      return result;
    },

    rebase: (targetBranch) => {
      recordHistory(() => {
        gitEngine.rebase(targetBranch);
      });
    },

    reset: (mode, steps) => {
      recordHistory(() => {
        gitEngine.reset(mode, steps);
      });
    },

    revert: (hash) => {
      recordHistory(() => {
        gitEngine.revert(hash);
      });
    },

    createTag: (name, commitHash) => {
      recordHistory(() => {
        gitEngine.createTag(name, commitHash);
      });
    },

    deleteTag: (name) => {
      recordHistory(() => {
        gitEngine.deleteTag(name);
      });
    },

    getGraphData: () => gitEngine.getGraphData(),

    init: () => {
      gitEngine.init();
      const initialState = gitEngine.getFullState();
      set({
        state: initialState,
        history: [initialState],
        historyIndex: 0,
      });
    },

    undo: () => {
      const { historyIndex, history } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        gitEngine.restoreState(history[newIndex]);
        set({
          state: gitEngine.getFullState(),
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { historyIndex, history } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        gitEngine.restoreState(history[newIndex]);
        set({
          state: gitEngine.getFullState(),
          historyIndex: newIndex,
        });
      }
    },

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,
  };
});

export { useGitStore };