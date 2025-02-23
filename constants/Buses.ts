export enum BusRoute {
    _1A = '1A',
    _1B = '1B',
    _2Y = '2+', // stops at sir run run shaw hall
    _2N = '2', // doesn't stop at sir run run shaw hall
    _3 = '3',
    _4 = '4',
    _5D = '5', // weekdays
    _5E = '5', // weekends
    _6AD = '6A', // weekdays
    _6AE = '6A', // weekends
    _6B = '6B',
    _7D = '7', // weekdays
    _7E = '7', // weekends
    _8 = '8',
    _NY = 'N+', // stops at pg hall 1
    _NN = 'N', // doesn't stop at pg hall 1
    _HY = 'H+', // stops at pg hall 1 & area 39 (upwards)
    _HN = 'H', // doesn't stop at pg hall 1 & area 39 (upwards)
};

export const BusColours = new Map<BusRoute, string>([
    [BusRoute._1A, '#f2e421'],
    [BusRoute._1B, '#f2e421'],
    [BusRoute._2Y, '#ec4790'],
    [BusRoute._2N, '#ec4790'],
    [BusRoute._3, '#318761'],
    [BusRoute._4, '#e75a24'],
    [BusRoute._5D, '#29a1d8'],
    [BusRoute._5E, '#29a1d8'],
    [BusRoute._6AD, '#7c8644'],
    [BusRoute._6AE, '#7c8644'],
    [BusRoute._7D, '#666666'], // weekdays
    [BusRoute._7E, '#666666'], // weekends
    [BusRoute._8, '#ffc55a'],
    [BusRoute._NY, '#7961a8'],
    [BusRoute._NN, '#7961a8'],
    [BusRoute._HY, '#453087'],
    [BusRoute._HN, '#453087'],
]);

export type BusRouteInfo = {
    firstService: [number, number],
    lastService: [number, number],
    days: number[],
    minuteMarks: number[],
};

export const BusRouteInfos = new Map<BusRoute, BusRouteInfo>([
    [BusRoute._1A, {
        firstService: [7, 40],
        lastService: [18, 40],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [10, 20, 40, 50],
    }],
    [BusRoute._1B, {
        firstService: [8, 0],
        lastService: [18, 0],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [0, 30],
    }],
    [BusRoute._2Y, {
        firstService: [7, 45],
        lastService: [18, 45],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [0, 45],
    }],
    [BusRoute._2N, {
        firstService: [7, 45],
        lastService: [18, 45],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [15, 30],
    }],
    [BusRoute._3, {
        firstService: [9, 0],
        lastService: [18, 40],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [0, 20, 40],
    }],
    [BusRoute._4, {
        firstService: [7, 30],
        lastService: [18, 50],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [10, 30, 50],
    }],
    [BusRoute._5D, {
        firstService: [9, 18],
        lastService: [17, 26],
        days: [1, 2, 3, 4, 5],
        minuteMarks: [18, 22, 26],
    }],
    [BusRoute._5E, {
        firstService: [9, 18],
        lastService: [13, 26],
        days: [6],
        minuteMarks: [18, 22, 26],
    }],
    [BusRoute._6AD, {
        firstService: [9, 10],
        lastService: [17, 10],
        days: [1, 2, 3, 4, 5],
        minuteMarks: [10],
    }],
    [BusRoute._6AE, {
        firstService: [9, 10],
        lastService: [13, 10],
        days: [6],
        minuteMarks: [10],
    }],
    [BusRoute._6B, {
        firstService: [12, 20],
        lastService: [17, 20],
        days: [1, 2, 3, 4, 5],
        minuteMarks: [20],
    }],
    [BusRoute._7D, {
        firstService: [8, 18],
        lastService: [17, 50],
        days: [1, 2, 3, 4, 5],
        minuteMarks: [18, 50],
    }],
    [BusRoute._7E, {
        firstService: [8, 18],
        lastService: [13, 18],
        days: [6],
        minuteMarks: [18, 50],
    }],
    [BusRoute._8, {
        firstService: [7, 40],
        lastService: [18, 40],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [0, 20, 40],
    }],
    [BusRoute._NY, {
        firstService: [19, 0],
        lastService: [23, 30],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [0],
    }],
    [BusRoute._NN, {
        firstService: [19, 0],
        lastService: [23, 30],
        days: [1, 2, 3, 4, 5, 6],
        minuteMarks: [15, 30, 45],
    }],
    [BusRoute._HY, {
        firstService: [8, 20],
        lastService: [23, 20],
        days: [0],
        minuteMarks: [0],
    }],
    [BusRoute._HN, {
        firstService: [8, 20],
        lastService: [23, 20],
        days: [0],
        minuteMarks: [20, 40],
    }],
]);

//!TODO:
//! add support for public holidays
//! scrape here?: https://www.gov.hk/en/about/abouthk/holiday/2025.htm