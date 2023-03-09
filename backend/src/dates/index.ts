import { DayOfWeek } from "@prisma/client"
import { getDay } from "date-fns"

export function extractDayOfWeek(date: Date): DayOfWeek {
    const dayIndex = getDay(date)

    switch (dayIndex) {
        case 0:
            return DayOfWeek.SUNDAY
        case 1:
            return DayOfWeek.MONDAY
        case 2:
            return DayOfWeek.TUESDAY
        case 3:
            return DayOfWeek.WEDNESDAY
        case 4:
            return DayOfWeek.THURSDAY
        case 5:
            return DayOfWeek.FRYDAY
        case 6:
            return DayOfWeek.SATURDAY
        default:
            throw new Error("Dia da semana inválido")
    }
}