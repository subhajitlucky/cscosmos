import variablesScope from './variablesScope.js';
import variables from './variables.js';
import dataTypes from './dataTypes.js';
import operators from './operators.js';
import controlFlow from './controlFlow.js';
import functionsBasics from './functionsBasics.js';
import objects from './objects.js';
import arrays from './arrays.js';
import strings from './strings.js';
import typeCoercion from './typeCoercion.js';
import literalsSyntax from './literalsSyntax.js';
import callbacks from './callbacks.js';
import higherOrderFunctions from './higherOrderFunctions.js';
import scopeChain from './scopeChain.js';
import closures from './closures.js';
import executionContext from './executionContext.js';
import thisBinding from './thisBinding.js';
import functionMethods from './functionMethods.js';
import argumentsRest from './argumentsRest.js';
import arrowFunctions from './arrowFunctions.js';
import prototypeChain from './prototypeChain.js';
import constructorFunctions from './constructorFunctions.js';
import classes from './classes.js';
import regex from './regex.js';
import errors from './errors.js';
import eventLoop from './eventLoop.js';
import microtasks from './microtasks.js';
import promises from './promises.js';
import asyncAwait from './asyncAwait.js';
import modules from './modules.js';
import templateLiterals from './templateLiterals.js';
import typedArrays from './typedArrays.js';
import numbers from './numbers.js';
import math from './math.js';
import bigint from './bigint.js';
import date from './date.js';
import intl from './intl.js';
import json from './json.js';
import dynamicImports from './dynamicImports.js';
import propertyDescriptors from './propertyDescriptors.js';
import iterationProtocols from './iterationProtocols.js';
import mapSet from './mapSet.js';
import generators from './generators.js';
import functionsContent from './functions.js';

import specInternals from './specInternals.js';
import memoryModel from './memoryModel.js';
import sharedMemory from './sharedMemory.js';
import asyncPatterns from './asyncPatterns.js';
import metaprogramming from './metaprogramming.js';
import evalContent from './eval.js';
import security from './security.js';
import legacy from './legacy.js';

export const topicContents = {
    'variables-scope': variablesScope,
    'data-types': dataTypes,
    'operators': operators,
    'control-flow': controlFlow,
    'functions-basics': functionsBasics,
    'objects': objects,
    'arrays': arrays,
    'strings': strings,
    'type-coercion': typeCoercion,
    'literals-syntax': literalsSyntax,
    'callbacks': callbacks,
    'higher-order-functions': higherOrderFunctions,
    'scope-chain': scopeChain,
    'closures': closures,
    'execution-context': executionContext,
    'this-binding': thisBinding,
    'function-methods': functionMethods,
    'arguments-rest': argumentsRest,
    'arrow-functions': arrowFunctions,
    'prototype-chain': prototypeChain,
    'constructor-functions': constructorFunctions,
    'classes': classes,
    'regex': regex,
    'errors': errors,
    'event-loop': eventLoop,
    'microtasks': microtasks,
    'promises': promises,
    'async-await': asyncAwait,
    'modules': modules,
    'property-descriptors': propertyDescriptors,
    'iteration-protocols': iterationProtocols,
    'map-set': mapSet,
    'generators': generators,
    'template-literals': templateLiterals,
    'typed-arrays': typedArrays,
    'numbers': numbers,
    'math': math,
    'bigint': bigint,
    'date': date,
    'intl': intl,
    'json': json,
    'dynamic-imports': dynamicImports,
    'spec-internals': specInternals,
    'memory-model': memoryModel,
    'shared-memory': sharedMemory,
    'async-patterns': asyncPatterns,
    'metaprogramming': metaprogramming,
    'eval': evalContent,
    'security': security,
    'legacy': legacy,
    variables,
    functions: functionsContent,
};

export const getTopicContent = (topicId) => {
    const raw = topicContents[topicId];
    if (!raw) return null;
    return raw.default || raw;
};

export default topicContents;
