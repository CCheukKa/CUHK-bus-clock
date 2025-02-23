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
    UNIVERSITY_STATION_PIAZZA = 'University Station Piazza',
    WU_YEE_SUN_COLLEGE_DOWNWARD = 'Wu Yee Sun College (Downward)',
    WU_YEE_SUN_COLLEGE_UPWARD = 'Wu Yee Sun College (Upward)',
    YIA = 'YIA',
};

export type BusRouteInfo = {
    colour: string,
    firstService: [number, number],
    lastService: [number, number],
    days: number[],
    minuteMarks: number[],
    stations: Station[],
};

export const BusRouteInfos = Object.freeze(
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
                Station.RESIDENCE_15,
                Station.UNTIED_COLLEGE_STAFF_RESIDENCE,
                Station.CHAN_CHUN_HA_HOSTEL,
                Station.SHAW_COLLEGE_DOWNWARD,
                Station.WU_YEE_SUN_COLLEGE_DOWNWARD,
                Station.UNIVERSITY_ADMIN_BUILDING,
                Station.SHHO_COLLEGE,
                Station.UNIVERSITY_STATION_PIAZZA,
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
                Station.UNIVERSITY_STATION,
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
                Station.CWC_COLLEGE_DOWNWARD,
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
                Station.CWC_COLLEGE_DOWNWARD,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.UNIVERSITY_STATION,
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
                Station.CHUNG_CHI_TEACHING_BUILDING,
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
                Station.UNIVERSITY_STATION,
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
    route: BusRoute,
    etaTime: Date,
}

export function getETAs(station: Station, currentTime: Date, pastMinutes: number, futureMinutes: number): EtaInfo[] {
    const pastTime = new Date(currentTime.getTime() - pastMinutes * 60000);
    const futureTime = new Date(currentTime.getTime() + futureMinutes * 60000);
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const etas: EtaInfo[] = [];

    BusRouteInfos.forEach((routeInfo, route) => {
        if (!routeInfo.days.includes(currentTime.getDay())) return;
        if (currentHour < routeInfo.firstService[0] || currentHour > routeInfo.lastService[0]) return;
        if (currentHour === routeInfo.firstService[0] && currentMinute < routeInfo.firstService[1]) return;
        if (currentHour === routeInfo.lastService[0] && currentMinute > routeInfo.lastService[1]) return;
        if (!routeInfo.stations.includes(station)) return;
        routeInfo.minuteMarks.forEach(minuteMark => {
            const pastHourEtaTime = new Date(currentTime);
            const currentHourEtaTime = new Date(currentTime);
            const futureHourEtaTime = new Date(currentTime);

            pastHourEtaTime.setHours(currentHour - 1, minuteMark);
            currentHourEtaTime.setHours(currentHour, minuteMark);
            futureHourEtaTime.setHours(currentHour + 1, minuteMark);

            etas.push(
                { route, etaTime: pastHourEtaTime },
                { route, etaTime: currentHourEtaTime },
                { route, etaTime: futureHourEtaTime },
            );
        });
    });

    return etas.filter(eta => eta.etaTime >= pastTime && eta.etaTime <= futureTime);
}