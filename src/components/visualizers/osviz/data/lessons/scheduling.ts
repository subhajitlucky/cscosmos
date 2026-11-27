import type { OSLesson } from './types';

export const schedulingLessons: OSLesson[] = [
  {
    chapterId: 'scheduling-metrics',
    hook:
      'Every scheduling policy is judged by the same numbers. Learn the vocabulary once, and every algorithm becomes a comparison instead of a memorization exercise.',
    objectives: [
      'Define arrival, burst, completion, turnaround, waiting, and response time.',
      'Compute turnaround and waiting time from a Gantt chart.',
      'Explain throughput and CPU utilization.',
      'Read a process table and build a timeline.',
    ],
    sections: [
      {
        title: 'The process table',
        body:
          'Scheduling problems start with a table: process ID, arrival time, and burst time. Arrival time is when the process enters the ready queue. Burst time is how much CPU time it needs. A priority may also be given. From these inputs, a policy produces a timeline (Gantt chart) and a set of per-process completion times.',
        code: String.raw`Process  Arrival  Burst
P1       0        5
P2       1        3
P3       2        1`,
      },
      {
        title: 'The formulas',
        body:
          'Completion time is when the process finishes. Turnaround time is completion minus arrival. Waiting time is turnaround minus burst, which is the total time spent ready but not running. Response time is the first time the process gets the CPU minus its arrival. Average waiting and average turnaround are the sums divided by the number of processes.',
        code: String.raw`turnaround = completion - arrival
waiting    = turnaround - burst
response   = first_run - arrival

average_waiting = sum(waiting) / n`,
      },
      {
        title: 'A worked FCFS example',
        body:
          'Using the table above with FCFS, P1 runs 0–5, P2 runs 5–8, and P3 runs 8–9. Completion times are 5, 8, and 9. Turnaround is 5, 7, and 7. Waiting is 0, 4, and 6. Average waiting is (0 + 4 + 6) / 3 = 3.33. Average turnaround is (5 + 7 + 7) / 3 = 6.33. Every scheduling lesson will ask you to reproduce this kind of table.',
      },
    ],
    keyTakeaways: [
      'Turnaround = completion - arrival.',
      'Waiting = turnaround - burst.',
      'Response time measures the first CPU allocation, not completion.',
      'A Gantt chart is the source of truth for every metric.',
      'Averages are sums divided by the number of processes.',
    ],
    pitfalls: [
      'Using burst time instead of completion time for turnaround.',
      'Forgetting to subtract arrival time.',
      'Computing waiting time as completion minus burst without subtracting arrival.',
    ],
    focusPoints: [
      'Build a process table and a Gantt chart before computing anything.',
      'Double-check each metric with the formulas.',
      'Know which metric a policy is trying to optimize.',
    ],
    quiz: [
      {
        question: 'A process arrives at 2 and completes at 9. What is its turnaround time?',
        options: ['7', '9', '2', '11'],
        answer: 0,
        explanation: 'Turnaround is completion minus arrival: 9 - 2 = 7.',
      },
      {
        question: 'If turnaround is 7 and burst is 3, what is waiting time?',
        options: ['4', '3', '10', '7'],
        answer: 0,
        explanation: 'Waiting is turnaround minus burst: 7 - 3 = 4.',
      },
    ],
  },

  {
    chapterId: 'fcfs-scheduling',
    hook:
      'FCFS is the simplest scheduler: whoever arrives first runs first. It is easy to implement and easy to regret when one long job blocks everyone behind it.',
    objectives: [
      'Trace FCFS with arrival times and a Gantt chart.',
      'Compute completion, turnaround, and waiting times.',
      'Explain the convoy effect.',
      'Know when FCFS is acceptable and when it is not.',
    ],
    sections: [
      {
        title: 'The algorithm',
        body:
          'Sort the processes by arrival time. Keep a clock at zero. For each process in order, if the clock is earlier than its arrival, advance the clock to the arrival. Run the process for its full burst. Record the completion time. Because FCFS is non-preemptive, a running process is never interrupted.',
        code: String.raw`sort_by_arrival(processes);
time = 0;
for each p in processes:
    if time < p.arrival: time = p.arrival;
    start = time;
    time = time + p.burst;
    p.completion = time;`,
      },
      {
        title: 'Worked example',
        body:
          'Use P1 arrival 0 burst 5, P2 arrival 1 burst 3, P3 arrival 2 burst 1. P1 runs 0–5. P2 arrives at 1 but waits until 5, then runs 5–8. P3 arrives at 2 but waits until 8, then runs 8–9. Completion: 5, 8, 9. Turnaround: 5, 7, 7. Waiting: 0, 4, 6. Average waiting = 3.33.',
        code: String.raw`| P1 | P2 | P3 |
0    5    8    9

P1: completion 5, turnaround 5, waiting 0
P2: completion 8, turnaround 7, waiting 4
P3: completion 9, turnaround 7, waiting 6`,
      },
      {
        title: 'The convoy effect',
        body:
          'Suppose P1 has burst 20 and P2 and P3 have burst 1. P2 and P3 wait nearly 20 units behind P1. One long CPU-bound job can delay every short job behind it. This is the convoy effect. FCFS is fine for batch workloads where jobs are similar, but poor for interactive systems with mixed job lengths.',
      },
    ],
    keyTakeaways: [
      'FCFS runs processes in arrival order.',
      'It is non-preemptive.',
      'The convoy effect lets one long job delay short jobs.',
      'FCFS is simple but not good at minimizing average waiting time.',
      'Always account for idle time when the CPU waits for the next arrival.',
    ],
    pitfalls: [
      'Starting a process before its arrival time.',
      'Forgetting idle gaps in the Gantt chart.',
      'Assuming FCFS is fair to short jobs.',
    ],
    focusPoints: [
      'Trace FCFS with a clock and a sorted process list.',
      'Explain the convoy effect with a concrete example.',
      'Compute average waiting time from the completion times.',
    ],
    quiz: [
      {
        question: 'What is the main weakness of FCFS?',
        options: [
          'One long process can delay all later processes',
          'It requires a time quantum',
          'It always preempts',
          'It cannot handle arrival times',
        ],
        answer: 0,
        explanation:
          'A long-running process at the front of the queue creates the convoy effect.',
      },
      {
        question: 'P1 arrives at 0 with burst 4, P2 arrives at 2 with burst 2. When does P2 complete under FCFS?',
        options: ['4', '6', '2', '8'],
        answer: 1,
        explanation:
          'P1 runs 0–4. P2 starts at 4 and runs 4–6, so it completes at 6.',
      },
    ],
  },

  {
    chapterId: 'sjf-scheduling',
    hook:
      'Shortest Job First is the policy that proves why scheduling matters: it can reduce average waiting time dramatically, but only if you know how long each job will run.',
    objectives: [
      'Trace non-preemptive SJF with arrival times.',
      'Choose the shortest ready burst at each decision point.',
      'Compute the average waiting time.',
      'Explain why SJF can starve long jobs.',
    ],
    sections: [
      {
        title: 'The algorithm',
        body:
          'At each decision point, look at all processes that have arrived and are not finished. Choose the one with the smallest burst. Run it to completion. If no process has arrived, advance the clock to the next arrival. Non-preemptive SJF does not interrupt a running process even if a shorter job arrives later.',
        code: String.raw`time = 0;
while unfinished:
    ready = arrived processes
    if ready empty:
        time = next arrival
        continue
    p = shortest burst in ready
    start = time
    time = time + p.burst
    p.completion = time`,
      },
      {
        title: 'Worked example',
        body:
          'Processes: P1 arrival 0 burst 7, P2 arrival 2 burst 4, P3 arrival 4 burst 1, P4 arrival 5 burst 4. At time 0 only P1 is ready, so P1 runs 0–7. At time 7, P2, P3, and P4 are ready. P3 has the shortest burst (1), so P3 runs 7–8. Then P2 (4) runs 8–12, and P4 (4) runs 12–16. Completion: 7, 12, 8, 16. Waiting: 0, 6, 3, 7. Average waiting = 4.0.',
        code: String.raw`| P1      | P3 | P2   | P4   |
0         7    8      12     16

P1: wait 0, turnaround 7
P2: wait 6, turnaround 10
P3: wait 3, turnaround 4
P4: wait 7, turnaround 11`,
      },
      {
        title: 'Optimality and starvation',
        body:
          'When all processes arrive at the same time, SJF minimizes average waiting time. With arrivals, non-preemptive SJF is not always optimal; preemptive SRTF can do better. SJF also needs to know the burst time in advance, which real systems estimate from history. A stream of short jobs can starve a long job forever unless the scheduler uses aging.',
      },
    ],
    keyTakeaways: [
      'SJF picks the shortest ready burst at each decision point.',
      'It is non-preemptive by default.',
      'SJF minimizes average waiting time when all jobs arrive together.',
      'It requires burst-time estimates.',
      'Long jobs can starve.',
    ],
    pitfalls: [
      'Choosing a process that has not arrived yet.',
      'Preempting in non-preemptive SJF.',
      'Forgetting that SJF needs future knowledge or estimates.',
    ],
    focusPoints: [
      'Trace the ready set at every decision point.',
      'Compute waiting time from completion minus arrival minus burst.',
      'Explain why SJF is optimal only under a restricted assumption.',
    ],
    quiz: [
      {
        question: 'Which process does SJF choose next?',
        options: ['The one with the earliest arrival', 'The one with the shortest burst among ready processes', 'The one with the highest priority', 'The one with the longest burst'],
        answer: 1,
        explanation:
          'SJF chooses the shortest burst among the processes that have already arrived.',
      },
      {
        question: 'What is the main practical problem with SJF?',
        options: ['It cannot be implemented', 'It needs to know or estimate burst times', 'It always preempts', 'It ignores arrival times'],
        answer: 1,
        explanation:
          'The scheduler does not know the future burst time exactly, so it must estimate from history or be given the value.',
      },
    ],
  },

  {
    chapterId: 'srtf-scheduling',
    hook:
      'SRTF is SJF with a stopwatch. When a shorter job arrives, the running job is paused and the shorter one takes the CPU.',
    objectives: [
      'Trace SRTF step by step using remaining times.',
      'Explain when preemption occurs.',
      'Compare SRTF with non-preemptive SJF.',
      'Recognize the starvation risk.',
    ],
    sections: [
      {
        title: 'The algorithm',
        body:
          'At every arrival or completion, compare the remaining time of the running process with the burst time of the newly arrived process. If the newcomer is shorter, preempt. Otherwise continue. If the CPU is idle, start the shortest remaining job. SRTF always runs the process with the smallest remaining time among those that have arrived.',
        code: String.raw`time = 0;
while unfinished:
    ready = arrived unfinished processes
    p = smallest remaining time in ready
    run p for one unit
    decrement p.remaining
    if p.remaining == 0: complete p`,
      },
      {
        title: 'Worked example',
        body:
          'Processes: P1 arrival 0 burst 7, P2 arrival 2 burst 4, P3 arrival 4 burst 1. At 0, only P1 is ready, so P1 runs. At 2, P2 arrives with burst 4 while P1 has 5 remaining; P2 is shorter, so P2 preempts and runs 2–4. At 4, P3 arrives with burst 1 while P2 has 2 remaining; P3 preempts and runs 4–5. At 5, P2 has 2 remaining and P1 has 5; P2 runs 5–7. At 7, P1 runs 7–12. Completion: P1 12, P2 7, P3 5. Waiting: P1 5, P2 1, P3 0. Average waiting = 2.0.',
        code: String.raw`| P1 | P2 |P3| P2 | P1      |
0    2    4  5    7         12

P1: completion 12, wait 5
P2: completion 7,  wait 1
P3: completion 5,  wait 0`,
      },
      {
        title: 'SJF versus SRTF',
        body:
          'Non-preemptive SJF would let P1 finish to 7 before running P2, producing a higher average waiting time. SRTF is more responsive to short arrivals but causes more context switches and can starve long jobs. Both need burst estimates. SRTF is usually better for average waiting time when arrivals are unpredictable and short jobs matter.',
      },
    ],
    keyTakeaways: [
      'SRTF is preemptive SJF.',
      'Preempt when a newly arrived process has a shorter remaining time.',
      'SRTF can reduce average waiting time compared with SJF.',
      'It causes more context switches and can starve long jobs.',
    ],
    pitfalls: [
      'Comparing total burst instead of remaining time.',
      'Forgetting to account for the running process\'s remaining time at an arrival.',
      'Preempting when the newcomer is longer.',
    ],
    focusPoints: [
      'Maintain a remaining-time column for every process.',
      'Make a decision at every arrival and completion.',
      'Compare the final averages with SJF.',
    ],
    quiz: [
      {
        question: 'When does SRTF preempt the running process?',
        options: [
          'When a newly arrived process has a shorter remaining time',
          'At every clock tick',
          'When the process blocks',
          'Never',
        ],
        answer: 0,
        explanation:
          'SRTF compares the newcomer\'s burst with the running process\'s remaining time and preempts only if the newcomer is shorter.',
      },
      {
        question: 'What is the main cost of SRTF compared with SJF?',
        options: ['More context switches', 'No need for burst estimates', 'It cannot use arrival times', 'It always starves short jobs'],
        answer: 0,
        explanation:
          'Preemption increases the number of context switches, adding overhead.',
      },
    ],
  },

  {
    chapterId: 'round-robin-scheduling',
    hook:
      'Round Robin is the scheduler that makes a single CPU feel interactive. Every process gets a small slice, then goes to the back of the line.',
    objectives: [
      'Trace the ready queue for Round Robin.',
      'Run a full example with a time quantum.',
      'Explain how quantum size changes response time and overhead.',
      'Know why Round Robin is preemptive.',
    ],
    sections: [
      {
        title: 'The queue mechanics',
        body:
          'New arrivals join the ready queue. The scheduler takes the process at the front, runs it for at most one quantum, and then either completes it or sends it to the back of the queue. A process that blocks leaves the ready queue and returns when its event completes. The timer interrupt is what stops a process that uses its full quantum.',
        code: String.raw`queue = arrivals at time 0;
while unfinished:
    p = queue.pop_front();
    run(p, min(quantum, p.remaining));
    enqueue arrivals during the slice;
    if p.remaining > 0: queue.push_back(p);
    else: complete(p);`,
      },
      {
        title: 'Worked example',
        body:
          'Processes P1 burst 5, P2 burst 3, P3 burst 1, all arriving at 0. Quantum = 2. Timeline: P1 0–2, P2 2–4, P3 4–5, P1 5–7, P2 7–8, P1 8–9. Completion: P1 9, P2 8, P3 5. Waiting: P1 4, P2 5, P3 4. Average waiting = 4.33. Notice that P3, the shortest job, still gets an early response.',
        code: String.raw`| P1 | P2 |P3| P1 | P2 | P1 |
0    2    4  5    7    8    9`,
      },
      {
        title: 'Choosing the quantum',
        body:
          'If the quantum is very large, Round Robin degenerates into FCFS. If it is very small, the system spends too much time context switching and cache locality suffers. A good quantum is large enough to amortize the switch and small enough to keep response time acceptable. Round Robin is preemptive because the timer can stop a process at the end of its slice.',
      },
    ],
    keyTakeaways: [
      'Round Robin gives each process a fixed time quantum.',
      'The queue rotates after every slice.',
      'A large quantum behaves like FCFS.',
      'A tiny quantum wastes time on context switches.',
      'Round Robin is preemptive and favors response time.',
    ],
    pitfalls: [
      'Forgetting to enqueue arrivals before re-queueing the current process.',
      'Using a quantum larger than every burst and calling it Round Robin.',
      'Ignoring the context-switch cost of a tiny quantum.',
    ],
    focusPoints: [
      'Draw the ready queue after every slice.',
      'Compute completion times from the timeline.',
      'Explain the quantum trade-off in one sentence.',
    ],
    quiz: [
      {
        question: 'What happens when a process uses its full Round Robin quantum?',
        options: ['It is terminated', 'It goes to the back of the ready queue', 'It blocks forever', 'It gets a higher priority'],
        answer: 1,
        explanation:
          'The process is preempted and re-queued at the back, so other ready processes get a turn.',
      },
      {
        question: 'What does a very large Round Robin quantum approximate?',
        options: ['FCFS', 'SJF', 'Priority scheduling', 'Real-time scheduling'],
        answer: 0,
        explanation:
          'If the quantum is larger than the remaining burst, each process runs to completion in arrival order, which is FCFS.',
      },
    ],
  },

  {
    chapterId: 'priority-scheduling',
    hook:
      'Priority scheduling encodes importance. The highest-priority ready process runs next — and low-priority processes may never run unless you add aging.',
    objectives: [
      'Trace non-preemptive priority scheduling.',
      'Decide which priority number means higher priority.',
      'Explain starvation and aging.',
      'Compare priority scheduling with SJF.',
    ],
    sections: [
      {
        title: 'The algorithm',
        body:
          'Each process has a priority. At every decision point, choose the highest-priority process among those that have arrived. In non-preemptive priority, run it to completion. In preemptive priority, a newly arrived higher-priority process can interrupt the running one. Be explicit about direction: many systems treat a lower number as higher priority, but the convention is not universal.',
        code: String.raw`time = 0;
while unfinished:
    ready = arrived unfinished processes
    if ready empty: time = next arrival; continue
    p = ready with highest priority
    run p to completion
    p.completion = time`,
      },
      {
        title: 'Worked example',
        body:
          'Processes: P1 arrival 0 burst 5 priority 3, P2 arrival 0 burst 3 priority 1, P3 arrival 0 burst 8 priority 2. Lower number = higher priority. P2 runs 0–3, P3 runs 3–11, P1 runs 11–16. Completion: P2 3, P3 11, P1 16. Waiting: P2 0, P3 8, P1 11. Average waiting = 6.33. If P2 keeps arriving, P1 can starve.',
        code: String.raw`| P2 | P3       | P1    |
0    3          11      16`,
      },
      {
        title: 'Starvation and aging',
        body:
          'A low-priority process can wait indefinitely if higher-priority work keeps arriving. Aging gradually increases the priority of waiting processes, so even a low-priority job eventually becomes competitive. Another option is to reserve a share of CPU time for each priority class. Priority scheduling is useful when importance is real, but it needs a starvation policy.',
      },
    ],
    keyTakeaways: [
      'Priority scheduling chooses the highest-priority ready process.',
      'Lower number often means higher priority, but check the convention.',
      'Non-preemptive priority runs the chosen process to completion.',
      'Low-priority processes can starve.',
      'Aging raises priority over time to prevent starvation.',
    ],
    pitfalls: [
      'Mixing up which priority number is higher.',
      'Running a process that has not arrived.',
      'Forgetting that preemptive priority can interrupt a running process.',
    ],
    focusPoints: [
      'State the priority direction before solving.',
      'Trace the ready set at each decision point.',
      'Explain aging with a concrete low-priority process.',
    ],
    quiz: [
      {
        question: 'In a system where lower numbers mean higher priority, which process runs first?',
        options: ['Priority 5', 'Priority 1', 'The first to arrive', 'The longest burst'],
        answer: 1,
        explanation:
          'With lower numbers meaning higher priority, priority 1 is the highest-priority process.',
      },
      {
        question: 'What problem does aging solve?',
        options: ['Starvation of low-priority processes', 'Page faults', 'Disk fragmentation', 'Context-switch overhead'],
        answer: 0,
        explanation:
          'Aging gradually raises the priority of waiting processes so they eventually run.',
      },
    ],
  },

  {
    chapterId: 'preemptive-vs-nonpreemptive',
    hook:
      'The scheduler has two very different powers: wait for a process to yield, or take the CPU away. The choice changes responsiveness, overhead, and correctness.',
    objectives: [
      'Define preemptive and non-preemptive scheduling.',
      'Identify the events that can trigger preemption.',
      'Explain the cost of preemption.',
      'Classify common algorithms as preemptive or non-preemptive.',
    ],
    sections: [
      {
        title: 'Non-preemptive scheduling',
        body:
          'A non-preemptive scheduler lets a running process continue until it blocks or finishes. FCFS and non-preemptive SJF/priority work this way. The advantage is fewer context switches and simpler kernel data structures. The disadvantage is that a long or buggy CPU-bound process can delay everyone behind it, and interactive response can suffer.',
      },
      {
        title: 'Preemptive scheduling',
        body:
          'A preemptive scheduler can interrupt a running process at a safe point, usually on a timer tick or when a higher-priority process arrives. Round Robin, SRTF, and preemptive priority are preemptive. The timer interrupt is the key mechanism: without it, a process could keep the CPU forever. Preemption improves responsiveness but requires careful synchronization and adds switch overhead.',
        code: String.raw`/* timer-driven preemption */
on_timer_tick():
    if current_process_used_quantum():
        current.state = READY
        schedule_next()`,
      },
      {
        title: 'Choosing a policy',
        body:
          'Interactive systems favor preemption because response time matters. Batch systems may prefer non-preemptive policies to reduce overhead. Real-time systems use preemption with bounded latency. The right answer depends on the workload and the metric, not on a universal rule.',
      },
    ],
    keyTakeaways: [
      'Non-preemptive scheduling waits for the process to block or finish.',
      'Preemptive scheduling can interrupt a running process.',
      'Timer interrupts enable preemption.',
      'Preemption improves responsiveness but adds overhead.',
      'FCFS and non-preemptive SJF are non-preemptive; RR and SRTF are preemptive.',
    ],
    pitfalls: [
      'Assuming all priority scheduling is preemptive; it can be either.',
      'Ignoring the cost of frequent preemption.',
      'Forgetting that preemption needs a safe point and saved state.',
    ],
    focusPoints: [
      'Classify FCFS, SJF, SRTF, RR, and priority.',
      'Name the event that triggers preemption.',
      'Explain the trade-off in terms of response time and overhead.',
    ],
    quiz: [
      {
        question: 'Which mechanism commonly triggers preemption?',
        options: ['A timer interrupt', 'A file close', 'A compiler warning', 'A disk format'],
        answer: 0,
        explanation:
          'A timer interrupt periodically returns control to the kernel so it can schedule another process.',
      },
      {
        question: 'Which algorithm is preemptive?',
        options: ['FCFS', 'Non-preemptive SJF', 'Round Robin', 'None of these'],
        answer: 2,
        explanation:
          'Round Robin preempts a process when its time quantum expires.',
      },
    ],
  },
];
