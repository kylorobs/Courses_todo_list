// Code goes here!

let single:SingleCourse;

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

const metaValidations = {}

function validate(){

}





class Project{

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

    initialisePage(){
        const content = this.template.content.cloneNode(true);
        this.host.appendChild(content)
    }

    validate(){
        let valid = true;
        if (!valid || this.formTitle.value.length <= 0) valid = false;
        else if (!valid ||  !this.formDescription || this.formDescription.value.length <=0) valid = false;
        else if(!valid || !this.formPeople || +this.formPeople.value <= 0 ) valid = false;
        return valid;
    }

    @BindThis
    newCourse(e: Event){
        e.preventDefault();
        if (!this.validate()) alert('Invalid Input')
        else {
            const course = new Course(this.formTitle.value, this.formDescription.value, +this.formPeople.value);
            single = SingleCourse.createInstance(this.formTitle.value)
            this.courses.push(course)
        }
    }
}


class SingleCourse{
    private _name: string; 
    // private template: HTMLTemplateElement;
    private host: HTMLDivElement;
    private static instance: SingleCourse;

    private constructor(name: string){
        console.log('running constructor')
        this._name = name;
        // this.template = document.getElementById('single-project')! as HTMLTemplateElement
        this.host = document.getElementById('app')! as HTMLDivElement;
        // this.singleItem = this.template.firstElementChild! as HTMLLIElement;
        this.setupDOM()
    }

    private set name(name: string){
        this._name = name;
        this.setupDOM();
    }

    private get name(){
        return this._name;
    }

    private setupDOM(){
        // const content = this.template.content.cloneNode(true) as DocumentFragment;
        let li: HTMLLIElement = this.host.querySelector('li')! as HTMLLIElement;
        if (li) li.innerText = this.name;
        else {
            const ul:HTMLUListElement = document.createElement('ul')! as HTMLUListElement;
            this.host.insertAdjacentElement('beforeend', ul);
            console.log('setting up')
            li = document.createElement('li')! as HTMLLIElement;
            li.innerText = this.name;
            ul.appendChild(li);
        }

    }

    static createInstance(name: string) : SingleCourse{
        console.log('running')
        if (this.instance) {
            console.log('Already an instance')
            this.instance.name = name;
            return this.instance
        }
        else {
            console.log('no instance')
            return this.instance = new SingleCourse(name);
        }
    }
}


interface Course {
    title: string,
    description: string;
    people: number;
}

class Course implements Course {
    title: string;
    description: string;
    people: number;

    constructor(title: string, description: string, people: number){
        this.title = title;
        this.description = description;
        this.people = people;
    }
}

const projectPage = new Project();
// SingleCourse.createInstance('Michael')