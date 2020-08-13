import { CourseModel, courseType, courseEnum } from '../models/course';

export class Course implements CourseModel {
    title: string;
    description: string;
    people: number;
    id: string;
    type: courseType;

    constructor(title: string, description: string, people: number){
        this.title = title;
        this.description = description;
        this.people = people;
        this.id = Math.random().toString(36).substr(2, 10);
        this.type = courseEnum.Active;
    }
}
