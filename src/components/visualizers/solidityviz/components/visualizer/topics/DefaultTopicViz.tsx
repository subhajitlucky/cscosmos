import { EmbeddedPlayground } from "../EmbeddedPlayground";
import { topics } from "../../../data/topics";

interface Props {
    topicId: string;
}

export function DefaultTopicViz({ topicId }: Props) {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return <div>Topic data not found</div>;

    return (
        <EmbeddedPlayground
            initialCode={topic.practicalExample.code}
            mode={topic.visualizer || 'stack'}
        />
    );
}
