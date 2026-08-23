import { Temporal } from '@js-temporal/polyfill';
import { JSONParser } from '@streamparser/json';

let scraped = false;
let isScraping = false;
let publicHolidays: Temporal.PlainDate[] = [];

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
    publicHolidays = scrapedHolidays.flatMap(scrapedHoliday => {
        const dtstart = scrapedHoliday.dtstart[0];
        const dtend = scrapedHoliday.dtend[0];
        const startDate = new Temporal.PlainDate(parseInt(dtstart.slice(0, 4)), parseInt(dtstart.slice(4, 6)), parseInt(dtstart.slice(6, 8)));
        const endDate = new Temporal.PlainDate(parseInt(dtend.slice(0, 4)), parseInt(dtend.slice(4, 6)), parseInt(dtend.slice(6, 8)));
        return Array.from({ length: startDate.until(endDate).total('days') }, (_, i) => startDate.add({ days: i }));
    });

    scraped = true;
    isScraping = false;
    console.log(`[PublicHolidayScraper][scrapePublicHolidays] Scraped public holidays, got ${publicHolidays.length} holidays`);
}

export function isPublicHoliday(testDate: Temporal.PlainDate): boolean {
    scrapePublicHolidays();
    return publicHolidays.some(holiday => holiday.equals(testDate));
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