import { Component } from './base-component.js';
import { BindThis } from '../decorators/bindthis.js';
import { Course } from './course.js';
import { state } from '../app.js';
import { courseType } from '../models/course.js';
import { DragTarget } from '../models/drag.js';
import { SingleCourse } from './single.js';

export class CourseList extends Component<HTMLElement, HTMLDivElement> 
    implements DragTarget {

    private assignedCourses:Course[];
    private static instance: CourseList;
    private type: courseType;

    private constructor(type: courseType){
        super("project-list", "app", true, `${type}-projects`)
        this.assignedCourses = state.courses;
        this.type = type;
        this.configure()
        this.renderContent();
    }

    static createInstance(type: courseType){
        if (!this.instance){
            return this.instance = new CourseList(type)
        } else if (this.instance && this.instance.type !== type ){
            return this.instance = new CourseList(type)
        }
        else return this.instance
        
    }  

    @BindThis
    dragOverHandler(event: DragEvent){
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            this.parentElement.querySelector('ul')!.classList.add('droppable');
        }
    };

    @BindThis
    dropHandler(event: DragEvent){
        // console.log(event.dataTransfer!.getData('text/plain'));
        const id = event.dataTransfer!.getData('text/plain');
        state.moveProject(id, this.type);

    };

    @BindThis
    dragLeaveHandler(_: DragEvent){
        this.parentElement.querySelector('ul')!.classList.remove('droppable');
    };
    
    configure(){
        state.addListener(this.updateCourses);
        this.parentElement.addEventListener('dragover', this.dragOverHandler)
        this.parentElement.addEventListener('dragleave', this.dragLeaveHandler)
        this.parentElement.addEventListener('drop', this.dropHandler)
    }

    renderContent(){
        const header = this.parentElement.querySelector('h2')!;
        header.innerText = this.type;
        this.renderCourses();
    }

    @BindThis
    updateCourses(courses: Course[]){
        this.assignedCourses = courses;
        this.renderCourses()
    }

    @BindThis
    private renderCourses(){
        const ul = this.parentElement.querySelector('ul')! as HTMLUListElement;
        ul.id=this.type;
        ul.innerHTML = '';
        console.log(this.type)
        const filtered = this.assignedCourses.filter(course => course.type === this.type)
        for (const course of filtered){
                new SingleCourse(course, this.type)
        }
    }

}