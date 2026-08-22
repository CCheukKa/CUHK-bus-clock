let scraped = false;
let isScraping = false;
let publicHolidays: string[] = [];

type ScrapedHolidays = {
    dtstart: [string],
    dtend: [string],
}
async function scrapePublicHolidays() {
    if (isScraping || (scraped && publicHolidays.length > 0)) { return; }
    isScraping = true;

    console.log('[PublicHolidayScraper][scrapePublicHolidays] Scraping public holidays...');
    const response = await fetch('https://www.1823.gov.hk/common/ical/en.json');
    if (!response.ok) {
        console.error('[PublicHolidayScraper][scrapePublicHolidays] Network response was not ok');
        isScraping = false;
        return;
    }

    // TODO: FIXME: Implement an actual fix to stream(?) the large JSON without running out of parser memory
    const data = JSON.parse((await response.text()).replaceAll(/\s+/g, ""));
    const scrapedHolidays: ScrapedHolidays[] = data.vcalendar[0].vevent
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