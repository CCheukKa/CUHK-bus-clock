import { JSONParser } from '@streamparser/json';

let scraped = false;
let isScraping = false;
let publicHolidays: string[] = [];

type DateTuple = [string, { value: string }];
type HKPublicHolidayCalendar = {
    vcalendar: {
        prodid: string;
        version: string;
        calscale: string;
        'x-wr-timezone': string;
        'x-wr-calname': string;
        'x-wr-caldesc': string;
        vevent: VEvent[];
    }[];
};
type VEvent = {
    dtstart: DateTuple;
    dtend: DateTuple;
    dtstamp: string;
    transp: string;
    uid: string;
    summary: string;
};

async function scrapePublicHolidays() {
    if (isScraping || (scraped && publicHolidays.length > 0)) { return; }
    isScraping = true;

    console.log('[PublicHolidayScraper][scrapePublicHolidays] Scraping public holidays...');
    const response = await fetch('https://www.1823.gov.hk/common/ical/en.json');
    if (!response.ok) {
        console.error(`[PublicHolidayScraper][scrapePublicHolidays] Network response was not ok: ${response.status} ${response.statusText}`);
        isScraping = false;
        return;
    }
    if (!response.body) {
        console.error('[PublicHolidayScraper][scrapePublicHolidays] Response body is null or non-streamable.');
        isScraping = false;
        return;
    }

    const data = await parseBodyJSON<HKPublicHolidayCalendar>(response.body);
    const scrapedHolidays: VEvent[] = data.vcalendar[0].vevent
        ?? (() => {
            console.error('[PublicHolidayScraper][scrapePublicHolidays] Malformed data');
            return [];
        })();
    publicHolidays = scrapedHolidays.map(scrapedHoliday => scrapedHoliday.dtstart[0]);
    scraped = true;
    isScraping = false;
    console.log(`[PublicHolidayScraper][scrapePublicHolidays] Scraped public holidays, got ${publicHolidays.length} holidays`);
}

export function isPublicHoliday(time: Date): boolean {
    scrapePublicHolidays();
    const dateString = `${time.getFullYear()}${(time.getMonth() + 1).toString().padStart(2, '0')}${time.getDate().toString().padStart(2, '0')}`;
    return publicHolidays.includes(dateString);
}

async function parseBodyJSON<T = unknown>(body: ReadableStream<Uint8Array<ArrayBuffer>>): Promise<T> {
    const reader = body.getReader();
    const parser = new JSONParser();

    let result: T | undefined;

    parser.onValue = ({ value, stack }) => {
        if (stack.length === 0) {
            result = value as T;
        }
    };

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        parser.write(value);
    }

    if (result === undefined) {
        throw new Error('[PublicHolidayScraper][parseBodyJSON] Stream ended without producing a valid root JSON value.');
    }

    return result;
}