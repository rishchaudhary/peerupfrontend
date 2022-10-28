import { getDatabase, set, ref, remove, get, child} from "firebase/database";
import { NewUser } from "./NewUser";
import { Offers } from "./Offers";

export class Requests {

    static create_request(requestID, time, date, description, userID) {

        set(ref(getDatabase(), `Requests/${requestID}`), {

            Time: time,
            Date: date,
            Description: description,
            CreatedBy: userID,
            Offers: ["N/A"]
        });

        const data = NewUser.getUserAccountInformation(userID).Requests;
        data.push(requestID);
        set(ref(getDatabase(), `Users/${userID}/requests`), data);

    }

    static delete_request(requestID) {

        const offers = this.getRequestInformation(requestID).Offers;

        for (let i = 1; i < offers.length; i += 1) {
            Offers.cancel_offer(offers[i]);
        }
        
        remove(ref(getDatabase(), `Requests/${this.requestID}`))

        const user = this.getRequestInformation(requestID);
        const requests = NewUser.getUserAccountInformation(user).Requests;

        for (let i = 0; i < requests.length(); i+= 1) {

            if (requestID === requests[i]) {
                requests.splice(i,1);
                set(ref(getDatabase(), `Users/${user}/requests`), requests);
                return;
            }
        }
    }

    static add_offer_to_request(requestID, offerID, time, location,tutorID) {

        Offers.create_offer(offerID, time, location,tutorID);
        const offers = this.getRequestInformation(requestID).Offers;
        offers.push(offerID);
        set(ref(getDatabase(), `Requests/${requestID}/Offers`), offers);
    }

    static cancel_offer_for_request(requestID, offerID){
       
        Offers.cancel_offer(offerID);
        const offers = this.getRequestInformation(requestID).Offers;

        for (let i = 0; i < offers.length; i += 1) {

            if (offers[i] === offerID) {
                offers.splice(i, 1);
                set(ref(getDatabase(), `Requests/${requestID}/Offers`), offers);
                return;

            }
        }

    }

    static update_request(requestID, time, date, description) {
        set(ref(getDatabase(), `Requests/${requestID}/Date`), date);
        set(ref(getDatabase(), `Requests/${requestID}/Time`), time);
        set(ref(getDatabase(), `Requests/${requestID}/Description`), description);
        
    }

    static getRequestInformation(requestID){

        get(child(ref(getDatabase()), `Requests/${requestID}`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }

    static getAllRequestInformation(){

        get(child(ref(getDatabase()), `Requests`)).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                return snapshot.val();
            }

        }).catch((error) => {
            return error;
        });
    }
       
}