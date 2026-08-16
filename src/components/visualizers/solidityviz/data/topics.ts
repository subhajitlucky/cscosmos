import { type LucideIcon } from "lucide-react";

// Import all topics
import { solidityBasics } from "./topics/solidity-basics";
import { typesDataLocations } from "./topics/types-data-locations";
import { functionsModifiers } from "./topics/functions-modifiers";
import { controlFlowErrors } from "./topics/control-flow-errors";
import { mappingsArrays } from "./topics/mappings-arrays";
import { structsEnums } from "./topics/structs-enums";
import { eventsLogs } from "./topics/events-logs";
import { globalVars } from "./topics/global-vars";
import { storageLayout } from "./topics/storage-layout";
import { memoryCalldata } from "./topics/memory-calldata";
import { evmModel } from "./topics/evm-model";
import { fallbackReceive } from "./topics/fallback-receive";
import { gasOptimization } from "./topics/gas-optimization";
import { reentrancy } from "./topics/reentrancy";
import { overflowUnderflow } from "./topics/overflow-underflow";
import { accessControl } from "./topics/access-control";
import { signatureVerification } from "./topics/signature-verification";
import { inheritance } from "./topics/inheritance";
import { interfaces } from "./topics/interfaces";
import { libraries } from "./topics/libraries";
import { delegatecall } from "./topics/delegatecall";
import { externalCalls } from "./topics/external-calls";
import { deployment } from "./topics/deployment";
import { testing } from "./topics/testing";

export type TopicSection = {
    title: string;
    content: string;
    code?: string;
    image?: string;
}

export type Topic = {
    id: string;
    title: string;
    category: "Fundamentals" | "Internals" | "Gas" | "Security" | "Advanced";
    icon: LucideIcon;
    shortDescription: string;
    definition: string;
    useCases: string[];
    syntaxExample: string;
    practicalExample: {
        description: string;
        code: string;
    };
    concepts?: { label: string; explanation: string }[];
    visualizer?: "stack" | "memory" | "storage" | "gas" | "reentrancy" | "none";
    visualizerContext?: any;

    // Mastery Section
    mentalModel?: {
        title: string;
        description: string;
    };
    underTheHood?: {
        description: string;
        diagram?: string; // ASCII or path
        opcodes?: string[];
    };
    gasAnalysis?: {
        description: string;
        tips: string[];
    };
    securityInsights?: {
        description: string;
        risks: string[];
    };
}

export const topics: Topic[] = [
    // Fundamentals
    solidityBasics,
    typesDataLocations,
    functionsModifiers,
    controlFlowErrors,
    mappingsArrays,
    structsEnums,
    eventsLogs,

    // Internals
    globalVars,
    storageLayout,
    memoryCalldata,
    evmModel,
    fallbackReceive,

    // Gas
    gasOptimization,

    // Security
    reentrancy,
    overflowUnderflow,
    accessControl,
    signatureVerification,

    // Advanced
    inheritance,
    interfaces,
    libraries,
    delegatecall,
    externalCalls,
    deployment,
    testing
];
