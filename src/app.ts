// Code goes here!

enum courseEnum {Active =' active', Finished = 'finished'}
type courseType = courseEnum.Active | courseEnum.Finished;


interface Course {
    title: string,
    description: string;
    people: number;
    id: string;
    type: courseType;
}



class Course implements Course {
    title: string;
    description: string;
    people: number;
    id: string;

    constructor(title: string, description: string, people: number){
        this.title = title;
        this.description = description;
        this.people = people;
        this.id = Math.random().toString(36).substr(2, 10);
        this.type = courseEnum.Active;
    }
}

class CourseState{

    courses: Course[];
    private listeners: Function[];
    private static instance: CourseState;
    
    private constructor(){
        this.courses =[];
        this.listeners = [];
    }

    addCourse(course:Course){
        this.courses.push(course);
        
        for (const listener of this.listeners){
            listener([...this.courses])
        }
    }

    addListener(listener: Function){
        this.listeners.push(listener)
    }

    static createInstance(){
        if (!this.instance){
            return new CourseState();
        }
        else return this.instance;
    }

}

const state = CourseState.createInstance();

function BindThis( _: any, _1 : string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const newDescriptor: PropertyDescriptor = {
        get(){
            const boundMethod = originalMethod.bind(this);
            return boundMethod   
        }
    }
    return newDescriptor;
}

class CourseForm {

    private template: HTMLTemplateElement;
    private host: HTMLDivElement;
    private form: HTMLFormElement
    private formSubmit: HTMLButtonElement;
    private formTitle: HTMLInputElement;
    private formDescription: HTMLInputElement;
    private formPeople: HTMLInputElement;
    public courses:Course[] = []

    constructor(){
        this.template = document.getElementById("project-input")! as HTMLTemplateElement;
        this.host = document.getElementById('app')! as HTMLDivElement;
        this.initialisePage()

        this.form = this.host.firstElementChild! as HTMLFormElement;
        this.form.id = 'user-input'
        this.formSubmit = this.form.querySelector('button')! as HTMLButtonElement;

        this.formTitle = this.form.querySelector('#title')! as HTMLInputElement
        this.formDescription = this.form.querySelector('#description')! as HTMLInputElement
        this.formPeople = this.form.querySelector('#people')! as HTMLInputElement

        this.attachListeners();

    }
    
    @BindThis
    attachListeners(){
        this.formSubmit.addEventListener('click', this.newCourse)
    }

    private initialisePage(){
        const content = this.template.content.cloneNode(true);
        this.host.appendChild(content);
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

abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    private template: HTMLTemplateElement;
    private parentElement: T;
    private host: U

    constructor(templateId: string, hostId: string, beforeEnd:boolean, assignId?:string){
        this.template = document.getElementById(templateId)! as HTMLTemplateElement;
        const imported =  document.importNode(this.template.content, true);
        this.parentElement = imported.firstElementChild! as T;
        this.host = document.getElementById(hostId)! as U;

        if (assignId){
            this.parentElement.id = assignId;
        }

        this.host.insertAdjacentElement(beforeEnd ? 'beforeend' : 'afterbegin', this.parentElement);
    }

    abstract configure(): void;
    abstract renderContent(): void;

}


class SingleCourse{
    private _name: string; 
    private host: HTMLDivElement;
    private static instance: SingleCourse;
    private ulElement: HTMLUListElement;

    private constructor(name: string){
        console.log('running constructor')
        this._name = name;
        this.host = document.getElementById('app')! as HTMLDivElement;
        this.ulElement = document.createElement('ul')! as HTMLUListElement;
        state.addListener(this.updateName)
        this.setupDOM();
    }

    @BindThis
    updateName(courses: Course[]){
        console.log(courses)
        console.log('Updating Name')
        this.name = courses[courses.length -1].title;
        this.renderName();
    }

    renderName(){
        let li = this.ulElement.querySelector('li')! as HTMLLIElement;
        li.innerText = this.name;
    }

    private set name(name: string){
        this._name = name;
    }

    private get name(){
        return this._name;
    }

    private setupDOM(){
        this.host.insertAdjacentElement('beforeend', this.ulElement);
        console.log('setting up')
        const li = document.createElement('li')! as HTMLLIElement;
        this.ulElement.appendChild(li);
        this.ulElement.id="single-course";
        this.renderName();
    }

    static createInstance() : SingleCourse {
        console.log('New Single Course Created')
        if (this.instance) return this.instance;
        else return this.instance = new SingleCourse(name);
    }
}


class CourseList extends Component<HTMLElement, HTMLDivElement> {

    private assignedCourses:Course[];
    private static instance: CourseList;
    private type: courseType;

    private constructor(type: courseType){
        super("projects", "app", true, `${type}-projects`)
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
    
    configure(){
        state.addListener(this.updateCourses);
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

    private renderCourses(){
        const ul = this.parentElement.querySelector('ul')! as HTMLUListElement;
        const current = Array.from(this.parentElement.querySelectorAll('li'));
        for (const course of this.assignedCourses){
            if (course.type !== this.type) return;
            else if (+current.findIndex(li => li.dataset.courseid === course.id) === -1){
                let li = document.createElement('li');
                li.innerText = course.title;
                li.dataset.courseid = course.id;
                ul.appendChild(li)
            }
            else console.log('Error')
        }
    }

}


const projectPage = new CourseForm();
const single = SingleCourse.createInstance();
const active = CourseList.createInstance(courseEnum.Active);
const finished = CourseList.createInstance(courseEnum.Finished);

