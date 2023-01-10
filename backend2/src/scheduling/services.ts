import { KairosInstance } from "../kairosInstance";
import { Scheduling } from "./model";

export function SchedulingService(app : KairosInstance) {
  return {
    async create(scheduling : Scheduling | null) {
      return {}
    },
    async list() {
      return []
    }
  }
}