export interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

export interface CoursePartDescripted extends CoursePartBase {
  description: string;
}

export interface CoursePartBasic extends CoursePartDescripted {
  kind: "basic"
}

export interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

export interface CoursePartBackground extends CoursePartDescripted {
  backgroundMaterial: string;
  kind: "background"
}

export interface CourcePartRequirement extends CoursePartDescripted {
  requirements: string[];
  kind: "special"
}

export type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CourcePartRequirement;
