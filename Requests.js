import { getDatabase, set, ref, remove} from "firebase/database";
import { Offers } from "./Offers";

export class Requests {

    constructor(requestID, time, date, description) {

        this.requestID = requestID;
        this.time = time;
        this.date = date;
        this.description = description;
        this.offers = ["N/A"];

        set(ref(getDatabase(), `Requests/${this.requestID}`), {

            Time: this.time,
            Date: this.date,
            Description: this.description,
            Offers: this.offers
        });
    }

    delete_request() {

        for (let i = 1; i < this.offers.length; i += 1) {
            Offers.cancel_offer(this.offers[i]);
        }
        
        remove(ref(getDatabase(), `Requests/${this.requestID}`))
    }

    add_offer_to_request(offerID, time, location, userID, tutorID) {

        const offer = new Offers(offerID, time, location, userID, tutorID);
        this.offers.push(offer.offerID);
        set(ref(getDatabase(), `Requests/${this.requestID}/Offers`), this.offers);
    }

    cancel_offer_for_request(offerID){
        Offers.cancel_offer(offerID);

        for (let i = 0; i < this.offers.length; i += 1) {

            if (this.offers[i] === offerID) {
                this.offers.splice(i, 1);
                console.log(this.offers.length);
                set(ref(getDatabase(), `Requests/${this.requestID}/Offers`), this.offers);
                return;

            }
        }

    }

    update_request(time, date, description) {
        set(ref(getDatabase(), `Requests/${this.requestID}/Date`), date);
        set(ref(getDatabase(), `Requests/${this.requestID}/Time`), time);
        set(ref(getDatabase(), `Requests/${this.requestID}/Description`), description);
        this.time = time;
        this.date = date;
        this.description = description;
    }
}