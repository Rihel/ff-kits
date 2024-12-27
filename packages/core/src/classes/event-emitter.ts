type EventData<Event extends string> = {
  type: Event
  payload: any
}
export type EventHandler<Event extends string> = (
  event: EventData<Event>
) => void

export class EventEmitter<EventNames extends string> {
  private eventMap: Record<EventNames, EventHandler<EventNames>[]> =
    {} as Record<EventNames, EventHandler<EventNames>[]>

  on(eventName: EventNames, handler: EventHandler<EventNames>) {
    if (!(eventName in this.eventMap)) {
      this.eventMap[eventName] = []
    }
    this.eventMap[eventName].push(handler)
    return this
  }
  off(eventName: EventNames, handler: EventHandler<EventNames>) {
    this.eventMap[eventName] = this.eventMap[eventName]?.filter((item) => {
      return item !== handler
    })
  }
  offAll() {
    this.eventMap = {} as Record<EventNames, EventHandler<EventNames>[]>
  }
  emit(eventName: EventNames, data?: Record<string, any>) {
    const handlers = this.eventMap[eventName] || []
    handlers.forEach((handle) => {
      handle({
        type: eventName,
        payload: data,
      })
    })
  }
}
