import { getDatabase, get,ref, set } from "firebase/database";
import { Tutor } from "./Tutor";


export class Offers{

    static async create_offer(offerID, startTime,endTime, location, tutorID) {

        set(ref(getDatabase(), `Offers/${offerID}`), {
            StartTime: startTime,
            EndTime: endTime,
            Location: location,
            Tutor: tutorID
        },);

        const tutorData = Tutor.get_information(tutorID);
        const data = await tutorData.then(val => {return val;});
        const userinfo = data.Offers;
        const result = Object.keys(userinfo).map((key) => userinfo[key]);
        result.push(offerID);
        set(ref(getDatabase(), `TutorAccounts/${tutorID}/Offers`), result);
    
    }

    static async cancel_offer(offerID){

        const offerData = Offers.get_information(offerID);
        let data = await offerData.then(val => {return val;});
        const tutor = data.Tutor;
        
        const tutorData = Tutor.get_information(tutor);
        data = await tutorData.then(val => {return val;});
        const userinfo = data.Offers; 
        const result = Object.keys(userinfo).map((key) => userinfo[key]);
        console.log(`before  ${result}`);

        for (let i = 0; i < result.length; i += 1) {

            if (offerID === result[i]) {
                result.splice(i, 1);
                console.log(`after  ${result}`);
                set(ref(getDatabase(), `TutorAccounts/${tutor}/Offers`), result);
                break;
            }
        }

        set(ref(getDatabase(), `Offers/${offerID}`), null);

    }

    static async get_information(offerID) {

        const db = getDatabase();
        const offerRef = ref(db, `Offers/${offerID}`);
        const snapshot = (await (get(offerRef))).toJSON();
        return snapshot;
    }

}