const monthList = {
    "Styczeń": 1, "Luty": 2, "Marzec": 3, "Kwiecień": 4, "Maj": 5, "Czerwiec": 6,
    "Lipiec": 7, "Sierpień": 8, "Wrzesień": 9, "Październik": 10, "Listopad": 11, "Grudzień": 12
}

export function getYearsFromToDate(yearFrom) {
    const date = new Date()
    return getYearsFromTo(yearFrom, date.getFullYear())
}

export function getYearsFromTo(yearFrom, yearTo) {
    const years = []

    for(let i = yearTo; i >= yearFrom; i--) {
        years.push(i)
    }

    return years
}

export function getMonths() {
    return Object.keys(monthList)
}

export function getMonthID(monthName) {
    return monthList[monthName]
}