"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var viem_1 = require("viem");
var accounts_1 = require("viem/accounts");
var chains_1 = require("viem/chains");
var weth_abi_1 = require("./abi/weth-abi");
/* For the 0x Challenge on Scroll, implement the following

1. Display the percentage breakdown of liquidity sources
2. Monetize your app with affiliate fees and surplus collection
3. Display buy/sell tax for tokens with tax
4. Display all sources of liquidity on Scroll

*/
// // Function to fetch liquidity sources and their percentages
// const fetchLiquiditySources = async () => {
//   const response = await fetch("https://api.0x.org/swap/v1/sources");
//   const data = await response.json();
//   return data.sources;
// };
// // Function to calculate and display liquidity sources breakdown
// const displayLiquiditySourcesBreakdown = async () => {
//   const sources = await fetchLiquiditySources();
//   const total = sources.reduce((acc, source) => acc + source.proportion, 0);
//   sources.forEach((source) => {
//     const percentage = ((source.proportion / total) * 100).toFixed(2);
//     console.log(`${source.name}: ${percentage}%`);
//   });
// };
// // Function to display buy/sell tax for tokens with tax
// const displayTokenTax = async (tokenAddress) => {
//   const response = await fetch(`https://api.0x.org/swap/v1/token/${tokenAddress}`);
//   const data = await response.json();
//   if (data.tax) {
//     console.log(`Buy Tax: ${data.tax.buy}%`);
//     console.log(`Sell Tax: ${data.tax.sell}%`);
//   } else {
//     console.log("No tax information available for this token.");
//   }
// };
// // Function to monetize app with affiliate fees and surplus collection
// const monetizeApp = (quote) => {
//   const affiliateFee = 0.01; // 1% affiliate fee
//   const surplus = quote.price * affiliateFee;
//   console.log(`Affiliate Fee: ${affiliateFee * 100}%`);
//   console.log(`Surplus Collected: ${surplus}`);
// };
// // Display all sources of liquidity on Scroll
// const displayAllLiquiditySources = async () => {
//   const sources = await fetchLiquiditySources();
//   console.log("All liquidity sources on Scroll:");
//   sources.forEach((source) => {
//     console.log(source.name);
//   });
// };
// // Call the functions to display the required information
// await displayLiquiditySourcesBreakdown();
// await displayTokenTax(weth.address);
// await displayAllLiquiditySources();
var qs = require("qs");
// load env vars
(0, dotenv_1.config)();
var _a = process.env, PRIVATE_KEY = _a.PRIVATE_KEY, ZERO_EX_API_KEY = _a.ZERO_EX_API_KEY, ALCHEMY_HTTP_TRANSPORT_URL = _a.ALCHEMY_HTTP_TRANSPORT_URL;
// validate requirements
if (!PRIVATE_KEY)
    throw new Error("missing PRIVATE_KEY.");
if (!ZERO_EX_API_KEY)
    throw new Error("missing ZERO_EX_API_KEY.");
if (!ALCHEMY_HTTP_TRANSPORT_URL)
    throw new Error("missing ALCHEMY_HTTP_TRANSPORT_URL.");
// fetch headers
var headers = new Headers({
    "Content-Type": "application/json",
    "0x-api-key": ZERO_EX_API_KEY,
    "0x-version": "v2",
});
// setup wallet client
var client = (0, viem_1.createWalletClient)({
    account: (0, accounts_1.privateKeyToAccount)("0x".concat(PRIVATE_KEY)),
    chain: chains_1.scroll,
    transport: (0, viem_1.http)(ALCHEMY_HTTP_TRANSPORT_URL),
}).extend(viem_1.publicActions); // extend wallet client with publicActions for public client
var address = (await client.getAddresses())[0];
// set up contracts
var weth = (0, viem_1.getContract)({
    address: "0x5300000000000000000000000000000000000004",
    abi: weth_abi_1.wethAbi,
    client: client,
});
var wsteth = (0, viem_1.getContract)({
    address: "0xf610A9dfB7C89644979b4A0f27063E9e7d7Cda32",
    abi: viem_1.erc20Abi,
    client: client,
});
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var decimals, sellAmount, priceParams, priceResponse, _a, _b, price, request, hash, _c, _d, _e, error_1, quoteParams, _i, _f, _g, key, value, quoteResponse, quote, signature, error_2, signatureLengthInHex, transactionData, sigLengthHex, sig, nonce, signedTransaction, hash;
    var _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0: return [4 /*yield*/, weth.read.decimals()];
            case 1:
                decimals = (_k.sent());
                sellAmount = (0, viem_1.parseUnits)("0.1", decimals);
                priceParams = new URLSearchParams({
                    chainId: client.chain.id.toString(),
                    sellToken: weth.address,
                    buyToken: wsteth.address,
                    sellAmount: sellAmount.toString(),
                    taker: client.account.address,
                });
                return [4 /*yield*/, fetch("https://api.0x.org/swap/permit2/price?" + priceParams.toString(), {
                        headers: headers,
                    })];
            case 2:
                priceResponse = _k.sent();
                _b = (_a = console).log;
                return [4 /*yield*/, priceResponse.json()];
            case 3:
                _b.apply(_a, [_k.sent()]);
                return [4 /*yield*/, priceResponse.json()];
            case 4:
                price = _k.sent();
                console.log("Fetching price to swap 0.1 WETH for wstETH");
                console.log("https://api.0x.org/swap/permit2/price?".concat(priceParams.toString()));
                console.log("priceResponse: ", price);
                if (!(price.issues.allowance !== null)) return [3 /*break*/, 11];
                _k.label = 5;
            case 5:
                _k.trys.push([5, 9, , 10]);
                return [4 /*yield*/, weth.simulate.approve([
                        price.issues.allowance.spender,
                        viem_1.maxUint256,
                    ])];
            case 6:
                request = (_k.sent()).request;
                console.log("Approving Permit2 to spend WETH...", request);
                return [4 /*yield*/, weth.write.approve(request.args)];
            case 7:
                hash = _k.sent();
                _d = (_c = console).log;
                _e = ["Approved Permit2 to spend WETH."];
                return [4 /*yield*/, client.waitForTransactionReceipt({ hash: hash })];
            case 8:
                _d.apply(_c, _e.concat([_k.sent()]));
                return [3 /*break*/, 10];
            case 9:
                error_1 = _k.sent();
                console.log("Error approving Permit2:", error_1);
                return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 12];
            case 11:
                console.log("WETH already approved for Permit2");
                _k.label = 12;
            case 12:
                quoteParams = new URLSearchParams();
                for (_i = 0, _f = priceParams.entries(); _i < _f.length; _i++) {
                    _g = _f[_i], key = _g[0], value = _g[1];
                    quoteParams.append(key, value);
                }
                return [4 /*yield*/, fetch("https://api.0x.org/swap/permit2/quote?" + quoteParams.toString(), {
                        headers: headers,
                    })];
            case 13:
                quoteResponse = _k.sent();
                return [4 /*yield*/, quoteResponse.json()];
            case 14:
                quote = _k.sent();
                console.log("Fetching quote to swap 1000 WETH for wstETH");
                console.log("quoteResponse: ", quote);
                if (!((_h = quote.permit2) === null || _h === void 0 ? void 0 : _h.eip712)) return [3 /*break*/, 19];
                _k.label = 15;
            case 15:
                _k.trys.push([15, 17, , 18]);
                return [4 /*yield*/, client.signTypedData(quote.permit2.eip712)];
            case 16:
                signature = _k.sent();
                console.log("Signed permit2 message from quote response");
                return [3 /*break*/, 18];
            case 17:
                error_2 = _k.sent();
                console.error("Error signing permit2 coupon:", error_2);
                return [3 /*break*/, 18];
            case 18:
                // 5. append sig length and sig data to transaction.data
                if (signature && ((_j = quote === null || quote === void 0 ? void 0 : quote.transaction) === null || _j === void 0 ? void 0 : _j.data)) {
                    signatureLengthInHex = (0, viem_1.numberToHex)((0, viem_1.size)(signature), {
                        signed: false,
                        size: 32,
                    });
                    transactionData = quote.transaction.data;
                    sigLengthHex = signatureLengthInHex;
                    sig = signature;
                    quote.transaction.data = (0, viem_1.concat)([transactionData, sigLengthHex, sig]);
                }
                else {
                    throw new Error("Failed to obtain signature or transaction data");
                }
                _k.label = 19;
            case 19:
                if (!(signature && quote.transaction.data)) return [3 /*break*/, 23];
                return [4 /*yield*/, client.getTransactionCount({
                        address: client.account.address,
                    })];
            case 20:
                nonce = _k.sent();
                return [4 /*yield*/, client.signTransaction({
                        account: client.account,
                        chain: client.chain,
                        gas: !!(quote === null || quote === void 0 ? void 0 : quote.transaction.gas)
                            ? BigInt(quote === null || quote === void 0 ? void 0 : quote.transaction.gas)
                            : undefined,
                        to: quote === null || quote === void 0 ? void 0 : quote.transaction.to,
                        data: quote.transaction.data,
                        value: (quote === null || quote === void 0 ? void 0 : quote.transaction.value)
                            ? BigInt(quote.transaction.value)
                            : undefined, // value is used for native tokens
                        gasPrice: !!(quote === null || quote === void 0 ? void 0 : quote.transaction.gasPrice)
                            ? BigInt(quote === null || quote === void 0 ? void 0 : quote.transaction.gasPrice)
                            : undefined,
                        nonce: nonce,
                    })];
            case 21:
                signedTransaction = _k.sent();
                return [4 /*yield*/, client.sendRawTransaction({
                        serializedTransaction: signedTransaction,
                    })];
            case 22:
                hash = _k.sent();
                console.log("Transaction hash:", hash);
                console.log("See tx details at https://scrollscan.com/tx/".concat(hash));
                return [3 /*break*/, 24];
            case 23:
                console.error("Failed to obtain a signature, transaction not sent.");
                _k.label = 24;
            case 24: return [2 /*return*/];
        }
    });
}); };
main();
