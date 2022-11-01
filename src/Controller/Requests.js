import { getDatabase, get, set, ref} from "firebase/database";
import { Offers } from './Offers';
import { User } from './User'; 

export class Requests { 

    static async create_request(requestID, time, date, description, userID, course) {

        set(ref(getDatabase(), `Requests/${requestID}`), {

            Time: time,
            Date: date,
            Description: description,
            CreatedBy: userID,
            CourseWanted: course,
            Offers: ["N/A"]
        });

        const userData = User.get_information(userID);
        const data = await userData.then(val => {return val;});
        const requestData = data.Requests;
        const result = Object.keys(requestData).map((key) => requestData[key]);
        result.push(requestID);
        set(ref(getDatabase(), `Users/${userID}/Requests`), result);

    }

    static async delete_request(requestID) {

        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const requestinfo = data.Offers;
        let result = Object.keys(requestinfo).map((key) => requestinfo[key]);

        for (let i = 1; i < result.length; i += 1) {
            Requests.cancel_offer_for_request(result[i]);
        }

        const userData = User.get_information(data.CreatedBy);
        const user = await userData.then(val => {return val;});
        const userinfo = user.Requests;
        result = Object.keys(userinfo).map((key) => userinfo[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (requestID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `Users/${data.CreatedBy}/Requests`), result);
                break;
            }
        }
        
        set(ref(getDatabase(), `Requests/${requestID}`), null);
      
    }

    static async add_offer_to_request(requestID, offerID, time, location,tutorID) {

        Offers.create_offer(offerID, time, location,tutorID);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const requestinfo = data.Offers;
        const result = Object.keys(requestinfo).map((key) => requestinfo[key]);
        result.push(offerID);
        set(ref(getDatabase(), `Requests/${requestID}/Offers`), result);

    }

    static async cancel_offer_for_request(requestID, offerID){
       
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const requestinfo = data.Offers;
        const result = Object.keys(requestinfo).map((key) => requestinfo[key]);

        for (let i = 0; i < result.length; i += 1) {
            if (offerID === result[i]) {
                result.splice(i, 1);
                set(ref(getDatabase(), `Requests/${requestID}/Offers`), result);
                break;
            }
        }

        Offers.cancel_offer(offerID);

        
    }

    static update_time(requestID, time) {
        
        set(ref(getDatabase(), `Requests/${requestID}/Time`), time);
        
    }

    static update_date(requestID, date) {

        set(ref(getDatabase(), `Requests/${requestID}/Date`), date);
        
    }

    static update_description(requestID, description) {
        
        set(ref(getDatabase(), `Requests/${requestID}/Description`), description);
        
    }

    static update_course(requestID, course) {
        
        set(ref(getDatabase(), `Requests/${requestID}/Course`), course);
        
    }

    static async get_information(requestID) {

        const db = getDatabase();
        const requestRef = ref(db, `Requests/${requestID}`);
        const snapshot = (await (get(requestRef))).toJSON();
        return snapshot;
        
    }
       
}