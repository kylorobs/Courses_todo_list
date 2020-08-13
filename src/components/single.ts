import { Component } from './base-component';
import { BindThis } from '../decorators/bindthis';
import { Course } from './course';
import { Dragable } from '../models/drag';

export class SingleCourse extends Component<HTMLUListElement, HTMLDivElement> 
    implements Dragable {

    private course: Course;

    get people(){
        let noun = this.course.people === 1? 'Person' : 'People'
        return `${this.course.people} ${noun}`;
    }

    @BindThis
    dragStart(event: DragEvent){
        event.dataTransfer!.setData('text/plain', this.course.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @BindThis
    dragEnd(_: DragEvent){
        console.log('drag end')   
    }

    constructor(course: Course, hostId: string){
        super('single-project', hostId, true, course.id)
        this.course = course;

        this.configure();
        this.renderContent();
    }

    configure(){
        this.parentElement.addEventListener('dragstart', this.dragStart);
        this.parentElement.addEventListener('dragend', this.dragEnd)
    }

    renderContent(){
        this.parentElement.querySelector('h3')!.innerText = this.course.title;
        this.parentElement.querySelectorAll('p')![0]!.innerText = this.people;
        this.parentElement.querySelectorAll('p')![1]!.innerText = this.course.description;
    }

}