import {getDatabase, ref, set} from "firebase/database";
import {Requests} from "./Requests";
import {User} from './User'
import {Tutor} from "./Tutor";


export class TestMatchingAlgorithmClass {

    static async create_settings_to_run_test() {
        await User.create_account('test7', 'avikatare@outloook.com', 'Sam Khan', 'CS', 'Freshman', [0, 4], [2]);
        await User.create_account('test8', 'avikatare@outloook.com', 'Sams Dan', 'CS', 'Junior', [0, 4], [2]);
        Tutor.create_profile('test8', 3.6, ['CS240'], [1], [1]);
        await set(ref(getDatabase(), `TutorAccounts/test8/VerifiedCourses`), ['Course Name', 'CS180']);
    }

    static async test_matching_algorithm() {

        const data = Tutor.get_information('test8');
        const data1 = await data.then(val => {
            return val;
        });
        const data2 = data1.Requests;
        const result = Object.keys(data2).map((key) => data2[key]);

        await Requests.create_request('1 pm', '2 hrs', '10 jan', 'CS help', 'test7', 'CS180', 'N/A', 'Online', 'request 127');

        const data3 = Tutor.get_information('test8');
        const data4 = await data3.then(val => {
            return val;
        });
        const data5 = data4.Requests;
        const result1 = Object.keys(data5).map((key) => data5[key]);

        console.log(`Requests for tutor before matching -- ${result}`);
        console.log(`Requests for tutor after matching -- ${result1}`);
    }
}
