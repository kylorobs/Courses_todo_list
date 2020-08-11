
import { CourseState } from './state/course.js'
import { CourseForm } from './components/form.js';
import { CourseList } from './components/list.js';
import { courseEnum } from './models/course.js'


export const state = CourseState.createInstance();
CourseList.createInstance(courseEnum.Active);
CourseList.createInstance(courseEnum.Finished);
new CourseForm();


