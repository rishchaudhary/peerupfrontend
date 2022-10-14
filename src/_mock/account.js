// ----------------------------------------------------------------------

const account = {
  displayName: 'Purdue Pete',
  isStudent: true,
  major: 'Computer Science',
  year: 'Sophomore',
  email: 'pete@purdue.edu',
  photoURL: '/static/purdue-pete.png',
  ratingVal: 4.5,
  bio: 'Testing bio for cs student',
  enrolled: [
    {class:"CS 180", id: 1}, 
    {class:"CS 182", id: 2}, 
    {class:"CS 240", id: 3}, 
    {class:"MA 161", id: 4}
  ],
  dayPref: [    
    {class:"Mon", id: 1}, 
    {class:"Tue", id: 2}, 
    {class:"Wed", id: 3}, 
    {class:"Thu", id: 4},
    {class:"Fri", id: 5}
  ],
  timePref: [
    {class:"Morning", id: 1}, 
    {class:"Afternoon", id: 2}, 
    {class:"Evening", id: 3},
  ],
  userID: '32333'
};

export default account;
