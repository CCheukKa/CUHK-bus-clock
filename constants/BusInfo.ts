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
    _8D = '8', // weekdays
    _8E = '8', // weekends
    _NY = 'N+', // stops at pg hall 1
    _NN = 'N', // doesn't stop at pg hall 1
    _HY = 'H+', // stops at pg hall 1 & area 39 (upwards)
    _HN = 'H', // doesn't stop at pg hall 1 & area 39 (upwards)
};

export enum Station {
    AREA_39_DOWNWARD = 'Area 39 (Downward)',
    AREA_39_UPWARD = 'Area 39 (Upward)',
    CAMPUS_CIRCUIT_EAST_DOWNWARD = 'Campus Circuit East (Downward)',
    CAMPUS_CIRCUIT_EAST_UPWARD = 'Campus Circuit East (Upward)',
    CAMPUS_CIRCUIT_NORTH = 'Campus Circuit North',
    CHAN_CHUN_HA_HOSTEL = 'Chan Chun Ha Hostel',
    CHUNG_CHI_TEACHING_BUILDING = 'Chung Chi Teaching Building',
    CWC_COLLEGE_DOWNWARD = 'CW Chu College (Downward)',
    CWC_COLLEGE_UPWARD = 'CW Chu College (Upward)',
    FUNG_KING_HEY_BUILDING = 'Fung King Hey Building',
    NEW_ASIA_CIRCLE = 'New Asia Circle',
    NEW_ASIA_COLLEGE = 'New Asia College',
    POSTGRADUATE_HALL_1 = 'Postgraduate Hall 1',
    RESIDENCE_10 = 'Residence No. 10',
    RESIDENCE_15 = 'Residence No. 15',
    SCIENCE_CENTRE = 'Science Centre',
    SHAW_COLLEGE_DOWNWARD = 'Shaw College (Downward)',
    SHAW_COLLEGE_UPWARD = 'Shaw College (Upward)',
    SHHO_COLLEGE = 'S.H. Ho College',
    SIR_RUN_RUN_SHAW_HALL = 'Sir Run Run Shaw Hall',
    UNITED_COLLEGE_DOWNWARD = 'United College (Downward)',
    UNTIED_COLLEGE_STAFF_RESIDENCE = 'United College Staff Residence',
    UNITED_COLLEGE_UPWARD = 'United College (Upward)',
    UNIVERSITY_ADMIN_BUILDING = 'University Admin Building',
    UNIVERSITY_SPORTS_CENTRE = 'University Sports Centre',
    UNIVERSITY_STATION = 'University Station',
    UNIVERSITY_STATION_TERMINUS = 'University Station (Terminus)',
    UNIVERSITY_STATION_PIAZZA = 'University Station Piazza',
    UNIVERSITY_STATION_PIAZZA_TERMINUS = 'University Station Piazza (Terminus)',
    WU_YEE_SUN_COLLEGE_DOWNWARD = 'Wu Yee Sun College (Downward)',
    WU_YEE_SUN_COLLEGE_UPWARD = 'Wu Yee Sun College (Upward)',
    YIA = 'YIA',
};

export enum Region {
    AREA_39 = 'Area 39',
    CWC_COLLEGE = 'CW Chu College',
    LWS_COLLEGE = 'Lee Woo Sing College',
    MAIN_CAMPUS = 'Main Campus',
    MTR = 'MTR',
    NEW_ASIA_COLLEGE = 'New Asia College',
    SHAW_COLLEGE = 'Shaw College',
    SHHO_COLLEGE = 'S.H. Ho College',
    UNITED_COLLEGE = 'United College',
    WYS_COLLEGE = 'Wu Yee Sun College',
    MISCELLANEOUS = 'Miscellaneous',
};

export const StationRegions: Record<Region, Station[]> = Object.freeze({
    [Region.AREA_39]: [
        Station.AREA_39_DOWNWARD,
        Station.AREA_39_UPWARD,
    ],
    [Region.CWC_COLLEGE]: [
        Station.CWC_COLLEGE_DOWNWARD,
        Station.CWC_COLLEGE_UPWARD,
    ],
    [Region.LWS_COLLEGE]: [
        Station.CHAN_CHUN_HA_HOSTEL,

    ],
    [Region.MAIN_CAMPUS]: [
        Station.SCIENCE_CENTRE,
        Station.SIR_RUN_RUN_SHAW_HALL,
        Station.UNIVERSITY_ADMIN_BUILDING,
    ],
    [Region.MTR]: [
        Station.UNIVERSITY_STATION,
        Station.UNIVERSITY_STATION_TERMINUS,
        Station.UNIVERSITY_STATION_PIAZZA,
        Station.UNIVERSITY_STATION_PIAZZA_TERMINUS,
        Station.YIA,
    ],
    [Region.NEW_ASIA_COLLEGE]: [
        Station.NEW_ASIA_CIRCLE,
        Station.NEW_ASIA_COLLEGE,
    ],
    [Region.SHAW_COLLEGE]: [
        Station.SHAW_COLLEGE_DOWNWARD,
        Station.SHAW_COLLEGE_UPWARD,
    ],
    [Region.SHHO_COLLEGE]: [
        Station.SHHO_COLLEGE,
        Station.UNIVERSITY_SPORTS_CENTRE,
    ],
    [Region.UNITED_COLLEGE]: [
        Station.UNITED_COLLEGE_DOWNWARD,
        Station.UNITED_COLLEGE_UPWARD,
    ],
    [Region.WYS_COLLEGE]: [
        Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
        Station.WU_YEE_SUN_COLLEGE_UPWARD,
    ],
    [Region.MISCELLANEOUS]: [
        Station.CAMPUS_CIRCUIT_EAST_DOWNWARD,
        Station.CAMPUS_CIRCUIT_EAST_UPWARD,
        Station.CAMPUS_CIRCUIT_NORTH,
        Station.CHUNG_CHI_TEACHING_BUILDING,
        Station.FUNG_KING_HEY_BUILDING,
        Station.POSTGRADUATE_HALL_1,
        Station.RESIDENCE_10,
        Station.RESIDENCE_15,
        Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
    ],
});

export type BusRouteInfo = {
    colour: string,
    firstService: [number, number],
    lastService: [number, number],
    days: number[],
    minuteMarks: number[],
    route: [Station, [number, number]][],
};

export const BusRouteInfos = Object.freeze(
    new Map<BusRoute, BusRouteInfo>([
        [BusRoute._1A, {
            colour: '#f2e421',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [10, 20, 40, 50],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [6, 0]],
                [Station.SHHO_COLLEGE, [8, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [10, 0]],
            ],
        }],
        [BusRoute._1B, {
            colour: '#f2e421',
            firstService: [8, 0],
            lastService: [18, 0],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 30],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.POSTGRADUATE_HALL_1, [2, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [4, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [6, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [8, 0]],
                [Station.SHHO_COLLEGE, [10, 0]],
                [Station.POSTGRADUATE_HALL_1, [12, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [14, 0]],
            ],
        }],
        [BusRoute._2Y, {
            colour: '#ec4790',
            firstService: [7, 45],
            lastService: [18, 45],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 45],
            route: [
                [Station.UNIVERSITY_STATION_PIAZZA, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.FUNG_KING_HEY_BUILDING, [6, 0]],
                [Station.UNITED_COLLEGE_UPWARD, [8, 0]],
                [Station.NEW_ASIA_COLLEGE, [10, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [12, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [14, 0]],
                [Station.SHHO_COLLEGE, [16, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [18, 0]],
            ],
        }],
        [BusRoute._2N, {
            colour: '#ec4790',
            firstService: [7, 45],
            lastService: [18, 45],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [15, 30],
            route: [
                [Station.UNIVERSITY_STATION_PIAZZA, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.FUNG_KING_HEY_BUILDING, [4, 0]],
                [Station.UNITED_COLLEGE_UPWARD, [6, 0]],
                [Station.NEW_ASIA_COLLEGE, [8, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [10, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [12, 0]],
                [Station.SHHO_COLLEGE, [14, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [16, 0]],
            ],
        }],
        [BusRoute._3, {
            colour: '#318761',
            firstService: [9, 0],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 20, 40],
            route: [
                [Station.YIA, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SCIENCE_CENTRE, [4, 0]],
                [Station.FUNG_KING_HEY_BUILDING, [6, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [8, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [10, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [12, 0]],
                [Station.RESIDENCE_15, [14, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [16, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [18, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [20, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [22, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [24, 0]],
                [Station.SHHO_COLLEGE, [26, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA_TERMINUS, [28, 0]],
            ],
        }],
        [BusRoute._4, {
            colour: '#e75a24',
            firstService: [7, 30],
            lastService: [18, 50],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [10, 30, 50],
            route: [
                [Station.YIA, [0, 0]],
                [Station.CAMPUS_CIRCUIT_EAST_UPWARD, [2, 0]],
                [Station.CWC_COLLEGE_UPWARD, [4, 0]],
                [Station.AREA_39_UPWARD, [6, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [8, 0]],
                [Station.RESIDENCE_15, [10, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [12, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [14, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [16, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [18, 0]],
                [Station.NEW_ASIA_COLLEGE, [20, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [22, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [24, 0]],
                [Station.SHHO_COLLEGE, [26, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [28, 0]],
            ],
        }],
        [BusRoute._5D, {
            colour: '#29a1d8',
            firstService: [9, 18],
            lastService: [17, 26],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [18, 22, 26],
            route: [
                [Station.CHUNG_CHI_TEACHING_BUILDING, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.FUNG_KING_HEY_BUILDING, [6, 0]],
                [Station.UNITED_COLLEGE_UPWARD, [8, 0]],
                [Station.NEW_ASIA_COLLEGE, [10, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [12, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [14, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [16, 0]],
            ],
        }],
        [BusRoute._5E, {
            colour: '#29a1d8',
            firstService: [9, 18],
            lastService: [13, 26],
            days: [6],
            minuteMarks: [18, 22, 26],
            route: [
                [Station.CHUNG_CHI_TEACHING_BUILDING, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.FUNG_KING_HEY_BUILDING, [6, 0]],
                [Station.UNITED_COLLEGE_UPWARD, [8, 0]],
                [Station.NEW_ASIA_COLLEGE, [10, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [12, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [14, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [16, 0]],
            ],
        }],
        [BusRoute._6AD, {
            colour: '#7c8644',
            firstService: [9, 10],
            lastService: [17, 10],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [10],
            route: [
                [Station.CWC_COLLEGE_DOWNWARD, [0, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [2, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [4, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [6, 0]],
                [Station.NEW_ASIA_COLLEGE, [8, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [10, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [12, 0]],
                [Station.SHHO_COLLEGE, [14, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [16, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [18, 0]],
            ],
        }],
        [BusRoute._6AE, {
            colour: '#7c8644',
            firstService: [9, 10],
            lastService: [13, 10],
            days: [6],
            minuteMarks: [10],
            route: [
                [Station.CWC_COLLEGE_DOWNWARD, [0, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [2, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [4, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [6, 0]],
                [Station.NEW_ASIA_COLLEGE, [8, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [10, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [12, 0]],
                [Station.SHHO_COLLEGE, [14, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [16, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [18, 0]],
            ],
        }],
        [BusRoute._6B, {
            colour: '#7c8644',
            firstService: [12, 20],
            lastService: [17, 20],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [20],
            route: [
                [Station.NEW_ASIA_COLLEGE, [0, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [2, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [4, 0]],
                [Station.SHHO_COLLEGE, [6, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [8, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [10, 0]],
            ],
        }],
        [BusRoute._7D, {
            colour: '#666666',
            firstService: [8, 18],
            lastService: [17, 50],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [18, 50],
            route: [
                [Station.SHAW_COLLEGE_DOWNWARD, [0, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [2, 0]],
                [Station.NEW_ASIA_COLLEGE, [4, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [6, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [8, 0]],
                [Station.SHHO_COLLEGE, [10, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [12, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [14, 0]],
            ],
        }],
        [BusRoute._7E, {
            colour: '#666666',
            firstService: [8, 18],
            lastService: [13, 18],
            days: [6],
            minuteMarks: [18, 50],
            route: [
                [Station.SHAW_COLLEGE_DOWNWARD, [0, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [2, 0]],
                [Station.NEW_ASIA_COLLEGE, [4, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [6, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [8, 0]],
                [Station.SHHO_COLLEGE, [10, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [12, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [14, 0]],
            ],
        }],
        [BusRoute._8D, {
            colour: '#ffc55a',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [0, 20, 40],
            route: [
                [Station.AREA_39_UPWARD, [0, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [2, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [4, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [6, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [8, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [10, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [12, 0]],
                [Station.SCIENCE_CENTRE, [14, 0]],
                [Station.NEW_ASIA_CIRCLE, [16, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [18, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [20, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [22, 0]],
                [Station.AREA_39_DOWNWARD, [24, 0]],
                [Station.CAMPUS_CIRCUIT_NORTH, [26, 0]],
                [Station.CAMPUS_CIRCUIT_EAST_DOWNWARD, [28, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [30, 0]],
            ],
        }],
        [BusRoute._8E, {
            colour: '#ffc55a',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [0, 20, 40],
            route: [
                [Station.AREA_39_UPWARD, [0, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [2, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [4, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [6, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [8, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [10, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [12, 0]],
                [Station.SCIENCE_CENTRE, [14, 0]],
                [Station.NEW_ASIA_CIRCLE, [16, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [18, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [20, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [22, 0]],
                [Station.AREA_39_DOWNWARD, [24, 0]],
                [Station.CAMPUS_CIRCUIT_NORTH, [26, 0]],
                [Station.CAMPUS_CIRCUIT_EAST_DOWNWARD, [28, 0]],
                [Station.UNIVERSITY_STATION_PIAZZA, [30, 0]],
                [Station.CHUNG_CHI_TEACHING_BUILDING, [32, 0]],
            ],
        }],
        [BusRoute._NY, {
            colour: '#7961a8',
            firstService: [19, 0],
            lastService: [23, 30],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.POSTGRADUATE_HALL_1, [2, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [4, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [6, 0]],
                [Station.NEW_ASIA_CIRCLE, [8, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [10, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [12, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [14, 0]],
                [Station.AREA_39_UPWARD, [16, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [18, 0]],
                [Station.RESIDENCE_15, [20, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [22, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [24, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [26, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [28, 0]],
                [Station.NEW_ASIA_COLLEGE, [30, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [32, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [34, 0]],
                [Station.SHHO_COLLEGE, [36, 0]],
                [Station.POSTGRADUATE_HALL_1, [38, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [40, 0]],
            ],
        }],
        [BusRoute._NN, {
            colour: '#7961a8',
            firstService: [19, 0],
            lastService: [23, 30],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [15, 30, 45],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.NEW_ASIA_CIRCLE, [6, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [8, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [10, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [12, 0]],
                [Station.AREA_39_UPWARD, [14, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [16, 0]],
                [Station.RESIDENCE_15, [18, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [20, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [22, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [24, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [26, 0]],
                [Station.NEW_ASIA_COLLEGE, [28, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [30, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [32, 0]],
                [Station.SHHO_COLLEGE, [34, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [36, 0]],
            ],
        }],
        [BusRoute._HY, {
            colour: '#453087',
            firstService: [8, 20],
            lastService: [23, 20],
            days: [0],
            minuteMarks: [0],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.POSTGRADUATE_HALL_1, [2, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [4, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [6, 0]],
                [Station.NEW_ASIA_CIRCLE, [8, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [10, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [12, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [14, 0]],
                [Station.AREA_39_UPWARD, [16, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [18, 0]],
                [Station.RESIDENCE_10, [20, 0]],
                [Station.RESIDENCE_15, [22, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [24, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [26, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [28, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [30, 0]],
                [Station.NEW_ASIA_COLLEGE, [32, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [34, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [36, 0]],
                [Station.SHHO_COLLEGE, [38, 0]],
                [Station.POSTGRADUATE_HALL_1, [40, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [42, 0]],
            ],
        }],
        [BusRoute._HN, {
            colour: '#453087',
            firstService: [8, 20],
            lastService: [23, 20],
            days: [0],
            minuteMarks: [20, 40],
            route: [
                [Station.UNIVERSITY_STATION, [0, 0]],
                [Station.UNIVERSITY_SPORTS_CENTRE, [2, 0]],
                [Station.SIR_RUN_RUN_SHAW_HALL, [4, 0]],
                [Station.NEW_ASIA_CIRCLE, [6, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [8, 0]],
                [Station.WU_YEE_SUN_COLLEGE_UPWARD, [10, 0]],
                [Station.SHAW_COLLEGE_UPWARD, [12, 0]],
                [Station.CWC_COLLEGE_DOWNWARD, [14, 0]],
                [Station.RESIDENCE_10, [16, 0]],
                [Station.RESIDENCE_15, [18, 0]],
                [Station.UNTIED_COLLEGE_STAFF_RESIDENCE, [20, 0]],
                [Station.CHAN_CHUN_HA_HOSTEL, [22, 0]],
                [Station.SHAW_COLLEGE_DOWNWARD, [24, 0]],
                [Station.WU_YEE_SUN_COLLEGE_DOWNWARD, [26, 0]],
                [Station.NEW_ASIA_COLLEGE, [28, 0]],
                [Station.UNITED_COLLEGE_DOWNWARD, [30, 0]],
                [Station.UNIVERSITY_ADMIN_BUILDING, [32, 0]],
                [Station.SHHO_COLLEGE, [34, 0]],
                [Station.UNIVERSITY_STATION_TERMINUS, [36, 0]],
            ],
        }],
    ])
);

//! TODO:
//! add support for public holidays
//! scrape here?: https://www.gov.hk/en/about/abouthk/holiday/2025.htm

//! TODO:
//! add coordinates for each station

export type EtaInfo = {
    station: Station,
    route: BusRoute,
    etaTime: Date,
}
export type FromTo = {
    from: Station | Region,
    to: Station | Region,
};

function isRegion(x: Station | Region): x is Region {
    return Object.values(Region).includes(x as Region);
}

export function getETAs({ from, to }: FromTo, currentTime: Date, pastMinutes: number, futureMinutes: number): EtaInfo[] {
    const pastTimeLimit = new Date(currentTime.getTime() - pastMinutes * 60000);
    const futureTimeLimit = new Date(currentTime.getTime() + futureMinutes * 60000);

    const fromStations = isRegion(from) ? StationRegions[from] : [from];
    const toStations = isRegion(to) ? StationRegions[to] : [to];

    const etas: EtaInfo[] = [];
    fromStations.forEach(fromStation => {
        const routes: BusRoute[] = [];
        toStations.forEach(toStation => {
            routes.push(...findRoute(fromStation, toStation));
        });

        new Set(routes).forEach(route => {
            etas.push(...getStationRouteETA(fromStation, route, currentTime, pastTimeLimit, futureTimeLimit) ?? []);
        });
    });

    return etas;
}

function findRoute(fromStation: Station, toStation: Station): BusRoute[] {
    // TODO: add scoring to eliminate ridiculous routes
    const routes: BusRoute[] = [];
    BusRouteInfos.forEach((routeInfo, route) => {
        if (!routeInfo.route.find(s => s[0] === fromStation)) { return; }
        if (!routeInfo.route.find(s => s[0] === toStation)) { return; }
        if (routeInfo.route.findIndex(s => s[0] === fromStation) < routeInfo.route.findIndex(s => s[0] === toStation)) {
            routes.push(route);
        }
    });
    return routes;
}

function getStationRouteETA(station: Station, route: BusRoute, currentTime: Date, pastTimeLimit: Date, futureTimeLimit: Date): EtaInfo[] | void {
    const routeInfo = BusRouteInfos.get(route);
    if (!routeInfo) { return; }
    if (!routeInfo.days.includes(currentTime.getDay())) { return; }
    const routeStation = routeInfo.route.find(s => s[0] === station) ?? null;
    if (!routeStation) { return; }
    const routeStationTime = routeStation[1];

    const currentHour = currentTime.getHours();

    const etas: EtaInfo[] = [];

    routeInfo.minuteMarks.forEach(minuteMark => {
        const pastHourStartTime = new Date(currentTime);
        const currentHourStartTime = new Date(currentTime);
        const futureHourStartTime = new Date(currentTime);

        pastHourStartTime.setHours(currentHour - 1, minuteMark);
        currentHourStartTime.setHours(currentHour, minuteMark);
        futureHourStartTime.setHours(currentHour + 1, minuteMark);

        const pastHourEtaTime = pastHourStartTime.add(0, ...routeStationTime);
        const currentHourEtaTime = currentHourStartTime.add(0, ...routeStationTime);
        const futureHourEtaTime = futureHourStartTime.add(0, ...routeStationTime);

        etas.push(
            { station, route, etaTime: isWithinServiceHours(pastHourStartTime) ? pastHourEtaTime : new Date(Infinity) },
            { station, route, etaTime: isWithinServiceHours(currentHourStartTime) ? currentHourEtaTime : new Date(Infinity) },
            { station, route, etaTime: isWithinServiceHours(futureHourStartTime) ? futureHourEtaTime : new Date(Infinity) },
        );
    });

    return etas.filter(eta => eta.etaTime >= pastTimeLimit && eta.etaTime <= futureTimeLimit);

    /* -------------------------------------------------------------------------- */
    function isWithinServiceHours(time: Date): boolean {
        if (!routeInfo) { throw new Error('Route info not found but isWithinServiceHours() is called'); }
        // 
        const hour = time.getHours();
        const minute = time.getMinutes();
        if (hour < routeInfo.firstService[0] || hour > routeInfo.lastService[0]) { return false; }
        if (hour === routeInfo.firstService[0] && minute < routeInfo.firstService[1]) { return false; }
        if (hour === routeInfo.lastService[0] && minute > routeInfo.lastService[1]) { return false; }
        return true;
    }
}

/* -------------------------------------------------------------------------- */
declare global {
    interface Date {
        add(
            hours: number,
            minutes?: number,
            seconds?: number,
            milliseconds?: number
        ): Date;
    }
}
Date.prototype.add = function (this: Date, hours?, minutes?, seconds?, milliseconds?): Date {
    return new Date(this.getTime() + (hours ?? 0) * 3600000 + (minutes ?? 0) * 60000 + (seconds ?? 0) * 1000 + (milliseconds ?? 0));
};