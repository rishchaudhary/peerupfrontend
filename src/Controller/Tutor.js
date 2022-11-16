import { getDatabase,set, remove, ref, get } from "firebase/database";
import { Review } from "./Review";
import {User} from './User'
import {Feedback} from './Feedback'
import {Requests} from './Requests'
 
export class Tutor {
    

    // This function saves the data of a new tutor account to the database.
    // It sets the value of the HasTutorAccount field of the User class to true. This tells us that the given user is also a tutor.
    // We will use the user ID as our tutor ID.
    static async create_profile(userID, price, courses, preferredDays, preferredTimings) {

        set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), true);

        const days = [
            {key:"Mon", value: false},
            {key:"Tue", value: false},
            {key:"Wed", value: false},
            {key:"Thu", value: false},
            {key:"Fri", value: false},
            {key:"Sat", value: false},
            {key:"Sun", value: false},
        ];
        for (let i = 0; i < preferredDays.length; i += 1) {
            days[preferredDays[i]].value = true;
        }

        const times = [
            {key:"Morning", value: false},
            {key:"Afternoon", value: false},
            {key:"Evening", value: false},
        ];
        for (let i = 0; i < preferredTimings.length; i += 1) {
            times[preferredTimings[i]].value = true;
        }

        const badges = [
            {badge:"Beginner Badge", description: 'Well done!!! You have hosted your first session', value: false},
            {badge:"Bronze Badge", description: 'Well done!!! You have hosted 10 sessions', value: false},
            {badge:"Silver Badge", description: 'Well done!!! You have hosted 25 sessions', value: false},
            {badge:"Gold Badge", description: 'Well done!!! You have hosted 50 sessions', value: false},
            {badge:"Pro Badge", description: 'Well done!!! You have hosted 75 sessions', value: false},
            {badge:"Boss Badge", description: 'Well done!!! You have hosted 100 sessions', value: false},
        ];

        const data = Tutor.get_all_tutor_accounts();
        const data2 = await data.then(val => {return val;});
        let data3;
        if (data2 === null) {
            data3 = 0;
        }

        else {
            data3 = Object.keys(data2).length;
        } 
     
        const coursesForUniv = this.get_all_courses_for_university('Purdue');
        const data4 = await coursesForUniv.then(val => {return val;});
        let data5;
        if (data4 === null) {
            /* eslint-disable no-await-in-loop */
            for (let j = 0; j < courses.length; j += 1) {
                await set(ref(getDatabase(), `University/Purdue/${courses[j]}`), 1);
            }
            /* eslint-disable no-await-in-loop */
        }

        else {
            data5 = Object.keys(data4);
            const data6 = Object.keys(data4).map((key) => data4[key]);
            let found  = -1;

            for (let i = 0; i < courses.length; i += 1) {
                for (let j = 0; j < data5.length; j += 1) {

                    if (courses[i] === data5[j]) {
                        found = 1;
                        await set(ref(getDatabase(), `University/Purdue/${courses[i]}`), data6[j] + 1);
                        break;
                    }
                }

                if (found === -1) {
                    await set(ref(getDatabase(), `University/Purdue/${courses[i]}`), 1);
                }
                else {
                    found = -1;
                }
            }

        }
        
        set(ref(getDatabase(), `TutorAccounts/${userID}`), {
            Sessions: ["Session ID"],
            Requests: ["Request ID"],
            ReviewsForTutor: ["Review ID"],
            Feedback: ['Feedback ID'],
            VerifiedCourses: ["Course Name"],
            NotVerifiedCourses: courses,
            PreferredDays: days,
            PreferredTimings: times,
            TutorBio: 'Go to settings to update your bio!',
            Badges: badges,
            Price: price,
            Rating: 0,
            SessionsCompleted: 0,
            Language: 'English',
            University: 'Purdue',
            TutorID: userID,
            ID: data3
            },
        
        ).then(() => {
            return "Data Saved Successfully";
        })
        .catch((error) => {
            return error
        });

    }
 
 
    static async get_all_courses_for_university(university) {

        const db = getDatabase();
        const univRef = ref(db, `University/${university}`);
        const snapshot = (await (get(univRef))).toJSON();
        return snapshot;
    }

    // This function deletes a particular tutor's data from the database.
    // It sets the HasTutorAccount to false. Meaning that the given user does not have a tutor account
    static async delete_profile(userID) {
        
        const data = Tutor.get_information(userID);
        const data1 = await data.then(val => {return val;});
        const data2 = data1.Sessions;
        const result = Object.keys(data2).map((key) => data2[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result.length; i += 1) {
            const sessionID = result[i].split('/');
            await remove(ref(getDatabase(), `Sessions/${result[i]}`));
            const userData = User.get_information(sessionID[0]);
            const data3 = await userData.then(val => {return val;});
            const data4 = data3.Sessions;
            const result1 = Object.keys(data4).map((key) => data4[key]);

            for (let k = 0; k < result1.length; k += 1) {

                if (result1[k] === sessionID[1]) {
                    result1.splice(k,1);
                    await set(ref(getDatabase(), `Users/${sessionID[0]}/Sessions`), result1);
                }
            }
        }

        const data5 = data1.ReviewsForTutor;
        const result2 = Object.keys(data5).map((key) => data5[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result2.length; i += 1) {
            const reviewID = result2[i].split('/');
            await remove(ref(getDatabase(), `Reviews/${result[i]}`));
            const userData = User.get_information(reviewID[0]);
            const data3 = await userData.then(val => {return val;});
            const data4 = data3.Reviews;
            const result1 = Object.keys(data4).map((key) => data4[key]);

            for (let k = 1; k < result1.length; k += 1) {

                if (result1[k] === reviewID[1]) {
                    result1.splice(k,1);
                    await set(ref(getDatabase(), `Users/${reviewID[0]}/Reviews`), result1);
                }
            }
        }

        const data6 = data1.Feedback;
        const result3 = Object.keys(data6).map((key) => data6[key]);
        /* eslint-disable no-await-in-loop */
        for (let i = 1; i < result3.length; i += 1) {
            await Feedback.delete_feedback(`${userID}/${result3[i]}`);
        }

        const data7 = data1.NotVerifiedCourses;
        const result4 = Object.keys(data7).map((key) => data7[key]);
        const data8 = data1.VerifiedCourses;
        const result5 = Object.keys(data8).map((key) => data8[key]);
        const coursesForUniv = this.get_all_courses_for_university('Purdue');
        const data9 = await coursesForUniv.then(val => {return val;});
        const data10 = Object.keys(data9);
        const data11 = Object.keys(data9).map((key) => data9[key]);

        for (let i = 0; i < result4.length; i += 1) {
            for (let j = 0; j < data10.length; j += 1) {

                if ((result4[i] === data10[j]) && (data11[j] - 1 !== 0)) {

                    await set(ref(getDatabase(), `University/Purdue/${result4[i]}`), data11[j] - 1);
                    break;
                }

                else if ((result4[i] === data10[j]) && (data11[j] - 1 === 0)) {

                    await set(ref(getDatabase(), `University/Purdue/${result4[i]}`), null);
                    break;
                }

                else {
                    console.log('next');
                }
            }

        }

        for (let i = 0; i < result5.length; i += 1) {
            for (let j = 0; j < data10.length; j += 1) {

                if ((result5[i] === data10[j]) && (data11[j] - 1 !== 0)) {

                    await set(ref(getDatabase(), `University/Purdue/${result5[i]}`), data11[j] - 1);
                    break;
                }

                else if ((result5[i] === data10[j]) && (data11[j] - 1 === 0)) {

                    await set(ref(getDatabase(), `University/Purdue/${result5[i]}`), null);
                    break;
                }

                else {
                    console.log('next');
                }
            }

        }

        const data12 = data1.Requests;
        const result6 = Object.keys(data12).map((key) => data12[key]);

        for (let m = 1; m < result6.length; m += 1) {
            const request = Requests.get_information(result6[m]);
            const data = await request.then(val => {return val;});
            const matchedTutors = data.MatchedTutors;
            let result = Object.keys(matchedTutors).map((key) => matchedTutors[key]);

            for (let r = 0; r < result.length; r += 1) {
                if (result[r] === userID) {
                    result.splice(r,1);
                    await set(ref(getDatabase(), `Requests/${result6[m]}/MatchedTutors`), result);
                    break;
                }
            }

            const offers = data.Offers;
            result = Object.keys(offers).map((key) => offers[key]);

            for (let r = 1; r < result.length; r += 1) {
                const offerData = Requests.get_offer_info(result6[m], result[r]);
                const data = await offerData.then(val => {return val;});
                const createdBy = data.Tutor;

                if (createdBy === userID) {
                    await set(ref(getDatabase(), `Requests/${result6[m]}/Offers/${result[r]}`), null);
                }
            }
        }


        /* eslint-disable no-await-in-loop */
        await remove(ref(getDatabase(), `TutorAccounts/${userID}`))
        await set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), false);


    }

    // If the tutor wants to change the list of courses they want to tutor for, they will give us the new list of
    // courses they want to tutor for. I will then check to see if any of these courses have already been verified by the admin.
    // if yes, then add them to the list called verified courses else add to the list called notVerified. These two lists are 
    // set as the value of the keys VerifiedCourses and NotverifiedCourses respectively.
    static async update_courses(userID, courses) {
        
        const tutorData = this.get_information(userID);
        const data = await tutorData.then(val => {return val;});
        const verifiedCourses = data.VerifiedCourses;
        const result = Object.keys(verifiedCourses).map((key) => verifiedCourses[key]);
        const values1 = [];
        
        for(let i = 0; i < courses.length; i += 1) {

            for (let j = 0; j < result.length; j += 1) {
        
                if (courses[i] === result[j]) {
                    values1.push(courses[i]);
                    courses[i] = 'Done';
                }
            }
        }

        const values2 = [];

        for(let i = 0; i < courses.length; i += 1) {

            if (courses[i] !== 'Done') {
                values2.push(courses[i]);
            }
        }

        // These two if statements are for the purpose of mainting the size of instances across all tutor accounts
        if (values1.length === 0) {
            values1.push('N/A');
        }

        if (values2.length === 0) {
            values2.push('N/A');
        }

        console.log(values1);
        console.log(values2);
        set(ref(getDatabase(), `TutorAccounts/${userID}/VerifiedCourses`), values1);
        set(ref(getDatabase(), `TutorAccounts/${userID}/NotVerifiedCourses`), values2);
    }

    // Once the admin looks over the tutor's transcript, they must enter a list of verified and not verified courses for
    // that tutor. This list will then be used by this function to make these changes appear in the database.
    static update_by_admin(userID, newVerifiedList, newNotVerifiedList) {
         
         // These two if statements are for the purpose of mainting the size of instances across all tutor accounts
        if (newNotVerifiedList.length === 0) {
            newNotVerifiedList.push('N/A');
        }

        if (newVerifiedList.length === 0) {
            newVerifiedList.push('N/A');
        }
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/VerifiedCourses`), newVerifiedList);
        set(ref(getDatabase(), `TutorAccounts/${userID}/NotVerifiedCourses`), newNotVerifiedList);

    }

    // This updates the rate of the tutor.
    static update_price(userID, newPrice) {
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/Price`), newPrice);

    }
    
    // This updates the bio of the tutor.
    static update_bio(userID, bio) {
        
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/Bio`), bio);

    }

    
    static update_preferred_days(userID, updatedValues) {

        const days = [
            {key:"Mon", value: false},
            {key:"Tue", value: false},
            {key:"Wed", value: false},
            {key:"Thu", value: false},
            {key:"Fri", value: false},
            {key:"Sat", value: false},
            {key:"Sun", value: false},
        ];
        for (let i = 0; i < updatedValues.length; i += 1) {
            days[updatedValues[i]].value = true;
        }
        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferredDays`), days);


    }

    static update_preferred_times(userID, updatedValues) {

        const times = [
            {key:"Morning", value: false},
            {key:"Afternoon", value: false},
            {key:"Evening", value: false},
        ];
        for (let i = 0; i < updatedValues.length; i += 1) {
            times[updatedValues[i]].value = true;
        }

        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferredTimings`), times);

    }

    static update_language(userID, language) {

        set(ref(getDatabase(), `TutorAccounts/${userID}/Language`), language);
    }

    // This function calculates the rating for the given tutor. Called everytime a review is created for that tutor.
    // If the number of reviews for a given tutor is less than 11, set the rating as 0. If equal to 11, then get the
    // rating from each review and find the average. If greater than 11, (current rating for tutor + rating from new review) / 2
    static async tutor_rating(userID) {
        
        
        const tutorData = this.get_information(userID);
        const data = await tutorData.then(val => {return val;});
        const reviews = data.ReviewsForTutor;
        let rating = data.Rating;
        const result = Object.keys(reviews).map((key) => reviews[key]);
        console.log(`The length is ${result.length}`);

        if (result.length > 3) {

            const reviewData =  Review.getReviewInformation(result[result.length - 1]);
            const info = await reviewData.then(val => {return val;});
            rating += parseFloat(info.Rating);
            rating /= 2;
            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), rating);
            
        }

        else if (result.length === 3 ) {

            
            let sum = 0.0;
            /* eslint-disable no-await-in-loop */
            for (let i = 1; i < result.length; i += 1) {
                const reviewData =  Review.getReviewInformation(result[i]);
                const info = await reviewData.then(val => {return val;});
                sum += parseFloat(info.Rating);
                console.log(sum);
                
            }
            /* eslint-disable no-await-in-loop */
            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), sum / (result.length - 1));
            
        }

        else {
            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), 0);
        }
    }

    static async update_badge_for_tutor(userID) {

        const tutorData = this.get_information(userID);
        const data = await tutorData.then(val => {return val;});
        const sessionsHosted = data.SessionsCompleted;

        if (sessionsHosted >= 100) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/5/value`), true);
        }

        else if (sessionsHosted >= 75) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/4/value`), true);
        }

        else if (sessionsHosted >= 50) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/3/value`), true);
        }

        else if (sessionsHosted >= 25) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/2/value`), true);
        }

        else if (sessionsHosted >= 10) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/1/value`), true);
        }

        else if (sessionsHosted >= 1) {
            await set(ref(getDatabase(), `TutorAccounts/${userID}/Badges/0/value`), true);
        }

        else {
            console.log('No badges earned yet!!!');
        }

    }


    // This gets the promise that contains the information about a particular tutor account.
    static async get_information(userID) {

        const db = getDatabase();
        const tutorRef = ref(db, `TutorAccounts/${userID}`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
        
    }

    static async get_all_tutor_accounts() {

        const db = getDatabase();
        const tutorRef = ref(db, `TutorAccounts`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
    }

    static async get_days(userID) {
        const db = getDatabase();
        const daysRef = ref(db, `TutorAccounts/${userID}/PreferredDays`);
        const snapshot = (await (get(daysRef))).toJSON();
        return Object.values(snapshot);
    }

    static async get_times(userID) {
        const db = getDatabase();
        const timesRef = ref(db, `TutorAccounts/${userID}/PreferredTimings`);
        const snapshot = (await (get(timesRef))).toJSON();
        console.log(snapshot)
        return Object.values(snapshot);
    }

    static async get_courses(userID) {
        const db = getDatabase();
        const nonVerifiedRef = ref(db, `TutorAccounts/${userID}/NotVerifiedCourses`);
        const nonVerSnap = (await (get(nonVerifiedRef))).toJSON();
        const nonVerified = Object.values(nonVerSnap);

        const verifiedRef = ref(db, `TutorAccounts/${userID}/VerifiedCourses`);
        const verifiedSnap = (await (get(verifiedRef))).toJSON();
        const verified = Object.values(verifiedSnap);

        const courses = []
        nonVerified.forEach(value => {
            const newCourse = {key: value, value: false}
            courses.push(newCourse)
        })
        verified.forEach(value => {
            const newCourse = {key: value, value: true}
            courses.push(newCourse)
        })

        console.log(courses)
        return courses;
    }
    
}


