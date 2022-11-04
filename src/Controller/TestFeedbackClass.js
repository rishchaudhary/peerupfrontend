import {get, getDatabase, ref} from "firebase/database";
import {Feedback} from './Feedback'

export class TestFeedbackClass {

    constructor() {

        this.feedbackID = null;
    }

    async test_create_feedback(rating, content, userID, tutorID) {

        this.feedbackID = await Feedback.create_feedback(rating, content, userID, tutorID);
        console.log(this.feedbackID)
        const reviewData = Feedback.getFeedbackInformation(this.feedbackID);
        const data = await reviewData.then(val => {
            return val;
        });
        console.log(data);
    }

    async test_dispute_feedback(comment) {


        let feedbackData = Feedback.getFeedbackInformation(this.feedbackID);
        let data = await feedbackData.then(val => {
            return val;
        });
        let isDiputed = data.Disputed;
        let comments = data.WhyDisputed;
        console.log(`Before calling dispute_feedback() -- Disputed: ${isDiputed} and Why feedback is disputed: ${comments}`);

        Feedback.dispute_feedback(this.feedbackID, comment);
        feedbackData = Feedback.getFeedbackInformation(this.feedbackID);
        data = await feedbackData.then(val => {
            return val;
        });
        isDiputed = data.Disputed
        comments = data.WhyDisputed;
        console.log(`After calling dispute_feedback() -- Disputed: ${isDiputed} and Why feedback is disputed: ${comments}`)
    }

    async test_delete_feedback() {

        const user1 = this.feedbackID.split('/');
        console.log(user1)
        const data4 = TestFeedbackClass.list_of_feedback(user1[0]);
        const data3 = await data4.then(val => {
            return val;
        });

        await Feedback.delete_feedback(this.feedbackID);
        const user = this.feedbackID.split('/');
        const data = TestFeedbackClass.list_of_feedback(user[0]);
        const data1 = await data.then(val => {
            return val;
        });
        const data5 = Object.keys(data3);
        if (data1 === null) {
            console.log(`The list of feedbacks before deleting -- ${data5}`);
            console.log(`The deleted feedbackID is ${this.feedbackID}`)
            console.log(`The list of feedbacks are now empty`);
            return;
        }
        const data2 = Object.keys(data1);
        console.log(`The list of feedbacks before deleting -- ${data5}`);
        console.log(`The deleted feedbackID is ${this.feedbackID}`)
        console.log(`The list of feedbacks are -- ${data2}`);

    }

    static async list_of_feedback(userID) {

        const db = getDatabase();
        const feedbackRef = ref(db, `Feedback/${userID}`);
        const snapshot = (await (get(feedbackRef))).toJSON();
        return snapshot;
    }

}
