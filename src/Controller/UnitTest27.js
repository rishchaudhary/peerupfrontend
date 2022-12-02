import {getDatabase, ref, set} from "firebase/database";
import {User} from './User'
import {Tutor} from './Tutor'
import {Requests} from "./Requests";


export class UnitTest27 {

    static async testCase1() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [0,3,6], [1]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-1 -->')
        console.log('User wants to request help in CS180. There are 2 tutors for this course -- test11 and test12. ' +
            'Only test12 is verified for this course')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS180', 'PMU', 'In-person', 'TEST.TXT', ['course'], true, [0, 1, 2], 2);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const matched = data.MatchedTutors;
        const result = Object.keys(matched).map((key) => matched[key]);

        console.log('Expected output for matching --> match to the tutor verified in the course --> tutor test12')
        console.log(`Actual output for matching --> tutor ${result}`);

    }

    static async testCase2() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [0,3,6], [1]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-2 -->')
        console.log('User wants to request help in CS180 and wants the matching algorithm to sort on only the following' +
            'parameters --> day, time, language and finally course')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS180', 'PMU', 'In-person', 'TEST.TXT', ['day', 'time', 'language', 'course'], true, [0, 1, 2], 2);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const matched = data.MatchedTutors;
        const result = Object.keys(matched).map((key) => matched[key]);

        console.log('Expected output for matching --> tutor test12')
        console.log(`Actual output for matching --> tutor ${result}`);

    }

    static async testCase3() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [0,3,6], [1]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-3 -->')
        console.log('User wants to request help in CS380, a course which currently has no tutors')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS380', 'PMU', 'In-person', 'TEST.TXT', ['course'], true, [0, 1, 2], 2);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const matched = data.MatchedTutors;
        const result = Object.keys(matched).map((key) => matched[key]);

        console.log('Expected output for matching --> list of all tutors in the database --> tutors test12 and test11')
        console.log(`Actual output for matching --> tutors ${result}`);

    }

    static async testCase4() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [0,3,6], [0]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-4 -->')
        console.log('User wants to request help in CS180. He is only free to have a session with a tutor at 1pm for 1 hr' +
            'Thus, he wants to find tutors based on the preferredtime parameter')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS180', 'PMU', 'In-person', 'TEST.TXT', ['time'], true, [0, 1, 2], 2);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const matched = data.MatchedTutors;
        const result = Object.keys(matched).map((key) => matched[key]);

        console.log('Expected output for matching --> only tutor free during that time of day --> tutor test11')
        console.log(`Actual output for matching --> tutor ${result}`);

    }

    static async testCase5() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [1,3,6], [0]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-5 -->')
        console.log('User wants to request help in CS180. He is only free to have a session with a tutor on Thursday' +
            'Thus, he wants to find tutors based on the preferredday parameter')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS180', 'PMU', 'In-person', 'TEST.TXT', ['day'], true, [0, 1, 2], 2);
        const requestData = Requests.get_information(requestID);
        const data = await requestData.then(val => {return val;});
        const matched = data.MatchedTutors;
        const result = Object.keys(matched).map((key) => matched[key]);

        console.log('Expected output for matching --> only tutor free that day --> tutor test11')
        console.log(`Actual output for matching --> tutor ${result}`);

    }

    static async testCase6() {

        await User.create_account('test10', 'test10@gmail.com', 'John Doe', 'CS', 'Junior', [0,2,4], [0,1]);
        await User.create_account('test11', 'test11@gmail.com', 'Sam Jones', 'CS and DS', 'Senior', [0,1,4], [2]);
        await Tutor.create_profile('test11', 3.87, ['CS180'], [0,4,6], [1]);
        await User.create_account('test12', 'test11@gmail.com', 'User 234', 'CS and DS', 'Senior', [0,1,5], [2]);
        await Tutor.create_profile('test12', 3.07, ['CS180', 'CS240'], [1,3,6], [0]);
        await set(ref(getDatabase(), `TutorAccounts/test12/VerifiedCourses`), ['CS180']);
        await set(ref(getDatabase(), `TutorAccounts/test12/NotVerifiedCourses`), ['CS240']);

        console.log('Running scenario-6 -->')
        console.log('Tutor test12, has been matched to a student based on the matching algorithm. The tutor cannot meet with ' +
            'the student as the allotted time and wants to see if the student is available on a different day at a different time ')
        const requestID = await Requests.create_request('8:15am', '2 hrs', 'Wed, 16 Nov, 2022', 'Math Help', 'test10', 'CS180', 'PMU', 'In-person', 'TEST.TXT', ['course'], true, [0, 1, 2], 2);
        Requests.create_offer(requestID, 'test12', '1 pm', '1 hr', '16th May 2023', 'N/A', 'Online');
        const requestData = Requests.get_offer_info(requestID, 'test12');
        const data = await requestData.then(val => {return val;});
        console.log('Student proposed time -- 12pm, Student proposed date 17th May 2023' )
        console.log(`Offer made by tutor ...`);
        console.log(data);

    }



}
