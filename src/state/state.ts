type Listener<T> = (listeners: T[]) => void;

//CLASSES

export class State<T> {

    protected listeners: Listener<T>[] = [];

    addListener(listener: Listener<T>){
        this.listeners.push(listener)
    }
}