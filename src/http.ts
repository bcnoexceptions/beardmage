import * as https from "https";

/**
 * Performs a basic HTTPS GET request from the given URL.
 * 
 * @param url The URL to get data from.
 * @returns A Promise with the raw text of the GET request.
 */
export async function getFromUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let error: string;
            if (res.statusCode !== 200) {
                error = `Failed to retrieve news. Status code: ${res.statusCode}`;
            }
    
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                if(error){
                    error += `\n${rawData}`;
                    reject(error);
                } else {
                    resolve(rawData);
                }
            });
        }).on('error', (e) => {
            reject(`Failed to retrieve news: ${e}`);
        });
    });
    


}