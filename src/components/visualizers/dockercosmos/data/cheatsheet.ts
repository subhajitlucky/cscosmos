export interface DockerCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const DOCKER_CHEATSHEET: DockerCheatSheetSection[] = [
  {
    id: 'docker-cli',
    title: 'Docker Production Operations & Debugging',
    category: 'Docker CLI',
    snippets: [
      {
        title: 'Run with Strict Resource Limits (cgroups)',
        description: 'Cap memory and CPU cores with no swap overflow',
        code: `docker run -d \\
  --name production-api \\
  --memory="512m" \\
  --memory-swap="512m" \\
  --cpus="1.5" \\
  --restart=unless-stopped \\
  -p 8080:8080 \\
  my-image:v1.0`,
        tip: 'Setting memory-swap equal to memory disables swap completely, ensuring deterministic OOM behavior.'
      },
      {
        title: 'Deep Container Inspection & IP Discovery',
        description: 'Format JSON output for specific container attributes',
        code: `# Get Container IP Address:
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name

# Check Memory OOM Kill Status:
docker inspect -f '{{.State.OOMKilled}}' container_name`,
        tip: 'Use -f Go template formatting to avoid piping huge JSON blobs through jq.'
      }
    ]
  },
  {
    id: 'k8s-kubectl',
    title: 'Kubernetes Production Debugging & Troubleshooting',
    category: 'Kubernetes',
    snippets: [
      {
        title: 'Debug Crashing Pods (CrashLoopBackOff)',
        description: 'Inspect previous container logs before crash restart',
        code: `# View logs of previous crashed container instance:
kubectl logs -p -c app-container pod-name

# Describe pod events (OOMKilled, FailedScheduling, ProbeFailures):
kubectl describe pod pod-name`,
        tip: '-p (or --previous) is essential for seeing the stack trace that caused the process to exit.'
      },
      {
        title: 'Ephemeral Debug Container Injection',
        description: 'Attach interactive debug container with curl/netshoot to a running distroless Pod',
        code: `kubectl debug -it pod-name --image=nicolaka/netshoot --target=app-container`,
        tip: 'Eliminates the need to install curl or net-tools inside minimal production production images.'
      }
    ]
  }
];
