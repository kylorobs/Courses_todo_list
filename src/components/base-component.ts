
export abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    private template: HTMLTemplateElement;
    parentElement: T;
    host: U

    constructor(templateId: string, hostId: string, beforeEnd:boolean, assignId?:string){
        console.log('Why Hello Uhtred')
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
