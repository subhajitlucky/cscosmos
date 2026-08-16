import { EmbeddedPlayground } from "../EmbeddedPlayground";
import { solidityBasics } from "../../../data/topics/solidity-basics";

export function SolidityBasicsViz() {
    return (
        <EmbeddedPlayground
            initialCode={solidityBasics.practicalExample.code}
            mode="stack"
        />
    );
}
