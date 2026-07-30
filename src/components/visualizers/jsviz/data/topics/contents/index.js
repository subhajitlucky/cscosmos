/* eslint-disable */
import variablesScope from './variablesScope';
import variables from './variables';
import dataTypes from './dataTypes';
import operators from './operators';
import controlFlow from './controlFlow';
import functionsBasics from './functionsBasics';
import objects from './objects';
import arrays from './arrays';
import strings from './strings';
import typeCoercion from './typeCoercion';
import literalsSyntax from './literalsSyntax';
import callbacks from './callbacks';
import higherOrderFunctions from './higherOrderFunctions';
import scopeChain from './scopeChain';
import closures from './closures';
import executionContext from './executionContext';
import thisBinding from './thisBinding';
import functionMethods from './functionMethods';
import argumentsRest from './argumentsRest';
import arrowFunctions from './arrowFunctions';
import prototypeChain from './prototypeChain';
import constructorFunctions from './constructorFunctions';
import classes from './classes';
import regex from './regex';
import errors from './errors';
import eventLoop from './eventLoop';
import microtasks from './microtasks';
import promises from './promises';
import asyncAwait from './asyncAwait';
import modules from './modules';
import templateLiterals from './templateLiterals';
import typedArrays from './typedArrays';
import numbers from './numbers';
import math from './math';
import bigint from './bigint';
import date from './date';
import intl from './intl';
import json from './json';
import dynamicImports from './dynamicImports';
import propertyDescriptors from './propertyDescriptors';
import iterationProtocols from './iterationProtocols';
import mapSet from './mapSet';
import generators from './generators';
import functionsContent from './functions';

import specInternals from './specInternals';
import memoryModel from './memoryModel';
import sharedMemory from './sharedMemory';
import asyncPatterns from './asyncPatterns';
import metaprogramming from './metaprogramming';
import evalContent from './eval';
import security from './security';
import legacy from './legacy';

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

export const getTopicContent = (topicId) => topicContents[topicId] || null;

export default topicContents;

