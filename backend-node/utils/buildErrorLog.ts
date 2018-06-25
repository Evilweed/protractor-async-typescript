import * as _ from 'lodash';

const lineSeparator = '\n';
const logHeader = '\n------------------------------BACKEND SEED ERROR -----------------------------------';
const logFooter = '------------------------------------------------------------------------------------';

/***
 * Builds error log
 * @param message String
 * @param stacktrace String[]
 * @param httpResponseCode String
 * @param body String
 * @returns {string}
 */
export const buildErrorLog = (err) => {
    let message = _.get(err, ['response', 'body', 'errors'], 'Unknown error message');
    let stacktrace = _.get(err, ['response', 'body', 'stacktrace'], 'Missing stack trace');
    let body = _.get(err, ['response', 'body']);
    let httpResponseCode = err.statusCode;

    let logParts = [logHeader];
    if (httpResponseCode) { logParts.push('Backend has responded with: ' + httpResponseCode + ' response code'); }
    logParts.push(message);

    if (stacktrace instanceof Array) {
        let finalStackTrace = stacktrace.slice(0, 10);
        finalStackTrace.push(['...']);
        logParts.push(finalStackTrace.join(lineSeparator));
    } else {
        logParts.push('Missing stacktrace. Something went wrong');
        logParts.push(err);
    }

    if (body) {logParts.push('rawResponse: ' + body); }
    logParts.push(logFooter);

    return logParts.join(lineSeparator);
};