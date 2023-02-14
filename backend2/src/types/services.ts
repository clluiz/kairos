import { SchedulingService } from "../scheduling/services";

export interface Services {
    scheduling : ReturnType<typeof SchedulingService>,
  }