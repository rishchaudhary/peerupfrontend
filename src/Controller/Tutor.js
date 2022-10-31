import { getDatabase,set, remove, ref, get } from "firebase/database";
import { Review } from "./Review";

export class Tutor {
    

    static create_profile(userID, price, courses) {

        set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), true);
        
        set(ref(getDatabase(), `TutorAccounts/${userID}`), {
        Sessions: ["Session ID"],
        Messages: ["Message ID"],
        Requests: ["Request ID"],
        Price: price,
        Offers: ['Offer ID'],
        Rating: 0,
        PreferredDays: [false, false, false, false, false],
        PreferredTimings: [false, false, false],
        RewiewsForTutor: ["Review ID"],
        VerifiedCourses: ["Course Name"],
        NotVerifiedCourses: courses},
        
        ).then(() => {
            return "Data Saved Successfully";
        })
        .catch((error) => {
            return error
        });

    }

    // needs to be edited
    static delete_profile(userID) {
        
        remove(ref(getDatabase(), `TutorAccounts/${userID}`))

        .then(() => {

            set(ref(getDatabase(), `Users/${userID}/HasTutorAccount`), false);
            return "Data Deleted Successfully";
        })
        .catch((error) => {
            return error;
        });

    }

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

    
    static update_by_admin(userID, newVerifiedList, newNotVerifiedList) {
         
        if (newNotVerifiedList.length === 0) {
            newNotVerifiedList.push('N/A');
        }

        if (newVerifiedList.length === 0) {
            newVerifiedList.push('N/A');
        }
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/VerifiedCourses`), newVerifiedList);
        set(ref(getDatabase(), `TutorAccounts/${userID}/NotVerifiedCourses`), newNotVerifiedList);

    }

    static update_price(userID, newPrice) {
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/Price`), newPrice);

    }
    
    static update_bio(userID, bio) {
        
        
        set(ref(getDatabase(), `TutorAccounts/${userID}/Bio`), bio);

    }

    static update_preferred_days(userID, updatedValue, index) {

        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferredDays/${index}`), updatedValue);
        
    }

    static update_preferred_times(userID, updatedValue, index) {

        set(ref(getDatabase(), `TutorAccounts/${userID}/PreferredTimings/${index}`), updatedValue);
        
    }

    static async tutor_rating(userID) {
        
        
        const tutorData = this.getInformation(userID);
        const data = await tutorData.then(val => {return val;});
        const reviews = data.RewiewsForTutor;
        let rating = data.Rating;
        const result = Object.keys(reviews).map((key) => reviews[key]);

        if (result.length > 11) {

            const reviewData =  Review.getReviewInformation(reviews[result.length - 1]);
            const info = await reviewData.then(val => {return val;});
            rating += parseFloat(info.Rating);
            rating /= 2;
            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), rating / (result.length - 1));
            
        }

        else if (result.length === 11 ) {

            
            let sum = 0.0;
            /* eslint-disable no-await-in-loop */
            for (let i = 1; i < result.length; i += 1) {
                const reviewData =  Review.getReviewInformation(reviews[i]);
                const info = await reviewData.then(val => {return val;});
                sum += parseFloat(info.Rating);
                
            }
            /* eslint-disable no-await-in-loop */
            set(ref(getDatabase(), `TutorAccounts/${userID}/Rating`), sum / (result.length - 1));
            
        }

        else {
            console.log("Not enough reviews")
        }
    }


    static async get_information(userID) {

        const db = getDatabase();
        const tutorRef = ref(db, `TutorAccounts/${userID}`);
        const snapshot = (await (get(tutorRef))).toJSON();
        return snapshot;
        
    }
    
}


