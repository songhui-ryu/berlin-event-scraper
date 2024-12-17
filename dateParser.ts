/**
 * Date utils
 */

export type DateRange = {
    start: Date | undefined;
    end: Date | undefined;
    locale: "en" | "de" | undefined;
    originalString: string;
};

export const MONTHS = [
    ["january", "januar"],
    ["february", "februar"],
    ["march", "maerz"],
    ["april", "april"],
    ["may", "mai"],
    ["june", "juni"],
    ["july", "juli"],
    ["august", "august"],
    ["september", "september"],
    ["october", "oktober"],
    ["november", "november"],
    ["december", "dezember"],
];

/**
 * Build Date object set to 6AM CET
 * @param {string} year
 * @param {string} month
 * @param {string} day
 * @returns {Date}
 */
function getDate(year: string, month: string, day: string) {
    if (day.length == 1) {
        day = `0${day}`;
    }
    return new Date(`${year}-${month}-${day}T06:00:00+01:00`);
}

/**
 * Parse english date string from berlin.de.
 * Note: The format of the date has no dedicated rules. So keep an eye on it!
 * @param {string} date
 * @returns {DateRange}
 */
export function parseEnglishDate(date: string): DateRange {
    // Regex for English dates
    const englishSingleDateRegex = /([a-zA-Z]+)\s*(\d{1,2}),?\s*(\d{4})/;
    const englishRangeRegex =
        /([a-zA-Z]+)\s*(\d{1,2}),?\s*(\d{4})?\s*(?:to|and|-)\s*([a-zA-Z]*)\s*(\d{1,2}),?\s*(\d{4})/;

    // Check for English range
    if (englishRangeRegex.test(date)) {
        const match = date.match(englishRangeRegex);
        if (match) {
            const startYear = match[3] ? match[3] : match[6];

            const endMonthString = match[4]
                ? getMonthIndex(match[4])
                : getMonthIndex(match[1]);

            return {
                start: getDate(startYear, getMonthIndex(match[1]), match[2]),
                end: getDate(match[6], endMonthString, match[5]),
                locale: "en",
                originalString: date,
            };
        }
    }

    // Check for English single
    if (englishSingleDateRegex.test(date)) {
        const match = date.match(englishSingleDateRegex);
        if (match) {
            return {
                start: getDate(match[3], getMonthIndex(match[1]), match[2]),
                end: getDate(match[3], getMonthIndex(match[1]), match[2]),
                locale: "en",
                originalString: date,
            };
        }
    }

    return {
        start: undefined,
        end: undefined,
        locale: undefined,
        originalString: date,
    };
}

/**
 * Parse german date string from berlin.de.
 * Note: The format of the date has no dedicated rules. So keep an eye on it!
 * @param {string} date
 * @returns {DateRange}
 */
export function parseGermanDate(date: string): DateRange {
    // Regex for German dates
    const germanSingleDateRegex = /(\d{1,2})\.?\s*([a-zA-Zä]+)\s*(\d{4})/;
    const germanRangeRegex =
        /(\d{1,2})\.?\s*([a-zA-Zä]+)?\s*(\d{4})?\s*bis\s*(\d{1,2})\.?\s*([a-zA-Zä]+)\s*(\d{4})/;

    // Check for German range
    if (germanRangeRegex.test(date)) {
        const match = date.match(germanRangeRegex);
        if (match) {
            const startYear = match[3] ? match[3] : match[6];
            const startMonthString = match[2]
                ? getMonthIndex(match[2])
                : getMonthIndex(match[5]);

            return {
                start: getDate(startYear, startMonthString, match[1]),
                end: getDate(match[6], getMonthIndex(match[5]), match[4]),
                locale: "de",
                originalString: date,
            };
        }
    }

    // Check for German single
    if (germanSingleDateRegex.test(date)) {
        const match = date.match(germanSingleDateRegex);
        if (match) {
            return {
                start: getDate(match[3], getMonthIndex(match[2]), match[1]),
                end: getDate(match[3], getMonthIndex(match[2]), match[1]),
                locale: "de",
                originalString: date,
            };
        }
    }
    return {
        start: undefined,
        end: undefined,
        locale: undefined,
        originalString: date,
    };
}

/**
 * Get month index from month name
 * @param {string} month
 * @returns {string}
 */
export function getMonthIndex(month: string): string {
    const monthMap: { [key: string]: string } = {
        "January": "01",
        "February": "02",
        "March": "03",
        "April": "04",
        "May": "05",
        "June": "06",
        "July": "07",
        "August": "08",
        "September": "09",
        "October": "10",
        "November": "11",
        "December": "12",
        "Januar": "01",
        "Februar": "02",
        "März": "03",
        "Mai": "05",
        "Juni": "06",
        "Juli": "07",
        "Oktober": "10",
        "Dezember": "12",
    };
    return monthMap[month] || "";
}

/**
 * Get month name from month index
 * @param {number} monthIndex
 * @param {string} lang
 * @returns {string}
 */
export function getMonthName(monthIndex: number, lang: "en" | "de"): string {
    const monthName = MONTHS[monthIndex];
    return lang == "en" ? monthName[0] : monthName[1];
}
