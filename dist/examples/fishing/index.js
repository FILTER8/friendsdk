"use client";
"use client";
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/abitype/dist/esm/version.js
var version;
var init_version = __esm({
  "node_modules/abitype/dist/esm/version.js"() {
    version = "1.2.3";
  }
});

// node_modules/abitype/dist/esm/errors.js
var BaseError;
var init_errors = __esm({
  "node_modules/abitype/dist/esm/errors.js"() {
    init_version();
    BaseError = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = args.cause instanceof _BaseError ? args.cause.details : args.cause?.message ? args.cause.message : args.details;
        const docsPath8 = args.cause instanceof _BaseError ? args.cause.docsPath || args.docsPath : args.docsPath;
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsPath8 ? [`Docs: https://abitype.dev${docsPath8}`] : [],
          ...details ? [`Details: ${details}`] : [],
          `Version: abitype@${version}`
        ].join("\n");
        super(message);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "AbiTypeError"
        });
        if (args.cause)
          this.cause = args.cause;
        this.details = details;
        this.docsPath = docsPath8;
        this.metaMessages = args.metaMessages;
        this.shortMessage = shortMessage;
      }
    };
  }
});

// node_modules/abitype/dist/esm/regex.js
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}
var bytesRegex, integerRegex, isTupleRegex;
var init_regex = __esm({
  "node_modules/abitype/dist/esm/regex.js"() {
    bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
    integerRegex = /^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
    isTupleRegex = /^\(.+?\).*?$/;
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && "components" in abiParameter) {
    type = "(";
    const length = abiParameter.components.length;
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1)
        type += ", ";
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array || ""}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  if ("indexed" in abiParameter && abiParameter.indexed)
    type = `${type} indexed`;
  if (abiParameter.name)
    return `${type} ${abiParameter.name}`;
  return type;
}
var tupleRegex;
var init_formatAbiParameter = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiParameter.js"() {
    init_regex();
    tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js
function formatAbiParameters(abiParameters) {
  let params = "";
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1)
      params += ", ";
  }
  return params;
}
var init_formatAbiParameters = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiParameters.js"() {
    init_formatAbiParameter();
  }
});

// node_modules/abitype/dist/esm/human-readable/formatAbiItem.js
function formatAbiItem(abiItem) {
  if (abiItem.type === "function")
    return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== "nonpayable" ? ` ${abiItem.stateMutability}` : ""}${abiItem.outputs?.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ""}`;
  if (abiItem.type === "event")
    return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "error")
    return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === "constructor")
    return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  if (abiItem.type === "fallback")
    return `fallback() external${abiItem.stateMutability === "payable" ? " payable" : ""}`;
  return "receive() external payable";
}
var init_formatAbiItem = __esm({
  "node_modules/abitype/dist/esm/human-readable/formatAbiItem.js"() {
    init_formatAbiParameters();
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/signatures.js
function isErrorSignature(signature) {
  return errorSignatureRegex.test(signature);
}
function execErrorSignature(signature) {
  return execTyped(errorSignatureRegex, signature);
}
function isEventSignature(signature) {
  return eventSignatureRegex.test(signature);
}
function execEventSignature(signature) {
  return execTyped(eventSignatureRegex, signature);
}
function isFunctionSignature(signature) {
  return functionSignatureRegex.test(signature);
}
function execFunctionSignature(signature) {
  return execTyped(functionSignatureRegex, signature);
}
function isStructSignature(signature) {
  return structSignatureRegex.test(signature);
}
function execStructSignature(signature) {
  return execTyped(structSignatureRegex, signature);
}
function isConstructorSignature(signature) {
  return constructorSignatureRegex.test(signature);
}
function execConstructorSignature(signature) {
  return execTyped(constructorSignatureRegex, signature);
}
function isFallbackSignature(signature) {
  return fallbackSignatureRegex.test(signature);
}
function execFallbackSignature(signature) {
  return execTyped(fallbackSignatureRegex, signature);
}
function isReceiveSignature(signature) {
  return receiveSignatureRegex.test(signature);
}
var errorSignatureRegex, eventSignatureRegex, functionSignatureRegex, structSignatureRegex, constructorSignatureRegex, fallbackSignatureRegex, receiveSignatureRegex, eventModifiers, functionModifiers;
var init_signatures = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/signatures.js"() {
    init_regex();
    errorSignatureRegex = /^error (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    eventSignatureRegex = /^event (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)$/;
    functionSignatureRegex = /^function (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*)\((?<parameters>.*?)\)(?: (?<scope>external|public{1}))?(?: (?<stateMutability>pure|view|nonpayable|payable{1}))?(?: returns\s?\((?<returns>.*?)\))?$/;
    structSignatureRegex = /^struct (?<name>[a-zA-Z$_][a-zA-Z0-9$_]*) \{(?<properties>.*?)\}$/;
    constructorSignatureRegex = /^constructor\((?<parameters>.*?)\)(?:\s(?<stateMutability>payable{1}))?$/;
    fallbackSignatureRegex = /^fallback\(\) external(?:\s(?<stateMutability>payable{1}))?$/;
    receiveSignatureRegex = /^receive\(\) external payable$/;
    eventModifiers = /* @__PURE__ */ new Set(["indexed"]);
    functionModifiers = /* @__PURE__ */ new Set([
      "calldata",
      "memory",
      "storage"
    ]);
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/abiItem.js
var UnknownTypeError, UnknownSolidityTypeError;
var init_abiItem = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/abiItem.js"() {
    init_errors();
    UnknownTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [
            `Type "${type}" is not a valid ABI type. Perhaps you forgot to include a struct signature?`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownTypeError"
        });
      }
    };
    UnknownSolidityTypeError = class extends BaseError {
      constructor({ type }) {
        super("Unknown type.", {
          metaMessages: [`Type "${type}" is not a valid ABI type.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSolidityTypeError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js
var InvalidParameterError, SolidityProtectedKeywordError, InvalidModifierError, InvalidFunctionModifierError, InvalidAbiTypeParameterError;
var init_abiParameter = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/abiParameter.js"() {
    init_errors();
    InvalidParameterError = class extends BaseError {
      constructor({ param }) {
        super("Invalid ABI parameter.", {
          details: param
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParameterError"
        });
      }
    };
    SolidityProtectedKeywordError = class extends BaseError {
      constructor({ param, name }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `"${name}" is a protected Solidity keyword. More info: https://docs.soliditylang.org/en/latest/cheatsheet.html`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "SolidityProtectedKeywordError"
        });
      }
    };
    InvalidModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidModifierError"
        });
      }
    };
    InvalidFunctionModifierError = class extends BaseError {
      constructor({ param, type, modifier }) {
        super("Invalid ABI parameter.", {
          details: param,
          metaMessages: [
            `Modifier "${modifier}" not allowed${type ? ` in "${type}" type` : ""}.`,
            `Data location can only be specified for array, struct, or mapping types, but "${modifier}" was given.`
          ]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidFunctionModifierError"
        });
      }
    };
    InvalidAbiTypeParameterError = class extends BaseError {
      constructor({ abiParameter }) {
        super("Invalid ABI parameter.", {
          details: JSON.stringify(abiParameter, null, 2),
          metaMessages: ["ABI parameter type is invalid."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidAbiTypeParameterError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/signature.js
var InvalidSignatureError, UnknownSignatureError, InvalidStructSignatureError;
var init_signature = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/signature.js"() {
    init_errors();
    InvalidSignatureError = class extends BaseError {
      constructor({ signature, type }) {
        super(`Invalid ${type} signature.`, {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidSignatureError"
        });
      }
    };
    UnknownSignatureError = class extends BaseError {
      constructor({ signature }) {
        super("Unknown signature.", {
          details: signature
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "UnknownSignatureError"
        });
      }
    };
    InvalidStructSignatureError = class extends BaseError {
      constructor({ signature }) {
        super("Invalid struct signature.", {
          details: signature,
          metaMessages: ["No properties exist."]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidStructSignatureError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/struct.js
var CircularReferenceError;
var init_struct = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/struct.js"() {
    init_errors();
    CircularReferenceError = class extends BaseError {
      constructor({ type }) {
        super("Circular reference detected.", {
          metaMessages: [`Struct "${type}" is a circular reference.`]
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "CircularReferenceError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js
var InvalidParenthesisError;
var init_splitParameters = __esm({
  "node_modules/abitype/dist/esm/human-readable/errors/splitParameters.js"() {
    init_errors();
    InvalidParenthesisError = class extends BaseError {
      constructor({ current, depth }) {
        super("Unbalanced parentheses.", {
          metaMessages: [
            `"${current.trim()}" has too many ${depth > 0 ? "opening" : "closing"} parentheses.`
          ],
          details: `Depth "${depth}"`
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "InvalidParenthesisError"
        });
      }
    };
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/cache.js
function getParameterCacheKey(param, type, structs) {
  let structKey = "";
  if (structs)
    for (const struct of Object.entries(structs)) {
      if (!struct)
        continue;
      let propertyKey = "";
      for (const property of struct[1]) {
        propertyKey += `[${property.type}${property.name ? `:${property.name}` : ""}]`;
      }
      structKey += `(${struct[0]}{${propertyKey}})`;
    }
  if (type)
    return `${type}:${param}${structKey}`;
  return `${param}${structKey}`;
}
var parameterCache;
var init_cache = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/cache.js"() {
    parameterCache = /* @__PURE__ */ new Map([
      // Unnamed
      ["address", { type: "address" }],
      ["bool", { type: "bool" }],
      ["bytes", { type: "bytes" }],
      ["bytes32", { type: "bytes32" }],
      ["int", { type: "int256" }],
      ["int256", { type: "int256" }],
      ["string", { type: "string" }],
      ["uint", { type: "uint256" }],
      ["uint8", { type: "uint8" }],
      ["uint16", { type: "uint16" }],
      ["uint24", { type: "uint24" }],
      ["uint32", { type: "uint32" }],
      ["uint64", { type: "uint64" }],
      ["uint96", { type: "uint96" }],
      ["uint112", { type: "uint112" }],
      ["uint160", { type: "uint160" }],
      ["uint192", { type: "uint192" }],
      ["uint256", { type: "uint256" }],
      // Named
      ["address owner", { type: "address", name: "owner" }],
      ["address to", { type: "address", name: "to" }],
      ["bool approved", { type: "bool", name: "approved" }],
      ["bytes _data", { type: "bytes", name: "_data" }],
      ["bytes data", { type: "bytes", name: "data" }],
      ["bytes signature", { type: "bytes", name: "signature" }],
      ["bytes32 hash", { type: "bytes32", name: "hash" }],
      ["bytes32 r", { type: "bytes32", name: "r" }],
      ["bytes32 root", { type: "bytes32", name: "root" }],
      ["bytes32 s", { type: "bytes32", name: "s" }],
      ["string name", { type: "string", name: "name" }],
      ["string symbol", { type: "string", name: "symbol" }],
      ["string tokenURI", { type: "string", name: "tokenURI" }],
      ["uint tokenId", { type: "uint256", name: "tokenId" }],
      ["uint8 v", { type: "uint8", name: "v" }],
      ["uint256 balance", { type: "uint256", name: "balance" }],
      ["uint256 tokenId", { type: "uint256", name: "tokenId" }],
      ["uint256 value", { type: "uint256", name: "value" }],
      // Indexed
      [
        "event:address indexed from",
        { type: "address", name: "from", indexed: true }
      ],
      ["event:address indexed to", { type: "address", name: "to", indexed: true }],
      [
        "event:uint indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ],
      [
        "event:uint256 indexed tokenId",
        { type: "uint256", name: "tokenId", indexed: true }
      ]
    ]);
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/utils.js
function parseSignature(signature, structs = {}) {
  if (isFunctionSignature(signature))
    return parseFunctionSignature(signature, structs);
  if (isEventSignature(signature))
    return parseEventSignature(signature, structs);
  if (isErrorSignature(signature))
    return parseErrorSignature(signature, structs);
  if (isConstructorSignature(signature))
    return parseConstructorSignature(signature, structs);
  if (isFallbackSignature(signature))
    return parseFallbackSignature(signature);
  if (isReceiveSignature(signature))
    return {
      type: "receive",
      stateMutability: "payable"
    };
  throw new UnknownSignatureError({ signature });
}
function parseFunctionSignature(signature, structs = {}) {
  const match = execFunctionSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "function" });
  const inputParams = splitParameters(match.parameters);
  const inputs = [];
  const inputLength = inputParams.length;
  for (let i = 0; i < inputLength; i++) {
    inputs.push(parseAbiParameter(inputParams[i], {
      modifiers: functionModifiers,
      structs,
      type: "function"
    }));
  }
  const outputs = [];
  if (match.returns) {
    const outputParams = splitParameters(match.returns);
    const outputLength = outputParams.length;
    for (let i = 0; i < outputLength; i++) {
      outputs.push(parseAbiParameter(outputParams[i], {
        modifiers: functionModifiers,
        structs,
        type: "function"
      }));
    }
  }
  return {
    name: match.name,
    type: "function",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs,
    outputs
  };
}
function parseEventSignature(signature, structs = {}) {
  const match = execEventSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "event" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], {
      modifiers: eventModifiers,
      structs,
      type: "event"
    }));
  return { name: match.name, type: "event", inputs: abiParameters };
}
function parseErrorSignature(signature, structs = {}) {
  const match = execErrorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "error" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "error" }));
  return { name: match.name, type: "error", inputs: abiParameters };
}
function parseConstructorSignature(signature, structs = {}) {
  const match = execConstructorSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "constructor" });
  const params = splitParameters(match.parameters);
  const abiParameters = [];
  const length = params.length;
  for (let i = 0; i < length; i++)
    abiParameters.push(parseAbiParameter(params[i], { structs, type: "constructor" }));
  return {
    type: "constructor",
    stateMutability: match.stateMutability ?? "nonpayable",
    inputs: abiParameters
  };
}
function parseFallbackSignature(signature) {
  const match = execFallbackSignature(signature);
  if (!match)
    throw new InvalidSignatureError({ signature, type: "fallback" });
  return {
    type: "fallback",
    stateMutability: match.stateMutability ?? "nonpayable"
  };
}
function parseAbiParameter(param, options) {
  const parameterCacheKey = getParameterCacheKey(param, options?.type, options?.structs);
  if (parameterCache.has(parameterCacheKey))
    return parameterCache.get(parameterCacheKey);
  const isTuple = isTupleRegex.test(param);
  const match = execTyped(isTuple ? abiParameterWithTupleRegex : abiParameterWithoutTupleRegex, param);
  if (!match)
    throw new InvalidParameterError({ param });
  if (match.name && isSolidityKeyword(match.name))
    throw new SolidityProtectedKeywordError({ param, name: match.name });
  const name = match.name ? { name: match.name } : {};
  const indexed = match.modifier === "indexed" ? { indexed: true } : {};
  const structs = options?.structs ?? {};
  let type;
  let components = {};
  if (isTuple) {
    type = "tuple";
    const params = splitParameters(match.type);
    const components_ = [];
    const length = params.length;
    for (let i = 0; i < length; i++) {
      components_.push(parseAbiParameter(params[i], { structs }));
    }
    components = { components: components_ };
  } else if (match.type in structs) {
    type = "tuple";
    components = { components: structs[match.type] };
  } else if (dynamicIntegerRegex.test(match.type)) {
    type = `${match.type}256`;
  } else if (match.type === "address payable") {
    type = "address";
  } else {
    type = match.type;
    if (!(options?.type === "struct") && !isSolidityType(type))
      throw new UnknownSolidityTypeError({ type });
  }
  if (match.modifier) {
    if (!options?.modifiers?.has?.(match.modifier))
      throw new InvalidModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
    if (functionModifiers.has(match.modifier) && !isValidDataLocation(type, !!match.array))
      throw new InvalidFunctionModifierError({
        param,
        type: options?.type,
        modifier: match.modifier
      });
  }
  const abiParameter = {
    type: `${type}${match.array ?? ""}`,
    ...name,
    ...indexed,
    ...components
  };
  parameterCache.set(parameterCacheKey, abiParameter);
  return abiParameter;
}
function splitParameters(params, result = [], current = "", depth = 0) {
  const length = params.trim().length;
  for (let i = 0; i < length; i++) {
    const char = params[i];
    const tail = params.slice(i + 1);
    switch (char) {
      case ",":
        return depth === 0 ? splitParameters(tail, [...result, current.trim()]) : splitParameters(tail, result, `${current}${char}`, depth);
      case "(":
        return splitParameters(tail, result, `${current}${char}`, depth + 1);
      case ")":
        return splitParameters(tail, result, `${current}${char}`, depth - 1);
      default:
        return splitParameters(tail, result, `${current}${char}`, depth);
    }
  }
  if (current === "")
    return result;
  if (depth !== 0)
    throw new InvalidParenthesisError({ current, depth });
  result.push(current.trim());
  return result;
}
function isSolidityType(type) {
  return type === "address" || type === "bool" || type === "function" || type === "string" || bytesRegex.test(type) || integerRegex.test(type);
}
function isSolidityKeyword(name) {
  return name === "address" || name === "bool" || name === "function" || name === "string" || name === "tuple" || bytesRegex.test(name) || integerRegex.test(name) || protectedKeywordsRegex.test(name);
}
function isValidDataLocation(type, isArray) {
  return isArray || type === "bytes" || type === "string" || type === "tuple";
}
var abiParameterWithoutTupleRegex, abiParameterWithTupleRegex, dynamicIntegerRegex, protectedKeywordsRegex;
var init_utils = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/utils.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_splitParameters();
    init_cache();
    init_signatures();
    abiParameterWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*(?:\spayable)?)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    abiParameterWithTupleRegex = /^\((?<type>.+?)\)(?<array>(?:\[\d*?\])+?)?(?:\s(?<modifier>calldata|indexed|memory|storage{1}))?(?:\s(?<name>[a-zA-Z$_][a-zA-Z0-9$_]*))?$/;
    dynamicIntegerRegex = /^u?int$/;
    protectedKeywordsRegex = /^(?:after|alias|anonymous|apply|auto|byte|calldata|case|catch|constant|copyof|default|defined|error|event|external|false|final|function|immutable|implements|in|indexed|inline|internal|let|mapping|match|memory|mutable|null|of|override|partial|private|promise|public|pure|reference|relocatable|return|returns|sizeof|static|storage|struct|super|supports|switch|this|true|try|typedef|typeof|var|view|virtual)$/;
  }
});

// node_modules/abitype/dist/esm/human-readable/runtime/structs.js
function parseStructs(signatures) {
  const shallowStructs = {};
  const signaturesLength = signatures.length;
  for (let i = 0; i < signaturesLength; i++) {
    const signature = signatures[i];
    if (!isStructSignature(signature))
      continue;
    const match = execStructSignature(signature);
    if (!match)
      throw new InvalidSignatureError({ signature, type: "struct" });
    const properties = match.properties.split(";");
    const components = [];
    const propertiesLength = properties.length;
    for (let k = 0; k < propertiesLength; k++) {
      const property = properties[k];
      const trimmed = property.trim();
      if (!trimmed)
        continue;
      const abiParameter = parseAbiParameter(trimmed, {
        type: "struct"
      });
      components.push(abiParameter);
    }
    if (!components.length)
      throw new InvalidStructSignatureError({ signature });
    shallowStructs[match.name] = components;
  }
  const resolvedStructs = {};
  const entries = Object.entries(shallowStructs);
  const entriesLength = entries.length;
  for (let i = 0; i < entriesLength; i++) {
    const [name, parameters] = entries[i];
    resolvedStructs[name] = resolveStructs(parameters, shallowStructs);
  }
  return resolvedStructs;
}
function resolveStructs(abiParameters = [], structs = {}, ancestors = /* @__PURE__ */ new Set()) {
  const components = [];
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    const isTuple = isTupleRegex.test(abiParameter.type);
    if (isTuple)
      components.push(abiParameter);
    else {
      const match = execTyped(typeWithoutTupleRegex, abiParameter.type);
      if (!match?.type)
        throw new InvalidAbiTypeParameterError({ abiParameter });
      const { array: array2, type } = match;
      if (type in structs) {
        if (ancestors.has(type))
          throw new CircularReferenceError({ type });
        components.push({
          ...abiParameter,
          type: `tuple${array2 ?? ""}`,
          components: resolveStructs(structs[type], structs, /* @__PURE__ */ new Set([...ancestors, type]))
        });
      } else {
        if (isSolidityType(type))
          components.push(abiParameter);
        else
          throw new UnknownTypeError({ type });
      }
    }
  }
  return components;
}
var typeWithoutTupleRegex;
var init_structs = __esm({
  "node_modules/abitype/dist/esm/human-readable/runtime/structs.js"() {
    init_regex();
    init_abiItem();
    init_abiParameter();
    init_signature();
    init_struct();
    init_signatures();
    init_utils();
    typeWithoutTupleRegex = /^(?<type>[a-zA-Z$_][a-zA-Z0-9$_]*)(?<array>(?:\[\d*?\])+?)?$/;
  }
});

// node_modules/abitype/dist/esm/human-readable/parseAbi.js
function parseAbi(signatures) {
  const structs = parseStructs(signatures);
  const abi = [];
  const length = signatures.length;
  for (let i = 0; i < length; i++) {
    const signature = signatures[i];
    if (isStructSignature(signature))
      continue;
    abi.push(parseSignature(signature, structs));
  }
  return abi;
}
var init_parseAbi = __esm({
  "node_modules/abitype/dist/esm/human-readable/parseAbi.js"() {
    init_signatures();
    init_structs();
    init_utils();
  }
});

// node_modules/abitype/dist/esm/exports/index.js
var init_exports = __esm({
  "node_modules/abitype/dist/esm/exports/index.js"() {
    init_formatAbiItem();
    init_parseAbi();
  }
});

// node_modules/viem/_esm/utils/abi/formatAbiItem.js
function formatAbiItem2(abiItem, { includeName = false } = {}) {
  if (abiItem.type !== "function" && abiItem.type !== "event" && abiItem.type !== "error")
    throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, { includeName })})`;
}
function formatAbiParams(params, { includeName = false } = {}) {
  if (!params)
    return "";
  return params.map((param) => formatAbiParam(param, { includeName })).join(includeName ? ", " : ",");
}
function formatAbiParam(param, { includeName }) {
  if (param.type.startsWith("tuple")) {
    return `(${formatAbiParams(param.components, { includeName })})${param.type.slice("tuple".length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : "");
}
var init_formatAbiItem2 = __esm({
  "node_modules/viem/_esm/utils/abi/formatAbiItem.js"() {
    init_abi();
  }
});

// node_modules/viem/_esm/utils/data/isHex.js
function isHex(value, { strict = true } = {}) {
  if (!value)
    return false;
  if (typeof value !== "string")
    return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith("0x");
}
var init_isHex = __esm({
  "node_modules/viem/_esm/utils/data/isHex.js"() {
  }
});

// node_modules/viem/_esm/utils/data/size.js
function size(value) {
  if (isHex(value, { strict: false }))
    return Math.ceil((value.length - 2) / 2);
  return value.length;
}
var init_size = __esm({
  "node_modules/viem/_esm/utils/data/size.js"() {
    init_isHex();
  }
});

// node_modules/viem/_esm/errors/version.js
var version2;
var init_version2 = __esm({
  "node_modules/viem/_esm/errors/version.js"() {
    version2 = "2.56.3";
  }
});

// node_modules/viem/_esm/errors/base.js
function walk(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause !== void 0)
    return walk(err.cause, fn);
  return fn ? null : err;
}
var errorConfig, BaseError2;
var init_base = __esm({
  "node_modules/viem/_esm/errors/base.js"() {
    init_version2();
    errorConfig = {
      getDocsUrl: ({ docsBaseUrl, docsPath: docsPath8 = "", docsSlug }) => docsPath8 ? `${docsBaseUrl ?? "https://viem.sh"}${docsPath8}${docsSlug ? `#${docsSlug}` : ""}` : void 0,
      version: `viem@${version2}`
    };
    BaseError2 = class _BaseError extends Error {
      constructor(shortMessage, args = {}) {
        const details = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.details;
          if (args.cause?.message)
            return args.cause.message;
          return args.details;
        })();
        const docsPath8 = (() => {
          if (args.cause instanceof _BaseError)
            return args.cause.docsPath || args.docsPath;
          return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath: docsPath8 });
        const message = [
          shortMessage || "An error occurred.",
          "",
          ...args.metaMessages ? [...args.metaMessages, ""] : [],
          ...docsUrl ? [`Docs: ${docsUrl}`] : [],
          ...details ? [`Details: ${details}`] : [],
          ...errorConfig.version ? [`Version: ${errorConfig.version}`] : []
        ].join("\n");
        super(message, args.cause ? { cause: args.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.details = details;
        this.docsPath = docsPath8;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version2;
      }
      walk(fn) {
        return walk(this, fn);
      }
    };
  }
});

// node_modules/viem/_esm/errors/abi.js
var AbiConstructorNotFoundError, AbiConstructorParamsNotFoundError, AbiDecodingDataSizeTooSmallError, AbiDecodingZeroDataError, AbiEncodingArrayLengthMismatchError, AbiEncodingBytesSizeMismatchError, AbiEncodingLengthMismatchError, AbiErrorInputsNotFoundError, AbiErrorNotFoundError, AbiErrorSignatureNotFoundError, AbiEventSignatureEmptyTopicsError, AbiEventSignatureNotFoundError, AbiEventNotFoundError, AbiFunctionNotFoundError, AbiFunctionOutputsNotFoundError, AbiFunctionSignatureNotFoundError, AbiItemAmbiguityError, DecodeLogDataMismatch, DecodeLogTopicsMismatch, InvalidAbiEncodingTypeError, InvalidAbiDecodingTypeError, InvalidArrayError, InvalidDefinitionTypeError;
var init_abi = __esm({
  "node_modules/viem/_esm/errors/abi.js"() {
    init_formatAbiItem2();
    init_size();
    init_base();
    AbiConstructorNotFoundError = class extends BaseError2 {
      constructor({ docsPath: docsPath8 }) {
        super([
          "A constructor was not found on the ABI.",
          "Make sure you are using the correct ABI and that the constructor exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiConstructorNotFoundError"
        });
      }
    };
    AbiConstructorParamsNotFoundError = class extends BaseError2 {
      constructor({ docsPath: docsPath8 }) {
        super([
          "Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.",
          "Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiConstructorParamsNotFoundError"
        });
      }
    };
    AbiDecodingDataSizeTooSmallError = class extends BaseError2 {
      constructor({ data, params, size: size4 }) {
        super([`Data size of ${size4} bytes is too small for given parameters.`].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size4} bytes)`
          ],
          name: "AbiDecodingDataSizeTooSmallError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
        this.params = params;
        this.size = size4;
      }
    };
    AbiDecodingZeroDataError = class extends BaseError2 {
      constructor({ cause } = {}) {
        super('Cannot decode zero data ("0x") with ABI parameters.', {
          name: "AbiDecodingZeroDataError",
          cause
        });
      }
    };
    AbiEncodingArrayLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength, type }) {
        super([
          `ABI encoding array length mismatch for type ${type}.`,
          `Expected length: ${expectedLength}`,
          `Given length: ${givenLength}`
        ].join("\n"), { name: "AbiEncodingArrayLengthMismatchError" });
      }
    };
    AbiEncodingBytesSizeMismatchError = class extends BaseError2 {
      constructor({ expectedSize, value }) {
        super(`Size of bytes "${value}" (bytes${size(value)}) does not match expected size (bytes${expectedSize}).`, { name: "AbiEncodingBytesSizeMismatchError" });
      }
    };
    AbiEncodingLengthMismatchError = class extends BaseError2 {
      constructor({ expectedLength, givenLength }) {
        super([
          "ABI encoding params/values length mismatch.",
          `Expected length (params): ${expectedLength}`,
          `Given length (values): ${givenLength}`
        ].join("\n"), { name: "AbiEncodingLengthMismatchError" });
      }
    };
    AbiErrorInputsNotFoundError = class extends BaseError2 {
      constructor(errorName, { docsPath: docsPath8 }) {
        super([
          `Arguments (\`args\`) were provided to "${errorName}", but "${errorName}" on the ABI does not contain any parameters (\`inputs\`).`,
          "Cannot encode error result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the inputs exist on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorInputsNotFoundError"
        });
      }
    };
    AbiErrorNotFoundError = class extends BaseError2 {
      constructor(errorName, { docsPath: docsPath8 } = {}) {
        super([
          `Error ${errorName ? `"${errorName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorNotFoundError"
        });
      }
    };
    AbiErrorSignatureNotFoundError = class extends BaseError2 {
      constructor(signature, { docsPath: docsPath8, cause }) {
        super([
          `Encoded error signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the error exists on it.",
          `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiErrorSignatureNotFoundError",
          cause
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.signature = signature;
      }
    };
    AbiEventSignatureEmptyTopicsError = class extends BaseError2 {
      constructor({ docsPath: docsPath8 }) {
        super("Cannot extract event signature from empty topics.", {
          docsPath: docsPath8,
          name: "AbiEventSignatureEmptyTopicsError"
        });
      }
    };
    AbiEventSignatureNotFoundError = class extends BaseError2 {
      constructor(signature, { docsPath: docsPath8 }) {
        super([
          `Encoded event signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it.",
          `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiEventSignatureNotFoundError"
        });
      }
    };
    AbiEventNotFoundError = class extends BaseError2 {
      constructor(eventName, { docsPath: docsPath8 } = {}) {
        super([
          `Event ${eventName ? `"${eventName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the event exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiEventNotFoundError"
        });
      }
    };
    AbiFunctionNotFoundError = class extends BaseError2 {
      constructor(functionName, { docsPath: docsPath8 } = {}) {
        super([
          `Function ${functionName ? `"${functionName}" ` : ""}not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionNotFoundError"
        });
      }
    };
    AbiFunctionOutputsNotFoundError = class extends BaseError2 {
      constructor(functionName, { docsPath: docsPath8 }) {
        super([
          `Function "${functionName}" does not contain any \`outputs\` on ABI.`,
          "Cannot decode function result without knowing what the parameter types are.",
          "Make sure you are using the correct ABI and that the function exists on it."
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionOutputsNotFoundError"
        });
      }
    };
    AbiFunctionSignatureNotFoundError = class extends BaseError2 {
      constructor(signature, { docsPath: docsPath8 }) {
        super([
          `Encoded function signature "${signature}" not found on ABI.`,
          "Make sure you are using the correct ABI and that the function exists on it.",
          `You can look up the signature here: https://4byte.sourcify.dev/?q=${signature}.`
        ].join("\n"), {
          docsPath: docsPath8,
          name: "AbiFunctionSignatureNotFoundError"
        });
      }
    };
    AbiItemAmbiguityError = class extends BaseError2 {
      constructor(x, y) {
        super("Found ambiguous types in overloaded ABI items.", {
          metaMessages: [
            `\`${x.type}\` in \`${formatAbiItem2(x.abiItem)}\`, and`,
            `\`${y.type}\` in \`${formatAbiItem2(y.abiItem)}\``,
            "",
            "These types encode differently and cannot be distinguished at runtime.",
            "Remove one of the ambiguous items in the ABI."
          ],
          name: "AbiItemAmbiguityError"
        });
      }
    };
    DecodeLogDataMismatch = class extends BaseError2 {
      constructor({ abiItem, data, params, size: size4 }) {
        super([
          `Data size of ${size4} bytes is too small for non-indexed event parameters.`
        ].join("\n"), {
          metaMessages: [
            `Params: (${formatAbiParams(params, { includeName: true })})`,
            `Data:   ${data} (${size4} bytes)`
          ],
          name: "DecodeLogDataMismatch"
        });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "params", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
        this.data = data;
        this.params = params;
        this.size = size4;
      }
    };
    DecodeLogTopicsMismatch = class extends BaseError2 {
      constructor({ abiItem, param }) {
        super([
          `Expected a topic for indexed event parameter${param.name ? ` "${param.name}"` : ""} on event "${formatAbiItem2(abiItem, { includeName: true })}".`
        ].join("\n"), { name: "DecodeLogTopicsMismatch" });
        Object.defineProperty(this, "abiItem", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abiItem = abiItem;
      }
    };
    InvalidAbiEncodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath: docsPath8 }) {
        super([
          `Type "${type}" is not a valid encoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiEncodingType" });
      }
    };
    InvalidAbiDecodingTypeError = class extends BaseError2 {
      constructor(type, { docsPath: docsPath8 }) {
        super([
          `Type "${type}" is not a valid decoding type.`,
          "Please provide a valid ABI type."
        ].join("\n"), { docsPath: docsPath8, name: "InvalidAbiDecodingType" });
      }
    };
    InvalidArrayError = class extends BaseError2 {
      constructor(value) {
        super([`Value "${value}" is not a valid array.`].join("\n"), {
          name: "InvalidArrayError"
        });
      }
    };
    InvalidDefinitionTypeError = class extends BaseError2 {
      constructor(type) {
        super([
          `"${type}" is not a valid definition type.`,
          'Valid types: "function", "event", "error"'
        ].join("\n"), { name: "InvalidDefinitionTypeError" });
      }
    };
  }
});

// node_modules/viem/_esm/errors/data.js
var SliceOffsetOutOfBoundsError, SizeExceedsPaddingSizeError, InvalidBytesLengthError;
var init_data = __esm({
  "node_modules/viem/_esm/errors/data.js"() {
    init_base();
    SliceOffsetOutOfBoundsError = class extends BaseError2 {
      constructor({ offset, position, size: size4 }) {
        super(`Slice ${position === "start" ? "starting" : "ending"} at offset "${offset}" is out-of-bounds (size: ${size4}).`, { name: "SliceOffsetOutOfBoundsError" });
      }
    };
    SizeExceedsPaddingSizeError = class extends BaseError2 {
      constructor({ size: size4, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size4}) exceeds padding size (${targetSize}).`, { name: "SizeExceedsPaddingSizeError" });
      }
    };
    InvalidBytesLengthError = class extends BaseError2 {
      constructor({ size: size4, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size4} ${type} long.`, { name: "InvalidBytesLengthError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/pad.js
function pad(hexOrBytes, { dir, size: size4 = 32 } = {}) {
  if (typeof hexOrBytes === "string")
    return padHex(hexOrBytes, { dir, size: size4 });
  return padBytes(hexOrBytes, { dir, size: size4 });
}
function padHex(hex_, { dir, size: size4 = 32 } = {}) {
  if (size4 === null)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size4 * 2)
    throw new SizeExceedsPaddingSizeError({
      size: Math.ceil(hex.length / 2),
      targetSize: size4,
      type: "hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size4 * 2, "0")}`;
}
function padBytes(bytes, { dir, size: size4 = 32 } = {}) {
  if (size4 === null)
    return bytes;
  if (bytes.length > size4)
    throw new SizeExceedsPaddingSizeError({
      size: bytes.length,
      targetSize: size4,
      type: "bytes"
    });
  const paddedBytes = new Uint8Array(size4);
  for (let i = 0; i < size4; i++) {
    const padEnd = dir === "right";
    paddedBytes[padEnd ? i : size4 - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}
var init_pad = __esm({
  "node_modules/viem/_esm/utils/data/pad.js"() {
    init_data();
  }
});

// node_modules/viem/_esm/errors/encoding.js
var IntegerOutOfRangeError, InvalidBytesBooleanError, SizeOverflowError;
var init_encoding = __esm({
  "node_modules/viem/_esm/errors/encoding.js"() {
    init_base();
    IntegerOutOfRangeError = class extends BaseError2 {
      constructor({ max, min, signed, size: size4, value }) {
        super(`Number "${value}" is not in safe ${size4 ? `${size4 * 8}-bit ${signed ? "signed" : "unsigned"} ` : ""}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: "IntegerOutOfRangeError" });
      }
    };
    InvalidBytesBooleanError = class extends BaseError2 {
      constructor(bytes) {
        super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
          name: "InvalidBytesBooleanError"
        });
      }
    };
    SizeOverflowError = class extends BaseError2 {
      constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: "SizeOverflowError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/data/trim.js
function trim(hexOrBytes, { dir = "left" } = {}) {
  let data = typeof hexOrBytes === "string" ? hexOrBytes.replace("0x", "") : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === "left" ? i : data.length - i - 1].toString() === "0")
      sliceLength++;
    else
      break;
  }
  data = dir === "left" ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === "string") {
    if (data.length === 1 && dir === "right")
      data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}
var init_trim = __esm({
  "node_modules/viem/_esm/utils/data/trim.js"() {
  }
});

// node_modules/viem/_esm/utils/encoding/fromHex.js
function assertSize(hexOrBytes, { size: size4 }) {
  if (size(hexOrBytes) > size4)
    throw new SizeOverflowError({
      givenSize: size(hexOrBytes),
      maxSize: size4
    });
}
function hexToBigInt(hex, opts = {}) {
  const { signed } = opts;
  if (opts.size)
    assertSize(hex, { size: opts.size });
  const value = BigInt(hex);
  if (!signed)
    return value;
  const size4 = Math.ceil((hex.length - 2) / 2);
  const max = (1n << BigInt(size4) * 8n - 1n) - 1n;
  if (value <= max)
    return value;
  return value - BigInt(`0x${"f".padStart(size4 * 2, "f")}`) - 1n;
}
function hexToNumber(hex, opts = {}) {
  const value = hexToBigInt(hex, opts);
  const number = Number(value);
  if (!Number.isSafeInteger(number))
    throw new IntegerOutOfRangeError({
      max: `${Number.MAX_SAFE_INTEGER}`,
      min: `${Number.MIN_SAFE_INTEGER}`,
      signed: opts.signed,
      size: opts.size,
      value: `${value}n`
    });
  return number;
}
var init_fromHex = __esm({
  "node_modules/viem/_esm/utils/encoding/fromHex.js"() {
    init_encoding();
    init_size();
  }
});

// node_modules/viem/_esm/utils/encoding/toHex.js
function toHex(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToHex(value, opts);
  if (typeof value === "string") {
    return stringToHex(value, opts);
  }
  if (typeof value === "boolean")
    return boolToHex(value, opts);
  return bytesToHex(value, opts);
}
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { size: opts.size });
  }
  return hex;
}
function bytesToHex(value, opts = {}) {
  let string = "";
  for (let i = 0; i < value.length; i++) {
    string += hexes[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === "number") {
    assertSize(hex, { size: opts.size });
    return pad(hex, { dir: "right", size: opts.size });
  }
  return hex;
}
function numberToHex(value_, opts = {}) {
  const { signed, size: size4 } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size4) {
    if (signed)
      maxValue = (1n << BigInt(size4) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size4) * 8n) - 1n;
  } else if (typeof value_ === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size4,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size4 * 8)) + BigInt(value) : value).toString(16)}`;
  if (size4)
    return pad(hex, { size: size4 });
  return hex;
}
function stringToHex(value_, opts = {}) {
  const value = encoder.encode(value_);
  return bytesToHex(value, opts);
}
var hexes, encoder;
var init_toHex = __esm({
  "node_modules/viem/_esm/utils/encoding/toHex.js"() {
    init_encoding();
    init_pad();
    init_fromHex();
    hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, "0"));
    encoder = /* @__PURE__ */ new TextEncoder();
  }
});

// node_modules/viem/_esm/utils/encoding/toBytes.js
function toBytes(value, opts = {}) {
  if (typeof value === "number" || typeof value === "bigint")
    return numberToBytes(value, opts);
  if (typeof value === "boolean")
    return boolToBytes(value, opts);
  if (isHex(value))
    return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { size: opts.size });
  }
  return bytes;
}
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine)
    return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F)
    return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f)
    return char - (charCodeMap.a - 10);
  return void 0;
}
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, { size: opts.size });
    hex = pad(hex, { dir: "right", size: opts.size });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2)
    hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index2 = 0, j = 0; index2 < length; index2++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === void 0 || nibbleRight === void 0) {
      throw new BaseError2(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index2] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
function stringToBytes(value, opts = {}) {
  const bytes = encoder2.encode(value);
  if (typeof opts.size === "number") {
    assertSize(bytes, { size: opts.size });
    return pad(bytes, { dir: "right", size: opts.size });
  }
  return bytes;
}
var encoder2, charCodeMap;
var init_toBytes = __esm({
  "node_modules/viem/_esm/utils/encoding/toBytes.js"() {
    init_base();
    init_isHex();
    init_pad();
    init_fromHex();
    init_toHex();
    encoder2 = /* @__PURE__ */ new TextEncoder();
    charCodeMap = {
      zero: 48,
      nine: 57,
      A: 65,
      F: 70,
      a: 97,
      f: 102
    };
  }
});

// node_modules/@noble/hashes/esm/_u64.js
function fromBig(n2, le = false) {
  if (le)
    return { h: Number(n2 & U32_MASK64), l: Number(n2 >> _32n & U32_MASK64) };
  return { h: Number(n2 >> _32n & U32_MASK64) | 0, l: Number(n2 & U32_MASK64) | 0 };
}
function split(lst, le = false) {
  const len = lst.length;
  let Ah = new Uint32Array(len);
  let Al = new Uint32Array(len);
  for (let i = 0; i < len; i++) {
    const { h, l } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
var U32_MASK64, _32n, rotlSH, rotlSL, rotlBH, rotlBL;
var init_u64 = __esm({
  "node_modules/@noble/hashes/esm/_u64.js"() {
    U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
    _32n = /* @__PURE__ */ BigInt(32);
    rotlSH = (h, l, s) => h << s | l >>> 32 - s;
    rotlSL = (h, l, s) => l << s | h >>> 32 - s;
    rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
    rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  }
});

// node_modules/@noble/hashes/esm/utils.js
function isBytes(a) {
  return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
}
function anumber(n2) {
  if (!Number.isSafeInteger(n2) || n2 < 0)
    throw new Error("positive integer expected, got " + n2);
}
function abytes(b, ...lengths) {
  if (!isBytes(b))
    throw new Error("Uint8Array expected");
  if (lengths.length > 0 && !lengths.includes(b.length))
    throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
}
function aexists(instance, checkFinished = true) {
  if (instance.destroyed)
    throw new Error("Hash instance has been destroyed");
  if (checkFinished && instance.finished)
    throw new Error("Hash#digest() has already been called");
}
function aoutput(out, instance) {
  abytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error("digestInto() expects output buffer of length at least " + min);
  }
}
function u32(arr) {
  return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
function clean(...arrays) {
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].fill(0);
  }
}
function byteSwap(word) {
  return word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
}
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
  return arr;
}
function utf8ToBytes(str) {
  if (typeof str !== "string")
    throw new Error("string expected");
  return new Uint8Array(new TextEncoder().encode(str));
}
function toBytes2(data) {
  if (typeof data === "string")
    data = utf8ToBytes(data);
  abytes(data);
  return data;
}
function createHasher(hashCons) {
  const hashC = (msg) => hashCons().update(toBytes2(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
var isLE, swap32IfBE, Hash;
var init_utils2 = __esm({
  "node_modules/@noble/hashes/esm/utils.js"() {
    isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
    swap32IfBE = isLE ? (u) => u : byteSwap32;
    Hash = class {
    };
  }
});

// node_modules/@noble/hashes/esm/sha3.js
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  for (let round = 24 - rounds; round < 24; round++) {
    for (let x = 0; x < 10; x++)
      B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++)
        B[x] = s[y + x];
      for (let x = 0; x < 10; x++)
        s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  clean(B);
}
var _0n, _1n, _2n, _7n, _256n, _0x71n, SHA3_PI, SHA3_ROTL, _SHA3_IOTA, IOTAS, SHA3_IOTA_H, SHA3_IOTA_L, rotlH, rotlL, Keccak, gen, keccak_256;
var init_sha3 = __esm({
  "node_modules/@noble/hashes/esm/sha3.js"() {
    init_u64();
    init_utils2();
    _0n = BigInt(0);
    _1n = BigInt(1);
    _2n = BigInt(2);
    _7n = BigInt(7);
    _256n = BigInt(256);
    _0x71n = BigInt(113);
    SHA3_PI = [];
    SHA3_ROTL = [];
    _SHA3_IOTA = [];
    for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
      [x, y] = [y, (2 * x + 3 * y) % 5];
      SHA3_PI.push(2 * (5 * y + x));
      SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
      let t = _0n;
      for (let j = 0; j < 7; j++) {
        R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
        if (R & _2n)
          t ^= _1n << (_1n << /* @__PURE__ */ BigInt(j)) - _1n;
      }
      _SHA3_IOTA.push(t);
    }
    IOTAS = split(_SHA3_IOTA, true);
    SHA3_IOTA_H = IOTAS[0];
    SHA3_IOTA_L = IOTAS[1];
    rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
    rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
    Keccak = class _Keccak extends Hash {
      // NOTE: we accept arguments in bytes instead of bits here.
      constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        anumber(outputLen);
        if (!(0 < blockLen && blockLen < 200))
          throw new Error("only keccak-f1600 function is supported");
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
      }
      clone() {
        return this._cloneInto();
      }
      keccak() {
        swap32IfBE(this.state32);
        keccakP(this.state32, this.rounds);
        swap32IfBE(this.state32);
        this.posOut = 0;
        this.pos = 0;
      }
      update(data) {
        aexists(this);
        data = toBytes2(data);
        abytes(data);
        const { blockLen, state } = this;
        const len = data.length;
        for (let pos = 0; pos < len; ) {
          const take = Math.min(blockLen - this.pos, len - pos);
          for (let i = 0; i < take; i++)
            state[this.pos++] ^= data[pos++];
          if (this.pos === blockLen)
            this.keccak();
        }
        return this;
      }
      finish() {
        if (this.finished)
          return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        state[pos] ^= suffix;
        if ((suffix & 128) !== 0 && pos === blockLen - 1)
          this.keccak();
        state[blockLen - 1] ^= 128;
        this.keccak();
      }
      writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len; ) {
          if (this.posOut >= blockLen)
            this.keccak();
          const take = Math.min(blockLen - this.posOut, len - pos);
          out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
          this.posOut += take;
          pos += take;
        }
        return out;
      }
      xofInto(out) {
        if (!this.enableXOF)
          throw new Error("XOF is not possible for this instance");
        return this.writeInto(out);
      }
      xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
      }
      digestInto(out) {
        aoutput(out, this);
        if (this.finished)
          throw new Error("digest() was already called");
        this.writeInto(out);
        this.destroy();
        return out;
      }
      digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
      }
      destroy() {
        this.destroyed = true;
        clean(this.state);
      }
      _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
      }
    };
    gen = (suffix, blockLen, outputLen) => createHasher(() => new Keccak(blockLen, suffix, outputLen));
    keccak_256 = /* @__PURE__ */ (() => gen(1, 136, 256 / 8))();
  }
});

// node_modules/viem/_esm/utils/hash/keccak256.js
function keccak256(value, to_) {
  const to = to_ || "hex";
  const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes(value) : value);
  if (to === "bytes")
    return bytes;
  return toHex(bytes);
}
var init_keccak256 = __esm({
  "node_modules/viem/_esm/utils/hash/keccak256.js"() {
    init_sha3();
    init_isHex();
    init_toBytes();
    init_toHex();
  }
});

// node_modules/viem/_esm/utils/hash/hashSignature.js
function hashSignature(sig) {
  return hash(sig);
}
var hash;
var init_hashSignature = __esm({
  "node_modules/viem/_esm/utils/hash/hashSignature.js"() {
    init_toBytes();
    init_keccak256();
    hash = (value) => keccak256(toBytes(value));
  }
});

// node_modules/viem/_esm/utils/hash/normalizeSignature.js
function normalizeSignature(signature) {
  let active = true;
  let current = "";
  let level = 0;
  let result = "";
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    if (["(", ")", ","].includes(char))
      active = true;
    if (char === "(")
      level++;
    if (char === ")")
      level--;
    if (!active)
      continue;
    if (level === 0) {
      if (char === " " && ["event", "function", ""].includes(result))
        result = "";
      else {
        result += char;
        if (char === ")") {
          valid = true;
          break;
        }
      }
      continue;
    }
    if (char === " ") {
      if (signature[i - 1] !== "," && current !== "," && current !== ",(") {
        current = "";
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid)
    throw new BaseError2("Unable to normalize signature.");
  return result;
}
var init_normalizeSignature = __esm({
  "node_modules/viem/_esm/utils/hash/normalizeSignature.js"() {
    init_base();
  }
});

// node_modules/viem/_esm/utils/hash/toSignature.js
var toSignature;
var init_toSignature = __esm({
  "node_modules/viem/_esm/utils/hash/toSignature.js"() {
    init_exports();
    init_normalizeSignature();
    toSignature = (def) => {
      const def_ = (() => {
        if (typeof def === "string")
          return def;
        return formatAbiItem(def);
      })();
      return normalizeSignature(def_);
    };
  }
});

// node_modules/viem/_esm/utils/hash/toSignatureHash.js
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}
var init_toSignatureHash = __esm({
  "node_modules/viem/_esm/utils/hash/toSignatureHash.js"() {
    init_hashSignature();
    init_toSignature();
  }
});

// node_modules/viem/_esm/utils/hash/toEventSelector.js
var toEventSelector;
var init_toEventSelector = __esm({
  "node_modules/viem/_esm/utils/hash/toEventSelector.js"() {
    init_toSignatureHash();
    toEventSelector = toSignatureHash;
  }
});

// node_modules/viem/_esm/errors/address.js
var InvalidAddressError;
var init_address = __esm({
  "node_modules/viem/_esm/errors/address.js"() {
    init_base();
    InvalidAddressError = class extends BaseError2 {
      constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
          metaMessages: [
            "- Address must be a hex value of 20 bytes (40 hex characters).",
            "- Address must match its checksum counterpart."
          ],
          name: "InvalidAddressError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/lru.js
var LruMap;
var init_lru = __esm({
  "node_modules/viem/_esm/utils/lru.js"() {
    LruMap = class extends Map {
      constructor(size4) {
        super();
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = size4;
      }
      get(key) {
        const value = super.get(key);
        if (super.has(key)) {
          super.delete(key);
          super.set(key, value);
        }
        return value;
      }
      set(key, value) {
        if (super.has(key))
          super.delete(key);
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
          const firstKey = super.keys().next().value;
          if (firstKey !== void 0)
            super.delete(firstKey);
        }
        return this;
      }
    };
  }
});

// node_modules/viem/_esm/utils/address/getAddress.js
function checksumAddress(address_, chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`))
    return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = chainId ? `${chainId}${address_.toLowerCase()}` : address_.substring(2).toLowerCase();
  const hash2 = keccak256(stringToBytes(hexAddress), "bytes");
  const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split("");
  for (let i = 0; i < 40; i += 2) {
    if (hash2[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash2[i >> 1] & 15) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join("")}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
var checksumAddressCache;
var init_getAddress = __esm({
  "node_modules/viem/_esm/utils/address/getAddress.js"() {
    init_toBytes();
    init_keccak256();
    init_lru();
    checksumAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// node_modules/viem/_esm/utils/address/isAddress.js
function isAddress(address, options) {
  const { strict = true } = options ?? {};
  const cacheKey2 = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey2))
    return isAddressCache.get(cacheKey2);
  const result = (() => {
    if (!addressRegex.test(address))
      return false;
    if (address.toLowerCase() === address)
      return true;
    if (strict)
      return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey2, result);
  return result;
}
var addressRegex, isAddressCache;
var init_isAddress = __esm({
  "node_modules/viem/_esm/utils/address/isAddress.js"() {
    init_lru();
    init_getAddress();
    addressRegex = /^0x[a-fA-F0-9]{40}$/;
    isAddressCache = /* @__PURE__ */ new LruMap(8192);
  }
});

// node_modules/viem/_esm/utils/data/concat.js
function concat(values) {
  if (typeof values[0] === "string")
    return concatHex(values);
  return concatBytes(values);
}
function concatBytes(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace("0x", ""), "")}`;
}
var init_concat = __esm({
  "node_modules/viem/_esm/utils/data/concat.js"() {
  }
});

// node_modules/viem/_esm/utils/data/slice.js
function slice(value, start, end, { strict } = {}) {
  if (isHex(value, { strict: false }))
    return sliceHex(value, start, end, {
      strict
    });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === "number" && start > 0 && start > size(value) - 1)
    throw new SliceOffsetOutOfBoundsError({
      offset: start,
      position: "start",
      size: size(value)
    });
}
function assertEndOffset(value, start, end) {
  if (typeof start === "number" && typeof end === "number" && size(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: "end",
      size: size(value)
    });
  }
}
function sliceBytes(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
function sliceHex(value_, start, end, { strict } = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace("0x", "").slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict)
    assertEndOffset(value, start, end);
  return value;
}
var init_slice = __esm({
  "node_modules/viem/_esm/utils/data/slice.js"() {
    init_data();
    init_isHex();
    init_size();
  }
});

// node_modules/viem/_esm/utils/regex.js
var integerRegex2;
var init_regex2 = __esm({
  "node_modules/viem/_esm/utils/regex.js"() {
    integerRegex2 = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;
  }
});

// node_modules/viem/_esm/utils/abi/encodeAbiParameters.js
function encodeAbiParameters(params, values) {
  if (params.length !== values.length)
    throw new AbiEncodingLengthMismatchError({
      expectedLength: params.length,
      givenLength: values.length
    });
  const preparedParams = prepareParams({
    params,
    values
  });
  return encodeParams(preparedParams);
}
function prepareParams({ params, values }) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({ param: params[i], value: values[i] }));
  }
  return preparedParams;
}
function prepareParam({ param, value }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, { length, param: { ...param, type } });
  }
  if (param.type === "tuple") {
    return encodeTuple(value, {
      param
    });
  }
  if (param.type === "address") {
    return encodeAddress(value);
  }
  if (param.type === "bool") {
    return encodeBool(value);
  }
  if (param.type.startsWith("uint") || param.type.startsWith("int")) {
    const signed = param.type.startsWith("int");
    const [, , size4 = "256"] = integerRegex2.exec(param.type) ?? [];
    return encodeNumber(value, {
      signed,
      size: Number(size4)
    });
  }
  if (param.type.startsWith("bytes")) {
    return encodeBytes(value, { param });
  }
  if (param.type === "string") {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: "/docs/contract/encodeAbiParameters"
  });
}
function encodeParams(preparedParams) {
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic)
      staticSize += 32;
    else
      staticSize += size(encoded);
  }
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const { dynamic, encoded } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, { size: 32 }));
      dynamicParams.push(encoded);
      dynamicSize += size(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  return concatHex([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value))
    throw new InvalidAddressError({ address: value });
  return { dynamic: false, encoded: padHex(value.toLowerCase()) };
}
function encodeArray(value, { length, param }) {
  const dynamic = length === null;
  if (!Array.isArray(value))
    throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length)
    throw new AbiEncodingArrayLengthMismatchError({
      expectedLength: length,
      givenLength: value.length,
      type: `${param.type}[${length}]`
    });
  let dynamicChild = value.length === 0 && isDynamicType(param);
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({ param, value: value[i] });
    if (preparedParam.dynamic)
      dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length2 = numberToHex(preparedParams.length, { size: 32 });
      return {
        dynamic: true,
        encoded: concatHex([length2, data])
      };
    }
    if (dynamicChild)
      return { dynamic: true, encoded: data };
  }
  return {
    dynamic: false,
    encoded: concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function encodeBytes(value, { param }) {
  const [, paramSize] = param.type.split("bytes");
  const bytesSize = size(value);
  if (!paramSize) {
    let value_ = value;
    if (bytesSize % 32 !== 0)
      value_ = padHex(value_, {
        dir: "right",
        size: Math.ceil((value.length - 2) / 2 / 32) * 32
      });
    return {
      dynamic: true,
      encoded: concatHex([
        padHex(numberToHex(bytesSize, { size: 32 })),
        value_
      ])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize, 10))
    throw new AbiEncodingBytesSizeMismatchError({
      expectedSize: Number.parseInt(paramSize, 10),
      value
    });
  return { dynamic: false, encoded: padHex(value, { dir: "right" }) };
}
function encodeBool(value) {
  if (typeof value !== "boolean")
    throw new BaseError2(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return { dynamic: false, encoded: padHex(boolToHex(value)) };
}
function encodeNumber(value, { signed, size: size4 = 256 }) {
  if (typeof size4 === "number") {
    const max = 2n ** (BigInt(size4) - (signed ? 1n : 0n)) - 1n;
    const min = signed ? -max - 1n : 0n;
    if (value > max || value < min)
      throw new IntegerOutOfRangeError({
        max: max.toString(),
        min: min.toString(),
        signed,
        size: size4 / 8,
        value: value.toString()
      });
  }
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: "right"
    }));
  }
  return {
    dynamic: true,
    encoded: concatHex([
      padHex(numberToHex(size(hexValue), { size: 32 })),
      ...parts
    ])
  };
}
function encodeTuple(value, { param }) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index2 = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index2]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic)
      dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concatHex(preparedParams.map(({ encoded }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ? (
    // Return `null` if the array is dynamic.
    [matches[2] ? Number(matches[2]) : null, matches[1]]
  ) : void 0;
}
function isDynamicType(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components.some(isDynamicType);
  const arrayComponents = getArrayComponents(type);
  if (arrayComponents)
    return isDynamicType({ ...param, type: arrayComponents[1] });
  return false;
}
var init_encodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/encodeAbiParameters.js"() {
    init_abi();
    init_address();
    init_base();
    init_encoding();
    init_isAddress();
    init_concat();
    init_pad();
    init_size();
    init_slice();
    init_toHex();
    init_regex2();
  }
});

// node_modules/viem/_esm/utils/hash/toFunctionSelector.js
var toFunctionSelector;
var init_toFunctionSelector = __esm({
  "node_modules/viem/_esm/utils/hash/toFunctionSelector.js"() {
    init_slice();
    init_toSignatureHash();
    toFunctionSelector = (fn) => slice(toSignatureHash(fn), 0, 4);
  }
});

// node_modules/viem/_esm/utils/abi/getAbiItem.js
function getAbiItem(parameters) {
  const { abi, args = [], name } = parameters;
  const isSelector = isHex(name, { strict: false });
  const abiItems = abi.filter((abiItem) => {
    if (isSelector) {
      if (abiItem.type === "function")
        return toFunctionSelector(abiItem) === name;
      if (abiItem.type === "event")
        return toEventSelector(abiItem) === name;
      return false;
    }
    return "name" in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0)
    return void 0;
  if (abiItems.length === 1)
    return abiItems[0];
  let matchedAbiItem;
  for (const abiItem of abiItems) {
    if (!("inputs" in abiItem))
      continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0)
        return abiItem;
      continue;
    }
    if (!abiItem.inputs)
      continue;
    if (abiItem.inputs.length === 0)
      continue;
    if (abiItem.inputs.length !== args.length)
      continue;
    const matched = args.every((arg, index2) => {
      const abiParameter = "inputs" in abiItem && abiItem.inputs[index2];
      if (!abiParameter)
        return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      if (matchedAbiItem && "inputs" in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes)
          throw new AbiItemAmbiguityError({
            abiItem,
            type: ambiguousTypes[0]
          }, {
            abiItem: matchedAbiItem,
            type: ambiguousTypes[1]
          });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem)
    return matchedAbiItem;
  return abiItems[0];
}
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case "address":
      return isAddress(arg, { strict: false });
    case "bool":
      return argType === "boolean";
    case "function":
      return argType === "string";
    case "string":
      return argType === "string";
    default: {
      if (abiParameterType === "tuple" && "components" in abiParameter)
        return Object.values(abiParameter.components).every((component, index2) => {
          return argType === "object" && isArgOfType(Object.values(arg)[index2], component);
        });
      if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType))
        return argType === "number" || argType === "bigint";
      if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
        return argType === "string" || arg instanceof Uint8Array;
      if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
        return Array.isArray(arg) && arg.every((x) => isArgOfType(x, {
          ...abiParameter,
          // Pop off `[]` or `[M]` from end of type
          type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, "")
        }));
      }
      return false;
    }
  }
}
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === "tuple" && targetParameter.type === "tuple" && "components" in sourceParameter && "components" in targetParameter)
      return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes("address") && types.includes("bytes20"))
        return true;
      if (types.includes("address") && types.includes("string"))
        return isAddress(args[parameterIndex], { strict: false });
      if (types.includes("address") && types.includes("bytes"))
        return isAddress(args[parameterIndex], { strict: false });
      return false;
    })();
    if (ambiguous)
      return types;
  }
  return;
}
var init_getAbiItem = __esm({
  "node_modules/viem/_esm/utils/abi/getAbiItem.js"() {
    init_abi();
    init_isHex();
    init_isAddress();
    init_toEventSelector();
    init_toFunctionSelector();
  }
});

// node_modules/viem/_esm/accounts/utils/parseAccount.js
function parseAccount(account) {
  if (typeof account === "string")
    return { address: account, type: "json-rpc" };
  return account;
}
var init_parseAccount = __esm({
  "node_modules/viem/_esm/accounts/utils/parseAccount.js"() {
  }
});

// node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js
function prepareEncodeFunctionData(parameters) {
  const { abi, args, functionName } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath2 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath2 });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem2(abiItem))
  };
}
var docsPath2;
var init_prepareEncodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/prepareEncodeFunctionData.js"() {
    init_abi();
    init_toFunctionSelector();
    init_formatAbiItem2();
    init_getAbiItem();
    docsPath2 = "/docs/contract/encodeFunctionData";
  }
});

// node_modules/viem/_esm/utils/abi/encodeFunctionData.js
function encodeFunctionData(parameters) {
  const { args } = parameters;
  const { abi, functionName } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith("0x"))
      return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = "inputs" in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : void 0;
  return concatHex([signature, data ?? "0x"]);
}
var init_encodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/encodeFunctionData.js"() {
    init_concat();
    init_encodeAbiParameters();
    init_prepareEncodeFunctionData();
  }
});

// node_modules/viem/_esm/constants/solidity.js
var panicReasons, solidityError, solidityPanic;
var init_solidity = __esm({
  "node_modules/viem/_esm/constants/solidity.js"() {
    panicReasons = {
      1: "An `assert` condition failed.",
      17: "Arithmetic operation resulted in underflow or overflow.",
      18: "Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).",
      33: "Attempted to convert to an invalid type.",
      34: "Attempted to access a storage byte array that is incorrectly encoded.",
      49: "Performed `.pop()` on an empty array",
      50: "Array index is out of bounds.",
      65: "Allocated too much memory or created an array which is too large.",
      81: "Attempted to call a zero-initialized variable of internal function type."
    };
    solidityError = {
      inputs: [
        {
          name: "message",
          type: "string"
        }
      ],
      name: "Error",
      type: "error"
    };
    solidityPanic = {
      inputs: [
        {
          name: "reason",
          type: "uint256"
        }
      ],
      name: "Panic",
      type: "error"
    };
  }
});

// node_modules/viem/_esm/errors/cursor.js
var NegativeOffsetError, PositionOutOfBoundsError, RecursiveReadLimitExceededError;
var init_cursor = __esm({
  "node_modules/viem/_esm/errors/cursor.js"() {
    init_base();
    NegativeOffsetError = class extends BaseError2 {
      constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
          name: "NegativeOffsetError"
        });
      }
    };
    PositionOutOfBoundsError = class extends BaseError2 {
      constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: "PositionOutOfBoundsError" });
      }
    };
    RecursiveReadLimitExceededError = class extends BaseError2 {
      constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: "RecursiveReadLimitExceededError" });
      }
    };
  }
});

// node_modules/viem/_esm/utils/cursor.js
function createCursor(bytes, { recursiveReadLimit = 8192 } = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer ?? bytes, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = /* @__PURE__ */ new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}
var staticCursor;
var init_cursor2 = __esm({
  "node_modules/viem/_esm/utils/cursor.js"() {
    init_cursor();
    staticCursor = {
      bytes: new Uint8Array(),
      dataView: new DataView(new ArrayBuffer(0)),
      position: 0,
      positionReadCount: /* @__PURE__ */ new Map(),
      recursiveReadCount: 0,
      recursiveReadLimit: Number.POSITIVE_INFINITY,
      assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
          throw new RecursiveReadLimitExceededError({
            count: this.recursiveReadCount + 1,
            limit: this.recursiveReadLimit
          });
      },
      assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
          throw new PositionOutOfBoundsError({
            length: this.bytes.length,
            position
          });
      },
      decrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
      },
      getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
      },
      incrementPosition(offset) {
        if (offset < 0)
          throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
      },
      inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
      },
      inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
      },
      inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
      },
      inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
      },
      inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
      },
      pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
      },
      pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
      },
      pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
      },
      pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
      },
      pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
      },
      pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
      },
      readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
      },
      readBytes(length, size4) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size4 ?? length;
        return value;
      },
      readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
      },
      readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
      },
      readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
      },
      readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
      },
      get remaining() {
        return this.bytes.length - this.position;
      },
      setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => this.position = oldPosition;
      },
      _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
          return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
          this.recursiveReadCount++;
      }
    };
  }
});

// node_modules/viem/_esm/utils/encoding/fromBytes.js
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes);
  return hexToBigInt(hex, opts);
}
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1)
    throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== "undefined")
    assertSize(bytes, { size: opts.size });
  const hex = bytesToHex(bytes);
  return hexToNumber(hex, opts);
}
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== "undefined") {
    assertSize(bytes, { size: opts.size });
    bytes = trim(bytes, { dir: "right" });
  }
  return new TextDecoder().decode(bytes);
}
var init_fromBytes = __esm({
  "node_modules/viem/_esm/utils/encoding/fromBytes.js"() {
    init_encoding();
    init_trim();
    init_fromHex();
    init_toHex();
  }
});

// node_modules/viem/_esm/utils/abi/decodeAbiParameters.js
function decodeAbiParameters(params, data) {
  const bytes = typeof data === "string" ? hexToBytes(data) : data;
  const cursor = createCursor(bytes);
  if (size(bytes) === 0 && params.length > 0)
    throw new AbiDecodingZeroDataError();
  if (size(data) && size(data) < 32)
    throw new AbiDecodingDataSizeTooSmallError({
      data: typeof data === "string" ? data : bytesToHex(data),
      params,
      size: size(data)
    });
  let consumed = 0;
  const values = [];
  for (let i = 0; i < params.length; ++i) {
    const param = params[i];
    if (consumed < bytes.length)
      cursor.setPosition(consumed);
    const [data2, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data2);
  }
  return values;
}
function decodeParameter(cursor, param, { staticPosition }) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, { ...param, type }, { length, staticPosition });
  }
  if (param.type === "tuple")
    return decodeTuple(cursor, param, { staticPosition });
  if (param.type === "address")
    return decodeAddress(cursor);
  if (param.type === "bool")
    return decodeBool(cursor);
  if (param.type.startsWith("bytes"))
    return decodeBytes(cursor, param, { staticPosition });
  if (param.type.startsWith("uint") || param.type.startsWith("int"))
    return decodeNumber(cursor, param);
  if (param.type === "string")
    return decodeString(cursor, { staticPosition });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: "/docs/contract/decodeAbiParameters"
  });
}
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, { length, staticPosition }) {
  if (length === null) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    cursor.setPosition(start);
    const length2 = bytesToNumber(cursor.readBytes(sizeOfLength));
    const dynamicChild = hasDynamicChild(param);
    let consumed2 = 0;
    const value2 = [];
    for (let i = 0; i < length2; ++i) {
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed2));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed2 += consumed_;
      value2.push(data);
      if (consumed_ === 0) {
        cursor.assertReadLimit();
        cursor._touch();
      }
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    const value2 = [];
    for (let i = 0; i < length; ++i) {
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value2.push(data);
    }
    cursor.setPosition(staticPosition + 32);
    return [value2, 32];
  }
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
    if (consumed_ === 0) {
      cursor.assertReadLimit();
      cursor._touch();
    }
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), { size: 32 }), 32];
}
function decodeBytes(cursor, param, { staticPosition }) {
  const [_, size4] = param.type.split("bytes");
  if (!size4) {
    const offset = bytesToNumber(cursor.readBytes(32));
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    if (length === 0) {
      cursor.setPosition(staticPosition + 32);
      return ["0x", 32];
    }
    const data = cursor.readBytes(length);
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex(data), 32];
  }
  const value = bytesToHex(cursor.readBytes(Number.parseInt(size4, 10), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith("int");
  const size4 = Number.parseInt(param.type.split("int")[1] || "256", 10);
  const value = cursor.readBytes(32);
  return [
    size4 > 48 ? bytesToBigInt(value, { signed }) : bytesToNumber(value, { signed }),
    32
  ];
}
function decodeTuple(cursor, param, { staticPosition }) {
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({ name }) => !name);
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  if (hasDynamicChild(param)) {
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, { staticPosition }) {
  const offset = bytesToNumber(cursor.readBytes(32));
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ["", 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(data);
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const { type } = param;
  if (type === "string")
    return true;
  if (type === "bytes")
    return true;
  if (type.endsWith("[]"))
    return true;
  if (type === "tuple")
    return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({ ...param, type: arrayComponents[1] }))
    return true;
  return false;
}
var sizeOfLength, sizeOfOffset;
var init_decodeAbiParameters = __esm({
  "node_modules/viem/_esm/utils/abi/decodeAbiParameters.js"() {
    init_abi();
    init_getAddress();
    init_cursor2();
    init_size();
    init_slice();
    init_fromBytes();
    init_toBytes();
    init_toHex();
    init_encodeAbiParameters();
    sizeOfLength = 32;
    sizeOfOffset = 32;
  }
});

// node_modules/viem/_esm/utils/abi/decodeErrorResult.js
function decodeErrorResult(parameters) {
  const { abi, data, cause } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === "0x")
    throw new AbiDecodingZeroDataError({ cause });
  const abi_ = [...abi || [], solidityError, solidityPanic];
  const abiItem = abi_.find((x) => x.type === "error" && signature === toFunctionSelector(formatAbiItem2(x)));
  if (!abiItem)
    throw new AbiErrorSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeErrorResult",
      cause
    });
  return {
    abiItem,
    args: "inputs" in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : void 0,
    errorName: abiItem.name
  };
}
var init_decodeErrorResult = __esm({
  "node_modules/viem/_esm/utils/abi/decodeErrorResult.js"() {
    init_solidity();
    init_abi();
    init_slice();
    init_toFunctionSelector();
    init_decodeAbiParameters();
    init_formatAbiItem2();
  }
});

// node_modules/viem/_esm/utils/stringify.js
var stringify;
var init_stringify = __esm({
  "node_modules/viem/_esm/utils/stringify.js"() {
    stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
      const value2 = typeof value_ === "bigint" ? value_.toString() : value_;
      return typeof replacer === "function" ? replacer(key, value2) : value2;
    }, space);
  }
});

// node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js
function formatAbiItemWithArgs({ abiItem, args, includeFunctionName = true, includeName = false }) {
  if (!("name" in abiItem))
    return;
  if (!("inputs" in abiItem))
    return;
  if (!abiItem.inputs)
    return;
  return `${includeFunctionName ? abiItem.name : ""}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ""}${typeof args[i] === "object" ? stringify(args[i]) : args[i]}`).join(", ")})`;
}
var init_formatAbiItemWithArgs = __esm({
  "node_modules/viem/_esm/utils/abi/formatAbiItemWithArgs.js"() {
    init_stringify();
  }
});

// node_modules/viem/_esm/utils/unit/Value.js
function format(value, decimals = 0) {
  if (!Number.isInteger(decimals) || decimals < 0)
    throw new InvalidDecimalsError({ decimals });
  let display = value.toString();
  const negative = display.startsWith("-");
  if (negative)
    display = display.slice(1);
  display = display.padStart(decimals, "0");
  let [integer, fraction] = [
    display.slice(0, display.length - decimals),
    display.slice(display.length - decimals)
  ];
  fraction = fraction.replace(/(0+)$/, "");
  return `${negative ? "-" : ""}${integer || "0"}${fraction ? `.${fraction}` : ""}`;
}
function formatEther(wei, unit2 = "wei") {
  return format(wei, exponents.ether - exponents[unit2]);
}
function formatGwei(wei, unit2 = "wei") {
  return format(wei, exponents.gwei - exponents[unit2]);
}
var exponents, InvalidDecimalsError;
var init_Value = __esm({
  "node_modules/viem/_esm/utils/unit/Value.js"() {
    exponents = {
      wei: 0,
      gwei: 9,
      szabo: 12,
      finney: 15,
      ether: 18
    };
    InvalidDecimalsError = class extends Error {
      constructor({ decimals }) {
        super(`\`decimals\` must be a non-negative integer. Got \`${decimals}\`.`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Value.InvalidDecimalsError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/unit/formatEther.js
function formatEther2(wei, unit2 = "wei") {
  return formatEther(wei, unit2);
}
var init_formatEther = __esm({
  "node_modules/viem/_esm/utils/unit/formatEther.js"() {
    init_Value();
  }
});

// node_modules/viem/_esm/utils/unit/formatGwei.js
function formatGwei2(wei, unit2 = "wei") {
  return formatGwei(wei, unit2);
}
var init_formatGwei = __esm({
  "node_modules/viem/_esm/utils/unit/formatGwei.js"() {
    init_Value();
  }
});

// node_modules/viem/_esm/errors/stateOverride.js
function prettyStateMapping(stateMapping) {
  return stateMapping.reduce((pretty, { slot, value }) => {
    return `${pretty}        ${slot}: ${value}
`;
  }, "");
}
function prettyStateOverride(stateOverride) {
  return stateOverride.reduce((pretty, { address, ...state }) => {
    let val = `${pretty}    ${address}:
`;
    if (state.nonce)
      val += `      nonce: ${state.nonce}
`;
    if (state.balance)
      val += `      balance: ${state.balance}
`;
    if (state.code)
      val += `      code: ${state.code}
`;
    if (state.state) {
      val += "      state:\n";
      val += prettyStateMapping(state.state);
    }
    if (state.stateDiff) {
      val += "      stateDiff:\n";
      val += prettyStateMapping(state.stateDiff);
    }
    return val;
  }, "  State Override:\n").slice(0, -1);
}
var AccountStateConflictError, StateAssignmentConflictError;
var init_stateOverride = __esm({
  "node_modules/viem/_esm/errors/stateOverride.js"() {
    init_base();
    AccountStateConflictError = class extends BaseError2 {
      constructor({ address }) {
        super(`State for account "${address}" is set multiple times.`, {
          name: "AccountStateConflictError"
        });
      }
    };
    StateAssignmentConflictError = class extends BaseError2 {
      constructor() {
        super("state and stateDiff are set on the same account.", {
          name: "StateAssignmentConflictError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/errors/transaction.js
function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === void 0 || value === false)
      return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join("\n");
}
var init_transaction = __esm({
  "node_modules/viem/_esm/errors/transaction.js"() {
  }
});

// node_modules/viem/_esm/errors/utils.js
function getAbortError(signal) {
  if (signal?.reason)
    return signal.reason;
  if (typeof DOMException === "function")
    return new DOMException("This operation was aborted", "AbortError");
  const error = new Error("This operation was aborted");
  error.name = "AbortError";
  return error;
}
function isAbortError(error) {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}
var getContractAddress, getUrl;
var init_utils3 = __esm({
  "node_modules/viem/_esm/errors/utils.js"() {
    getContractAddress = (address) => address;
    getUrl = (url) => {
      try {
        const parsed = new URL(url);
        if (!parsed.username && !parsed.password)
          return url;
        parsed.username = "";
        parsed.password = "";
        return parsed.toString();
      } catch {
        return url;
      }
    };
  }
});

// node_modules/viem/_esm/errors/contract.js
var CallExecutionError, ContractFunctionExecutionError, ContractFunctionRevertedError, ContractFunctionZeroDataError, CounterfactualDeploymentFailedError, RawContractError;
var init_contract = __esm({
  "node_modules/viem/_esm/errors/contract.js"() {
    init_parseAccount();
    init_solidity();
    init_decodeErrorResult();
    init_formatAbiItem2();
    init_formatAbiItemWithArgs();
    init_getAbiItem();
    init_formatEther();
    init_formatGwei();
    init_abi();
    init_base();
    init_stateOverride();
    init_transaction();
    init_utils3();
    CallExecutionError = class extends BaseError2 {
      constructor(cause, { account: account_, docsPath: docsPath8, chain, data, gas, gasPrice, maxFeePerGas, maxPriorityFeePerGas, nonce, to, value, stateOverride }) {
        const account = account_ ? parseAccount(account_) : void 0;
        let prettyArgs = prettyPrint({
          from: account?.address,
          to,
          value: typeof value !== "undefined" && `${formatEther2(value)} ${chain?.nativeCurrency?.symbol || "ETH"}`,
          data,
          gas,
          gasPrice: typeof gasPrice !== "undefined" && `${formatGwei2(gasPrice)} gwei`,
          maxFeePerGas: typeof maxFeePerGas !== "undefined" && `${formatGwei2(maxFeePerGas)} gwei`,
          maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== "undefined" && `${formatGwei2(maxPriorityFeePerGas)} gwei`,
          nonce
        });
        if (stateOverride) {
          prettyArgs += `
${prettyStateOverride(stateOverride)}`;
        }
        super(cause.shortMessage, {
          cause,
          docsPath: docsPath8,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            "Raw Call Arguments:",
            prettyArgs
          ].filter(Boolean),
          name: "CallExecutionError"
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.cause = cause;
      }
    };
    ContractFunctionExecutionError = class extends BaseError2 {
      constructor(cause, { abi, args, contractAddress, docsPath: docsPath8, functionName, sender }) {
        const abiItem = getAbiItem({ abi, args, name: functionName });
        const formattedArgs = abiItem ? formatAbiItemWithArgs({
          abiItem,
          args,
          includeFunctionName: false,
          includeName: false
        }) : void 0;
        const functionWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
        const prettyArgs = prettyPrint({
          address: contractAddress && getContractAddress(contractAddress),
          function: functionWithParams,
          args: formattedArgs && formattedArgs !== "()" && `${[...Array(functionName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}`,
          sender
        });
        super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
          cause,
          docsPath: docsPath8,
          metaMessages: [
            ...cause.metaMessages ? [...cause.metaMessages, " "] : [],
            prettyArgs && "Contract Call:",
            prettyArgs
          ].filter(Boolean),
          name: "ContractFunctionExecutionError"
        });
        Object.defineProperty(this, "abi", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "args", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "contractAddress", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "formattedArgs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "functionName", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "sender", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.abi = abi;
        this.args = args;
        this.cause = cause;
        this.contractAddress = contractAddress;
        this.functionName = functionName;
        this.sender = sender;
      }
    };
    ContractFunctionRevertedError = class extends BaseError2 {
      constructor({ abi, data, functionName, message, cause: error }) {
        let cause;
        let decodedData;
        let metaMessages;
        let reason;
        if (data && data !== "0x") {
          try {
            decodedData = decodeErrorResult({ abi, data, cause: error });
            const { abiItem, errorName, args: errorArgs } = decodedData;
            if (errorName === "Error") {
              reason = errorArgs[0];
            } else if (errorName === "Panic") {
              const [firstArg] = errorArgs;
              reason = panicReasons[firstArg];
            } else {
              const errorWithParams = abiItem ? formatAbiItem2(abiItem, { includeName: true }) : void 0;
              const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
                abiItem,
                args: errorArgs,
                includeFunctionName: false,
                includeName: false
              }) : void 0;
              metaMessages = [
                errorWithParams ? `Error: ${errorWithParams}` : "",
                formattedArgs && formattedArgs !== "()" ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => " ").join("")}${formattedArgs}` : ""
              ];
            }
          } catch (err) {
            cause = err;
          }
        } else if (message)
          reason = message;
        let signature;
        if (cause instanceof AbiErrorSignatureNotFoundError) {
          signature = cause.signature;
          metaMessages = [
            `Unable to decode signature "${signature}" as it was not found on the provided ABI.`,
            "Make sure you are using the correct ABI and that the error exists on it.",
            `You can look up the decoded signature here: https://4byte.sourcify.dev/?q=${signature}.`
          ];
        }
        super(reason && reason !== "execution reverted" || signature ? [
          `The contract function "${functionName}" reverted with the following ${signature ? "signature" : "reason"}:`,
          reason || signature
        ].join("\n") : `The contract function "${functionName}" reverted.`, {
          cause: cause ?? error,
          metaMessages,
          name: "ContractFunctionRevertedError"
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "raw", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "reason", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "signature", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = decodedData;
        this.raw = data;
        this.reason = reason;
        this.signature = signature;
      }
    };
    ContractFunctionZeroDataError = class extends BaseError2 {
      constructor({ functionName, cause }) {
        super(`The contract function "${functionName}" returned no data ("0x").`, {
          metaMessages: [
            "This could be due to any of the following:",
            `  - The contract does not have the function "${functionName}",`,
            "  - The parameters passed to the contract function may be invalid, or",
            "  - The address is not a contract."
          ],
          name: "ContractFunctionZeroDataError",
          cause
        });
      }
    };
    CounterfactualDeploymentFailedError = class extends BaseError2 {
      constructor({ factory }) {
        super(`Deployment for counterfactual contract call failed${factory ? ` for factory "${factory}".` : ""}`, {
          metaMessages: [
            "Please ensure:",
            "- The `factory` is a valid contract deployment factory (ie. Create2 Factory, ERC-4337 Factory, etc).",
            "- The `factoryData` is a valid encoded function call for contract deployment function on the factory."
          ],
          name: "CounterfactualDeploymentFailedError"
        });
      }
    };
    RawContractError = class extends BaseError2 {
      constructor({ data, message }) {
        super(message || "", { name: "RawContractError" });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: 3
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = data;
      }
    };
  }
});

// node_modules/viem/_esm/errors/request.js
var HttpRequestError, ResponseBodyTooLargeError, RpcRequestError, TimeoutError;
var init_request = __esm({
  "node_modules/viem/_esm/errors/request.js"() {
    init_stringify();
    init_base();
    init_utils3();
    HttpRequestError = class extends BaseError2 {
      constructor({ body, cause, details, headers, status, url }) {
        super("HTTP request failed.", {
          cause,
          details,
          metaMessages: [
            status && `Status: ${status}`,
            `URL: ${getUrl(url)}`,
            body && `Request body: ${stringify(body)}`
          ].filter(Boolean),
          name: "HttpRequestError"
        });
        Object.defineProperty(this, "body", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "headers", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "status", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.body = body;
        this.headers = headers;
        this.status = status;
        this.url = url;
      }
    };
    ResponseBodyTooLargeError = class extends BaseError2 {
      constructor({ maxSize, size: size4 }) {
        super("HTTP response body exceeded the size limit.", {
          metaMessages: [`Max: ${maxSize} bytes`, `Received: ${size4} bytes`],
          name: "ResponseBodyTooLargeError"
        });
        Object.defineProperty(this, "maxSize", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "size", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.maxSize = maxSize;
        this.size = size4;
      }
    };
    RpcRequestError = class extends BaseError2 {
      constructor({ body, error, url }) {
        super("RPC Request failed.", {
          cause: error,
          details: error.message,
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "RpcRequestError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.code = error.code;
        this.data = error.data;
        this.url = url;
      }
    };
    TimeoutError = class extends BaseError2 {
      constructor({ body, url }) {
        super("The request took too long to respond.", {
          details: "The request timed out.",
          metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
          name: "TimeoutError"
        });
        Object.defineProperty(this, "url", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.url = url;
      }
    };
  }
});

// node_modules/viem/_esm/errors/rpc.js
var unknownErrorCode, RpcError, ProviderRpcError, ParseRpcError, InvalidRequestRpcError, MethodNotFoundRpcError, InvalidParamsRpcError, InternalRpcError, InvalidInputRpcError, ResourceNotFoundRpcError, ResourceUnavailableRpcError, TransactionRejectedRpcError, MethodNotSupportedRpcError, LimitExceededRpcError, JsonRpcVersionUnsupportedError, UserRejectedRequestError, UnauthorizedProviderError, UnsupportedProviderMethodError, ProviderDisconnectedError, ChainDisconnectedError, SwitchChainError, UnsupportedNonOptionalCapabilityError, UnsupportedChainIdError, DuplicateIdError, UnknownBundleIdError, BundleTooLargeError, AtomicReadyWalletRejectedUpgradeError, AtomicityNotSupportedError, WalletConnectSessionSettlementError, UnknownRpcError;
var init_rpc = __esm({
  "node_modules/viem/_esm/errors/rpc.js"() {
    init_base();
    init_request();
    unknownErrorCode = -1;
    RpcError = class extends BaseError2 {
      constructor(cause, { code, docsPath: docsPath8, metaMessages, name, shortMessage }) {
        super(shortMessage, {
          cause,
          docsPath: docsPath8,
          metaMessages: metaMessages || cause?.metaMessages,
          name: name || "RpcError"
        });
        Object.defineProperty(this, "code", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.name = name || cause.name;
        this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
      }
    };
    ProviderRpcError = class extends RpcError {
      constructor(cause, options) {
        super(cause, options);
        Object.defineProperty(this, "data", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        this.data = options.data;
      }
    };
    ParseRpcError = class _ParseRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ParseRpcError.code,
          name: "ParseRpcError",
          shortMessage: "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
        });
      }
    };
    Object.defineProperty(ParseRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32700
    });
    InvalidRequestRpcError = class _InvalidRequestRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidRequestRpcError.code,
          name: "InvalidRequestRpcError",
          shortMessage: "JSON is not a valid request object."
        });
      }
    };
    Object.defineProperty(InvalidRequestRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32600
    });
    MethodNotFoundRpcError = class _MethodNotFoundRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotFoundRpcError.code,
          name: "MethodNotFoundRpcError",
          shortMessage: `The method${method ? ` "${method}"` : ""} does not exist / is not available.`
        });
      }
    };
    Object.defineProperty(MethodNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32601
    });
    InvalidParamsRpcError = class _InvalidParamsRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidParamsRpcError.code,
          name: "InvalidParamsRpcError",
          shortMessage: [
            "Invalid parameters were provided to the RPC method.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidParamsRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32602
    });
    InternalRpcError = class _InternalRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InternalRpcError.code,
          name: "InternalRpcError",
          shortMessage: "An internal error was received."
        });
      }
    };
    Object.defineProperty(InternalRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32603
    });
    InvalidInputRpcError = class _InvalidInputRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _InvalidInputRpcError.code,
          name: "InvalidInputRpcError",
          shortMessage: [
            "Missing or invalid parameters.",
            "Double check you have provided the correct parameters."
          ].join("\n")
        });
      }
    };
    Object.defineProperty(InvalidInputRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32e3
    });
    ResourceNotFoundRpcError = class _ResourceNotFoundRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceNotFoundRpcError.code,
          name: "ResourceNotFoundRpcError",
          shortMessage: "Requested resource not found."
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "ResourceNotFoundRpcError"
        });
      }
    };
    Object.defineProperty(ResourceNotFoundRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32001
    });
    ResourceUnavailableRpcError = class _ResourceUnavailableRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _ResourceUnavailableRpcError.code,
          name: "ResourceUnavailableRpcError",
          shortMessage: "Requested resource not available."
        });
      }
    };
    Object.defineProperty(ResourceUnavailableRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32002
    });
    TransactionRejectedRpcError = class _TransactionRejectedRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _TransactionRejectedRpcError.code,
          name: "TransactionRejectedRpcError",
          shortMessage: "Transaction creation failed."
        });
      }
    };
    Object.defineProperty(TransactionRejectedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32003
    });
    MethodNotSupportedRpcError = class _MethodNotSupportedRpcError extends RpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _MethodNotSupportedRpcError.code,
          name: "MethodNotSupportedRpcError",
          shortMessage: `Method${method ? ` "${method}"` : ""} is not supported.`
        });
      }
    };
    Object.defineProperty(MethodNotSupportedRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32004
    });
    LimitExceededRpcError = class _LimitExceededRpcError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _LimitExceededRpcError.code,
          name: "LimitExceededRpcError",
          shortMessage: "Request exceeds defined limit."
        });
      }
    };
    Object.defineProperty(LimitExceededRpcError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32005
    });
    JsonRpcVersionUnsupportedError = class _JsonRpcVersionUnsupportedError extends RpcError {
      constructor(cause) {
        super(cause, {
          code: _JsonRpcVersionUnsupportedError.code,
          name: "JsonRpcVersionUnsupportedError",
          shortMessage: "Version of JSON-RPC protocol is not supported."
        });
      }
    };
    Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -32006
    });
    UserRejectedRequestError = class _UserRejectedRequestError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UserRejectedRequestError.code,
          name: "UserRejectedRequestError",
          shortMessage: "User rejected the request."
        });
      }
    };
    Object.defineProperty(UserRejectedRequestError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4001
    });
    UnauthorizedProviderError = class _UnauthorizedProviderError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnauthorizedProviderError.code,
          name: "UnauthorizedProviderError",
          shortMessage: "The requested method and/or account has not been authorized by the user."
        });
      }
    };
    Object.defineProperty(UnauthorizedProviderError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4100
    });
    UnsupportedProviderMethodError = class _UnsupportedProviderMethodError extends ProviderRpcError {
      constructor(cause, { method } = {}) {
        super(cause, {
          code: _UnsupportedProviderMethodError.code,
          name: "UnsupportedProviderMethodError",
          shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ""}.`
        });
      }
    };
    Object.defineProperty(UnsupportedProviderMethodError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4200
    });
    ProviderDisconnectedError = class _ProviderDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ProviderDisconnectedError.code,
          name: "ProviderDisconnectedError",
          shortMessage: "The Provider is disconnected from all chains."
        });
      }
    };
    Object.defineProperty(ProviderDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4900
    });
    ChainDisconnectedError = class _ChainDisconnectedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _ChainDisconnectedError.code,
          name: "ChainDisconnectedError",
          shortMessage: "The Provider is not connected to the requested chain."
        });
      }
    };
    Object.defineProperty(ChainDisconnectedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4901
    });
    SwitchChainError = class _SwitchChainError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _SwitchChainError.code,
          name: "SwitchChainError",
          shortMessage: "An error occurred when attempting to switch chain."
        });
      }
    };
    Object.defineProperty(SwitchChainError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 4902
    });
    UnsupportedNonOptionalCapabilityError = class _UnsupportedNonOptionalCapabilityError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnsupportedNonOptionalCapabilityError.code,
          name: "UnsupportedNonOptionalCapabilityError",
          shortMessage: "This Wallet does not support a capability that was not marked as optional."
        });
      }
    };
    Object.defineProperty(UnsupportedNonOptionalCapabilityError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5700
    });
    UnsupportedChainIdError = class _UnsupportedChainIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnsupportedChainIdError.code,
          name: "UnsupportedChainIdError",
          shortMessage: "This Wallet does not support the requested chain ID."
        });
      }
    };
    Object.defineProperty(UnsupportedChainIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5710
    });
    DuplicateIdError = class _DuplicateIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _DuplicateIdError.code,
          name: "DuplicateIdError",
          shortMessage: "There is already a bundle submitted with this ID."
        });
      }
    };
    Object.defineProperty(DuplicateIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5720
    });
    UnknownBundleIdError = class _UnknownBundleIdError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _UnknownBundleIdError.code,
          name: "UnknownBundleIdError",
          shortMessage: "This bundle id is unknown / has not been submitted"
        });
      }
    };
    Object.defineProperty(UnknownBundleIdError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5730
    });
    BundleTooLargeError = class _BundleTooLargeError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _BundleTooLargeError.code,
          name: "BundleTooLargeError",
          shortMessage: "The call bundle is too large for the Wallet to process."
        });
      }
    };
    Object.defineProperty(BundleTooLargeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5740
    });
    AtomicReadyWalletRejectedUpgradeError = class _AtomicReadyWalletRejectedUpgradeError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _AtomicReadyWalletRejectedUpgradeError.code,
          name: "AtomicReadyWalletRejectedUpgradeError",
          shortMessage: "The Wallet can support atomicity after an upgrade, but the user rejected the upgrade."
        });
      }
    };
    Object.defineProperty(AtomicReadyWalletRejectedUpgradeError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5750
    });
    AtomicityNotSupportedError = class _AtomicityNotSupportedError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _AtomicityNotSupportedError.code,
          name: "AtomicityNotSupportedError",
          shortMessage: "The wallet does not support atomic execution but the request requires it."
        });
      }
    };
    Object.defineProperty(AtomicityNotSupportedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 5760
    });
    WalletConnectSessionSettlementError = class _WalletConnectSessionSettlementError extends ProviderRpcError {
      constructor(cause) {
        super(cause, {
          code: _WalletConnectSessionSettlementError.code,
          name: "WalletConnectSessionSettlementError",
          shortMessage: "WalletConnect session settlement failed."
        });
      }
    };
    Object.defineProperty(WalletConnectSessionSettlementError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 7e3
    });
    UnknownRpcError = class extends RpcError {
      constructor(cause) {
        super(cause, {
          name: "UnknownRpcError",
          shortMessage: "An unknown RPC error occurred."
        });
      }
    };
  }
});

// node_modules/viem/_esm/errors/node.js
var ExecutionRevertedError, FeeCapTooHighError, FeeCapTooLowError, NonceTooHighError, NonceTooLowError, NonceMaxValueError, InsufficientFundsError, IntrinsicGasTooHighError, IntrinsicGasTooLowError, TransactionTypeNotSupportedError, TipAboveFeeCapError, UnknownNodeError;
var init_node = __esm({
  "node_modules/viem/_esm/errors/node.js"() {
    init_formatGwei();
    init_base();
    ExecutionRevertedError = class extends BaseError2 {
      constructor({ cause, message } = {}) {
        const reason = message?.replace("execution reverted: ", "")?.replace("execution reverted", "");
        super(`Execution reverted ${reason ? `with reason: ${reason}` : "for an unknown reason"}.`, {
          cause,
          name: "ExecutionRevertedError"
        });
      }
    };
    Object.defineProperty(ExecutionRevertedError, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /execution reverted|gas required exceeds allowance/
    });
    FeeCapTooHighError = class extends BaseError2 {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}) cannot be higher than the maximum allowed value (2^256-1).`, {
          cause,
          name: "FeeCapTooHighError"
        });
      }
    };
    Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
    });
    FeeCapTooLowError = class extends BaseError2 {
      constructor({ cause, maxFeePerGas } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)}` : ""} gwei) cannot be lower than the block base fee.`, {
          cause,
          name: "FeeCapTooLowError"
        });
      }
    };
    Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
    });
    NonceTooHighError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is higher than the next one expected.`, { cause, name: "NonceTooHighError" });
      }
    };
    Object.defineProperty(NonceTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too high/
    });
    NonceTooLowError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super([
          `Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}is lower than the current nonce of the account.`,
          "Try increasing the nonce or find the latest nonce with `getTransactionCount`."
        ].join("\n"), { cause, name: "NonceTooLowError" });
      }
    };
    Object.defineProperty(NonceTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce too low|transaction already imported|already known/
    });
    NonceMaxValueError = class extends BaseError2 {
      constructor({ cause, nonce } = {}) {
        super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ""}exceeds the maximum allowed nonce.`, { cause, name: "NonceMaxValueError" });
      }
    };
    Object.defineProperty(NonceMaxValueError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /nonce has max value/
    });
    InsufficientFundsError = class extends BaseError2 {
      constructor({ cause } = {}) {
        super([
          "The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account."
        ].join("\n"), {
          cause,
          metaMessages: [
            "This error could arise when the account does not have enough funds to:",
            " - pay for the total gas fee,",
            " - pay for the value to send.",
            " ",
            "The cost of the transaction is calculated as `gas * gas fee + value`, where:",
            " - `gas` is the amount of gas needed for transaction to execute,",
            " - `gas fee` is the gas fee,",
            " - `value` is the amount of ether to send to the recipient."
          ],
          name: "InsufficientFundsError"
        });
      }
    };
    Object.defineProperty(InsufficientFundsError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /insufficient funds|exceeds transaction sender account balance/
    });
    IntrinsicGasTooHighError = class extends BaseError2 {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction exceeds the limit allowed for the block.`, {
          cause,
          name: "IntrinsicGasTooHighError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too high|gas limit reached/
    });
    IntrinsicGasTooLowError = class extends BaseError2 {
      constructor({ cause, gas } = {}) {
        super(`The amount of gas ${gas ? `(${gas}) ` : ""}provided for the transaction is too low.`, {
          cause,
          name: "IntrinsicGasTooLowError"
        });
      }
    };
    Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /intrinsic gas too low/
    });
    TransactionTypeNotSupportedError = class extends BaseError2 {
      constructor({ cause }) {
        super("The transaction type is not supported for this chain.", {
          cause,
          name: "TransactionTypeNotSupportedError"
        });
      }
    };
    Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /transaction type not valid/
    });
    TipAboveFeeCapError = class extends BaseError2 {
      constructor({ cause, maxPriorityFeePerGas, maxFeePerGas } = {}) {
        super([
          `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei2(maxPriorityFeePerGas)} gwei` : ""}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei2(maxFeePerGas)} gwei` : ""}).`
        ].join("\n"), {
          cause,
          name: "TipAboveFeeCapError"
        });
      }
    };
    Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
    });
    UnknownNodeError = class extends BaseError2 {
      constructor({ cause }) {
        super(`An error occurred while executing: ${cause?.shortMessage}`, {
          cause,
          name: "UnknownNodeError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/errors/getNodeError.js
function getNodeError(err, args) {
  const message = (err.details || "").toLowerCase();
  const executionRevertedError = err instanceof BaseError2 ? err.walk((e) => e?.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError2)
    return new ExecutionRevertedError({
      cause: err,
      message: executionRevertedError.details
    });
  if (ExecutionRevertedError.nodeMessage.test(message))
    return new ExecutionRevertedError({
      cause: err,
      message: err.details
    });
  if (FeeCapTooHighError.nodeMessage.test(message))
    return new FeeCapTooHighError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (FeeCapTooLowError.nodeMessage.test(message))
    return new FeeCapTooLowError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas
    });
  if (NonceTooHighError.nodeMessage.test(message))
    return new NonceTooHighError({ cause: err, nonce: args?.nonce });
  if (NonceTooLowError.nodeMessage.test(message))
    return new NonceTooLowError({ cause: err, nonce: args?.nonce });
  if (NonceMaxValueError.nodeMessage.test(message))
    return new NonceMaxValueError({ cause: err, nonce: args?.nonce });
  if (InsufficientFundsError.nodeMessage.test(message))
    return new InsufficientFundsError({ cause: err });
  if (IntrinsicGasTooHighError.nodeMessage.test(message))
    return new IntrinsicGasTooHighError({ cause: err, gas: args?.gas });
  if (IntrinsicGasTooLowError.nodeMessage.test(message))
    return new IntrinsicGasTooLowError({ cause: err, gas: args?.gas });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message))
    return new TransactionTypeNotSupportedError({ cause: err });
  if (TipAboveFeeCapError.nodeMessage.test(message))
    return new TipAboveFeeCapError({
      cause: err,
      maxFeePerGas: args?.maxFeePerGas,
      maxPriorityFeePerGas: args?.maxPriorityFeePerGas
    });
  return new UnknownNodeError({
    cause: err
  });
}
var init_getNodeError = __esm({
  "node_modules/viem/_esm/utils/errors/getNodeError.js"() {
    init_base();
    init_node();
  }
});

// node_modules/viem/_esm/utils/formatters/extract.js
function extract(value_, { format: format2 }) {
  if (!format2)
    return {};
  const value = {};
  function extract_(formatted2) {
    const keys = Object.keys(formatted2);
    for (const key of keys) {
      if (key in value_)
        value[key] = value_[key];
      if (formatted2[key] && typeof formatted2[key] === "object" && !Array.isArray(formatted2[key]))
        extract_(formatted2[key]);
    }
  }
  const formatted = format2(value_ || {});
  extract_(formatted);
  return value;
}
var init_extract = __esm({
  "node_modules/viem/_esm/utils/formatters/extract.js"() {
  }
});

// node_modules/viem/_esm/utils/formatters/transactionRequest.js
function formatTransactionRequest(request, _) {
  const rpcRequest = {};
  if (typeof request.authorizationList !== "undefined")
    rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
  if (typeof request.accessList !== "undefined")
    rpcRequest.accessList = request.accessList;
  if (typeof request.blobVersionedHashes !== "undefined")
    rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== "undefined") {
    if (typeof request.blobs[0] !== "string")
      rpcRequest.blobs = request.blobs.map((x) => bytesToHex(x));
    else
      rpcRequest.blobs = request.blobs;
  }
  if (typeof request.data !== "undefined")
    rpcRequest.data = request.data;
  if (request.account)
    rpcRequest.from = request.account.address;
  if (typeof request.from !== "undefined")
    rpcRequest.from = request.from;
  if (typeof request.gas !== "undefined")
    rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.gasPrice !== "undefined")
    rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== "undefined")
    rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== "undefined")
    rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== "undefined")
    rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== "undefined")
    rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.to !== "undefined")
    rpcRequest.to = request.to;
  if (typeof request.type !== "undefined")
    rpcRequest.type = rpcTransactionType[request.type];
  if (typeof request.value !== "undefined")
    rpcRequest.value = numberToHex(request.value);
  return rpcRequest;
}
function formatAuthorizationList(authorizationList) {
  return authorizationList.map((authorization) => ({
    address: authorization.address,
    r: authorization.r ? numberToHex(BigInt(authorization.r)) : authorization.r,
    s: authorization.s ? numberToHex(BigInt(authorization.s)) : authorization.s,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    ...typeof authorization.yParity !== "undefined" ? { yParity: numberToHex(authorization.yParity) } : {},
    ...typeof authorization.v !== "undefined" && typeof authorization.yParity === "undefined" ? { v: numberToHex(authorization.v) } : {}
  }));
}
var rpcTransactionType;
var init_transactionRequest = __esm({
  "node_modules/viem/_esm/utils/formatters/transactionRequest.js"() {
    init_toHex();
    rpcTransactionType = {
      legacy: "0x0",
      eip2930: "0x1",
      eip1559: "0x2",
      eip4844: "0x3",
      eip7702: "0x4"
    };
  }
});

// node_modules/viem/_esm/utils/stateOverride.js
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0)
    return void 0;
  return stateMapping.reduce((acc, { slot, value }) => {
    if (slot.length !== 66)
      throw new InvalidBytesLengthError({
        size: slot.length,
        targetSize: 66,
        type: "hex"
      });
    if (value.length !== 66)
      throw new InvalidBytesLengthError({
        size: value.length,
        targetSize: 66,
        type: "hex"
      });
    acc[slot] = value;
    return acc;
  }, {});
}
function serializeAccountStateOverride(parameters) {
  const { balance, nonce, state, stateDiff, code } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== void 0)
    rpcAccountStateOverride.code = code;
  if (balance !== void 0)
    rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== void 0)
    rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== void 0)
    rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== void 0) {
    if (rpcAccountStateOverride.state)
      throw new StateAssignmentConflictError();
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
function serializeStateOverride(parameters) {
  if (!parameters)
    return void 0;
  const rpcStateOverride = {};
  for (const { address, ...accountState } of parameters) {
    if (!isAddress(address, { strict: false }))
      throw new InvalidAddressError({ address });
    if (rpcStateOverride[address])
      throw new AccountStateConflictError({ address });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}
var init_stateOverride2 = __esm({
  "node_modules/viem/_esm/utils/stateOverride.js"() {
    init_address();
    init_data();
    init_stateOverride();
    init_isAddress();
    init_toHex();
  }
});

// node_modules/viem/_esm/constants/number.js
var maxInt8, maxInt16, maxInt24, maxInt32, maxInt40, maxInt48, maxInt56, maxInt64, maxInt72, maxInt80, maxInt88, maxInt96, maxInt104, maxInt112, maxInt120, maxInt128, maxInt136, maxInt144, maxInt152, maxInt160, maxInt168, maxInt176, maxInt184, maxInt192, maxInt200, maxInt208, maxInt216, maxInt224, maxInt232, maxInt240, maxInt248, maxInt256, minInt8, minInt16, minInt24, minInt32, minInt40, minInt48, minInt56, minInt64, minInt72, minInt80, minInt88, minInt96, minInt104, minInt112, minInt120, minInt128, minInt136, minInt144, minInt152, minInt160, minInt168, minInt176, minInt184, minInt192, minInt200, minInt208, minInt216, minInt224, minInt232, minInt240, minInt248, minInt256, maxUint8, maxUint16, maxUint24, maxUint32, maxUint40, maxUint48, maxUint56, maxUint64, maxUint72, maxUint80, maxUint88, maxUint96, maxUint104, maxUint112, maxUint120, maxUint128, maxUint136, maxUint144, maxUint152, maxUint160, maxUint168, maxUint176, maxUint184, maxUint192, maxUint200, maxUint208, maxUint216, maxUint224, maxUint232, maxUint240, maxUint248, maxUint256;
var init_number = __esm({
  "node_modules/viem/_esm/constants/number.js"() {
    maxInt8 = 2n ** (8n - 1n) - 1n;
    maxInt16 = 2n ** (16n - 1n) - 1n;
    maxInt24 = 2n ** (24n - 1n) - 1n;
    maxInt32 = 2n ** (32n - 1n) - 1n;
    maxInt40 = 2n ** (40n - 1n) - 1n;
    maxInt48 = 2n ** (48n - 1n) - 1n;
    maxInt56 = 2n ** (56n - 1n) - 1n;
    maxInt64 = 2n ** (64n - 1n) - 1n;
    maxInt72 = 2n ** (72n - 1n) - 1n;
    maxInt80 = 2n ** (80n - 1n) - 1n;
    maxInt88 = 2n ** (88n - 1n) - 1n;
    maxInt96 = 2n ** (96n - 1n) - 1n;
    maxInt104 = 2n ** (104n - 1n) - 1n;
    maxInt112 = 2n ** (112n - 1n) - 1n;
    maxInt120 = 2n ** (120n - 1n) - 1n;
    maxInt128 = 2n ** (128n - 1n) - 1n;
    maxInt136 = 2n ** (136n - 1n) - 1n;
    maxInt144 = 2n ** (144n - 1n) - 1n;
    maxInt152 = 2n ** (152n - 1n) - 1n;
    maxInt160 = 2n ** (160n - 1n) - 1n;
    maxInt168 = 2n ** (168n - 1n) - 1n;
    maxInt176 = 2n ** (176n - 1n) - 1n;
    maxInt184 = 2n ** (184n - 1n) - 1n;
    maxInt192 = 2n ** (192n - 1n) - 1n;
    maxInt200 = 2n ** (200n - 1n) - 1n;
    maxInt208 = 2n ** (208n - 1n) - 1n;
    maxInt216 = 2n ** (216n - 1n) - 1n;
    maxInt224 = 2n ** (224n - 1n) - 1n;
    maxInt232 = 2n ** (232n - 1n) - 1n;
    maxInt240 = 2n ** (240n - 1n) - 1n;
    maxInt248 = 2n ** (248n - 1n) - 1n;
    maxInt256 = 2n ** (256n - 1n) - 1n;
    minInt8 = -(2n ** (8n - 1n));
    minInt16 = -(2n ** (16n - 1n));
    minInt24 = -(2n ** (24n - 1n));
    minInt32 = -(2n ** (32n - 1n));
    minInt40 = -(2n ** (40n - 1n));
    minInt48 = -(2n ** (48n - 1n));
    minInt56 = -(2n ** (56n - 1n));
    minInt64 = -(2n ** (64n - 1n));
    minInt72 = -(2n ** (72n - 1n));
    minInt80 = -(2n ** (80n - 1n));
    minInt88 = -(2n ** (88n - 1n));
    minInt96 = -(2n ** (96n - 1n));
    minInt104 = -(2n ** (104n - 1n));
    minInt112 = -(2n ** (112n - 1n));
    minInt120 = -(2n ** (120n - 1n));
    minInt128 = -(2n ** (128n - 1n));
    minInt136 = -(2n ** (136n - 1n));
    minInt144 = -(2n ** (144n - 1n));
    minInt152 = -(2n ** (152n - 1n));
    minInt160 = -(2n ** (160n - 1n));
    minInt168 = -(2n ** (168n - 1n));
    minInt176 = -(2n ** (176n - 1n));
    minInt184 = -(2n ** (184n - 1n));
    minInt192 = -(2n ** (192n - 1n));
    minInt200 = -(2n ** (200n - 1n));
    minInt208 = -(2n ** (208n - 1n));
    minInt216 = -(2n ** (216n - 1n));
    minInt224 = -(2n ** (224n - 1n));
    minInt232 = -(2n ** (232n - 1n));
    minInt240 = -(2n ** (240n - 1n));
    minInt248 = -(2n ** (248n - 1n));
    minInt256 = -(2n ** (256n - 1n));
    maxUint8 = 2n ** 8n - 1n;
    maxUint16 = 2n ** 16n - 1n;
    maxUint24 = 2n ** 24n - 1n;
    maxUint32 = 2n ** 32n - 1n;
    maxUint40 = 2n ** 40n - 1n;
    maxUint48 = 2n ** 48n - 1n;
    maxUint56 = 2n ** 56n - 1n;
    maxUint64 = 2n ** 64n - 1n;
    maxUint72 = 2n ** 72n - 1n;
    maxUint80 = 2n ** 80n - 1n;
    maxUint88 = 2n ** 88n - 1n;
    maxUint96 = 2n ** 96n - 1n;
    maxUint104 = 2n ** 104n - 1n;
    maxUint112 = 2n ** 112n - 1n;
    maxUint120 = 2n ** 120n - 1n;
    maxUint128 = 2n ** 128n - 1n;
    maxUint136 = 2n ** 136n - 1n;
    maxUint144 = 2n ** 144n - 1n;
    maxUint152 = 2n ** 152n - 1n;
    maxUint160 = 2n ** 160n - 1n;
    maxUint168 = 2n ** 168n - 1n;
    maxUint176 = 2n ** 176n - 1n;
    maxUint184 = 2n ** 184n - 1n;
    maxUint192 = 2n ** 192n - 1n;
    maxUint200 = 2n ** 200n - 1n;
    maxUint208 = 2n ** 208n - 1n;
    maxUint216 = 2n ** 216n - 1n;
    maxUint224 = 2n ** 224n - 1n;
    maxUint232 = 2n ** 232n - 1n;
    maxUint240 = 2n ** 240n - 1n;
    maxUint248 = 2n ** 248n - 1n;
    maxUint256 = 2n ** 256n - 1n;
  }
});

// node_modules/viem/_esm/utils/transaction/assertRequest.js
function assertRequest(args) {
  const { account: account_, maxFeePerGas, maxPriorityFeePerGas, to } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (account && !isAddress(account.address))
    throw new InvalidAddressError({ address: account.address });
  if (to && !isAddress(to))
    throw new InvalidAddressError({ address: to });
  if (maxFeePerGas && maxFeePerGas > maxUint256)
    throw new FeeCapTooHighError({ maxFeePerGas });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas)
    throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
var init_assertRequest = __esm({
  "node_modules/viem/_esm/utils/transaction/assertRequest.js"() {
    init_parseAccount();
    init_number();
    init_address();
    init_node();
    init_isAddress();
  }
});

// node_modules/viem/_esm/utils/block/formatBlockParameter.js
function formatBlockParameter(parameters) {
  const { blockHash, blockNumber, blockTag, requireCanonical } = parameters;
  if (requireCanonical !== void 0 && !blockHash)
    throw new BaseError2("`requireCanonical` can only be provided when `blockHash` is set.");
  if (blockHash)
    return requireCanonical ? { blockHash, requireCanonical } : { blockHash };
  if (typeof blockNumber === "bigint")
    return numberToHex(blockNumber);
  return blockTag ?? "latest";
}
var init_formatBlockParameter = __esm({
  "node_modules/viem/_esm/utils/block/formatBlockParameter.js"() {
    init_base();
    init_toHex();
  }
});

// node_modules/viem/_esm/utils/address/isAddressEqual.js
function isAddressEqual(a, b) {
  if (!isAddress(a, { strict: false }))
    throw new InvalidAddressError({ address: a });
  if (!isAddress(b, { strict: false }))
    throw new InvalidAddressError({ address: b });
  return a.toLowerCase() === b.toLowerCase();
}
var init_isAddressEqual = __esm({
  "node_modules/viem/_esm/utils/address/isAddressEqual.js"() {
    init_address();
    init_isAddress();
  }
});

// node_modules/viem/_esm/utils/abi/decodeFunctionResult.js
function decodeFunctionResult(parameters) {
  const { abi, args, functionName, data } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, args, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath4 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath4 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath4 });
  const values = decodeAbiParameters(abiItem.outputs, data);
  if (values && values.length > 1)
    return values;
  if (values && values.length === 1)
    return values[0];
  return void 0;
}
var docsPath4;
var init_decodeFunctionResult = __esm({
  "node_modules/viem/_esm/utils/abi/decodeFunctionResult.js"() {
    init_abi();
    init_decodeAbiParameters();
    init_getAbiItem();
    docsPath4 = "/docs/contract/decodeFunctionResult";
  }
});

// node_modules/ox/_esm/core/version.js
var version3;
var init_version3 = __esm({
  "node_modules/ox/_esm/core/version.js"() {
    version3 = "0.1.1";
  }
});

// node_modules/ox/_esm/core/internal/errors.js
function getVersion() {
  return version3;
}
var init_errors2 = __esm({
  "node_modules/ox/_esm/core/internal/errors.js"() {
    init_version3();
  }
});

// node_modules/ox/_esm/core/Errors.js
function walk2(err, fn) {
  if (fn?.(err))
    return err;
  if (err && typeof err === "object" && "cause" in err && err.cause)
    return walk2(err.cause, fn);
  return fn ? null : err;
}
var BaseError3;
var init_Errors = __esm({
  "node_modules/ox/_esm/core/Errors.js"() {
    init_errors2();
    BaseError3 = class _BaseError extends Error {
      static setStaticOptions(options) {
        _BaseError.prototype.docsOrigin = options.docsOrigin;
        _BaseError.prototype.showVersion = options.showVersion;
        _BaseError.prototype.version = options.version;
      }
      constructor(shortMessage, options = {}) {
        const details = (() => {
          if (options.cause instanceof _BaseError) {
            if (options.cause.details)
              return options.cause.details;
            if (options.cause.shortMessage)
              return options.cause.shortMessage;
          }
          if (options.cause && "details" in options.cause && typeof options.cause.details === "string")
            return options.cause.details;
          if (options.cause?.message)
            return options.cause.message;
          return options.details;
        })();
        const docsPath8 = (() => {
          if (options.cause instanceof _BaseError)
            return options.cause.docsPath || options.docsPath;
          return options.docsPath;
        })();
        const docsBaseUrl = options.docsOrigin ?? _BaseError.prototype.docsOrigin;
        const docs = `${docsBaseUrl}${docsPath8 ?? ""}`;
        const showVersion = Boolean(options.version ?? _BaseError.prototype.showVersion);
        const version4 = options.version ?? _BaseError.prototype.version;
        const message = [
          shortMessage || "An error occurred.",
          ...options.metaMessages ? ["", ...options.metaMessages] : [],
          ...details || docsPath8 || showVersion ? [
            "",
            details ? `Details: ${details}` : void 0,
            docsPath8 ? `See: ${docs}` : void 0,
            showVersion ? `Version: ${version4}` : void 0
          ] : []
        ].filter((x) => typeof x === "string").join("\n");
        super(message, options.cause ? { cause: options.cause } : void 0);
        Object.defineProperty(this, "details", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docs", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsOrigin", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "docsPath", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "showVersion", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "version", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "cause", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: void 0
        });
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "BaseError"
        });
        this.cause = options.cause;
        this.details = details;
        this.docs = docs;
        this.docsOrigin = docsBaseUrl;
        this.docsPath = docsPath8;
        this.shortMessage = shortMessage;
        this.showVersion = showVersion;
        this.version = version4;
      }
      walk(fn) {
        return walk2(this, fn);
      }
    };
    Object.defineProperty(BaseError3, "defaultStaticOptions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {
        docsOrigin: "https://oxlib.sh",
        showVersion: false,
        version: `ox@${getVersion()}`
      }
    });
    (() => {
      BaseError3.setStaticOptions(BaseError3.defaultStaticOptions);
    })();
  }
});

// node_modules/ox/_esm/core/internal/hex.js
function pad2(hex_, options = {}) {
  const { dir, size: size4 = 32 } = options;
  if (size4 === 0)
    return hex_;
  const hex = hex_.replace("0x", "");
  if (hex.length > size4 * 2)
    throw new SizeExceedsPaddingSizeError2({
      size: Math.ceil(hex.length / 2),
      targetSize: size4,
      type: "Hex"
    });
  return `0x${hex[dir === "right" ? "padEnd" : "padStart"](size4 * 2, "0")}`;
}
var init_hex = __esm({
  "node_modules/ox/_esm/core/internal/hex.js"() {
    init_Hex();
  }
});

// node_modules/ox/_esm/core/Hex.js
function fromNumber(value, options = {}) {
  const { signed, size: size4 } = options;
  const value_ = BigInt(value);
  let maxValue;
  if (size4) {
    if (signed)
      maxValue = (1n << BigInt(size4) * 8n - 1n) - 1n;
    else
      maxValue = 2n ** (BigInt(size4) * 8n) - 1n;
  } else if (typeof value === "number") {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === "bigint" && signed ? -maxValue - 1n : 0;
  if (maxValue && value_ > maxValue || value_ < minValue) {
    const suffix = typeof value === "bigint" ? "n" : "";
    throw new IntegerOutOfRangeError2({
      max: maxValue ? `${maxValue}${suffix}` : void 0,
      min: `${minValue}${suffix}`,
      signed,
      size: size4,
      value: `${value}${suffix}`
    });
  }
  const stringValue = (signed && value_ < 0 ? BigInt.asUintN(size4 * 8, BigInt(value_)) : value_).toString(16);
  const hex = `0x${stringValue}`;
  if (size4)
    return padLeft(hex, size4);
  return hex;
}
function padLeft(value, size4) {
  return pad2(value, { dir: "left", size: size4 });
}
var IntegerOutOfRangeError2, SizeExceedsPaddingSizeError2;
var init_Hex = __esm({
  "node_modules/ox/_esm/core/Hex.js"() {
    init_Errors();
    init_hex();
    IntegerOutOfRangeError2 = class extends BaseError3 {
      constructor({ max, min, signed, size: size4, value }) {
        super(`Number \`${value}\` is not in safe${size4 ? ` ${size4 * 8}-bit` : ""}${signed ? " signed" : " unsigned"} integer range ${max ? `(\`${min}\` to \`${max}\`)` : `(above \`${min}\`)`}`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.IntegerOutOfRangeError"
        });
      }
    };
    SizeExceedsPaddingSizeError2 = class extends BaseError3 {
      constructor({ size: size4, targetSize, type }) {
        super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (\`${size4}\`) exceeds padding size (\`${targetSize}\`).`);
        Object.defineProperty(this, "name", {
          enumerable: true,
          configurable: true,
          writable: true,
          value: "Hex.SizeExceedsPaddingSizeError"
        });
      }
    };
  }
});

// node_modules/ox/_esm/core/Withdrawal.js
function toRpc(withdrawal) {
  return {
    address: withdrawal.address,
    amount: fromNumber(withdrawal.amount),
    index: fromNumber(withdrawal.index),
    validatorIndex: fromNumber(withdrawal.validatorIndex)
  };
}
var init_Withdrawal = __esm({
  "node_modules/ox/_esm/core/Withdrawal.js"() {
    init_Hex();
  }
});

// node_modules/ox/_esm/core/BlockOverrides.js
function toRpc2(blockOverrides) {
  return {
    ...typeof blockOverrides.baseFeePerGas === "bigint" && {
      baseFeePerGas: fromNumber(blockOverrides.baseFeePerGas)
    },
    ...typeof blockOverrides.blobBaseFee === "bigint" && {
      blobBaseFee: fromNumber(blockOverrides.blobBaseFee)
    },
    ...typeof blockOverrides.feeRecipient === "string" && {
      feeRecipient: blockOverrides.feeRecipient
    },
    ...typeof blockOverrides.gasLimit === "bigint" && {
      gasLimit: fromNumber(blockOverrides.gasLimit)
    },
    ...typeof blockOverrides.number === "bigint" && {
      number: fromNumber(blockOverrides.number)
    },
    ...typeof blockOverrides.prevRandao === "bigint" && {
      prevRandao: fromNumber(blockOverrides.prevRandao)
    },
    ...typeof blockOverrides.time === "bigint" && {
      time: fromNumber(blockOverrides.time)
    },
    ...blockOverrides.withdrawals && {
      withdrawals: blockOverrides.withdrawals.map(toRpc)
    }
  };
}
var init_BlockOverrides = __esm({
  "node_modules/ox/_esm/core/BlockOverrides.js"() {
    init_Hex();
    init_Withdrawal();
  }
});

// node_modules/viem/_esm/constants/abis.js
var multicall3Abi, batchGatewayAbi, universalResolverErrors, universalResolverResolveAbi, universalResolverReverseAbi;
var init_abis = __esm({
  "node_modules/viem/_esm/constants/abis.js"() {
    multicall3Abi = [
      {
        inputs: [
          {
            components: [
              {
                name: "target",
                type: "address"
              },
              {
                name: "allowFailure",
                type: "bool"
              },
              {
                name: "callData",
                type: "bytes"
              }
            ],
            name: "calls",
            type: "tuple[]"
          }
        ],
        name: "aggregate3",
        outputs: [
          {
            components: [
              {
                name: "success",
                type: "bool"
              },
              {
                name: "returnData",
                type: "bytes"
              }
            ],
            name: "returnData",
            type: "tuple[]"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [
          {
            name: "addr",
            type: "address"
          }
        ],
        name: "getEthBalance",
        outputs: [
          {
            name: "balance",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
      {
        inputs: [],
        name: "getCurrentBlockTimestamp",
        outputs: [
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ];
    batchGatewayAbi = [
      {
        name: "query",
        type: "function",
        stateMutability: "view",
        inputs: [
          {
            type: "tuple[]",
            name: "queries",
            components: [
              {
                type: "address",
                name: "sender"
              },
              {
                type: "string[]",
                name: "urls"
              },
              {
                type: "bytes",
                name: "data"
              }
            ]
          }
        ],
        outputs: [
          {
            type: "bool[]",
            name: "failures"
          },
          {
            type: "bytes[]",
            name: "responses"
          }
        ]
      },
      {
        name: "HttpError",
        type: "error",
        inputs: [
          {
            type: "uint16",
            name: "status"
          },
          {
            type: "string",
            name: "message"
          }
        ]
      }
    ];
    universalResolverErrors = [
      {
        inputs: [
          {
            name: "dns",
            type: "bytes"
          }
        ],
        name: "DNSDecodingFailed",
        type: "error"
      },
      {
        inputs: [
          {
            name: "ens",
            type: "string"
          }
        ],
        name: "DNSEncodingFailed",
        type: "error"
      },
      {
        inputs: [],
        name: "EmptyAddress",
        type: "error"
      },
      {
        inputs: [
          {
            name: "status",
            type: "uint16"
          },
          {
            name: "message",
            type: "string"
          }
        ],
        name: "HttpError",
        type: "error"
      },
      {
        inputs: [],
        name: "InvalidBatchGatewayResponse",
        type: "error"
      },
      {
        inputs: [
          {
            name: "errorData",
            type: "bytes"
          }
        ],
        name: "ResolverError",
        type: "error"
      },
      {
        inputs: [
          {
            name: "name",
            type: "bytes"
          },
          {
            name: "resolver",
            type: "address"
          }
        ],
        name: "ResolverNotContract",
        type: "error"
      },
      {
        inputs: [
          {
            name: "name",
            type: "bytes"
          }
        ],
        name: "ResolverNotFound",
        type: "error"
      },
      {
        inputs: [
          {
            name: "primary",
            type: "string"
          },
          {
            name: "primaryAddress",
            type: "bytes"
          }
        ],
        name: "ReverseAddressMismatch",
        type: "error"
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "selector",
            type: "bytes4"
          }
        ],
        name: "UnsupportedResolverProfile",
        type: "error"
      }
    ];
    universalResolverResolveAbi = [
      ...universalResolverErrors,
      {
        name: "resolveWithGateways",
        type: "function",
        stateMutability: "view",
        inputs: [
          { name: "name", type: "bytes" },
          { name: "data", type: "bytes" },
          { name: "gateways", type: "string[]" }
        ],
        outputs: [
          { name: "", type: "bytes" },
          { name: "address", type: "address" }
        ]
      }
    ];
    universalResolverReverseAbi = [
      ...universalResolverErrors,
      {
        name: "reverseWithGateways",
        type: "function",
        stateMutability: "view",
        inputs: [
          { type: "bytes", name: "reverseName" },
          { type: "uint256", name: "coinType" },
          { type: "string[]", name: "gateways" }
        ],
        outputs: [
          { type: "string", name: "resolvedName" },
          { type: "address", name: "resolver" },
          { type: "address", name: "reverseResolver" }
        ]
      }
    ];
  }
});

// node_modules/viem/_esm/constants/contract.js
var aggregate3Signature;
var init_contract2 = __esm({
  "node_modules/viem/_esm/constants/contract.js"() {
    aggregate3Signature = "0x82ad56cb";
  }
});

// node_modules/viem/_esm/constants/contracts.js
var deploylessCallViaBytecodeBytecode, deploylessCallViaFactoryBytecode, multicall3Bytecode;
var init_contracts = __esm({
  "node_modules/viem/_esm/constants/contracts.js"() {
    deploylessCallViaBytecodeBytecode = "0x608060405234801561001057600080fd5b5060405161018e38038061018e83398101604081905261002f91610124565b6000808351602085016000f59050803b61004857600080fd5b6000808351602085016000855af16040513d6000823e81610067573d81fd5b3d81f35b634e487b7160e01b600052604160045260246000fd5b600082601f83011261009257600080fd5b81516001600160401b038111156100ab576100ab61006b565b604051601f8201601f19908116603f011681016001600160401b03811182821017156100d9576100d961006b565b6040528181528382016020018510156100f157600080fd5b60005b82811015610110576020818601810151838301820152016100f4565b506000918101602001919091529392505050565b6000806040838503121561013757600080fd5b82516001600160401b0381111561014d57600080fd5b61015985828601610081565b602085015190935090506001600160401b0381111561017757600080fd5b61018385828601610081565b915050925092905056fe";
    deploylessCallViaFactoryBytecode = "0x608060405234801561001057600080fd5b506040516102c03803806102c083398101604081905261002f916101e6565b836001600160a01b03163b6000036100e457600080836001600160a01b03168360405161005c9190610270565b6000604051808303816000865af19150503d8060008114610099576040519150601f19603f3d011682016040523d82523d6000602084013e61009e565b606091505b50915091508115806100b857506001600160a01b0386163b155b156100e1578060405163101bb98d60e01b81526004016100d8919061028c565b60405180910390fd5b50505b6000808451602086016000885af16040513d6000823e81610103573d81fd5b3d81f35b80516001600160a01b038116811461011e57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b60005b8381101561015457818101518382015260200161013c565b50506000910152565b600082601f83011261016e57600080fd5b81516001600160401b0381111561018757610187610123565b604051601f8201601f19908116603f011681016001600160401b03811182821017156101b5576101b5610123565b6040528181528382016020018510156101cd57600080fd5b6101de826020830160208701610139565b949350505050565b600080600080608085870312156101fc57600080fd5b61020585610107565b60208601519094506001600160401b0381111561022157600080fd5b61022d8782880161015d565b93505061023c60408601610107565b60608601519092506001600160401b0381111561025857600080fd5b6102648782880161015d565b91505092959194509250565b60008251610282818460208701610139565b9190910192915050565b60208152600082518060208401526102ab816040850160208701610139565b601f01601f1916919091016040019291505056fe";
    multicall3Bytecode = "0x608060405234801561001057600080fd5b506115b9806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e14610325578063bce38bd714610350578063c3077fa914610380578063ee82ac5e146103b2576100f3565b80634d2301cc1461026257806372425d9d1461029f57806382ad56cb146102ca57806386d516e8146102fa576100f3565b80633408e470116100c65780633408e470146101af578063399542e9146101da5780633e64a6961461020c57806342cbb15c14610237576100f3565b80630f28c97d146100f8578063174dea7114610123578063252dba421461015357806327e86d6e14610184575b600080fd5b34801561010457600080fd5b5061010d6103ef565b60405161011a9190610c0a565b60405180910390f35b61013d60048036038101906101389190610c94565b6103f7565b60405161014a9190610e94565b60405180910390f35b61016d60048036038101906101689190610f0c565b610615565b60405161017b92919061101b565b60405180910390f35b34801561019057600080fd5b506101996107ab565b6040516101a69190611064565b60405180910390f35b3480156101bb57600080fd5b506101c46107b7565b6040516101d19190610c0a565b60405180910390f35b6101f460048036038101906101ef91906110ab565b6107bf565b6040516102039392919061110b565b60405180910390f35b34801561021857600080fd5b506102216107e1565b60405161022e9190610c0a565b60405180910390f35b34801561024357600080fd5b5061024c6107e9565b6040516102599190610c0a565b60405180910390f35b34801561026e57600080fd5b50610289600480360381019061028491906111a7565b6107f1565b6040516102969190610c0a565b60405180910390f35b3480156102ab57600080fd5b506102b4610812565b6040516102c19190610c0a565b60405180910390f35b6102e460048036038101906102df919061122a565b61081a565b6040516102f19190610e94565b60405180910390f35b34801561030657600080fd5b5061030f6109e4565b60405161031c9190610c0a565b60405180910390f35b34801561033157600080fd5b5061033a6109ec565b6040516103479190611286565b60405180910390f35b61036a600480360381019061036591906110ab565b6109f4565b6040516103779190610e94565b60405180910390f35b61039a60048036038101906103959190610f0c565b610ba6565b6040516103a99392919061110b565b60405180910390f35b3480156103be57600080fd5b506103d960048036038101906103d491906112cd565b610bca565b6040516103e69190611064565b60405180910390f35b600042905090565b60606000808484905090508067ffffffffffffffff81111561041c5761041b6112fa565b5b60405190808252806020026020018201604052801561045557816020015b610442610bd5565b81526020019060019003908161043a5790505b5092503660005b828110156105c957600085828151811061047957610478611329565b5b6020026020010151905087878381811061049657610495611329565b5b90506020028101906104a89190611367565b925060008360400135905080860195508360000160208101906104cb91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16818580606001906104f2919061138f565b604051610500929190611431565b60006040518083038185875af1925050503d806000811461053d576040519150601f19603f3d011682016040523d82523d6000602084013e610542565b606091505b5083600001846020018290528215151515815250505081516020850135176105bc577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b826001019250505061045c565b5082341461060c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610603906114a7565b60405180910390fd5b50505092915050565b6000606043915060008484905090508067ffffffffffffffff81111561063e5761063d6112fa565b5b60405190808252806020026020018201604052801561067157816020015b606081526020019060019003908161065c5790505b5091503660005b828110156107a157600087878381811061069557610694611329565b5b90506020028101906106a791906114c7565b92508260000160208101906106bc91906111a7565b73ffffffffffffffffffffffffffffffffffffffff168380602001906106e2919061138f565b6040516106f0929190611431565b6000604051808303816000865af19150503d806000811461072d576040519150601f19603f3d011682016040523d82523d6000602084013e610732565b606091505b5086848151811061074657610745611329565b5b60200260200101819052819250505080610795576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078c9061153b565b60405180910390fd5b81600101915050610678565b5050509250929050565b60006001430340905090565b600046905090565b6000806060439250434091506107d68686866109f4565b905093509350939050565b600048905090565b600043905090565b60008173ffffffffffffffffffffffffffffffffffffffff16319050919050565b600044905090565b606060008383905090508067ffffffffffffffff81111561083e5761083d6112fa565b5b60405190808252806020026020018201604052801561087757816020015b610864610bd5565b81526020019060019003908161085c5790505b5091503660005b828110156109db57600084828151811061089b5761089a611329565b5b602002602001015190508686838181106108b8576108b7611329565b5b90506020028101906108ca919061155b565b92508260000160208101906108df91906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060400190610905919061138f565b604051610913929190611431565b6000604051808303816000865af19150503d8060008114610950576040519150601f19603f3d011682016040523d82523d6000602084013e610955565b606091505b5082600001836020018290528215151515815250505080516020840135176109cf577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b8160010191505061087e565b50505092915050565b600045905090565b600041905090565b606060008383905090508067ffffffffffffffff811115610a1857610a176112fa565b5b604051908082528060200260200182016040528015610a5157816020015b610a3e610bd5565b815260200190600190039081610a365790505b5091503660005b82811015610b9c576000848281518110610a7557610a74611329565b5b60200260200101519050868683818110610a9257610a91611329565b5b9050602002810190610aa491906114c7565b9250826000016020810190610ab991906111a7565b73ffffffffffffffffffffffffffffffffffffffff16838060200190610adf919061138f565b604051610aed929190611431565b6000604051808303816000865af19150503d8060008114610b2a576040519150601f19603f3d011682016040523d82523d6000602084013e610b2f565b606091505b508260000183602001829052821515151581525050508715610b90578060000151610b8f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b869061153b565b60405180910390fd5b5b81600101915050610a58565b5050509392505050565b6000806060610bb7600186866107bf565b8093508194508295505050509250925092565b600081409050919050565b6040518060400160405280600015158152602001606081525090565b6000819050919050565b610c0481610bf1565b82525050565b6000602082019050610c1f6000830184610bfb565b92915050565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b60008083601f840112610c5457610c53610c2f565b5b8235905067ffffffffffffffff811115610c7157610c70610c34565b5b602083019150836020820283011115610c8d57610c8c610c39565b5b9250929050565b60008060208385031215610cab57610caa610c25565b5b600083013567ffffffffffffffff811115610cc957610cc8610c2a565b5b610cd585828601610c3e565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b60008115159050919050565b610d2281610d0d565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610d62578082015181840152602081019050610d47565b83811115610d71576000848401525b50505050565b6000601f19601f8301169050919050565b6000610d9382610d28565b610d9d8185610d33565b9350610dad818560208601610d44565b610db681610d77565b840191505092915050565b6000604083016000830151610dd96000860182610d19565b5060208301518482036020860152610df18282610d88565b9150508091505092915050565b6000610e0a8383610dc1565b905092915050565b6000602082019050919050565b6000610e2a82610ce1565b610e348185610cec565b935083602082028501610e4685610cfd565b8060005b85811015610e825784840389528151610e638582610dfe565b9450610e6e83610e12565b925060208a01995050600181019050610e4a565b50829750879550505050505092915050565b60006020820190508181036000830152610eae8184610e1f565b905092915050565b60008083601f840112610ecc57610ecb610c2f565b5b8235905067ffffffffffffffff811115610ee957610ee8610c34565b5b602083019150836020820283011115610f0557610f04610c39565b5b9250929050565b60008060208385031215610f2357610f22610c25565b5b600083013567ffffffffffffffff811115610f4157610f40610c2a565b5b610f4d85828601610eb6565b92509250509250929050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b6000610f918383610d88565b905092915050565b6000602082019050919050565b6000610fb182610f59565b610fbb8185610f64565b935083602082028501610fcd85610f75565b8060005b858110156110095784840389528151610fea8582610f85565b9450610ff583610f99565b925060208a01995050600181019050610fd1565b50829750879550505050505092915050565b60006040820190506110306000830185610bfb565b81810360208301526110428184610fa6565b90509392505050565b6000819050919050565b61105e8161104b565b82525050565b60006020820190506110796000830184611055565b92915050565b61108881610d0d565b811461109357600080fd5b50565b6000813590506110a58161107f565b92915050565b6000806000604084860312156110c4576110c3610c25565b5b60006110d286828701611096565b935050602084013567ffffffffffffffff8111156110f3576110f2610c2a565b5b6110ff86828701610eb6565b92509250509250925092565b60006060820190506111206000830186610bfb565b61112d6020830185611055565b818103604083015261113f8184610e1f565b9050949350505050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061117482611149565b9050919050565b61118481611169565b811461118f57600080fd5b50565b6000813590506111a18161117b565b92915050565b6000602082840312156111bd576111bc610c25565b5b60006111cb84828501611192565b91505092915050565b60008083601f8401126111ea576111e9610c2f565b5b8235905067ffffffffffffffff81111561120757611206610c34565b5b60208301915083602082028301111561122357611222610c39565b5b9250929050565b6000806020838503121561124157611240610c25565b5b600083013567ffffffffffffffff81111561125f5761125e610c2a565b5b61126b858286016111d4565b92509250509250929050565b61128081611169565b82525050565b600060208201905061129b6000830184611277565b92915050565b6112aa81610bf1565b81146112b557600080fd5b50565b6000813590506112c7816112a1565b92915050565b6000602082840312156112e3576112e2610c25565b5b60006112f1848285016112b8565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600080fd5b600080fd5b600080fd5b60008235600160800383360303811261138357611382611358565b5b80830191505092915050565b600080833560016020038436030381126113ac576113ab611358565b5b80840192508235915067ffffffffffffffff8211156113ce576113cd61135d565b5b6020830192506001820236038313156113ea576113e9611362565b5b509250929050565b600081905092915050565b82818337600083830152505050565b600061141883856113f2565b93506114258385846113fd565b82840190509392505050565b600061143e82848661140c565b91508190509392505050565b600082825260208201905092915050565b7f4d756c746963616c6c333a2076616c7565206d69736d61746368000000000000600082015250565b6000611491601a8361144a565b915061149c8261145b565b602082019050919050565b600060208201905081810360008301526114c081611484565b9050919050565b6000823560016040038336030381126114e3576114e2611358565b5b80830191505092915050565b7f4d756c746963616c6c333a2063616c6c206661696c6564000000000000000000600082015250565b600061152560178361144a565b9150611530826114ef565b602082019050919050565b6000602082019050818103600083015261155481611518565b9050919050565b60008235600160600383360303811261157757611576611358565b5b8083019150509291505056fea264697066735822122020c1bc9aacf8e4a6507193432a895a8e77094f45a1395583f07b24e860ef06cd64736f6c634300080c0033";
  }
});

// node_modules/viem/_esm/errors/chain.js
var ChainDoesNotSupportContract, ClientChainNotConfiguredError;
var init_chain = __esm({
  "node_modules/viem/_esm/errors/chain.js"() {
    init_base();
    ChainDoesNotSupportContract = class extends BaseError2 {
      constructor({ blockNumber, chain, contract }) {
        super(`Chain "${chain.name}" does not support contract "${contract.name}".`, {
          metaMessages: [
            "This could be due to any of the following:",
            ...blockNumber && contract.blockCreated && contract.blockCreated > blockNumber ? [
              `- The contract "${contract.name}" was not deployed until block ${contract.blockCreated} (current block ${blockNumber}).`
            ] : [
              `- The chain does not have the contract "${contract.name}" configured.`
            ]
          ],
          name: "ChainDoesNotSupportContract"
        });
      }
    };
    ClientChainNotConfiguredError = class extends BaseError2 {
      constructor() {
        super("No chain was provided to the Client.", {
          name: "ClientChainNotConfiguredError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/abi/encodeDeployData.js
function encodeDeployData(parameters) {
  const { abi, args, bytecode } = parameters;
  if (!args || args.length === 0)
    return bytecode;
  const description = abi.find((x) => "type" in x && x.type === "constructor");
  if (!description)
    throw new AbiConstructorNotFoundError({ docsPath: docsPath5 });
  if (!("inputs" in description))
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  if (!description.inputs || description.inputs.length === 0)
    throw new AbiConstructorParamsNotFoundError({ docsPath: docsPath5 });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}
var docsPath5;
var init_encodeDeployData = __esm({
  "node_modules/viem/_esm/utils/abi/encodeDeployData.js"() {
    init_abi();
    init_concat();
    init_encodeAbiParameters();
    docsPath5 = "/docs/contract/encodeDeployData";
  }
});

// node_modules/viem/_esm/utils/chain/getChainContractAddress.js
function getChainContractAddress({ blockNumber, chain, contract: name }) {
  const contract = chain?.contracts?.[name];
  if (!contract)
    throw new ChainDoesNotSupportContract({
      chain,
      contract: { name }
    });
  if (blockNumber && contract.blockCreated && contract.blockCreated > blockNumber)
    throw new ChainDoesNotSupportContract({
      blockNumber,
      chain,
      contract: {
        name,
        blockCreated: contract.blockCreated
      }
    });
  return contract.address;
}
var init_getChainContractAddress = __esm({
  "node_modules/viem/_esm/utils/chain/getChainContractAddress.js"() {
    init_chain();
  }
});

// node_modules/viem/_esm/utils/errors/getCallError.js
function getCallError(err, { docsPath: docsPath8, ...args }) {
  const cause = (() => {
    const cause2 = getNodeError(err, args);
    if (cause2 instanceof UnknownNodeError)
      return err;
    return cause2;
  })();
  return new CallExecutionError(cause, {
    docsPath: docsPath8,
    ...args
  });
}
var init_getCallError = __esm({
  "node_modules/viem/_esm/utils/errors/getCallError.js"() {
    init_contract();
    init_node();
    init_getNodeError();
  }
});

// node_modules/viem/_esm/utils/promise/withResolvers.js
function withResolvers() {
  let resolve = () => void 0;
  let reject = () => void 0;
  const promise = new Promise((resolve_, reject_) => {
    resolve = resolve_;
    reject = reject_;
  });
  return { promise, resolve, reject };
}
var init_withResolvers = __esm({
  "node_modules/viem/_esm/utils/promise/withResolvers.js"() {
  }
});

// node_modules/viem/_esm/utils/promise/createBatchScheduler.js
function createBatchScheduler({ fn, id, shouldSplitBatch, wait: wait2 = 0, sort }) {
  const exec = async () => {
    const scheduler = getScheduler();
    flush();
    const args = scheduler.map(({ args: args2 }) => args2);
    if (args.length === 0)
      return;
    fn(args).then((data) => {
      if (sort && Array.isArray(data))
        data.sort(sort);
      for (let i = 0; i < scheduler.length; i++) {
        const { resolve } = scheduler[i];
        resolve?.([data[i], data]);
      }
    }).catch((err) => {
      for (let i = 0; i < scheduler.length; i++) {
        const { reject } = scheduler[i];
        reject?.(err);
      }
    });
  };
  const flush = () => schedulerCache.delete(id);
  const getBatchedArgs = () => getScheduler().map(({ args }) => args);
  const getScheduler = () => schedulerCache.get(id) || [];
  const setScheduler = (item) => schedulerCache.set(id, [...getScheduler(), item]);
  return {
    flush,
    async schedule(args) {
      const { promise, resolve, reject } = withResolvers();
      const split2 = shouldSplitBatch?.([...getBatchedArgs(), args]);
      if (split2)
        exec();
      const hasActiveScheduler = getScheduler().length > 0;
      if (hasActiveScheduler) {
        setScheduler({ args, resolve, reject });
        return promise;
      }
      setScheduler({ args, resolve, reject });
      setTimeout(exec, wait2);
      return promise;
    }
  };
}
var schedulerCache;
var init_createBatchScheduler = __esm({
  "node_modules/viem/_esm/utils/promise/createBatchScheduler.js"() {
    init_withResolvers();
    schedulerCache = /* @__PURE__ */ new Map();
  }
});

// node_modules/viem/_esm/errors/ccip.js
var OffchainLookupError, OffchainLookupResponseMalformedError, OffchainLookupSenderMismatchError;
var init_ccip = __esm({
  "node_modules/viem/_esm/errors/ccip.js"() {
    init_stringify();
    init_base();
    init_utils3();
    OffchainLookupError = class extends BaseError2 {
      constructor({ callbackSelector, cause, data, extraData, sender, urls }) {
        super(cause.shortMessage || "An error occurred while fetching for an offchain result.", {
          cause,
          metaMessages: [
            ...cause.metaMessages || [],
            cause.metaMessages?.length ? "" : [],
            "Offchain Gateway Call:",
            urls && [
              "  Gateway URL(s):",
              ...urls.map((url) => `    ${getUrl(url)}`)
            ],
            `  Sender: ${sender}`,
            `  Data: ${data}`,
            `  Callback selector: ${callbackSelector}`,
            `  Extra data: ${extraData}`
          ].flat(),
          name: "OffchainLookupError"
        });
      }
    };
    OffchainLookupResponseMalformedError = class extends BaseError2 {
      constructor({ result, url }) {
        super("Offchain gateway response is malformed. Response data must be a hex value.", {
          metaMessages: [
            `Gateway URL: ${getUrl(url)}`,
            `Response: ${stringify(result)}`
          ],
          name: "OffchainLookupResponseMalformedError"
        });
      }
    };
    OffchainLookupSenderMismatchError = class extends BaseError2 {
      constructor({ sender, to }) {
        super("Reverted sender address does not match target contract address (`to`).", {
          metaMessages: [
            `Contract address: ${to}`,
            `OffchainLookup sender address: ${sender}`
          ],
          name: "OffchainLookupSenderMismatchError"
        });
      }
    };
  }
});

// node_modules/viem/_esm/utils/abi/decodeFunctionData.js
function decodeFunctionData(parameters) {
  const { abi, data } = parameters;
  const signature = slice(data, 0, 4);
  const description = abi.find((x) => x.type === "function" && signature === toFunctionSelector(formatAbiItem2(x)));
  if (!description)
    throw new AbiFunctionSignatureNotFoundError(signature, {
      docsPath: "/docs/contract/decodeFunctionData"
    });
  return {
    functionName: description.name,
    args: "inputs" in description && description.inputs && description.inputs.length > 0 ? decodeAbiParameters(description.inputs, slice(data, 4)) : void 0
  };
}
var init_decodeFunctionData = __esm({
  "node_modules/viem/_esm/utils/abi/decodeFunctionData.js"() {
    init_abi();
    init_slice();
    init_toFunctionSelector();
    init_decodeAbiParameters();
    init_formatAbiItem2();
  }
});

// node_modules/viem/_esm/utils/abi/encodeErrorResult.js
function encodeErrorResult(parameters) {
  const { abi, errorName, args } = parameters;
  let abiItem = abi[0];
  if (errorName) {
    const item = getAbiItem({ abi, args, name: errorName });
    if (!item)
      throw new AbiErrorNotFoundError(errorName, { docsPath: docsPath6 });
    abiItem = item;
  }
  if (abiItem.type !== "error")
    throw new AbiErrorNotFoundError(void 0, { docsPath: docsPath6 });
  const definition = formatAbiItem2(abiItem);
  const signature = toFunctionSelector(definition);
  let data = "0x";
  if (args && args.length > 0) {
    if (!abiItem.inputs)
      throw new AbiErrorInputsNotFoundError(abiItem.name, { docsPath: docsPath6 });
    data = encodeAbiParameters(abiItem.inputs, args);
  }
  return concatHex([signature, data]);
}
var docsPath6;
var init_encodeErrorResult = __esm({
  "node_modules/viem/_esm/utils/abi/encodeErrorResult.js"() {
    init_abi();
    init_concat();
    init_toFunctionSelector();
    init_encodeAbiParameters();
    init_formatAbiItem2();
    init_getAbiItem();
    docsPath6 = "/docs/contract/encodeErrorResult";
  }
});

// node_modules/viem/_esm/utils/abi/encodeFunctionResult.js
function encodeFunctionResult(parameters) {
  const { abi, functionName, result } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({ abi, name: functionName });
    if (!item)
      throw new AbiFunctionNotFoundError(functionName, { docsPath: docsPath7 });
    abiItem = item;
  }
  if (abiItem.type !== "function")
    throw new AbiFunctionNotFoundError(void 0, { docsPath: docsPath7 });
  if (!abiItem.outputs)
    throw new AbiFunctionOutputsNotFoundError(abiItem.name, { docsPath: docsPath7 });
  const values = (() => {
    if (abiItem.outputs.length === 0)
      return [];
    if (abiItem.outputs.length === 1)
      return [result];
    if (Array.isArray(result))
      return result;
    throw new InvalidArrayError(result);
  })();
  return encodeAbiParameters(abiItem.outputs, values);
}
var docsPath7;
var init_encodeFunctionResult = __esm({
  "node_modules/viem/_esm/utils/abi/encodeFunctionResult.js"() {
    init_abi();
    init_encodeAbiParameters();
    init_getAbiItem();
    docsPath7 = "/docs/contract/encodeFunctionResult";
  }
});

// node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js
async function localBatchGatewayRequest(parameters) {
  const { data, ccipRequest: ccipRequest2 } = parameters;
  const { args: [queries] } = decodeFunctionData({ abi: batchGatewayAbi, data });
  const failures = [];
  const responses = [];
  await Promise.all(queries.map(async (query, i) => {
    try {
      responses[i] = query.urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({ data: query.data, ccipRequest: ccipRequest2 }) : await ccipRequest2(query);
      failures[i] = false;
    } catch (err) {
      failures[i] = true;
      responses[i] = encodeError(err);
    }
  }));
  return encodeFunctionResult({
    abi: batchGatewayAbi,
    functionName: "query",
    result: [failures, responses]
  });
}
function encodeError(error) {
  if (error.name === "HttpRequestError" && error.status)
    return encodeErrorResult({
      abi: batchGatewayAbi,
      errorName: "HttpError",
      args: [error.status, error.shortMessage]
    });
  return encodeErrorResult({
    abi: [solidityError],
    errorName: "Error",
    args: ["shortMessage" in error ? error.shortMessage : error.message]
  });
}
var localBatchGatewayUrl;
var init_localBatchGatewayRequest = __esm({
  "node_modules/viem/_esm/utils/ens/localBatchGatewayRequest.js"() {
    init_abis();
    init_solidity();
    init_decodeFunctionData();
    init_encodeErrorResult();
    init_encodeFunctionResult();
    localBatchGatewayUrl = "x-batch-gateway:true";
  }
});

// node_modules/viem/_esm/utils/ccip.js
var ccip_exports = {};
__export(ccip_exports, {
  ccipRequest: () => ccipRequest,
  offchainLookup: () => offchainLookup,
  offchainLookupAbiItem: () => offchainLookupAbiItem,
  offchainLookupSignature: () => offchainLookupSignature
});
async function offchainLookup(client, { blockNumber, blockTag, data, requestOptions, to }) {
  const { args } = decodeErrorResult({
    data,
    abi: [offchainLookupAbiItem]
  });
  const [sender, urls, callData, callbackSelector, extraData] = args;
  const { ccipRead } = client;
  const ccipRequest_ = ccipRead && typeof ccipRead?.request === "function" ? ccipRead.request : ccipRequest;
  try {
    if (!isAddressEqual(to, sender))
      throw new OffchainLookupSenderMismatchError({ sender, to });
    const result = urls.includes(localBatchGatewayUrl) ? await localBatchGatewayRequest({
      data: callData,
      ccipRequest: (parameters) => ccipRequest_({ ...parameters, requestOptions })
    }) : await ccipRequest_({ data: callData, requestOptions, sender, urls });
    const { data: data_ } = await call(client, {
      blockNumber,
      blockTag,
      data: concat([
        callbackSelector,
        encodeAbiParameters([{ type: "bytes" }, { type: "bytes" }], [result, extraData])
      ]),
      requestOptions,
      to
    });
    return data_;
  } catch (err) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    if (isAbortError(err))
      throw err;
    throw new OffchainLookupError({
      callbackSelector,
      cause: err,
      data,
      extraData,
      sender,
      urls
    });
  }
}
async function ccipRequest({ data, requestOptions, sender, urls }) {
  let error = new Error("An unknown error occurred.");
  for (let i = 0; i < urls.length; i++) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    const url = urls[i];
    const method = url.includes("{data}") ? "GET" : "POST";
    const body = method === "POST" ? { data, sender } : void 0;
    const headers = method === "POST" ? { "Content-Type": "application/json" } : {};
    try {
      const response = await fetch(url.replace("{sender}", sender.toLowerCase()).replace("{data}", data), {
        body: JSON.stringify(body),
        headers,
        method,
        ...requestOptions?.signal ? { signal: requestOptions.signal } : {}
      });
      let result;
      if (response.headers.get("Content-Type")?.startsWith("application/json")) {
        result = (await response.json()).data;
      } else {
        result = await response.text();
      }
      if (!response.ok) {
        error = new HttpRequestError({
          body,
          details: result?.error ? stringify(result.error) : response.statusText,
          headers: response.headers,
          status: response.status,
          url
        });
        continue;
      }
      if (!isHex(result)) {
        error = new OffchainLookupResponseMalformedError({
          result,
          url
        });
        continue;
      }
      return result;
    } catch (err) {
      if (requestOptions?.signal?.aborted)
        throw getAbortError(requestOptions.signal);
      if (isAbortError(err))
        throw err;
      error = new HttpRequestError({
        body,
        details: err.message,
        url
      });
    }
  }
  throw error;
}
var offchainLookupSignature, offchainLookupAbiItem;
var init_ccip2 = __esm({
  "node_modules/viem/_esm/utils/ccip.js"() {
    init_call();
    init_ccip();
    init_request();
    init_utils3();
    init_decodeErrorResult();
    init_encodeAbiParameters();
    init_isAddressEqual();
    init_concat();
    init_isHex();
    init_localBatchGatewayRequest();
    init_stringify();
    offchainLookupSignature = "0x556f1830";
    offchainLookupAbiItem = {
      name: "OffchainLookup",
      type: "error",
      inputs: [
        {
          name: "sender",
          type: "address"
        },
        {
          name: "urls",
          type: "string[]"
        },
        {
          name: "callData",
          type: "bytes"
        },
        {
          name: "callbackFunction",
          type: "bytes4"
        },
        {
          name: "extraData",
          type: "bytes"
        }
      ]
    };
  }
});

// node_modules/viem/_esm/actions/public/call.js
async function call(client, args) {
  const { account: account_ = client.account, authorizationList, batch = Boolean(client.batch?.multicall), blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical, accessList, blobs, blockOverrides, code, data: data_, factory, factoryData, gas, gasPrice, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, nonce, requestOptions, to, value, stateOverride, ...rest } = args;
  const account = account_ ? parseAccount(account_) : void 0;
  if (code && (factory || factoryData))
    throw new BaseError2("Cannot provide both `code` & `factory`/`factoryData` as parameters.");
  if (code && to)
    throw new BaseError2("Cannot provide both `code` & `to` as parameters.");
  const deploylessCallViaBytecode = code && data_;
  const deploylessCallViaFactory = factory && factoryData && to && data_;
  const deploylessCall = deploylessCallViaBytecode || deploylessCallViaFactory;
  const data = (() => {
    if (deploylessCallViaBytecode)
      return toDeploylessCallViaBytecodeData({
        code,
        data: data_
      });
    if (deploylessCallViaFactory)
      return toDeploylessCallViaFactoryData({
        data: data_,
        factory,
        factoryData,
        to
      });
    return data_;
  })();
  try {
    assertRequest(args);
    const block = formatBlockParameter({
      blockHash,
      blockNumber,
      blockTag,
      requireCanonical
    });
    const rpcBlockOverrides = blockOverrides ? toRpc2(blockOverrides) : void 0;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format2 = chainFormat || formatTransactionRequest;
    const request = format2({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, { format: chainFormat }),
      accessList,
      account,
      authorizationList,
      blobs,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to: deploylessCall ? void 0 : to,
      value
    }, "call");
    if (batch && shouldPerformMulticall({ request }) && !rpcBlockOverrides && blockHash === void 0) {
      try {
        const { deployless = false } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
        const multicallAddress = getMulticallAddress(client, {
          blockNumber,
          deployless
        });
        if (!multicallAddress || !hasStateOverrideForAddress(rpcStateOverride, multicallAddress))
          return await scheduleMulticall(client, {
            ...request,
            blockHash,
            blockNumber,
            blockTag,
            multicallAddress,
            requestOptions,
            requireCanonical,
            rpcStateOverride
          });
      } catch (err) {
        if (!(err instanceof ClientChainNotConfiguredError) && !(err instanceof ChainDoesNotSupportContract))
          throw err;
      }
    }
    const params = (() => {
      const base = [
        request,
        block
      ];
      if (rpcStateOverride && rpcBlockOverrides)
        return [...base, rpcStateOverride, rpcBlockOverrides];
      if (rpcStateOverride)
        return [...base, rpcStateOverride];
      if (rpcBlockOverrides)
        return [...base, {}, rpcBlockOverrides];
      return base;
    })();
    const response = await client.request({
      method: "eth_call",
      params
    }, requestOptions);
    if (response === "0x")
      return { data: void 0 };
    return { data: response };
  } catch (err) {
    if (requestOptions?.signal?.aborted)
      throw getAbortError(requestOptions.signal);
    if (isAbortError(err))
      throw err;
    const data2 = getRevertErrorData(err);
    const { offchainLookup: offchainLookup2, offchainLookupSignature: offchainLookupSignature2 } = await Promise.resolve().then(() => (init_ccip2(), ccip_exports));
    if (client.ccipRead !== false && data2?.slice(0, 10) === offchainLookupSignature2 && to)
      return {
        data: await offchainLookup2(client, { data: data2, requestOptions, to })
      };
    if (deploylessCall && data2?.slice(0, 10) === "0x101bb98d")
      throw new CounterfactualDeploymentFailedError({ factory });
    throw getCallError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}
function shouldPerformMulticall({ request }) {
  const { data, to, ...request_ } = request;
  if (!data)
    return false;
  if (data.startsWith(aggregate3Signature))
    return false;
  if (!to)
    return false;
  if (Object.values(request_).filter((x) => typeof x !== "undefined").length > 0)
    return false;
  return true;
}
function getRequestOptionsId(requestOptions) {
  if (!requestOptions)
    return "default";
  const id = requestOptionsIds.get(requestOptions);
  if (id !== void 0)
    return id;
  const nextId = requestOptionsId++;
  requestOptionsIds.set(requestOptions, nextId);
  return nextId;
}
async function scheduleMulticall(client, args) {
  const { batchSize = 1024, deployless = false, wait: wait2 = 0 } = typeof client.batch?.multicall === "object" ? client.batch.multicall : {};
  const { blockHash, blockNumber, blockTag = client.experimental_blockTag ?? "latest", requireCanonical, data, multicallAddress: multicallAddress_, requestOptions, rpcStateOverride, to } = args;
  const multicallAddress = multicallAddress_ !== void 0 ? multicallAddress_ : getMulticallAddress(client, {
    blockNumber,
    deployless
  });
  const block = formatBlockParameter({
    blockHash,
    blockNumber,
    blockTag,
    requireCanonical
  });
  const blockId = typeof block === "string" ? block : JSON.stringify(block);
  const stateOverrideKey = rpcStateOverride ? `.${JSON.stringify(rpcStateOverride)}` : "";
  const { schedule } = createBatchScheduler({
    id: `${client.uid}.${blockId}.${getRequestOptionsId(requestOptions)}${stateOverrideKey}`,
    wait: wait2,
    shouldSplitBatch(args2) {
      const size4 = args2.reduce((size5, { data: data2 }) => size5 + (data2.length - 2), 0);
      return size4 > batchSize * 2;
    },
    fn: async (requests) => {
      const calls = requests.map((request) => ({
        allowFailure: true,
        callData: request.data,
        target: request.to
      }));
      const calldata = encodeFunctionData({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3"
      });
      const multicallRequest = {
        ...multicallAddress === null ? {
          data: toDeploylessCallViaBytecodeData({
            code: multicall3Bytecode,
            data: calldata
          })
        } : { to: multicallAddress, data: calldata }
      };
      const data2 = await client.request({
        method: "eth_call",
        params: rpcStateOverride ? [multicallRequest, block, rpcStateOverride] : [multicallRequest, block]
      }, requestOptions);
      return decodeFunctionResult({
        abi: multicall3Abi,
        args: [calls],
        functionName: "aggregate3",
        data: data2 || "0x"
      });
    }
  });
  const [{ returnData, success }] = await schedule({ data, to });
  if (!success)
    throw new RawContractError({ data: returnData });
  if (returnData === "0x")
    return { data: void 0 };
  return { data: returnData };
}
function getMulticallAddress(client, parameters) {
  const { blockNumber, deployless } = parameters;
  if (deployless)
    return null;
  if (client.chain)
    return getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "multicall3"
    });
  throw new ClientChainNotConfiguredError();
}
function hasStateOverrideForAddress(rpcStateOverride, address) {
  if (!rpcStateOverride)
    return false;
  return Object.keys(rpcStateOverride).some((stateOverrideAddress) => isAddressEqual(stateOverrideAddress, address));
}
function toDeploylessCallViaBytecodeData(parameters) {
  const { code, data } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(bytes, bytes)"]),
    bytecode: deploylessCallViaBytecodeBytecode,
    args: [code, data]
  });
}
function toDeploylessCallViaFactoryData(parameters) {
  const { data, factory, factoryData, to } = parameters;
  return encodeDeployData({
    abi: parseAbi(["constructor(address, bytes, address, bytes)"]),
    bytecode: deploylessCallViaFactoryBytecode,
    args: [to, data, factory, factoryData]
  });
}
function getRevertErrorData(err) {
  if (!(err instanceof BaseError2))
    return void 0;
  const error = err.walk();
  return typeof error?.data === "object" ? error.data?.data : error.data;
}
var requestOptionsId, requestOptionsIds;
var init_call = __esm({
  "node_modules/viem/_esm/actions/public/call.js"() {
    init_exports();
    init_BlockOverrides();
    init_parseAccount();
    init_abis();
    init_contract2();
    init_contracts();
    init_base();
    init_chain();
    init_contract();
    init_utils3();
    init_decodeFunctionResult();
    init_encodeDeployData();
    init_encodeFunctionData();
    init_isAddressEqual();
    init_formatBlockParameter();
    init_getChainContractAddress();
    init_getCallError();
    init_extract();
    init_transactionRequest();
    init_createBatchScheduler();
    init_stateOverride2();
    init_assertRequest();
    requestOptionsId = 0;
    requestOptionsIds = /* @__PURE__ */ new WeakMap();
  }
});

// examples/fishing/index.tsx
import { useEffect as useEffect5, useRef as useRef5, useState as useState6 } from "react";

// src/game.ts
var RF = 10n ** 18n;
var UINT256_MAX = (1n << 256n) - 1n;
function uint(value, name, positive = false) {
  if (typeof value !== "bigint" || value < (positive ? 1n : 0n) || value > UINT256_MAX) throw new RangeError(`Invalid ${name}.`);
  return value;
}
function defineChanceGame(input) {
  uint(input.price, "price", true);
  if (!input.name.trim() || !input.consumable.trim()) throw new TypeError("Game and consumable names are required.");
  if (!input.outcomes.length) throw new RangeError("Provide at least one outcome.");
  const outcomes = input.outcomes.map((outcome) => {
    if (!outcome.name.trim() || !Number.isInteger(outcome.chanceBps) || outcome.chanceBps < 1 || outcome.chanceBps > 1e4) throw new RangeError("Invalid outcome.");
    uint(outcome.reward, "reward");
    return Object.freeze({ ...outcome });
  });
  if (outcomes.reduce((sum, outcome) => sum + outcome.chanceBps, 0) !== 1e4) throw new RangeError("Outcome chances must total 10000 basis points.");
  if (!outcomes.some((outcome) => outcome.reward > 0n)) throw new RangeError("At least one prize is required.");
  return Object.freeze({ ...input, outcomes: Object.freeze(outcomes) });
}
function parseChanceGame(input) {
  if (!input || typeof input !== "object") throw new TypeError("Expected a game definition.");
  const game = input;
  const amount = (value) => {
    if (typeof value !== "string" || !/^[0-9]+$/.test(value)) throw new TypeError("RF amounts must be decimal base-unit strings.");
    return BigInt(value);
  };
  if (typeof game.name !== "string" || typeof game.consumable !== "string" || !Array.isArray(game.outcomes)) throw new TypeError("Invalid game definition.");
  return defineChanceGame({
    name: game.name,
    consumable: game.consumable,
    price: amount(game.price),
    outcomes: game.outcomes.map((row) => {
      if (!row || typeof row !== "object") throw new TypeError("Invalid outcome.");
      const outcome = row;
      if (typeof outcome.name !== "string" || typeof outcome.chanceBps !== "number") throw new TypeError("Invalid outcome.");
      return { name: outcome.name, chanceBps: outcome.chanceBps, reward: amount(outcome.reward) };
    })
  });
}
function maximumPrize(game) {
  return game.outcomes.reduce((max, outcome) => outcome.reward > max ? outcome.reward : max, 0n);
}
function outcomeForRoll(game, roll) {
  if (!Number.isInteger(roll) || roll < 0 || roll >= 1e4) throw new RangeError("Roll must be an integer from 0 to 9999.");
  let boundary = 0;
  for (let index2 = 0; index2 < game.outcomes.length; index2++) {
    boundary += game.outcomes[index2].chanceBps;
    if (roll < boundary) return index2 + 1;
  }
  throw new RangeError("Invalid outcome table.");
}
function samplePreviewRoll() {
  const word = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(word);
  } while (word[0] >= 429496e4);
  return word[0] % 1e4;
}
function createGamePreview(input, options) {
  const definition = defineChanceGame(input), maxPrize = maximumPrize(definition);
  const friendId = uint(options.friendId ?? 0n, "friend ID");
  let stake = uint(options.stake, "stake"), rfBalance = uint(options.rfBalance, "RF balance");
  let consumables = 0n, reservedPlays = 0n, rewardLiability = 0n;
  const inventory = definition.outcomes.map(() => 0n), plays = [];
  const draw = options.draw ?? samplePreviewRoll;
  const freeStake = () => stake - reservedPlays - rewardLiability;
  function canBuy(quantity) {
    if (typeof quantity !== "bigint" || quantity < 1n || quantity > UINT256_MAX) return false;
    const cost = quantity * definition.price, reserve = quantity * maxPrize;
    return cost <= UINT256_MAX && reserve <= UINT256_MAX && stake + cost <= UINT256_MAX && freeStake() >= maxPrize && freeStake() + cost >= reserve;
  }
  function snapshot() {
    return Object.freeze({
      mode: "preview",
      friendId,
      rfBalance,
      consumables,
      stake,
      freeStake: freeStake(),
      reservedPlays,
      rewardLiability,
      inventory: Object.freeze([...inventory]),
      plays: Object.freeze([...plays])
    });
  }
  const client = Object.freeze({
    mode: "preview",
    definition,
    read: async () => snapshot(),
    canBuy: async (quantity) => canBuy(quantity),
    async buy(quantity) {
      uint(quantity, "quantity", true);
      const cost = quantity * definition.price;
      if (!canBuy(quantity)) throw new Error("Game needs more free stake to back this purchase.");
      if (cost > rfBalance) throw new Error("Insufficient RF.");
      stake += cost;
      rfBalance -= cost;
      consumables += quantity;
      reservedPlays += quantity * maxPrize;
    },
    async play(quantity = 1n) {
      uint(quantity, "quantity", true);
      if (quantity > consumables) throw new Error("Insufficient consumables.");
      consumables -= quantity;
      const added = [];
      for (let index2 = 0n; index2 < quantity; index2++) {
        const play = Object.freeze({ id: BigInt(plays.length + 1), outcomeId: null });
        plays.push(play);
        added.push(play);
      }
      return Object.freeze(added);
    },
    async settle(playId) {
      uint(playId, "play ID", true);
      if (playId > BigInt(plays.length)) throw new RangeError("Unknown play.");
      const index2 = Number(playId - 1n), play = plays[index2];
      if (play.outcomeId !== null) throw new Error("Play is already settled.");
      const outcomeId = outcomeForRoll(definition, draw()), outcome = definition.outcomes[outcomeId - 1];
      const result = Object.freeze({ id: play.id, outcomeId });
      reservedPlays -= maxPrize;
      rewardLiability += outcome.reward;
      inventory[outcomeId - 1] += 1n;
      plays[index2] = result;
      return result;
    },
    async redeem(outcomeId, quantity) {
      uint(quantity, "quantity", true);
      if (!Number.isInteger(outcomeId) || outcomeId < 1 || outcomeId > definition.outcomes.length) throw new RangeError("Unknown outcome.");
      const index2 = outcomeId - 1, reward = definition.outcomes[index2].reward;
      if (reward === 0n) throw new Error("This collectible has no RF redemption value.");
      if (inventory[index2] < quantity) throw new Error("Insufficient inventory.");
      const amount = reward * quantity;
      uint(rfBalance + amount, "RF balance");
      inventory[index2] -= quantity;
      rewardLiability -= amount;
      stake -= amount;
      rfBalance += amount;
    }
  });
  return Object.freeze({
    client,
    fund(amount) {
      uint(amount, "funding", true);
      stake = uint(stake + amount, "stake");
    },
    withdraw(amount) {
      uint(amount, "withdrawal", true);
      if (amount > freeStake()) throw new Error("Cannot withdraw reserved RF.");
      stake -= amount;
    }
  });
}

// src/friend-sounds.ts
var FRIEND_SOUND_IDS = ["select", "purchase", "action-start", "action-ready", "anticipation", "impact", "reveal-common", "reveal-rare", "reveal-legendary", "reward"];
var FRIEND_SOUND_SAMPLE_RATE = 48e3;
var FRIEND_SOUND_MAX_VOICES = 4;
var FRIEND_SOUND_MAX_GAIN = 0.3;
var FRIEND_SOUND_PEAK = 0.7;
var tone = (midi, duration, level, at = 0, options = {}) => ({ kind: "tone", at, midi, duration, level, ...options });
var tick = (at, level, clap = false) => ({ kind: "tick", at, level, clap });
var sparkle = (notes, at = 0, level = 0.25) => notes.map((midi, index2) => tone(midi, [0.09, 0.11, 0.22][index2], level * [1, 0.85, 0.7][index2], at + [0, 0.055, 0.12][index2], { attack: 5e-3, release: 0.027, chip: 0.18 }));
var definitions = {
  select: { label: "Select", duration: 0.1, motif: "A short rounded chip pluck", voices: [tone(67, 0.08, 0.22, 0, { attack: 3e-3, release: 0.02 })] },
  "purchase": { label: "Purchase", duration: 0.36, motif: "The earlier mint-confirm C-major triplet", voices: [
    tone(48, 0.18, 0.1, 0, { chip: 0.12 }),
    ...[60, 64, 67].map((midi, index2) => tone(midi, [0.1, 0.11, 0.21][index2], 0.26 * [1, 0.86, 0.68][index2], [0, 0.065, 0.135][index2], { decay: 0.65, attack: 5e-3, release: 0.028, chip: 0.19 }))
  ] },
  "action-start": { label: "Action start", duration: 0.25, motif: "The mint's rounded octave rise with a soft release tick", voices: [tone(48, 0.21, 0.23, 0, { endMidi: 60, decay: 1, chip: 0.16 }), tick(0.025, 0.09)] },
  "action-ready": { label: "Action ready", duration: 0.27, motif: "Two bright pickup notes", voices: [tone(76, 0.085, 0.24, 0, { attack: 4e-3, release: 0.025, chip: 0.18 }), tone(79, 0.12, 0.25, 0.115, { attack: 4e-3, release: 0.03, chip: 0.18 })] },
  "anticipation": { label: "Anticipation", duration: 0.3, motif: "Three climbing plucks and soft mechanical ticks", voices: [...sparkle([60, 64, 67]).map((voice) => ({ ...voice, duration: Math.min(voice.duration, 0.14) })), tick(0, 0.08), tick(0.055, 0.07), tick(0.12, 0.06)] },
  "impact": { label: "Impact", duration: 0.23, motif: "A rounded falling tone with the trailer's filtered soft percussion", voices: [tone(57, 0.17, 0.14, 0, { endMidi: 40, chip: 0.12, decay: 0.55 }), tick(0, 0.25, true), tick(0.035, 0.13, true), tick(0.075, 0.08, true)] },
  "reveal-common": { label: "Common reward", duration: 0.38, motif: "A warm landing and compact C-major sparkle", voices: [tone(48, 0.24, 0.17, 0, { chip: 0.12, decay: 0.65 }), ...sparkle([60, 64, 67])] },
  "reveal-rare": { label: "Rare reward", duration: 0.58, motif: "The latest stat-transition G\u2013C\u2013E sparkle with a held top note", voices: [tone(43, 0.24, 0.15, 0, { chip: 0.12, decay: 0.65 }), ...sparkle([67, 72, 76]), tone(76, 0.37, 0.09, 0.18, { chip: 0.1, decay: 1.2, release: 0.1 })] },
  "reveal-legendary": { label: "Legendary reward", duration: 1.05, motif: "A mint rise, high pickup sparkle and warm final C-major resolution", voices: [
    tone(48, 0.18, 0.12, 0, { endMidi: 60, chip: 0.16 }),
    ...sparkle([72, 76, 79], 0.13, 0.27),
    ...[36, 60, 64, 67].map((midi, index2) => tone(midi, 0.65, [0.19, 0.14, 0.1, 0.08][index2], 0.37, { decay: 1.4, attack: 0.016, release: 0.2, chip: 0.1 }))
  ] },
  reward: { label: "Reward", duration: 0.36, motif: "The latest world-token-pickup C\u2013E\u2013G sparkle", voices: sparkle([72, 76, 79]) }
};
var FRIEND_SOUND_CUES = Object.freeze(
  Object.fromEntries(FRIEND_SOUND_IDS.map((id) => {
    const { label, duration, motif } = definitions[id];
    return [id, Object.freeze({ label, duration, motif })];
  }))
);
function cueDefinition(cue) {
  if (!FRIEND_SOUND_IDS.includes(cue)) throw new TypeError(`Unknown Friend sound: ${String(cue)}`);
  return definitions[cue];
}
function unit(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1) throw new RangeError(`${name} must be between 0 and 1`);
  return value;
}
var hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
var triangle = (phase) => 4 * Math.abs(phase % 1 - 0.5) - 1;
var smooth = (amount) => Math.sin(Math.PI / 2 * Math.min(1, Math.max(0, amount))) ** 2;
function renderFriendSound(cue, options = {}) {
  const definition = cueDefinition(cue);
  const sampleRate = options.sampleRate ?? FRIEND_SOUND_SAMPLE_RATE;
  if (!Number.isInteger(sampleRate) || sampleRate < 8e3 || sampleRate > 192e3) throw new RangeError("sampleRate must be an integer between 8000 and 192000");
  const output = new Float64Array(Math.round(definition.duration * sampleRate));
  let randomState = 1380340564 ^ FRIEND_SOUND_IDS.indexOf(cue) + 1;
  const noise = () => {
    randomState ^= randomState << 13;
    randomState ^= randomState >>> 17;
    randomState ^= randomState << 5;
    return (randomState >>> 0) / 4294967296 * 2 - 1;
  };
  for (const voice of definition.voices) {
    const duration = voice.kind === "tone" ? voice.duration : voice.clap ? 0.105 : 0.037;
    const count = Math.round(duration * sampleRate), start = Math.round(voice.at * sampleRate);
    let phase = 0, filtered = 0;
    for (let index2 = 0; index2 < count && start + index2 < output.length; index2++) {
      const t = index2 / sampleRate, remaining = (count - 1 - index2) / sampleRate;
      let sample;
      if (voice.kind === "tone") {
        const frequency = hz(voice.midi), end = hz(voice.endMidi ?? voice.midi);
        phase += frequency * (end / frequency) ** (t / duration) / sampleRate;
        const envelope = smooth(t / (voice.attack ?? 9e-3)) * smooth(remaining / (voice.release ?? 0.045)) * Math.exp(-t / (duration * (voice.decay ?? 0.78)));
        const chip = voice.chip ?? 0.24;
        sample = voice.level * envelope * ((1 - chip) * Math.sin(2 * Math.PI * phase) + chip * triangle(phase + 0.75));
      } else {
        filtered += (1 - (1 - 0.17) ** (48e3 / sampleRate)) * (noise() - filtered);
        const envelope = Math.min(1, t / 1e-3) * Math.exp(-t / (voice.clap ? 0.021 : 7e-3)) * Math.min(1, remaining / 9e-3);
        sample = voice.level * envelope * (0.8 * filtered + 0.2 * Math.sin(2 * Math.PI * (voice.clap ? 210 : 740) * t));
      }
      output[start + index2] += sample;
    }
  }
  let peak = 0;
  for (const sample of output) peak = Math.max(peak, Math.abs(sample));
  const gain = peak ? FRIEND_SOUND_PEAK / peak : 0;
  return Float32Array.from(output, (sample) => sample * gain);
}
function createFriendSoundKit(options = {}) {
  if (options.muted !== void 0 && typeof options.muted !== "boolean") throw new TypeError("muted must be a boolean");
  let muted = options.muted ?? false, volume = unit(options.volume ?? 0.65, "volume");
  let context = null, master = null;
  let unlocked = false, unsupported = false, disposed = false, epoch = 0;
  let pending = null, listening = false;
  const buffers = /* @__PURE__ */ new Map();
  const voices = /* @__PURE__ */ new Set();
  const doc = typeof document === "undefined" ? null : document;
  const win = typeof window === "undefined" ? null : window;
  const hidden = () => Boolean(doc?.hidden);
  function release(voice) {
    if (voice.released) return;
    voice.released = true;
    voices.delete(voice);
    voice.source.onended = null;
    try {
      voice.source.disconnect();
    } catch {
    }
    try {
      voice.gain.disconnect();
    } catch {
    }
  }
  function halt(voice) {
    try {
      voice.source.stop();
    } catch {
    }
    release(voice);
  }
  function stop() {
    epoch++;
    if (pending) {
      pending = null;
      unlocked = false;
    }
    for (const voice of [...voices]) halt(voice);
  }
  const visibility = () => {
    if (hidden()) stop();
  };
  const pageHide = () => stop();
  function masterLevel() {
    if (master) master.gain.value = muted ? 0 : volume * FRIEND_SOUND_MAX_GAIN;
  }
  function attach() {
    if (listening) return;
    doc?.addEventListener("visibilitychange", visibility);
    win?.addEventListener("pagehide", pageHide);
    listening = true;
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    unlocked = false;
    stop();
    buffers.clear();
    if (listening) {
      doc?.removeEventListener("visibilitychange", visibility);
      win?.removeEventListener("pagehide", pageHide);
      listening = false;
    }
    try {
      master?.disconnect();
    } catch {
    }
    const previous = context;
    context = null;
    master = null;
    if (previous) {
      try {
        void previous.close().catch(() => {
        });
      } catch {
      }
    }
  }
  function unlock() {
    if (disposed || muted || hidden() || unsupported) return Promise.resolve(false);
    if (unlocked && context?.state === "running") return Promise.resolve(true);
    if (pending) return pending;
    if (context?.state === "closed") {
      for (const voice of [...voices]) halt(voice);
      try {
        master?.disconnect();
      } catch {
      }
      context = null;
      master = null;
      unlocked = false;
      buffers.clear();
    }
    const generation = epoch;
    if (!context || context.state === "closed") {
      try {
        const AudioContextClass = globalThis.AudioContext ?? globalThis.webkitAudioContext;
        if (!AudioContextClass) {
          unsupported = true;
          return Promise.resolve(false);
        }
        context = new AudioContextClass();
        master = context.createGain();
        masterLevel();
        master.connect(context.destination);
        buffers.clear();
        attach();
      } catch {
        const failed = context;
        context = null;
        master = null;
        unsupported = true;
        if (failed) {
          try {
            void failed.close().catch(() => {
            });
          } catch {
          }
        }
        return Promise.resolve(false);
      }
    }
    const active = context;
    let resume;
    try {
      resume = active.state === "running" ? Promise.resolve() : active.resume();
    } catch {
      unlocked = false;
      return Promise.resolve(false);
    }
    unlocked = false;
    const attempt = resume.then(() => {
      if (disposed || generation !== epoch || muted || hidden() || context !== active || active.state !== "running") return false;
      unlocked = true;
      return true;
    }, () => false).finally(() => {
      if (pending === attempt) pending = null;
    });
    pending = attempt;
    return attempt;
  }
  function play(cue, playOptions = {}) {
    cueDefinition(cue);
    const level = unit(playOptions.volume ?? 1, "cue volume"), delay = unit(playOptions.delay ?? 0, "delay");
    if (disposed || muted || hidden() || !unlocked || !context || !master || context.state !== "running" || !volume || !level) return false;
    let source = null, gain = null, voice = null;
    try {
      let buffer2 = buffers.get(cue);
      if (!buffer2) {
        const pcm = renderFriendSound(cue);
        buffer2 = context.createBuffer(1, pcm.length, FRIEND_SOUND_SAMPLE_RATE);
        buffer2.getChannelData(0).set(pcm);
        buffers.set(cue, buffer2);
      }
      if (voices.size >= FRIEND_SOUND_MAX_VOICES) halt(voices.values().next().value);
      source = context.createBufferSource();
      gain = context.createGain();
      gain.gain.value = level;
      source.buffer = buffer2;
      source.connect(gain);
      gain.connect(master);
      voice = { source, gain, released: false };
      voices.add(voice);
      const playing = voice;
      source.onended = () => release(playing);
      source.start(context.currentTime + delay);
      return true;
    } catch {
      if (voice) halt(voice);
      else {
        try {
          source?.disconnect();
        } catch {
        }
        try {
          gain?.disconnect();
        } catch {
        }
      }
      return false;
    }
  }
  return Object.freeze({
    get state() {
      return Object.freeze({ status: disposed ? "disposed" : unsupported ? "unsupported" : unlocked && context?.state === "running" ? "ready" : "locked", muted, volume, activeVoices: voices.size });
    },
    unlock,
    play,
    stop,
    dispose,
    setMuted(next) {
      if (typeof next !== "boolean") throw new TypeError("muted must be a boolean");
      if (disposed) return;
      muted = next;
      masterLevel();
      if (muted) stop();
    },
    setVolume(next) {
      const checked = unit(next, "volume");
      if (disposed) return;
      volume = checked;
      masterLevel();
      if (!volume) stop();
    }
  });
}

// src/experience-ui.tsx
import { useId, useState as useState2 } from "react";

// src/items.ts
function formatGameItemQuantity(item, quantity) {
  const places = item.token?.decimals ?? 0;
  if (typeof quantity !== "bigint" || quantity < 0n || quantity >= 1n << 256n) throw new RangeError("Quantity must fit uint256.");
  if (!Number.isInteger(places) || places < 0 || places > 255) throw new RangeError("Decimals must be from 0 through 255.");
  if (places === 0) return quantity.toString();
  const digits = quantity.toString().padStart(places + 1, "0");
  const fraction = digits.slice(-places).replace(/0+$/, "");
  return `${digits.slice(0, -places)}${fraction ? `.${fraction}` : ""}`;
}

// src/reward-reveal.tsx
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var REWARD_REVEAL_TIMING = Object.freeze({ emergence: 720, reveal: 1320, complete: 2400 });
var reducedQuery = "(prefers-reduced-motion: reduce)";
var subscribeMotion = (callback) => {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
var readMotion = () => window.matchMedia(reducedQuery).matches;
var serverMotion = () => false;
function ItemBitmap({ item }) {
  const width = item.art?.rows.length ? Math.max(1, ...item.art.rows.map((row) => row.length)) : 16;
  const height = item.art?.rows.length || 16;
  const path = (item.art?.rows ?? []).flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "#" ? [`M${x} ${y}h1v1h-1z`] : [])).join("");
  return /* @__PURE__ */ jsx("svg", { viewBox: `0 0 ${width} ${height}`, fill: "currentColor", shapeRendering: "crispEdges", children: path ? /* @__PURE__ */ jsx("path", { d: path }) : /* @__PURE__ */ jsx("path", { d: "M8 1 15 8 8 15 1 8Z" }) });
}
function RewardReveal(props) {
  return /* @__PURE__ */ jsx(RewardRevealSequence, { ...props }, props.revealKey);
}
function RewardRevealSequence({ item, reducedMotion, onPhase, onComplete, skipSignal = 0, showSkipControl = true, skipLabel = "Reveal reward", slots = {}, className = "", style }) {
  const systemReducedMotion = useSyncExternalStore(subscribeMotion, readMotion, serverMotion);
  const reduceMotion = reducedMotion ?? systemReducedMotion;
  const [phase, setPhase] = useState(reduceMotion ? "complete" : "anticipation");
  const callbacks = useRef({ item, onPhase, onComplete });
  const timers = useRef([]);
  const completed = useRef(false);
  const lastPhase = useRef(null);
  const previousSkipSignal = useRef(skipSignal);
  useEffect(() => {
    callbacks.current = { item, onPhase, onComplete };
  }, [item, onPhase, onComplete]);
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  const announcePhase = useCallback((next) => {
    if (lastPhase.current === next) return;
    lastPhase.current = next;
    callbacks.current.onPhase?.(next, callbacks.current.item);
  }, []);
  const finish = useCallback((reason) => {
    if (completed.current) return;
    completed.current = true;
    clearTimers();
    setPhase("complete");
    announcePhase("complete");
    callbacks.current.onComplete?.(callbacks.current.item, reason);
  }, [announcePhase, clearTimers]);
  useEffect(() => {
    if (completed.current) return;
    if (reduceMotion) {
      timers.current = [setTimeout(() => finish("reduced-motion"), 0)];
    } else {
      announcePhase("anticipation");
      const advance = (next) => {
        if (completed.current) return;
        setPhase(next);
        announcePhase(next);
      };
      timers.current = [
        setTimeout(() => advance("emergence"), REWARD_REVEAL_TIMING.emergence),
        setTimeout(() => advance("reveal"), REWARD_REVEAL_TIMING.reveal),
        setTimeout(() => finish("finished"), REWARD_REVEAL_TIMING.complete)
      ];
    }
    return clearTimers;
  }, [announcePhase, clearTimers, finish, reduceMotion]);
  useEffect(() => {
    if (previousSkipSignal.current === skipSignal) return;
    previousSkipSignal.current = skipSignal;
    finish("skipped");
  }, [finish, skipSignal]);
  const special = ["rare", "epic", "legendary", "mythic"].includes(item.rarity ?? "");
  const revealed = phase === "reveal" || phase === "complete";
  const itemArt = slots.itemArt ?? /* @__PURE__ */ jsx(ItemBitmap, { item });
  const particleCount = item.rarity === "mythic" ? 18 : item.rarity === "legendary" ? 14 : special ? 10 : item.rarity === "uncommon" ? 6 : 4;
  return /* @__PURE__ */ jsxs("div", { className: `rf-reward-reveal ${className}`.trim(), "data-reveal-phase": phase, "data-rarity": item.rarity, "data-reduced-motion": reduceMotion || void 0, "data-skip-control": showSkipControl || void 0, style, children: [
    /* @__PURE__ */ jsxs("div", { className: "rf-reward-scene", "aria-hidden": "true", inert: true, children: [
      slots.backdrop && /* @__PURE__ */ jsx("div", { className: "rf-reward-backdrop", children: slots.backdrop }),
      phase === "anticipation" && /* @__PURE__ */ jsx("div", { className: "rf-reward-anticipation", children: slots.anticipation ?? /* @__PURE__ */ jsxs("div", { className: "rf-reward-focus", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("span", {})
      ] }) }),
      phase === "emergence" && /* @__PURE__ */ jsx("div", { className: "rf-reward-emergence", children: slots.emergence ?? /* @__PURE__ */ jsx("div", { className: "rf-reward-silhouette", children: itemArt }) }),
      /* @__PURE__ */ jsx("div", { className: "rf-reward-halo" }),
      revealed && /* @__PURE__ */ jsx("div", { className: "rf-reward-item", children: itemArt }),
      /* @__PURE__ */ jsx("div", { className: "rf-reward-particles", children: Array.from({ length: particleCount }, (_, index2) => /* @__PURE__ */ jsx("i", { style: { "--particle-index": index2, "--particle-count": particleCount } }, index2)) })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "rf-reward-announcement", role: "status", "aria-live": "polite", children: revealed ? [item.name, item.rarity].filter(Boolean).join(", ") : phase === "anticipation" ? "Preparing reward" : "Reward appearing" }),
    showSkipControl && /* @__PURE__ */ jsx("button", { type: "button", className: "rf-reward-skip", onClick: () => finish("skipped"), disabled: phase === "complete", "aria-label": phase === "complete" ? "Reward revealed" : skipLabel, children: phase === "complete" ? "Reward revealed" : skipLabel })
  ] });
}

// src/experience-ui.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var DEFAULT_CURRENCY = { symbol: "", decimals: 0 };
var GAME_VISIBLE_CHOICES = 6;
function formatGameAmount(value, decimals = 0) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) throw new RangeError("Currency decimals must be an integer from 0 to 255");
  const negative = value < 0n;
  const digits = (negative ? -value : value).toString().padStart(decimals + 1, "0");
  const integer = decimals ? digits.slice(0, -decimals) : digits;
  const fraction = decimals ? digits.slice(-decimals).replace(/0+$/, "") : "";
  return `${negative ? "-" : ""}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${fraction ? `.${fraction}` : ""}`;
}
function Keycap({ children }) {
  return /* @__PURE__ */ jsx2("kbd", { className: "rf-game-keycap", children });
}
function ItemArt({ item, className = "" }) {
  const rows = item.art?.rows ?? [];
  const width = rows.length ? Math.max(1, ...rows.map((row) => row.length)) : 16;
  const height = rows.length || 16;
  const path = rows.flatMap((row, y) => [...row].flatMap((pixel, x) => pixel === "#" ? [`M${x} ${y}h1v1h-1z`] : [])).join("");
  return /* @__PURE__ */ jsx2("svg", { className: `rf-game-item-art ${className}`.trim(), viewBox: `0 0 ${width} ${height}`, fill: "currentColor", shapeRendering: "crispEdges", role: "img", "aria-label": item.name, children: /* @__PURE__ */ jsx2("path", { d: path || "M8 1 15 8 8 15 1 8Z" }) });
}
function InventoryIcon() {
  return /* @__PURE__ */ jsx2("svg", { className: "rf-game-inventory-icon", viewBox: "0 0 32 32", fill: "none", stroke: "currentColor", strokeWidth: "2", shapeRendering: "crispEdges", "aria-hidden": "true", children: /* @__PURE__ */ jsx2("path", { d: "M5 8h22v20H5zM10 8V4h12v4M5 14h22M13 14v5h6v-5" }) });
}
function ProgressArt() {
  return /* @__PURE__ */ jsxs2("div", { className: "rf-game-loading-mark", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx2("i", {}),
    /* @__PURE__ */ jsx2("i", {}),
    /* @__PURE__ */ jsx2("i", {}),
    /* @__PURE__ */ jsx2("i", {})
  ] });
}
function ItemPicker({ items, counts = {}, selectedItemId, onSelectItem, label = "Choose item", itemArt }) {
  const name = useId();
  if (items.length > GAME_VISIBLE_CHOICES) return /* @__PURE__ */ jsxs2("p", { className: "rf-game-configuration-error", role: "alert", children: [
    "Builder setup: show at most ",
    GAME_VISIBLE_CHOICES,
    " item choices per activity."
  ] });
  return /* @__PURE__ */ jsx2("div", { className: "rf-game-item-picker", "data-count": items.length, "data-rows": items.length > 3 ? 2 : 1, children: /* @__PURE__ */ jsx2("div", { className: "rf-game-item-choices", role: "radiogroup", "aria-label": label, children: items.map((item) => {
    const count = counts[item.id] ?? 0n;
    const accessibleName = `${item.name}, ${formatGameItemQuantity(item, count)} owned`;
    return /* @__PURE__ */ jsxs2("label", { className: "rf-game-item-choice", "data-item-id": item.id, "data-selected": item.id === selectedItemId, "data-stock": count > 0n, title: accessibleName, children: [
      /* @__PURE__ */ jsx2("input", { type: "radio", name, checked: item.id === selectedItemId, onChange: () => onSelectItem?.(item.id), disabled: !onSelectItem || count <= 0n, "aria-label": accessibleName }),
      /* @__PURE__ */ jsx2("span", { className: "rf-game-choice-art rf-game-art-slot", "aria-hidden": "true", children: itemArt?.(item) ?? /* @__PURE__ */ jsx2(ItemArt, { item }) }),
      /* @__PURE__ */ jsx2("span", { className: "rf-game-choice-name", children: item.name }),
      /* @__PURE__ */ jsxs2("small", { children: [
        formatGameItemQuantity(item, count),
        " owned"
      ] })
    ] }, item.id);
  }) }) });
}
var DEFAULT_LABELS = {
  activityLocation: "Activity",
  shopLocation: "Shop",
  rewardLocation: "Reward",
  activityTitle: "Choose an item",
  activityDescription: "",
  action: "Start",
  selectItem: "Choose item",
  reviewTitle: "Review purchase",
  reviewDescription: "",
  confirm: "Confirm",
  cancel: "Cancel",
  pendingTitle: "Confirming",
  pendingDescription: "",
  workingTitle: "In progress",
  readyTitle: "Ready",
  workingDescription: "",
  readyDescription: "",
  resolve: "Finish",
  waiting: "Waiting",
  rewardTitle: "Your reward",
  keep: "Keep item",
  openShop: "Visit shop",
  emptyInventory: "No items yet.",
  emptyShop: "No offers available.",
  buy: "Buy",
  sell: "Sell",
  returnToActivity: "Back",
  close: "Close panel",
  balance: "Balance",
  item: "Item",
  total: "Total",
  value: "Value",
  reviewNotice: "",
  insufficientBalance: "Insufficient balance.",
  missingItems: "Get the required items from the shop.",
  buyTab: "Buy",
  sellTab: "Sell",
  activityCost: "Required",
  anticipationTitle: "Preparing reward",
  emergenceTitle: "Reward appearing",
  reveal: "Reveal reward",
  previousOffer: "Previous offer",
  nextOffer: "Next offer",
  previousInventory: "Previous item",
  nextInventory: "Next item",
  previousChoices: "Previous items",
  nextChoices: "Next items"
};
function PanelAction({ label, accessibleLabel = label, glyph, primary = false, disabled = false, onClick }) {
  return /* @__PURE__ */ jsxs2("button", { type: "button", className: `rf-game-button${primary ? " rf-game-button-primary" : ""}`, "data-primary-action": primary || void 0, onClick, disabled: disabled || !onClick, "aria-label": accessibleLabel, title: accessibleLabel, children: [
    /* @__PURE__ */ jsx2("span", { className: "rf-game-button-label", children: label }),
    glyph && /* @__PURE__ */ jsx2("span", { className: "rf-game-button-glyph", "aria-hidden": "true", children: glyph })
  ] });
}
function ExperiencePanel({
  stage,
  itemCatalog,
  itemCounts = {},
  selectableItemIds,
  selectedItemId,
  activeItemId,
  itemCost = 0n,
  requirements = {},
  balance,
  currency: currency2 = DEFAULT_CURRENCY,
  shopOffers = [],
  sellOffers = [],
  purchase,
  inventory = [],
  reward,
  rewardValue,
  purchaseDisabled = false,
  shopTab: controlledTab,
  pendingStep = 0,
  pendingSteps = ["Request submitted", "Confirming"],
  status,
  error,
  workingReady = false,
  revealKey,
  reducedMotion,
  onRevealPhase,
  onRevealComplete,
  onSelectItem,
  onBuy,
  onSell,
  onSellReward,
  canSellReward,
  onAction,
  onConfirm,
  onResolve,
  onKeep,
  onShop,
  onReturn,
  onClose,
  onShopTabChange,
  labels: overrides,
  slots = {},
  className = "",
  style,
  dataAttributes
}) {
  const [selectedOfferId, setSelectedOfferId] = useState2(null);
  const [inventoryPage, setInventoryPage] = useState2(0);
  const [localTab, setLocalTab] = useState2("buy");
  const [revealState, setRevealState] = useState2(null);
  const [skipSignal, setSkipSignal] = useState2(0);
  const id = useId();
  const labels = { ...DEFAULT_LABELS, ...overrides };
  const tab = controlledTab ?? localTab;
  const changeTab = (next) => {
    setLocalTab(next);
    onShopTabChange?.(next);
  };
  const item = (itemId) => itemCatalog.find((value) => value.id === itemId);
  const quantity = (value, itemId) => {
    const definition = item(itemId);
    return definition ? formatGameItemQuantity(definition, value) : formatGameAmount(value);
  };
  const renderArt = (value) => slots.itemArt?.(value) ?? /* @__PURE__ */ jsx2(ItemArt, { item: value });
  const selectedItem = item(selectedItemId), activeItem = item(activeItemId) ?? selectedItem, rewardItem = item(reward?.itemId), purchaseItem = item(purchase?.itemId);
  const choices = selectableItemIds ? selectableItemIds.flatMap((itemId) => {
    const value = item(itemId);
    return value ? [value] : [];
  }) : itemCatalog;
  const selectedCount = selectedItem ? itemCounts[selectedItem.id] ?? 0n : 0n;
  const requiredItems = { ...requirements };
  if (selectedItem && itemCost > 0n) requiredItems[selectedItem.id] = (requiredItems[selectedItem.id] ?? 0n) + itemCost;
  const requiredEntries = Object.entries(requiredItems).filter(([, quantity2]) => quantity2 > 0n);
  const missingItems = itemCost > 0n && !selectedItem || requiredEntries.some(([itemId, quantity2]) => (itemCounts[itemId] ?? 0n) < quantity2);
  const requirementText = requiredEntries.map(([itemId, count]) => `${quantity(count, itemId)} ${item(itemId)?.name ?? itemId}`).join(" + ");
  const choiceError = choices.length > GAME_VISIBLE_CHOICES ? `Builder setup: show at most ${GAME_VISIBLE_CHOICES} item choices per activity.` : "";
  const offerError = shopOffers.length > GAME_VISIBLE_CHOICES ? `Builder setup: show at most ${GAME_VISIBLE_CHOICES} offers per shop.` : shopOffers.some((value) => !item(value.itemId)) ? "Builder setup: every shop offer needs an item in the catalog." : "";
  const configurationError = stage === "activity" ? choiceError : stage === "shop" && tab === "buy" ? offerError : "";
  const offer = !offerError ? shopOffers.find((value) => value.id === selectedOfferId) ?? shopOffers[0] : void 0, offerItem = item(offer?.itemId);
  const inventoryIndex = Math.min(inventoryPage, Math.max(0, inventory.length - 1));
  const inventoryEntry = inventory[inventoryIndex], inventoryItem = item(inventoryEntry?.itemId);
  const sellOffer = inventoryEntry && sellOffers.find((value) => value.itemId === inventoryEntry.itemId && value.quantity <= inventoryEntry.quantity);
  const canSell = Boolean(sellOffer && inventoryEntry && (itemCounts[inventoryEntry.itemId] ?? 0n) >= sellOffer.quantity && (canSellReward?.(inventoryEntry) ?? true));
  const revealPhase = revealKey === void 0 || !rewardItem ? "complete" : revealState?.key === revealKey ? revealState.phase : "anticipation";
  const revealReady = revealPhase === "complete";
  const revealTitle = revealPhase === "anticipation" ? labels.anticipationTitle : revealPhase === "emergence" ? labels.emergenceTitle : labels.rewardTitle;
  const steps = pendingSteps.length ? pendingSteps : [labels.pendingTitle];
  const activeStep = Math.max(0, Math.min(steps.length - 1, Number.isFinite(pendingStep) ? Math.floor(pendingStep) : 0));
  const stepStart = Math.max(0, Math.min(activeStep - 1, steps.length - 3));
  const money = (value) => `${formatGameAmount(value, currency2.decimals)}${currency2.symbol ? ` ${currency2.symbol}` : ""}`;
  let summaryLabel = labels.total, summaryText = money(purchase?.price ?? 0n), summaryAmount = purchase?.price ?? 0n;
  if (stage === "activity" || stage === "working") {
    summaryLabel = stage === "activity" ? labels.activityCost : labels.item;
    summaryAmount = void 0;
    summaryText = stage === "working" ? itemCost > 0n && activeItem ? `${quantity(itemCost, activeItem.id)} ${activeItem.name} used` : requirementText || labels.workingTitle : requirementText ? `${requirementText}${selectedItem && requiredEntries.length === 1 ? ` \xB7 ${quantity(selectedCount, selectedItem.id)} owned` : ""}` : labels.readyTitle;
  }
  if (stage === "reward") {
    summaryLabel = !revealReady ? labels.rewardLocation : rewardValue === void 0 ? labels.item : labels.value;
    summaryAmount = revealReady ? rewardValue : void 0;
    summaryText = !revealReady ? revealTitle : rewardValue !== void 0 ? money(rewardValue) : `${quantity(reward?.quantity ?? 0n, rewardItem?.id)} ${rewardItem?.name ?? labels.item}`;
  }
  if (stage === "shop") {
    summaryLabel = tab === "buy" && offer ? `${quantity(offer.quantity, offer.itemId)} ${offerItem?.name ?? labels.item}` : labels.balance;
    summaryAmount = tab === "buy" ? offer?.price ?? 0n : balance;
    summaryText = money(summaryAmount);
  }
  const feedbackError = error || configurationError;
  const feedback = feedbackError || status || (stage === "activity" && missingItems ? labels.missingItems : stage === "review" ? purchase && balance < purchase.price ? labels.insufficientBalance : labels.reviewNotice : stage === "pending" ? `${activeStep + 1} / ${steps.length} \xB7 ${steps[activeStep]}` : "");
  const location = ["shop", "review", "pending"].includes(stage) ? labels.shopLocation : stage === "reward" ? labels.rewardLocation : labels.activityLocation;
  const busy = stage === "pending" || stage === "working";
  const revealProps = rewardItem && revealKey !== void 0 ? { item: rewardItem, revealKey, reducedMotion, skipSignal, showSkipControl: false, slots: { itemArt: renderArt(rewardItem) }, onPhase: (phase, value) => {
    setRevealState({ key: revealKey, phase });
    onRevealPhase?.(phase, value);
  }, onComplete: onRevealComplete } : void 0;
  return /* @__PURE__ */ jsxs2("section", { className: `rf-game-panel ${className}`.trim(), "data-stage": stage, "data-experience-stage": stage, "data-shop-tab": tab, "data-reveal-phase": stage === "reward" ? revealPhase : void 0, "data-ready": workingReady || void 0, "data-footer": slots.footer != null || void 0, "data-reward-details": slots.rewardDetails != null || void 0, style, ...dataAttributes, children: [
    /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-bar", children: [
      /* @__PURE__ */ jsx2("span", { title: location, children: location }),
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-header-actions", children: [
        slots.headerActions,
        onClose && !busy && /* @__PURE__ */ jsx2("button", { type: "button", className: "rf-game-close", onClick: onClose, "aria-label": labels.close, children: "\xD7" })
      ] })
    ] }),
    stage === "activity" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-activity-body", "data-picker": choices.length > 0 || void 0, children: [
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-activity-intro", children: [
        slots.activityArt && /* @__PURE__ */ jsx2("div", { className: "rf-game-activity-art rf-game-art-slot", children: slots.activityArt }),
        /* @__PURE__ */ jsx2("h2", { className: "rf-game-title", title: labels.activityTitle, children: labels.activityTitle }),
        /* @__PURE__ */ jsx2("p", { className: "rf-game-description", children: labels.activityDescription })
      ] }),
      choices.length > 0 && /* @__PURE__ */ jsx2(ItemPicker, { items: choices, counts: itemCounts, selectedItemId, onSelectItem, label: labels.selectItem, itemArt: renderArt })
    ] }),
    stage === "review" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-review-body", children: [
      /* @__PURE__ */ jsx2("h2", { className: "rf-game-title", title: labels.reviewTitle, children: labels.reviewTitle }),
      /* @__PURE__ */ jsx2("p", { className: "rf-game-description", children: labels.reviewDescription }),
      purchaseItem && /* @__PURE__ */ jsx2("div", { className: "rf-game-purchase-art rf-game-art-slot", children: renderArt(purchaseItem) }),
      /* @__PURE__ */ jsxs2("dl", { className: "rf-game-receipt", children: [
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsx2("dt", { children: labels.item }),
          /* @__PURE__ */ jsxs2("dd", { title: `${quantity(purchase?.quantity ?? 0n, purchase?.itemId)} ${purchaseItem?.name ?? labels.item}`, children: [
            quantity(purchase?.quantity ?? 0n, purchase?.itemId),
            " ",
            purchaseItem?.name ?? labels.item
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("div", { children: [
          /* @__PURE__ */ jsx2("dt", { children: labels.balance }),
          /* @__PURE__ */ jsxs2("dd", { title: money(balance), children: [
            formatGameAmount(balance, currency2.decimals),
            " ",
            /* @__PURE__ */ jsx2("span", { children: currency2.symbol })
          ] })
        ] })
      ] })
    ] }),
    stage === "pending" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-pending-body", children: [
      /* @__PURE__ */ jsx2("div", { className: "rf-game-pending-art rf-game-art-slot", children: slots.pendingArt ?? /* @__PURE__ */ jsx2(ProgressArt, {}) }),
      /* @__PURE__ */ jsx2("h2", { className: "rf-game-title", title: labels.pendingTitle, children: labels.pendingTitle }),
      /* @__PURE__ */ jsx2("p", { className: "rf-game-description", children: labels.pendingDescription }),
      /* @__PURE__ */ jsx2("ol", { className: "rf-game-progress", start: stepStart + 1, children: steps.slice(stepStart, stepStart + 3).map((step, index2) => {
        const originalIndex = stepStart + index2;
        return /* @__PURE__ */ jsxs2("li", { "data-state": originalIndex < activeStep ? "complete" : originalIndex === activeStep ? "current" : "waiting", "aria-current": originalIndex === activeStep ? "step" : void 0, children: [
          /* @__PURE__ */ jsx2("span", { className: "rf-game-progress-mark", "aria-hidden": "true", children: originalIndex < activeStep ? "\u2713" : String(originalIndex + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx2("span", { title: step, children: step })
        ] }, originalIndex);
      }) })
    ] }),
    stage === "working" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-working-body", children: [
      /* @__PURE__ */ jsx2("div", { className: "rf-game-working-art rf-game-art-slot", children: slots.workingArt ?? /* @__PURE__ */ jsx2(ProgressArt, {}) }),
      /* @__PURE__ */ jsx2("h2", { className: "rf-game-title", title: workingReady ? labels.readyTitle : labels.workingTitle, children: workingReady ? labels.readyTitle : labels.workingTitle }),
      /* @__PURE__ */ jsx2("p", { className: "rf-game-description", children: workingReady ? labels.readyDescription : labels.workingDescription })
    ] }),
    stage === "reward" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-reward-body", children: [
      /* @__PURE__ */ jsx2("h2", { className: "rf-game-reward-title", title: revealTitle, children: revealTitle }),
      /* @__PURE__ */ jsx2("div", { className: "rf-game-reward-art rf-game-art-slot", children: revealProps ? slots.reveal?.(revealProps) ?? /* @__PURE__ */ jsx2(RewardReveal, { ...revealProps }) : rewardItem ? renderArt(rewardItem) : /* @__PURE__ */ jsx2(InventoryIcon, {}) }),
      /* @__PURE__ */ jsx2("span", { className: "rf-game-rarity", "data-rarity": rewardItem?.rarity, "data-reveal-hidden": !revealReady || !rewardItem?.rarity || void 0, "aria-hidden": !revealReady || !rewardItem?.rarity, children: rewardItem?.rarity }),
      /* @__PURE__ */ jsx2("h3", { className: "rf-game-item-name", title: revealReady ? rewardItem?.name : void 0, "data-reveal-hidden": !revealReady || void 0, "aria-hidden": !revealReady, children: rewardItem?.name }),
      slots.rewardDetails != null && /* @__PURE__ */ jsx2("div", { className: "rf-game-reward-details", "data-reveal-hidden": !revealReady || void 0, "aria-hidden": !revealReady, children: slots.rewardDetails })
    ] }),
    stage === "shop" && /* @__PURE__ */ jsxs2("div", { className: "rf-game-panel-body rf-game-shop-body", children: [
      /* @__PURE__ */ jsx2("div", { className: "rf-game-shop-tabs", role: "tablist", "aria-label": labels.shopLocation, onKeyDown: (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "buy" : event.key === "End" ? "sell" : tab === "buy" ? "sell" : "buy";
        changeTab(next);
        event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus();
      }, children: ["buy", "sell"].map((value) => /* @__PURE__ */ jsx2("button", { type: "button", role: "tab", "data-tab": value, id: `${id}-${value}-tab`, "aria-selected": tab === value, "aria-controls": `${id}-items`, tabIndex: tab === value ? 0 : -1, onClick: () => changeTab(value), children: /* @__PURE__ */ jsx2("span", { children: value === "buy" ? labels.buyTab : labels.sellTab }) }, value)) }),
      /* @__PURE__ */ jsx2("div", { className: "rf-game-shop-items", role: "tabpanel", id: `${id}-items`, "aria-labelledby": `${id}-${tab}-tab`, children: tab === "buy" ? offerError ? /* @__PURE__ */ jsx2("p", { className: "rf-game-configuration-error", role: "alert", children: offerError }) : shopOffers.length ? /* @__PURE__ */ jsx2("div", { className: "rf-game-shop-offers", role: "radiogroup", "aria-label": labels.buyTab, "data-count": shopOffers.length, "data-rows": shopOffers.length > 3 ? 2 : 1, children: shopOffers.map((value) => {
        const definition = item(value.itemId);
        const accessibleName = `${definition.name}, ${quantity(value.quantity, value.itemId)} for ${money(value.price)}`;
        return /* @__PURE__ */ jsxs2("label", { className: "rf-game-shop-offer", "data-offer-id": value.id, "data-item-id": value.itemId, "data-selected": value.id === offer?.id, title: accessibleName, children: [
          /* @__PURE__ */ jsx2("input", { type: "radio", name: `${id}-offer`, checked: value.id === offer?.id, onChange: () => setSelectedOfferId(value.id), "aria-label": accessibleName }),
          /* @__PURE__ */ jsx2("span", { className: "rf-game-offer-art rf-game-art-slot", "aria-hidden": "true", children: renderArt(definition) }),
          /* @__PURE__ */ jsx2("strong", { className: "rf-game-offer-name", children: definition.name }),
          /* @__PURE__ */ jsxs2("span", { className: "rf-game-offer-terms", children: [
            /* @__PURE__ */ jsxs2("span", { children: [
              "\xD7",
              quantity(value.quantity, value.itemId)
            ] }),
            /* @__PURE__ */ jsx2("span", { children: money(value.price) })
          ] }),
          /* @__PURE__ */ jsxs2("small", { className: "rf-game-offer-owned", children: [
            quantity(itemCounts[value.itemId] ?? 0n, value.itemId),
            " owned"
          ] })
        ] }, value.id);
      }) }) : /* @__PURE__ */ jsx2("p", { className: "rf-game-empty-copy", children: labels.emptyShop }) : inventoryEntry && inventoryItem ? /* @__PURE__ */ jsx2("ul", { className: "rf-game-inventory", "aria-label": "Your items", children: /* @__PURE__ */ jsxs2("li", { children: [
        /* @__PURE__ */ jsx2("div", { className: "rf-game-inventory-art rf-game-art-slot", children: renderArt(inventoryItem) }),
        /* @__PURE__ */ jsxs2("div", { className: "rf-game-inventory-copy", children: [
          /* @__PURE__ */ jsx2("span", { className: "rf-game-inventory-rarity", children: inventoryItem.rarity }),
          /* @__PURE__ */ jsx2("strong", { title: inventoryItem.name, children: inventoryItem.name }),
          /* @__PURE__ */ jsx2("span", { title: sellOffer ? `${quantity(sellOffer.quantity, sellOffer.itemId)} for ${money(sellOffer.price)}` : `${quantity(inventoryEntry.quantity, inventoryEntry.itemId)} owned`, children: sellOffer ? `${quantity(sellOffer.quantity, sellOffer.itemId)} for ${money(sellOffer.price)}` : `${quantity(inventoryEntry.quantity, inventoryEntry.itemId)} owned` })
        ] })
      ] }) }) : /* @__PURE__ */ jsxs2("div", { className: "rf-game-empty-inventory", children: [
        /* @__PURE__ */ jsx2("div", { className: "rf-game-art-slot", children: slots.emptyArt ?? /* @__PURE__ */ jsx2(InventoryIcon, {}) }),
        /* @__PURE__ */ jsx2("p", { children: labels.emptyInventory })
      ] }) }),
      tab === "sell" && /* @__PURE__ */ jsxs2("nav", { className: "rf-game-pagination", "aria-label": "Inventory pages", children: [
        /* @__PURE__ */ jsx2("button", { type: "button", disabled: inventory.length < 2, onClick: () => setInventoryPage((inventoryIndex + inventory.length - 1) % inventory.length), "aria-label": labels.previousInventory, children: "\u2190" }),
        /* @__PURE__ */ jsx2("span", { role: "status", "aria-live": "polite", children: inventory.length ? `${inventoryIndex + 1} / ${inventory.length}` : "0" }),
        /* @__PURE__ */ jsx2("button", { type: "button", disabled: inventory.length < 2, onClick: () => setInventoryPage((inventoryIndex + 1) % inventory.length), "aria-label": labels.nextInventory, children: "\u2192" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "rf-game-action-zone", children: [
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-action-summary", "data-long-amount": summaryAmount !== void 0 && formatGameAmount(summaryAmount, currency2.decimals).length > 18 || void 0, children: [
        /* @__PURE__ */ jsx2("span", { title: summaryLabel, children: summaryLabel }),
        summaryAmount === void 0 ? /* @__PURE__ */ jsx2("strong", { className: "rf-game-text-summary", title: summaryText, "aria-label": summaryText, children: summaryText }) : /* @__PURE__ */ jsxs2("strong", { title: summaryText, "aria-label": summaryText, children: [
          /* @__PURE__ */ jsx2("span", { children: formatGameAmount(summaryAmount, currency2.decimals) }),
          /* @__PURE__ */ jsx2("span", { children: currency2.symbol })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-actions", "data-pair": stage === "review" || stage === "reward" && revealReady && Boolean(onSellReward || onShop) || stage === "shop" && Boolean(tab === "buy" ? offer : sellOffer) || void 0, children: [
        stage === "activity" && /* @__PURE__ */ jsx2(PanelAction, { label: missingItems ? labels.openShop : labels.action, primary: true, glyph: "\u2197", disabled: Boolean(choiceError), onClick: missingItems ? onShop : onAction }),
        stage === "review" && /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx2(PanelAction, { label: labels.confirm, primary: true, glyph: "\u2192", onClick: onConfirm, disabled: purchaseDisabled || !purchase || balance < purchase.price }),
          /* @__PURE__ */ jsx2(PanelAction, { label: labels.cancel, onClick: onClose })
        ] }),
        stage === "pending" && /* @__PURE__ */ jsx2(PanelAction, { label: labels.pendingTitle, primary: true, glyph: "\xB7\xB7\xB7", disabled: true }),
        stage === "working" && /* @__PURE__ */ jsx2(PanelAction, { label: workingReady ? labels.resolve : labels.waiting, primary: true, glyph: workingReady ? "\u2191" : "\xB7\xB7\xB7", onClick: onResolve, disabled: !workingReady }),
        stage === "reward" && /* @__PURE__ */ jsxs2(Fragment, { children: [
          /* @__PURE__ */ jsx2(PanelAction, { label: revealReady ? labels.keep : labels.reveal, primary: true, glyph: revealReady ? "+" : "\u2192", onClick: revealReady ? onKeep : () => setSkipSignal((value) => value + 1) }),
          revealReady && (onSellReward || onShop) && /* @__PURE__ */ jsx2(PanelAction, { label: onSellReward ? labels.sell : labels.openShop, glyph: "\u2192", disabled: Boolean(onSellReward && reward && canSellReward && !canSellReward(reward)), onClick: onSellReward ?? onShop })
        ] }),
        stage === "shop" && /* @__PURE__ */ jsxs2(Fragment, { children: [
          tab === "buy" ? offer && /* @__PURE__ */ jsx2(PanelAction, { label: labels.buy, accessibleLabel: `${labels.buy}: ${quantity(offer.quantity, offer.itemId)} ${offerItem?.name ?? labels.item} for ${money(offer.price)}`, primary: true, glyph: "\u2197", disabled: purchaseDisabled || !offerItem || balance < offer.price, onClick: onBuy ? () => onBuy(offer.id) : void 0 }) : sellOffer && inventoryEntry && /* @__PURE__ */ jsx2(PanelAction, { label: labels.sell, accessibleLabel: `${labels.sell}: ${inventoryItem?.name ?? labels.item} for ${money(sellOffer.price)}`, primary: true, glyph: "\u2197", disabled: !canSell, onClick: onSell ? () => onSell(inventoryEntry.id, sellOffer.id) : void 0 }),
          /* @__PURE__ */ jsx2(PanelAction, { label: labels.returnToActivity, primary: !(tab === "buy" ? offer : sellOffer), glyph: "\u2192", onClick: onReturn ?? onClose })
        ] })
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "rf-game-feedback", "data-error": Boolean(feedbackError) || void 0, role: feedbackError ? "alert" : "status", "aria-live": feedbackError ? "assertive" : "polite", children: /* @__PURE__ */ jsx2("span", { title: feedback, children: feedback }) })
    ] }),
    slots.footer != null && /* @__PURE__ */ jsx2("div", { className: "rf-game-panel-foot", children: slots.footer })
  ] });
}
function GameHud({ balance, currency: currency2 = DEFAULT_CURRENCY, inventoryCount = 0n, itemCount, itemCountLabel = "items", quest, onReset, onInventory, labels = {}, slots = {}, className = "", style }) {
  return /* @__PURE__ */ jsxs2("div", { className: `rf-game-hud ${className}`.trim(), style, children: [
    /* @__PURE__ */ jsxs2("div", { className: "rf-game-hud-top", children: [
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-wallet", children: [
        /* @__PURE__ */ jsx2("span", { children: labels.balance ?? "Balance" }),
        /* @__PURE__ */ jsxs2("strong", { title: `${formatGameAmount(balance, currency2.decimals)} ${currency2.symbol}`, children: [
          formatGameAmount(balance, currency2.decimals),
          " ",
          /* @__PURE__ */ jsx2("span", { children: currency2.symbol })
        ] }),
        itemCount !== void 0 && /* @__PURE__ */ jsxs2("span", { className: "rf-game-wallet-items", children: [
          formatGameAmount(itemCount),
          " ",
          itemCountLabel
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "rf-game-hud-controls", children: [
        /* @__PURE__ */ jsxs2("button", { type: "button", className: "rf-game-inventory-button", onClick: onInventory, disabled: !onInventory, "aria-label": labels.inventory ?? `Open inventory, ${formatGameAmount(inventoryCount)} items`, children: [
          slots.inventoryIcon ?? /* @__PURE__ */ jsx2(InventoryIcon, {}),
          /* @__PURE__ */ jsx2("span", { children: formatGameAmount(inventoryCount) })
        ] }),
        onReset && /* @__PURE__ */ jsx2("button", { type: "button", className: "rf-game-reset", onClick: onReset, "aria-label": labels.reset ?? "Reset experience", title: labels.reset ?? "Reset", children: "\u21BA" })
      ] })
    ] }),
    quest && /* @__PURE__ */ jsx2("div", { className: "rf-game-quest", children: /* @__PURE__ */ jsx2("p", { children: quest }) })
  ] });
}
function ActivityPrompt({ label, detail, active = false, pulse = false, onClick, keyLabel = "E", className = "", style, dataAttributes }) {
  return /* @__PURE__ */ jsxs2("button", { type: "button", className: `rf-game-hotspot ${className}`.trim(), "data-active": active, "data-pulse": pulse || void 0, onClick, disabled: !onClick, "aria-label": label, style, ...dataAttributes, children: [
    /* @__PURE__ */ jsx2(Keycap, { children: keyLabel }),
    /* @__PURE__ */ jsxs2("span", { className: "rf-game-hotspot-copy", children: [
      /* @__PURE__ */ jsx2("span", { children: label }),
      detail && /* @__PURE__ */ jsx2("small", { children: detail })
    ] })
  ] });
}

// src/game-frame.tsx
import { useEffect as useEffect2, useId as useId2, useRef as useRef2, useState as useState3 } from "react";
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var GAME_VIEWPORT = Object.freeze({ width: 960, height: 640 });
function GameMenu({ title, onClose, children, footer }) {
  const id = useId2();
  const node = useRef2(null);
  useEffect2(() => {
    const previous = document.activeElement;
    node.current?.focus();
    return () => {
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return /* @__PURE__ */ jsx3("div", { className: "rf-frame-scrim", children: /* @__PURE__ */ jsxs3(
    "div",
    {
      ref: node,
      className: "rf-frame-menu",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": id,
      tabIndex: -1,
      onKeyDown: (event) => {
        if (event.key === "Escape" && onClose) {
          event.preventDefault();
          onClose();
        }
        if (event.key !== "Tab") return;
        const buttons = [...event.currentTarget.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]')].filter((element) => element.getClientRects().length > 0);
        const first = buttons[0], last = buttons.at(-1);
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === node.current)) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === node.current)) {
          event.preventDefault();
          first.focus();
        }
      },
      children: [
        /* @__PURE__ */ jsxs3("header", { className: "rf-frame-menu-heading", children: [
          /* @__PURE__ */ jsx3("h2", { id, children: title }),
          onClose && /* @__PURE__ */ jsx3("button", { type: "button", onClick: onClose, "aria-label": `Close ${title}`, children: "\xD7" })
        ] }),
        /* @__PURE__ */ jsx3("div", { className: "rf-frame-menu-body", children }),
        footer && /* @__PURE__ */ jsx3("footer", { className: "rf-frame-menu-footer", children: footer })
      ]
    }
  ) });
}
function GameFrame({ children, friends, selectedFriendId, onSelectFriend, friendsLoading, friendsError, friendsEmptyMessage = "No playable Friends found.", friendsHiddenCount = 0, onConnect, wallet, confirmation, connection, walletActions, selectionMode = "picker", mode, onMenuChange }) {
  const [menu, setMenu] = useState3(null);
  const friend = friends.find((value) => value.id === selectedFriendId);
  const selecting = selectionMode === "picker" && (!friend || menu === "friends");
  const menuOpen = selecting || menu === "wallet" || Boolean(confirmation);
  useEffect2(() => {
    onMenuChange?.(menuOpen);
  }, [menuOpen, onMenuChange]);
  return /* @__PURE__ */ jsxs3("section", { className: "rf-game-frame", "aria-label": "Game container", "data-mode": mode, children: [
    /* @__PURE__ */ jsxs3("div", { className: "rf-frame-chrome", inert: menuOpen || void 0, children: [
      /* @__PURE__ */ jsxs3("div", { className: "rf-frame-toolbar", children: [
        /* @__PURE__ */ jsx3("span", { className: "rf-frame-mode", children: mode === "preview" ? "Local preview" : "Live \xB7 Robinhood" }),
        selectionMode === "host" ? /* @__PURE__ */ jsx3("span", { className: "rf-frame-selected-friend", children: friend?.label ?? "Choose a Friend" }) : /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setMenu("friends"), "aria-label": "Choose Friend", children: friend?.label ?? "Choose Friend" }),
        /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setMenu("wallet"), disabled: !friend, "aria-label": "Open Friend wallet", children: "Friend wallet" })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "rf-frame-viewport", children })
    ] }),
    confirmation ? /* @__PURE__ */ jsxs3(
      GameMenu,
      {
        title: confirmation.title,
        onClose: confirmation.busy ? void 0 : confirmation.onCancel,
        footer: /* @__PURE__ */ jsxs3(Fragment2, { children: [
          /* @__PURE__ */ jsx3("button", { type: "button", disabled: confirmation.busy, onClick: confirmation.onCancel, children: "Cancel" }),
          /* @__PURE__ */ jsx3("button", { type: "button", className: "rf-frame-primary", disabled: confirmation.busy, onClick: confirmation.onConfirm, children: confirmation.busy ? "Waiting\u2026" : mode === "preview" ? "Confirm preview" : "Confirm" })
        ] }),
        children: [
          /* @__PURE__ */ jsx3("p", { children: confirmation.description }),
          confirmation.amount !== void 0 && /* @__PURE__ */ jsx3("p", { children: /* @__PURE__ */ jsxs3("strong", { children: [
            formatGameAmount(confirmation.amount, 18),
            " RF"
          ] }) }),
          confirmation.notice && /* @__PURE__ */ jsx3("p", { children: confirmation.notice }),
          /* @__PURE__ */ jsx3("p", { children: friend?.label }),
          /* @__PURE__ */ jsx3("p", { className: "rf-frame-note", children: mode === "preview" ? "Simulated RF. No transaction will be sent." : "This action uses the selected Friend\u2019s canonical wallet. A result is confirmed only after its receipt." }),
          confirmation.error && /* @__PURE__ */ jsx3("p", { role: "alert", children: confirmation.error })
        ]
      }
    ) : selecting ? /* @__PURE__ */ jsxs3(GameMenu, { title: "Choose your Friend", onClose: friend ? () => setMenu(null) : void 0, children: [
      /* @__PURE__ */ jsx3("p", { children: mode === "preview" ? !friends.some((value) => value.kind === "sample") ? "Choose your Friend for this local preview. Balances, items and outcomes are simulated." : "Choose a sample Friend. Each has separate simulated balances and items." : "Choose an owned, hardwired Generations NFT. Its inventory and RF stay with its wallet." }),
      connection,
      friendsLoading && /* @__PURE__ */ jsx3("p", { role: "status", children: "Loading your Friends\u2026" }),
      friendsError && /* @__PURE__ */ jsx3("p", { role: "alert", children: friendsError }),
      /* @__PURE__ */ jsx3("div", { className: "rf-frame-friends", children: friends.map((value) => /* @__PURE__ */ jsxs3("button", { type: "button", "aria-pressed": value.id === selectedFriendId, onClick: () => {
        onSelectFriend?.(value.id);
        setMenu(null);
      }, children: [
        /* @__PURE__ */ jsx3("strong", { children: value.label }),
        /* @__PURE__ */ jsx3("small", { children: value.kind === "sample" ? "Sample \xB7 no ownership claim" : "Hardwired Generations" })
      ] }, value.id.toString())) }),
      !friendsLoading && !friendsError && friendsHiddenCount > 0 && /* @__PURE__ */ jsxs3("p", { children: [
        friendsHiddenCount,
        " ",
        friendsHiddenCount === 1 ? "Friend" : "Friends",
        " hidden: not hardwired (generation 0). Playing requires generation 1 or higher."
      ] }),
      !friendsLoading && !friendsError && !friends.length && friendsEmptyMessage && /* @__PURE__ */ jsx3("p", { children: friendsEmptyMessage }),
      onConnect && /* @__PURE__ */ jsx3("button", { type: "button", className: "rf-frame-primary", onClick: onConnect, children: "Connect wallet" })
    ] }) : menu === "wallet" ? /* @__PURE__ */ jsxs3(GameMenu, { title: "Friend wallet", onClose: () => setMenu(null), children: [
      /* @__PURE__ */ jsx3("h3", { children: friend?.label }),
      /* @__PURE__ */ jsx3("p", { children: mode === "preview" ? "Preview balance. RF is simulated and no transactions are sent." : "Items and RF belong to this Friend\u2019s canonical wallet." }),
      friend?.walletAddress && /* @__PURE__ */ jsx3("p", { className: "rf-frame-address", children: friend.walletAddress }),
      wallet?.status === "loading" ? /* @__PURE__ */ jsx3("p", { role: "status", children: "Loading RF balance\u2026" }) : wallet?.balance !== void 0 ? /* @__PURE__ */ jsxs3("p", { className: "rf-frame-wallet-balance", children: [
        formatGameAmount(wallet.balance, 18),
        " RF"
      ] }) : /* @__PURE__ */ jsx3("p", { children: "RF balance unavailable." }),
      wallet?.error && /* @__PURE__ */ jsx3("p", { role: "alert", children: wallet.error }),
      walletActions,
      selectionMode === "picker" && /* @__PURE__ */ jsx3("button", { type: "button", onClick: () => setMenu("friends"), children: "Change Friend" })
    ] }) : null
  ] });
}

// examples/fishing/game.json
var game_default = {
  name: "Rare Friends: Fishing",
  consumable: "Bait",
  price: "1000000000000000000",
  outcomes: [
    { name: "Old Boot", chanceBps: 1500, reward: "0" },
    { name: "Sardine", chanceBps: 3e3, reward: "250000000000000000" },
    { name: "Sunfish", chanceBps: 2200, reward: "500000000000000000" },
    { name: "Bream", chanceBps: 1400, reward: "750000000000000000" },
    { name: "Rainbow Trout", chanceBps: 900, reward: "1500000000000000000" },
    { name: "Catfish", chanceBps: 500, reward: "2500000000000000000" },
    { name: "Sturgeon", chanceBps: 300, reward: "5000000000000000000" },
    { name: "Legend", chanceBps: 200, reward: "10000000000000000000" }
  ]
};

// examples/fishing/art.json
var art_default = [
  {
    id: "old-boot",
    rarity: "junk",
    rows: [
      "........................",
      "......########..........",
      "......#......#..........",
      "......#.#.##.#..........",
      "......#......#..........",
      "......#.##.#.#..........",
      "......#......#..........",
      "......#.#.##.#..........",
      "......#......#..........",
      "......#......#####......",
      "......#..........##.....",
      ".....##...........#.....",
      ".....##############.....",
      ".....##############.....",
      "........................",
      "........................"
    ]
  },
  {
    id: "sardine",
    rarity: "common",
    rows: [
      "........................",
      "........................",
      "........................",
      "........................",
      "...........##...........",
      "..........####..........",
      "..##....##########......",
      "..#####.########.###....",
      "..###################...",
      "..#####.############....",
      "..##....##########......",
      "..........####..........",
      "...........##...........",
      "........................",
      "........................",
      "........................"
    ]
  },
  {
    id: "sunfish",
    rarity: "common",
    rows: [
      "........................",
      "..........###...........",
      "........#######.........",
      ".......#########........",
      "......###########.......",
      "..##..########.###......",
      "..###.#############.....",
      "..##################....",
      "..##################....",
      "..###.#############.....",
      "..##..############......",
      "......###########.......",
      ".......#########........",
      "........#######.........",
      "..........###...........",
      "........................"
    ]
  },
  {
    id: "bream",
    rarity: "uncommon",
    rows: [
      "........................",
      "........................",
      ".........#.#.#..........",
      "........########........",
      ".......##########.......",
      ".##...############......",
      ".####.#########.###.....",
      ".########.##.#######....",
      ".########.##.########...",
      ".####.###.##.#######....",
      ".##...############......",
      ".......##########.......",
      ".........#####..........",
      "..........###...........",
      "........................",
      "........................"
    ]
  },
  {
    id: "rainbow-trout",
    rarity: "rare",
    rows: [
      "........................",
      "........................",
      "............###.........",
      "..........#####.........",
      "..#.....############....",
      "..##..####.##.#######...",
      "..######.##.##.###.###..",
      "..#####################.",
      "..###................##.",
      "..####################..",
      "..##..##.##.##.######...",
      "..#.....############....",
      "..........#####.........",
      "............###.........",
      "........................",
      "........................"
    ]
  },
  {
    id: "catfish",
    rarity: "epic",
    rows: [
      "........................",
      "........................",
      "...........###..........",
      "..........####..........",
      ".##....############.....",
      ".####.###############...",
      ".################.####..",
      ".######################.",
      ".#####################..",
      ".####.#############.#.#.",
      ".##....###########..#.#.",
      ".........######.....#.#.",
      "..........####.......#..",
      "...........##...........",
      "........................",
      "........................"
    ]
  },
  {
    id: "sturgeon",
    rarity: "legendary",
    rows: [
      "........................",
      "........................",
      ".........#...#..........",
      "........###.###.........",
      ".#....############......",
      ".##..###.###.#######....",
      ".######.###.###.#######.",
      ".#######################",
      ".######.###.###.###.###.",
      ".##..###.###.########...",
      ".#....############......",
      "........####..##........",
      ".........##....#........",
      "........................",
      "........................",
      "........................"
    ]
  },
  {
    id: "legend",
    rarity: "mythic",
    rows: [
      "..........#..#..........",
      ".........######.........",
      "...#....########........",
      "...##..###########......",
      "..#######..#########....",
      ".########....#####.###..",
      "..########..###########.",
      "...####################.",
      "..########..###########.",
      ".########....#########..",
      "..#######..#########....",
      "...##..###########......",
      "...#....########........",
      ".........######.........",
      "..........#..#..........",
      "........................"
    ]
  }
];

// examples/fishing/world.tsx
import { useEffect as useEffect3, useRef as useRef3, useState as useState4 } from "react";

// src/friend-worlds.json
var friend_worlds_default = {
  version: 1,
  collection: "Rare Friends / Isometric Worlds",
  source: {
    livingMap: "src/friend-world.ts",
    projection: "src/friend-worlds.json#style.projection",
    characterRule: "Use canonical on-chain Generations sprites through the SDK sprite reader. Preserve integer pixel edges and the white outline."
  },
  style: {
    projection: {
      a: 0.8660254038,
      b: 0.28
    },
    ground: {
      width: 576,
      height: 384,
      chunkSize: 48
    },
    viewport: {
      width: 1600,
      height: 1200,
      centerX: 800,
      centerY: 690,
      scale: 1.5
    },
    palette: {
      ink: "#000000",
      paper: "#FFFFFF",
      signal: "#CCFF00"
    },
    spriteSize: 80,
    background: "transparent",
    previewBackground: "#090B09",
    grid: {
      cell: 24,
      strokeWidth: 0.55,
      opacity: 0.18
    },
    edgeStrokeWidth: 1.5,
    loadingRules: {
      void: "Subtract this chunk from the top and floor texture. Show only a subtle dotted guide if needed.",
      wireframe: "Subtract the chunk; show an open green isometric outline with sparse node corners, no fill.",
      floating: "Subtract the chunk; draw a separate white/dither unfinished tile lifted by lift screen pixels with a slim green guide.",
      occlusion: "Mask all floor paths and texture to the actual loaded surface. Do not leave upright actors or props anchored over a missing chunk."
    },
    characterPixelScale: 5,
    characterSourceResolution: [
      16,
      16
    ]
  },
  worlds: [
    {
      family: "garden-oval",
      name: "Garden Commons",
      setting: "Botanical garden",
      shape: "Organic oval",
      summary: "A soft island with a pond, pixel trees and an open gathering route.",
      geometry: {
        polygons: [
          [
            [
              72,
              48
            ],
            [
              144,
              16
            ],
            [
              240,
              0
            ],
            [
              384,
              8
            ],
            [
              480,
              48
            ],
            [
              544,
              104
            ],
            [
              576,
              176
            ],
            [
              560,
              248
            ],
            [
              512,
              312
            ],
            [
              432,
              360
            ],
            [
              304,
              384
            ],
            [
              176,
              376
            ],
            [
              80,
              336
            ],
            [
              24,
              272
            ],
            [
              0,
              192
            ],
            [
              16,
              112
            ]
          ]
        ],
        holes: [],
        depth: 18
      },
      props: [
        {
          type: "tree",
          x: 144,
          y: 90,
          scale: 1.05
        },
        {
          type: "tree",
          x: 452,
          y: 110,
          scale: 1.12
        },
        {
          type: "flower",
          x: 95,
          y: 130,
          scale: 0.8
        },
        {
          type: "flower",
          x: 180,
          y: 100,
          scale: 0.9
        },
        {
          type: "flower",
          x: 351,
          y: 335,
          scale: 0.9
        },
        {
          type: "flower",
          x: 248,
          y: 337,
          scale: 0.8
        },
        {
          type: "bench",
          x: 340,
          y: 58,
          scale: 0.9
        },
        {
          type: "reeds",
          x: 126,
          y: 282,
          scale: 0.85
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 120,
          y: 212
        },
        {
          sprite: 1,
          x: 240,
          y: 94
        },
        {
          sprite: 2,
          x: 344,
          y: 168
        },
        {
          sprite: 3,
          x: 453,
          y: 207
        },
        {
          sprite: 4,
          x: 260,
          y: 294
        },
        {
          sprite: 5,
          x: 380,
          y: 290
        }
      ],
      paths: [
        {
          points: [
            [
              64,
              184
            ],
            [
              184,
              184
            ],
            [
              184,
              144
            ],
            [
              320,
              144
            ],
            [
              320,
              232
            ],
            [
              464,
              232
            ]
          ],
          width: 22
        }
      ],
      patches: [
        {
          x: 89,
          y: 52,
          w: 112,
          h: 64,
          pattern: "dither"
        },
        {
          x: 410,
          y: 54,
          w: 104,
          h: 70,
          pattern: "dither"
        },
        {
          x: 70,
          y: 258,
          w: 128,
          h: 64,
          pattern: "water"
        },
        {
          x: 226,
          y: 310,
          w: 180,
          h: 42,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 176,
          y: 164,
          kind: "currency"
        },
        {
          x: 292,
          y: 152,
          kind: "currency"
        },
        {
          x: 402,
          y: 235,
          kind: "currency"
        },
        {
          x: 162,
          y: 247,
          kind: "currency"
        }
      ],
      id: "01-garden-oval-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "garden-oval",
      name: "Garden Commons / Loading",
      setting: "Botanical garden",
      shape: "Organic oval",
      summary: "A soft island with a pond, pixel trees and an open gathering route. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              72,
              48
            ],
            [
              144,
              16
            ],
            [
              240,
              0
            ],
            [
              384,
              8
            ],
            [
              480,
              48
            ],
            [
              544,
              104
            ],
            [
              576,
              176
            ],
            [
              560,
              248
            ],
            [
              512,
              312
            ],
            [
              432,
              360
            ],
            [
              304,
              384
            ],
            [
              176,
              376
            ],
            [
              80,
              336
            ],
            [
              24,
              272
            ],
            [
              0,
              192
            ],
            [
              16,
              112
            ]
          ]
        ],
        holes: [],
        depth: 18
      },
      props: [
        {
          type: "tree",
          x: 144,
          y: 90,
          scale: 1.05
        },
        {
          type: "tree",
          x: 452,
          y: 110,
          scale: 1.12
        },
        {
          type: "flower",
          x: 95,
          y: 130,
          scale: 0.8
        },
        {
          type: "flower",
          x: 180,
          y: 100,
          scale: 0.9
        },
        {
          type: "flower",
          x: 351,
          y: 335,
          scale: 0.9
        },
        {
          type: "flower",
          x: 248,
          y: 337,
          scale: 0.8
        },
        {
          type: "bench",
          x: 340,
          y: 58,
          scale: 0.9
        },
        {
          type: "reeds",
          x: 126,
          y: 282,
          scale: 0.85
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 120,
          y: 212
        },
        {
          sprite: 1,
          x: 240,
          y: 94
        },
        {
          sprite: 2,
          x: 344,
          y: 168
        },
        {
          sprite: 3,
          x: 453,
          y: 207
        },
        {
          sprite: 4,
          x: 260,
          y: 294
        },
        {
          sprite: 5,
          x: 380,
          y: 290
        }
      ],
      paths: [
        {
          points: [
            [
              64,
              184
            ],
            [
              184,
              184
            ],
            [
              184,
              144
            ],
            [
              320,
              144
            ],
            [
              320,
              232
            ],
            [
              464,
              232
            ]
          ],
          width: 22
        }
      ],
      patches: [
        {
          x: 89,
          y: 52,
          w: 112,
          h: 64,
          pattern: "dither"
        },
        {
          x: 410,
          y: 54,
          w: 104,
          h: 70,
          pattern: "dither"
        },
        {
          x: 70,
          y: 258,
          w: 128,
          h: 64,
          pattern: "water"
        },
        {
          x: 226,
          y: 310,
          w: 180,
          h: 42,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 176,
          y: 164,
          kind: "currency"
        },
        {
          x: 292,
          y: 152,
          kind: "currency"
        },
        {
          x: 402,
          y: 235,
          kind: "currency"
        },
        {
          x: 162,
          y: 247,
          kind: "currency"
        }
      ],
      id: "01-garden-oval-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 240,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 240,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 240,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 30
        },
        {
          x: 432,
          y: 288,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 288,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 384,
          y: 336,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 22
        },
        {
          x: 432,
          y: 336,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "circuit-courtyard",
      name: "Circuit Courtyard",
      setting: "Industrial circuit workshop",
      shape: "Courtyard ring",
      summary: "A compact workshop wrapped around an open square, with terminals, tanks and circuit traces.",
      geometry: {
        polygons: [
          [
            [
              48,
              0
            ],
            [
              528,
              0
            ],
            [
              576,
              48
            ],
            [
              576,
              336
            ],
            [
              528,
              384
            ],
            [
              48,
              384
            ],
            [
              0,
              336
            ],
            [
              0,
              48
            ]
          ]
        ],
        holes: [
          [
            [
              192,
              120
            ],
            [
              384,
              120
            ],
            [
              384,
              264
            ],
            [
              192,
              264
            ]
          ]
        ],
        depth: 24
      },
      props: [
        {
          type: "tank",
          x: 95,
          y: 74,
          scale: 1.1
        },
        {
          type: "pipe",
          x: 158,
          y: 68,
          scale: 0.95
        },
        {
          type: "terminal",
          x: 426,
          y: 72,
          scale: 1.05
        },
        {
          type: "crate",
          x: 518,
          y: 133,
          scale: 0.95
        },
        {
          type: "tank",
          x: 88,
          y: 286,
          scale: 0.8
        },
        {
          type: "terminal",
          x: 448,
          y: 314,
          scale: 0.9
        },
        {
          type: "pipe",
          x: 285,
          y: 340,
          scale: 0.9
        },
        {
          type: "crate",
          x: 132,
          y: 344,
          scale: 0.8
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 200,
          y: 60
        },
        {
          sprite: 2,
          x: 346,
          y: 75
        },
        {
          sprite: 4,
          x: 490,
          y: 210
        },
        {
          sprite: 6,
          x: 394,
          y: 324
        },
        {
          sprite: 1,
          x: 187,
          y: 318
        },
        {
          sprite: 3,
          x: 92,
          y: 183
        }
      ],
      paths: [
        {
          points: [
            [
              48,
              144
            ],
            [
              48,
              216
            ],
            [
              144,
              216
            ],
            [
              144,
              312
            ],
            [
              360,
              312
            ],
            [
              360,
              344
            ],
            [
              528,
              344
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              168,
              48
            ],
            [
              264,
              48
            ],
            [
              264,
              96
            ],
            [
              480,
              96
            ],
            [
              480,
              160
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 54,
          y: 30,
          w: 110,
          h: 56,
          pattern: "dense"
        },
        {
          x: 400,
          y: 32,
          w: 140,
          h: 76,
          pattern: "grid"
        },
        {
          x: 40,
          y: 268,
          w: 110,
          h: 94,
          pattern: "dither"
        },
        {
          x: 412,
          y: 278,
          w: 132,
          h: 62,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 280,
          y: 76,
          kind: "node"
        },
        {
          x: 539,
          y: 208,
          kind: "node"
        },
        {
          x: 322,
          y: 322,
          kind: "currency"
        },
        {
          x: 125,
          y: 195,
          kind: "currency"
        }
      ],
      id: "02-circuit-courtyard-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "circuit-courtyard",
      name: "Circuit Courtyard / Loading",
      setting: "Industrial circuit workshop",
      shape: "Courtyard ring",
      summary: "A compact workshop wrapped around an open square, with terminals, tanks and circuit traces. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              48,
              0
            ],
            [
              528,
              0
            ],
            [
              576,
              48
            ],
            [
              576,
              336
            ],
            [
              528,
              384
            ],
            [
              48,
              384
            ],
            [
              0,
              336
            ],
            [
              0,
              48
            ]
          ]
        ],
        holes: [
          [
            [
              192,
              120
            ],
            [
              384,
              120
            ],
            [
              384,
              264
            ],
            [
              192,
              264
            ]
          ]
        ],
        depth: 24
      },
      props: [
        {
          type: "tank",
          x: 95,
          y: 74,
          scale: 1.1
        },
        {
          type: "pipe",
          x: 158,
          y: 68,
          scale: 0.95
        },
        {
          type: "terminal",
          x: 426,
          y: 72,
          scale: 1.05
        },
        {
          type: "tank",
          x: 88,
          y: 286,
          scale: 0.8
        },
        {
          type: "terminal",
          x: 448,
          y: 314,
          scale: 0.9
        },
        {
          type: "pipe",
          x: 285,
          y: 340,
          scale: 0.9
        },
        {
          type: "crate",
          x: 132,
          y: 344,
          scale: 0.8
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 200,
          y: 60
        },
        {
          sprite: 2,
          x: 346,
          y: 75
        },
        {
          sprite: 4,
          x: 490,
          y: 210
        },
        {
          sprite: 6,
          x: 394,
          y: 324
        },
        {
          sprite: 1,
          x: 187,
          y: 318
        },
        {
          sprite: 3,
          x: 92,
          y: 183
        }
      ],
      paths: [
        {
          points: [
            [
              48,
              144
            ],
            [
              48,
              216
            ],
            [
              144,
              216
            ],
            [
              144,
              312
            ],
            [
              360,
              312
            ],
            [
              360,
              344
            ],
            [
              528,
              344
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              168,
              48
            ],
            [
              264,
              48
            ],
            [
              264,
              96
            ],
            [
              480,
              96
            ],
            [
              480,
              160
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 54,
          y: 30,
          w: 110,
          h: 56,
          pattern: "dense"
        },
        {
          x: 400,
          y: 32,
          w: 140,
          h: 76,
          pattern: "grid"
        },
        {
          x: 40,
          y: 268,
          w: 110,
          h: 94,
          pattern: "dither"
        },
        {
          x: 412,
          y: 278,
          w: 132,
          h: 62,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 280,
          y: 76,
          kind: "node"
        },
        {
          x: 539,
          y: 208,
          kind: "node"
        },
        {
          x: 322,
          y: 322,
          kind: "currency"
        },
        {
          x: 125,
          y: 195,
          kind: "currency"
        }
      ],
      id: "02-circuit-courtyard-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 28
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "crystal-mesa",
      name: "Crystal Steps",
      setting: "Crystal cavern",
      shape: "Stepped mesa",
      summary: "A broad, cut stone plateau with dense crystal clusters and exposed strata.",
      geometry: {
        polygons: [
          [
            [
              64,
              0
            ],
            [
              432,
              0
            ],
            [
              432,
              48
            ],
            [
              512,
              48
            ],
            [
              512,
              112
            ],
            [
              560,
              112
            ],
            [
              560,
              288
            ],
            [
              496,
              288
            ],
            [
              496,
              336
            ],
            [
              336,
              336
            ],
            [
              336,
              384
            ],
            [
              96,
              384
            ],
            [
              96,
              336
            ],
            [
              48,
              336
            ],
            [
              48,
              272
            ],
            [
              0,
              272
            ],
            [
              0,
              112
            ],
            [
              64,
              112
            ]
          ]
        ],
        holes: [],
        depth: 30
      },
      props: [
        {
          type: "crystal",
          x: 118,
          y: 70,
          scale: 1.25
        },
        {
          type: "crystal",
          x: 161,
          y: 93,
          scale: 0.75
        },
        {
          type: "crystal",
          x: 445,
          y: 112,
          scale: 1.45
        },
        {
          type: "crystal",
          x: 479,
          y: 148,
          scale: 0.75
        },
        {
          type: "rock",
          x: 313,
          y: 60,
          scale: 0.95
        },
        {
          type: "rock",
          x: 79,
          y: 216,
          scale: 0.95
        },
        {
          type: "crystal",
          x: 184,
          y: 336,
          scale: 1.15
        },
        {
          type: "rock",
          x: 398,
          y: 294,
          scale: 1.05
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 218,
          y: 107
        },
        {
          sprite: 1,
          x: 350,
          y: 146
        },
        {
          sprite: 3,
          x: 450,
          y: 243
        },
        {
          sprite: 4,
          x: 286,
          y: 262
        },
        {
          sprite: 6,
          x: 111,
          y: 165
        },
        {
          sprite: 7,
          x: 297,
          y: 343
        }
      ],
      paths: [
        {
          points: [
            [
              88,
              152
            ],
            [
              200,
              152
            ],
            [
              200,
              212
            ],
            [
              376,
              212
            ],
            [
              376,
              274
            ],
            [
              496,
              274
            ]
          ],
          width: 18
        }
      ],
      patches: [
        {
          x: 82,
          y: 36,
          w: 132,
          h: 102,
          pattern: "dense"
        },
        {
          x: 404,
          y: 74,
          w: 96,
          h: 95,
          pattern: "dither"
        },
        {
          x: 98,
          y: 302,
          w: 232,
          h: 70,
          pattern: "dense"
        },
        {
          x: 40,
          y: 180,
          w: 72,
          h: 84,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 186,
          y: 172,
          kind: "currency"
        },
        {
          x: 317,
          y: 204,
          kind: "currency"
        },
        {
          x: 405,
          y: 250,
          kind: "currency"
        }
      ],
      id: "03-crystal-mesa-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "crystal-mesa",
      name: "Crystal Steps / Loading",
      setting: "Crystal cavern",
      shape: "Stepped mesa",
      summary: "A broad, cut stone plateau with dense crystal clusters and exposed strata. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              64,
              0
            ],
            [
              432,
              0
            ],
            [
              432,
              48
            ],
            [
              512,
              48
            ],
            [
              512,
              112
            ],
            [
              560,
              112
            ],
            [
              560,
              288
            ],
            [
              496,
              288
            ],
            [
              496,
              336
            ],
            [
              336,
              336
            ],
            [
              336,
              384
            ],
            [
              96,
              384
            ],
            [
              96,
              336
            ],
            [
              48,
              336
            ],
            [
              48,
              272
            ],
            [
              0,
              272
            ],
            [
              0,
              112
            ],
            [
              64,
              112
            ]
          ]
        ],
        holes: [],
        depth: 30
      },
      props: [
        {
          type: "crystal",
          x: 118,
          y: 70,
          scale: 1.25
        },
        {
          type: "crystal",
          x: 161,
          y: 93,
          scale: 0.75
        },
        {
          type: "crystal",
          x: 445,
          y: 112,
          scale: 1.45
        },
        {
          type: "crystal",
          x: 479,
          y: 148,
          scale: 0.75
        },
        {
          type: "rock",
          x: 313,
          y: 60,
          scale: 0.95
        },
        {
          type: "crystal",
          x: 184,
          y: 336,
          scale: 1.15
        },
        {
          type: "rock",
          x: 398,
          y: 294,
          scale: 1.05
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 218,
          y: 107
        },
        {
          sprite: 1,
          x: 350,
          y: 146
        },
        {
          sprite: 3,
          x: 450,
          y: 243
        },
        {
          sprite: 4,
          x: 286,
          y: 262
        },
        {
          sprite: 6,
          x: 111,
          y: 165
        },
        {
          sprite: 7,
          x: 297,
          y: 343
        }
      ],
      paths: [
        {
          points: [
            [
              88,
              152
            ],
            [
              200,
              152
            ],
            [
              200,
              212
            ],
            [
              376,
              212
            ],
            [
              376,
              274
            ],
            [
              496,
              274
            ]
          ],
          width: 18
        }
      ],
      patches: [
        {
          x: 82,
          y: 36,
          w: 132,
          h: 102,
          pattern: "dense"
        },
        {
          x: 404,
          y: 74,
          w: 96,
          h: 95,
          pattern: "dither"
        },
        {
          x: 98,
          y: 302,
          w: 232,
          h: 70,
          pattern: "dense"
        },
        {
          x: 40,
          y: 180,
          w: 72,
          h: 84,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 186,
          y: 172,
          kind: "currency"
        },
        {
          x: 317,
          y: 204,
          kind: "currency"
        },
        {
          x: 405,
          y: 250,
          kind: "currency"
        }
      ],
      id: "03-crystal-mesa-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 48,
          y: 192,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 0,
          y: 192,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 48,
          y: 240,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 0,
          y: 240,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 96,
          y: 240,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 96,
          y: 288,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 48,
          y: 288,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 32
        },
        {
          x: 96,
          y: 336,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "rooftop-terrace",
      name: "Rooftop Hangout",
      setting: "Urban rooftop",
      shape: "L terrace",
      summary: "A city roof with an open terrace, vents and planter boxes around an angular footprint.",
      geometry: {
        polygons: [
          [
            [
              0,
              0
            ],
            [
              576,
              0
            ],
            [
              576,
              144
            ],
            [
              240,
              144
            ],
            [
              240,
              384
            ],
            [
              0,
              384
            ]
          ]
        ],
        holes: [],
        depth: 22
      },
      props: [
        {
          type: "tank",
          x: 78,
          y: 52,
          scale: 1.1
        },
        {
          type: "vent",
          x: 316,
          y: 45,
          scale: 0.95
        },
        {
          type: "antenna",
          x: 510,
          y: 42,
          scale: 0.95
        },
        {
          type: "planter",
          x: 421,
          y: 100,
          scale: 0.95
        },
        {
          type: "planter",
          x: 42,
          y: 166,
          scale: 0.9
        },
        {
          type: "bench",
          x: 172,
          y: 222,
          scale: 0.95
        },
        {
          type: "vent",
          x: 55,
          y: 350,
          scale: 0.9
        },
        {
          type: "planter",
          x: 179,
          y: 350,
          scale: 0.95
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 180,
          y: 71
        },
        {
          sprite: 2,
          x: 315,
          y: 120
        },
        {
          sprite: 4,
          x: 500,
          y: 108
        },
        {
          sprite: 5,
          x: 162,
          y: 151
        },
        {
          sprite: 6,
          x: 25,
          y: 252
        },
        {
          sprite: 7,
          x: 196,
          y: 305
        }
      ],
      paths: [
        {
          points: [
            [
              112,
              32
            ],
            [
              112,
              110
            ],
            [
              544,
              110
            ]
          ],
          width: 16
        },
        {
          points: [
            [
              112,
              110
            ],
            [
              112,
              352
            ]
          ],
          width: 16
        }
      ],
      patches: [
        {
          x: 26,
          y: 24,
          w: 98,
          h: 66,
          pattern: "dense"
        },
        {
          x: 274,
          y: 24,
          w: 86,
          h: 48,
          pattern: "grid"
        },
        {
          x: 162,
          y: 227,
          w: 62,
          h: 74,
          pattern: "dither"
        },
        {
          x: 22,
          y: 286,
          w: 66,
          h: 67,
          pattern: "grid"
        },
        {
          x: 160,
          y: 328,
          w: 66,
          h: 40,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 271,
          y: 110,
          kind: "currency"
        },
        {
          x: 113,
          y: 220,
          kind: "currency"
        },
        {
          x: 112,
          y: 315,
          kind: "currency"
        }
      ],
      id: "04-rooftop-terrace-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "rooftop-terrace",
      name: "Rooftop Hangout / Loading",
      setting: "Urban rooftop",
      shape: "L terrace",
      summary: "A city roof with an open terrace, vents and planter boxes around an angular footprint. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              0,
              0
            ],
            [
              576,
              0
            ],
            [
              576,
              144
            ],
            [
              240,
              144
            ],
            [
              240,
              384
            ],
            [
              0,
              384
            ]
          ]
        ],
        holes: [],
        depth: 22
      },
      props: [
        {
          type: "tank",
          x: 78,
          y: 52,
          scale: 1.1
        },
        {
          type: "vent",
          x: 316,
          y: 45,
          scale: 0.95
        },
        {
          type: "planter",
          x: 421,
          y: 100,
          scale: 0.95
        },
        {
          type: "planter",
          x: 42,
          y: 166,
          scale: 0.9
        },
        {
          type: "bench",
          x: 172,
          y: 222,
          scale: 0.95
        },
        {
          type: "vent",
          x: 55,
          y: 350,
          scale: 0.9
        },
        {
          type: "planter",
          x: 179,
          y: 350,
          scale: 0.95
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 180,
          y: 71
        },
        {
          sprite: 2,
          x: 315,
          y: 120
        },
        {
          sprite: 5,
          x: 162,
          y: 151
        },
        {
          sprite: 6,
          x: 25,
          y: 252
        },
        {
          sprite: 7,
          x: 196,
          y: 305
        }
      ],
      paths: [
        {
          points: [
            [
              112,
              32
            ],
            [
              112,
              110
            ],
            [
              544,
              110
            ]
          ],
          width: 16
        },
        {
          points: [
            [
              112,
              110
            ],
            [
              112,
              352
            ]
          ],
          width: 16
        }
      ],
      patches: [
        {
          x: 26,
          y: 24,
          w: 98,
          h: 66,
          pattern: "dense"
        },
        {
          x: 274,
          y: 24,
          w: 86,
          h: 48,
          pattern: "grid"
        },
        {
          x: 162,
          y: 227,
          w: 62,
          h: 74,
          pattern: "dither"
        },
        {
          x: 22,
          y: 286,
          w: 66,
          h: 67,
          pattern: "grid"
        },
        {
          x: 160,
          y: 328,
          w: 66,
          h: 40,
          pattern: "dither"
        }
      ],
      signals: [
        {
          x: 271,
          y: 110,
          kind: "currency"
        },
        {
          x: 113,
          y: 220,
          kind: "currency"
        },
        {
          x: 112,
          y: 315,
          kind: "currency"
        }
      ],
      id: "04-rooftop-terrace-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 384,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 32
        },
        {
          x: 528,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 24
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        }
      ]
    },
    {
      family: "tidal-islands",
      name: "Tidal Islands",
      setting: "Archipelago water world",
      shape: "Fractured islands",
      summary: "Three distinct shore platforms with reed beds, wave marks and buoy signals.",
      geometry: {
        polygons: [
          [
            [
              48,
              48
            ],
            [
              144,
              8
            ],
            [
              208,
              24
            ],
            [
              256,
              80
            ],
            [
              248,
              168
            ],
            [
              192,
              216
            ],
            [
              80,
              208
            ],
            [
              16,
              160
            ],
            [
              0,
              96
            ]
          ],
          [
            [
              344,
              32
            ],
            [
              496,
              24
            ],
            [
              552,
              64
            ],
            [
              576,
              136
            ],
            [
              552,
              208
            ],
            [
              456,
              232
            ],
            [
              352,
              200
            ],
            [
              304,
              128
            ]
          ],
          [
            [
              176,
              280
            ],
            [
              248,
              240
            ],
            [
              320,
              264
            ],
            [
              384,
              328
            ],
            [
              352,
              376
            ],
            [
              240,
              384
            ],
            [
              144,
              360
            ],
            [
              112,
              312
            ]
          ]
        ],
        holes: [],
        depth: 20
      },
      props: [
        {
          type: "reeds",
          x: 53,
          y: 116,
          scale: 1.2
        },
        {
          type: "reeds",
          x: 198,
          y: 173,
          scale: 0.95
        },
        {
          type: "buoy",
          x: 181,
          y: 48,
          scale: 0.9
        },
        {
          type: "rock",
          x: 120,
          y: 63,
          scale: 0.85
        },
        {
          type: "reeds",
          x: 501,
          y: 163,
          scale: 1.1
        },
        {
          type: "buoy",
          x: 387,
          y: 75,
          scale: 1
        },
        {
          type: "rock",
          x: 514,
          y: 91,
          scale: 0.8
        },
        {
          type: "reeds",
          x: 178,
          y: 326,
          scale: 0.9
        },
        {
          type: "buoy",
          x: 352,
          y: 342,
          scale: 0.9
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 121,
          y: 145
        },
        {
          sprite: 2,
          x: 206,
          y: 104
        },
        {
          sprite: 4,
          x: 449,
          y: 90
        },
        {
          sprite: 1,
          x: 421,
          y: 176
        },
        {
          sprite: 5,
          x: 228,
          y: 318
        },
        {
          sprite: 7,
          x: 316,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              154
            ],
            [
              168,
              154
            ],
            [
              168,
              110
            ],
            [
              216,
              110
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              363,
              116
            ],
            [
              458,
              116
            ],
            [
              458,
              179
            ],
            [
              521,
              179
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              202,
              343
            ],
            [
              275,
              343
            ],
            [
              275,
              298
            ]
          ],
          width: 14
        }
      ],
      patches: [
        {
          x: 25,
          y: 82,
          w: 70,
          h: 56,
          pattern: "water"
        },
        {
          x: 133,
          y: 171,
          w: 87,
          h: 30,
          pattern: "dense"
        },
        {
          x: 358,
          y: 152,
          w: 162,
          h: 51,
          pattern: "water"
        },
        {
          x: 372,
          y: 43,
          w: 128,
          h: 38,
          pattern: "water"
        },
        {
          x: 154,
          y: 318,
          w: 172,
          h: 42,
          pattern: "water"
        }
      ],
      signals: [
        {
          x: 150,
          y: 176,
          kind: "currency"
        },
        {
          x: 485,
          y: 174,
          kind: "currency"
        },
        {
          x: 245,
          y: 369,
          kind: "currency"
        }
      ],
      id: "05-tidal-islands-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "tidal-islands",
      name: "Tidal Islands / Loading",
      setting: "Archipelago water world",
      shape: "Fractured islands",
      summary: "Three distinct shore platforms with reed beds, wave marks and buoy signals. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              48,
              48
            ],
            [
              144,
              8
            ],
            [
              208,
              24
            ],
            [
              256,
              80
            ],
            [
              248,
              168
            ],
            [
              192,
              216
            ],
            [
              80,
              208
            ],
            [
              16,
              160
            ],
            [
              0,
              96
            ]
          ],
          [
            [
              344,
              32
            ],
            [
              496,
              24
            ],
            [
              552,
              64
            ],
            [
              576,
              136
            ],
            [
              552,
              208
            ],
            [
              456,
              232
            ],
            [
              352,
              200
            ],
            [
              304,
              128
            ]
          ],
          [
            [
              176,
              280
            ],
            [
              248,
              240
            ],
            [
              320,
              264
            ],
            [
              384,
              328
            ],
            [
              352,
              376
            ],
            [
              240,
              384
            ],
            [
              144,
              360
            ],
            [
              112,
              312
            ]
          ]
        ],
        holes: [],
        depth: 20
      },
      props: [
        {
          type: "reeds",
          x: 53,
          y: 116,
          scale: 1.2
        },
        {
          type: "reeds",
          x: 198,
          y: 173,
          scale: 0.95
        },
        {
          type: "buoy",
          x: 181,
          y: 48,
          scale: 0.9
        },
        {
          type: "rock",
          x: 120,
          y: 63,
          scale: 0.85
        },
        {
          type: "buoy",
          x: 387,
          y: 75,
          scale: 1
        },
        {
          type: "reeds",
          x: 178,
          y: 326,
          scale: 0.9
        },
        {
          type: "buoy",
          x: 352,
          y: 342,
          scale: 0.9
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 121,
          y: 145
        },
        {
          sprite: 2,
          x: 206,
          y: 104
        },
        {
          sprite: 1,
          x: 421,
          y: 176
        },
        {
          sprite: 5,
          x: 228,
          y: 318
        },
        {
          sprite: 7,
          x: 316,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              154
            ],
            [
              168,
              154
            ],
            [
              168,
              110
            ],
            [
              216,
              110
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              363,
              116
            ],
            [
              458,
              116
            ],
            [
              458,
              179
            ],
            [
              521,
              179
            ]
          ],
          width: 14
        },
        {
          points: [
            [
              202,
              343
            ],
            [
              275,
              343
            ],
            [
              275,
              298
            ]
          ],
          width: 14
        }
      ],
      patches: [
        {
          x: 25,
          y: 82,
          w: 70,
          h: 56,
          pattern: "water"
        },
        {
          x: 133,
          y: 171,
          w: 87,
          h: 30,
          pattern: "dense"
        },
        {
          x: 358,
          y: 152,
          w: 162,
          h: 51,
          pattern: "water"
        },
        {
          x: 372,
          y: 43,
          w: 128,
          h: 38,
          pattern: "water"
        },
        {
          x: 154,
          y: 318,
          w: 172,
          h: 42,
          pattern: "water"
        }
      ],
      signals: [
        {
          x: 150,
          y: 176,
          kind: "currency"
        },
        {
          x: 245,
          y: 369,
          kind: "currency"
        }
      ],
      id: "05-tidal-islands-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 30
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 144,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 144,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 26
        }
      ]
    },
    {
      family: "orbital-hex",
      name: "Orbital Array",
      setting: "Orbital outpost",
      shape: "Hex cluster",
      summary: "Three hexagonal decks with dish antennas, solar panels and spare landing geometry.",
      geometry: {
        polygons: [
          [
            [
              20,
              112
            ],
            [
              80,
              32
            ],
            [
              200,
              32
            ],
            [
              260,
              112
            ],
            [
              200,
              192
            ],
            [
              80,
              192
            ]
          ],
          [
            [
              312,
              112
            ],
            [
              372,
              32
            ],
            [
              492,
              32
            ],
            [
              552,
              112
            ],
            [
              492,
              192
            ],
            [
              372,
              192
            ]
          ],
          [
            [
              166,
              300
            ],
            [
              226,
              220
            ],
            [
              346,
              220
            ],
            [
              406,
              300
            ],
            [
              346,
              380
            ],
            [
              226,
              380
            ]
          ]
        ],
        holes: [],
        depth: 26
      },
      props: [
        {
          type: "dish",
          x: 107,
          y: 67,
          scale: 1.2
        },
        {
          type: "terminal",
          x: 203,
          y: 120,
          scale: 0.8
        },
        {
          type: "solar",
          x: 394,
          y: 72,
          scale: 1.05
        },
        {
          type: "solar",
          x: 453,
          y: 92,
          scale: 1
        },
        {
          type: "antenna",
          x: 491,
          y: 148,
          scale: 1
        },
        {
          type: "crate",
          x: 319,
          y: 237,
          scale: 0.65
        },
        {
          type: "dish",
          x: 234,
          y: 247,
          scale: 0.65
        },
        {
          type: "terminal",
          x: 347,
          y: 310,
          scale: 0.75
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 88,
          y: 143
        },
        {
          sprite: 2,
          x: 224,
          y: 82
        },
        {
          sprite: 4,
          x: 393,
          y: 154
        },
        {
          sprite: 6,
          x: 487,
          y: 75
        },
        {
          sprite: 1,
          x: 215,
          y: 326
        },
        {
          sprite: 7,
          x: 306,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              128
            ],
            [
              146,
              128
            ],
            [
              146,
              157
            ],
            [
              203,
              157
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              353,
              128
            ],
            [
              419,
              128
            ],
            [
              419,
              162
            ],
            [
              494,
              162
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              215,
              323
            ],
            [
              281,
              323
            ],
            [
              281,
              351
            ],
            [
              348,
              351
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 59,
          y: 74,
          w: 105,
          h: 50,
          pattern: "grid"
        },
        {
          x: 360,
          y: 55,
          w: 137,
          h: 56,
          pattern: "dense"
        },
        {
          x: 220,
          y: 275,
          w: 120,
          h: 56,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 120,
          y: 146,
          kind: "node"
        },
        {
          x: 455,
          y: 155,
          kind: "node"
        },
        {
          x: 279,
          y: 367,
          kind: "currency"
        }
      ],
      id: "06-orbital-hex-complete",
      variant: "complete",
      missingChunks: []
    },
    {
      family: "orbital-hex",
      name: "Orbital Array / Loading",
      setting: "Orbital outpost",
      shape: "Hex cluster",
      summary: "Three hexagonal decks with dish antennas, solar panels and spare landing geometry. An unfinished outer section reveals missing, wireframe and suspended grid chunks.",
      geometry: {
        polygons: [
          [
            [
              20,
              112
            ],
            [
              80,
              32
            ],
            [
              200,
              32
            ],
            [
              260,
              112
            ],
            [
              200,
              192
            ],
            [
              80,
              192
            ]
          ],
          [
            [
              312,
              112
            ],
            [
              372,
              32
            ],
            [
              492,
              32
            ],
            [
              552,
              112
            ],
            [
              492,
              192
            ],
            [
              372,
              192
            ]
          ],
          [
            [
              166,
              300
            ],
            [
              226,
              220
            ],
            [
              346,
              220
            ],
            [
              406,
              300
            ],
            [
              346,
              380
            ],
            [
              226,
              380
            ]
          ]
        ],
        holes: [],
        depth: 26
      },
      props: [
        {
          type: "dish",
          x: 107,
          y: 67,
          scale: 1.2
        },
        {
          type: "terminal",
          x: 203,
          y: 120,
          scale: 0.8
        },
        {
          type: "solar",
          x: 394,
          y: 72,
          scale: 1.05
        },
        {
          type: "antenna",
          x: 491,
          y: 148,
          scale: 1
        },
        {
          type: "crate",
          x: 319,
          y: 237,
          scale: 0.65
        },
        {
          type: "dish",
          x: 234,
          y: 247,
          scale: 0.65
        },
        {
          type: "terminal",
          x: 347,
          y: 310,
          scale: 0.75
        }
      ],
      actors: [
        {
          sprite: 0,
          x: 88,
          y: 143
        },
        {
          sprite: 2,
          x: 224,
          y: 82
        },
        {
          sprite: 4,
          x: 393,
          y: 154
        },
        {
          sprite: 1,
          x: 215,
          y: 326
        },
        {
          sprite: 7,
          x: 306,
          y: 353
        }
      ],
      paths: [
        {
          points: [
            [
              72,
              128
            ],
            [
              146,
              128
            ],
            [
              146,
              157
            ],
            [
              203,
              157
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              353,
              128
            ],
            [
              419,
              128
            ],
            [
              419,
              162
            ],
            [
              494,
              162
            ]
          ],
          width: 10
        },
        {
          points: [
            [
              215,
              323
            ],
            [
              281,
              323
            ],
            [
              281,
              351
            ],
            [
              348,
              351
            ]
          ],
          width: 10
        }
      ],
      patches: [
        {
          x: 59,
          y: 74,
          w: 105,
          h: 50,
          pattern: "grid"
        },
        {
          x: 360,
          y: 55,
          w: 137,
          h: 56,
          pattern: "dense"
        },
        {
          x: 220,
          y: 275,
          w: 120,
          h: 56,
          pattern: "grid"
        }
      ],
      signals: [
        {
          x: 120,
          y: 146,
          kind: "node"
        },
        {
          x: 455,
          y: 155,
          kind: "node"
        },
        {
          x: 279,
          y: 367,
          kind: "currency"
        }
      ],
      id: "06-orbital-hex-loading",
      variant: "loading",
      missingChunks: [
        {
          x: 384,
          y: 0,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 432,
          y: 0,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 0,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 34
        },
        {
          x: 432,
          y: 48,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 480,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 528,
          y: 48,
          w: 48,
          h: 48,
          stage: "void",
          lift: 0
        },
        {
          x: 480,
          y: 96,
          w: 48,
          h: 48,
          stage: "wireframe",
          lift: 0
        },
        {
          x: 528,
          y: 96,
          w: 48,
          h: 48,
          stage: "floating",
          lift: 25
        }
      ]
    }
  ]
};

// src/friend-world.ts
var CANVAS = Object.freeze({ width: 1600, height: 1200 });
var PALETTE = Object.freeze({ white: "#FFFFFF", black: "#000000", accent: "#CCFF00" });
var GAME_PALETTE = Object.freeze({
  meadow: "#B9D984",
  pond: "#7DB4DB",
  sun: "#F2CE68",
  coral: "#ED927E",
  lilac: "#B3A0D8"
});
var PROJECTION = Object.freeze({ a: 0.8660254038, b: 0.28, scale: 1.5, width: 576, height: 384, cx: 800, cy: 690 });
var PROP_CANVAS = Object.freeze({ width: 240, height: 240, anchorX: 120, anchorY: 180 });
var PROP_TYPES = Object.freeze([
  "tree",
  "flower",
  "bench",
  "planter",
  "terminal",
  "crate",
  "pipe",
  "tank",
  "crystal",
  "rock",
  "vent",
  "antenna",
  "solar",
  "dish",
  "buoy",
  "reeds",
  "bridge",
  "circuit"
]);
var trustedWorlds = /* @__PURE__ */ new WeakSet();
var boundaryCache = /* @__PURE__ */ new WeakMap();
var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;"
})[character]);
function finite(value, label, min = -1e6, max = 1e6) {
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError(`${label} must be a finite number.`);
  if (value < min || value > max) throw new RangeError(`${label} must be between ${min} and ${max}.`);
}
function record(value, label) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new TypeError(`${label} must be an object.`);
  return value;
}
function text(value, label, max = 500) {
  if (typeof value !== "string" || !value.trim() || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
    throw new TypeError(`${label} must be nonempty text of at most ${max} characters.`);
  }
  return value;
}
function array(value, label, max = 128) {
  if (value === void 0) return [];
  if (!Array.isArray(value) || value.length > max) throw new TypeError(`${label} must be an array with at most ${max} entries.`);
  return value;
}
function choice(value, choices, label) {
  if (typeof value !== "string" || !choices.includes(value)) throw new TypeError(`Unsupported ${label}: ${String(value)}.`);
  return value;
}
function point(value, label, bounded = true) {
  if (!Array.isArray(value) || value.length !== 2) throw new TypeError(`${label} must be [x, y].`);
  finite(value[0], `${label}.x`, bounded ? 0 : -1e6, bounded ? PROJECTION.width : 1e6);
  finite(value[1], `${label}.y`, bounded ? 0 : -1e6, bounded ? PROJECTION.height : 1e6);
  return [value[0], value[1]];
}
function anchor(value, label) {
  const item = record(value, label);
  const [x, y] = point([item.x, item.y], label);
  return { x, y };
}
function rectangle(value, label, relative = false) {
  const item = record(value, label);
  finite(item.x, `${label}.x`, relative ? -576 : 0, 576);
  finite(item.y, `${label}.y`, relative ? -384 : 0, 384);
  finite(item.w, `${label}.w`, 1e-3, 576);
  finite(item.h, `${label}.h`, 1e-3, 384);
  if (!relative && (item.x + item.w > 576 || item.y + item.h > 384)) throw new RangeError(`${label} extends beyond the world coordinate grid.`);
  return { x: item.x, y: item.y, w: item.w, h: item.h };
}
function deepFreeze(value) {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
function polygonPoints(value, label) {
  const points = array(value, label).map((entry, index2) => point(entry, `${label}[${index2}]`));
  if (points.length < 3) throw new TypeError(`${label} needs at least three vertices.`);
  let twiceArea = 0;
  for (let index2 = 0; index2 < points.length; index2++) {
    const a = points[index2], b = points[(index2 + 1) % points.length];
    if (a[0] === b[0] && a[1] === b[1]) throw new TypeError(`${label} contains a zero-length edge.`);
    twiceArea += a[0] * b[1] - b[0] * a[1];
  }
  if (Math.abs(twiceArea) < 1e-3) throw new TypeError(`${label} must enclose an area.`);
  const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const onSegment = (a, b, p) => Math.abs(cross(a, b, p)) < 1e-8 && p[0] >= Math.min(a[0], b[0]) && p[0] <= Math.max(a[0], b[0]) && p[1] >= Math.min(a[1], b[1]) && p[1] <= Math.max(a[1], b[1]);
  for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
    if (j === i + 1 || i === 0 && j === points.length - 1) continue;
    const a = points[i], b = points[(i + 1) % points.length], c = points[j], d = points[(j + 1) % points.length];
    if (cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0 || onSegment(a, b, c) || onSegment(a, b, d) || onSegment(c, d, a) || onSegment(c, d, b)) {
      throw new TypeError(`${label} must be a simple polygon without crossing edges.`);
    }
  }
  return points;
}
function validateWorld(value) {
  if (value && typeof value === "object" && trustedWorlds.has(value)) return value;
  const source = record(value, "world"), geometry = record(source.geometry, "geometry");
  const polygons = array(geometry.polygons, "geometry.polygons", 16).map((entry, index2) => polygonPoints(entry, `polygons[${index2}]`));
  if (!polygons.length) throw new TypeError("World geometry needs a polygon.");
  const holes = array(geometry.holes, "geometry.holes", 16).map((entry, index2) => polygonPoints(entry, `holes[${index2}]`));
  if ([...polygons, ...holes].reduce((sum, loop) => sum + loop.length, 0) > 512) throw new RangeError("World geometry supports at most 512 vertices.");
  const depth = geometry.depth ?? 18;
  finite(depth, "geometry.depth", 1, 100);
  const props = array(source.props, "props").map((entry, index2) => {
    const item = record(entry, `props[${index2}]`);
    const type = choice(item.type, PROP_TYPES, "prop type");
    const scale = item.scale ?? 1;
    finite(scale, "prop.scale", 0.1, 4);
    return {
      ...anchor(item, `props[${index2}]`),
      type,
      scale,
      ...item.footprint === void 0 ? {} : { footprint: item.footprint === null ? null : rectangle(item.footprint, "prop.footprint", true) }
    };
  });
  const actors = array(source.actors, "actors").map((entry, index2) => {
    const item = record(entry, `actors[${index2}]`);
    if (item.sprite !== void 0) {
      finite(item.sprite, "actor.sprite", 0, 255);
      if (!Number.isInteger(item.sprite)) throw new TypeError("actor.sprite must be an integer index.");
    }
    return { ...anchor(item, `actors[${index2}]`), ...item.sprite === void 0 ? {} : { sprite: item.sprite } };
  });
  const signals = array(source.signals, "signals").map((entry, index2) => {
    const item = record(entry, `signals[${index2}]`);
    return { ...anchor(item, `signals[${index2}]`), kind: choice(item.kind, ["currency", "node"], "signal kind") };
  });
  const paths = array(source.paths, "paths", 64).map((entry, index2) => {
    const item = record(entry, `paths[${index2}]`);
    const points = array(item.points, "path.points").map((entry2, index3) => point(entry2, `path.points[${index3}]`));
    if (points.length < 2) throw new TypeError("A path needs at least two points.");
    const width = item.width ?? 20;
    finite(width, "path.width", 1, 96);
    return { points, width };
  });
  const patches = array(source.patches, "patches").map((entry, index2) => {
    const item = record(entry, `patches[${index2}]`);
    return { ...rectangle(item, `patches[${index2}]`), pattern: choice(item.pattern, ["dither", "dense", "grid", "hatch", "water"], "patch pattern") };
  });
  const missingChunks = array(source.missingChunks, "missingChunks", 64).map((entry, index2) => {
    const item = record(entry, `missingChunks[${index2}]`), rect = rectangle(item, `missingChunks[${index2}]`);
    if (rect.w !== 48 || rect.h !== 48 || rect.x % 48 !== 0 || rect.y % 48 !== 0) throw new RangeError("Missing chunks must use the 48 \xD7 48 world grid.");
    const stage = choice(item.stage, ["void", "wireframe", "floating"], "chunk stage"), lift = item.lift ?? (stage === "floating" ? 24 : 0);
    finite(lift, "chunk.lift", stage === "floating" ? 1 : 0, stage === "floating" ? 160 : 0);
    return { ...rect, stage, lift };
  });
  const collision = source.collision === void 0 ? void 0 : record(source.collision, "collision");
  const world2 = {
    id: text(source.id, "world.id", 100),
    name: text(source.name, "world.name", 120),
    family: text(source.family, "world.family", 100),
    setting: text(source.setting, "world.setting", 120),
    shape: text(source.shape, "world.shape", 120),
    summary: text(source.summary, "world.summary"),
    variant: choice(source.variant, ["complete", "loading"], "world variant"),
    geometry: { polygons, holes, depth },
    props,
    actors,
    signals,
    paths,
    patches,
    missingChunks,
    ...collision ? { collision: { blocked: array(collision.blocked, "collision.blocked").map((entry, index2) => rectangle(entry, `collision.blocked[${index2}]`)) } } : {}
  };
  if (world2.variant === "complete" && missingChunks.length) throw new TypeError("A complete world cannot contain missing chunks.");
  if (world2.variant === "loading" && !missingChunks.length) throw new TypeError("A loading world needs missing chunks.");
  for (const item of [...props, ...actors, ...signals]) {
    if (!containsLoaded(world2, [item.x, item.y])) throw new RangeError(`World anchor (${item.x}, ${item.y}) is outside loaded ground.`);
  }
  deepFreeze(world2);
  trustedWorlds.add(world2);
  return world2;
}
var n = (value) => Math.round(value * 1e3) / 1e3;
function project(x, y, lift = 0) {
  finite(x, "x");
  finite(y, "y");
  finite(lift, "lift");
  const { a, b, scale, width, height, cx, cy } = PROJECTION;
  return [n(cx + scale * a * (x - y - (width - height) / 2)), n(cy + scale * b * (x + y - (width + height) / 2) - lift)];
}
var pointList = (points) => points.map((p) => p.map(n).join(",")).join(" ");
var polygon = (points, attrs = "") => `<polygon points="${pointList(points)}" ${attrs}/>`;
var line = (points, attrs = "") => `<polyline points="${pointList(points)}" fill="none" ${attrs}/>`;
var planeMatrix = () => {
  const { a, b, scale, width, height, cx, cy } = PROJECTION;
  return `matrix(${scale * a} ${scale * b} ${-scale * a} ${scale * b} ${cx - scale * a * (width - height) / 2} ${cy - scale * b * (width + height) / 2})`;
};
var rectPoly = ({ x, y, w, h }) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
function inPolygon([x, y], points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i], [xj, yj] = points[j];
    if (yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function containsLoaded(world2, point2) {
  return world2.geometry.polygons.some((p) => inPolygon(point2, p)) && !(world2.geometry.holes || []).some((p) => inPolygon(point2, p)) && !(world2.missingChunks || []).some((r) => inPolygon(point2, rectPoly(r)));
}
function materialBoundary(world2) {
  const loops = [...world2.geometry.polygons, ...world2.geometry.holes || [], ...(world2.missingChunks || []).map(rectPoly)];
  const edges = loops.flatMap((p) => p.map((a, i) => [a, p[(i + 1) % p.length]]));
  const cross = (a, b) => a[0] * b[1] - a[1] * b[0], sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const result = [], seen = /* @__PURE__ */ new Set();
  for (const [a, b] of edges) {
    const v = sub(b, a), vv = v[0] * v[0] + v[1] * v[1], ts = [0, 1];
    if (vv < 1e-8) continue;
    for (const [c, d] of edges) {
      const w = sub(d, c), ca = sub(c, a), den = cross(v, w);
      if (Math.abs(den) > 1e-8) {
        const t = cross(ca, w) / den, u = cross(ca, v) / den;
        if (t > 1e-7 && t < 1 - 1e-7 && u >= -1e-7 && u <= 1 + 1e-7) ts.push(t);
      } else if (Math.abs(cross(ca, v)) < 1e-7) {
        for (const q of [c, d]) {
          const t = ((q[0] - a[0]) * v[0] + (q[1] - a[1]) * v[1]) / vv;
          if (t > 1e-7 && t < 1 - 1e-7) ts.push(t);
        }
      }
    }
    ts.sort((x, y) => x - y);
    for (let i = 1; i < ts.length; i++) {
      if (ts[i] - ts[i - 1] < 1e-7) continue;
      let p = [a[0] + v[0] * ts[i - 1], a[1] + v[1] * ts[i - 1]], q = [a[0] + v[0] * ts[i], a[1] + v[1] * ts[i]];
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], e = 0.04 / Math.sqrt(vv), normal = [-v[1] * e, v[0] * e];
      const left = containsLoaded(world2, [m[0] + normal[0], m[1] + normal[1]]), right = containsLoaded(world2, [m[0] - normal[0], m[1] - normal[1]]);
      if (left === right) continue;
      if (!left) [p, q] = [q, p];
      const key = [p, q].map((k) => k.map(n).join(",")).sort().join("|");
      if (!seen.has(key)) {
        seen.add(key);
        result.push([p, q]);
      }
    }
  }
  return result;
}
function definitions2(id, color = false) {
  const patterns = `<pattern id="${id}-dither" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${color ? GAME_PALETTE.sun : "#fff"}"/><rect width="1" height="1" fill="#000"/><rect x="2" y="2" width="1" height="1" fill="#000"/></pattern>
<pattern id="${id}-dense" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${color ? GAME_PALETTE.meadow : "#fff"}"/><path d="M0 0h2v2H0zM2 2h2v2H2z" fill="#000"/></pattern>
<pattern id="${id}-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M14 16h4M16 14v4" stroke="#000" stroke-width=".8"/></pattern>
<pattern id="${id}-hatch" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="${color ? GAME_PALETTE.coral : "#fff"}"/><path d="M-1 1l2-2M0 7L7 0M6 8l2-2" stroke="#000"/></pattern>
<pattern id="${id}-water" width="44" height="30" patternUnits="userSpaceOnUse"><rect width="44" height="30" fill="${color ? GAME_PALETTE.pond : "#000"}"/><path d="M3 6h18m9 14h11M5 23h7" stroke="#fff" stroke-width="2"/></pattern>`;
  if (!color) return patterns;
  return patterns + Object.entries(GAME_PALETTE).map(
    ([name, fill]) => `<pattern id="${id}-dither-${name}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${fill}"/><rect width="1" height="1" fill="#000"/><rect x="2" y="2" width="1" height="1" fill="#000"/></pattern><pattern id="${id}-dense-${name}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="${fill}"/><path d="M0 0h2v2H0zM2 2h2v2H2z" fill="#000"/></pattern>`
  ).join("");
}
function box(w, d, h, fill = "#fff", id = "") {
  const a = 0.8660254038, b = 0.28, pts = [[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2]].map(([x, y]) => [a * (x - y), b * (x + y)]);
  const top = pts.map(([x, y]) => [x, y - h]);
  return `<g stroke="#000" stroke-width="2" stroke-linejoin="miter">${polygon([top[1], top[2], pts[2], pts[1]], `fill="${id ? `url(#${id}-dither)` : "#fff"}"`)}${polygon([top[2], top[3], pts[3], pts[2]], 'fill="#000" stroke="#fff" stroke-width="1.5"')}${polygon(top, `fill="${fill}"`)}</g>`;
}
function tree(id) {
  return `<path d="M-5-15h10v20H-5z" fill="url(#${id}-dense)" stroke="#000" stroke-width="2"/><path d="M-28-19v-16h-8v-24h8v-16h16v-8h24v8h16v16h8v24h-8v16z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M-27-23h16v-8h8v-8h8v-8h24v12h-8v12H5v8h-24z" fill="url(#${id}-dense)"/><path d="M-18-62h8v-8h10M9-65h10v10M-26-47h8" fill="none" stroke="#000" stroke-width="3"/>`;
}
function flower() {
  return `<path d="M-2 0h4v-18h-4zM-2-6h-6v-4h6M2-3h6v-4H2" fill="#000"/><path d="M-6-22h12v8H-6zM-2-26h4v16h-4z" fill="#fff" stroke="#000" stroke-width="2"/><rect x="-2" y="-20" width="4" height="4" fill="#000"/>`;
}
function canonicalPropArtwork(type, id) {
  const dither = `url(#${id}-dither)`;
  switch (type) {
    case "tree":
      return tree(id);
    case "flower":
      return flower();
    case "bench":
      return `<path d="M-34-9v15m53-12v14M-28-38v28m53-7v-28" stroke="#000" stroke-width="5"/>${box(58, 18, 17, "#fff", id)}<path d="M-28-38l53 17v-11l-53-17z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M-23-40l43 14" stroke="#000"/>`;
    case "planter":
      return `${box(44, 30, 19, dither, id)}<g transform="translate(-10 -24) scale(.85)">${flower()}</g><path d="M8-23v-20m0 8l-10-9m10 4l10-13M-6-19v-26m0 9l-10-8m10 1l7-9" stroke="#000" stroke-width="3" fill="none"/><path d="M-16-42h8v7h-8M15-55h7v7h-7" fill="#fff" stroke="#000" stroke-width="2"/>`;
    case "terminal":
      return `${box(28, 26, 12, "#fff", id)}<path d="M-17-9v-56l33 10v55z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M16 0l11-5v-56l-11 6" fill="${dither}" stroke="#000" stroke-width="2"/><path d="M-11-54l21 6v22l-21-6z" fill="#000"/><path d="M-6-44l5 2m-5 5l12 4" stroke="#CCFF00" stroke-width="2"/><path d="M-10-22l18 5m-18 5l12 4" stroke="#000" stroke-width="3"/>`;
    case "crate":
      return `${box(31, 31, 30, dither, id)}<path d="M0 8v-30M-26-10l26 8 26-8M-23-26l22 7 21-7" stroke="#000" stroke-width="3"/><path d="M-15-4l7 3v5l-7-3" fill="#fff"/>`;
    case "pipe":
      return `<path d="M-30 0v-24h13v-24h36v34h12" stroke="#000" stroke-width="16" fill="none" stroke-linejoin="miter"/><path d="M-30 0v-24h13v-24h36v34h12" stroke="#fff" stroke-width="10" fill="none" stroke-linejoin="miter"/><path d="M-36-6h12M-23-29h12M1-55v14M12-23h14" stroke="#000" stroke-width="3"/><rect x="27" y="-22" width="7" height="15" fill="#fff" stroke="#000" stroke-width="2"/>`;
    case "tank":
      return `<path d="M-20-6v8m40-8v8" stroke="#000" stroke-width="5"/><path d="M-26-17v-42l8-11h32l12 11v42l-12 9h-32z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M7-68h8l11 10v41l-12 9H7z" fill="${dither}"/><path d="M-26-56l8 5h32l12-5m-52 29l8 5h32l12-5" fill="none" stroke="#000" stroke-width="3"/><path d="M-7-70v-11H7v11" fill="#fff" stroke="#000" stroke-width="2"/><rect x="-14" y="-43" width="12" height="9" fill="#000"/><rect x="-11" y="-40" width="6" height="3" fill="#CCFF00"/>`;
    case "crystal":
      return `<g stroke="#000" stroke-width="2" stroke-linejoin="miter"><path d="M-30-4l-9-26 6-21 17 13L-9-8z" fill="#fff"/><path d="M-33-49l8 22 16 19" fill="none"/><path d="M-14 2l-4-65L-2-94l19 22 3 61L3 8z" fill="#fff"/><path d="M-2-94l4 32 1 70 17-19-3-61z" fill="${dither}"/><path d="M-18-63L2-62l15-10" fill="none"/><path d="M17-4l6-35 17-15 7 24-17 31z" fill="#fff"/><path d="M40-54l-6 24-4 31" fill="none"/></g>`;
    case "rock":
      return `<path d="M-25-8l6-17 22-6 22 13 5 15L8 7l-26-5z" fill="${dither}" stroke="#000" stroke-width="2"/><path d="M-19-25l17 11 27-4M-2-14L8 7" stroke="#000" stroke-width="2" fill="none"/>`;
    case "vent":
      return `${box(47, 37, 29, "#fff", id)}<path d="M-18-35l29 9m-35-5l29 9m-35-5l29 9m-35-5l29 9" stroke="#000" stroke-width="3"/><path d="M24-7v-12m6 10v-12" stroke="#000" stroke-width="2"/>`;
    case "antenna":
      return `${box(30, 27, 10, dither, id)}<path d="M-12-8L0-96 14-7M-7-37h15M-10-18h22M-4-60h9M0-96v-17M-13-87h27M-8-99H8" stroke="#000" stroke-width="3" fill="none"/><path d="M-12-8L0-96 14-7" stroke="#fff" stroke-width="1" fill="none"/><rect x="-3" y="-117" width="6" height="6" fill="#CCFF00" stroke="#000" stroke-width="1.5"/>`;
    case "solar":
      return `<path d="M-19-17v23m40-11v14M-19-9L21 4" stroke="#000" stroke-width="4"/><path d="M-42-51L7-65 47-29-2-14z" fill="#000" stroke="#fff" stroke-width="2"/><path d="M-42-51L7-65 47-29-2-14zM-30-39l49-14M-16-27l49-14M-30-55L10-18M-18-58L22-22M-5-61l40 36" stroke="#fff" stroke-width="1.3" fill="none"/><path d="M-42-51L7-65 47-29-2-14z" fill="none" stroke="#000" stroke-width="2"/>`;
    case "dish":
      return `${box(40, 33, 12, "#fff", id)}<path d="M-9-7l8-40 12 6 7 39" fill="${dither}" stroke="#000" stroke-width="2"/><path d="M-39-77L25-44C7-16-24-20-39-77Z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M-39-77L25-44l-5 8-55-29z" fill="${dither}" stroke="#000" stroke-width="2"/><path d="M-16-52L5-84M-30-67L5-84 14-49" fill="none" stroke="#fff" stroke-width="4"/><path d="M-16-52L5-84M-30-67L5-84 14-49" fill="none" stroke="#000" stroke-width="2"/><rect x="2" y="-88" width="7" height="6" fill="#CCFF00" stroke="#000" stroke-width="2"/>`;
    case "buoy":
      return `<path d="M-21-1l12-8H9l12 8L8 6H-8z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M-10-3l5-30H5l5 30z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M-7-15H7" stroke="#000" stroke-width="7"/><path d="M0-33v-19h14v10H0" fill="#CCFF00" stroke="#000" stroke-width="2"/>`;
    case "reeds":
      return `<path d="M-13 1v-39M-1 2v-51M11 0v-32M-13-7l-11-11M-1-12L8-25M11-7l12-12" stroke="#fff" stroke-width="4.5" fill="none"/><path d="M-13 1v-39M-1 2v-51M11 0v-32M-13-7l-11-11M-1-12L8-25M11-7l12-12" stroke="#000" stroke-width="2.5" fill="none"/><path d="M-16-44h6v13h-6zM-4-56h6v14h-6zM8-38h6v12H8z" fill="#fff" stroke="#000" stroke-width="2"/>`;
    case "bridge":
      return `${box(86, 26, 10, "#fff", id)}<path d="M-42-18l76 24M-29-30l76 24" stroke="#000" stroke-width="3"/><path d="M-42-18v-15m25 23v-15m25 23v-15m26 23v-15" stroke="#000" stroke-width="3"/>`;
    case "circuit":
      return `<path d="M-40-12h25v-20h32v21h24M-28 4h24v-20h20" stroke="#000" stroke-width="3" fill="none"/><rect x="-4" y="-39" width="17" height="13" fill="#000"/><rect x="0" y="-35" width="9" height="5" fill="#CCFF00"/>`;
    default:
      throw new Error(`Unsupported prop type: ${type}`);
  }
}
var PROP_COLORS = Object.freeze({
  tree: "meadow",
  flower: "coral",
  bench: "sun",
  planter: "coral",
  terminal: "lilac",
  crate: "sun",
  pipe: "pond",
  tank: "pond",
  crystal: "lilac",
  rock: "lilac",
  vent: "coral",
  antenna: "lilac",
  solar: "pond",
  dish: "lilac",
  buoy: "coral",
  reeds: "sun",
  bridge: "sun",
  circuit: "lilac"
});
function paintedPropArtwork(type, id, color) {
  const artwork = canonicalPropArtwork(type, id);
  if (!color) return artwork;
  const name = PROP_COLORS[type], fill = GAME_PALETTE[name];
  let painted = artwork.split('fill="#fff"').join(`fill="${fill}"`).split(`#${id}-dither)`).join(`#${id}-dither-${name})`).split(`#${id}-dense)`).join(`#${id}-dense-${name})`).split("#CCFF00").join(GAME_PALETTE.sun);
  if (type === "solar") painted = painted.replace('fill="#000"', `fill="${fill}"`);
  return painted;
}
function signalArtwork(signal, color = false) {
  const [x, y] = project(signal.x, signal.y);
  const accent = color ? GAME_PALETTE.sun : "#CCFF00";
  if (signal.kind === "node") return `<g transform="translate(${x} ${y})"><path d="M-6 0l6-3 6 3-6 3z" fill="${accent}" stroke="#000" stroke-width="1.5"/><path d="M0-3v-10" stroke="#000" stroke-width="2"/><rect x="-3" y="-16" width="6" height="6" fill="${accent}" stroke="#000" stroke-width="1.5"/></g>`;
  return `<g transform="translate(${n(x - 12)} ${n(y - 2)})"><path d="M250 500L250 625L375 625L375 750L500 750L500 625L625 625L625 500ZM250 -125L250 0L125 0L125 125L500 125L500 250L250 250L250 375L125 375L125 500L250 500L250 375L500 375L500 250L625 250L625 125L500 125L500 0L375 0L375 -125Z" transform="scale(.032 -.032)" fill="${accent}" stroke="#000" stroke-width="62.5" paint-order="stroke"/></g>`;
}
function chunkArtwork(chunk, index2, id, color = false) {
  const base = rectPoly(chunk).map(([x, y]) => project(x, y));
  const accent = color ? GAME_PALETTE.lilac : "#CCFF00";
  if (chunk.stage === "void") {
    return `<g data-chunk="${index2}" data-stage="void" stroke="${accent}" stroke-width="1.5">${base.map(([x, y]) => `<path d="M${n(x - 3)} ${y}h6M${x} ${n(y - 3)}v6"/>`).join("")}</g>`;
  }
  const lift = chunk.stage === "floating" ? chunk.lift || 24 : 0;
  const top = base.map(([x, y]) => [x, y - lift]);
  let s = `<g data-chunk="${index2}" data-stage="${esc(chunk.stage)}">`;
  if (lift) {
    s += line([...base, base[0]], `stroke="${accent}" stroke-width="1.1" stroke-dasharray="4 7"`);
    for (let i = 0; i < 4; i++) s += line([base[i], top[i]], `stroke="${accent}" stroke-width="1" stroke-dasharray="3 5"`);
    s += polygon([top[1], top[2], [top[2][0], top[2][1] + 6], [top[1][0], top[1][1] + 6]], 'fill="#000" stroke="#fff" stroke-width="1"');
    s += polygon([top[2], top[3], [top[3][0], top[3][1] + 6], [top[2][0], top[2][1] + 6]], 'fill="#000" stroke="#fff" stroke-width="1"');
    s += polygon(top, `fill="url(#${id}-dither)" stroke="#fff" stroke-width="1.2"`);
    s += top.map(([x, y]) => `<path d="M${n(x - 3)} ${n(y - 1)}h6" stroke="${accent}" stroke-width="2"/>`).join("");
  } else {
    s += line([...top, top[0]], `stroke="${accent}" stroke-width="1.5"`);
    s += line([top[0], top[2]], `stroke="${accent}" stroke-width=".9" stroke-dasharray="2 5"`);
    s += line([top[1], top[3]], `stroke="${accent}" stroke-width=".9" stroke-dasharray="2 5"`);
  }
  return s + "</g>";
}
function unproject(screenX, screenY, lift = 0) {
  finite(screenX, "screenX");
  finite(screenY, "screenY");
  finite(lift, "lift");
  const difference = (screenX - PROJECTION.cx) / (PROJECTION.scale * PROJECTION.a) + (PROJECTION.width - PROJECTION.height) / 2;
  const sum = (screenY + lift - PROJECTION.cy) / (PROJECTION.scale * PROJECTION.b) + (PROJECTION.width + PROJECTION.height) / 2;
  return [(sum + difference) / 2, (sum - difference) / 2];
}
var PROP_FOOTPRINTS = deepFreeze({
  tree: { w: 12, h: 12 },
  flower: null,
  bench: { w: 58, h: 18 },
  planter: { w: 44, h: 30 },
  terminal: { w: 28, h: 26 },
  crate: { w: 31, h: 31 },
  pipe: { w: 60, h: 26 },
  tank: { w: 52, h: 40 },
  crystal: { w: 60, h: 26 },
  rock: { w: 50, h: 32 },
  vent: { w: 47, h: 37 },
  antenna: { w: 30, h: 27 },
  solar: { w: 76, h: 36 },
  dish: { w: 40, h: 33 },
  buoy: { w: 30, h: 20 },
  reeds: null,
  bridge: null,
  circuit: null
});
function boundaryOf(world2) {
  let boundary = boundaryCache.get(world2);
  if (!boundary) {
    boundary = materialBoundary(world2);
    boundaryCache.set(world2, boundary);
  }
  return boundary;
}
function distanceToSegment([x, y], a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy);
}
function circleIntersectsRect([x, y], radius, rect) {
  const nearX = Math.max(rect.x, Math.min(rect.x + rect.w, x));
  const nearY = Math.max(rect.y, Math.min(rect.y + rect.h, y));
  return Math.hypot(x - nearX, y - nearY) <= radius;
}
function isWorldWalkable(world2, location, radius = 0) {
  const config = validateWorld(world2), position = point(location, "location", false);
  finite(radius, "radius", 0, 48);
  if (!containsLoaded(config, position)) return false;
  if (radius && boundaryOf(config).some(([a, b]) => distanceToSegment(position, a, b) < radius)) return false;
  const blocked = [...config.collision?.blocked ?? [], ...config.patches.filter((patch) => patch.pattern === "water")];
  for (const prop of config.props) {
    const size4 = PROP_FOOTPRINTS[prop.type];
    const scale = prop.scale ?? 1;
    const relative = prop.footprint === void 0 ? size4 && {
      x: -size4.w * 1.4 / PROJECTION.scale / 2,
      y: -size4.h * 1.4 / PROJECTION.scale / 2,
      w: size4.w * 1.4 / PROJECTION.scale,
      h: size4.h * 1.4 / PROJECTION.scale
    } : prop.footprint;
    if (relative) blocked.push({ x: prop.x + relative.x * scale, y: prop.y + relative.y * scale, w: relative.w * scale, h: relative.h * scale });
  }
  return !blocked.some((rect) => circleIntersectsRect(position, radius, rect));
}
function sortWorldItems(items) {
  for (const item of items) {
    finite(item.x, "item.x");
    finite(item.y, "item.y");
  }
  return [...items].sort((a, b) => a.x + a.y - (b.x + b.y));
}
function renderOptions(options) {
  record(options, "render options");
  if (options.signals !== void 0 && typeof options.signals !== "boolean") throw new TypeError("signals must be a boolean.");
  const color = colorOption(options);
  const background = options.background ?? "transparent";
  choice(background, ["transparent", "black"], "background");
  return { signals: options.signals !== false, background, color };
}
function colorOption(options) {
  record(options, "render options");
  if (options.color !== void 0 && typeof options.color !== "boolean") throw new TypeError("color must be a boolean.");
  return options.color === true;
}
var projectPoint = ([x, y]) => project(x, y);
function terrainParts(world2, color = false) {
  const id = `rf-${world2.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const boundary = boundaryOf(world2), depth = world2.geometry.depth;
  const screenPolys = world2.geometry.polygons.map((p) => p.map(projectPoint));
  const holes = [...world2.geometry.holes, ...world2.missingChunks.map(rectPoly)].map((p) => p.map(projectPoint));
  const mask = `<mask id="${id}-surface" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="1200"><rect width="1600" height="1200" fill="#000"/>${screenPolys.map((p) => polygon(p, 'fill="#fff"')).join("")}${holes.map((p) => polygon(p, 'fill="#000"')).join("")}</mask>`;
  let body = `<g id="${id}-terrain" class="world-terrain">`;
  const visible = boundary.map(([a, b]) => [projectPoint(a), projectPoint(b)]).filter(([a, b]) => b[0] < a[0] - 1e-3).sort((a, b) => a[0][1] + a[1][1] - (b[0][1] + b[1][1]));
  for (const [a, b] of visible) {
    body += polygon([a, b, [b[0], b[1] + depth], [a[0], a[1] + depth]], `fill="${color ? GAME_PALETTE.coral : "#000"}" stroke="${color ? "#000" : "#fff"}" stroke-width="1.5" stroke-linejoin="miter"`);
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let j = 24; j < length - 10; j += 55) {
      const t = j / length, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
      body += `<path d="M${n(x)} ${n(y + depth - 5)}v4" stroke="#fff" stroke-width="1"/>`;
    }
  }
  body += `<g mask="url(#${id}-surface)"><rect width="1600" height="1200" fill="${color ? GAME_PALETTE.meadow : "#fff"}"/><g transform="${planeMatrix()}"><rect x="-100" y="-100" width="800" height="650" fill="url(#${id}-grid)"/>`;
  for (const patch of world2.patches) body += `<rect x="${patch.x}" y="${patch.y}" width="${patch.w}" height="${patch.h}" fill="url(#${id}-${patch.pattern})" stroke="#000" stroke-width="1"/>`;
  for (const path of world2.paths) {
    body += line(path.points, `stroke="#000" stroke-width="${path.width + 2}" stroke-linejoin="miter"`);
    body += line(path.points, `stroke="url(#${id}-dither)" stroke-width="${path.width}" stroke-linejoin="miter"`);
  }
  body += "</g></g>";
  for (const edge of boundary) body += line(edge.map(projectPoint), 'stroke="#000" stroke-width="2"');
  body += `</g><g class="world-loading">${world2.missingChunks.map((chunk, index2) => chunkArtwork(chunk, index2, id, color)).join("")}</g>`;
  return { id, defs: definitions2(id, color) + mask, body };
}
function svgDocument(world2, id, defs, body, background = "transparent") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200" role="img" aria-labelledby="${id}-title ${id}-desc" data-world-id="${esc(world2.id)}" data-variant="${world2.variant}"><title id="${id}-title">${esc(world2.name)}</title><desc id="${id}-desc">${esc(world2.summary)}. Rare Friends shallow isometric world. Character pixels, when present, are supplied by the caller.</desc><defs>${defs}</defs>${background === "black" ? '<rect width="1600" height="1200" fill="#000"/>' : ""}${body}</svg>
`;
}
function objectParts(world2, id, signals, color = false) {
  return sortWorldItems([
    ...world2.props.map((prop) => {
      const [x, y] = project(prop.x, prop.y);
      return {
        kind: "prop",
        x: prop.x,
        y: prop.y,
        depth: prop.x + prop.y,
        body: `<g class="world-prop" data-prop="${prop.type}" transform="translate(${x} ${y}) scale(${n((prop.scale ?? 1) * 1.4)})">${paintedPropArtwork(prop.type, id, color)}</g>`
      };
    }),
    ...signals ? world2.signals.map((signal) => ({
      kind: "signal",
      x: signal.x,
      y: signal.y,
      depth: signal.x + signal.y,
      body: signalArtwork(signal, color)
    })) : []
  ]);
}
function renderWorldLayers(world2, options = {}) {
  const config = validateWorld(world2), settings = renderOptions(options);
  const terrain = terrainParts(config, settings.color);
  return Object.freeze({
    width: CANVAS.width,
    height: CANVAS.height,
    terrainSvg: svgDocument(config, terrain.id, terrain.defs, terrain.body, settings.background),
    objects: Object.freeze(objectParts(config, terrain.id, settings.signals, settings.color).map(({ body, ...item }) => Object.freeze({
      ...item,
      svg: svgDocument(config, terrain.id, definitions2(terrain.id, settings.color), body)
    })))
  });
}
var WORLD_PRESETS = Object.freeze(friend_worlds_default.worlds.map(validateWorld));
function getWorldPreset(id) {
  const world2 = WORLD_PRESETS.find((candidate) => candidate.id === id);
  if (!world2) throw new RangeError(`Unknown world preset: ${id}.`);
  return world2;
}

// src/assets.ts
function loadImage(source, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const image = new Image();
    const clear = () => {
      image.onload = null;
      image.onerror = null;
      signal?.removeEventListener("abort", abort);
    };
    const abort = () => {
      clear();
      image.src = "";
      reject(signal?.reason);
    };
    image.onload = () => {
      clear();
      resolve(image);
    };
    image.onerror = () => {
      clear();
      reject(new Error("The image could not load."));
    };
    signal?.addEventListener("abort", abort, { once: true });
    image.src = source;
  });
}
function loadSvg(svg, signal) {
  return loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, signal);
}
async function loadWorldAssets(world2, options = {}, signal) {
  const layers = renderWorldLayers(world2, options);
  const [terrain, objects] = await Promise.all([
    loadSvg(layers.terrainSvg, signal),
    Promise.all(layers.objects.map(async ({ svg, ...object }) => ({ ...object, image: await loadSvg(svg, signal) })))
  ]);
  return { width: layers.width, height: layers.height, terrain, objects };
}

// src/friend-navigation.ts
function createWorldNavigator(world2, radius = 7, spacing = 8) {
  if (!Number.isFinite(radius) || radius < 0 || !Number.isFinite(spacing) || spacing < 2 || spacing > 32) {
    throw new RangeError("Navigation needs a nonnegative radius and a grid spacing from 2 to 32.");
  }
  const columns = Math.floor(576 / spacing) + 1;
  const rows = Math.floor(384 / spacing) + 1;
  const count = columns * rows;
  const valid = new Uint8Array(count);
  const location = (index2) => [index2 % columns * spacing, Math.floor(index2 / columns) * spacing];
  const finite2 = (point2) => point2.every(Number.isFinite);
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  for (let index2 = 0; index2 < count; index2++) valid[index2] = Number(isWorldWalkable(world2, location(index2), radius));
  function segmentClear(from, to) {
    if (!finite2(from) || !finite2(to)) return false;
    const length = distance(from, to);
    if (length > 1200) return false;
    const steps = Math.max(1, Math.ceil(length / 2));
    for (let index2 = 0; index2 <= steps; index2++) {
      const t = index2 / steps;
      if (!isWorldWalkable(world2, [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t], radius)) return false;
    }
    return true;
  }
  function nearby(point2) {
    const centerX = Math.round(point2[0] / spacing), centerY = Math.round(point2[1] / spacing);
    const result = [];
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
      const x = centerX + dx, y = centerY + dy;
      if (x < 0 || y < 0 || x >= columns || y >= rows) continue;
      const index2 = y * columns + x;
      if (valid[index2] && segmentClear(point2, location(index2))) result.push(index2);
    }
    return result;
  }
  function route(from, to) {
    if (!finite2(from) || !finite2(to) || !isWorldWalkable(world2, from, radius) || !isWorldWalkable(world2, to, radius)) return null;
    if (segmentClear(from, to)) return [[to[0], to[1]]];
    const starts = nearby(from), ends = new Set(nearby(to));
    if (!starts.length || !ends.size) return null;
    const parents = new Int32Array(count).fill(-1);
    const costs = new Float64Array(count).fill(Infinity);
    const closed = new Uint8Array(count);
    const open = new Set(starts);
    for (const index2 of starts) costs[index2] = distance(from, location(index2));
    let reached = -1;
    while (open.size) {
      let current = -1, best = Infinity;
      for (const candidate of open) {
        const score = costs[candidate] + distance(location(candidate), to);
        if (score < best) {
          current = candidate;
          best = score;
        }
      }
      if (current < 0) break;
      if (ends.has(current)) {
        reached = current;
        break;
      }
      open.delete(current);
      closed[current] = 1;
      const x = current % columns, y = Math.floor(current / columns);
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy || x + dx < 0 || x + dx >= columns || y + dy < 0 || y + dy >= rows) continue;
        const neighbor = (y + dy) * columns + x + dx;
        if (!valid[neighbor] || closed[neighbor]) continue;
        const nextCost = costs[current] + spacing * Math.hypot(dx, dy);
        if (nextCost >= costs[neighbor] || !segmentClear(location(current), location(neighbor))) continue;
        costs[neighbor] = nextCost;
        parents[neighbor] = current;
        open.add(neighbor);
      }
    }
    if (reached < 0) return null;
    const path = [[to[0], to[1]]];
    for (let index2 = reached; index2 !== -1; index2 = parents[index2]) path.unshift(location(index2));
    const simplified = [];
    let anchor2 = from;
    for (let index2 = 0; index2 < path.length; ) {
      let last = path.length - 1;
      while (last > index2 && !segmentClear(anchor2, path[last])) last--;
      simplified.push(path[last]);
      anchor2 = path[last];
      index2 = last + 1;
    }
    return simplified;
  }
  return { route, segmentClear };
}

// src/movement.ts
var directions = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right"
};
var vectors = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
function createWorldMovement(world2, spawn, options = {}) {
  const speed = options.speed ?? 170, radius = options.radius ?? 7;
  if (!Number.isFinite(speed) || speed <= 0) throw new RangeError("Movement speed must be positive.");
  const navigation = createWorldNavigator(world2, radius);
  if (!isWorldWalkable(world2, spawn, radius)) throw new RangeError("Spawn must be walkable.");
  let position = [...spawn], facing = "down", walking = false;
  let route = [];
  const held = /* @__PURE__ */ new Map();
  const state = () => ({
    position: [...position],
    facing,
    walking,
    destination: route.length ? [...route[route.length - 1]] : null
  });
  const stop = () => {
    held.clear();
    route = [];
    walking = false;
  };
  return {
    get state() {
      return state();
    },
    /** Returns whether a key is handled. Clear held keys with stop() on blur/pause. */
    setKey(key, pressed) {
      const normalized = key.length === 1 ? key.toLowerCase() : key;
      const direction = directions[normalized];
      if (!direction) return false;
      if (pressed) {
        route = [];
        held.set(normalized, direction);
      } else held.delete(normalized);
      return true;
    },
    moveTo(point2) {
      const path = navigation.route(position, point2);
      if (!path) return false;
      stop();
      route = path;
      return true;
    },
    stop,
    reset() {
      stop();
      position = [...spawn];
      facing = "down";
    },
    /** Delta is milliseconds; a suspended tab advances by at most 40 ms. */
    update(deltaMs) {
      if (!Number.isFinite(deltaMs) || deltaMs < 0) throw new RangeError("Frame delta must be nonnegative.");
      walking = false;
      const [sx, sy] = project(...position);
      let dx = 0, dy = 0, step = Math.min(40, deltaMs) * speed / 1e3;
      const inputs = [...new Set(held.values())];
      if (inputs.length) {
        for (const direction of inputs) {
          dx += vectors[direction][0];
          dy += vectors[direction][1];
        }
        const magnitude = Math.hypot(dx, dy);
        if (magnitude) {
          dx /= magnitude;
          dy /= magnitude;
          facing = [...inputs].reverse().find((direction) => vectors[direction][0] * dx + vectors[direction][1] * dy > 0);
        }
      } else if (route.length) {
        while (route.length && Math.hypot(route[0][0] - position[0], route[0][1] - position[1]) < 1e-3) position = route.shift();
        if (route.length) {
          const [tx, ty] = project(...route[0]);
          const distance = Math.hypot(tx - sx, ty - sy);
          dx = (tx - sx) / distance;
          dy = (ty - sy) / distance;
          step = Math.min(step, distance);
          facing = Math.abs(dx) > Math.abs(dy) ? dx < 0 ? "left" : "right" : dy < 0 ? "up" : "down";
        }
      }
      if (step > 0 && (dx || dy)) {
        const next = unproject(sx + dx * step, sy + dy * step);
        if (navigation.segmentClear(position, next)) {
          position = next;
          walking = true;
        } else if (route.length) stop();
        else if (dx && dy) {
          const slide = [unproject(sx + dx * step, sy), unproject(sx, sy + dy * step)].find((point2) => navigation.segmentClear(position, point2));
          if (slide) {
            position = slide;
            walking = true;
          }
        }
        if (route.length && Math.hypot(route[0][0] - position[0], route[0][1] - position[1]) < 1e-3) {
          position = route.shift();
        }
      }
      return state();
    }
  };
}

// node_modules/viem/_esm/index.js
init_exports();

// node_modules/viem/_esm/utils/getAction.js
function getAction(client, actionFn, name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === "function")
    return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === "function")
    return action_explicit;
  return (params) => actionFn(client, params);
}

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_abi();

// node_modules/viem/_esm/errors/log.js
init_base();
var FilterTypeNotSupportedError = class extends BaseError2 {
  constructor(type) {
    super(`Filter type "${type}" is not supported.`, {
      name: "FilterTypeNotSupportedError"
    });
  }
};

// node_modules/viem/_esm/utils/abi/encodeEventTopics.js
init_toBytes();
init_keccak256();
init_toEventSelector();
init_encodeAbiParameters();
init_formatAbiItem2();
init_getAbiItem();
var docsPath = "/docs/contract/encodeEventTopics";
function encodeEventTopics(parameters) {
  const { abi, eventName, args } = parameters;
  let abiItem = abi[0];
  if (eventName) {
    const item = getAbiItem({ abi, name: eventName });
    if (!item)
      throw new AbiEventNotFoundError(eventName, { docsPath });
    abiItem = item;
  }
  if (abiItem.type !== "event")
    throw new AbiEventNotFoundError(void 0, { docsPath });
  let topics = [];
  if (args && "inputs" in abiItem) {
    const indexedInputs = abiItem.inputs?.filter((param) => "indexed" in param && param.indexed);
    const args_ = Array.isArray(args) ? args : Object.values(args).length > 0 ? indexedInputs?.map((x) => args[x.name]) ?? [] : [];
    if (args_.length > 0) {
      topics = indexedInputs?.map((param, i) => {
        if (Array.isArray(args_[i]))
          return args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }));
        return typeof args_[i] !== "undefined" && args_[i] !== null ? encodeArg({ param, value: args_[i] }) : null;
      }) ?? [];
    }
  }
  if (abiItem.anonymous)
    return topics;
  const definition = formatAbiItem2(abiItem);
  const signature = toEventSelector(definition);
  return [signature, ...topics];
}
function encodeArg({ param, value }) {
  if (param.type === "string" || param.type === "bytes")
    return keccak256(toBytes(value));
  if (param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    throw new FilterTypeNotSupportedError(param.type);
  return encodeAbiParameters([param], [value]);
}

// node_modules/viem/_esm/utils/errors/getContractError.js
init_abi();
init_base();
init_contract();
init_request();
init_rpc();
var EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, { abi, address, args, docsPath: docsPath8, functionName, sender }) {
  const error = err instanceof RawContractError ? err : err instanceof BaseError2 ? err.walk((err2) => "data" in err2) || err.walk() : {};
  const { code, data, details, message, shortMessage } = error;
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError)
      return new ContractFunctionZeroDataError({ functionName, cause: err });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || details || message || shortMessage) || code === InvalidInputRpcError.code && details === "execution reverted" && data) {
      return new ContractFunctionRevertedError({
        abi,
        data: typeof data === "object" ? data.data : data,
        functionName,
        message: error instanceof RpcRequestError ? details : shortMessage ?? message,
        cause: err
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi,
    args,
    contractAddress: address,
    docsPath: docsPath8,
    functionName,
    sender
  });
}

// node_modules/viem/_esm/actions/public/getChainId.js
init_fromHex();
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: "eth_chainId"
  }, { dedupe: true });
  return hexToNumber(chainIdHex);
}

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_isAddressEqual();
init_toBytes();

// node_modules/viem/_esm/utils/formatters/log.js
function formatLog(log, { args, eventName } = {}) {
  return {
    ...log,
    blockHash: log.blockHash ? log.blockHash : null,
    blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
    blockTimestamp: log.blockTimestamp ? BigInt(log.blockTimestamp) : log.blockTimestamp === null ? null : void 0,
    logIndex: log.logIndex ? Number(log.logIndex) : null,
    transactionHash: log.transactionHash ? log.transactionHash : null,
    transactionIndex: log.transactionIndex ? Number(log.transactionIndex) : null,
    ...eventName ? { args, eventName } : {}
  };
}

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
init_keccak256();
init_toEventSelector();

// node_modules/viem/_esm/utils/abi/decodeEventLog.js
init_abi();
init_cursor();
init_size();
init_toEventSelector();
init_decodeAbiParameters();
init_formatAbiItem2();
var docsPath3 = "/docs/contract/decodeEventLog";
function decodeEventLog(parameters) {
  const { abi, data, strict: strict_, topics } = parameters;
  const strict = strict_ ?? true;
  const [signature, ...argTopics] = topics;
  if (!signature)
    throw new AbiEventSignatureEmptyTopicsError({ docsPath: docsPath3 });
  const abiItem = abi.find((x) => x.type === "event" && signature === toEventSelector(formatAbiItem2(x)));
  if (!(abiItem && "name" in abiItem) || abiItem.type !== "event")
    throw new AbiEventSignatureNotFoundError(signature, { docsPath: docsPath3 });
  const { name, inputs } = abiItem;
  const isUnnamed = inputs?.some((x) => !("name" in x && x.name));
  const args = isUnnamed ? [] : {};
  const indexedInputs = inputs.map((x, i) => [x, i]).filter(([x]) => "indexed" in x && x.indexed);
  const missingIndexedInputs = [];
  for (let i = 0; i < indexedInputs.length; i++) {
    const [param, argIndex] = indexedInputs[i];
    const topic = argTopics[i];
    if (!topic) {
      if (strict)
        throw new DecodeLogTopicsMismatch({
          abiItem,
          param
        });
      missingIndexedInputs.push([param, argIndex]);
      continue;
    }
    args[isUnnamed ? argIndex : param.name || argIndex] = decodeTopic({
      param,
      value: topic
    });
  }
  const nonIndexedInputs = inputs.filter((x) => !("indexed" in x && x.indexed));
  const inputsToDecode = strict ? nonIndexedInputs : [...missingIndexedInputs.map(([param]) => param), ...nonIndexedInputs];
  if (inputsToDecode.length > 0) {
    if (data && data !== "0x") {
      try {
        const decodedData = decodeAbiParameters(inputsToDecode, data);
        if (decodedData) {
          let dataIndex = 0;
          if (!strict) {
            for (const [param, argIndex] of missingIndexedInputs) {
              args[isUnnamed ? argIndex : param.name || argIndex] = decodedData[dataIndex++];
            }
          }
          if (isUnnamed) {
            for (let i = 0; i < inputs.length; i++)
              if (args[i] === void 0 && dataIndex < decodedData.length)
                args[i] = decodedData[dataIndex++];
          } else
            for (let i = 0; i < nonIndexedInputs.length; i++)
              args[nonIndexedInputs[i].name] = decodedData[dataIndex++];
        }
      } catch (err) {
        if (strict) {
          if (err instanceof AbiDecodingDataSizeTooSmallError || err instanceof PositionOutOfBoundsError)
            throw new DecodeLogDataMismatch({
              abiItem,
              data,
              params: inputsToDecode,
              size: size(data)
            });
          throw err;
        }
      }
    } else if (strict) {
      throw new DecodeLogDataMismatch({
        abiItem,
        data: "0x",
        params: inputsToDecode,
        size: 0
      });
    }
  }
  return {
    eventName: name,
    args: Object.values(args).length > 0 ? args : void 0
  };
}
function decodeTopic({ param, value }) {
  if (param.type === "string" || param.type === "bytes" || param.type === "tuple" || param.type.match(/^(.*)\[(\d+)?\]$/))
    return value;
  const decodedArg = decodeAbiParameters([param], value) || [];
  return decodedArg[0];
}

// node_modules/viem/_esm/utils/abi/parseEventLogs.js
function parseEventLogs(parameters) {
  const { abi, args, logs, strict = true } = parameters;
  const eventName = (() => {
    if (!parameters.eventName)
      return void 0;
    if (Array.isArray(parameters.eventName))
      return parameters.eventName;
    return [parameters.eventName];
  })();
  const abiTopics = abi.filter((abiItem) => abiItem.type === "event").map((abiItem) => ({
    abi: abiItem,
    selector: toEventSelector(abiItem)
  }));
  return logs.map((log) => {
    const formattedLog = typeof log.blockNumber === "string" ? formatLog(log) : log;
    const abiItems = abiTopics.filter((abiTopic) => formattedLog.topics[0] === abiTopic.selector);
    if (abiItems.length === 0)
      return null;
    let event;
    let abiItem;
    for (const item of abiItems) {
      try {
        event = decodeEventLog({
          ...formattedLog,
          abi: [item.abi],
          strict: true
        });
        abiItem = item;
        break;
      } catch {
      }
    }
    if (!event && !strict) {
      abiItem = abiItems[0];
      try {
        event = decodeEventLog({
          data: formattedLog.data,
          topics: formattedLog.topics,
          abi: [abiItem.abi],
          strict: false
        });
      } catch {
        const isUnnamed = abiItem.abi.inputs?.some((x) => !("name" in x && x.name));
        return {
          ...formattedLog,
          args: isUnnamed ? [] : {},
          eventName: abiItem.abi.name
        };
      }
    }
    if (!event || !abiItem)
      return null;
    if (eventName && !eventName.includes(event.eventName))
      return null;
    if (!includesArgs({
      args: event.args,
      inputs: abiItem.abi.inputs,
      matchArgs: args
    }))
      return null;
    return { ...event, ...formattedLog };
  }).filter(Boolean);
}
function includesArgs(parameters) {
  const { args, inputs, matchArgs } = parameters;
  if (!matchArgs)
    return true;
  if (!args)
    return false;
  function isEqual(input, value, arg) {
    try {
      if (input.type === "address")
        return isAddressEqual(value, arg);
      if (input.type === "string" || input.type === "bytes")
        return keccak256(toBytes(value)) === arg;
      return value === arg;
    } catch {
      return false;
    }
  }
  if (Array.isArray(args) && Array.isArray(matchArgs)) {
    return matchArgs.every((value, index2) => {
      if (value === null || value === void 0)
        return true;
      const input = inputs[index2];
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[index2]));
    });
  }
  if (typeof args === "object" && !Array.isArray(args) && typeof matchArgs === "object" && !Array.isArray(matchArgs))
    return Object.entries(matchArgs).every(([key, value]) => {
      if (value === null || value === void 0)
        return true;
      const input = inputs.find((input2) => input2.name === key);
      if (!input)
        return false;
      const value_ = Array.isArray(value) ? value : [value];
      return value_.some((value2) => isEqual(input, value2, args[key]));
    });
  return false;
}

// node_modules/viem/_esm/actions/public/getLogs.js
init_toHex();
async function getLogs(client, { address, blockHash, fromBlock, toBlock, event, events: events_, args, strict: strict_ } = {}) {
  const strict = strict_ ?? false;
  const events = events_ ?? (event ? [event] : void 0);
  let topics = [];
  if (events) {
    const encoded = events.flatMap((event2) => encodeEventTopics({
      abi: [event2],
      eventName: event2.name,
      args: events_ ? void 0 : args
    }));
    topics = [encoded];
    if (event)
      topics = topics[0];
  }
  let logs;
  if (blockHash) {
    logs = await client.request({
      method: "eth_getLogs",
      params: [{ address, topics, blockHash }]
    });
  } else {
    logs = await client.request({
      method: "eth_getLogs",
      params: [
        {
          address,
          topics,
          fromBlock: typeof fromBlock === "bigint" ? numberToHex(fromBlock) : fromBlock,
          toBlock: typeof toBlock === "bigint" ? numberToHex(toBlock) : toBlock
        }
      ]
    });
  }
  const formattedLogs = logs.map((log) => formatLog(log));
  if (!events)
    return formattedLogs;
  return parseEventLogs({
    abi: events,
    args,
    logs: formattedLogs,
    strict
  });
}

// node_modules/viem/_esm/actions/public/readContract.js
init_decodeFunctionResult();
init_encodeFunctionData();
init_call();
async function readContract(client, parameters) {
  const { abi, address, args, functionName, ...rest } = parameters;
  const calldata = encodeFunctionData({
    abi,
    args,
    functionName
  });
  try {
    const { data } = await getAction(client, call, "call")({
      ...rest,
      data: calldata,
      to: address
    });
    return decodeFunctionResult({
      abi,
      args,
      functionName,
      data: data || "0x"
    });
  } catch (error) {
    throw getContractError(error, {
      abi,
      address,
      args,
      docsPath: "/docs/contract/readContract",
      functionName
    });
  }
}

// node_modules/viem/_esm/utils/wait.js
init_utils3();
async function wait(time, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(getAbortError(signal));
      return;
    }
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, time);
    const onAbort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(getAbortError(signal));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

// node_modules/viem/_esm/utils/promise/withCache.js
var promiseCache = /* @__PURE__ */ new Map();
var responseCache = /* @__PURE__ */ new Map();
function getCache(cacheKey2) {
  const buildCache = (cacheKey3, cache) => ({
    clear: () => cache.delete(cacheKey3),
    get: () => cache.get(cacheKey3),
    set: (data) => cache.set(cacheKey3, data)
  });
  const promise = buildCache(cacheKey2, promiseCache);
  const response = buildCache(cacheKey2, responseCache);
  return {
    clear: () => {
      promise.clear();
      response.clear();
    },
    promise,
    response
  };
}
async function withCache(fn, { cacheKey: cacheKey2, cacheTime = Number.POSITIVE_INFINITY }) {
  const cache = getCache(cacheKey2);
  const response = cache.response.get();
  if (response && cacheTime > 0) {
    const age = Date.now() - response.created.getTime();
    if (age < cacheTime)
      return response.data;
  }
  let promise = cache.promise.get();
  if (!promise) {
    promise = fn();
    cache.promise.set(promise);
  }
  try {
    const data = await promise;
    cache.response.set({ created: /* @__PURE__ */ new Date(), data });
    return data;
  } finally {
    cache.promise.clear();
  }
}

// node_modules/viem/_esm/actions/public/getBlockNumber.js
var cacheKey = (id) => `blockNumber.${id}`;
async function getBlockNumber(client, { cacheTime = client.cacheTime } = {}) {
  const blockNumberHex = await withCache(() => client.request({
    method: "eth_blockNumber"
  }), { cacheKey: cacheKey(client.uid), cacheTime });
  return BigInt(blockNumberHex);
}

// node_modules/viem/_esm/utils/promise/withRetry.js
init_utils3();
function withRetry(fn, { delay: delay_ = 100, retryCount = 2, shouldRetry: shouldRetry2 = () => true, signal } = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({ count = 0 } = {}) => {
      if (signal?.aborted) {
        reject(getAbortError(signal));
        return;
      }
      const retry = async ({ error }) => {
        const delay = typeof delay_ === "function" ? delay_({ count, error }) : delay_;
        if (delay) {
          try {
            await wait(delay, { signal });
          } catch (err) {
            reject(err);
            return;
          }
        }
        return attemptRetry({ count: count + 1 });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (signal?.aborted) {
          reject(getAbortError(signal));
          return;
        }
        if (isAbortError(err)) {
          reject(err);
          return;
        }
        if (count < retryCount && await shouldRetry2({ count, error: err }))
          return retry({ error: err });
        reject(err);
      }
    };
    void attemptRetry().catch(reject);
  });
}

// node_modules/viem/_esm/clients/createClient.js
init_parseAccount();

// node_modules/viem/_esm/utils/uid.js
var size3 = 256;
var index = size3;
var buffer;
function uid(length = 11) {
  if (!buffer || index + length > size3 * 2) {
    buffer = "";
    index = 0;
    for (let i = 0; i < size3; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

// node_modules/viem/_esm/clients/createClient.js
function createClient(parameters) {
  const { batch, chain, ccipRead, dataSuffix, key = "base", name = "Base Client", tokens, type = "base" } = parameters;
  const experimental_blockTag = parameters.experimental_blockTag ?? (typeof chain?.experimental_preconfirmationTime === "number" ? "pending" : void 0);
  const blockTime = chain?.blockTime ?? 12e3;
  const defaultPollingInterval = Math.min(Math.max(Math.floor(blockTime / 2), 500), 4e3);
  const pollingInterval = parameters.pollingInterval ?? defaultPollingInterval;
  const cacheTime = parameters.cacheTime ?? pollingInterval;
  const account = parameters.account ? parseAccount(parameters.account) : void 0;
  const { config, request, value } = parameters.transport({
    account,
    chain,
    pollingInterval
  });
  const transport = { ...config, ...value };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    dataSuffix,
    key,
    name,
    pollingInterval,
    request,
    tokens,
    transport,
    type,
    uid: uid(),
    ...experimental_blockTag ? { experimental_blockTag } : {}
  };
  function extend(base) {
    return (extendFn) => {
      const extended = extendFn(base);
      for (const key2 in client)
        delete extended[key2];
      const combined = { ...base, ...extended };
      for (const key2 in extended) {
        const a = base[key2];
        const b = extended[key2];
        if (isPlainObject(a) && isPlainObject(b))
          combined[key2] = { ...a, ...b };
      }
      return Object.assign(combined, { extend: extend(combined) });
    };
  }
  return Object.assign(client, { extend: extend(client) });
}
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

// node_modules/viem/_esm/utils/buildRequest.js
init_base();
init_request();
init_rpc();
init_utils3();

// node_modules/viem/_esm/utils/promise/withDedupe.js
init_lru();
var promiseCache2 = /* @__PURE__ */ new LruMap(8192);
function withDedupe(fn, { enabled = true, id }) {
  if (!enabled || !id)
    return fn();
  if (promiseCache2.get(id))
    return promiseCache2.get(id);
  const promise = fn().finally(() => promiseCache2.delete(id));
  promiseCache2.set(id, promise);
  return promise;
}

// node_modules/viem/_esm/utils/buildRequest.js
init_stringify();
function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const { dedupe = false, methods, retryDelay = 150, retryCount = 3, signal, uid: uid2 } = {
      ...options,
      ...overrideOptions
    };
    const { method } = args;
    if (methods?.exclude?.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (methods?.include && !methods.include.includes(method))
      throw new MethodNotSupportedRpcError(new Error("method not supported"), {
        method
      });
    if (signal?.aborted)
      throw getAbortError(signal);
    const requestId = dedupe ? hashString(`${uid2}.${stringify(args)}`) : void 0;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args, signal ? { signal } : void 0);
      } catch (err_) {
        if (signal?.aborted)
          throw getAbortError(signal);
        if (isAbortError(err_))
          throw err_;
        const err = err_;
        switch (err.code) {
          // -32700
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          // -32600
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          // -32601
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, { method: args.method });
          // -32602
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          // -32603
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          // -32000
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          // -32001
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          // -32002
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          // -32003
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          // -32004
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          // -32005
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          // -32006
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          // 4001
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          // 4100
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          // 4200
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          // 4900
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          // 4901
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          // 4902
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          // 5700
          case UnsupportedNonOptionalCapabilityError.code:
            throw new UnsupportedNonOptionalCapabilityError(err);
          // 5710
          case UnsupportedChainIdError.code:
            throw new UnsupportedChainIdError(err);
          // 5720
          case DuplicateIdError.code:
            throw new DuplicateIdError(err);
          // 5730
          case UnknownBundleIdError.code:
            throw new UnknownBundleIdError(err);
          // 5740
          case BundleTooLargeError.code:
            throw new BundleTooLargeError(err);
          // 5750
          case AtomicReadyWalletRejectedUpgradeError.code:
            throw new AtomicReadyWalletRejectedUpgradeError(err);
          // 5760
          case AtomicityNotSupportedError.code:
            throw new AtomicityNotSupportedError(err);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5e3:
            throw new UserRejectedRequestError(err);
          // WalletConnect: Session Settlement Failed
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes
          case WalletConnectSessionSettlementError.code:
            throw new WalletConnectSessionSettlementError(err);
          default:
            if (err_ instanceof BaseError2)
              throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({ count, error }) => {
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get("Retry-After");
          if (retryAfter?.match(/\d/))
            return Number.parseInt(retryAfter, 10) * 1e3;
        }
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      signal,
      shouldRetry: ({ error }) => shouldRetry(error)
    }), { enabled: dedupe, id: requestId });
  };
}
function shouldRetry(error) {
  if (isAbortError(error))
    return false;
  if ("code" in error && typeof error.code === "number") {
    if (error.code === -1)
      return true;
    if (error.code === LimitExceededRpcError.code)
      return true;
    if (error.code === InternalRpcError.code)
      return true;
    if (error.code === 429)
      return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    if (error.status === 403)
      return true;
    if (error.status === 408)
      return true;
    if (error.status === 413)
      return true;
    if (error.status === 429)
      return true;
    if (error.status === 500)
      return true;
    if (error.status === 502)
      return true;
    if (error.status === 503)
      return true;
    if (error.status === 504)
      return true;
    return false;
  }
  return true;
}
function hashString(str, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507);
  h1 ^= Math.imul(h2 ^ h2 >>> 16, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507);
  h2 ^= Math.imul(h1 ^ h1 >>> 16, 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

// node_modules/viem/_esm/utils/rpc/http.js
init_request();
init_utils3();

// node_modules/viem/_esm/utils/promise/withTimeout.js
init_utils3();
function withTimeout(fn, { errorInstance = new Error("timed out"), timeout, signal }) {
  return new Promise((resolve, reject) => {
    ;
    (async () => {
      let timeoutId;
      const controller = new AbortController();
      try {
        if (timeout > 0) {
          timeoutId = setTimeout(() => {
            if (signal) {
              controller.abort();
            } else {
              reject(errorInstance);
            }
          }, timeout);
        }
        resolve(await fn({ signal: controller?.signal || null }));
      } catch (err) {
        if (controller?.signal.aborted && isAbortError(err)) {
          reject(errorInstance);
          return;
        }
        reject(err);
      } finally {
        clearTimeout(timeoutId);
      }
    })();
  });
}

// node_modules/viem/_esm/utils/rpc/http.js
init_stringify();

// node_modules/viem/_esm/utils/rpc/id.js
function createIdStore() {
  return {
    current: 0,
    take() {
      return this.current++;
    },
    reset() {
      this.current = 0;
    }
  };
}
var idCache = /* @__PURE__ */ createIdStore();

// node_modules/viem/_esm/utils/rpc/http.js
var defaultMaxResponseBodySize = 10485760;
function getHttpRpcClient(url_, options = {}) {
  const { url, headers: headers_url } = parseUrl(url_);
  return {
    async request(params) {
      const { body, fetchFn = options.fetchFn ?? fetch, maxResponseBodySize = options.maxResponseBodySize ?? defaultMaxResponseBodySize, onRequest = options.onRequest, onResponse = options.onResponse, timeout = options.timeout ?? 1e4 } = params;
      const fetchOptions = {
        ...options.fetchOptions ?? {},
        ...params.fetchOptions ?? {}
      };
      const { headers, method, signal: signal_ } = fetchOptions;
      try {
        const response = await withTimeout(async ({ signal }) => {
          const init = {
            ...fetchOptions,
            body: Array.isArray(body) ? stringify(body.map((body2) => ({
              jsonrpc: "2.0",
              id: body2.id ?? idCache.take(),
              ...body2
            }))) : stringify({
              jsonrpc: "2.0",
              id: body.id ?? idCache.take(),
              ...body
            }),
            headers: {
              ...headers_url,
              "Content-Type": "application/json",
              ...headers
            },
            method: method || "POST",
            signal: signal_ || (timeout > 0 ? signal : null)
          };
          const request = new Request(url, init);
          const args = await onRequest?.(request, init) ?? { ...init, url };
          const response2 = await fetchFn(args.url ?? url, args);
          return response2;
        }, {
          errorInstance: new TimeoutError({ body, url }),
          timeout,
          signal: true
        });
        if (onResponse)
          await onResponse(response);
        let data;
        const responseBody = await readResponseBody(response, {
          maxResponseBodySize
        });
        if (response.headers.get("Content-Type")?.startsWith("application/json"))
          data = JSON.parse(responseBody);
        else {
          data = responseBody;
          try {
            data = JSON.parse(data || "{}");
          } catch (err) {
            if (response.ok)
              throw err;
            data = { error: data };
          }
        }
        if (!response.ok) {
          if (typeof data.error?.code === "number" && typeof data.error?.message === "string")
            return data;
          throw new HttpRequestError({
            body,
            details: stringify(data.error) || response.statusText,
            headers: response.headers,
            status: response.status,
            url
          });
        }
        return data;
      } catch (err) {
        if (signal_?.aborted)
          throw getAbortError(signal_);
        if (isAbortError(err))
          throw err;
        if (err instanceof HttpRequestError)
          throw err;
        if (err instanceof ResponseBodyTooLargeError)
          throw err;
        if (err instanceof TimeoutError)
          throw err;
        throw new HttpRequestError({
          body,
          cause: err,
          url
        });
      }
    }
  };
}
async function readResponseBody(response, { maxResponseBodySize }) {
  if (maxResponseBodySize === false)
    return response.text();
  const contentLength = response.headers.get("Content-Length");
  if (contentLength) {
    const size5 = Number(contentLength);
    if (size5 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size5
      });
  }
  if (!response.body) {
    const body2 = await response.text();
    const size5 = new TextEncoder().encode(body2).length;
    if (size5 > maxResponseBodySize)
      throw new ResponseBodyTooLargeError({
        maxSize: maxResponseBodySize,
        size: size5
      });
    return body2;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let body = "";
  let size4 = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done)
        break;
      size4 += value.byteLength;
      if (size4 > maxResponseBodySize) {
        await reader.cancel();
        throw new ResponseBodyTooLargeError({
          maxSize: maxResponseBodySize,
          size: size4
        });
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return body;
  } finally {
    reader.releaseLock();
  }
}
function parseUrl(url_) {
  try {
    const url = new URL(url_);
    const result = (() => {
      if (url.username) {
        const credentials = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
        url.username = "";
        url.password = "";
        return {
          url: url.toString(),
          headers: { Authorization: `Basic ${btoa(credentials)}` }
        };
      }
      return;
    })();
    return { url: url.toString(), ...result };
  } catch {
    return { url: url_ };
  }
}

// node_modules/viem/_esm/clients/transports/createTransport.js
function createTransport({ key, methods, name, request, retryCount = 3, retryDelay = 150, timeout, type }, value) {
  const uid2 = uid();
  return {
    config: {
      key,
      methods,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, { methods, retryCount, retryDelay, uid: uid2 }),
    value
  };
}

// node_modules/viem/_esm/clients/transports/http.js
init_request();

// node_modules/viem/_esm/errors/transport.js
init_base();
var UrlRequiredError = class extends BaseError2 {
  constructor() {
    super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.", {
      docsPath: "/docs/clients/intro",
      name: "UrlRequiredError"
    });
  }
};

// node_modules/viem/_esm/clients/transports/http.js
init_createBatchScheduler();
var signalId = 0;
var signalIds = /* @__PURE__ */ new WeakMap();
function getSignalId(signal) {
  if (!signal)
    return "default";
  const id = signalIds.get(signal);
  if (id !== void 0)
    return id;
  const nextId = signalId++;
  signalIds.set(signal, nextId);
  return nextId;
}
function http(url, config = {}) {
  const { batch, fetchFn, fetchOptions, key = "http", maxResponseBodySize, methods, name = "HTTP JSON-RPC", onFetchRequest, onFetchResponse, retryDelay, raw } = config;
  return ({ chain, retryCount: retryCount_, timeout: timeout_ }) => {
    const { batchSize = 1e3, wait: wait2 = 0 } = typeof batch === "object" ? batch : {};
    const retryCount = config.retryCount ?? retryCount_;
    const timeout = timeout_ ?? config.timeout ?? 1e4;
    const url_ = url || chain?.rpcUrls.default.http[0];
    if (!url_)
      throw new UrlRequiredError();
    const rpcClient = getHttpRpcClient(url_, {
      fetchFn,
      fetchOptions,
      maxResponseBodySize,
      onRequest: onFetchRequest,
      onResponse: onFetchResponse,
      timeout
    });
    return createTransport({
      key,
      methods,
      name,
      async request({ method, params }, options) {
        const body = { method, params };
        const fetchOptions2 = options?.signal ? { signal: options.signal } : void 0;
        const { schedule } = createBatchScheduler({
          id: `${url_}.${getSignalId(options?.signal)}`,
          wait: wait2,
          shouldSplitBatch(requests) {
            return requests.length > batchSize;
          },
          fn: (body2) => rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          }),
          sort: (a, b) => a.id - b.id
        });
        const fn = async (body2) => batch ? schedule(body2) : [
          await rpcClient.request({
            body: body2,
            fetchOptions: fetchOptions2
          })
        ];
        const [{ error, result }] = await fn(body);
        if (raw)
          return { error, result };
        if (error)
          throw new RpcRequestError({
            body,
            error,
            url: url_
          });
        return result;
      },
      retryCount,
      retryDelay,
      timeout,
      type: "http"
    }, {
      fetchOptions,
      url: url_
    });
  };
}

// src/generation-sprites.ts
var GENERATION_SPRITE_MANIFEST = Object.freeze({
  chainId: 4663,
  rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
  generations: "0x14C49e6118F46525dE9ab41a51cBAA3c6EBF181D",
  /** First Transfer emitted by the canonical Generations collection. */
  transferStartBlock: 63102373n,
  metadata: "0x3A243E7f46970275CaE8375b0032e53dF91a9110",
  registry: "0x246E3E9730A7Eade94c79be0Fd78d210f89AEb8D",
  worldData: "0xB78F68992d4c61c491EDCCa7890a05e7DBeb3970",
  seededLandscape: "0x450E3a18cb4d0264C61ff6468FC988FD9F78967D"
});
var FAMILIES_REGISTRY_ABI = parseAbi([
  "function familyOf(uint256 tokenId) pure returns (uint8)",
  "function seedOf(uint256 tokenId) pure returns (uint32)",
  "function familyName(uint8 id) pure returns (string)",
  "function module(uint8 id) view returns (address)",
  "function portrait(uint8 id, uint32 seed) view returns (uint256)",
  "function frames(uint8 id, uint32 seed) view returns (uint256[64])",
  "function sceneFrames(uint8 id, uint32 seed) view returns (uint256[64])"
]);
var GENERATION_FAMILY_NAMES = Object.freeze([
  "Skeleton",
  "Mask",
  "Family",
  "Cellular",
  "Asymmetry",
  "Hoverer",
  "Colossus",
  "Sparkling",
  "Hollow"
]);
var SPRITE_FACINGS = Object.freeze(["down", "up", "left", "right"]);
var MAX_UINT256 = (1n << 256n) - 1n;
var MAX_CACHE_ENTRIES = 64;
function validateTokenId(tokenId) {
  if (typeof tokenId !== "bigint" || tokenId < 1n || tokenId > MAX_UINT256) {
    throw new RangeError("Token ID must be an integer from 1 through uint256 max.");
  }
}
async function assertChain(client, manifest) {
  if (await client.getChainId() !== manifest.chainId) {
    throw new Error(`Sprites require chain ${manifest.chainId}.`);
  }
}
function decodeSpriteBitmap(bitmap) {
  if (typeof bitmap !== "bigint" || bitmap < 0n || bitmap > MAX_UINT256) {
    throw new RangeError("A sprite bitmap must fit uint256.");
  }
  const rows = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_2, x) => bitmap & 1n << BigInt(y * 16 + x) ? "#" : ".").join(""));
  return Object.freeze({ bitmap, rows: Object.freeze(rows) });
}
function generationSpriteCacheKey(tokenId, manifest = GENERATION_SPRITE_MANIFEST) {
  validateTokenId(tokenId);
  return `${manifest.chainId}:${manifest.registry.toLowerCase()}:${tokenId}`;
}
function decodeGenerationSprites(tokenId, familyId, seed, bitmaps, manifest = GENERATION_SPRITE_MANIFEST) {
  validateTokenId(tokenId);
  if (!Number.isInteger(familyId) || familyId < 0 || familyId >= GENERATION_FAMILY_NAMES.length) {
    throw new RangeError("Unknown sprite family.");
  }
  if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) throw new RangeError("Seed must fit uint32.");
  if (bitmaps.length !== 64) throw new RangeError("The registry must return exactly 64 frames.");
  const decoded = bitmaps.map(decodeSpriteBitmap);
  const clips = (offset) => Object.freeze(Object.fromEntries(
    SPRITE_FACINGS.map((facing, index2) => [facing, Object.freeze(decoded.slice(offset + index2 * 8, offset + index2 * 8 + 8))])
  ));
  return Object.freeze({
    tokenId,
    familyId,
    familyName: GENERATION_FAMILY_NAMES[familyId],
    seed,
    frames: Object.freeze([...bitmaps]),
    clips: Object.freeze({ idle: clips(0), walk: clips(32) }),
    cacheKey: generationSpriteCacheKey(tokenId, manifest)
  });
}
function spriteFrame(sprites, facing, walking, frame, sideFallback = "right") {
  if (!SPRITE_FACINGS.includes(facing)) throw new RangeError("Unknown sprite direction.");
  if (!Number.isInteger(frame) || frame < 0 || frame > 7) throw new RangeError("Frame must be from 0 through 7.");
  if (sideFallback !== "left" && sideFallback !== "right") throw new RangeError("Fallback must face left or right.");
  const usedFallback = sprites.familyId === 6 && (facing === "down" || facing === "up");
  const resolvedFacing = usedFallback ? sideFallback : facing;
  return {
    frame: sprites.clips[walking ? "walk" : "idle"][resolvedFacing][frame],
    requestedFacing: facing,
    resolvedFacing,
    usedFallback
  };
}
function createGenerationSpriteReader(client, manifest = GENERATION_SPRITE_MANIFEST) {
  const cache = /* @__PURE__ */ new Map();
  return {
    async read(tokenId) {
      const key = generationSpriteCacheKey(tokenId, manifest);
      await assertChain(client, manifest);
      let result = cache.get(key);
      if (result) {
        cache.delete(key);
        cache.set(key, result);
        return result;
      }
      result = (async () => {
        const [familyId, seed] = await Promise.all([
          client.readContract({ address: manifest.registry, abi: FAMILIES_REGISTRY_ABI, functionName: "familyOf", args: [tokenId] }),
          client.readContract({ address: manifest.registry, abi: FAMILIES_REGISTRY_ABI, functionName: "seedOf", args: [tokenId] })
        ]);
        const frames = await client.readContract({
          address: manifest.registry,
          abi: FAMILIES_REGISTRY_ABI,
          functionName: "frames",
          args: [familyId, seed]
        });
        return decodeGenerationSprites(tokenId, familyId, seed, frames, manifest);
      })();
      cache.set(key, result);
      void result.catch(() => {
        if (cache.get(key) === result) cache.delete(key);
      });
      if (cache.size > MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value);
      return result;
    },
    clear() {
      cache.clear();
    }
  };
}

// src/read-client.ts
function createFriendReadClient(rpcUrl, options = {}) {
  const client = createClient({ transport: http(rpcUrl, options), cacheTime: 0, pollingInterval: 1e3 });
  return {
    getBlockNumber: (parameters) => getBlockNumber(client, parameters),
    getChainId: () => getChainId(client),
    getLogs: (parameters) => getLogs(client, parameters),
    readContract: (parameters) => readContract(client, parameters)
  };
}

// src/friend-sprites.ts
function createFriendReader() {
  return createGenerationSpriteReader(createFriendReadClient(
    GENERATION_SPRITE_MANIFEST.rpcUrl,
    { retryCount: 1, timeout: 12e3 }
  ));
}

// examples/fishing/sample-sprites.ts
var SAMPLES = Object.freeze({
  "7730": decodeGenerationSprites(7730n, 5, 7730, [
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e005a007e007e0042000000000n,
    0xff000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e005a007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff00000124812481ff81ff83ffc3ffc07e007e007e007e0042000000000n,
    0xff000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000124812481ff81ff83ffc3ffc07e007e007e007e004200000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff00000080808081ffc1ffc1ffc1ffc001e001a001e001e000000000000n,
    0xff000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000080808081ffc1ffc1ffc1ffc001e001a001e001e00000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff00000101010103ff83ff83ff83ff87800580078007800000000000000n,
    0xff000000000101010103ff83ff83ff83ff8780058007800780000000000n,
    0x7e000000000101010103ff83ff83ff83ff8780058007800780000000000n
  ]),
  "3412": decodeGenerationSprites(3412n, 0, 3412, [
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81bd81bd80ff007e0066000000000n,
    0x660066007e00ff007e0018001801ff81bd81bd80ff007e0066000000000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81ff81ff80ff007e0066000000000n,
    0x660066007e00ff007e0018001801ff81ff81ff80ff007e0066000000000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e003c0018001800ff00fd00fd007f003c0030000000000n,
    0x180018007e007e003c0018001800ff00fd00fd007f003c0030000000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e003c0018001800ff00bf00bf00fe003c000c000000000n,
    0x180018007e007e003c0018001800ff00bf00bf00fe003c000c000000000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81bd81bd80ff007e0066000000000n,
    0x600066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x600066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81bd81bd80ff007e0066000000000n,
    0x60066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x60066007e00ff00ff007e0018001801ff81bd81bd80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81ff81ff80ff007e0066000000000n,
    0x60066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x60066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x660066007e00ff007e0018001801ff81ff81ff80ff007e0066000000000n,
    0x600066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x600066007e00ff00ff007e0018001801ff81ff81ff80ff007e006600000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e003c0018001800ff00fd00fd007f003c0030000000000n,
    0x6c006c007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x6c006c007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e003c0018001800ff00fd00fd007f003c0030000000000n,
    0xc006c007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0xc006c007e007e007e003c0018001800ff00fd00fd007f003c003000000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e003c0018001800ff00bf00bf00fe003c000c000000000n,
    0x360036007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x360036007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x180018007e007e003c0018001800ff00bf00bf00fe003c000c000000000n,
    0x300036007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n,
    0x300036007e007e007e003c0018001800ff00bf00bf00fe003c000c00000n
  ])
});
function sampleFriendSprites(tokenId) {
  return SAMPLES[String(tokenId)];
}

// examples/fishing/world.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var world = validateWorld({ ...structuredClone(getWorldPreset("01-garden-oval-complete")), collision: { blocked: [{ x: 396, y: 233, w: 48, h: 34 }] } });
var view = { x: 320, y: 330, width: 960, height: 640 };
var targets = { pond: [214, 268], vendor: [420, 292] };
function nearest(point2) {
  const found = Object.keys(targets).sort((a, b) => Math.hypot(point2[0] - targets[a][0], point2[1] - targets[a][1]) - Math.hypot(point2[0] - targets[b][0], point2[1] - targets[b][1]))[0];
  return Math.hypot(point2[0] - targets[found][0], point2[1] - targets[found][1]) < 85 ? found : null;
}
function drawVendor(context) {
  const [x, y] = project(420, 250);
  context.save();
  context.translate(Math.round(x), Math.round(y));
  context.lineWidth = 2;
  const polygon2 = (points, fill = "#fff") => {
    context.beginPath();
    context.moveTo(...points[0]);
    for (const point2 of points.slice(1)) context.lineTo(...point2);
    context.closePath();
    context.fillStyle = fill;
    context.fill();
    context.strokeStyle = "#000";
    context.stroke();
  };
  context.fillStyle = "#000";
  context.fillRect(-42, -105, 4, 103);
  context.fillRect(40, -105, 4, 116);
  const vendor = sampleFriendSprites(3412n);
  if (vendor) drawFriend(context, vendor, 2, -23, "down", false, 0, 4);
  polygon2([[-48, -19], [5, -35], [48, -21], [-5, -4]]);
  polygon2([[-48, -19], [-5, -4], [-5, 24], [-48, 9]], "#000");
  polygon2([[-5, -4], [48, -21], [48, 8], [-5, 24]]);
  polygon2([[-55, -109], [7, -129], [59, -112], [-3, -92]]);
  polygon2([[-55, -109], [-3, -92], [-3, -82], [-55, -99]], "#000");
  polygon2([[-3, -92], [59, -112], [59, -102], [-3, -82]]);
  for (let index2 = 0; index2 < 4; index2++) polygon2([[-48 + index2 * 13, -111 + index2 * 4], [-38 + index2 * 13, -108 + index2 * 4], [24 + index2 * 9, -120 + index2 * 3], [15 + index2 * 9, -123 + index2 * 3]], index2 % 2 ? "#fff" : "#000");
  context.beginPath();
  context.moveTo(-61, 9);
  context.lineTo(-69, -61);
  context.lineTo(-78, -72);
  context.lineTo(-78, -24);
  context.lineTo(-74, -20);
  context.stroke();
  context.restore();
}
function drawFriend(context, sprites, x, y, facing, walking, frame, scale = 5, side = "right") {
  const rows = spriteFrame(sprites, facing, walking, frame, side).frame.rows;
  const pixels = rows.flatMap((row, py) => [...row].flatMap((pixel, px) => pixel === "#" ? [[px, py]] : []));
  const left = Math.round(x) - 8 * scale, top = Math.round(y) - 15 * scale;
  context.save();
  context.beginPath();
  context.rect(left, top, 16 * scale, 16 * scale);
  context.clip();
  context.fillStyle = "#fff";
  for (const [px, py] of pixels) context.fillRect(left + px * scale - scale, top + py * scale - scale, scale * 3, scale * 3);
  context.fillStyle = "#000";
  for (const [px, py] of pixels) context.fillRect(left + px * scale, top + py * scale, scale, scale);
  context.restore();
}
function FishingWorld({ friendId, paused, reducedMotion, onNearChange, onInteract }) {
  const canvas = useRef3(null);
  const movement = useRef3(null);
  const [artStatus, setArtStatus] = useState4("Loading Friend artwork\u2026");
  const [worldError, setWorldError] = useState4("");
  const pause = useRef3(paused);
  const callbacks = useRef3({ reducedMotion, onNearChange, onInteract });
  callbacks.current = { reducedMotion, onNearChange, onInteract };
  useEffect3(() => {
    pause.current = paused;
    if (paused) movement.current?.stop();
  }, [paused]);
  useEffect3(() => {
    const node = canvas.current, context = node?.getContext("2d");
    if (!node || !context) return;
    const controller = new AbortController();
    const mover = createWorldMovement(world, [288, 192]);
    movement.current = mover;
    let frame = 0, last = 0, sprites;
    let lastNear = null;
    let assets;
    let side = "right";
    const stop = () => mover.stop();
    const hidden = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", hidden);
    loadWorldAssets(world, { color: false, signals: false }, controller.signal).then((value) => {
      assets = value;
    }).catch(() => {
      if (!controller.signal.aborted) setWorldError("World artwork could not load. The game controls still work.");
    });
    (sampleFriendSprites(friendId) ? Promise.resolve(sampleFriendSprites(friendId)) : createFriendReader().read(friendId)).then((value) => {
      if (controller.signal.aborted) return;
      sprites = value;
      setArtStatus("");
    }).catch(() => {
      if (!controller.signal.aborted) setArtStatus("Friend artwork unavailable. The circle marks your position.");
    });
    const render = (now) => {
      const state = mover.update(!pause.current && !document.hidden && last ? now - last : 0);
      last = now;
      context.clearRect(0, 0, view.width, view.height);
      context.save();
      context.translate(-view.x, -view.y);
      context.imageSmoothingEnabled = false;
      if (assets) context.drawImage(assets.terrain, 0, 0);
      const [x, y] = project(...state.position);
      const character = () => {
        context.fillStyle = "#0003";
        context.beginPath();
        context.ellipse(x, y + 2, 20, 7, 0, 0, Math.PI * 2);
        context.fill();
        if (!sprites) {
          context.fillStyle = "#fff";
          context.strokeStyle = "#111";
          context.lineWidth = 2;
          context.beginPath();
          context.arc(x, y - 10, 8, 0, Math.PI * 2);
          context.fill();
          context.stroke();
          return;
        }
        if (state.facing === "left" || state.facing === "right") side = state.facing;
        drawFriend(context, sprites, x, y, state.facing, state.walking, callbacks.current.reducedMotion ? 0 : Math.floor(now / 110) % 8, 5, side);
      };
      const layers = (assets?.objects ?? []).map((object) => ({ depth: object.depth, draw: () => context.drawImage(object.image, 0, 0) }));
      layers.push({ depth: 670, draw: () => drawVendor(context) });
      layers.push({ depth: state.position[0] + state.position[1], draw: character });
      layers.sort((a, b) => a.depth - b.depth).forEach((layer) => layer.draw());
      const target = nearest(state.position);
      if (target !== lastNear) {
        lastNear = target;
        callbacks.current.onNearChange(target);
      }
      context.restore();
      node.dataset.x = state.position[0].toFixed(2);
      node.dataset.y = state.position[1].toFixed(2);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      mover.stop();
      movement.current = null;
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [friendId]);
  return /* @__PURE__ */ jsxs4("div", { className: "fv1-world", children: [
    /* @__PURE__ */ jsx4(
      "canvas",
      {
        ref: canvas,
        width: view.width,
        height: view.height,
        tabIndex: paused ? -1 : 0,
        "aria-label": "Garden lake. Use arrow keys or WASD to walk, or click or tap a destination.",
        onKeyDown: (event) => {
          if (paused) return;
          if (event.key.toLowerCase() === "e" && !event.repeat && movement.current) {
            const target = nearest(movement.current.state.position);
            if (target) {
              event.preventDefault();
              callbacks.current.onInteract(target);
            }
          }
          if (movement.current?.setKey(event.key, true)) event.preventDefault();
        },
        onKeyUp: (event) => {
          if (movement.current?.setKey(event.key, false)) event.preventDefault();
        },
        onBlur: () => movement.current?.stop(),
        onPointerDown: (event) => {
          if (paused) return;
          event.currentTarget.focus();
          const rect = event.currentTarget.getBoundingClientRect();
          const scale = Math.min(rect.width / view.width, rect.height / view.height);
          const x = (event.clientX - rect.left - (rect.width - view.width * scale) / 2) / scale;
          const y = (event.clientY - rect.top - (rect.height - view.height * scale) / 2) / scale;
          movement.current?.moveTo(unproject(view.x + x, view.y + y));
        }
      }
    ),
    /* @__PURE__ */ jsx4("p", { className: "fv1-world-status", "data-ready": !worldError && !artStatus, role: "status", children: worldError || artStatus })
  ] });
}

// examples/fishing/art.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var fishingBait = {
  id: "bait",
  name: "Bait",
  rarity: "Basic",
  art: { rows: ["    ####    ", "  ##....##  ", " #........# ", "#..........#", "#..........#", "##........##", " #........# ", " #........# ", " #........# ", " #........# ", " ########## "] }
};
function Bobber({ ready = false }) {
  return /* @__PURE__ */ jsxs5("svg", { className: "fv1-bobber", viewBox: "0 0 80 84", fill: "none", stroke: "currentColor", strokeWidth: "2", shapeRendering: "crispEdges", "aria-hidden": "true", "data-ready": ready, children: [
    /* @__PURE__ */ jsx5("path", { d: "M40 0v35M34 35h12v12H34zM26 47h28v20H26zM26 57h28M14 72h52M24 79h32" }),
    ready && /* @__PURE__ */ jsx5("path", { d: "M9 28 2 19M69 28l8-9M7 43H0M73 43h7" })
  ] });
}
function SoundIcon({ muted }) {
  return /* @__PURE__ */ jsxs5("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx5("path", { d: "m11 4-5 5H3v6h3l5 5z" }),
    muted ? /* @__PURE__ */ jsx5("path", { d: "m15 9 6 6m0-6-6 6" }) : /* @__PURE__ */ jsx5("path", { d: "M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" })
  ] });
}
function SettingsIcon() {
  return /* @__PURE__ */ jsx5("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7", "aria-hidden": "true", children: /* @__PURE__ */ jsx5("path", { d: "M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6" }) });
}

// examples/fishing/preview.tsx
import { useCallback as useCallback2, useEffect as useEffect4, useMemo, useRef as useRef4, useState as useState5 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var SAMPLE_FRIENDS = [
  { id: 7730n, label: "Sample Friend A", kind: "sample" },
  { id: 3412n, label: "Sample Friend B", kind: "sample" }
];
function FishingPreview() {
  const sessions = useRef4(/* @__PURE__ */ new Map());
  const pending = useRef4(null);
  const [friendId, setFriendId] = useState5(null);
  const [snapshot, setSnapshot] = useState5(null);
  const [confirmation, setConfirmation] = useState5(null);
  const [paused, setPaused] = useState5(true);
  const confirm = useCallback2((title, description, amount) => new Promise((resolve, reject) => {
    const close = () => {
      pending.current = null;
      setConfirmation(null);
    };
    pending.current = () => {
      close();
      reject(new Error("Preview action cancelled."));
    };
    setConfirmation({ title, description, amount, onConfirm: () => {
      close();
      resolve();
    }, onCancel: () => pending.current?.() });
  }), []);
  useEffect4(() => () => pending.current?.(), []);
  const client = useMemo(() => {
    if (friendId === null) return void 0;
    let original = sessions.current.get(friendId);
    if (!original) {
      original = createGamePreview(fishingGame, { stake: 100n * RF, rfBalance: 20n * RF, friendId }).client;
      sessions.current.set(friendId, original);
    }
    const selected = original;
    return {
      ...selected,
      async buy(quantity) {
        await confirm("Buy bait", `${quantity} bait for this Friend.`, fishingGame.price * quantity);
        await selected.buy(quantity);
      },
      async play(quantity = 1n) {
        await confirm("Cast at the lake", `Use ${quantity} bait from this Friend.`);
        return selected.play(quantity);
      },
      async redeem(outcomeId, quantity) {
        await confirm("Sell catch", `${quantity} ${fishingGame.outcomes[outcomeId - 1].name}; RF returns to this Friend.`, fishingGame.outcomes[outcomeId - 1].reward * quantity);
        await selected.redeem(outcomeId, quantity);
      }
    };
  }, [friendId, confirm]);
  const receiveSnapshot = useCallback2((value) => {
    if (value.friendId === friendId) setSnapshot(value);
  }, [friendId]);
  return /* @__PURE__ */ jsx6(
    GameFrame,
    {
      mode: "preview",
      friends: SAMPLE_FRIENDS,
      selectedFriendId: friendId,
      onSelectFriend: (id) => {
        setFriendId(id);
        setSnapshot(null);
      },
      wallet: { balance: snapshot?.rfBalance },
      confirmation,
      onMenuChange: setPaused,
      children: /* @__PURE__ */ jsx6(FishingGame, { friendId, client, onSnapshot: receiveSnapshot, paused })
    }
  );
}

// examples/fishing/index.tsx
import { Fragment as Fragment3, jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var fishingGame = parseChanceGame(game_default);
var fishingItems = fishingGame.outcomes.map((outcome, index2) => ({
  id: art_default[index2].id,
  name: outcome.name,
  rarity: art_default[index2].rarity,
  art: { rows: art_default[index2].rows }
}));
var rf = (amount) => `${formatGameAmount(amount, 18)} RF`;
var currency = { symbol: "RF", decimals: 18 };
function FishingGame({ friendId, client, onSnapshot, paused = false }) {
  const sessions = useRef5(/* @__PURE__ */ new Map());
  if (friendId === null) return /* @__PURE__ */ jsx7("div", { className: "fv1 fv1-empty", children: "Choose a Friend to enter the lake." });
  let active = client ?? sessions.current.get(friendId);
  if (!active) {
    const preview = createGamePreview(fishingGame, { stake: 100n * RF, rfBalance: 20n * RF, friendId }).client;
    sessions.current.set(friendId, preview);
    active = preview;
  }
  return /* @__PURE__ */ jsx7(FishingSession, { friendId, client: active, onSnapshot, paused }, `${friendId}:${active.mode}`);
}
function FishingSession({ friendId, client, onSnapshot, paused }) {
  const isPreview = client.mode === "preview";
  const [snapshot, setSnapshot] = useState6(null);
  const [screen, setScreen] = useState6("world");
  const [shopTab, setShopTab] = useState6("buy");
  const [quantity, setQuantity] = useState6("1");
  const [selectedCatch, setSelectedCatch] = useState6(1);
  const [busy, setBusy] = useState6(false);
  const [error, setError] = useState6("");
  const [message, setMessage] = useState6("");
  const [result, setResult] = useState6(null);
  const [casting, setCasting] = useState6(false);
  const [bite, setBite] = useState6(false);
  const [muted, setMuted] = useState6(true);
  const [reduceMotion, setReduceMotion] = useState6(false);
  const [worldRevision, setWorldRevision] = useState6(0);
  const [near, setNear] = useState6(null);
  const locked = useRef5(false);
  const alive = useRef5(true);
  const sound = useRef5(null);
  useEffect5(() => {
    alive.current = true;
    sound.current = createFriendSoundKit({ muted: true });
    void client.read().then((value) => {
      if (alive.current) setSnapshot(value);
    }).catch((cause) => {
      if (alive.current) setError(cause instanceof Error ? cause.message : "The game could not load.");
    });
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => {
      alive.current = false;
      sound.current?.dispose();
      sound.current = null;
      query.removeEventListener("change", update);
    };
  }, [client]);
  useEffect5(() => {
    if (snapshot) onSnapshot?.(snapshot);
  }, [snapshot, onSnapshot]);
  useEffect5(() => {
    if (!casting || !result) return;
    const timer = setTimeout(() => {
      setBite(true);
      sound.current?.play("action-ready");
    }, reduceMotion ? 0 : 800);
    return () => clearTimeout(timer);
  }, [casting, result, reduceMotion]);
  async function action(work, cue) {
    if (locked.current || paused) return;
    locked.current = true;
    setBusy(true);
    setError("");
    setMessage("");
    void sound.current?.unlock();
    try {
      await work();
      const value = await client.read();
      if (alive.current) {
        setSnapshot(value);
        if (cue) sound.current?.play(cue);
      }
    } catch (cause) {
      const failure = cause instanceof Error ? cause.message : "Game action failed.";
      try {
        const value = await client.read();
        if (alive.current) {
          setSnapshot(value);
          setError(failure);
        }
      } catch {
        if (alive.current) setError(`${failure} Could not refresh the game state. Retry before continuing.`);
      }
    } finally {
      locked.current = false;
      if (alive.current) setBusy(false);
    }
  }
  if (!snapshot) return /* @__PURE__ */ jsxs6("div", { className: "fv1 fv1-empty", role: error ? "alert" : "status", children: [
    error || (isPreview ? "Loading fishing preview\u2026" : "Loading fishing\u2026"),
    error && /* @__PURE__ */ jsx7("button", { type: "button", disabled: busy || paused, onClick: () => void action(async () => {
    }), children: "Retry" })
  ] });
  if (snapshot.friendId !== friendId) return /* @__PURE__ */ jsx7("div", { className: "fv1 fv1-empty", role: "alert", children: "The selected Friend does not match this game session." });
  const count = /^[1-9]\d?$/.test(quantity) ? BigInt(quantity) : 0n;
  const cost = count * fishingGame.price;
  const hasBacking = snapshot.freeStake >= 10n * RF && snapshot.freeStake + cost >= count * 10n * RF;
  const canBuy = count > 0n && hasBacking && snapshot.rfBalance >= cost;
  const pendingPlays = snapshot.plays.filter((play) => play.outcomeId === null);
  const pendingPlay = pendingPlays[0];
  const caughtId = result?.outcomeId ?? null;
  const caughtItem = caughtId ? fishingItems[caughtId - 1] : null;
  const caughtValue = caughtId ? fishingGame.outcomes[caughtId - 1].reward : 0n;
  const totalValue = snapshot.inventory.reduce((sum, amount, index2) => sum + amount * fishingGame.outcomes[index2].reward, 0n);
  const totalCount = snapshot.inventory.reduce((sum, amount) => sum + amount, 0n);
  const bestIndex = snapshot.plays.reduce((best, play) => play.outcomeId !== null && play.outcomeId - 1 > best ? play.outcomeId - 1 : best, -1);
  const selectedItem = fishingItems[selectedCatch];
  const selectedValue = fishingGame.outcomes[selectedCatch].reward;
  const selectedCount = snapshot.inventory[selectedCatch];
  const navigate = (next) => {
    if (!casting && !busy && !paused) {
      setScreen(next);
      setError("");
      setMessage("");
      sound.current?.play("select");
    }
  };
  const openShop = () => {
    setShopTab("buy");
    navigate("shop");
  };
  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    sound.current?.setMuted(next);
    if (!next) void sound.current?.unlock();
  };
  const sell = (outcomeId, amount) => action(async () => {
    await client.redeem(outcomeId, amount);
    setMessage(`Sold ${amount} ${fishingItems[outcomeId - 1].name}. ${isPreview ? "Simulated RF added to this Friend." : "RF returned to this Friend wallet."}`);
  }, "reward");
  async function settleCast(playId) {
    const settled = await client.settle(playId);
    if (!alive.current) return;
    setBite(false);
    if (settled.outcomeId === null) {
      setResult(null);
      setCasting(false);
      setMessage(`Cast #${playId} is waiting for its result. Resume this cast to check again; no additional bait is used.`);
      return;
    }
    setResult(settled);
    setCasting(true);
    setMessage("");
  }
  const cast = () => action(async () => {
    if (pendingPlay) throw new Error(`Cast #${pendingPlay.id} is pending. Resume that cast at the lake.`);
    setResult(null);
    setBite(false);
    setCasting(false);
    const [play] = await client.play(1n);
    if (!play) throw new Error("The cast was not returned. Refresh the game state before trying again.");
    await settleCast(play.id);
  }, "action-start");
  const resumeCast = () => pendingPlay && action(() => settleCast(pendingPlay.id), "action-start");
  const soundButton = /* @__PURE__ */ jsx7("button", { className: "fv1-icon", type: "button", "aria-label": muted ? "Turn sound on" : "Mute sound", "aria-pressed": !muted, onClick: toggleSound, children: /* @__PURE__ */ jsx7(SoundIcon, { muted }) });
  const feedback = /* @__PURE__ */ jsx7("p", { className: "fv1-feedback", role: error ? "alert" : "status", children: error || message });
  const panelTitle = screen === "pond" ? "The lake" : screen === "shop" ? "Bait & tackle" : screen === "reveal" ? "Your catch" : screen === "collection" ? "Your catches" : screen === "odds" ? "Odds" : "Settings";
  const collection = /* @__PURE__ */ jsxs6(Fragment3, { children: [
    /* @__PURE__ */ jsxs6("div", { className: "fv1-collection-scroll", children: [
      /* @__PURE__ */ jsxs6("div", { className: "fv1-collection-best", children: [
        /* @__PURE__ */ jsxs6("span", { children: [
          totalCount.toString(),
          " kept"
        ] }),
        /* @__PURE__ */ jsx7("span", { className: "fv1-scroll-hint", children: "Scroll for all catches \u2193" }),
        /* @__PURE__ */ jsxs6("span", { children: [
          "Best: ",
          bestIndex < 0 ? "None yet" : fishingItems[bestIndex].name
        ] })
      ] }),
      /* @__PURE__ */ jsx7("div", { className: "fv1-collection", "aria-label": "Catch collection", children: fishingItems.map((item, index2) => /* @__PURE__ */ jsxs6("button", { type: "button", "aria-label": `${item.name}, ${snapshot.inventory[index2]} owned`, "aria-pressed": selectedCatch === index2, "data-owned": snapshot.inventory[index2] > 0n, onClick: () => setSelectedCatch(index2), children: [
        /* @__PURE__ */ jsx7(ItemArt, { item }),
        /* @__PURE__ */ jsx7("span", { children: item.name }),
        /* @__PURE__ */ jsxs6("small", { children: [
          "\xD7",
          snapshot.inventory[index2].toString()
        ] })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxs6("div", { className: "fv1-catch-detail", children: [
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx7("strong", { children: selectedItem.name }),
          /* @__PURE__ */ jsx7("span", { children: rf(selectedValue) })
        ] }),
        /* @__PURE__ */ jsx7("p", { children: selectedCount > 0n ? `${selectedCount} owned \xB7 ${rf(selectedValue)}${selectedValue ? " \xB7 No expiry" : " \xB7 Collectible only"}` : "Not caught yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs6("div", { className: "fv1-actions", children: [
      /* @__PURE__ */ jsxs6("button", { className: "fv1-primary", type: "button", "aria-label": `Sell one ${selectedItem.name}`, disabled: busy || paused || selectedCount === 0n || selectedValue === 0n, onClick: () => void sell(selectedCatch + 1, 1n), children: [
        "Sell \xB7 ",
        rf(selectedValue)
      ] }),
      /* @__PURE__ */ jsxs6("button", { type: "button", disabled: busy || paused || totalValue === 0n, onClick: () => void action(async () => {
        for (let index2 = 0; index2 < fishingItems.length; index2++) if (snapshot.inventory[index2] > 0n && fishingGame.outcomes[index2].reward > 0n) await client.redeem(index2 + 1, snapshot.inventory[index2]);
        setMessage("Sold all fish. Boots stay in your collection.");
      }, "reward"), children: [
        "Sell all \xB7 ",
        rf(totalValue)
      ] })
    ] }),
    feedback
  ] });
  return /* @__PURE__ */ jsxs6("section", { className: "fv1", "aria-label": "Fishing game", "aria-busy": busy, "data-screen": screen, children: [
    /* @__PURE__ */ jsxs6("div", { className: "fv1-world-ui", inert: screen !== "world" || paused || void 0, children: [
      /* @__PURE__ */ jsx7(FishingWorld, { friendId: snapshot.friendId, paused: paused || screen !== "world", reducedMotion: reduceMotion, onNearChange: setNear, onInteract: (target) => target === "pond" ? navigate("pond") : openShop() }, worldRevision),
      /* @__PURE__ */ jsx7(GameHud, { balance: snapshot.rfBalance, currency, itemCount: snapshot.consumables, itemCountLabel: "bait", inventoryCount: totalCount, onInventory: () => navigate("collection"), quest: pendingPlay ? `${pendingPlays.length} pending cast${pendingPlays.length === 1 ? "" : "s"} \xB7 Resume at the lake` : void 0, labels: { balance: isPreview ? "Preview RF" : "Friend wallet RF", inventory: "Your catches" } }),
      /* @__PURE__ */ jsx7("button", { className: "fv1-settings fv1-icon", type: "button", "aria-label": "Settings", onClick: () => navigate("settings"), children: /* @__PURE__ */ jsx7(SettingsIcon, {}) }),
      /* @__PURE__ */ jsx7("div", { className: "fv1-sound", children: soundButton }),
      /* @__PURE__ */ jsx7(ActivityPrompt, { className: "fv1-pond-prompt", label: "Go fishing", detail: pendingPlay ? `Resume cast #${pendingPlay.id}` : "Choose your bait", active: near === "pond", onClick: () => navigate("pond") }),
      /* @__PURE__ */ jsx7(ActivityPrompt, { className: "fv1-shop-prompt", label: "Bait & tackle", active: near === "vendor", onClick: openShop }),
      /* @__PURE__ */ jsx7("span", { className: "fv1-accessible", "data-testid": "bait", children: snapshot.consumables.toString() }),
      /* @__PURE__ */ jsx7("span", { className: "fv1-accessible", "data-testid": "balance", children: rf(snapshot.rfBalance) }),
      screen === "world" && (error || message) && /* @__PURE__ */ jsx7("div", { className: "fv1-world-feedback", children: feedback })
    ] }),
    screen !== "world" && /* @__PURE__ */ jsx7(GameMenu, { title: panelTitle, onClose: busy || casting || screen === "reveal" ? void 0 : () => navigate("world"), children: screen === "pond" || screen === "reveal" ? /* @__PURE__ */ jsx7(
      ExperiencePanel,
      {
        stage: screen === "reveal" ? "reward" : casting ? "working" : "activity",
        itemCatalog: [fishingBait, ...fishingItems],
        itemCounts: { bait: snapshot.consumables },
        selectableItemIds: pendingPlay ? [] : ["bait"],
        selectedItemId: "bait",
        activeItemId: "bait",
        itemCost: pendingPlay ? 0n : 1n,
        balance: snapshot.rfBalance,
        currency,
        onSelectItem: () => {
        },
        workingReady: bite,
        reward: caughtItem && result ? { id: result.id.toString(), itemId: caughtItem.id, quantity: 1n } : null,
        rewardValue: caughtValue,
        revealKey: result?.id.toString(),
        reducedMotion: reduceMotion,
        onRevealComplete: () => sound.current?.play(caughtValue >= 5n * RF ? "reveal-legendary" : caughtValue >= RF ? "reveal-rare" : "reveal-common"),
        onAction: !busy && !paused ? () => {
          void (pendingPlay ? resumeCast() : cast());
        } : void 0,
        onShop: openShop,
        onResolve: !busy && !paused ? () => {
          setCasting(false);
          setScreen("reveal");
          sound.current?.play("impact");
        } : void 0,
        onKeep: !busy && !paused ? () => {
          setSelectedCatch((caughtId ?? 2) - 1);
          setScreen("collection");
          setMessage(`Kept ${caughtItem?.name}.`);
        } : void 0,
        onSellReward: caughtValue > 0n && !busy && !paused ? () => void action(async () => {
          await client.redeem(caughtId, 1n);
          setScreen("world");
          setMessage(`Sold ${caughtItem?.name} for ${rf(caughtValue)}${isPreview ? " in preview" : ""}.`);
        }, "reward") : void 0,
        onClose: busy || casting || screen === "reveal" ? void 0 : () => navigate("world"),
        status: message,
        error,
        labels: { activityLocation: "The lake", rewardLocation: "Your catch", activityTitle: pendingPlay ? `Cast #${pendingPlay.id} pending` : "Choose bait", activityDescription: pendingPlay ? "Check this cast's result. Your bait has already been used." : "One bait. One cast.", action: pendingPlay ? `Resume cast #${pendingPlay.id}` : "Cast \xB7 1 bait", activityCost: pendingPlay ? "No additional bait" : "One bait per cast", openShop: "Visit bait shop", missingItems: "Pick up bait at the shop to get started.", workingTitle: "Gone fishing", workingDescription: "Waiting for a bite\u2026", readyTitle: pendingPlay && !casting ? "Result pending" : "A bite!", readyDescription: "Your catch is ready.", resolve: "Reel in", waiting: "Waiting for a bite\u2026", rewardTitle: "You caught", keep: "Keep catch", sell: `Sell catch \xB7 ${rf(caughtValue)}`, reveal: "Skip reveal", close: "Close The lake" },
        slots: { activityArt: /* @__PURE__ */ jsx7(Bobber, {}), workingArt: /* @__PURE__ */ jsx7(Bobber, { ready: bite }), headerActions: soundButton, footer: /* @__PURE__ */ jsx7("span", { children: "Bait \xB7 1 RF at the shop" }), rewardDetails: screen === "reveal" && caughtId ? /* @__PURE__ */ jsxs6("span", { children: [
          fishingGame.outcomes[caughtId - 1].chanceBps / 100,
          "% chance \xB7 ",
          caughtValue ? "Fixed value. No expiry." : "Collectible only."
        ] }) : void 0 }
      }
    ) : screen === "shop" ? /* @__PURE__ */ jsxs6("div", { className: "fv1-shop-panel", "data-tab": shopTab, children: [
      /* @__PURE__ */ jsxs6("div", { className: "fv1-tabs", role: "tablist", "aria-label": "Bait & tackle", onKeyDown: (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "buy" : event.key === "End" ? "sell" : shopTab === "buy" ? "sell" : "buy";
        setShopTab(next);
        event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus();
      }, children: [
        /* @__PURE__ */ jsx7("button", { type: "button", role: "tab", "data-tab": "buy", tabIndex: shopTab === "buy" ? 0 : -1, disabled: busy || paused, "aria-selected": shopTab === "buy", onClick: () => setShopTab("buy"), children: "Bait" }),
        /* @__PURE__ */ jsx7("button", { type: "button", role: "tab", "data-tab": "sell", tabIndex: shopTab === "sell" ? 0 : -1, disabled: busy || paused, "aria-selected": shopTab === "sell", onClick: () => setShopTab("sell"), children: "Sell fish" })
      ] }),
      shopTab === "buy" ? /* @__PURE__ */ jsxs6(Fragment3, { children: [
        /* @__PURE__ */ jsxs6("div", { className: "fv1-shop-stock", children: [
          /* @__PURE__ */ jsxs6("div", { className: "fv1-bait-card", children: [
            /* @__PURE__ */ jsx7(ItemArt, { item: fishingBait }),
            /* @__PURE__ */ jsx7("strong", { children: "Bait" }),
            /* @__PURE__ */ jsx7("span", { children: "1 RF each" }),
            /* @__PURE__ */ jsxs6("small", { children: [
              snapshot.consumables.toString(),
              " owned"
            ] })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "fv1-shop-copy", children: [
            /* @__PURE__ */ jsxs6("h3", { children: [
              "A little bait.",
              /* @__PURE__ */ jsx7("br", {}),
              "A little luck."
            ] }),
            /* @__PURE__ */ jsx7("p", { children: "One bait gives one cast at the lake." }),
            /* @__PURE__ */ jsxs6("label", { className: "fv1-quantity", children: [
              "Quantity ",
              /* @__PURE__ */ jsx7("input", { inputMode: "numeric", type: "number", min: "1", max: "99", value: quantity, onChange: (event) => setQuantity(event.target.value) })
            ] }),
            /* @__PURE__ */ jsx7("button", { className: "fv1-link", type: "button", onClick: () => navigate("odds"), children: "View odds" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "fv1-summary", children: [
          /* @__PURE__ */ jsxs6("span", { children: [
            count.toString(),
            " bait"
          ] }),
          /* @__PURE__ */ jsx7("strong", { children: rf(cost) })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "fv1-actions", children: [
          /* @__PURE__ */ jsxs6("button", { className: "fv1-primary", type: "button", disabled: busy || paused || !canBuy, onClick: () => void action(async () => {
            await client.buy(count);
            setMessage(`Bought ${count} bait${isPreview ? " with simulated RF" : ""}.`);
          }, "purchase"), children: [
            "Buy bait ",
            /* @__PURE__ */ jsx7("span", { "aria-hidden": "true", children: "\u2197" })
          ] }),
          /* @__PURE__ */ jsxs6("button", { type: "button", disabled: busy, onClick: () => navigate("pond"), children: [
            "Back to the pond ",
            /* @__PURE__ */ jsx7("span", { "aria-hidden": "true", children: "\u2192" })
          ] })
        ] }),
        /* @__PURE__ */ jsx7("p", { className: "fv1-feedback", role: error ? "alert" : "status", children: error || message || (!hasBacking ? "Bait sales paused: not enough free stake. Purchased bait remains playable." : snapshot.rfBalance < cost ? isPreview ? "Not enough simulated RF." : "Not enough RF in this Friend wallet." : count === 0n ? "Choose 1 to 99 bait." : `${rf(snapshot.rfBalance)} available \xB7 ${isPreview ? "Simulated RF" : "Friend wallet"}`) })
      ] }) : /* @__PURE__ */ jsx7("div", { className: "fv1-collection-panel", children: collection })
    ] }) : screen === "collection" ? /* @__PURE__ */ jsx7("div", { className: "fv1-collection-panel", children: collection }) : /* @__PURE__ */ jsxs6("div", { className: "fv1-text-panel", children: [
      screen === "odds" ? /* @__PURE__ */ jsxs6(Fragment3, { children: [
        /* @__PURE__ */ jsx7("p", { children: "1 RF per bait \xB7 Expected return 0.90 RF \xB7 10% vendor edge" }),
        /* @__PURE__ */ jsxs6("table", { children: [
          /* @__PURE__ */ jsx7("thead", { children: /* @__PURE__ */ jsxs6("tr", { children: [
            /* @__PURE__ */ jsx7("th", { children: "Catch" }),
            /* @__PURE__ */ jsx7("th", { children: "Chance" }),
            /* @__PURE__ */ jsx7("th", { children: "Value" })
          ] }) }),
          /* @__PURE__ */ jsx7("tbody", { children: fishingGame.outcomes.map((outcome) => /* @__PURE__ */ jsxs6("tr", { children: [
            /* @__PURE__ */ jsx7("th", { scope: "row", children: outcome.name }),
            /* @__PURE__ */ jsxs6("td", { children: [
              outcome.chanceBps / 100,
              "%"
            ] }),
            /* @__PURE__ */ jsx7("td", { children: rf(outcome.reward) })
          ] }, outcome.name)) })
        ] }),
        /* @__PURE__ */ jsx7("p", { children: "Every bait reserves 10 RF. Kept fish remain backed until sold." }),
        /* @__PURE__ */ jsxs6("p", { children: [
          "Free stake: ",
          /* @__PURE__ */ jsx7("span", { "data-testid": "free-stake", children: rf(snapshot.freeStake) })
        ] })
      ] }) : /* @__PURE__ */ jsxs6(Fragment3, { children: [
        /* @__PURE__ */ jsx7("p", { children: isPreview ? "Local preview. Simulated RF and outcomes; no live transactions. Progress resets on reload." : "Robinhood mainnet. Purchases and rewards use this Friend's canonical RF wallet. Resume pending casts at the lake." }),
        /* @__PURE__ */ jsx7("button", { type: "button", "aria-pressed": !muted, onClick: toggleSound, children: muted ? "Sound off" : "Sound on" }),
        /* @__PURE__ */ jsxs6("label", { className: "fv1-motion", children: [
          /* @__PURE__ */ jsx7("input", { type: "checkbox", checked: reduceMotion, onChange: (event) => setReduceMotion(event.target.checked) }),
          " Reduce motion"
        ] }),
        /* @__PURE__ */ jsx7("button", { type: "button", onClick: () => setWorldRevision((value) => value + 1), children: "Reset walking position" }),
        /* @__PURE__ */ jsx7("button", { type: "button", onClick: () => navigate("odds"), children: "Odds" }),
        /* @__PURE__ */ jsx7("p", { children: "Click or tap to walk. Use arrows or WASD while the world is focused; press E near the pond or shop." })
      ] }),
      feedback
    ] }) })
  ] });
}
var index_default = FishingGame;
export {
  FishingGame,
  FishingPreview,
  index_default as default,
  fishingGame,
  fishingItems
};
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
