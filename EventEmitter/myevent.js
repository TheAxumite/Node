class EventEmitter{

    listeners = {}

    on(eventName, functions){
        const list = eventName 
        list in listeners ? []: this.listeners.push(functions)
        


    }
}