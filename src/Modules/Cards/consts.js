import Enum from 'enum';

// TODO: remove keys
export const studentAccountLevel = new Enum({ 0: 'beginner', 10: 'medium', 20: 'advanced' });
export const teacherAccountLevel =
  new Enum({ 0: 'candidate1', 10: 'candidate2', 20: 'candidate3', 30: 'candidate4', 40: 'teacher' });
