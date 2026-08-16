export class SolcLoader {

    constructor() { }

    public static async loadCompilerVersion(version: string = 'latest'): Promise<any> {
        // Ideally we fetch the javascript binary from a CDN
        // For the sake of this environment, we might try to import the installed 'solc' 
        // package if we are in a node-compatible environment, but in browser we need the CDN URL.
        const url = `https://binaries.soliditylang.org/bin/soljson-${version}.js`
        // We will pass this URL to the worker to importScripts
        return url;
    }
}
