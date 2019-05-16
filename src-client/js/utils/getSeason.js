function calculateSeason(date = new Date()) {
    const year = date.getFullYear();

    if (date < new Date(`${year}-06-10`)) {
        return `${year - 1}-${year}`;
    }

    return `${year}-${year + 1}`;
}

module.exports = calculateSeason;
