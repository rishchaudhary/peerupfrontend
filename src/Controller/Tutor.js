import { getDatabase,set, remove, ref, get } from "firebase/database";
import { Review } from "./Review";
 
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
        
        set(ref(getDatabase(), `TutorAccounts/${userID}`), {
            Sessions: ["Session ID"],
            Requests: ["Request ID"],
            ReviewsForTutor: ["Review ID"],
            Feedback: ['Feedback ID'],
            VerifiedCourses: ["Course Name"],
            NotVerifiedCourses: courses,
            PreferredDays: days,
            PreferredTimings: times,
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

    // This function deletes a particular tutor's data from the database.
    // It sets the HasTutorAccount to false. Meaning that the given user does not have a tutor account
    static async delete_profile(userID) {
        
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
    
}


