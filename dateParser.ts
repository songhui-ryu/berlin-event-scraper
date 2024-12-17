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

function padDay(day: string) {
    if (day.length == 1) {
        return `0${day}`;
    } else {
        return day;
    }
}

/**
 * Parse english date string from berlin.de.
 * Note: The format of the date has no dedicated rules. So keep an eye on it!
 * @param {string} date
 * @returns {DateRange}
 */
export function parseEnglishDate(date: string): DateRange {
    let startDate: Date;
    let endDate: Date;

    // Regex for English dates
    const englishSingleDateRegex = /([a-zA-Z]+)\s*(\d{1,2}),?\s*(\d{4})/;
    const englishRangeRegex =
        /([a-zA-Z]+)\s*(\d{1,2}),?\s*(\d{4})?\s*(?:to|and|-)\s*([a-zA-Z]*)\s*(\d{1,2}),?\s*(\d{4})/;

    // Check for English range
    if (englishRangeRegex.test(date)) {
        const match = date.match(englishRangeRegex);
        if (match) {
            const startYear = match[3] ? match[3] : match[6];
            const startDay = padDay(match[2]);

            startDate = new Date(
                `${startYear}-${getMonthIndex(match[1])}-${startDay}T00:00:00`,
            );

            const endMonthString = match[4]
                ? getMonthIndex(match[4])
                : getMonthIndex(match[1]);
            const endDay = padDay(match[5]);

            endDate = new Date(
                `${match[6]}-${endMonthString}-${endDay}T00:00:00`,
            );

            if (endDate.toString().includes("Invalid")) {
                console.log(match);
                console.log(match[6]);
                console.log(endMonthString);
                console.log(startDay);
            }

            return {
                start: startDate,
                end: endDate,
                locale: "en",
                originalString: date,
            };
        }
    }

    // Check for English single
    if (englishSingleDateRegex.test(date)) {
        const match = date.match(englishSingleDateRegex);
        if (match) {
            const startDay = padDay(match[2]);
            startDate = new Date(
                `${match[3]}-${getMonthIndex(match[1])}-${startDay}T00:00:00`,
            );

            endDate = new Date(startDate);

            return {
                start: startDate,
                end: endDate,
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
    let startDate: Date;
    let endDate: Date;

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
            const startDay = padDay(match[1]);

            startDate = new Date(
                `${startYear}-${startMonthString}-${startDay}T00:00:00`,
            );

            const endDay = padDay(match[4]);
            endDate = new Date(
                `${match[6]}-${getMonthIndex(match[5])}-${endDay}T00:00:00`,
            );

            return {
                start: startDate,
                end: endDate,
                locale: "de",
                originalString: date,
            };
        }
    }

    // Check for German single
    if (germanSingleDateRegex.test(date)) {
        const match = date.match(germanSingleDateRegex);
        if (match) {
            const startDay = padDay(match[1]);
            startDate = new Date(
                `${match[3]}-${getMonthIndex(match[2])}-${startDay}T00:00:00`,
            );

            endDate = new Date(startDate);

            return {
                start: startDate,
                end: endDate,
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
