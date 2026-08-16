export const conceptGroups = [
  {
    name: 'Git Fundamentals',
    concepts: [
      {
        id: 'version-control',
        name: 'What is Version Control',
        difficulty: 'beginner',
        definition: 'Version control is a system that records changes to files over time, allowing you to recall specific versions later.',
        mentalModel: 'Think of it as a time machine for your code. You can save snapshots of your project at any point and travel back to them whenever needed.',
        command: 'git init',
        visualization: 'timeline',
        commonMistakes: [
          'Not using version control at all and relying on manual backups',
          'Committing too infrequently, making it hard to identify when bugs were introduced',
          'Writing vague commit messages that don\'t describe what changed'
        ]
      },
      {
        id: 'git-vs-vcs',
        name: 'Git vs Other VCS',
        difficulty: 'beginner',
        definition: 'Git is a distributed version control system, unlike centralized systems like SVN or CVS.',
        mentalModel: 'In centralized VCS, there\'s one server with all the history. In Git, every developer has a complete copy of the entire repository history on their machine.',
        command: 'git init (Git) vs svn checkout (SVN)',
        visualization: 'distributed-network',
        commonMistakes: [
          'Trying to use Git like a centralized system',
          'Not understanding that every clone is a full backup',
          'Pushing too frequently without considering the distributed nature'
        ]
      },
      {
        id: 'repository',
        name: 'Repository',
        difficulty: 'beginner',
        definition: 'A repository is the complete collection of files and their entire revision history for a project.',
        mentalModel: 'A repository is like a project folder with a built-in time machine. It contains your current files plus all previous versions, organized in a graph of commits.',
        command: 'git init\nmkdir project && cd project && git init',
        visualization: 'folder-graph',
        commonMistakes: [
          'Initializing a repository inside another repository (nested git repos)',
          'Forgetting to add a .gitignore file',
          'Including build artifacts or dependencies in the repository'
        ]
      },
      {
        id: 'working-directory',
        name: 'Working Directory',
        difficulty: 'beginner',
        definition: 'The working directory contains the actual files you see and edit on your computer.',
        mentalModel: 'Your working directory is like the canvas you\'re painting on. Changes you make here are like pencil marks - they\'re there, but not yet permanently recorded.',
        command: 'git status (to see what\'s in your working directory)',
        visualization: 'working-dir',
        commonMistakes: [
          'Making changes without understanding they\'re in the working directory',
          'Confusing working directory with the staging area',
          'Not checking git status before committing'
        ]
      },
      {
        id: 'staging-area',
        name: 'Staging Area (Index)',
        difficulty: 'beginner',
        definition: 'The staging area is a file inside your Git directory that stores information about what will go into your next commit.',
        mentalModel: 'Think of the staging area as a review tray. You prepare your changes there, review them, and then commit them all together as a single snapshot.',
        command: 'git add file.txt\ngit add . (stage all changes)',
        visualization: 'staging-area',
        commonMistakes: [
          'Accidentally staging files that shouldn\'t be committed',
          'Not using staging area thoughtfully to group related changes',
          'Forgetting to stage changes before committing'
        ]
      },
      {
        id: 'commit',
        name: 'Commit',
        difficulty: 'beginner',
        definition: 'A commit is a snapshot of your project at a specific point in time, stored as an object in Git\'s database.',
        mentalModel: 'A commit is like a saved state in a video game. It records exactly what your project looked like at that moment, so you can return to it later.',
        command: 'git commit -m "Add user authentication feature"',
        visualization: 'commit-node',
        commonMistakes: [
          'Writing poor commit messages like "update" or "fix"',
          'Making commits that are too large or cover multiple unrelated changes',
          'Not committing frequently enough'
        ]
      },
      {
        id: 'commit-hash',
        name: 'Commit Hash',
        difficulty: 'beginner',
        definition: 'Every commit has a unique identifier called a hash (SHA-1), which is generated based on the commit\'s content.',
        mentalModel: 'A commit hash is like a fingerprint. It uniquely identifies each commit and ensures the integrity of your repository history.',
        command: 'git log (to see commit hashes like a1b2c3d...)',
        visualization: 'hash-fingerprint',
        commonMistakes: [
          'Trying to memorize or manually type long commit hashes',
          'Not understanding that changing any part of a commit changes its hash',
          'Assuming commits are mutable - they\'re not!'
        ]
      },
      {
        id: 'snapshots-vs-diffs',
        name: 'Snapshots vs Diffs',
        difficulty: 'beginner',
        definition: 'Git stores complete snapshots of your project files, not just differences between versions.',
        mentalModel: 'Most VCS store what changed (diffs). Git stores what the whole project looked like (snapshot). It\'s the difference between saving "I changed line 5" vs saving "Here\'s the entire file as it looks now".',
        command: 'git show (shows a snapshot of a commit)',
        visualization: 'snapshot-diff',
        commonMistakes: [
          'Assuming Git works like other VCS that use diffs',
          'Not understanding this makes Git faster for checking out old versions',
          'Thinking large files take more space in each commit'
        ]
      }
    ]
  },
  {
    name: 'Branches & HEAD',
    concepts: [
      {
        id: 'head',
        name: 'HEAD',
        difficulty: 'beginner',
        definition: 'HEAD is a pointer to the current branch or commit you\'re viewing in your repository.',
        mentalModel: 'HEAD is like a "You Are Here" marker on a map. It tells Git where you currently are and which branch you\'re working on.',
        command: 'git log (shows HEAD position)\ngit rev-parse HEAD (shows HEAD commit)',
        visualization: 'head-pointer',
        commonMistakes: [
          'Confusing HEAD with the current commit itself',
          'Not understanding HEAD can be attached to a branch or detached',
          'Assuming HEAD always moves forward only'
        ]
      },
      {
        id: 'branch',
        name: 'Branch',
        difficulty: 'beginner',
        definition: 'A branch is a movable pointer to a commit that represents an independent line of development.',
        mentalModel: 'Think of a branch as a pointer that moves as you make commits. Branches are cheap in Git - they\'re just 41-byte files pointing to commits.',
        command: 'git branch feature-login\ngit checkout -b feature-login (create and switch)',
        visualization: 'branch-pointer',
        commonMistakes: [
          'Thinking branches are copies of the entire repository',
          'Not creating branches for new features or bug fixes',
          'Letting branches diverge for too long without merging'
        ]
      },
      {
        id: 'checkout',
        name: 'Checkout',
        difficulty: 'beginner',
        definition: 'The git checkout command switches branches or restores working directory files.',
        mentalModel: 'Checking out is like time travel. You move HEAD to point at a different branch or commit, and your working directory updates to match that snapshot.',
        command: 'git checkout main\ngit checkout feature-branch',
        visualization: 'checkout-move',
        commonMistakes: [
          'Not understanding that uncommitted changes will be carried over or cause conflicts',
          'Using checkout for files vs branches - the behavior is different',
          'Forgetting that checkout switches your working directory files'
        ]
      },
      {
        id: 'detached-head',
        name: 'Detached HEAD',
        difficulty: 'intermediate',
        definition: 'Detached HEAD occurs when HEAD points directly to a commit instead of a branch reference.',
        mentalModel: 'Detached HEAD is like being on a railway siding - you\'re still on the tracks, but not connected to a main line (branch). Any commits you make here won\'t be on a branch.',
        command: 'git checkout a1b2c3d (checkout a commit hash)',
        visualization: 'detached-head',
        commonMistakes: [
          'Making commits in detached HEAD state and losing them',
          'Not understanding how to recover from detached HEAD',
          'Intentionally working in detached HEAD without knowing the consequences'
        ]
      },
      {
        id: 'log-history',
        name: 'Log & History',
        difficulty: 'beginner',
        definition: 'Git log displays the commit history, showing commits in reverse chronological order.',
        mentalModel: 'The log is like a diary of your project. Each entry records what happened, when, and who did it.',
        command: 'git log\ngit log --oneline --graph --all (visualized history)',
        visualization: 'commit-graph',
        commonMistakes: [
          'Not using helpful options like --oneline or --graph',
          'Getting overwhelmed by long output without filtering',
          'Not understanding the graph visualization'
        ]
      }
    ]
  },
  {
    name: 'Merging & Rebasing',
    concepts: [
      {
        id: 'merge',
        name: 'Merge',
        difficulty: 'intermediate',
        definition: 'Merging combines the history of two branches by creating a new merge commit with two parents.',
        mentalModel: 'A merge is like merging two rivers - the waters (commits) from both rivers flow together into one. Git creates a special commit that points to both source branches.',
        command: 'git merge feature-branch',
        visualization: 'three-way-merge',
        commonMistakes: [
          'Not understanding fast-forward merges vs regular merges',
          'Creating unnecessary merge commits',
          'Not resolving merge conflicts properly'
        ]
      },
      {
        id: 'fast-forward-merge',
        name: 'Fast-forward Merge',
        difficulty: 'beginner',
        definition: 'A fast-forward merge occurs when the target branch is directly ahead of the source branch.',
        mentalModel: 'In a fast-forward, Git simply moves the branch pointer forward to point at the source commit. It\'s like fast-forwarding a tape to catch up.',
        command: 'git checkout main\ngit merge feature-branch (if feature is ahead of main)',
        visualization: 'fast-forward',
        commonMistakes: [
          'Thinking all merges create merge commits',
          'Not understanding when fast-forward happens',
          'Disabling fast-forward when you don\'t need to'
        ]
      },
      {
        id: 'three-way-merge',
        name: 'Three-way Merge',
        difficulty: 'intermediate',
        definition: 'A three-way merge combines divergent histories by using a common ancestor commit.',
        mentalModel: 'Git looks at three snapshots: the current branch, the branch being merged, and their common ancestor. It creates a new commit that combines changes from both sides.',
        command: 'git merge --no-ff feature-branch (force a merge commit)',
        visualization: 'three-way-diagram',
        commonMistakes: [
          'Not understanding the role of the common ancestor',
          'Being confused by merge conflicts',
          'Not reviewing merge commits carefully'
        ]
      },
      {
        id: 'merge-conflicts',
        name: 'Merge Conflicts',
        difficulty: 'intermediate',
        definition: 'Merge conflicts occur when Git cannot automatically resolve differences between branches.',
        mentalModel: 'A conflict is like two people editing the same sentence differently. Git marks the conflicts and lets you decide which version to keep or how to combine them.',
        command: 'git status (shows conflicted files)\ngit add (after resolving)',
        visualization: 'conflict-resolution',
        commonMistakes: [
          'Panic when seeing conflict markers',
          'Choosing the wrong side of a conflict',
          'Forgetting to git add after resolving conflicts'
        ]
      },
      {
        id: 'rebase',
        name: 'Rebase',
        difficulty: 'intermediate',
        definition: 'Rebase moves or combines a sequence of commits to a new base commit.',
        mentalModel: 'Rebase is like taking a stack of cards, moving the stack to a different table, and then dealing them out again. It creates new commits with new hashes.',
        command: 'git checkout feature\ngit rebase main',
        visualization: 'rebase-animation',
        commonMistakes: [
          'Rebasing commits that have been shared (pushed) with others',
          'Not understanding rebase creates new commits with new hashes',
          'Using rebase when merge would be more appropriate'
        ]
      },
      {
        id: 'rebase-vs-merge',
        name: 'Rebase vs Merge',
        difficulty: 'intermediate',
        definition: 'Merge preserves true history; rebase creates a linear history by rewriting commits.',
        mentalModel: 'Merge is honest about history (shows diverging branches). Rebase creates a cleaner linear history but changes commit hashes and can hide what really happened.',
        command: 'git merge vs git rebase',
        visualization: 'merge-rebase-comparison',
        commonMistakes: [
          'Choosing rebase or merge without understanding the trade-offs',
          'Rebasing shared history and causing confusion for others',
          'Always using one or the other without considering the context'
        ]
      }
    ]
  },
  {
    name: 'Undoing Changes',
    concepts: [
      {
        id: 'reset',
        name: 'Reset (soft, mixed, hard)',
        difficulty: 'intermediate',
        definition: 'Reset moves HEAD and optionally updates the staging area and working directory.',
        mentalModel: 'Reset is like rewinding a tape. Soft rewinds just the position (HEAD), mixed rewinds position and clears the review tray (staging), hard rewinds everything including your work.',
        command: 'git reset --soft HEAD~1 (keep changes staged)\ngit reset --mixed HEAD~1 (keep changes unstaged)\ngit reset --hard HEAD~1 (discard changes)',
        visualization: 'reset-modes',
        commonMistakes: [
          'Using --hard reset without understanding it discards work',
          'Not knowing which reset mode to use',
          'Resetting shared commits and confusing others'
        ]
      },
      {
        id: 'revert',
        name: 'Revert',
        difficulty: 'intermediate',
        definition: 'Revert creates a new commit that undoes changes from a previous commit without removing it from history.',
        mentalModel: 'Revert is like saying "Oops, let\'s undo that" in a meeting. You don\'t erase what was said; you add a new statement that says "ignore what I said earlier".',
        command: 'git revert a1b2c3d',
        visualization: 'revert-new-commit',
        commonMistakes: [
          'Confusing revert with reset',
          'Reverting a revert commit (double revert)',
          'Not understanding revert is safer for shared history'
        ]
      },
      {
        id: 'stash',
        name: 'Stash',
        difficulty: 'intermediate',
        definition: 'Stash temporarily shelves changes you\'ve made, allowing you to work on something else.',
        mentalModel: 'Stash is like putting work in a drawer. You can work on something else, then come back and get your work out of the drawer.',
        command: 'git stash\ngit stash pop (restore and remove)\ngit stash apply (restore and keep)',
        visualization: 'stash-stack',
        commonMistakes: [
          'Stashing large chunks of work instead of committing',
          'Forgetting about stashed changes',
          'Not understanding that stash doesn\'t create commits'
        ]
      }
    ]
  },
  {
    name: 'Remote Repositories',
    concepts: [
      {
        id: 'remote-repos',
        name: 'Remote Repositories',
        difficulty: 'beginner',
        definition: 'A remote repository is a version of your project hosted on the internet or network.',
        mentalModel: 'A remote is like a backup server or shared folder. It holds a copy of your repository that others can access.',
        command: 'git remote add origin https://github.com/user/repo.git',
        visualization: 'remote-connection',
        commonMistakes: [
          'Not understanding that remotes are just other copies of your repo',
          'Pushing without pulling first when there are remote changes',
          'Having multiple remotes and getting confused'
        ]
      },
      {
        id: 'origin-upstream',
        name: 'Origin & Upstream',
        difficulty: 'beginner',
        definition: 'Origin is the default name for the primary remote repository. Upstream is the remote you originally forked from.',
        mentalModel: 'Origin is your copy on GitHub. Upstream is the original repository you forked. You pull from upstream and push to origin.',
        command: 'git remote add origin URL\ngit remote add upstream URL',
        visualization: 'fork-upstream',
        commonMistakes: [
          'Not understanding the difference between origin and upstream',
          'Pulling from the wrong remote',
          'Not configuring upstream for forks'
        ]
      },
      {
        id: 'fetch-pull',
        name: 'Fetch vs Pull',
        difficulty: 'beginner',
        definition: 'Fetch downloads remote data without merging. Pull fetches and immediately merges the changes.',
        mentalModel: 'Fetch is like downloading email to your inbox without reading it. Pull is like downloading AND reading it. Fetch lets you review before integrating.',
        command: 'git fetch origin\ngit pull origin',
        visualization: 'fetch-pull-diagram',
        commonMistakes: [
          'Always pulling without fetching first to see what\'s coming',
          'Not understanding what fetch actually does',
          'Pulling without reviewing the changes'
        ]
      },
      {
        id: 'push',
        name: 'Push',
        difficulty: 'beginner',
        definition: 'Push uploads your local commits to a remote repository.',
        mentalModel: 'Push is like uploading your work to a shared server. Once pushed, others can see and use your changes.',
        command: 'git push origin main',
        visualization: 'push-animation',
        commonMistakes: [
          'Pushing untested or broken code',
          'Force pushing and overwriting others\' work',
          'Not pulling before pushing when there are remote changes'
        ]
      },
      {
        id: 'pull-requests',
        name: 'Pull Requests (Conceptual)',
        difficulty: 'intermediate',
        definition: 'A pull request is a way to propose changes to a codebase and request that they be reviewed and merged.',
        mentalModel: 'A PR is like asking to merge your work into the main project. It shows the changes, allows discussion, and lets others review before it becomes part of the official code.',
        command: 'git checkout -b feature\n(make changes)\ngit push origin feature\n(create PR on GitHub/GitLab)',
        visualization: 'pr-workflow',
        commonMistakes: [
          'Including too many changes in a single PR',
          'Not addressing review comments',
          'Making PRs without adequate testing'
        ]
      }
    ]
  },
  {
    name: 'Advanced Git',
    concepts: [
      {
        id: 'cherry-pick',
        name: 'Cherry-pick',
        difficulty: 'advanced',
        definition: 'Cherry-pick applies the changes introduced by some existing commits to your current branch.',
        mentalModel: 'Cherry-pick is like taking a specific fruit from a tree and moving it to another. You pick exactly the commits you want, ignoring others.',
        command: 'git cherry-pick a1b2c3d',
        visualization: 'cherry-pick-animation',
        commonMistakes: [
          'Cherry-picking many commits (rebase is better for this)',
          'Not understanding it creates new commits with new hashes',
          'Cherry-picking from shared history and causing conflicts'
        ]
      },
      {
        id: 'bisect',
        name: 'Bisect (Conceptual)',
        difficulty: 'advanced',
        definition: 'Git bisect uses binary search to find which commit introduced a bug.',
        mentalModel: 'Bisect is like a game of "hot or cold" for bugs. You tell Git when a bug exists and when it doesn\'t, and Git efficiently narrows down the exact commit that caused it.',
        command: 'git bisect start\ngit bisect bad\ngit bisect good <commit>\ngit bisect reset (when done)',
        visualization: 'bisect-search',
        commonMistakes: [
          'Not marking commits correctly as good or bad',
          'Interrupting bisect without resetting',
          'Not understanding bisect\'s binary search algorithm'
        ]
      },
      {
        id: 'tags',
        name: 'Tags',
        difficulty: 'beginner',
        definition: 'Tags are references that point to specific points in Git history, typically used for release versions.',
        mentalModel: 'Tags are like bookmarks in a book. They mark important points like version releases that you want to easily find later.',
        command: 'git tag v1.0.0\ngit tag -a v1.0.0 -m "Release version 1.0.0"',
        visualization: 'tags-on-graph',
        commonMistakes: [
          'Not tagging releases',
          'Using commit hashes instead of tags for releases',
          'Forgetting to push tags to remotes'
        ]
      },
      {
        id: 'git-internals',
        name: 'Git Internals',
        difficulty: 'advanced',
        definition: 'Git stores data as objects: blobs (file content), trees (directory structure), and commits (snapshots with metadata).',
        mentalModel: 'Git\'s database is like a filing system. Blobs are the file contents, trees are the folders, and commits are the archive boxes that tie everything together with metadata.',
        command: 'git cat-file -p <hash> (inspect objects)\ngit ls-tree (view tree objects)',
        visualization: 'git-objects-diagram',
        commonMistakes: [
          'Not understanding that commits point to trees, not files',
          'Thinking Git stores diffs (it stores snapshots)',
          'Not grasping how objects are linked together'
        ]
      }
    ]
  }
];

export const allConcepts = conceptGroups.flatMap(group => group.concepts);

export function getConceptById(id) {
  return allConcepts.find(c => c.id === id);
}