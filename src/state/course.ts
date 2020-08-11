import { State } from './state.js';
import { courseType, CourseModel } from '../models/course';

export class CourseState extends State<CourseModel> {

    courses: CourseModel[];
    private static instance: CourseState;
    
    private constructor(){
        super();
        this.courses =[];
    }

    addCourse(course:CourseModel){
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
