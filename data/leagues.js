// بيانات البطولات الرئيسية
const leagues = [
  {
    id: 2001,
    name: "دوري أبطال أوروبا",
    code: "UCL",
    emblem: "assets/images/leagues/ucl.png",
    plan: "TIER_ONE",
    currentSeason: {
      startDate: "2024-09-17",
      endDate: "2025-05-31"
    }
  },
  {
    id: 2021,
    name: "الدوري الإنجليزي الممتاز",
    code: "PL",
    emblem: "assets/images/leagues/premier-league.png",
    plan: "TIER_ONE",
    currentSeason: {
      startDate: "2024-08-16",
      endDate: "2025-05-25"
    }
  },
  {
    id: 2014,
    name: "الدوري الإسباني",
    code: "PD",
    emblem: "assets/images/leagues/laliga.png",
    plan: "TIER_ONE",
    currentSeason: {
      startDate: "2024-08-16",
      endDate: "2025-05-25"
    }
  },
  // بقية البطولات ...
];

/**
 * @description إرجاع قائمة جميع البطولات
 * @returns {Array} قائمة البطولات
 */
export function getLeagues() {
  return leagues;
}

/**
 * @description البحث عن بطولة بواسطة ID
 * @param {number} leagueId - معرف البطولة
 * @returns {Object|null} بيانات البطولة أو null إذا لم يتم العثور عليها
 */
export function getLeagueById(leagueId) {
  return leagues.find(league => league.id === leagueId) || null;
}

/**
 * @description البحث عن بطولة بواسطة Code
 * @param {string} leagueCode - رمز البطولة
 * @returns {Object|null} بيانات البطولة أو null إذا لم يتم العثور عليها
 */
export function getLeagueByCode(leagueCode) {
  return leagues.find(league => league.code === leagueCode) || null;
}

/**
 * @description الحصول على شعار البطولة
 * @param {string} leagueCode - رمز البطولة
 * @returns {string} رابط صورة الشعار
 */
export function getLeagueEmblem(leagueCode) {
  const league = getLeagueByCode(leagueCode);
  return league ? league.emblem : 'assets/images/leagues/default.png';
}

/**
 * @description الحصول على الموسم الحالي للبطولة
 * @param {string} leagueCode - رمز البطولة
 * @returns {Object|null} بيانات الموسم الحالي أو null إذا لم يتم العثور عليها
 */
export function getCurrentSeason(leagueCode) {
  const league = getLeagueByCode(leagueCode);
  return league ? league.currentSeason : null;
}
