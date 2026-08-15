import { conceptVisualScenes } from "../../content/concept-visual-scenes";

export type DiagramStep = (typeof conceptVisualScenes)[string]["steps"][number];
