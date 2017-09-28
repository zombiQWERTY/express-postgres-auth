import Enum from 'enum';

export const accountLevel = {
  student: new Enum({ 0: 'beginner', 10: 'medium', 20: 'advanced' }),
  teacher: new Enum({ 0: 'candidate1', 10: 'candidate2', 20: 'candidate3', 30: 'candidate4', 40: 'teacher' })
};
