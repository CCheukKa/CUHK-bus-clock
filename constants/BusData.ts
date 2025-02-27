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
    CHUNG_CHI_TEACHING_BUILDING_TERMINUS = 'Chung Chi Teaching Building Terminus',
    CWC_COLLEGE_DOWNWARD = 'CW Chu College (Downward)',
    CWC_COLLEGE_DOWNWARD_TERMINUS = 'CW Chu College (Downward) Terminus',
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
    CHUNG_CHI_COLLEGE = 'Chung Chi College',
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

export const stationRegions: Record<Region, Station[]> = Object.freeze({
    [Region.AREA_39]: [
        Station.AREA_39_DOWNWARD,
        Station.AREA_39_UPWARD,
    ],
    [Region.CHUNG_CHI_COLLEGE]: [
        Station.CHUNG_CHI_TEACHING_BUILDING,
        Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
    ],
    [Region.CWC_COLLEGE]: [
        Station.CAMPUS_CIRCUIT_NORTH,
        Station.CWC_COLLEGE_DOWNWARD,
        Station.CWC_COLLEGE_DOWNWARD_TERMINUS,
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
        Station.FUNG_KING_HEY_BUILDING,
        Station.POSTGRADUATE_HALL_1,
        Station.RESIDENCE_10,
        Station.RESIDENCE_15,
        Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
    ],
});

export type Coordinates = {
    latitude: number,
    longitude: number,
};
export const stationCoordinates: Record<Station, Coordinates> = Object.freeze({
    [Station.AREA_39_DOWNWARD]: { latitude: 22.42762, longitude: 114.20436 }, //^ ???
    [Station.AREA_39_UPWARD]: { latitude: 22.42762, longitude: 114.20436 }, //^ ???
    [Station.CAMPUS_CIRCUIT_EAST_DOWNWARD]: { latitude: 22.41906, longitude: 114.21298 },
    [Station.CAMPUS_CIRCUIT_EAST_UPWARD]: { latitude: 22.41915, longitude: 114.21290 },
    [Station.CAMPUS_CIRCUIT_NORTH]: { latitude: 22.42569, longitude: 114.20608 }, //^ ???
    [Station.CHAN_CHUN_HA_HOSTEL]: { latitude: 22.42181, longitude: 114.20466 },
    [Station.CHUNG_CHI_TEACHING_BUILDING]: { latitude: 22.41596, longitude: 114.20833 },
    [Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS]: { latitude: 22.41572, longitude: 114.20820 },
    [Station.CWC_COLLEGE_DOWNWARD]: { latitude: 22.42569, longitude: 114.20608 }, //^ ???
    [Station.CWC_COLLEGE_DOWNWARD_TERMINUS]: { latitude: 22.42569, longitude: 114.20608 }, //^ ???
    [Station.CWC_COLLEGE_UPWARD]: { latitude: 0, longitude: 0 }, //! TBD
    [Station.FUNG_KING_HEY_BUILDING]: { latitude: 22.41983, longitude: 114.20302 },
    [Station.NEW_ASIA_CIRCLE]: { latitude: 22.42096, longitude: 114.20775 },
    [Station.NEW_ASIA_COLLEGE]: { latitude: 22.42128, longitude: 114.20750 },
    [Station.POSTGRADUATE_HALL_1]: { latitude: 22.42034, longitude: 114.21215 },
    [Station.RESIDENCE_10]: { latitude: 0, longitude: 0 }, //! TBD
    [Station.RESIDENCE_15]: { latitude: 22.42377, longitude: 114.20665 },
    [Station.SCIENCE_CENTRE]: { latitude: 22.41985, longitude: 114.20719 },
    [Station.SHAW_COLLEGE_DOWNWARD]: { latitude: 22.42242, longitude: 114.20126 },
    [Station.SHAW_COLLEGE_UPWARD]: { latitude: 22.42252, longitude: 114.20143 },
    [Station.SHHO_COLLEGE]: { latitude: 22.41801, longitude: 114.20994 },
    [Station.SIR_RUN_RUN_SHAW_HALL]: { latitude: 22.41984, longitude: 114.20697 },
    [Station.UNITED_COLLEGE_DOWNWARD]: { latitude: 22.42030, longitude: 114.20528 },
    [Station.UNTIED_COLLEGE_STAFF_RESIDENCE]: { latitude: 22.42324, longitude: 114.20516 },
    [Station.UNITED_COLLEGE_UPWARD]: { latitude: 22.42040, longitude: 114.20534 },
    [Station.UNIVERSITY_ADMIN_BUILDING]: { latitude: 22.41882, longitude: 114.20536 },
    [Station.UNIVERSITY_SPORTS_CENTRE]: { latitude: 22.41781, longitude: 114.21041 },
    [Station.UNIVERSITY_STATION]: { latitude: 22.41453, longitude: 114.21024 },
    [Station.UNIVERSITY_STATION_TERMINUS]: { latitude: 22.41517, longitude: 114.21053 },
    [Station.UNIVERSITY_STATION_PIAZZA]: { latitude: 22.41382, longitude: 114.20946 },
    [Station.UNIVERSITY_STATION_PIAZZA_TERMINUS]: { latitude: 22.41399, longitude: 114.20981 },
    [Station.WU_YEE_SUN_COLLEGE_DOWNWARD]: { latitude: 22.42109, longitude: 114.20353 },
    [Station.WU_YEE_SUN_COLLEGE_UPWARD]: { latitude: 22.42121, longitude: 114.20345 },
    [Station.YIA]: { latitude: 22.41599, longitude: 114.21083 },
});

export type BusRouteInfo = {
    colour: string,
    firstService: [number, number],
    lastService: [number, number],
    days: number[],
    minuteMarks: number[],
    stations: Station[],
};
export const busRouteInfos = Object.freeze(
    new Map<BusRoute, BusRouteInfo>([
        [BusRoute._1A, {
            colour: '#f2e421',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [10, 20, 40, 50],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._1B, {
            colour: '#f2e421',
            firstService: [8, 0],
            lastService: [18, 0],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 30],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._2Y, {
            colour: '#ec4790',
            firstService: [7, 45],
            lastService: [18, 45],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 45],
            stations: [
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.FUNG_KING_HEY_BUILDING,
                Station.UNITED_COLLEGE_UPWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._2N, {
            colour: '#ec4790',
            firstService: [7, 45],
            lastService: [18, 45],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [15, 30],
            stations: [
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.FUNG_KING_HEY_BUILDING,
                Station.UNITED_COLLEGE_UPWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._3, {
            colour: '#318761',
            firstService: [9, 0],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0, 20, 40],
            stations: [
                Station.YIA,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SCIENCE_CENTRE,
                Station.FUNG_KING_HEY_BUILDING,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA_TERMINUS,
            ],
        }],
        [BusRoute._4, {
            colour: '#e75a24',
            firstService: [7, 30],
            lastService: [18, 50],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [10, 30, 50],
            stations: [
                Station.YIA,
                Station.CAMPUS_CIRCUIT_EAST_UPWARD,
                Station.CWC_COLLEGE_UPWARD,
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._5D, {
            colour: '#29a1d8',
            firstService: [9, 18],
            lastService: [17, 26],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [18, 22, 26],
            stations: [
                Station.CHUNG_CHI_TEACHING_BUILDING,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.FUNG_KING_HEY_BUILDING,
                Station.UNITED_COLLEGE_UPWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD_TERMINUS,
            ],
        }],
        [BusRoute._5E, {
            colour: '#29a1d8',
            firstService: [9, 18],
            lastService: [13, 26],
            days: [6],
            minuteMarks: [18, 22, 26],
            stations: [
                Station.CHUNG_CHI_TEACHING_BUILDING,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.FUNG_KING_HEY_BUILDING,
                Station.UNITED_COLLEGE_UPWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD_TERMINUS,
            ],
        }],
        [BusRoute._6AD, {
            colour: '#7c8644',
            firstService: [9, 10],
            lastService: [17, 10],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [10],
            stations: [
                Station.CWC_COLLEGE_DOWNWARD,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._6AE, {
            colour: '#7c8644',
            firstService: [9, 10],
            lastService: [13, 10],
            days: [6],
            minuteMarks: [10],
            stations: [
                Station.CWC_COLLEGE_DOWNWARD,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._6B, {
            colour: '#7c8644',
            firstService: [12, 20],
            lastService: [17, 20],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [20],
            stations: [
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._7D, {
            colour: '#666666',
            firstService: [8, 18],
            lastService: [17, 50],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [18, 50],
            stations: [
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._7E, {
            colour: '#666666',
            firstService: [8, 18],
            lastService: [13, 18],
            days: [6],
            minuteMarks: [18, 50],
            stations: [
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._8D, {
            colour: '#ffc55a',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [0, 20, 40],
            stations: [
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SCIENCE_CENTRE,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.AREA_39_DOWNWARD,
                Station.CAMPUS_CIRCUIT_NORTH,
                Station.CAMPUS_CIRCUIT_EAST_DOWNWARD,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._8E, {
            colour: '#ffc55a',
            firstService: [7, 40],
            lastService: [18, 40],
            days: [1, 2, 3, 4, 5],
            minuteMarks: [0, 20, 40],
            stations: [
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SCIENCE_CENTRE,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.AREA_39_DOWNWARD,
                Station.CAMPUS_CIRCUIT_NORTH,
                Station.CAMPUS_CIRCUIT_EAST_DOWNWARD,
                Station.UNIVERSITY_STATION_PIAZZA,
                Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS,
            ],
        }],
        [BusRoute._NY, {
            colour: '#7961a8',
            firstService: [19, 0],
            lastService: [23, 30],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [0],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._NN, {
            colour: '#7961a8',
            firstService: [19, 0],
            lastService: [23, 30],
            days: [1, 2, 3, 4, 5, 6],
            minuteMarks: [15, 30, 45],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._HY, {
            colour: '#453087',
            firstService: [8, 20],
            lastService: [23, 20],
            days: [0],
            minuteMarks: [0],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.AREA_39_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_10,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.POSTGRADUATE_HALL_1,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
        [BusRoute._HN, {
            colour: '#453087',
            firstService: [8, 20],
            lastService: [23, 20],
            days: [0],
            minuteMarks: [20, 40],
            stations: [
                Station.UNIVERSITY_STATION,
                Station.UNIVERSITY_SPORTS_CENTRE,
                Station.SIR_RUN_RUN_SHAW_HALL,
                Station.NEW_ASIA_CIRCLE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_UPWARD,
                Station.SHAW_COLLEGE_UPWARD,
                Station.CWC_COLLEGE_DOWNWARD,
                Station.RESIDENCE_10,
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.NEW_ASIA_COLLEGE,
                Station.UNITED_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_TERMINUS,
            ],
        }],
    ])
);

export const busStationTimings: Map<[Station, Station], number> = new Map([
    [[Station.AREA_39_DOWNWARD, Station.CAMPUS_CIRCUIT_NORTH], 138],
    [[Station.AREA_39_UPWARD, Station.CWC_COLLEGE_DOWNWARD], 0],
    [[Station.CAMPUS_CIRCUIT_EAST_UPWARD, Station.CWC_COLLEGE_UPWARD], 0],
    [[Station.CAMPUS_CIRCUIT_EAST_DOWNWARD, Station.UNIVERSITY_STATION_PIAZZA], 0],
    [[Station.CAMPUS_CIRCUIT_EAST_DOWNWARD, Station.UNIVERSITY_STATION_TERMINUS], 94],
    [[Station.CAMPUS_CIRCUIT_NORTH, Station.CAMPUS_CIRCUIT_EAST_DOWNWARD], 159],
    [[Station.CHAN_CHUN_HA_HOSTEL, Station.SHAW_COLLEGE_DOWNWARD], 118],
    [[Station.CHAN_CHUN_HA_HOSTEL, Station.WU_YEE_SUN_COLLEGE_DOWNWARD], 0],
    [[Station.CHUNG_CHI_TEACHING_BUILDING, Station.UNIVERSITY_SPORTS_CENTRE], 0],
    [[Station.CWC_COLLEGE_DOWNWARD, Station.RESIDENCE_10], 0],
    [[Station.CWC_COLLEGE_DOWNWARD, Station.RESIDENCE_15], 82],
    [[Station.CWC_COLLEGE_DOWNWARD, Station.UNTIED_COLLEGE_STAFF_RESIDENCE], 0],
    [[Station.CWC_COLLEGE_UPWARD, Station.AREA_39_UPWARD], 0],
    [[Station.FUNG_KING_HEY_BUILDING, Station.UNITED_COLLEGE_UPWARD], 0],
    [[Station.FUNG_KING_HEY_BUILDING, Station.WU_YEE_SUN_COLLEGE_UPWARD], 36],
    [[Station.NEW_ASIA_CIRCLE, Station.UNITED_COLLEGE_DOWNWARD], 50],
    [[Station.NEW_ASIA_COLLEGE, Station.WU_YEE_SUN_COLLEGE_UPWARD], 0],
    [[Station.NEW_ASIA_COLLEGE, Station.UNITED_COLLEGE_DOWNWARD], 0],
    [[Station.POSTGRADUATE_HALL_1, Station.UNIVERSITY_SPORTS_CENTRE], 0],
    [[Station.POSTGRADUATE_HALL_1, Station.UNIVERSITY_STATION_TERMINUS], 0],
    [[Station.RESIDENCE_10, Station.RESIDENCE_15], 0],
    [[Station.RESIDENCE_15, Station.UNTIED_COLLEGE_STAFF_RESIDENCE], 63],
    [[Station.SCIENCE_CENTRE, Station.NEW_ASIA_CIRCLE], 110],
    [[Station.SCIENCE_CENTRE, Station.FUNG_KING_HEY_BUILDING], 67],
    [[Station.SHAW_COLLEGE_DOWNWARD, Station.WU_YEE_SUN_COLLEGE_DOWNWARD], 123],
    [[Station.SHAW_COLLEGE_UPWARD, Station.AREA_39_DOWNWARD], 177],
    [[Station.SHAW_COLLEGE_UPWARD, Station.AREA_39_UPWARD], 177],
    [[Station.SHAW_COLLEGE_UPWARD, Station.CWC_COLLEGE_DOWNWARD], 127],
    [[Station.SHAW_COLLEGE_UPWARD, Station.CWC_COLLEGE_DOWNWARD_TERMINUS], 127],
    [[Station.SHHO_COLLEGE, Station.POSTGRADUATE_HALL_1], 0],
    [[Station.SHHO_COLLEGE, Station.UNIVERSITY_STATION_PIAZZA], 0],
    [[Station.SHHO_COLLEGE, Station.UNIVERSITY_STATION_PIAZZA_TERMINUS], 128],
    [[Station.SHHO_COLLEGE, Station.UNIVERSITY_STATION_TERMINUS], 0],
    [[Station.SIR_RUN_RUN_SHAW_HALL, Station.FUNG_KING_HEY_BUILDING], 0],
    [[Station.SIR_RUN_RUN_SHAW_HALL, Station.NEW_ASIA_CIRCLE], 0],
    [[Station.SIR_RUN_RUN_SHAW_HALL, Station.UNIVERSITY_ADMIN_BUILDING], 0],
    [[Station.UNITED_COLLEGE_DOWNWARD, Station.UNIVERSITY_ADMIN_BUILDING], 0],
    [[Station.UNITED_COLLEGE_DOWNWARD, Station.WU_YEE_SUN_COLLEGE_UPWARD], 64],
    [[Station.UNTIED_COLLEGE_STAFF_RESIDENCE, Station.CHAN_CHUN_HA_HOSTEL], 58],
    [[Station.UNITED_COLLEGE_UPWARD, Station.NEW_ASIA_COLLEGE], 0],
    [[Station.UNIVERSITY_ADMIN_BUILDING, Station.SCIENCE_CENTRE], 0],
    [[Station.UNIVERSITY_ADMIN_BUILDING, Station.SHHO_COLLEGE], 98],
    [[Station.UNIVERSITY_SPORTS_CENTRE, Station.FUNG_KING_HEY_BUILDING], 0],
    [[Station.UNIVERSITY_SPORTS_CENTRE, Station.SCIENCE_CENTRE], 0],
    [[Station.UNIVERSITY_SPORTS_CENTRE, Station.SIR_RUN_RUN_SHAW_HALL], Math.average(132, 139)],
    [[Station.UNIVERSITY_STATION, Station.POSTGRADUATE_HALL_1], 0],
    [[Station.UNIVERSITY_STATION, Station.UNIVERSITY_SPORTS_CENTRE], Math.average(75, 110)],
    [[Station.UNIVERSITY_STATION_PIAZZA, Station.CHUNG_CHI_TEACHING_BUILDING_TERMINUS], 0],
    [[Station.UNIVERSITY_STATION_PIAZZA, Station.UNIVERSITY_SPORTS_CENTRE], 0],
    [[Station.WU_YEE_SUN_COLLEGE_DOWNWARD, Station.NEW_ASIA_COLLEGE], 0],
    [[Station.WU_YEE_SUN_COLLEGE_DOWNWARD, Station.UNIVERSITY_ADMIN_BUILDING], 92],
    [[Station.WU_YEE_SUN_COLLEGE_UPWARD, Station.SHAW_COLLEGE_UPWARD], Math.average(94, 96)],
    [[Station.YIA, Station.CAMPUS_CIRCUIT_EAST_UPWARD], 0],
    [[Station.YIA, Station.UNIVERSITY_SPORTS_CENTRE], 0],
]);

/* -------------------------------------------------------------------------- */
declare global {
    interface Math {
        average(...values: number[]): number;
    }
}
Math.average = function (...values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};