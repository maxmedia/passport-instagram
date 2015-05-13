var crypto = require('crypto'),
    url = require('url');

/**
 * Generate a request signature for an Instagram request.
 * @param [String] endpoint - Instagram endpoint (e.g. `"/media/657988443280050001_25025320"`).
 *                 The `endpont` will automatically be stripped of preceeding `"/v1"`
 * @param [Object] params - query params
 * @param [String] secret - Instragram app client secret
 * @returns [String] signature for `sig`
 * @see https://instagram.com/developer/secure-api-requests/
 * @example
 *     var endpoint = '/media/657988443280050001_25025320',
 *         params = {
 *           limit: 100,
 *           access_token: "user access token"
 *         },
 *     params.sig = instaSig.generate(endpoint, params, process.env.INSTAGRAM_CLIENT_SECRET);
 * @example
 *     var requestOpts = {
 *           url: 'https://api.instagram.com/v1/media/657988443280050001_25025320',
 *           qs: {
 *             limit: 100,
 *             access_token: "user access token"
 *           }
 *         };
 *     requestOpts.qs.sig = instaSig.generate(endpoint, params, process.env.INSTAGRAM_CLIENT_SECRET);
 */
function generate(endpoint, params, secret) {
  if (/^http/.test(endpoint)) {
    endpoint = url.parse(endpoint).pathname;
  }

  var sig = [ endpoint.replace(/^\/v1\b/, '') ];

  Object.keys(params).sort().forEach(function(key) {
    sig.push(key.toString() + '=' + params[key].toString());
  });

  var shasum = crypto.createHmac('sha256', secret);
  shasum.update(sig.join('|'));
  return shasum.digest('hex');
}

exports.generate = generate;

/**
 * Sign the request params for an Instagram request in place.
 * @param [String] endpoint - Instagram endpoint (e.g. `"/media/657988443280050001_25025320"`).
 *                 The `endpont` will automatically be stripped of preceeding `"/v1"`
 * @param [Object] params - query params
 * @param [String] secret - Instragram app client secret
 * @returns [Object] params with sig added
 * @see https://instagram.com/developer/secure-api-requests/
 * @example
 *     var endpoint = '/media/657988443280050001_25025320',
 *         params = {
 *           limit: 100,
 *           access_token: "user access token"
 *         },
 *     instaSig.signParams(endpoint, params, process.env.INSTAGRAM_CLIENT_SECRET);
 * @example
 *     var requestOpts = {
 *           url: 'https://api.instagram.com/v1/media/657988443280050001_25025320',
 *           qs: {
 *             limit: 100,
 *             access_token: "user access token"
 *           }
 *         };
 *     instaSig.signParams(requestOpts.url, requestOpts.qs, process.env.INSTAGRAM_CLIENT_SECRET);
 */
exports.signParams = function(endpoint, params, secret) {
  var sig = generate(endpoint, params, secret);
  params.sig = sig;
  return params;
};
