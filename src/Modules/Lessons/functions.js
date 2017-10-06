export const getBusyLesson = `
  lessons."dayOfWeek" = "teacherAvailability"."dayOfWeek" AND
  (
    (lessons.start  = "teacherAvailability".start AND lessons.end    = "teacherAvailability".end ) OR 
    (lessons.end    = "teacherAvailability".start AND lessons.start  = "teacherAvailability".end ) OR
    (lessons.start <= "teacherAvailability".start AND lessons.end   >= "teacherAvailability".end ) OR
    (lessons.start >= "teacherAvailability".start AND lessons.end   <= "teacherAvailability".end )
  )
`;
