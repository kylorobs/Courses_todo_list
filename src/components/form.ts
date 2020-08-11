import { Component } from './base-component.js';
import { BindThis } from '../decorators/bindthis.js';
import { Course } from './course.js';
import { state } from '../app.js';


export class CourseForm extends Component<HTMLFormElement, HTMLDivElement>{

    private formSubmit: HTMLButtonElement;
    private formTitle: HTMLInputElement;
    private formDescription: HTMLInputElement;
    private formPeople: HTMLInputElement;


    constructor(){

        super("project-input", "app", false, 'user-input')

        this.formSubmit = this.parentElement.querySelector('button')! as HTMLButtonElement;
        this.formTitle = this.parentElement.querySelector('#title')! as HTMLInputElement
        this.formDescription = this.parentElement.querySelector('#description')! as HTMLInputElement
        this.formPeople = this.parentElement.querySelector('#people')! as HTMLInputElement

        this.configure();
        this.renderContent();

    }
    
    @BindThis
    configure(){
        this.formSubmit.addEventListener('click', this.newCourse)
    }

    private validate(){
        let valid = true;
        if (!valid || this.formTitle.value.length <= 0) valid = false;
        else if (!valid ||  !this.formDescription || this.formDescription.value.length <=0) valid = false;
        else if(!valid || !this.formPeople || +this.formPeople.value <= 0 ) valid = false;
        return valid;
    }

    private clearInputs(){
        this.formTitle.value = "";
        this.formDescription.value = "";
        this.formPeople.value = "";
    }

    renderContent():void{};

    @BindThis
    private newCourse(e: Event){
        e.preventDefault();
        if (!this.validate()) alert('Invalid Input')
        else {
            const course = new Course(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
            state.addCourse(course);
            this.clearInputs();
        }
    }

}