function calculateSeason(date) {
    const year = date.getFullYear();

    if (date < new Date(`${date.getFullYear()}-07-10`)) {
        return `${year - 1}-${year}`;
    }

    return `${year}-${year + 1}`;
}

function getSeason(date = new Date()) {
    const { SEASON } = process.env;

    if (SEASON) {
        return SEASON;
    }

    return calculateSeason(date);
}

module.exports = getSeason;
