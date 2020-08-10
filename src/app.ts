// Code goes here!


//INTERFACES & TYPES

interface Course {
    title: string,
    description: string;
    people: number;
    id: string;
    type: courseType;
}

interface Dragable {
    dragStart(event: DragEvent) : void;
    dragEnd(event: DragEvent) : void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent) : void;
    dropHandler(event: DragEvent) : void;
    dragLeaveHandler(event: DragEvent) : void;
}

enum courseEnum {Active ='active', Finished = 'finished'}
type courseType = courseEnum.Active | courseEnum.Finished;
type Listener<T> = (listeners: T[]) => void;



//DECORATORS

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


//CLASSES

class State<T> {
    protected listeners: Listener<T>[] = [];


    addListener(listener: Listener<T>){
        this.listeners.push(listener)
    }
}

class CourseState extends State<Course> {

    courses: Course[];
    private static instance: CourseState;
    
    private constructor(){
        super();
        this.courses =[];
    }

    addCourse(course:Course){
        this.courses.push(course);
        this.updateListeners();
    }

    moveProject(id: string, newType: courseType){
        const selectedCourse = this.courses.find(course => course.id === id);
        if(selectedCourse && selectedCourse.type !== newType){
            selectedCourse.type = newType;
            this.updateListeners();
        }
   
    }

    updateListeners(){
        // console.log(this.courses)
        for (const listener of this.listeners){
            listener([...this.courses])
        }
    }


    static createInstance(){
        if (!this.instance){
            return new CourseState();
        }
        else return this.instance;
    }

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


abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    private template: HTMLTemplateElement;
    parentElement: T;
    host: U

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

class CourseForm extends Component<HTMLFormElement, HTMLDivElement>{

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



class SingleCourse extends Component<HTMLUListElement, HTMLDivElement> 
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


class CourseList extends Component<HTMLElement, HTMLDivElement> 
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
        // const current = Array.from(this.parentElement.querySelectorAll('li'));
        ul.innerHTML = '';
        console.log(this.type)
        const filtered = this.assignedCourses.filter(course => course.type === this.type)
        for (const course of filtered){
                new SingleCourse(course, this.type)
        }
    }

}


const state = CourseState.createInstance();
const form = new CourseForm();
const active = CourseList.createInstance(courseEnum.Active);
const finished = CourseList.createInstance(courseEnum.Finished);

