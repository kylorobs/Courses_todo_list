
import { CourseState } from './state/course'
import { CourseForm } from './components/form';
import { CourseList } from './components/list';
import { courseEnum } from './models/course'


export const state = CourseState.createInstance();
new CourseForm();
CourseList.createInstance(courseEnum.Active);
CourseList.createInstance(courseEnum.Finished);


