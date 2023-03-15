import { DayOfWeek } from "@prisma/client"
import { getDay, parseISO } from "date-fns"

export function extractDayOfWeek(date: Date | string): DayOfWeek {
  // TODO: avaliar um forma de melhor de fazer isso. Usar zod ou typebox
  const dayIndex =
    typeof date === "string" ? getDay(parseISO(date)) : getDay(date)

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
      throw
      new Error("Dia da semana inválido")
  }
}
