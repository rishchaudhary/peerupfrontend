import { getDatabase, get, set, ref } from "firebase/database";
import {Requests} from './Requests';
import {Tutor} from './Tutor'
import { sendEmailNotification } from "./SendEmail";

export class MatchingAlgorithm{


    static async match(requestID, priorityList) {

        const requestData = Requests.get_information(requestID)
        const data = await requestData.then(val => {return val;});
        const language = data.LanguagePreference;
        const course = data.CourseWanted;

        const days = [];
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < 7; i += 1) {

            if (await this.get_specific_day_from_request(requestID, i)) {
                days.push(i);
            }
        }
        /* eslint-disable no-await-in-loop */
        
        const timeData = data.Time;
        const timeData2 = timeData.split(' ')[1]
        const timeData3 = timeData[4].split(':');
        const timeData4 = parseFloat(timeData3[0]);
        let time;

        if (timeData2 === 'AM') {
            time = 0;
        }
        else if (timeData4 > 16 && timeData2 === 'PM') {
            time = 2;
        }
        else {
            time = 1;
        }

        const dateData = data.Date.split(',')[0];
        let day;

        if (dateData === 'Mon') {
            day = 0
        }
        else if (dateData === 'Tue') {
            day = 1;
        }
        else if (dateData === 'Wed') {
            day = 2;
        }
        else if (dateData === 'Thu') {
            day = 3;
        }
        else if (dateData === 'Fri') {
            day = 4;
        }
        else if (dateData === 'Sat') {
            day = 5;
        }
        else {
            day = 6;
        }

        const tutorListData = this.get_all_tutors();
        const data2 = await tutorListData.then(val => {return val;});
        const tutorIDs = Object.keys(data2);
        let tutorList = [];

        if (priorityList[0] === 'language') {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = Tutor.get_information(tutorIDs[i]);
                const data3 = await tutorData.then(val => {return val;});
                const languageForTutor = data3.Language;

                if(languageForTutor === language) {
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityList[0] === 'time') {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = this.get_specific_time(tutorIDs[i], time);
                const data3 = await tutorData.then(val => {return val;});


                if(data3) {
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityList[0] === 'day' && days.length === 0) {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = this.get_specific_day(tutorIDs[i], day);
                const data3 = await tutorData.then(val => {return val;});


                if(data3) {
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityList[0] === 'day' && days.length !== 0) {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {
                for (let k = 0; k < days.length; k += 1) {

                    const tutorData = this.get_specific_day(tutorIDs[i], days[k]);
                    const data3 = await tutorData.then(val => {
                        return val;
                    });

                    if (data3) {
                        tutorList.push(tutorIDs[i]);
                    }
                }
            }
            /* eslint-disable no-await-in-loop */

            tutorList = tutorList.filter((c, index) =>  {
                return tutorList.indexOf(c) === index;
            });
        }

        else {

            const listOfVerifiedTutors = [];
            const listOfNotVerifiedTutors = [];

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = Tutor.get_information(tutorIDs[i]);
                const data3 = await tutorData.then(val => {
                    return val;
                });
                const verifiedCourses = data3.VerifiedCourses;
                const verifiedCoursesArray = Object.keys(verifiedCourses).map((key) => verifiedCourses[key]);
                const notVerifiedCourses = data3.NotVerifiedCourses;
                const notVerifiedCoursesArray = Object.keys(notVerifiedCourses).map((key) => notVerifiedCourses[key]);

                for (let j = 0; j < verifiedCoursesArray.length; j += 1) {

                    if (verifiedCoursesArray[j] === course) {

                        listOfVerifiedTutors.push(tutorIDs[i]);
                    }

                }

                for (let k = 0; k < notVerifiedCoursesArray.length; k += 1) {

                    if (notVerifiedCoursesArray[k] === course) {

                        listOfNotVerifiedTutors.push(tutorIDs[i]);
                    }

                }
            }
            /* eslint-disable no-await-in-loop */

            if (listOfVerifiedTutors.length !== 0) {
                tutorList = listOfVerifiedTutors;
            } else if (listOfNotVerifiedTutors.length !== 0) {
                tutorList = listOfNotVerifiedTutors;
            } else {
                tutorList = tutorIDs;
            }
        }

        if (tutorList.length === 0) {
            tutorList = tutorIDs;
        }

        console.log('yes');
        console.log(tutorList);
        for (let m = 1; m < priorityList.length; m += 1) {
            tutorList = await this.match_2(priorityList[m], tutorList, language, course, time, day, days);
        }


        console.log(tutorList);
        /* eslint-disable no-await-in-loop */
        for (let i = 0; i < tutorList.length; i += 1) {

            const tutorData = Tutor.get_information(tutorList[i]);
            const data3 = await tutorData.then(val => {return val;});
            const requests = data3.Requests;
            const requestsArray = Object.keys(requests).map((key) => requests[key]);
            requestsArray.push(requestID);
            await set(ref(getDatabase(), `TutorAccounts/${tutorList[i]}/Requests`), requestsArray);
                    // send email to tutor that they have matched with someone
                    const tutorEmail = await (await get(ref(getDatabase(), `Users/${tutorList[i]}/Email`))).val();
                    console.log("email: ", tutorEmail);

                    sendEmailNotification(tutorEmail).then(() => {
                        console.log("Tutor", tutorEmail[i], "sent email notification")
                    }).catch((error) => {
                        console.log("Error sending email notification: ", error);
                    });
        }
        /* eslint-disable no-await-in-loop */

        return tutorList;
    }

    static async match_2(priorityItem, tutorIDs, language, course, time, day, days) {

        let tutorList = [];

        if (priorityItem === 'language') {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = Tutor.get_information(tutorIDs[i]);
                const data3 = await tutorData.then(val => {return val;});
                const languageForTutor = data3.Language;

                if(languageForTutor === language) {
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityItem === 'time') {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = this.get_specific_time(tutorIDs[i], time);
                const data3 = await tutorData.then(val => {return val;});


                if(data3) {
                    console.log(data3);
                    console.log(tutorIDs[i]);
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityItem === 'day' && days.length === 0) {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = this.get_specific_day(tutorIDs[i], day);
                const data3 = await tutorData.then(val => {return val;});


                if(data3) {
                    tutorList.push(tutorIDs[i]);
                }
            }
            /* eslint-disable no-await-in-loop */
        }

        else if (priorityItem === 'day' && days.length !== 0) {

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {
                for (let k = 0; k < days.length; k += 1) {

                    const tutorData = this.get_specific_day(tutorIDs[i], days[k]);
                    const data3 = await tutorData.then(val => {
                        return val;
                    });

                    if (data3) {
                        tutorList.push(tutorIDs[i]);
                    }
                }
            }
            /* eslint-disable no-await-in-loop */

            tutorList = tutorList.filter((c, index) =>  {
                return tutorList.indexOf(c) === index;
            });
        }

        else {

            const listOfVerifiedTutors = [];
            const listOfNotVerifiedTutors = [];

            /* eslint-disable no-await-in-loop */
            for (let i = 0; i < tutorIDs.length; i += 1) {

                const tutorData = Tutor.get_information(tutorIDs[i]);
                const data3 = await tutorData.then(val => {
                    return val;
                });
                const verifiedCourses = data3.VerifiedCourses;
                const verifiedCoursesArray = Object.keys(verifiedCourses).map((key) => verifiedCourses[key]);
                const notVerifiedCourses = data3.NotVerifiedCourses;
                const notVerifiedCoursesArray = Object.keys(notVerifiedCourses).map((key) => notVerifiedCourses[key]);

                for (let j = 0; j < verifiedCoursesArray.length; j += 1) {

                    if (verifiedCoursesArray[j] === course) {

                        listOfVerifiedTutors.push(tutorIDs[i]);
                    }

                }

                for (let k = 0; k < notVerifiedCoursesArray.length; k += 1) {

                    if (notVerifiedCoursesArray[k] === course) {

                        listOfNotVerifiedTutors.push(tutorIDs[i]);
                    }

                }
            }
            /* eslint-disable no-await-in-loop */

            if (listOfVerifiedTutors.length !== 0) {
                tutorList = listOfVerifiedTutors;
            } else if (listOfNotVerifiedTutors.length !== 0) {
                tutorList = listOfNotVerifiedTutors;
            } else {
                tutorList = tutorIDs;
            }
        }

        if (tutorList.length === 0) {
            return tutorIDs;
        }

        return tutorList;

    }


    static async get_all_tutors() {

        const db = getDatabase();
        const tutorRef = ref(db, `TutorAccounts`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
    }

    static async get_specific_day(userID, num) {
        const db = getDatabase();
        const daysRef = ref(db, `TutorAccounts/${userID}/PreferredDays/${num}/value`);
        const snapshot = (await (get(daysRef))).toJSON();
        return snapshot;
    }
    
    static async get_specific_day_from_request(requestID, num) {
        const db = getDatabase();
        const daysRef = ref(db, `requests/${requestID}/PreferredDays/${num}/value`);
        const snapshot = (await (get(daysRef))).toJSON();
        return snapshot;
    }

    static async get_specific_time(userID, num) {
        const db = getDatabase();
        const timesRef = ref(db, `TutorAccounts/${userID}/PreferredTimings/${num}/value`);
        const snapshot = (await (get(timesRef))).toJSON();
        console.log(snapshot)
        return snapshot;
    }
}
