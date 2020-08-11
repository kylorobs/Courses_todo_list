
export interface CourseModel {
    title: string,
    description: string;
    people: number;
    id: string;
    type: courseType;
}

export enum courseEnum {Active ='active', Finished = 'finished'}
export type courseType = courseEnum.Active | courseEnum.Finished;